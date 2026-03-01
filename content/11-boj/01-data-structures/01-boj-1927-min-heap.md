---
title: "BOJ 1927 - 최소 힙"
tags: [boj, data-structure, heap, silver2]
boj: 1927
tier: silver2
---

# BOJ 1927 - 최소 힙

## 문제 요약

최소 힙을 직접 구현하여 다음 연산 처리:
- `x > 0`: x를 힙에 삽입
- `x = 0`: 힙에서 최솟값 출력 후 삭제 (비어있으면 0)

## 접근법

1-indexed 이진 힙을 배열로 구현.

## 복잡도

연산당 O(log n)

## 코드

```cpp
#include <cstdio>

const int MAXN = 100005;
int heap[MAXN], sz;

void push(int x) {
    heap[++sz] = x;
    int i = sz;
    while (i > 1 && heap[i] < heap[i/2]) {
        int tmp = heap[i]; heap[i] = heap[i/2]; heap[i/2] = tmp;
        i /= 2;
    }
}

int pop() {
    if (sz == 0) return 0;
    int ret = heap[1];
    heap[1] = heap[sz--];
    int i = 1;
    while (true) {
        int c = i * 2;
        if (c > sz) break;
        if (c + 1 <= sz && heap[c+1] < heap[c]) c++;
        if (heap[c] >= heap[i]) break;
        int tmp = heap[i]; heap[i] = heap[c]; heap[c] = tmp;
        i = c;
    }
    return ret;
}

int main() {
    int n, x;
    scanf("%d", &n);
    while (n--) {
        scanf("%d", &x);
        if (x) push(x);
        else printf("%d\n", pop());
    }
    return 0;
}
```

## 풀이 포인트

- **push**: 말단에 추가 후 부모와 비교하며 상향 이동 (sift-up).
- **pop**: 루트 제거 후 말단을 루트로 이동, 자식과 비교하며 하향 이동 (sift-down).
- 자식 선택: 두 자식 중 더 작은 쪽 선택.

## 관련 문제

- BOJ 11279 - 최대 힙 (부호 반전 or 비교 반전)
- BOJ 11286 - 절댓값 힙 (절댓값 기준 정렬)
- BOJ 1655 - 가운데를 말해요 (최대 힙 + 최소 힙)
