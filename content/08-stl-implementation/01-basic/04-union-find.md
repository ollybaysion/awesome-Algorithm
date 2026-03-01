---
title: "Union-Find (Disjoint Set Union)"
tags: [union-find, DSU, path-compression, union-by-rank, no-stl]
---

# Union-Find (서로소 집합)

## 개념

서로 분리된 집합들을 관리하는 자료구조.

- **Find**: 원소가 속한 집합의 대표(루트)를 반환
- **Union**: 두 집합을 하나로 합침

---

## 구현 — 경로 압축 + 랭크 기반 합치기

```cpp
struct DSU {
    static const int MAXN = 1000005;
    int parent[MAXN];
    int rank_[MAXN];   // 트리 높이 상한

    void init(int n) {
        for (int i = 0; i <= n; i++) {
            parent[i] = i;
            rank_[i]  = 0;
        }
    }

    // 경로 압축 (Path Compression)
    int find(int x) {
        if (parent[x] != x)
            parent[x] = find(parent[x]);  // 루트로 직접 연결
        return parent[x];
    }

    // 랭크 기반 합치기 (Union by Rank)
    bool unite(int a, int b) {
        a = find(a); b = find(b);
        if (a == b) return false;  // 이미 같은 집합
        if (rank_[a] < rank_[b]) swap(a, b);
        parent[b] = a;
        if (rank_[a] == rank_[b]) rank_[a]++;
        return true;
    }

    bool same(int a, int b) { return find(a) == find(b); }
};
```

> 경로 압축 + 랭크 합치기 → Find/Union 모두 실질적으로 **O(α(n))** ≈ O(1)

---

## 크기 기반 합치기 (Union by Size)

```cpp
struct DSU_Size {
    int parent[1000005];
    int size_[1000005];

    void init(int n) {
        for (int i = 0; i <= n; i++) {
            parent[i] = i;
            size_[i]  = 1;
        }
    }

    int find(int x) {
        return parent[x] == x ? x : parent[x] = find(parent[x]);
    }

    bool unite(int a, int b) {
        a = find(a); b = find(b);
        if (a == b) return false;
        if (size_[a] < size_[b]) swap(a, b);
        parent[b] = a;
        size_[a] += size_[b];
        return true;
    }

    int get_size(int x) { return size_[find(x)]; }
};
```

---

## 활용 예시

### 크루스칼 (MST)

```cpp
// 간선을 가중치 오름차순 정렬 후 Union-Find로 사이클 검사
int kruskal(int n, vector<tuple<int,int,int>>& edges) {
    sort(edges.begin(), edges.end());
    DSU dsu; dsu.init(n);
    int mst_cost = 0, cnt = 0;
    for (auto [w, u, v] : edges) {
        if (dsu.unite(u, v)) {
            mst_cost += w;
            if (++cnt == n-1) break;
        }
    }
    return mst_cost;
}
```

### 오프라인 LCA (Tarjan's offline LCA)

```cpp
// 쿼리를 DFS와 함께 처리 — Union-Find 활용
```

---

## 롤백 가능한 DSU (Persistent / Rollback DSU)

경로 압축을 **쓰지 않고** 랭크 기반 합치기만 사용.
스택에 변경 이력 기록 후 undo 가능.

```cpp
struct RollbackDSU {
    int parent[1000005], rank_[1000005];
    // (node, old_parent, rank_changed_node, old_rank)
    struct Change { int u, pu, v, rv; };
    Change history[2000005];
    int hist_sz = 0;

    void init(int n) {
        for (int i = 0; i <= n; i++) parent[i] = i, rank_[i] = 0;
    }

    int find(int x) {
        // 경로 압축 없이 단순 탐색
        while (parent[x] != x) x = parent[x];
        return x;
    }

    bool unite(int a, int b) {
        a = find(a); b = find(b);
        if (a == b) {
            history[hist_sz++] = {-1, -1, -1, -1};
            return false;
        }
        if (rank_[a] < rank_[b]) swap(a, b);
        history[hist_sz++] = {b, parent[b], a, rank_[a]};
        parent[b] = a;
        if (rank_[a] == rank_[b]) rank_[a]++;
        return true;
    }

    void rollback() {
        auto [u, pu, v, rv] = history[--hist_sz];
        if (u == -1) return;
        parent[u] = pu;
        rank_[v]  = rv;
    }
};
```

---

## 연습 문제

- BOJ 1717 - 집합의 표현
- BOJ 1922 - 네트워크 연결 (크루스칼)
- BOJ 20040 - 사이클 게임
- BOJ 13537 - 수열과 쿼리 1 (Rollback DSU)
