import os
from groq import Groq
from services.embeddings import get_query_vector
from services.pinecone_service import search_similar_vectors

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def extract_last_project_query(history: list[str]) -> str:
    for message in reversed(history):
        if message["role"] == "user" and not any(k in message["content"].lower() for k in ["faculty", "mentor", "guide", "email", "cabin", "professor"]):
            return message["content"]
    return ""

def generate_response(query: str, conversation_history: list):
    project_context = extract_last_project_query(conversation_history)
    reconstructed_query = f"{project_context}. {query}" if project_context else query

    vector = get_query_vector(reconstructed_query)
    results = search_similar_vectors(vector)

    matches = results.get("matches", [])
    if not matches:
        return "Sorry, I couldn't find any matching faculty."

    top_match = matches[0]["metadata"]

    context = (
        f"Faculty: {top_match['name']} ({top_match['designation']})\n"
        f"Department: {top_match['department']}\n"
        f"Research Interest: {top_match['research_interest']}\n"
        f"Paper Title: {top_match['title']}\n"
        f"Cabin Location: {top_match['cabin']}\n"
        f"Email: {top_match['email']}\n"
    )

    system_prompt = {
        "role": "system",
        "content": """
You are a faculty assistant agent at VNR VJIET.

Based on the student's query and the most relevant faculty metadata, do ONE of the following:
- If the user asked *only for email*, just reply with the email.
- If the user asked for *cabin*, respond only with location.
- If they asked for *name*, *designation*, or general guidance, give a brief full response (name, dept, location, email). Also include their relevant research work and papers.

Never return multiple faculty. Only give the top relevant one.
Keep the response minimal and direct. No hallucinations.
        """
    }

    user_message = {
        "role": "user",
        "content": f"""
Student's Query: "{query}"

Reconstructed Query (for context): "{reconstructed_query}"

Relevant Faculty:
{context}
        """
    }

    response = groq_client.chat.completions.create(
        model="llama3-70b-8192",
        messages=[system_prompt, *conversation_history[-3:], user_message]
    )

    return response.choices[0].message.content.strip()
