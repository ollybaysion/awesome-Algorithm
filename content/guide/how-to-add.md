---
title: "토픽 추가 가이드"
tags: [guide, contributing]
---

# 토픽 추가 가이드

이 가이드는 새로운 알고리즘 토픽을 추가하는 방법을 설명합니다.

---

## 1. 디렉토리 구조

```
content/
├── 01-data-structures/
│   ├── _subject.json         ← 과목 메타데이터 (선택)
│   ├── 01-linear/
│   │   ├── _chapter.json     ← 챕터 메타데이터 (선택)
│   │   ├── 01-array.md
│   │   └── 02-linked-list.md
│   └── 02-nonlinear/
│       └── ...
└── ...
```

---

## 2. 마크다운 파일 형식

각 토픽 파일은 **YAML Front Matter**로 시작해야 합니다:

```markdown
---
title: "알고리즘 이름"
tags: [tag1, tag2, tag3]
---

# 알고리즘 이름

내용을 여기에 작성합니다.
```

---

## 3. manifest.json 자동 갱신

콘텐츠를 `main` 브랜치에 push하면 **GitHub Actions**가 자동으로:

1. `scripts/generate_manifest.py` 실행
2. `manifest.json` 갱신 후 커밋
3. GitHub Pages에 배포

---

## 4. 수동으로 manifest 갱신

로컬에서 직접 실행할 수도 있습니다:

```bash
python scripts/generate_manifest.py
```

---

## 5. 작성 팁

- **코드 블록**에는 언어를 명시하세요 (python, java, cpp 등)
- **mermaid** 코드 블록으로 다이어그램을 그릴 수 있습니다
- **표**를 활용해 복잡도 비교를 정리하세요
- 개념 설명 → 코드 구현 → 시간/공간 복잡도 → 연습 문제 순으로 작성하면 좋습니다
