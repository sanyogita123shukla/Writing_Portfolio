"""Extract text from Aurora to Starry Nights PDF (OCR fallback for scanned pages)."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

PDF = Path(r"C:\Users\sanyo\OneDrive\Desktop\Aurora-to-Starry-Nights_Final_BOOK.pdf")
OUT_RAW = Path(__file__).parent / "aurora-poems-raw.txt"
OUT_JSON = Path(__file__).parent / "aurora-poems.json"
LOG = Path(__file__).parent / "aurora-extract.log"


def log(msg: str) -> None:
    LOG.write_text(LOG.read_text(encoding="utf-8") + msg + "\n" if LOG.exists() else msg + "\n", encoding="utf-8")
    print(msg)


def extract_with_pdfplumber() -> str:
    import pdfplumber

    parts: list[str] = []
    with pdfplumber.open(PDF) as pdf:
        for page in pdf.pages:
            parts.append(page.extract_text() or "")
    return "\n\n".join(parts).strip()


def extract_with_pypdf() -> str:
    from pypdf import PdfReader

    parts: list[str] = []
    reader = PdfReader(str(PDF))
    for page in reader.pages:
        parts.append(page.extract_text() or "")
    return "\n\n".join(parts).strip()


def extract_with_ocr() -> str:
    import pytesseract
    from pdf2image import convert_from_path

    parts: list[str] = []
    images = convert_from_path(str(PDF), dpi=200)
    for i, image in enumerate(images, start=1):
        text = pytesseract.image_to_string(image)
        parts.append(f"--- Page {i} ---\n{text.strip()}")
    return "\n\n".join(parts).strip()


def slugify(value: str) -> str:
    value = value.lower().strip()
    value = re.sub(r"[^a-z0-9\s-]", "", value)
    value = re.sub(r"\s+", "-", value)
    return value[:60] or "poem"


def is_title_line(line: str) -> bool:
    stripped = line.strip()
    if not stripped or len(stripped) > 80:
        return False
    if stripped.isupper() and len(stripped.split()) <= 10:
        return True
    if re.match(r"^(Chapter|Part|Section)\s+\d+", stripped, re.I):
        return True
    # Title case short line without ending punctuation
    words = stripped.split()
    if len(words) <= 8 and not stripped.endswith((".", "!", "?", ",", ";", ":")):
        title_like = sum(1 for w in words if w[:1].isupper()) >= max(1, len(words) // 2)
        return title_like
    return False


def parse_poems(raw: str) -> list[dict]:
    lines = [ln.rstrip() for ln in raw.splitlines()]
    poems: list[dict] = []
    current_title = "Untitled"
    current_lines: list[str] = []

    def flush() -> None:
        nonlocal current_title, current_lines
        body = "\n".join(current_lines).strip()
        if body:
            poems.append(
                {
                    "id": slugify(current_title) + (f"-{len(poems)+1}" if poems else ""),
                    "title": current_title,
                    "content": body,
                }
            )
        current_lines = []

    i = 0
    while i < len(lines):
        line = lines[i]
        if line.startswith("--- Page ") or not line.strip():
            i += 1
            continue

        # Look ahead: title followed by body
        if is_title_line(line):
            next_non_empty = next((lines[j] for j in range(i + 1, len(lines)) if lines[j].strip()), "")
            if next_non_empty and not is_title_line(next_non_empty):
                flush()
                current_title = line.strip()
                i += 1
                continue

        current_lines.append(line)
        i += 1

    flush()

    # If parsing produced one giant block, split by double blank lines with short first line as title
    if len(poems) <= 1 and raw.strip():
        blocks = re.split(r"\n\s*\n", raw)
        alt: list[dict] = []
        for idx, block in enumerate(blocks):
            block = block.strip()
            if not block or block.startswith("--- Page"):
                continue
            block_lines = block.splitlines()
            title = block_lines[0].strip()
            body_lines = block_lines[1:]
            if body_lines and len(title) <= 80:
                alt.append(
                    {
                        "id": slugify(title) + f"-{idx+1}",
                        "title": title,
                        "content": "\n".join(body_lines).strip() or title,
                    }
                )
            else:
                alt.append(
                    {
                        "id": f"poem-{idx+1}",
                        "title": f"Poem {idx + 1}",
                        "content": block,
                    }
                )
        if len(alt) > 1:
            poems = alt

    return poems


def main() -> int:
    if not PDF.exists():
        log(f"PDF not found: {PDF}")
        return 1

    raw = ""
    method = "none"
    for name, fn in [
        ("pdfplumber", extract_with_pdfplumber),
        ("pypdf", extract_with_pypdf),
        ("ocr", extract_with_ocr),
    ]:
        try:
            log(f"Trying {name}...")
            raw = fn()
            if len(raw.replace("-", "").strip()) > 100:
                method = name
                log(f"Success with {name}: {len(raw)} chars")
                break
        except Exception as exc:
            log(f"{name} failed: {exc}")

    OUT_RAW.write_text(raw, encoding="utf-8")
    poems = parse_poems(raw)
    OUT_JSON.write_text(json.dumps(poems, ensure_ascii=False, indent=2), encoding="utf-8")
    log(f"Wrote {len(poems)} poems via {method}")
    return 0 if poems else 2


if __name__ == "__main__":
    sys.exit(main())
