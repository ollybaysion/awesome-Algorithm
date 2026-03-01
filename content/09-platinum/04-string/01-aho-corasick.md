---
title: "아호-코라식 (Aho-Corasick)"
tags: [aho-corasick, string-matching, trie, failure-function, platinum]
---

# 아호-코라식 (Aho-Corasick)

## 개념

KMP의 실패 함수를 트라이 전체에 확장.
**여러 패턴을 하나의 텍스트에서 동시에** 탐색 — O(N + M + K).

---

## 구현

```cpp
const int MAXN = 300005;  // 총 트라이 노드 수

struct AhoCorasick {
    int  ch[MAXN][26];   // 트라이 자식
    int  fail[MAXN];     // 실패 링크
    int  out[MAXN];      // 이 노드에서 끝나는 패턴 수
    int  sz;

    void init() {
        sz = 1;
        memset(ch[0], 0, sizeof(ch[0]));
        out[0] = fail[0] = 0;
    }

    // 패턴 삽입
    void insert(const char* s) {
        int cur = 0;
        for (int i = 0; s[i]; i++) {
            int c = s[i] - 'a';
            if (!ch[cur][c]) {
                memset(ch[sz], 0, sizeof(ch[sz]));
                out[sz] = 0;
                ch[cur][c] = sz++;
            }
            cur = ch[cur][c];
        }
        out[cur]++;
    }

    // BFS로 실패 링크 + goto 함수 완성
    void build() {
        int q[MAXN], front = 0, back = 0;
        fail[0] = 0;
        for (int c = 0; c < 26; c++) {
            int v = ch[0][c];
            if (v) { fail[v] = 0; q[back++] = v; }
        }
        while (front < back) {
            int u = q[front++];
            out[u] += out[fail[u]];  // 실패 링크 따라 출현 집계
            for (int c = 0; c < 26; c++) {
                int v = ch[u][c];
                if (v) {
                    fail[v] = ch[fail[u]][c];
                    q[back++] = v;
                } else {
                    // goto 압축: 없는 전이는 실패 링크 따라감
                    ch[u][c] = ch[fail[u]][c];
                }
            }
        }
    }

    // 텍스트에서 모든 패턴 검색 — O(N + K)
    // 반환: 총 매칭 수
    long long search(const char* text) {
        long long cnt = 0;
        int cur = 0;
        for (int i = 0; text[i]; i++) {
            cur = ch[cur][text[i] - 'a'];
            cnt += out[cur];
        }
        return cnt;
    }
} ac;
```

---

## 사용 예시

```cpp
int main() {
    int m;
    scanf("%d", &m);
    ac.init();
    char pat[10005];
    for (int i = 0; i < m; i++) {
        scanf("%s", pat);
        ac.insert(pat);
    }
    ac.build();

    char text[1000005];
    scanf("%s", text);
    printf("%lld\n", ac.search(text));
}
```

---

## 아호-코라식 + DP (동적 계획법)

트라이의 상태를 DP 상태로 사용. **특정 패턴을 포함하지 않는 문자열 수 계산** 등.

```cpp
// dp[i][node] = 길이 i, 현재 AC 상태 node인 문자열 수
// 패턴 포함 상태(out[node] > 0) 제외
long long dp[LEN+1][MAX_NODE];

void count_strings(int len) {
    dp[0][0] = 1;
    for (int i = 0; i < len; i++)
        for (int u = 0; u < ac.sz; u++) {
            if (!dp[i][u]) continue;
            for (int c = 0; c < 26; c++) {
                int v = ac.ch[u][c];
                if (!ac.out[v])  // 패턴 미포함
                    dp[i+1][v] = (dp[i+1][v] + dp[i][u]) % MOD;
            }
        }
}
```

---

## 연습 문제

- BOJ 9250 - 문자열 집합 판별
- BOJ 10256 - 돌연변이
- BOJ 2809 - 아호 코라식 알고리즘
- BOJ 5670 - 휴대폰 자판 (Trie + BFS)
