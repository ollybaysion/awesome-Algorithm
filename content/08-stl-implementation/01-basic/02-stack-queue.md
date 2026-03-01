---
title: "Stack / Queue / Deque 구현"
tags: [stack, queue, deque, circular-buffer, no-stl]
---

# Stack / Queue / Deque — STL 없이 구현

## Stack

```cpp
template<typename T>
struct Stack {
    static const int MAXN = 1000005;
    T   data[MAXN];
    int top_idx = -1;

    void push(const T& v) { data[++top_idx] = v; }
    void pop()            { --top_idx; }
    T&   top()            { return data[top_idx]; }
    bool empty()          { return top_idx < 0; }
    int  size()           { return top_idx + 1; }
};
```

> 대회에서는 `static const int MAXN`을 문제 제한에 맞게 조정.

---

## Queue (원형 버퍼)

링 버퍼(Circular Buffer)를 사용하면 enqueue/dequeue 모두 O(1).

```cpp
template<typename T>
struct Queue {
    static const int MAXN = 1000005;
    T   data[MAXN];
    int head = 0, tail = 0;  // [head, tail) 범위 유효

    void push(const T& v) { data[tail++ % MAXN] = v; }
    void pop()            { head++; }
    T&   front()          { return data[head % MAXN]; }
    T&   back()           { return data[(tail-1) % MAXN]; }
    bool empty()          { return head == tail; }
    int  size()           { return tail - head; }
};
```

---

## Deque (이중 끝 큐)

```cpp
template<typename T>
struct Deque {
    static const int MAXN = 2000005;
    T   data[MAXN];
    int head, tail;

    Deque() : head(MAXN/2), tail(MAXN/2) {}

    void push_back(const T& v)  { data[tail++] = v; }
    void push_front(const T& v) { data[--head] = v; }
    void pop_back()  { --tail; }
    void pop_front() { ++head; }
    T&   front()     { return data[head]; }
    T&   back()      { return data[tail-1]; }
    T&   operator[](int i) { return data[head + i]; }
    bool empty()     { return head == tail; }
    int  size()      { return tail - head; }
};
```

---

## 단조 덱 (Monotonic Deque) — 슬라이딩 윈도우 최솟값

```cpp
// 크기 k인 슬라이딩 윈도우의 최솟값
// O(n)
void sliding_window_min(int* arr, int n, int k) {
    Deque<int> dq;   // 인덱스 저장
    for (int i = 0; i < n; i++) {
        // 윈도우 벗어난 원소 제거
        while (!dq.empty() && dq.front() < i - k + 1)
            dq.pop_front();
        // 현재 원소보다 큰 원소 제거 (최솟값 유지)
        while (!dq.empty() && arr[dq.back()] >= arr[i])
            dq.pop_back();
        dq.push_back(i);
        if (i >= k - 1)
            printf("%d ", arr[dq.front()]);
    }
}
```

---

## 연습 문제

- BOJ 10828 - 스택
- BOJ 10845 - 큐
- BOJ 10866 - 덱
- BOJ 11003 - 최솟값 찾기 (슬라이딩 윈도우)
