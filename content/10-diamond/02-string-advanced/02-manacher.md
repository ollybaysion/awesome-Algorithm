---
title: "Manacher 알고리즘"
tags: [manacher, palindrome, string, diamond]
---

# Manacher 알고리즘

## 개념

문자열의 **모든 위치에서 가장 긴 팰린드롬 반지름** 배열 P[]를 O(n)에 계산.

---

## 구현

홀수 길이와 짝수 길이 팰린드롬을 동시에 처리하기 위해
**구분자 삽입**: `abba` → `#a#b#b#a#`

```cpp
const int MAXN = 2000005;
char t[MAXN];  // 변환된 문자열
int  p[MAXN];  // 반지름 (0-based, t 기준)
int  tn;       // 변환 문자열 길이

// s → t 변환 후 Manacher
void manacher(const char* s, int sn) {
    // 변환: s = "abba" → t = "^#a#b#b#a#$"
    // ^ 와 $ 는 경계 초과 방지용 sentinel
    t[0] = '^'; t[1] = '#';
    for (int i = 0; i < sn; i++) {
        t[2*i+2] = s[i];
        t[2*i+3] = '#';
    }
    tn = 2*sn + 2;
    t[tn++] = '$';

    int c = 0, r = 0;  // 가장 오른쪽 팰린드롬의 중심 c, 오른쪽 끝 r
    for (int i = 1; i < tn - 1; i++) {
        int mirror = 2*c - i;
        p[i] = (i < r) ? min(r - i, p[mirror]) : 0;

        // 중심 i에서 확장
        while (t[i + p[i] + 1] == t[i - p[i] - 1])
            p[i]++;

        // 오른쪽 끝 갱신
        if (i + p[i] > r) { c = i; r = i + p[i]; }
    }
}

// 원래 문자열 인덱스 i를 중심으로 하는 최장 팰린드롬 길이
// 홀수 길이: p[2*i+2] (t 인덱스)
// 짝수 길이: p[2*i+3] (i와 i+1 사이의 #)
int longest_odd_palindrome(int i)  { return p[2*i+2]; }
int longest_even_palindrome(int i) { return p[2*i+3]; }
```

---

## 전체 최장 팰린드롬 부분문자열

```cpp
int longest_palindrome(const char* s, int n) {
    manacher(s, n);
    int res = 0;
    for (int i = 1; i < tn - 1; i++)
        res = max(res, p[i]);
    return res;  // t 기준 반지름 = 원래 문자열 길이
}
```

---

## 팰린드롬 개수 세기

```cpp
// 중심이 i인 팰린드롬 수 = (p[i] + 1) / 2
// 전체 팰린드롬 부분문자열 수 (중복 포함)
long long count_palindromes(const char* s, int n) {
    manacher(s, n);
    long long cnt = 0;
    for (int i = 1; i < tn - 1; i++)
        cnt += (p[i] + 1) / 2;
    return cnt;
}
```

---

## Eertree (Palindromic Tree) — 선택 심화

고유한 팰린드롬 부분문자열의 개수 = O(n)개.
각 고유 팰린드롬을 노드로 하는 트리.

```cpp
struct EerTree {
    struct Node {
        int len, suf_link;
        int ch[26];
    };
    Node nodes[MAXN];
    int  last, sz;
    char s[MAXN];
    int  sn;

    void init() {
        // 노드 0: 허상 루트 (len = -1)
        // 노드 1: 빈 팰린드롬 루트 (len = 0)
        nodes[0].len = -1; nodes[0].suf_link = 0;
        nodes[1].len =  0; nodes[1].suf_link = 0;
        memset(nodes[0].ch, 0, sizeof(nodes[0].ch));
        memset(nodes[1].ch, 0, sizeof(nodes[1].ch));
        sz = 2; last = 1; sn = 0;
    }

    int get_link(int v, int i) {
        while (i - nodes[v].len - 1 < 0 || s[i - nodes[v].len - 1] != s[i])
            v = nodes[v].suf_link;
        return v;
    }

    bool add(char c) {
        s[sn] = c;
        int cur = get_link(last, sn);
        int cc = c - 'a';
        if (!nodes[cur].ch[cc]) {
            int q = sz++;
            nodes[q].len = nodes[cur].len + 2;
            memset(nodes[q].ch, 0, sizeof(nodes[q].ch));
            int tmp = get_link(nodes[cur].suf_link, sn);
            nodes[q].suf_link = (nodes[q].len == 1) ? 1 : nodes[tmp].ch[cc];
            nodes[cur].ch[cc] = q;
        }
        last = nodes[cur].ch[cc];
        sn++;
        return true;
    }

    int distinct_palindromes() { return sz - 2; }
} eertree;
```

---

## 연습 문제

- BOJ 10066 - 팰린드롬
- BOJ 15893 - 가운데를 살려라! (Manacher)
- BOJ 16163 - Palindrome (Eertree)
- BOJ 13275 - 가장 긴 팰린드롬 부분 문자열
