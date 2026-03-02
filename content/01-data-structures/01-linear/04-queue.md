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

## 구현 (C++)

배열 기반 큐 (충분히 큰 배열 + front/back 포인터)를 사용합니다.

```cpp
#include <cstdio>

const int MAXN = 100005;

struct Queue {
    int data[MAXN];
    int front, back;

    void init()       { front = back = 0; }
    void push(int x)  { data[back++] = x; }
    int  pop()        { return data[front++]; }
    int  peek()       { return data[front]; }
    bool empty()      { return front == back; }
    int  size()       { return back - front; }
};

int main() {
    Queue q;
    q.init();

    q.push(1);   // enqueue
    q.push(2);
    q.push(3);

    printf("%d\n", q.peek());  // peek → 1
    printf("%d\n", q.pop());   // dequeue → 1
    printf("size = %d\n", q.size());  // 2
    return 0;
}
```

---

## 덱 (Deque — Double Ended Queue)

양쪽 끝에서 삽입/삭제가 가능합니다.

```cpp
#include <cstdio>

const int MAXN = 100005;
const int OFFSET = 50000;  // 앞쪽 삽입을 위한 오프셋

struct Deque {
    int data[MAXN];
    int front, back;

    void init()          { front = back = OFFSET; }
    void pushFront(int x){ data[--front] = x; }
    void pushBack(int x) { data[back++] = x; }
    int  popFront()      { return data[front++]; }
    int  popBack()       { return data[--back]; }
    bool empty()         { return front == back; }
    int  size()          { return back - front; }
};

int main() {
    Deque dq;
    dq.init();

    dq.pushBack(1); dq.pushBack(2); dq.pushBack(3);
    dq.pushFront(0);
    dq.pushBack(4);
    // [0, 1, 2, 3, 4]

    printf("%d\n", dq.popFront());  // 0
    printf("%d\n", dq.popBack());   // 4
    return 0;
}
```

---

## 우선순위 큐 (Priority Queue)

값이 아닌 **우선순위(priority)**에 따라 원소를 꺼냅니다.
이진 힙으로 직접 구현합니다.

```cpp
#include <cstdio>

const int MAXN = 100005;

struct MinHeap {
    int data[MAXN];
    int sz;

    void init() { sz = 0; }

    void push(int x) {
        data[++sz] = x;
        int i = sz;
        while (i > 1 && data[i] < data[i/2]) {
            int tmp = data[i]; data[i] = data[i/2]; data[i/2] = tmp;
            i /= 2;
        }
    }

    int pop() {
        int ret = data[1];
        data[1] = data[sz--];
        int i = 1;
        while (true) {
            int c = i * 2;
            if (c > sz) break;
            if (c + 1 <= sz && data[c+1] < data[c]) c++;
            if (data[c] >= data[i]) break;
            int tmp = data[i]; data[i] = data[c]; data[c] = tmp;
            i = c;
        }
        return ret;
    }

    int top()   { return data[1]; }
    bool empty(){ return sz == 0; }
};

int main() {
    MinHeap pq;
    pq.init();

    pq.push(3);
    pq.push(1);
    pq.push(2);

    printf("%d\n", pq.pop());  // 1 (가장 작은 값)
    printf("%d\n", pq.pop());  // 2
    return 0;
}
```

---

## 활용 예시: BFS

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

void bfs(int start) {
    int q[MAXV], front = 0, back = 0;
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
    printf("\n");
}
```

---

## 연습 문제

- BOJ 10845 - 큐
- BOJ 1866 - 테트리스 게임
- LeetCode 102 - Binary Tree Level Order Traversal
