---
title: "시간·공간 복잡도"
tags: [complexity, Big-O, time-complexity, space-complexity]
---

# 시간·공간 복잡도

## Big-O 표기법

Big-O는 **알고리즘의 실행 시간(또는 공간)이 입력 크기 n에 따라 어떻게 증가하는지**를 나타냅니다.

> 정확한 연산 횟수보다 **증가율의 경향성**을 표현합니다.

### 주요 복잡도 비교

```
O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!)
```

---

## 시간 복잡도 (Time Complexity)

### O(1) — 상수 시간

```cpp
int getFirst(int arr[]) {
    return arr[0];  // 배열 크기와 무관하게 1번 연산
}
```

### O(log n) — 로그 시간

```cpp
int binarySearch(int arr[], int n, int target) {
    int lo = 0, hi = n - 1;
    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}
```

매 반복마다 탐색 범위가 절반으로 줄어듭니다.

### O(n) — 선형 시간

```cpp
int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++)
        if (arr[i] == target)
            return i;
    return -1;
}
```

### O(n log n) — 선형 로그 시간

- 합병 정렬, 퀵 정렬(평균), 힙 정렬
- 비교 기반 정렬의 **이론적 하한**

### O(n²) — 이차 시간

```cpp
void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n - i - 1; j++)  // 이중 루프 → O(n²)
            if (arr[j] > arr[j + 1]) {
                int tmp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = tmp;
            }
}
```

---

## 공간 복잡도 (Space Complexity)

알고리즘이 사용하는 **메모리의 양**을 나타냅니다.

| 알고리즘 | 공간 복잡도 |
|---------|-------------|
| 이진 탐색 (반복) | O(1) |
| 이진 탐색 (재귀) | O(log n) — 콜스택 |
| 합병 정렬 | O(n) — 임시 배열 |
| 퀵 정렬 | O(log n) — 평균 콜스택 |
| BFS | O(V + E) |

---

## 복잡도 분석 팁

1. **단순 루프** → O(n)
2. **중첩 루프** → O(n²) (루프당 n배)
3. **재귀 (절반씩 분할)** → O(log n)
4. **분할 후 합병** → O(n log n)
5. **모든 부분집합 탐색** → O(2ⁿ)
