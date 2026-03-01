---
title: "큐 (Queue)"
tags: [queue, FIFO, deque, priority-queue]
---

# 큐 (Queue)

## 개념

**FIFO (First In, First Out)** — 먼저 넣은 것이 먼저 나오는 자료구조입니다.

```
enqueue(1) enqueue(2) enqueue(3)
Front → [1, 2, 3] ← Rear
dequeue() → 1,  dequeue() → 2
```

---

## 시간 복잡도

| 연산 | 복잡도 |
|------|--------|
| enqueue | O(1) |
| dequeue | O(1) |
| peek (front) | O(1) |

---

## 구현 (Python)

Python에서는 `collections.deque`를 사용하는 것이 효율적입니다.
`list.pop(0)`은 O(n)이므로 큐에 부적합합니다.

```python
from collections import deque

q = deque()

q.append(1)      # enqueue
q.append(2)
q.append(3)

print(q[0])      # peek → 1
print(q.popleft())  # dequeue → 1
print(q)         # deque([2, 3])
```

---

## 덱 (Deque — Double Ended Queue)

양쪽 끝에서 삽입/삭제가 가능합니다.

```python
from collections import deque
dq = deque([1, 2, 3])

dq.appendleft(0)   # 앞에 추가 → deque([0,1,2,3])
dq.append(4)       # 뒤에 추가 → deque([0,1,2,3,4])
dq.popleft()       # 앞에서 제거 → 0
dq.pop()           # 뒤에서 제거 → 4
```

---

## 우선순위 큐 (Priority Queue)

값이 아닌 **우선순위(priority)**에 따라 원소를 꺼냅니다.
Python의 `heapq`는 **최소 힙(min-heap)**을 기본으로 사용합니다.

```python
import heapq

pq = []
heapq.heappush(pq, 3)
heapq.heappush(pq, 1)
heapq.heappush(pq, 2)

print(heapq.heappop(pq))  # 1 (가장 작은 값)
print(heapq.heappop(pq))  # 2

# 최대 힙: 음수로 변환
heapq.heappush(pq, -5)
heapq.heappush(pq, -3)
print(-heapq.heappop(pq))  # 5
```

---

## 활용 예시: BFS

```python
from collections import deque

def bfs(graph, start):
    visited = set([start])
    q = deque([start])
    order = []
    while q:
        node = q.popleft()
        order.append(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                q.append(neighbor)
    return order

graph = {0:[1,2], 1:[3], 2:[3,4], 3:[], 4:[]}
print(bfs(graph, 0))  # [0, 1, 2, 3, 4]
```

---

## 연습 문제

- BOJ 10845 - 큐
- BOJ 1866 - 테트리스 게임
- LeetCode 102 - Binary Tree Level Order Traversal
