---
title: "연결 리스트 (Linked List)"
tags: [linked-list, pointer, node]
---

# 연결 리스트 (Linked List)

## 개념

**노드(Node)**들이 포인터로 연결된 자료구조입니다. 각 노드는 **데이터 + 다음 노드 포인터**로 구성됩니다.

```
[data|next] → [data|next] → [data|next] → NULL
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

## 구현 (C++ — 배열 기반)

메모리 풀(배열)로 구현하면 동적 할당 없이도 연결 리스트를 사용할 수 있습니다.

```cpp
#include <cstdio>

const int MAXN = 100005;

struct Node {
    int data;
    int next;  // 다음 노드의 인덱스 (-1이면 끝)
} pool[MAXN];

int head = -1;
int poolCnt = 0;

int newNode(int data) {
    pool[poolCnt].data = data;
    pool[poolCnt].next = -1;
    return poolCnt++;
}

// 맨 앞에 삽입 → O(1)
void prepend(int data) {
    int nd = newNode(data);
    pool[nd].next = head;
    head = nd;
}

// 맨 뒤에 삽입 → O(n)
void append(int data) {
    int nd = newNode(data);
    if (head == -1) { head = nd; return; }
    int cur = head;
    while (pool[cur].next != -1)
        cur = pool[cur].next;
    pool[cur].next = nd;
}

// 값으로 삭제 → O(n)
void deleteNode(int data) {
    if (head == -1) return;
    if (pool[head].data == data) {
        head = pool[head].next;
        return;
    }
    int cur = head;
    while (pool[cur].next != -1) {
        if (pool[pool[cur].next].data == data) {
            pool[cur].next = pool[pool[cur].next].next;
            return;
        }
        cur = pool[cur].next;
    }
}

// 출력
void display() {
    int cur = head;
    while (cur != -1) {
        printf("%d", pool[cur].data);
        cur = pool[cur].next;
        if (cur != -1) printf(" -> ");
    }
    printf("\n");
}

int main() {
    append(1); append(2); append(3);
    prepend(0);
    display();       // 0 -> 1 -> 2 -> 3
    deleteNode(2);
    display();       // 0 -> 1 -> 3
    return 0;
}
```

---

## 주요 알고리즘

### 연결 리스트 뒤집기

```cpp
void reverse() {
    int prev = -1, cur = head;
    while (cur != -1) {
        int next = pool[cur].next;
        pool[cur].next = prev;
        prev = cur;
        cur = next;
    }
    head = prev;
}
```

### 사이클 감지 (Floyd's Algorithm)

포인터 기반 연결 리스트에서 사이클을 O(1) 공간으로 감지합니다.

```cpp
struct PNode {
    int data;
    PNode* next;
};

bool hasCycle(PNode* head) {
    PNode* slow = head;
    PNode* fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast)
            return true;
    }
    return false;
}
```

---

## 연습 문제

- LeetCode 206 - Reverse Linked List
- LeetCode 141 - Linked List Cycle
- LeetCode 21 - Merge Two Sorted Lists
