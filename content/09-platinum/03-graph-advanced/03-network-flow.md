---
title: "네트워크 플로우 (최대 유량)"
tags: [network-flow, max-flow, Dinic, Edmonds-Karp, platinum]
---

# 네트워크 플로우 (최대 유량)

## 개념

소스 S에서 싱크 T로 보낼 수 있는 **최대 유량** 계산.

- **잔여 그래프**: 역방향 간선(용량 0)을 항상 함께 추가
- **증가 경로(Augmenting Path)**: 잔여 용량 > 0 인 S→T 경로

---

## Dinic 알고리즘 — O(V² × E)

BFS로 레벨 그래프 구성 + DFS blocking flow.

```cpp
const int MAXN = 1005;
const int INF  = 1e9;

struct MaxFlow {
    struct Edge { int to, rev, cap; };
    Edge edges[MAXN * 200];
    int  head[MAXN], ecnt = 0;
    int  level[MAXN], iter_[MAXN];
    int  n;

    void init(int _n) {
        n = _n;
        memset(head, -1, sizeof(int)*(_n+1));
        ecnt = 0;
    }

    // 단방향 간선 (역방향은 cap=0)
    void add_edge(int u, int v, int cap) {
        edges[ecnt] = {v, ecnt+1, cap};
        head_push(u, ecnt++);
        edges[ecnt] = {u, ecnt-1, 0};
        head_push(v, ecnt++);
    }

    // 연결 리스트 헤드 추가 (간단 구현)
    int nxt[MAXN*200];
    void head_push(int u, int eid) { nxt[eid] = head[u]; head[u] = eid; }

    // BFS: 레벨 그래프 구성
    bool bfs(int s, int t) {
        memset(level, -1, sizeof(int)*(n+1));
        int q[MAXN], front = 0, back = 0;
        level[s] = 0;
        q[back++] = s;
        while (front < back) {
            int u = q[front++];
            for (int e = head[u]; ~e; e = nxt[e]) {
                auto& ed = edges[e];
                if (ed.cap > 0 && level[ed.to] < 0) {
                    level[ed.to] = level[u] + 1;
                    q[back++] = ed.to;
                }
            }
        }
        return level[t] >= 0;
    }

    // DFS: blocking flow
    int dfs(int u, int t, int f) {
        if (u == t) return f;
        for (int& e = iter_[u]; ~e; e = nxt[e]) {
            auto& ed = edges[e];
            if (ed.cap > 0 && level[ed.to] == level[u] + 1) {
                int d = dfs(ed.to, t, min(f, ed.cap));
                if (d > 0) {
                    ed.cap -= d;
                    edges[ed.rev].cap += d;
                    return d;
                }
            }
        }
        return 0;
    }

    int max_flow(int s, int t) {
        int flow = 0;
        while (bfs(s, t)) {
            for (int i = 0; i <= n; i++) iter_[i] = head[i];
            int d;
            while ((d = dfs(s, t, INF)) > 0) flow += d;
        }
        return flow;
    }
} mf;
```

---

## 최소 컷 (Min Cut)

최대 유량 = 최소 컷 (Max-flow Min-cut theorem).

```cpp
// max_flow 실행 후 BFS로 레벨 배열 재확인
// level[u] >= 0이면 S 측, < 0이면 T 측
bool is_source_side(int u) { return level[u] >= 0; }
```

---

## 이분 매칭 (Bipartite Matching)

이분 그래프의 최대 매칭 = 최대 유량.

```cpp
// 소스 → 좌측 노드 (cap=1), 좌측 → 우측 (cap=1), 우측 → 싱크 (cap=1)
int bipartite_matching(int left, int right) {
    int s = 0, t = left + right + 1;
    mf.init(t + 1);
    for (int i = 1; i <= left;  i++) mf.add_edge(s, i, 1);
    for (int i = 1; i <= right; i++) mf.add_edge(left+i, t, 1);
    // 간선: mf.add_edge(u, left+v, 1)
    return mf.max_flow(s, t);
}
```

---

## 시간 복잡도

| 알고리즘 | 복잡도 |
|---------|--------|
| Ford-Fulkerson | O(E × max_flow) |
| Edmonds-Karp | O(VE²) |
| **Dinic** | **O(V²E)**, 이분그래프: O(E√V) |

---

## 연습 문제

- BOJ 6086 - 최대 유량
- BOJ 11376 - 열혈강호 2 (이분 매칭)
- BOJ 11375 - 열혈강호 (이분 매칭)
- BOJ 2316 - 도시 왕복하기 2 (정점 분리 플로우)
- BOJ 13161 - 분단의 슬픔 (최소 컷)
