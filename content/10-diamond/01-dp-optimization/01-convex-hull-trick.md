---
title: "Convex Hull Trick (CHT)"
tags: [convex-hull-trick, CHT, DP-optimization, Li-Chao, diamond]
---

# Convex Hull Trick (CHT)

## 개념

DP 점화식이 `dp[i] = min(dp[j] + b[j] * a[i])` 형태일 때,
직선 `y = b[j] * x + dp[j]`들의 최솟값을 구하는 문제로 환원.
Convex Hull로 쿼리당 **O(1) ~ O(log n)**.

---

## 단조 CHT (기울기 단조 + 쿼리 단조) — O(n)

기울기와 쿼리가 모두 단조(monotone)일 때 **포인터 한 개**로 O(n) 처리.

```cpp
// 직선 y = m*x + b (최솟값)
struct Line { long long m, b; };

struct CHT_Monotone {
    static const int MAXN = 100005;
    Line hull[MAXN];
    int  lo = 0, hi = 0;  // 덱 인덱스

    // 직선 추가 (기울기 감소 순으로 추가)
    // f(a, b, c): b와 c가 있을 때 a가 필요 없으면 true
    bool bad(Line l1, Line l2, Line l3) {
        // l2가 l1과 l3 사이 어느 점에서도 최솟값이 안 됨
        return (__int128)(l3.b - l1.b) * (l1.m - l2.m)
             <= (__int128)(l2.b - l1.b) * (l1.m - l3.m);
    }

    void add(long long m, long long b) {
        Line l = {m, b};
        while (hi - lo >= 2 && bad(hull[hi-2], hull[hi-1], l))
            hi--;
        hull[hi++] = l;
    }

    // 쿼리 x (x 단조 증가)
    long long query(long long x) {
        while (hi - lo >= 2 &&
               hull[lo].m * x + hull[lo].b >=
               hull[lo+1].m * x + hull[lo+1].b)
            lo++;
        return hull[lo].m * x + hull[lo].b;
    }
} cht;
```

---

## Li Chao Tree — O(n log C)

기울기/쿼리가 임의 순서일 때 세그먼트 트리 형태로 관리.

```cpp
const long long INF = 2e18;
const int XMIN = -1e9, XMAX = 1e9;

struct LiChaoTree {
    struct Node {
        long long m, b;  // 직선 y = m*x + b
        bool has;
        Node() : m(0), b(INF), has(false) {}
    };

    static const int MAXN = 4000005;
    Node tree[MAXN];

    long long eval(const Node& n, long long x) {
        return n.has ? n.m * x + n.b : INF;
    }

    void add(int node, long long l, long long r, long long m, long long b) {
        long long mid = (l + r) / 2;
        bool left_better  = m * l + b < eval(tree[node], l);
        bool mid_better   = m * mid + b < eval(tree[node], mid);

        if (mid_better) {
            swap(tree[node].m, m);
            swap(tree[node].b, b);
            tree[node].has = true;
        }

        if (l == r) return;
        if (left_better != mid_better) add(2*node, l, mid, m, b);
        else                            add(2*node+1, mid+1, r, m, b);
    }

    void add(long long m, long long b) {
        add(1, XMIN, XMAX, m, b);
    }

    long long query(int node, long long l, long long r, long long x) {
        long long res = eval(tree[node], x);
        if (l == r) return res;
        long long mid = (l + r) / 2;
        if (x <= mid) return min(res, query(2*node, l, mid, x));
        else          return min(res, query(2*node+1, mid+1, r, x));
    }

    long long query(long long x) {
        return query(1, XMIN, XMAX, x);
    }
} lct;
```

---

## 적용 예시 — 기차 문제

```
dp[i] = min_{j < i}(dp[j] + cost(j, i))
cost(j, i) = (a[i] - a[j])^2 형태 전개
→ dp[i] = a[i]^2 + min_j(dp[j] + a[j]^2 - 2*a[i]*a[j])
→ 직선: y = -2*a[j] * x + (dp[j] + a[j]^2), 쿼리 x = a[i]
```

```cpp
void solve(int n, long long* a) {
    long long dp[n+1];
    dp[0] = 0;
    // a[] 정렬되어 있고 a[i] 단조 증가 → 단조 CHT
    cht.lo = cht.hi = 0;
    cht.add(-2 * a[0], dp[0] + a[0]*a[0]);
    for (int i = 1; i <= n; i++) {
        dp[i] = cht.query(a[i]) + a[i]*a[i];
        cht.add(-2 * a[i], dp[i] + a[i]*a[i]);
    }
}
```

---

## 연습 문제

- BOJ 13261 - 탈옥 (단조 CHT)
- BOJ 4008 - 특공대 (기울기 단조 CHT)
- BOJ 12795 - 반평면 땅따먹기 (비단조 CHT)
- BOJ 13263 - 나무 자르기 (Li Chao Tree)
