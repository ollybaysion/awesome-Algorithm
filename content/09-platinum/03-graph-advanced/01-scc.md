---
title: "강한 연결 요소 (SCC)"
tags: [SCC, strongly-connected-components, Kosaraju, Tarjan, platinum]
---

# 강한 연결 요소 (SCC)

## 개념

**방향 그래프**에서 서로 도달 가능한 최대 정점 집합.
SCC를 하나의 노드로 압축하면 **DAG**(Directed Acyclic Graph)가 됨.

---

## Kosaraju 알고리즘 — O(V + E)

1. 원래 그래프에서 DFS → **역방향 위상정렬** 스택 생성
2. **역방향 그래프**에서 스택 순으로 DFS → 각 DFS 트리가 하나의 SCC

```cpp
const int MAXN = 100005;

// 원본 그래프
struct Edge { int to, next; } fwd[MAXN*4], bwd[MAXN*4];
int fhead[MAXN], bhead[MAXN], fcnt = 0, bcnt = 0;

void add_edge(int u, int v) {
    fwd[fcnt] = {v, fhead[u]}; fhead[u] = fcnt++;
    bwd[bcnt] = {u, bhead[v]}; bhead[v] = bcnt++;
}

bool visited[MAXN];
int  stk[MAXN], stk_top = 0;
int  comp[MAXN];  // comp[v] = SCC 번호

void dfs1(int u) {
    visited[u] = true;
    for (int e = fhead[u]; ~e; e = fwd[e].next)
        if (!visited[fwd[e].to]) dfs1(fwd[e].to);
    stk[stk_top++] = u;
}

void dfs2(int u, int c) {
    comp[u] = c;
    for (int e = bhead[u]; ~e; e = bwd[e].next)
        if (!comp[bwd[e].to]) dfs2(bwd[e].to, c);
}

int kosaraju(int n) {
    memset(visited, 0, sizeof(visited));
    memset(comp, 0, sizeof(comp));
    for (int i = 1; i <= n; i++)
        if (!visited[i]) dfs1(i);
    int num_scc = 0;
    while (stk_top > 0) {
        int v = stk[--stk_top];
        if (!comp[v]) dfs2(v, ++num_scc);
    }
    return num_scc;
}
```

---

## Tarjan 알고리즘 — O(V + E)

DFS 한 번으로 SCC 계산. **low link** 값 사용.

```cpp
int disc[MAXN], low[MAXN], timer__ = 0;
bool on_stack[MAXN];
int  tarjan_stk[MAXN], tarjan_top = 0;
int  scc_id[MAXN], scc_cnt = 0;

void tarjan_dfs(int u) {
    disc[u] = low[u] = ++timer__;
    tarjan_stk[tarjan_top++] = u;
    on_stack[u] = true;

    for (int e = fhead[u]; ~e; e = fwd[e].next) {
        int v = fwd[e].to;
        if (!disc[v]) {
            tarjan_dfs(v);
            low[u] = min(low[u], low[v]);
        } else if (on_stack[v]) {
            low[u] = min(low[u], disc[v]);
        }
    }

    // u가 SCC의 루트인 경우
    if (low[u] == disc[u]) {
        scc_cnt++;
        while (true) {
            int v = tarjan_stk[--tarjan_top];
            on_stack[v] = false;
            scc_id[v] = scc_cnt;
            if (v == u) break;
        }
    }
}

int tarjan(int n) {
    for (int i = 1; i <= n; i++)
        if (!disc[i]) tarjan_dfs(i);
    return scc_cnt;
}
```

---

## SCC 압축 (condensation DAG)

```cpp
// SCC를 노드로 하는 DAG 구성
// 위상 정렬 후 DP 가능
int scc_node_val[MAXN];  // 각 SCC의 가중치 합

void build_dag(int n, int num_scc) {
    // SCC 내 노드 값 합산
    for (int i = 1; i <= n; i++)
        scc_node_val[scc_id[i]] += node_val[i];

    // DAG 간선 추가 (중복 제거)
    for (int u = 1; u <= n; u++)
        for (int e = fhead[u]; ~e; e = fwd[e].next) {
            int v = fwd[e].to;
            if (scc_id[u] != scc_id[v])
                dag_add_edge(scc_id[u], scc_id[v]);
        }
}
```

---

## 연습 문제

- BOJ 2150 - Strongly Connected Component
- BOJ 4196 - 도미노 (SCC + 위상정렬)
- BOJ 4013 - ATM (SCC + DAG DP)
- BOJ 2617 - 구슬 찾기 (SCC)
