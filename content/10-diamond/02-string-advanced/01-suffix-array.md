---
title: "접미사 배열 (Suffix Array) + LCP"
tags: [suffix-array, LCP, SA-IS, string, diamond]
---

# 접미사 배열 (Suffix Array)

## 개념

문자열의 **모든 접미사를 사전순 정렬**한 인덱스 배열 SA[].
LCP[i] = SA[i]와 SA[i-1]의 최장 공통 접두사 길이.

---

## O(n log n) 구현 — Prefix Doubling

```cpp
const int MAXN = 500005;

int sa[MAXN], rank_[MAXN], tmp[MAXN];
int lcp[MAXN];
int n;
char s[MAXN];

// 기수 정렬 기반 suffix array
bool cmp(int a, int b, int d) {
    if (rank_[a] != rank_[b]) return rank_[a] < rank_[b];
    int ra = (a + d < n) ? rank_[a + d] : -1;
    int rb = (b + d < n) ? rank_[b + d] : -1;
    return ra < rb;
}

void build_sa() {
    for (int i = 0; i < n; i++) { sa[i] = i; rank_[i] = s[i]; }

    for (int d = 1; d < n; d <<= 1) {
        // d-prefix 기준 정렬
        auto cmp_d = [&](int a, int b) { return cmp(a, b, d); };
        sort(sa, sa + n, cmp_d);

        // rank 재할당
        tmp[sa[0]] = 0;
        for (int i = 1; i < n; i++)
            tmp[sa[i]] = tmp[sa[i-1]] + (cmp(sa[i-1], sa[i], d) ? 1 : 0);
        for (int i = 0; i < n; i++) rank_[i] = tmp[i];
        if (rank_[sa[n-1]] == n-1) break;  // 모두 다른 rank
    }
}

// Kasai 알고리즘 — LCP 배열 O(n)
void build_lcp() {
    int inv[MAXN];
    for (int i = 0; i < n; i++) inv[sa[i]] = i;

    int k = 0;
    for (int i = 0; i < n; i++) {
        if (inv[i] == 0) { k = 0; continue; }
        int j = sa[inv[i] - 1];
        while (i + k < n && j + k < n && s[i+k] == s[j+k]) k++;
        lcp[inv[i]] = k;
        if (k) k--;
    }
}
```

---

## 활용 1 — 문자열 검색 O(m log n)

패턴 P가 S에 등장하는지 이분 탐색으로 확인.

```cpp
bool find_pattern(const char* p, int m) {
    int lo = 0, hi = n - 1;
    // lower bound
    while (lo < hi) {
        int mid = (lo + hi) / 2;
        if (strncmp(s + sa[mid], p, m) < 0) lo = mid + 1;
        else hi = mid;
    }
    return strncmp(s + sa[lo], p, m) == 0;
}
```

---

## 활용 2 — 가장 긴 반복 부분문자열

```cpp
// LCP 배열의 최댓값
int longest_repeated_substr() {
    int res = 0;
    for (int i = 1; i < n; i++) res = max(res, lcp[i]);
    return res;
}
```

---

## 활용 3 — 서로 다른 부분문자열 수

```cpp
// 전체 접미사 조합 - LCP 중복 제거
long long count_distinct_substrings() {
    long long total = (long long)n * (n + 1) / 2;
    for (int i = 1; i < n; i++) total -= lcp[i];
    return total;
}
```

---

## LCP + Sparse Table — 임의 두 접미사의 LCP O(1)

```cpp
// lcp[l..r]의 최솟값 = sa[l]과 sa[r]의 LCP
// Sparse Table로 RMQ 전처리
```

---

## 연습 문제

- BOJ 9248 - Suffix Array
- BOJ 1605 - 반복 부분문자열 (LCP max)
- BOJ 11479 - 서로 다른 부분문자열의 수 2
- BOJ 13576 - Prefix와 Suffix (SA + LCP)
