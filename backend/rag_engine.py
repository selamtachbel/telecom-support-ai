import os
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import FastEmbedEmbeddings
from langchain_ollama import OllamaLLM

# Folder to store ChromaDB vector databases locally
CHROMA_PATH = "chroma_db"

# Initialize local embedding model & LLM
embeddings = FastEmbedEmbeddings()
llm = OllamaLLM(model="llama3")

def get_vector_store():
    """Returns or creates the local ChromaDB vector store."""
    return Chroma(
        persist_directory=CHROMA_PATH,
        embedding_function=embeddings
    )

def ingest_document_text(text: str, filename: str, category: str):
    """
    Chunks document text and inserts embeddings into ChromaDB.
    """
    # 1. Chunk the text into manageable pieces
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )
    chunks = text_splitter.create_documents(
        texts=[text],
        metadatas=[{"source": filename, "category": category}]
    )

    # 2. Store chunks into ChromaDB
    vector_store = get_vector_store()
    vector_store.add_documents(chunks)
    return len(chunks)

def query_rag(question: str):
    """
    Retrieves context from ChromaDB and generates an answer using Llama 3.
    """
    vector_store = get_vector_store()

    # 1. Retrieve top 3 relevant chunks
    docs_and_scores = vector_store.similarity_search_with_relevance_scores(question, k=3)
    
    if not docs_and_scores or docs_and_scores[0][1] < 0.2:
        return {
            "answer": "Sorry, I couldn't find relevant operational documentation for your request.",
            "source": None,
            "confidence": 0,
            "found": False
        }

    # 2. Extract retrieved text context and metadata
    context_text = "\n\n---\n\n".join([doc.page_content for doc, _ in docs_and_scores])
    sources = list(set([doc.metadata.get("source", "Unknown") for doc, _ in docs_and_scores]))
    top_score = round(docs_and_scores[0][1] * 100, 2)

    # 3. Create RAG Prompt
    prompt = f"""
    You are an AI Telecom Support Assistant. Use ONLY the provided context below to answer the question.
    If you do not know the answer based on the context, state that you do not know.

    Context:
    {context_text}

    Question: {question}

    Answer concisely with actionable troubleshooting steps:
    """

    # 4. Generate answer with Ollama
    answer = llm.invoke(prompt)

    return {
        "answer": answer,
        "source": ", ".join(sources),
        "confidence": top_score,
        "found": True
    }