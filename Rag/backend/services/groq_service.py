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
    # 1. Use separate short intent classifier prompt
    intent_check_history = [
        {
            "role": "system",
            "content": """
You are an intent classifier.

If the question is about identifying a guide, faculty, professor, mentor, or details like email/location of faculty, respond ONLY with: FACULTY_INTENT

If it's general (e.g., tech stack, refining ideas, datasets), respond ONLY with: GENERAL_INTENT
"""
        },
        {"role": "user", "content": query}
    ]

    intent_response = groq_client.chat.completions.create(
        model="llama3-70b-8192",
        messages=intent_check_history
    )

    intent = intent_response.choices[0].message.content.strip()

    # 2. Delegate based on intent
    if intent == "FACULTY_INTENT":
        try:
            faculty_response = generate_response(query, conversation_history)
            conversation_history.append({"role": "user", "content": query})
            conversation_history.append({"role": "assistant", "content": faculty_response})
            return faculty_response
        except Exception as e:
            return f"Exception during faculty match: {str(e)}"

    else:  # GENERAL_INTENT
        conversation_history.append({"role": "user", "content": query})
        general_response = groq_client.chat.completions.create(
            model="llama3-70b-8192",
            messages=conversation_history
        )
        reply = general_response.choices[0].message.content.strip()
        conversation_history.append({"role": "assistant", "content": reply})
        return reply
