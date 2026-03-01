---
title: "Vector (동적 배열) 구현"
tags: [vector, dynamic-array, amortized, no-stl]
---

# Vector (동적 배열) — STL 없이 구현

## 핵심 아이디어

- 내부에 **힙 할당 배열** 유지
- 용량(capacity)이 꽉 차면 **2배로 재할당** → push_back 분할상환 O(1)

---

## 구현 (C++)

```cpp
template<typename T>
struct Vector {
    T*  data;
    int sz, cap;

    Vector() : data(nullptr), sz(0), cap(0) {}
    ~Vector() { delete[] data; }

    // 복사 생성자 / 대입 연산자 (필요 시)
    Vector(const Vector&) = delete;
    Vector& operator=(const Vector&) = delete;

    void reserve(int new_cap) {
        if (new_cap <= cap) return;
        T* tmp = new T[new_cap];
        for (int i = 0; i < sz; i++) tmp[i] = data[i];
        delete[] data;
        data = tmp;
        cap  = new_cap;
    }

    void push_back(const T& val) {
        if (sz == cap) reserve(cap ? cap * 2 : 1);
        data[sz++] = val;
    }

    void pop_back()          { --sz; }
    T&   operator[](int i)   { return data[i]; }
    const T& operator[](int i) const { return data[i]; }
    int  size()  const       { return sz; }
    bool empty() const       { return sz == 0; }
    void clear()             { sz = 0; }

    // 특정 인덱스에 삽입 — O(n)
    void insert(int idx, const T& val) {
        if (sz == cap) reserve(cap ? cap * 2 : 1);
        for (int i = sz; i > idx; i--) data[i] = data[i-1];
        data[idx] = val;
        sz++;
    }

    // 특정 인덱스 삭제 — O(n)
    void erase(int idx) {
        for (int i = idx; i < sz-1; i++) data[i] = data[i+1];
        sz--;
    }
};
```

---

## 사용 예시

```cpp
int main() {
    Vector<int> v;
    for (int i = 0; i < 10; i++) v.push_back(i * i);

    for (int i = 0; i < v.size(); i++)
        printf("%d ", v[i]);   // 0 1 4 9 16 25 36 49 64 81
}
```

---

## 시간 복잡도

| 연산 | 복잡도 |
|------|--------|
| push_back | O(1) 분할상환 |
| pop_back | O(1) |
| 인덱스 접근 | O(1) |
| insert / erase | O(n) |
| reserve | O(n) |

---

## 경쟁 프로그래밍 팁

- 대회에서는 보통 **최대 크기를 미리 알 수 있으므로** 정적 배열로 대체 가능
- 재할당 비용이 걱정되면 `reserve(N)`으로 미리 공간 확보
- `memcpy` / `memmove` 를 쓰면 POD 타입에서 더 빠름
