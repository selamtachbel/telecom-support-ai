from pathlib import Path
import shutil

from pypdf import PdfReader

from rag_engine import ingest_document_text


SOURCE_DIR = Path("rag_sources")
CHROMA_DIR = Path("chroma_db")

TXT_FILE = SOURCE_DIR / "Broadband_Fiber_Troubleshooting_Guide.txt"
PDF_FILE = SOURCE_DIR / "Citation_Test_Page1.pdf"


def main():
    # Start with a clean vector database
    if CHROMA_DIR.exists():
        shutil.rmtree(CHROMA_DIR)

    # 1. Add troubleshooting TXT document
    if not TXT_FILE.exists():
        raise FileNotFoundError(f"Missing file: {TXT_FILE}")

    txt_text = TXT_FILE.read_text(
        encoding="utf-8",
        errors="replace"
    )

    ingest_document_text(
        text=txt_text,
        filename=TXT_FILE.name,
        category="Broadband & Fiber",
    )

    print(f"Seeded: {TXT_FILE.name}")

    # 2. Add citation PDF
    if not PDF_FILE.exists():
        raise FileNotFoundError(f"Missing file: {PDF_FILE}")

    reader = PdfReader(str(PDF_FILE))

    pdf_text = "\n".join(
        page.extract_text() or ""
        for page in reader.pages
    )

    if not pdf_text.strip():
        raise ValueError(
            f"No readable text was found in {PDF_FILE.name}"
        )

    ingest_document_text(
        text=pdf_text,
        filename=PDF_FILE.name,
        category="Broadband & Fiber",
    )

    print(f"Seeded: {PDF_FILE.name}")
    print("RAG knowledge seeded successfully.")


if __name__ == "__main__":
    main()