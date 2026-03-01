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

## 구현 (Python)

### 간단한 버전

```python
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left   = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right  = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

print(quick_sort([3, 6, 8, 10, 1, 2, 1]))
# [1, 1, 2, 3, 6, 8, 10]
```

### In-place 버전 (Lomuto partition)

```python
def quick_sort_inplace(arr, lo=0, hi=None):
    if hi is None:
        hi = len(arr) - 1
    if lo < hi:
        p = partition(arr, lo, hi)
        quick_sort_inplace(arr, lo, p - 1)
        quick_sort_inplace(arr, p + 1, hi)

def partition(arr, lo, hi):
    pivot = arr[hi]
    i = lo - 1
    for j in range(lo, hi):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i+1], arr[hi] = arr[hi], arr[i+1]
    return i + 1

arr = [3, 6, 8, 10, 1, 2, 1]
quick_sort_inplace(arr)
print(arr)  # [1, 1, 2, 3, 6, 8, 10]
```

---

## 최악 케이스 방지

피벗을 **무작위(random)**로 선택하면 최악 케이스 확률을 낮출 수 있습니다.

```python
import random

def randomized_quick_sort(arr, lo, hi):
    if lo < hi:
        rand_idx = random.randint(lo, hi)
        arr[rand_idx], arr[hi] = arr[hi], arr[rand_idx]
        p = partition(arr, lo, hi)
        randomized_quick_sort(arr, lo, p - 1)
        randomized_quick_sort(arr, p + 1, hi)
```

---

## 연습 문제

- BOJ 2751 - 수 정렬하기 2
- LeetCode 215 - Kth Largest Element in an Array (Quick Select)
