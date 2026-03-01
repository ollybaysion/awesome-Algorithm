---
title: "Heavy-Light Decomposition (HLD)"
tags: [HLD, heavy-light-decomposition, tree, segment-tree, platinum]
---

# Heavy-Light Decomposition (HLD)

## 개념

트리의 경로 쿼리를 **O(log² n)**에 처리.
각 노드에서 **자식 중 subtree 크기가 가장 큰 자식 = heavy child**.
heavy edge를 따라가는 경로 = **heavy chain**.

**핵심**: 루트에서 어떤 노드까지 경로에서 만나는 chain 수 ≤ O(log n).

---

## 구현

```cpp
const int MAXN = 100005;
const int LOG  = 17;

// 그래프
struct Edge { int to, next; } edges[MAXN * 2];
int head[MAXN], ecnt = 0;
void add_edge(int u, int v) {
    edges[ecnt] = {v, head[u]}; head[u] = ecnt++;
    edges[ecnt] = {u, head[v]}; head[v] = ecnt++;
}

int sz[MAXN];      // subtree 크기
int dep[MAXN];     // 깊이
int par[MAXN];     // 부모
int heavy[MAXN];   // heavy child (-1이면 없음)
int head_[MAXN];   // 속한 chain의 최상위 노드
int pos[MAXN];     // 세그먼트 트리에서의 위치
int timer_ = 0;

// DFS 1: sz, dep, par, heavy 계산
int dfs1(int u, int p, int d) {
    sz[u] = 1; dep[u] = d; par[u] = p; heavy[u] = -1;
    int max_sz = 0;
    for (int e = head[u]; ~e; e = edges[e].next) {
        int v = edges[e].to;
        if (v == p) continue;
        sz[u] += dfs1(v, u, d + 1);
        if (sz[v] > max_sz) { max_sz = sz[v]; heavy[u] = v; }
    }
    return sz[u];
}

// DFS 2: head_, pos 할당
void dfs2(int u, int h) {
    head_[u] = h;
    pos[u]   = ++timer_;
    if (heavy[u] != -1) dfs2(heavy[u], h);  // heavy edge 먼저
    for (int e = head[u]; ~e; e = edges[e].next) {
        int v = edges[e].to;
        if (v != par[u] && v != heavy[u])
            dfs2(v, v);  // light edge: 새 chain 시작
    }
}

// 세그먼트 트리 (구간 합)
long long seg[MAXN * 4];
void seg_update(int node, int s, int e, int idx, long long val) { /* ... */ }
long long seg_query(int node, int s, int e, int l, int r) { /* ... */ }

// 경로 u → v 구간 합 쿼리
long long path_query(int u, int v) {
    long long res = 0;
    while (head_[u] != head_[v]) {
        if (dep[head_[u]] < dep[head_[v]]) swap(u, v);
        // u의 chain head부터 u까지 쿼리
        res += seg_query(1, 1, timer_, pos[head_[u]], pos[u]);
        u = par[head_[u]];  // chain 위로 이동
    }
    if (dep[u] > dep[v]) swap(u, v);
    res += seg_query(1, 1, timer_, pos[u], pos[v]);
    return res;
}

// 경로 u → v 구간 업데이트
void path_update(int u, int v, long long val) {
    while (head_[u] != head_[v]) {
        if (dep[head_[u]] < dep[head_[v]]) swap(u, v);
        seg_update(1, 1, timer_, pos[head_[u]], pos[u], val);  // lazy
        u = par[head_[u]];
    }
    if (dep[u] > dep[v]) swap(u, v);
    seg_update(1, 1, timer_, pos[u], pos[v], val);
}

// 초기화
void init(int root, int n) {
    dfs1(root, root, 0);
    dfs2(root, root);
}
```

---

## Subtree 쿼리

HLD로 할당한 `pos[]`를 사용하면 subtree도 구간 쿼리로 처리 가능.

```cpp
// u의 subtree: [pos[u], pos[u] + sz[u] - 1]
long long subtree_query(int u) {
    return seg_query(1, 1, timer_, pos[u], pos[u] + sz[u] - 1);
}
```

---

## 시간 복잡도

| 연산 | 복잡도 |
|------|--------|
| 전처리 | O(n) |
| 경로 쿼리/업데이트 | O(log² n) |
| subtree 쿼리/업데이트 | O(log n) |

---

## 연습 문제

- BOJ 13726 - i love you (HLD 연습)
- BOJ 2916 - 자와 각도기
- BOJ 13510 - 트리와 쿼리 1
- BOJ 17429 - 국제 메시 기구 (HLD + Lazy)
