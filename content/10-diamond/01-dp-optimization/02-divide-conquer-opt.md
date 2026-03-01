---
title: "분할 정복 최적화 / Knuth 최적화"
tags: [divide-conquer-optimization, Knuth-optimization, DP, diamond]
---

# DP 최적화 — 분할 정복 / Knuth

## 분할 정복 최적화 (Divide and Conquer Optimization)

### 적용 조건

`dp[i][j] = min_{k < j}(dp[i-1][k] + cost(k, j))` 형태이고,
**최적 전이점 opt[i][j]가 단조** → `opt[i][j] ≤ opt[i][j+1]`.

O(kn²) → **O(kn log n)**

### 구현

```cpp
const long long INF = 2e18;
const int MAXN = 5005;

long long dp[2][MAXN];   // 레이어 전환으로 메모리 절약
long long cost_table[MAXN][MAXN];

// cost(l, r): dp 비용 함수
long long cost(int l, int r) {
    return cost_table[l][r];
}

// dp[layer][j] 계산: opt ∈ [lo, hi]
void solve(int layer, int lo, int hi, int opt_lo, int opt_hi) {
    if (lo > hi) return;
    int mid = (lo + hi) / 2;
    long long best = INF;
    int opt = opt_lo;

    for (int k = opt_lo; k <= min(mid - 1, opt_hi); k++) {
        long long val = dp[layer-1 & 1][k] + cost(k, mid);
        if (val < best) { best = val; opt = k; }
    }

    dp[layer & 1][mid] = best;
    solve(layer, lo,   mid-1, opt_lo, opt);
    solve(layer, mid+1, hi,   opt,    opt_hi);
}

void dp_dc_opt(int K, int N) {
    // 초기화: dp[0][j] = cost(0, j)
    for (int j = 1; j <= N; j++)
        dp[0][j] = cost(0, j);

    for (int i = 1; i <= K; i++)
        solve(i, 1, N, 1, N);
}
```

---

## Knuth 최적화

### 적용 조건

`dp[i][j] = min_{i<k<j}(dp[i][k] + dp[k][j]) + w(i, j)` 형태이고,
**사각 부등식** 만족: `w(a,c) + w(b,d) ≤ w(a,d) + w(b,c)` (a≤b≤c≤d).

O(n³) → **O(n²)**

### 구현

```cpp
const int MAXN = 5005;
long long dp[MAXN][MAXN];
int      opt[MAXN][MAXN];  // 최적 분할점
long long w[MAXN][MAXN];   // 비용 함수

void knuth(int n) {
    // 기저: dp[i][i] = 0
    for (int i = 0; i <= n; i++) {
        dp[i][i] = 0;
        opt[i][i] = i;
    }

    for (int len = 2; len <= n; len++) {
        for (int i = 0; i + len - 1 <= n; i++) {
            int j = i + len - 1;
            dp[i][j] = INF;
            // opt[i][j] ∈ [opt[i][j-1], opt[i+1][j]]
            for (int k = opt[i][j-1]; k <= opt[i+1][j]; k++) {
                long long val = dp[i][k] + dp[k][j] + w[i][j];
                if (val < dp[i][j]) {
                    dp[i][j] = val;
                    opt[i][j] = k;
                }
            }
        }
    }
}
```

---

## 언제 무엇을 쓰나?

| 최적화 | 조건 | 복잡도 |
|--------|------|--------|
| CHT | `dp[j] + b[j]*a[i]` 형태 | O(n log n) |
| 분할 정복 | opt 단조 | O(kn log n) |
| Knuth | 사각 부등식 + 구간 DP | O(n²) |

---

## 연습 문제

- BOJ 11001 - 김치 (분할 정복 최적화)
- BOJ 1648 - 격자판 채우기 (Knuth)
- BOJ 2390 - 행렬 곱셈 순서 (Knuth)
- BOJ 13261 - 탈옥 (분할 정복)
