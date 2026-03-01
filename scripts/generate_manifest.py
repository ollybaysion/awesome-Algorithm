"""
generate_manifest.py
content/ 디렉토리를 스캔해 manifest.json을 자동 생성합니다.

사용법:
    python scripts/generate_manifest.py
"""
import os
import json
import re

CONTENT_DIR = "content"
OUTPUT_FILE = "manifest.json"

DEFAULT_COLORS = [
    "#7c3aed", "#2563eb", "#0891b2",
    "#059669", "#d97706", "#dc2626", "#db2777"
]

SUBJECT_ICONS = {
    "data-structures": "🗂️",
    "sorting":         "🔢",
    "searching":       "🔍",
    "dynamic-programming": "📐",
    "greedy":          "💡",
    "graph":           "🕸️",
    "string":          "🔤",
}

def slug_to_title(slug: str) -> str:
    """'01-data-structures' → 'Data Structures'"""
    # 숫자 접두사 제거
    slug = re.sub(r"^\d+-", "", slug)
    return slug.replace("-", " ").title()

def parse_front_matter(content: str) -> dict:
    meta = {}
    if not content.startswith("---"):
        return meta
    end = content.find("---", 3)
    if end == -1:
        return meta
    front = content[3:end]
    for line in front.splitlines():
        if ":" in line:
            key, _, val = line.partition(":")
            key = key.strip()
            val = val.strip().strip('"').strip("'")
            if key == "tags":
                val = re.sub(r"[\[\]]", "", val)
                meta["tags"] = [t.strip() for t in val.split(",") if t.strip()]
            else:
                meta[key] = val
    return meta

def get_icon_for_subject(subject_slug: str) -> str:
    for key, icon in SUBJECT_ICONS.items():
        if key in subject_slug:
            return icon
    return "📂"

def build_manifest():
    subjects = []
    color_idx = 0

    # content/ 아래 숫자로 시작하는 폴더 = 과목
    for subj_dir in sorted(os.listdir(CONTENT_DIR)):
        subj_path = os.path.join(CONTENT_DIR, subj_dir)
        if not os.path.isdir(subj_path) or not re.match(r"^\d+", subj_dir):
            continue

        # _subject.json 읽기 (있으면)
        subj_meta_path = os.path.join(subj_path, "_subject.json")
        subj_meta = {}
        if os.path.exists(subj_meta_path):
            with open(subj_meta_path, encoding="utf-8") as f:
                subj_meta = json.load(f)

        subj_id    = re.sub(r"^\d+-", "", subj_dir)
        subj_title = subj_meta.get("title", slug_to_title(subj_dir))
        subj_icon  = subj_meta.get("icon",  get_icon_for_subject(subj_dir))
        subj_desc  = subj_meta.get("description", "")
        subj_color = subj_meta.get("color", DEFAULT_COLORS[color_idx % len(DEFAULT_COLORS)])
        color_idx += 1

        chapters = []
        for chap_dir in sorted(os.listdir(subj_path)):
            chap_path = os.path.join(subj_path, chap_dir)
            if not os.path.isdir(chap_path) or not re.match(r"^\d+", chap_dir):
                continue

            # _chapter.json 읽기 (있으면)
            chap_meta_path = os.path.join(chap_path, "_chapter.json")
            chap_meta = {}
            if os.path.exists(chap_meta_path):
                with open(chap_meta_path, encoding="utf-8") as f:
                    chap_meta = json.load(f)

            chap_id    = re.sub(r"^\d+-", "", chap_dir)
            chap_title = chap_meta.get("title", slug_to_title(chap_dir))

            topics = []
            for fname in sorted(os.listdir(chap_path)):
                if not fname.endswith(".md"):
                    continue
                fpath = os.path.join(chap_path, fname)
                with open(fpath, encoding="utf-8") as f:
                    raw = f.read()

                meta = parse_front_matter(raw)
                topic_id    = re.sub(r"^\d+-", "", fname[:-3])  # 확장자 제거
                topic_title = meta.get("title", slug_to_title(fname[:-3]))
                topic_tags  = meta.get("tags", [])
                topics.append({
                    "id":    topic_id,
                    "title": topic_title,
                    "tags":  topic_tags
                })

            if topics:
                chapters.append({
                    "id":     chap_id,
                    "title":  chap_title,
                    "topics": topics
                })

        if chapters:
            subjects.append({
                "id":          subj_id,
                "title":       subj_title,
                "icon":        subj_icon,
                "description": subj_desc,
                "color":       subj_color,
                "chapters":    chapters
            })

    manifest = {"subjects": subjects}
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

    total_topics = sum(
        len(ch["topics"])
        for s in subjects
        for ch in s["chapters"]
    )
    print(f"✅ manifest.json 생성 완료")
    print(f"   과목: {len(subjects)}개  |  토픽: {total_topics}개")

if __name__ == "__main__":
    build_manifest()
