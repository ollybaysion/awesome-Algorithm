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

## 구현 (Python)

### 재귀 방식

```python
def dfs_recursive(graph, node, visited=None):
    if visited is None:
        visited = set()
    visited.add(node)
    print(node, end=' ')
    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs_recursive(graph, neighbor, visited)
    return visited

graph = {0:[1,2], 1:[0,3,4], 2:[0,5], 3:[1], 4:[1], 5:[2]}
dfs_recursive(graph, 0)  # 0 1 3 4 2 5
```

### 반복(스택) 방식

```python
def dfs_iterative(graph, start):
    visited = set()
    stack = [start]
    order = []

    while stack:
        node = stack.pop()
        if node not in visited:
            visited.add(node)
            order.append(node)
            for neighbor in reversed(graph[node]):
                if neighbor not in visited:
                    stack.append(neighbor)
    return order
```

---

## 활용: 연결 요소 (Connected Components)

```python
def count_components(n, edges):
    graph = {i: [] for i in range(n)}
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)

    visited = set()
    count = 0

    def dfs(node):
        visited.add(node)
        for nb in graph[node]:
            if nb not in visited:
                dfs(nb)

    for i in range(n):
        if i not in visited:
            dfs(i)
            count += 1
    return count

print(count_components(5, [[0,1],[1,2],[3,4]]))  # 2
```

---

## 활용: 위상 정렬 (Topological Sort)

```python
from collections import defaultdict

def topological_sort(n, edges):
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)

    visited = set()
    result = []

    def dfs(node):
        visited.add(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                dfs(neighbor)
        result.append(node)   # 후위 순서로 추가

    for i in range(n):
        if i not in visited:
            dfs(i)

    return result[::-1]

print(topological_sort(4, [[0,1],[0,2],[1,3],[2,3]]))
# [0, 2, 1, 3] (여러 정답 가능)
```

---

## 활용: 백트래킹 (Backtracking)

```python
def permutations(nums):
    result = []
    def backtrack(path, remaining):
        if not remaining:
            result.append(path[:])
            return
        for i, num in enumerate(remaining):
            path.append(num)
            backtrack(path, remaining[:i] + remaining[i+1:])
            path.pop()  # 되돌리기
    backtrack([], nums)
    return result

print(permutations([1,2,3]))
```

---

## 연습 문제

- BOJ 1260 - DFS와 BFS
- BOJ 2667 - 단지번호붙이기
- LeetCode 200 - Number of Islands
