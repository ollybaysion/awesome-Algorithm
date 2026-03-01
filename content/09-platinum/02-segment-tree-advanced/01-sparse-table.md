---
title: "Sparse Table (희소 테이블)"
tags: [sparse-table, RMQ, range-minimum-query, O(1)-query, platinum]
---

# Sparse Table

## 개념

**정적 배열**에서 구간 최솟값/최댓값(RMQ)을 **O(1)** 쿼리로 처리.
전처리 O(n log n), 쿼리 O(1). **업데이트 불가** (오프라인 전용).

**핵심 아이디어**: `[l, r]` 구간을 두 개의 겹치는 구간 `[l, l+2^k-1]`과 `[r-2^k+1, r]`으로 커버 (min/max는 겹쳐도 OK).

---

## 구현

```cpp
const int MAXN  = 100005;
const int LOG   = 17;

int sparse[LOG][MAXN];  // sparse[k][i] = [i, i+2^k-1] 구간의 최솟값
int lg[MAXN];           // log2 precomputed

void build(int* arr, int n) {
    // log2 사전 계산
    lg[1] = 0;
    for (int i = 2; i <= n; i++) lg[i] = lg[i/2] + 1;

    // k=0: 길이 1 구간
    for (int i = 1; i <= n; i++) sparse[0][i] = arr[i];

    // k>0: sparse[k][i] = min(sparse[k-1][i], sparse[k-1][i + 2^(k-1)])
    for (int k = 1; k < LOG; k++)
        for (int i = 1; i + (1 << k) - 1 <= n; i++)
            sparse[k][i] = min(sparse[k-1][i],
                               sparse[k-1][i + (1 << (k-1))]);
}

// [l, r] 최솟값 — O(1)
int query_min(int l, int r) {
    int k = lg[r - l + 1];
    return min(sparse[k][l], sparse[k][r - (1 << k) + 1]);
}
```

---

## GCD Sparse Table

GCD는 min/max처럼 **겹쳐도 OK** (idempotent). O(1) 가능.

```cpp
int gcd_table[LOG][MAXN];

void build_gcd(int* arr, int n) {
    for (int i = 1; i <= n; i++) gcd_table[0][i] = arr[i];
    for (int k = 1; k < LOG; k++)
        for (int i = 1; i + (1<<k) - 1 <= n; i++)
            gcd_table[k][i] = __gcd(gcd_table[k-1][i],
                                     gcd_table[k-1][i+(1<<(k-1))]);
}

int query_gcd(int l, int r) {
    int k = lg[r - l + 1];
    return __gcd(gcd_table[k][l], gcd_table[k][r-(1<<k)+1]);
}
```

---

## 구간 합에는 Sparse Table 못 쓴다?

구간 합은 idempotent하지 않아 두 구간을 겹치면 중복 계산됨.
→ 구간 합은 **펜윅 트리** 또는 **prefix sum** 사용.

---

## LCA에서의 Sparse Table

오일러 투어 후 RMQ로 LCA 환원 시 Sparse Table을 사용하면 O(1) LCA.

```cpp
// euler_depth[] 배열에 Sparse Table 구축
// lca(u, v) = euler[argmin(euler_depth, first[u], first[v])]
```

---

## 시간 복잡도

| 연산 | 복잡도 |
|------|--------|
| 전처리 | O(n log n) |
| 쿼리 | O(1) |
| 메모리 | O(n log n) |

---

## 연습 문제

- BOJ 17435 - 합성함수와 쿼리 (Sparse Table 변형)
- BOJ 18436 - 수열과 쿼리 37 (RMQ)
- BOJ 14510 - Washer (GCD Sparse Table)
