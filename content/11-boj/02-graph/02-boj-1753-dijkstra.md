---
title: "BOJ 1753 - 최단경로"
tags: [boj, graph, dijkstra, gold4]
boj: 1753
tier: gold4
---

# BOJ 1753 - 최단경로

## 문제 요약

방향 그래프에서 주어진 시작점으로부터 모든 정점까지의 최단 거리 출력.
- V ≤ 20,000 / E ≤ 300,000 / 가중치 ≤ 10

## 접근법

다익스트라 알고리즘 (우선순위 큐 = 수동 이진 힙).

STL `priority_queue` 없이 **최소 힙**을 직접 구현하여 사용.

## 복잡도

O((V + E) log V)

## 코드

```cpp
#include <cstdio>
#include <cstring>
using namespace std;

const int MAXV = 20005;
const int MAXE = 300005;
const int INF  = 0x3f3f3f3f;

// ─── 인접 리스트 ───
int head[MAXV], nxt[MAXE], to[MAXE], wt[MAXE], ecnt;
void addEdge(int u, int v, int w) {
    to[++ecnt] = v; wt[ecnt] = w;
    nxt[ecnt] = head[u]; head[u] = ecnt;
}

// ─── 최소 힙 (dist, vertex) ───
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
        if (cur.dist > dist[cur.v]) continue;
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

## 풀이 포인트

- 수동 이진 힙 구현: 1-indexed 배열, push/pop 모두 O(log n).
- **Lazy deletion**: `cur.dist > dist[cur.v]` 체크로 오래된 항목 스킵.
- 힙 크기: E번 push 가능이므로 `MAXE * 2` 여유 확보.

## 관련 문제

- BOJ 1916 - 최소비용 구하기 (다익스트라 기본)
- BOJ 11779 - 최소비용 구하기 2 (경로 역추적)
- BOJ 1854 - K번째 최단경로 (K-다익스트라)
