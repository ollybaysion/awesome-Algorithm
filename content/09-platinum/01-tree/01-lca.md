---
title: "LCA (최소 공통 조상)"
tags: [LCA, sparse-table, binary-lifting, tree, platinum]
---

# LCA — 최소 공통 조상 (Lowest Common Ancestor)

## 개념

트리에서 두 노드 u, v의 **공통 조상 중 가장 깊은 노드**.

---

## Binary Lifting — O(n log n) 전처리, O(log n) 쿼리

```cpp
const int MAXN = 100005;
const int LOG  = 17;   // 2^17 > 10^5

int depth[MAXN];
int par[MAXN][LOG];    // par[v][k] = v의 2^k번째 조상

// 인접 리스트 (STL 없이)
struct Edge { int to, next; } edges[MAXN * 2];
int head[MAXN], ecnt = 0;
void add_edge(int u, int v) {
    edges[ecnt] = {v, head[u]}; head[u] = ecnt++;
    edges[ecnt] = {u, head[v]}; head[v] = ecnt++;
}

// BFS로 depth, par[v][0] 초기화
int bfs_queue[MAXN];
void bfs(int root, int n) {
    int front = 0, back = 0;
    bfs_queue[back++] = root;
    depth[root] = 0;
    par[root][0] = root;
    bool visited[MAXN] = {};
    visited[root] = true;

    while (front < back) {
        int u = bfs_queue[front++];
        for (int e = head[u]; ~e; e = edges[e].next) {
            int v = edges[e].to;
            if (!visited[v]) {
                visited[v] = true;
                depth[v] = depth[u] + 1;
                par[v][0] = u;
                bfs_queue[back++] = v;
            }
        }
    }
}

// Sparse table 빌드
void build_lca(int n) {
    for (int k = 1; k < LOG; k++)
        for (int v = 1; v <= n; v++)
            par[v][k] = par[par[v][k-1]][k-1];
}

int lca(int u, int v) {
    // 깊이 맞추기
    if (depth[u] < depth[v]) swap(u, v);
    int diff = depth[u] - depth[v];
    for (int k = 0; k < LOG; k++)
        if ((diff >> k) & 1) u = par[u][k];

    if (u == v) return u;

    // 함께 올라가기
    for (int k = LOG-1; k >= 0; k--)
        if (par[u][k] != par[v][k]) {
            u = par[u][k];
            v = par[v][k];
        }
    return par[u][0];
}
```

---

## 두 노드 사이 거리

```cpp
// 가중치 없는 트리
int dist(int u, int v) {
    return depth[u] + depth[v] - 2 * depth[lca(u, v)];
}

// 가중치 있는 트리 — dist_from_root[] 배열 추가
long long dist_root[MAXN];
long long dist(int u, int v) {
    return dist_root[u] + dist_root[v] - 2 * dist_root[lca(u, v)];
}
```

---

## 오일러 투어 + Sparse Table LCA — O(n) / O(1)

```cpp
// 오일러 투어로 LCA를 RMQ로 환원
// 구현 길이가 길어 대회에서는 Binary Lifting 선호

int euler[MAXN * 2], first[MAXN], euler_depth[MAXN * 2];
int etimer = 0;

void dfs(int u, int p, int d) {
    first[u] = etimer;
    euler[etimer] = u;
    euler_depth[etimer++] = d;
    for (int e = head[u]; ~e; e = edges[e].next) {
        int v = edges[e].to;
        if (v != p) {
            dfs(v, u, d + 1);
            euler[etimer] = u;
            euler_depth[etimer++] = d;
        }
    }
}

// 이후 euler_depth[] 배열에 Sparse Table 구축 → RMQ로 LCA
```

---

## 연습 문제

- BOJ 11437 - LCA
- BOJ 11438 - LCA 2 (Binary Lifting)
- BOJ 1761 - 정점들의 거리
- BOJ 3176 - 도로 네트워크 (경로 상 최대/최솟값)
