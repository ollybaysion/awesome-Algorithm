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

## 구현 (C++)

```cpp
#include <cstdio>

const int MAXN = 100005;

struct Stack {
    int data[MAXN];
    int sz;

    void init()       { sz = 0; }
    void push(int x)  { data[sz++] = x; }
    int  pop()        { return data[--sz]; }
    int  top()        { return data[sz - 1]; }
    bool empty()      { return sz == 0; }
    int  size()       { return sz; }
};

int main() {
    Stack st;
    st.init();

    st.push(1);
    st.push(2);
    st.push(3);

    printf("%d\n", st.top());  // peek → 3
    st.pop();                  // pop  → 3

    printf("size = %d\n", st.size());  // 2
    return 0;
}
```

---

## 활용 예시

### 괄호 유효성 검사

```cpp
#include <cstdio>
#include <cstring>

bool isValid(const char* s) {
    char stack[10005];
    int top = 0;
    int len = strlen(s);

    for (int i = 0; i < len; i++) {
        char c = s[i];
        if (c == '(' || c == '[' || c == '{') {
            stack[top++] = c;
        } else {
            if (top == 0) return false;
            char t = stack[--top];
            if ((c == ')' && t != '(') ||
                (c == ']' && t != '[') ||
                (c == '}' && t != '{'))
                return false;
        }
    }
    return top == 0;
}

int main() {
    printf("%d\n", isValid("()[]{}"));  // 1 (true)
    printf("%d\n", isValid("([)]"));    // 0 (false)
    return 0;
}
```

### 후위 표기식 계산

```cpp
#include <cstdio>
#include <cstring>

int evalPostfix(const char* expr) {
    int stack[1005];
    int top = 0;
    int len = strlen(expr);
    int i = 0;

    while (i < len) {
        if (expr[i] == ' ') { i++; continue; }

        if ((expr[i] >= '0' && expr[i] <= '9') ||
            (expr[i] == '-' && i + 1 < len && expr[i+1] >= '0' && expr[i+1] <= '9')) {
            int sign = 1, num = 0;
            if (expr[i] == '-') { sign = -1; i++; }
            while (i < len && expr[i] >= '0' && expr[i] <= '9')
                num = num * 10 + (expr[i++] - '0');
            stack[top++] = sign * num;
        } else {
            int b = stack[--top], a = stack[--top];
            if (expr[i] == '+') stack[top++] = a + b;
            else if (expr[i] == '-') stack[top++] = a - b;
            else if (expr[i] == '*') stack[top++] = a * b;
            else if (expr[i] == '/') stack[top++] = a / b;
            i++;
        }
    }
    return stack[0];
}

int main() {
    printf("%d\n", evalPostfix("3 4 + 2 *"));  // 14
    return 0;
}
```

### 단조 스택 (Monotonic Stack)

```cpp
#include <cstdio>

// 각 원소의 오른쪽 첫 번째 더 큰 값
void nextGreater(int arr[], int n, int result[]) {
    int stack[100005];  // 인덱스 저장
    int top = 0;

    for (int i = 0; i < n; i++) result[i] = -1;

    for (int i = 0; i < n; i++) {
        while (top > 0 && arr[stack[top - 1]] < arr[i])
            result[stack[--top]] = arr[i];
        stack[top++] = i;
    }
}

int main() {
    int arr[] = {2, 1, 2, 4, 3};
    int res[5];
    nextGreater(arr, 5, res);
    for (int i = 0; i < 5; i++)
        printf("%d ", res[i]);  // 4 2 4 -1 -1
    printf("\n");
    return 0;
}
```

---

## 연습 문제

- BOJ 10828 - 스택
- BOJ 9012 - 괄호
- LeetCode 739 - Daily Temperatures
