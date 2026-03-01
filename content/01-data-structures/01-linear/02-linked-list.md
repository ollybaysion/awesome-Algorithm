---
title: "연결 리스트 (Linked List)"
tags: [linked-list, pointer, node]
---

# 연결 리스트 (Linked List)

## 개념

**노드(Node)**들이 포인터로 연결된 자료구조입니다. 각 노드는 **데이터 + 다음 노드 포인터**로 구성됩니다.

```
[data|next] → [data|next] → [data|next] → None
```

| 종류 | 설명 |
|------|------|
| 단일 연결 리스트 | 단방향 (next만 존재) |
| 이중 연결 리스트 | 양방향 (prev + next) |
| 원형 연결 리스트 | 마지막 노드가 첫 노드를 가리킴 |

---

## 시간 복잡도

| 연산 | 복잡도 |
|------|--------|
| 맨 앞 삽입/삭제 | O(1) |
| 중간 삽입/삭제 (노드 알고 있을 때) | O(1) |
| 탐색 | O(n) |
| 임의 접근 | O(n) |

> 배열 대비 **삽입/삭제가 빠르지만, 임의 접근이 느립니다**.

---

## 구현 (Python)

```python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def append(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        cur = self.head
        while cur.next:
            cur = cur.next
        cur.next = new_node

    def prepend(self, data):
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node

    def delete(self, data):
        if not self.head:
            return
        if self.head.data == data:
            self.head = self.head.next
            return
        cur = self.head
        while cur.next:
            if cur.next.data == data:
                cur.next = cur.next.next
                return
            cur = cur.next

    def display(self):
        result = []
        cur = self.head
        while cur:
            result.append(str(cur.data))
            cur = cur.next
        print(" → ".join(result))

# 사용 예시
ll = LinkedList()
ll.append(1)
ll.append(2)
ll.append(3)
ll.prepend(0)
ll.display()   # 0 → 1 → 2 → 3
ll.delete(2)
ll.display()   # 0 → 1 → 3
```

---

## 주요 알고리즘

### 연결 리스트 뒤집기

```python
def reverse(head):
    prev = None
    cur = head
    while cur:
        next_node = cur.next
        cur.next = prev
        prev = cur
        cur = next_node
    return prev
```

### 사이클 감지 (Floyd's Algorithm)

```python
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False
```

---

## 연습 문제

- LeetCode 206 - Reverse Linked List
- LeetCode 141 - Linked List Cycle
- LeetCode 21 - Merge Two Sorted Lists
