---
title: "배열 (Array)"
tags: [array, index, random-access]
---

# 배열 (Array)

## 개념

배열은 **같은 타입의 원소를 연속된 메모리 공간에 저장**하는 자료구조입니다.

- 인덱스로 임의 접근(Random Access) 가능 → **O(1)**
- 크기가 고정된 정적 배열 / 동적으로 늘어나는 동적 배열(Python list, Java ArrayList)

---

## 시간 복잡도

| 연산 | 복잡도 |
|------|--------|
| 인덱스 접근 | O(1) |
| 탐색 (정렬 X) | O(n) |
| 탐색 (정렬 O, 이진 탐색) | O(log n) |
| 삽입 (끝) | O(1) 평균 |
| 삽입 (중간) | O(n) |
| 삭제 (중간) | O(n) |

---

## 구현 예시 (Python)

```python
# 배열 생성
arr = [1, 2, 3, 4, 5]

# 접근
print(arr[2])       # 3  → O(1)

# 삽입 (끝)
arr.append(6)       # O(1) amortized

# 삽입 (중간) - 이후 원소들이 한 칸씩 이동
arr.insert(2, 99)   # [1, 2, 99, 3, 4, 5, 6]  → O(n)

# 삭제
arr.pop()           # 끝 제거 → O(1)
arr.pop(2)          # 인덱스 2 제거 → O(n)

# 슬라이싱
print(arr[1:4])     # 인덱스 1~3 → O(k)
```

---

## 2차원 배열

```python
# n x m 행렬 초기화
n, m = 3, 4
matrix = [[0] * m for _ in range(n)]

# 접근
matrix[1][2] = 7
print(matrix[1][2])   # 7
```

> ⚠️ `[[0] * m] * n` 은 **같은 리스트를 n번 참조**하므로 주의!

---

## 자주 쓰이는 패턴

### 투 포인터 (Two Pointers)

```python
def two_sum(arr, target):
    arr.sort()
    lo, hi = 0, len(arr) - 1
    while lo < hi:
        s = arr[lo] + arr[hi]
        if s == target:
            return True
        elif s < target:
            lo += 1
        else:
            hi -= 1
    return False
```

### 슬라이딩 윈도우 (Sliding Window)

```python
def max_sum_subarray(arr, k):
    window_sum = sum(arr[:k])
    max_sum = window_sum
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)
    return max_sum
```

---

## 연습 문제

- BOJ 10989 - 수 정렬하기 3
- BOJ 2577 - 숫자의 개수
- LeetCode 1 - Two Sum
