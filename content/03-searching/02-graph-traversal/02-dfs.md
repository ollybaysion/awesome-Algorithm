---
title: "깊이 우선 탐색 (DFS)"
tags: [DFS, stack, recursion, backtracking]
---

# 깊이 우선 탐색 (DFS)

## 개념

**한 방향으로 끝까지** 탐색한 후 되돌아와 다른 방향을 탐색합니다. 스택(재귀 포함)을 사용합니다.

---

## 시간 복잡도

| | 복잡도 |
|--|--------|
| 시간 | O(V + E) |
| 공간 | O(V) — 재귀 스택 |

---

## 구현 (C++)

### 재귀 방식

```cpp
#include <cstdio>
#include <cstring>

const int MAXV = 1005;
const int MAXE = 10005;

int head[MAXV], nxt[MAXE], to[MAXE], ecnt;
bool visited[MAXV];

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

int main() {
    // 그래프: 0-1, 0-2, 1-3, 1-4, 2-5
    addEdge(0, 1); addEdge(0, 2);
    addEdge(1, 0); addEdge(1, 3); addEdge(1, 4);
    addEdge(2, 0); addEdge(2, 5);
    addEdge(3, 1); addEdge(4, 1); addEdge(5, 2);

    memset(visited, false, sizeof(visited));
    dfs(0);  // 0 2 5 1 4 3 (인접 리스트 순서에 따라 다름)
    printf("\n");
    return 0;
}
```

### 반복(스택) 방식

```cpp
void dfsIterative(int start, int V) {
    int stack[MAXV], top = 0;
    memset(visited, false, sizeof(bool) * (V + 1));
    stack[top++] = start;

    while (top > 0) {
        int u = stack[--top];
        if (visited[u]) continue;
        visited[u] = true;
        printf("%d ", u);
        for (int e = head[u]; e; e = nxt[e]) {
            if (!visited[to[e]])
                stack[top++] = to[e];
        }
    }
}
```

---

## 활용: 연결 요소 (Connected Components)

```cpp
#include <cstdio>
#include <cstring>

const int MAXV = 1005;
const int MAXE = 10005;

int head[MAXV], nxt[MAXE], to[MAXE], ecnt;
bool visited[MAXV];

void addEdge(int u, int v) {
    to[++ecnt] = v; nxt[ecnt] = head[u]; head[u] = ecnt;
}

void dfs(int u) {
    visited[u] = true;
    for (int e = head[u]; e; e = nxt[e])
        if (!visited[to[e]])
            dfs(to[e]);
}

int countComponents(int n) {
    memset(visited, false, sizeof(bool) * (n + 1));
    int count = 0;
    for (int i = 0; i < n; i++) {
        if (!visited[i]) {
            dfs(i);
            count++;
        }
    }
    return count;
}
```

---

## 활용: 위상 정렬 (Topological Sort)

```cpp
#include <cstdio>
#include <cstring>

const int MAXV = 1005;
const int MAXE = 10005;

int head[MAXV], nxt[MAXE], to[MAXE], ecnt;
bool visited[MAXV];
int result[MAXV], resCnt;

void addEdge(int u, int v) {
    to[++ecnt] = v; nxt[ecnt] = head[u]; head[u] = ecnt;
}

void dfsTopoSort(int u) {
    visited[u] = true;
    for (int e = head[u]; e; e = nxt[e])
        if (!visited[to[e]])
            dfsTopoSort(to[e]);
    result[resCnt++] = u;  // 후위 순서로 추가
}

void topologicalSort(int n) {
    memset(visited, false, sizeof(bool) * n);
    resCnt = 0;
    for (int i = 0; i < n; i++)
        if (!visited[i])
            dfsTopoSort(i);

    // result를 뒤집으면 위상 정렬 순서
    for (int i = resCnt - 1; i >= 0; i--)
        printf("%d ", result[i]);
    printf("\n");
}
```

---

## 활용: 백트래킹 (Backtracking)

```cpp
#include <cstdio>

const int MAXN = 10;
int perm[MAXN];
bool used[MAXN];
int N;

void backtrack(int depth) {
    if (depth == N) {
        for (int i = 0; i < N; i++)
            printf("%d ", perm[i]);
        printf("\n");
        return;
    }
    for (int i = 1; i <= N; i++) {
        if (!used[i]) {
            used[i] = true;
            perm[depth] = i;
            backtrack(depth + 1);
            used[i] = false;  // 되돌리기
        }
    }
}

int main() {
    N = 3;
    backtrack(0);
    // 1 2 3 / 1 3 2 / 2 1 3 / 2 3 1 / 3 1 2 / 3 2 1
    return 0;
}
```

---

## 연습 문제

- BOJ 1260 - DFS와 BFS
- BOJ 2667 - 단지번호붙이기
- LeetCode 200 - Number of Islands
