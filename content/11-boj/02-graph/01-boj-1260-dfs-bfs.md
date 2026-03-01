---
title: "BOJ 1260 - DFS와 BFS"
tags: [boj, graph, dfs, bfs, silver2]
boj: 1260
tier: silver2
---

# BOJ 1260 - DFS와 BFS

## 문제 요약

그래프를 DFS와 BFS로 탐색한 결과를 출력.
- 방문할 수 있는 정점이 여러 개이면 **번호가 작은 것 먼저** 방문.
- 입력: 정점 수 N (≤1000), 간선 수 M (≤10000), 시작 정점 V

## 접근법

- 인접 리스트를 정렬하여 작은 번호 먼저 방문 보장
- DFS: 재귀 (스택 오버플로 주의, N≤1000이라 재귀 가능)
- BFS: 수동 큐 (int 배열)

## 복잡도

| | 시간 | 공간 |
|-|------|------|
| DFS | O(V + E) | O(V + E) |
| BFS | O(V + E) | O(V + E) |

## 코드

```cpp
#include <cstdio>
#include <cstring>
#include <algorithm>
using namespace std;

const int MAXN = 1005;
const int MAXM = 20005;  // 양방향이므로 2M

int head[MAXN], nxt[MAXM], to[MAXM], ecnt;
bool visited[MAXN];
int N, M, V;

void addEdge(int u, int v) {
    to[++ecnt] = v; nxt[ecnt] = head[u]; head[u] = ecnt;
}

void dfs(int u) {
    visited[u] = true;
    printf("%d ", u);
    for (int e = head[u]; e; e = nxt[e]) {
        if (!visited[to[e]])
            dfs(to[e]);
    }
}

void bfs(int start) {
    int q[MAXN], front = 0, back = 0;
    memset(visited, false, sizeof(visited));
    visited[start] = true;
    q[back++] = start;
    while (front < back) {
        int u = q[front++];
        printf("%d ", u);
        for (int e = head[u]; e; e = nxt[e]) {
            if (!visited[to[e]]) {
                visited[to[e]] = true;
                q[back++] = to[e];
            }
        }
    }
}

int main() {
    scanf("%d %d %d", &N, &M, &V);

    // 임시 간선 저장 후 정렬
    int eu[MAXM], ev[MAXM];
    for (int i = 0; i < M; i++) {
        scanf("%d %d", &eu[i], &ev[i]);
    }

    // 정점별 인접 리스트를 작은 번호 우선으로 만들기 위해
    // 간선을 (u, v)로 정렬 후 역순으로 추가 (head가 최솟값이 됨)
    // 대신: 벡터 없이 addEdge 후 head를 각 정점별로 재정렬하기보다
    // 입력을 단순히 정렬해서 역순 추가
    // ※ 인접 리스트 head는 마지막에 추가된 게 먼저 나오므로 역순 추가 = 오름차순 탐색

    // (u, v) 쌍을 v 기준 내림차순 정렬 후 addEdge → head에서 꺼낼 때 오름차순
    // 간단하게: 정렬된 배열을 역순으로 삽입
    // 1) (u,v), (v,u) 전부 수집
    int pairs[MAXM][2]; int pcnt = 0;
    for (int i = 0; i < M; i++) {
        pairs[pcnt][0] = eu[i]; pairs[pcnt][1] = ev[i]; pcnt++;
        pairs[pcnt][0] = ev[i]; pairs[pcnt][1] = eu[i]; pcnt++;
    }
    // v 기준 내림차순 (같으면 u 내림차순)
    // 버블 정렬 대신 삽입 정렬 (M≤10000이므로)
    for (int i = 1; i < pcnt; i++) {
        int pu = pairs[i][0], pv = pairs[i][1];
        int j = i - 1;
        while (j >= 0 && (pairs[j][0] < pu || (pairs[j][0] == pu && pairs[j][1] < pv))) {
            pairs[j+1][0] = pairs[j][0]; pairs[j+1][1] = pairs[j][1];
            j--;
        }
        pairs[j+1][0] = pu; pairs[j+1][1] = pv;
    }
    for (int i = 0; i < pcnt; i++)
        addEdge(pairs[i][0], pairs[i][1]);

    dfs(V);
    printf("\n");
    bfs(V);
    printf("\n");
    return 0;
}
```

## 풀이 포인트

- STL `vector` + `sort` 없이 인접 리스트를 구성할 때,
  간선을 **내림차순으로 정렬 후 역순 삽입**하면 head 체인이 오름차순이 됨.
- 재귀 DFS가 가능한 이유: N ≤ 1000 → 스택 깊이 최대 1000.

## 관련 문제

- BOJ 2606 - 바이러스 (DFS 연결 요소)
- BOJ 7576 - 토마토 (BFS 다중 출발)
