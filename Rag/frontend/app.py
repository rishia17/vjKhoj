import streamlit as st
import requests

st.set_page_config(page_title="VJ KHOJ - Chat Assistant", page_icon="🤖", layout="wide")

st.title("🤖 VJ KHOJ - Smart Chat Assistant")

# Chat history
if "messages" not in st.session_state:
    st.session_state.messages = []

# Display previous chat
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

# User input
user_input = st.chat_input("Ask me anything about your project idea or guidance...")

if user_input:
    st.session_state.messages.append({"role": "user", "content": user_input})
    with st.chat_message("user"):
        st.markdown(user_input)

    # Send to FastAPI backend
    with st.chat_message("assistant"):
        with st.spinner("Thinking..."):
            try:
                res = requests.post("http://localhost:8000/chat", json={"message": user_input})
                res.raise_for_status()
                answer = res.json()["response"]
            except Exception as e:
                answer = f"⚠️ Failed to get response: {str(e)}"

            st.markdown(answer)
            st.session_state.messages.append({"role": "assistant", "content": answer})
