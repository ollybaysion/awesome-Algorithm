---
title: "배열 (Array)"
tags: [array, index, random-access]
---

# 배열 (Array)

## 개념

배열은 **같은 타입의 원소를 연속된 메모리 공간에 저장**하는 자료구조입니다.

- 인덱스로 임의 접근(Random Access) 가능 → **O(1)**
- C++에서는 정적 배열(`int arr[N]`)과 동적 배열(`new int[n]`)을 사용

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

## 구현 예시 (C++)

```cpp
#include <cstdio>
#include <cstring>

const int MAXN = 100;

int main() {
    // 배열 생성
    int arr[5] = {1, 2, 3, 4, 5};
    int n = 5;

    // 접근 → O(1)
    printf("%d\n", arr[2]);  // 3

    // 삽입 (끝)
    arr[n++] = 6;  // O(1)

    // 삽입 (중간, 인덱스 2에 99 삽입) → O(n)
    for (int i = n; i > 2; i--)
        arr[i] = arr[i - 1];
    arr[2] = 99;
    n++;
    // arr = {1, 2, 99, 3, 4, 5, 6}

    // 삭제 (인덱스 2 제거) → O(n)
    for (int i = 2; i < n - 1; i++)
        arr[i] = arr[i + 1];
    n--;
    // arr = {1, 2, 3, 4, 5, 6}

    return 0;
}
```

---

## 2차원 배열

```cpp
#include <cstdio>
#include <cstring>

int matrix[3][4];

int main() {
    // 0으로 초기화
    memset(matrix, 0, sizeof(matrix));

    // 접근
    matrix[1][2] = 7;
    printf("%d\n", matrix[1][2]);  // 7

    return 0;
}
```

---

## 자주 쓰이는 패턴

### 투 포인터 (Two Pointers)

```cpp
#include <cstdio>

// 직접 정렬 (삽입 정렬)
void sortArr(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i], j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}

bool twoSum(int arr[], int n, int target) {
    sortArr(arr, n);
    int lo = 0, hi = n - 1;
    while (lo < hi) {
        int s = arr[lo] + arr[hi];
        if (s == target) return true;
        else if (s < target) lo++;
        else hi--;
    }
    return false;
}
```

### 슬라이딩 윈도우 (Sliding Window)

```cpp
int maxSumSubarray(int arr[], int n, int k) {
    int windowSum = 0;
    for (int i = 0; i < k; i++)
        windowSum += arr[i];
    int maxSum = windowSum;
    for (int i = k; i < n; i++) {
        windowSum += arr[i] - arr[i - k];
        if (windowSum > maxSum) maxSum = windowSum;
    }
    return maxSum;
}
```

---

## 연습 문제

- BOJ 10989 - 수 정렬하기 3
- BOJ 2577 - 숫자의 개수
- LeetCode 1 - Two Sum
