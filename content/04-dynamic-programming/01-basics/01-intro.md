---
title: "DP 개념과 접근법"
tags: [dynamic-programming, memoization, tabulation, optimal-substructure]
---

# 동적 프로그래밍 (DP)

## 개념

**중복되는 부분 문제(Overlapping Subproblems)**를 한 번만 계산하고 저장해 재활용하는 최적화 기법입니다.

### DP 적용 조건

1. **최적 부분 구조 (Optimal Substructure)**: 전체 문제의 최적해가 부분 문제의 최적해로 구성됩니다.
2. **중복 부분 문제 (Overlapping Subproblems)**: 같은 부분 문제가 여러 번 등장합니다.

---

## Top-Down vs Bottom-Up

### Top-Down (메모이제이션)

재귀 호출 + 결과 캐시

```python
def fib_memo(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fib_memo(n-1, memo) + fib_memo(n-2, memo)
    return memo[n]

print(fib_memo(10))  # 55
```

### Bottom-Up (타뷸레이션)

작은 문제부터 반복문으로 채워 올라감

```python
def fib_tab(n):
    if n <= 1:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]

print(fib_tab(10))  # 55
```

| 비교 | Top-Down | Bottom-Up |
|------|----------|-----------|
| 구현 | 재귀 + 메모 | 반복 + 배열 |
| 장점 | 필요한 부분만 계산 | 스택 오버플로우 없음 |
| 단점 | 재귀 오버헤드 | 모든 부분 문제 계산 |

---

## DP 문제 풀이 프레임워크

1. **상태 정의**: `dp[i]`가 무엇을 의미하는지 명확히 정의
2. **점화식 도출**: 상태 간의 관계를 수식으로 표현
3. **초기값 설정**: 기저 케이스(base case) 설정
4. **계산 순서 결정**: 의존 관계에 따라 순서 결정

---

## 대표 예시: 계단 오르기

```
n개의 계단을 1칸 또는 2칸씩 오를 수 있을 때, 경우의 수는?
```

**상태 정의**: `dp[i]` = i번째 계단까지 오르는 경우의 수

**점화식**: `dp[i] = dp[i-1] + dp[i-2]`
(i-1번째에서 1칸 오르거나 / i-2번째에서 2칸 오르거나)

**초기값**: `dp[1] = 1`, `dp[2] = 2`

```python
def climb_stairs(n):
    if n <= 2:
        return n
    dp = [0] * (n + 1)
    dp[1], dp[2] = 1, 2
    for i in range(3, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]

print(climb_stairs(5))  # 8
```

---

## 연습 문제

- BOJ 1003 - 피보나치 함수
- BOJ 2579 - 계단 오르기
- LeetCode 70 - Climbing Stairs
