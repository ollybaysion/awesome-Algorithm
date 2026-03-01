---
title: "펜윅 트리 (BIT) 구현"
tags: [fenwick-tree, BIT, binary-indexed-tree, no-stl]
---

# 펜윅 트리 (Fenwick Tree / BIT)

## 개념

**구간 합 + 점 업데이트**를 세그먼트 트리보다 **코드가 짧고 빠르게** 처리.
`i & (-i)` 비트 트릭으로 각 노드가 담당하는 구간 결정.

---

## 1D 펜윅 트리

```cpp
struct BIT {
    static const int MAXN = 1000005;
    long long tree[MAXN];
    int n;

    void init(int _n) {
        n = _n;
        for (int i = 0; i <= n; i++) tree[i] = 0;
    }

    // idx에 val 더하기 — O(log n)
    void update(int idx, long long val) {
        for (; idx <= n; idx += idx & (-idx))
            tree[idx] += val;
    }

    // [1, idx] 구간 합 — O(log n)
    long long query(int idx) {
        long long sum = 0;
        for (; idx > 0; idx -= idx & (-idx))
            sum += tree[idx];
        return sum;
    }

    // [l, r] 구간 합
    long long query(int l, int r) {
        return query(r) - query(l - 1);
    }
};
```

---

## 2D 펜윅 트리

```cpp
struct BIT2D {
    static const int MAXN = 1005;
    long long tree[MAXN][MAXN];
    int n, m;

    void update(int x, int y, long long val) {
        for (int i = x; i <= n; i += i & (-i))
            for (int j = y; j <= m; j += j & (-j))
                tree[i][j] += val;
    }

    long long query(int x, int y) {
        long long sum = 0;
        for (int i = x; i > 0; i -= i & (-i))
            for (int j = y; j > 0; j -= j & (-j))
                sum += tree[i][j];
        return sum;
    }

    // (x1,y1) ~ (x2,y2) 직사각형 합
    long long query(int x1, int y1, int x2, int y2) {
        return query(x2, y2)
             - query(x1-1, y2)
             - query(x2, y1-1)
             + query(x1-1, y1-1);
    }
};
```

---

## 펜윅 트리로 k번째 원소 찾기

```cpp
// O(log^2 n) 버전
int kth(BIT& bit, int k) {
    int lo = 1, hi = bit.n;
    while (lo < hi) {
        int mid = (lo + hi) / 2;
        if (bit.query(mid) >= k) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}

// O(log n) 버전 — Binary Lifting
int kth_fast(BIT& bit, int k) {
    int pos = 0;
    for (int pw = 1 << 20; pw; pw >>= 1) {
        if (pos + pw <= bit.n && bit.tree[pos + pw] < k) {
            pos += pw;
            k   -= bit.tree[pos];
        }
    }
    return pos + 1;
}
```

---

## 구간 업데이트 + 점 쿼리

차분 배열 아이디어 적용.

```cpp
// [l, r]에 val 더하기 → arr[i] 값 쿼리
struct BIT_RangeUpdate {
    BIT diff;  // 차분 BIT

    void range_add(int l, int r, long long val) {
        diff.update(l, val);
        diff.update(r+1, -val);
    }

    long long point_query(int i) {
        return diff.query(i);   // 차분 합 = 실제 값
    }
};
```

---

## 세그먼트 트리 vs 펜윅 트리

| 기준 | 세그먼트 트리 | 펜윅 트리 |
|------|-------------|----------|
| 코드 길이 | 길다 | 짧다 |
| 상수 인자 | 크다 | 작다 |
| 메모리 | 4N | N |
| 구간 업데이트 | lazy 사용 | 차분 배열 활용 |
| 응용 범위 | 광범위 | 제한적 |

---

## 연습 문제

- BOJ 2042 - 구간 합 구하기
- BOJ 11505 - 구간 곱 구하기
- BOJ 2243 - 사탕상자 (k번째 원소)
- BOJ 11658 - 구간 합 구하기 3 (2D BIT)
