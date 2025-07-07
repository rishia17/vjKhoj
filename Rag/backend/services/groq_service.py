import os
from groq import Groq
from services.query_faculty import generate_response

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

conversation_history = [
    {
        "role": "system",
        "content": """
You are a helpful assistant named *KhojBot*, designed to help students at VNR VJIET with their project ideas.

Focus only on:
1. Discussing and refining project ideas.
2. Recommending tech stacks, datasets, APIs.

Avoid chit-chat. Stay strictly academic and project-focused. No hallucinations.
        """
    }
]

def generate_chat_response(query: str):
    # 1. Classify intent
    intent_check_history = [
    {
        "role": "system",
        "content": """
You are an intent classifier for a student assistant.

Your task is to classify the user's **current query** using the **entire conversation history for context**.

Classify the intent as one of the following:
- FACULTY_INTENT → if the user is asking about guides, professors, mentors, or faculty-related details (email, location, who can guide, etc.)
- GENERAL_INTENT → if the user is asking about project ideas, tech stack, datasets, APIs, or implementation-related queries

Always use the conversation history to resolve references like "this", "that", or "our project". Do NOT guess.

Respond with ONLY one of these two labels: FACULTY_INTENT or GENERAL_INTENT.
"""
    },
    {
        "role": "user",
        "content": f"""
QUERY:
{query}

CONVERSATION_HISTORY:
{str(conversation_history)}
"""
    }
]

    intent_response = groq_client.chat.completions.create(
        model="llama3-70b-8192",
        messages=intent_check_history
    )
    intent = intent_response.choices[0].message.content.strip()

    # 2. Extract last project title
    title_extraction_prompt = [
        {
            "role": "system",
            "content": """
You are a project title extractor.

From the current user query and the conversation history, extract the most relevant project title.
Prefer any clearly mentioned project or topic in the CURRENT query itself.
If no project is found, return "NONE".
Respond ONLY with the project title.
"""
        },
        {
            "role": "user", 
            "content": f"QUERY: {query}\n\nHISTORY: {str(conversation_history)}"
        }
    ]

    title_response = groq_client.chat.completions.create(
        model="llama3-70b-8192",
        messages=title_extraction_prompt
    )
    last_project_title = title_response.choices[0].message.content.strip()

    # 3. Add query after extraction to avoid context leak
    conversation_history.append({"role": "user", "content": query})

    # 4. Intent-based handling
    if intent == "FACULTY_INTENT":
        try:
            faculty_response = generate_response(query, conversation_history, last_project_title)
            conversation_history.append({"role": "assistant", "content": faculty_response})
            return faculty_response
        except Exception as e:
            return f"Exception during faculty match: {str(e)}"
    else:  # GENERAL_INTENT
        general_response = groq_client.chat.completions.create(
            model="llama3-70b-8192",
            messages=conversation_history
        )
        reply = general_response.choices[0].message.content.strip()
        conversation_history.append({"role": "assistant", "content": reply})
        return reply
