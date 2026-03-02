---
title: "다익스트라 (Dijkstra)"
tags: [dijkstra, shortest-path, priority-queue, greedy]
---

# 다익스트라 알고리즘 (Dijkstra)

## 개념

**가중치가 있는 그래프**에서 단일 출발점(single-source)의 **최단 경로**를 구하는 알고리즘입니다.

> ⚠️ **음수 가중치가 없을 때**만 사용 가능합니다.

---

## 동작 원리

1. 시작 노드의 거리 = 0, 나머지 = ∞
2. 미방문 노드 중 거리가 가장 짧은 노드 선택 (우선순위 큐 사용)
3. 해당 노드의 인접 노드 거리 갱신 (relaxation)
4. 모든 노드를 방문할 때까지 반복

---

## 시간 복잡도

| 구현 | 복잡도 |
|------|--------|
| 단순 배열 | O(V²) |
| 우선순위 큐 (힙) | **O((V + E) log V)** |

---

## 구현 (C++ — 수동 최소 힙)

```cpp
#include <cstdio>
#include <cstring>

const int MAXV = 20005;
const int MAXE = 300005;
const int INF  = 0x3f3f3f3f;

// ─── 인접 리스트 ───
int head[MAXV], nxt[MAXE], to[MAXE], wt[MAXE], ecnt;
void addEdge(int u, int v, int w) {
    to[++ecnt] = v; wt[ecnt] = w;
    nxt[ecnt] = head[u]; head[u] = ecnt;
}

// ─── 최소 힙 ───
struct Pair { int dist, v; };
Pair heap[MAXE * 2];
int  heapSz;

void heapPush(int d, int v) {
    heap[++heapSz] = {d, v};
    int i = heapSz;
    while (i > 1 && heap[i].dist < heap[i/2].dist) {
        Pair tmp = heap[i]; heap[i] = heap[i/2]; heap[i/2] = tmp;
        i /= 2;
    }
}

Pair heapPop() {
    Pair ret = heap[1];
    heap[1] = heap[heapSz--];
    int i = 1;
    while (true) {
        int c = i * 2;
        if (c > heapSz) break;
        if (c + 1 <= heapSz && heap[c+1].dist < heap[c].dist) c++;
        if (heap[c].dist >= heap[i].dist) break;
        Pair tmp = heap[i]; heap[i] = heap[c]; heap[c] = tmp;
        i = c;
    }
    return ret;
}

// ─── 다익스트라 ───
int dist[MAXV];

void dijkstra(int src, int V) {
    memset(dist, 0x3f, sizeof(int) * (V + 1));
    dist[src] = 0;
    heapSz = 0;
    heapPush(0, src);

    while (heapSz) {
        Pair cur = heapPop();
        if (cur.dist > dist[cur.v]) continue;  // lazy deletion
        for (int e = head[cur.v]; e; e = nxt[e]) {
            int nd = dist[cur.v] + wt[e];
            if (nd < dist[to[e]]) {
                dist[to[e]] = nd;
                heapPush(nd, to[e]);
            }
        }
    }
}

int main() {
    int V, E, K;
    scanf("%d %d", &V, &E);
    scanf("%d", &K);
    for (int i = 0; i < E; i++) {
        int u, v, w;
        scanf("%d %d %d", &u, &v, &w);
        addEdge(u, v, w);
    }

    dijkstra(K, V);

    for (int i = 1; i <= V; i++) {
        if (dist[i] == INF) puts("INF");
        else printf("%d\n", dist[i]);
    }
    return 0;
}
```

---

## 경로 복원

```cpp
int prev[MAXV];

void dijkstraWithPath(int src, int V) {
    memset(dist, 0x3f, sizeof(int) * (V + 1));
    memset(prev, -1, sizeof(int) * (V + 1));
    dist[src] = 0;
    heapSz = 0;
    heapPush(0, src);

    while (heapSz) {
        Pair cur = heapPop();
        if (cur.dist > dist[cur.v]) continue;
        for (int e = head[cur.v]; e; e = nxt[e]) {
            int nd = dist[cur.v] + wt[e];
            if (nd < dist[to[e]]) {
                dist[to[e]] = nd;
                prev[to[e]] = cur.v;
                heapPush(nd, to[e]);
            }
        }
    }
}

// 경로 역추적 (목적지 → 출발지 역순)
void printPath(int end) {
    int path[MAXV], cnt = 0;
    for (int v = end; v != -1; v = prev[v])
        path[cnt++] = v;
    for (int i = cnt - 1; i >= 0; i--)
        printf("%d ", path[i]);
    printf("\n");
}
```

---

## 연습 문제

- BOJ 1753 - 최단경로
- BOJ 1916 - 최소비용 구하기
- LeetCode 743 - Network Delay Time
