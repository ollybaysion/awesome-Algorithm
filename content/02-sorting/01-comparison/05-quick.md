---
title: "퀵 정렬 (Quick Sort)"
tags: [quick-sort, pivot, partition, O(nlogn)]
---

# 퀵 정렬 (Quick Sort)

## 개념

**피벗(pivot)**을 기준으로 배열을 두 부분으로 분할하고 재귀적으로 정렬합니다.

1. 피벗을 선택합니다.
2. 피벗보다 작은 원소는 왼쪽, 큰 원소는 오른쪽으로 이동합니다.
3. 각 부분에 대해 재귀적으로 퀵 정렬을 수행합니다.

---

## 시간 복잡도

| 케이스 | 복잡도 |
|--------|--------|
| 최선 | O(n log n) |
| 평균 | O(n log n) |
| 최악 | O(n²) — 이미 정렬된 배열, 피벗이 최솟값/최댓값 |
| 공간 | O(log n) — 재귀 스택 |

> 실제로는 캐시 효율이 높아 합병 정렬보다 **빠른 경우가 많습니다**.

---

## 구현 (C++ — Lomuto Partition)

```cpp
#include <cstdio>

void swap(int& a, int& b) {
    int t = a; a = b; b = t;
}

int partition(int arr[], int lo, int hi) {
    int pivot = arr[hi];
    int i = lo - 1;
    for (int j = lo; j < hi; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[hi]);
    return i + 1;
}

void quickSort(int arr[], int lo, int hi) {
    if (lo < hi) {
        int p = partition(arr, lo, hi);
        quickSort(arr, lo, p - 1);
        quickSort(arr, p + 1, hi);
    }
}

int main() {
    int arr[] = {3, 6, 8, 10, 1, 2, 1};
    int n = 7;
    quickSort(arr, 0, n - 1);
    for (int i = 0; i < n; i++)
        printf("%d ", arr[i]);  // 1 1 2 3 6 8 10
    printf("\n");
    return 0;
}
```

---

## 최악 케이스 방지

피벗을 **무작위(random)**로 선택하면 최악 케이스 확률을 낮출 수 있습니다.

```cpp
#include <cstdlib>

void randomizedQuickSort(int arr[], int lo, int hi) {
    if (lo < hi) {
        // 랜덤 인덱스를 피벗으로 선택
        int randIdx = lo + rand() % (hi - lo + 1);
        swap(arr[randIdx], arr[hi]);
        int p = partition(arr, lo, hi);
        randomizedQuickSort(arr, lo, p - 1);
        randomizedQuickSort(arr, p + 1, hi);
    }
}
```

### Median-of-Three 피벗 선택

```cpp
void medianOfThreeSort(int arr[], int lo, int hi) {
    if (lo >= hi) return;
    int mid = (lo + hi) / 2;
    // lo, mid, hi 중 중간값을 피벗으로
    if (arr[lo] > arr[mid]) swap(arr[lo], arr[mid]);
    if (arr[lo] > arr[hi])  swap(arr[lo], arr[hi]);
    if (arr[mid] > arr[hi]) swap(arr[mid], arr[hi]);
    swap(arr[mid], arr[hi]);  // 피벗을 끝으로 이동
    int p = partition(arr, lo, hi);
    medianOfThreeSort(arr, lo, p - 1);
    medianOfThreeSort(arr, p + 1, hi);
}
```

---

## 연습 문제

- BOJ 2751 - 수 정렬하기 2
- LeetCode 215 - Kth Largest Element in an Array (Quick Select)
