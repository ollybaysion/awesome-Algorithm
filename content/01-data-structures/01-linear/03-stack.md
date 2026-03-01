---
title: "스택 (Stack)"
tags: [stack, LIFO, push, pop]
---

# 스택 (Stack)

## 개념

**LIFO (Last In, First Out)** — 마지막에 넣은 것이 먼저 나오는 자료구조입니다.

```
push(1) push(2) push(3) → [1, 2, 3]
pop() → 3,  pop() → 2,  pop() → 1
```

---

## 시간 복잡도

| 연산 | 복잡도 |
|------|--------|
| push (삽입) | O(1) |
| pop (삭제) | O(1) |
| peek (top 조회) | O(1) |
| 탐색 | O(n) |

---

## 구현 (Python)

Python의 `list`는 스택으로 바로 사용 가능합니다.

```python
stack = []

stack.append(1)   # push
stack.append(2)
stack.append(3)

print(stack[-1])  # peek → 3
stack.pop()       # pop  → 3

print(stack)      # [1, 2]
```

### 직접 구현

```python
class Stack:
    def __init__(self):
        self._data = []

    def push(self, val): self._data.append(val)
    def pop(self):       return self._data.pop()
    def peek(self):      return self._data[-1]
    def is_empty(self):  return len(self._data) == 0
    def size(self):      return len(self._data)
```

---

## 활용 예시

### 괄호 유효성 검사

```python
def is_valid(s):
    stack = []
    mapping = {')': '(', ']': '[', '}': '{'}
    for c in s:
        if c in mapping:
            top = stack.pop() if stack else '#'
            if mapping[c] != top:
                return False
        else:
            stack.append(c)
    return not stack

print(is_valid("()[]{}"))   # True
print(is_valid("([)]"))     # False
```

### 후위 표기식 계산

```python
def eval_postfix(expr):
    stack = []
    for token in expr.split():
        if token.lstrip('-').isdigit():
            stack.append(int(token))
        else:
            b, a = stack.pop(), stack.pop()
            if   token == '+': stack.append(a + b)
            elif token == '-': stack.append(a - b)
            elif token == '*': stack.append(a * b)
            elif token == '/': stack.append(int(a / b))
    return stack[0]

print(eval_postfix("3 4 + 2 *"))   # 14
```

### 단조 스택 (Monotonic Stack)

```python
def next_greater(arr):
    """각 원소의 오른쪽 첫 번째 더 큰 값"""
    n = len(arr)
    result = [-1] * n
    stack = []  # 인덱스 저장
    for i in range(n):
        while stack and arr[stack[-1]] < arr[i]:
            result[stack.pop()] = arr[i]
        stack.append(i)
    return result

print(next_greater([2, 1, 2, 4, 3]))  # [4, 2, 4, -1, -1]
```

---

## 연습 문제

- BOJ 10828 - 스택
- BOJ 9012 - 괄호
- LeetCode 739 - Daily Temperatures
