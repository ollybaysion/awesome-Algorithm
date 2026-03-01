---
title: "세그먼트 트리 구현"
tags: [segment-tree, range-query, point-update, no-stl]
---

# 세그먼트 트리 (Segment Tree)

## 개념

배열의 구간 쿼리(합, 최솟값, 최댓값 등)를 **O(log n)**에 처리하는 트리 자료구조.

```
배열: [1, 3, 5, 7, 9, 11]
트리 인덱스 1이 루트 (1-based), 자식: 2i, 2i+1
```

---

## 합 세그먼트 트리 (Range Sum Query)

```cpp
struct SegTree {
    static const int MAXN = 400005;  // 4 * N
    long long tree[MAXN];
    int n;

    void build(int* arr, int node, int s, int e) {
        if (s == e) { tree[node] = arr[s]; return; }
        int mid = (s + e) / 2;
        build(arr, 2*node,   s,   mid);
        build(arr, 2*node+1, mid+1, e);
        tree[node] = tree[2*node] + tree[2*node+1];
    }

    // point update: arr[idx] += diff
    void update(int node, int s, int e, int idx, long long diff) {
        if (s == e) { tree[node] += diff; return; }
        int mid = (s + e) / 2;
        if (idx <= mid) update(2*node,   s,   mid, idx, diff);
        else            update(2*node+1, mid+1, e, idx, diff);
        tree[node] = tree[2*node] + tree[2*node+1];
    }

    // range query: sum of [l, r]
    long long query(int node, int s, int e, int l, int r) {
        if (r < s || e < l) return 0;
        if (l <= s && e <= r) return tree[node];
        int mid = (s + e) / 2;
        return query(2*node,   s,   mid, l, r)
             + query(2*node+1, mid+1, e, l, r);
    }

    // 편의 인터페이스
    void init(int* arr, int _n) {
        n = _n;
        build(arr, 1, 1, n);
    }
    void update(int idx, long long diff) { update(1, 1, n, idx, diff); }
    long long query(int l, int r)        { return query(1, 1, n, l, r); }
};
```

---

## 최솟값 세그먼트 트리 (Range Min Query)

```cpp
struct MinSegTree {
    static const int INF = 1e9;
    int tree[400005], n;

    void build(int* arr, int node, int s, int e) {
        if (s == e) { tree[node] = arr[s]; return; }
        int mid = (s + e) / 2;
        build(arr, 2*node, s, mid);
        build(arr, 2*node+1, mid+1, e);
        tree[node] = min(tree[2*node], tree[2*node+1]);
    }

    void update(int node, int s, int e, int idx, int val) {
        if (s == e) { tree[node] = val; return; }
        int mid = (s + e) / 2;
        if (idx <= mid) update(2*node, s, mid, idx, val);
        else            update(2*node+1, mid+1, e, idx, val);
        tree[node] = min(tree[2*node], tree[2*node+1]);
    }

    int query(int node, int s, int e, int l, int r) {
        if (r < s || e < l) return INF;
        if (l <= s && e <= r) return tree[node];
        int mid = (s + e) / 2;
        return min(query(2*node, s, mid, l, r),
                   query(2*node+1, mid+1, e, l, r));
    }
};
```

---

## Lazy Propagation (구간 업데이트)

```cpp
struct LazySegTree {
    long long tree[400005], lazy[400005];
    int n;

    void push_down(int node, int s, int e) {
        if (lazy[node] == 0) return;
        int mid = (s + e) / 2;
        tree[2*node]   += lazy[node] * (mid - s + 1);
        tree[2*node+1] += lazy[node] * (e - mid);
        lazy[2*node]   += lazy[node];
        lazy[2*node+1] += lazy[node];
        lazy[node] = 0;
    }

    // 구간 [l, r]에 val 더하기
    void update(int node, int s, int e, int l, int r, long long val) {
        if (r < s || e < l) return;
        if (l <= s && e <= r) {
            tree[node] += val * (e - s + 1);
            lazy[node] += val;
            return;
        }
        push_down(node, s, e);
        int mid = (s + e) / 2;
        update(2*node,   s,   mid, l, r, val);
        update(2*node+1, mid+1, e, l, r, val);
        tree[node] = tree[2*node] + tree[2*node+1];
    }

    long long query(int node, int s, int e, int l, int r) {
        if (r < s || e < l) return 0;
        if (l <= s && e <= r) return tree[node];
        push_down(node, s, e);
        int mid = (s + e) / 2;
        return query(2*node,   s,   mid, l, r)
             + query(2*node+1, mid+1, e, l, r);
    }
};
```

---

## 시간 복잡도

| 연산 | 복잡도 |
|------|--------|
| build | O(n) |
| point update | O(log n) |
| range query | O(log n) |
| range update (lazy) | O(log n) |

---

## 연습 문제

- BOJ 2042 - 구간 합 구하기
- BOJ 2357 - 최솟값과 최댓값
- BOJ 10999 - 구간 합 구하기 2 (Lazy)
- BOJ 1395 - 스위치 (Lazy, 0/1 토글)
