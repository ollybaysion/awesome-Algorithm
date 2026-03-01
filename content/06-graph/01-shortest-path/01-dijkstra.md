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

## 구현 (Python — 우선순위 큐)

```python
import heapq

def dijkstra(graph, start):
    """
    graph: {node: [(cost, neighbor), ...]}
    반환: 시작 노드에서 각 노드까지 최단 거리 딕셔너리
    """
    dist = {node: float('inf') for node in graph}
    dist[start] = 0
    heap = [(0, start)]   # (거리, 노드)

    while heap:
        cost, u = heapq.heappop(heap)
        if cost > dist[u]:
            continue   # 이미 처리된 노드
        for weight, v in graph[u]:
            new_cost = dist[u] + weight
            if new_cost < dist[v]:
                dist[v] = new_cost
                heapq.heappush(heap, (new_cost, v))

    return dist

# 예시
graph = {
    'A': [(1,'B'), (4,'C')],
    'B': [(1,'A'), (2,'C'), (5,'D')],
    'C': [(4,'A'), (2,'B'), (1,'D')],
    'D': [(5,'B'), (1,'C')]
}
print(dijkstra(graph, 'A'))
# {'A': 0, 'B': 1, 'C': 3, 'D': 4}
```

---

## 경로 복원

```python
def dijkstra_with_path(graph, start, end):
    dist = {node: float('inf') for node in graph}
    dist[start] = 0
    prev = {node: None for node in graph}
    heap = [(0, start)]

    while heap:
        cost, u = heapq.heappop(heap)
        if cost > dist[u]:
            continue
        for weight, v in graph[u]:
            new_cost = dist[u] + weight
            if new_cost < dist[v]:
                dist[v] = new_cost
                prev[v] = u
                heapq.heappush(heap, (new_cost, v))

    # 경로 역추적
    path = []
    node = end
    while node is not None:
        path.append(node)
        node = prev[node]
    path.reverse()
    return dist[end], path

cost, path = dijkstra_with_path(graph, 'A', 'D')
print(cost, path)  # 4 ['A', 'B', 'C', 'D']
```

---

## BOJ 스타일 입력 처리

```python
import sys, heapq
input = sys.stdin.readline

def solve():
    V, E = map(int, input().split())
    start = int(input())
    graph = [[] for _ in range(V + 1)]

    for _ in range(E):
        u, v, w = map(int, input().split())
        graph[u].append((w, v))

    INF = float('inf')
    dist = [INF] * (V + 1)
    dist[start] = 0
    heap = [(0, start)]

    while heap:
        cost, u = heapq.heappop(heap)
        if cost > dist[u]:
            continue
        for w, v in graph[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(heap, (dist[v], v))

    for i in range(1, V + 1):
        print(dist[i] if dist[i] != INF else "INF")
```

---

## 연습 문제

- BOJ 1753 - 최단경로
- BOJ 1916 - 최소비용 구하기
- LeetCode 743 - Network Delay Time
