---
title: "Heap (우선순위 큐) 구현"
tags: [heap, priority-queue, min-heap, max-heap, no-stl]
---

# Heap (우선순위 큐) — STL 없이 구현

## 이진 힙 성질

완전 이진 트리를 **배열**로 표현.

```
인덱스 1 기반:
  부모: i / 2
  왼쪽 자식: 2*i
  오른쪽 자식: 2*i + 1
```

---

## Min-Heap 구현 (C++)

```cpp
struct MinHeap {
    static const int MAXN = 1000005;
    int data[MAXN];
    int sz = 0;

    void push(int val) {
        data[++sz] = val;
        // sift up
        int i = sz;
        while (i > 1 && data[i] < data[i/2]) {
            swap(data[i], data[i/2]);
            i /= 2;
        }
    }

    int top() { return data[1]; }

    void pop() {
        data[1] = data[sz--];
        // sift down
        int i = 1;
        while (true) {
            int smallest = i;
            int l = 2*i, r = 2*i+1;
            if (l <= sz && data[l] < data[smallest]) smallest = l;
            if (r <= sz && data[r] < data[smallest]) smallest = r;
            if (smallest == i) break;
            swap(data[i], data[smallest]);
            i = smallest;
        }
    }

    bool empty() { return sz == 0; }
    int  size()  { return sz; }
};
```

---

## 템플릿 버전 (비교 함수 지원)

```cpp
template<typename T, typename Cmp = Less<T>>
struct PriorityQueue {
    static const int MAXN = 1000005;
    T    data[MAXN];
    int  sz = 0;
    Cmp  cmp;

    void push(const T& val) {
        data[++sz] = val;
        for (int i = sz; i > 1 && cmp(data[i], data[i/2]); i /= 2)
            swap(data[i], data[i/2]);
    }

    T top() { return data[1]; }

    void pop() {
        data[1] = data[sz--];
        int i = 1;
        while (true) {
            int best = i, l = 2*i, r = 2*i+1;
            if (l <= sz && cmp(data[l], data[best])) best = l;
            if (r <= sz && cmp(data[r], data[best])) best = r;
            if (best == i) break;
            swap(data[i], data[best]);
            i = best;
        }
    }

    bool empty() { return sz == 0; }
};

// 사용 예
struct Less { bool operator()(int a, int b) { return a < b; } };  // Min-Heap
struct Greater { bool operator()(int a, int b) { return a > b; } }; // Max-Heap
```

---

## Heap 정렬

```cpp
void heap_sort(int* arr, int n) {
    // 1. Build heap (bottom-up) — O(n)
    // 인덱스 0 기반으로 처리
    for (int i = n/2 - 1; i >= 0; i--) {
        int x = i;
        while (true) {
            int largest = x, l = 2*x+1, r = 2*x+2;
            if (l < n && arr[l] > arr[largest]) largest = l;
            if (r < n && arr[r] > arr[largest]) largest = r;
            if (largest == x) break;
            swap(arr[x], arr[largest]);
            x = largest;
        }
    }
    // 2. Extract max 반복 — O(n log n)
    for (int end = n-1; end > 0; end--) {
        swap(arr[0], arr[end]);
        int x = 0;
        while (true) {
            int largest = x, l = 2*x+1, r = 2*x+2;
            if (l < end && arr[l] > arr[largest]) largest = l;
            if (r < end && arr[r] > arr[largest]) largest = r;
            if (largest == x) break;
            swap(arr[x], arr[largest]);
            x = largest;
        }
    }
}
```

---

## 다익스트라에서의 활용

```cpp
// (거리, 노드) 쌍을 Min-Heap으로 관리
struct PairMinHeap {
    static const int MAXN = 300005;
    pair<int,int> data[MAXN];  // (dist, node)
    int sz = 0;

    // pair 비교: first(거리) 기준
    void push(int dist, int node) {
        data[++sz] = {dist, node};
        for (int i = sz; i > 1 && data[i].first < data[i/2].first; i /= 2)
            swap(data[i], data[i/2]);
    }
    pair<int,int> top() { return data[1]; }
    void pop() {
        data[1] = data[sz--];
        int i = 1;
        while (true) {
            int best = i, l = 2*i, r = 2*i+1;
            if (l <= sz && data[l].first < data[best].first) best = l;
            if (r <= sz && data[r].first < data[best].first) best = r;
            if (best == i) break;
            swap(data[i], data[best]); i = best;
        }
    }
    bool empty() { return sz == 0; }
};
```

---

## 연습 문제

- BOJ 11279 - 최대 힙
- BOJ 1927 - 최소 힙
- BOJ 11286 - 절댓값 힙
