import os
from markdown_pdf import MarkdownPdf, Section

md_file_path = r"C:\Users\Hp\.gemini\antigravity\brain\e8beb33d-0675-4715-a82c-8bb891de7d2a\thesis_presentation_guide.md"
pdf_file_path = r"d:\FYP VIDEO DETECTION(2026)\deepfake-detection-api-main\Thesis_Presentation_Guide.pdf"

if os.path.exists(md_file_path):
    with open(md_file_path, "r", encoding="utf-8") as f:
        md_content = f.read()
    
    # Simple replacement to make mermaid blocks just standard code blocks for PDF rendering
    # since markdown-pdf doesn't natively render mermaid diagrams.
    md_content = md_content.replace("```mermaid", "```text")
    
    pdf = MarkdownPdf(toc_level=2)
    pdf.add_section(Section(md_content))
    pdf.save(pdf_file_path)
    print(f"Successfully generated PDF: {pdf_file_path}")
else:
    print(f"Error: Could not find markdown file at {md_file_path}")
