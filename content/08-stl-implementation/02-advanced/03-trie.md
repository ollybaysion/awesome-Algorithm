---
title: "트라이 (Trie) 구현"
tags: [trie, prefix-tree, string, no-stl]
---

# 트라이 (Trie)

## 개념

문자열 집합을 **접두사 트리** 형태로 저장.
각 노드가 문자 하나를 대표하며, 루트→리프 경로가 하나의 문자열.

---

## 기본 구현 (C++)

```cpp
struct Trie {
    static const int MAXN = 3000005;  // 총 노드 수 = 총 문자 수 상한
    int  ch[MAXN][26];   // ch[node][c] = 다음 노드
    bool end_[MAXN];     // 단어 끝 여부
    int  sz;             // 현재 노드 수

    void init() {
        sz = 1;  // 루트 = 0
        for (int i = 0; i < 26; i++) ch[0][i] = 0;
        end_[0] = false;
    }

    int new_node() {
        for (int i = 0; i < 26; i++) ch[sz][i] = 0;
        end_[sz] = false;
        return sz++;
    }

    void insert(const char* s) {
        int cur = 0;
        for (int i = 0; s[i]; i++) {
            int c = s[i] - 'a';
            if (!ch[cur][c]) ch[cur][c] = new_node();
            cur = ch[cur][c];
        }
        end_[cur] = true;
    }

    bool search(const char* s) {
        int cur = 0;
        for (int i = 0; s[i]; i++) {
            int c = s[i] - 'a';
            if (!ch[cur][c]) return false;
            cur = ch[cur][c];
        }
        return end_[cur];
    }

    bool starts_with(const char* prefix) {
        int cur = 0;
        for (int i = 0; prefix[i]; i++) {
            int c = prefix[i] - 'a';
            if (!ch[cur][c]) return false;
            cur = ch[cur][c];
        }
        return true;
    }
} trie;
```

---

## XOR 트라이 (비트 트라이)

**최대 XOR 쌍 찾기**에 사용. 각 노드가 비트(0/1) 하나를 대표.

```cpp
struct XorTrie {
    static const int MAXN = 6000005;  // 수 * 30비트
    int ch[MAXN][2];
    int sz;

    void init() { sz = 1; ch[0][0] = ch[0][1] = 0; }

    int new_node() {
        ch[sz][0] = ch[sz][1] = 0;
        return sz++;
    }

    void insert(int x) {
        int cur = 0;
        for (int b = 29; b >= 0; b--) {
            int bit = (x >> b) & 1;
            if (!ch[cur][bit]) ch[cur][bit] = new_node();
            cur = ch[cur][bit];
        }
    }

    // x와 XOR했을 때 최댓값 반환
    int max_xor(int x) {
        int cur = 0, result = 0;
        for (int b = 29; b >= 0; b--) {
            int bit = (x >> b) & 1;
            int want = 1 - bit;  // 반대 비트 선택 시 XOR = 1
            if (ch[cur][want]) {
                cur = ch[cur][want];
                result |= (1 << b);
            } else {
                cur = ch[cur][bit];
            }
        }
        return result;
    }
} xor_trie;
```

---

## 아호-코라식 빌드용 트라이

```cpp
// Aho-Corasick 전처리용 — 09-platinum에서 상세 설명
struct ACTrie {
    int ch[MAXN][26], fail[MAXN], out[MAXN];
    int sz;
    // ... (다음 챕터 참고)
};
```

---

## 시간 복잡도

| 연산 | 복잡도 |
|------|--------|
| insert | O(L) — L: 문자열 길이 |
| search | O(L) |
| 메모리 | O(N × Σ) — Σ: 알파벳 크기 |

---

## 연습 문제

- BOJ 5052 - 전화번호 목록
- BOJ 14425 - 문자열 집합
- BOJ 13505 - 두 수 XOR (XOR 트라이)
- BOJ 9202 - Boggle (트라이 + DFS)
