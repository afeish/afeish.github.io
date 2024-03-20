---
layout: single
title: "Longest Path With Different Adjacent Characters"
date: 2024-03-15 20:48:54 +0800
categories: algo
tags: dp leetcode dfs
collection: 2024
classes: wide

toc: true
toc_label: "Content Outline"
toc_icon: "cog"
toc_sticky: true

---

## [2246. Longest Path With Different Adjacent Characters](https://leetcode.com/problems/longest-path-with-different-adjacent-characters/)

You are given a **tree** (i.e. a connected, undirected graph that has no cycles) **rooted** at node `0` consisting of `n` nodes numbered from `0` to `n - 1`. The tree is represented by a **0-indexed** array `parent` of size `n`, where `parent[i]` is the parent of node `i`. Since node `0` is the root, `parent[0] == -1`.

You are also given a string `s` of length `n`, where `s[i]` is the character assigned to node `i`.

Return *the length of the **longest path** in the tree such that no pair of **adjacent** nodes on the path have the same character assigned to them.*

 

**Example 1:**

![img](https://assets.leetcode.com/uploads/2022/03/25/testingdrawio.png)

```
Input: parent = [-1,0,0,1,1,2], s = "abacbe"
Output: 3
Explanation: The longest path where each two adjacent nodes have different characters in the tree is the path: 0 -> 1 -> 3. The length of this path is 3, so 3 is returned.
It can be proven that there is no longer path that satisfies the conditions. 
```

**Example 2:**

![img](https://assets.leetcode.com/uploads/2022/03/25/graph2drawio.png)

```
Input: parent = [-1,0,0,0], s = "aabc"
Output: 3
Explanation: The longest path where each two adjacent nodes have different characters is the path: 2 -> 0 -> 3. The length of this path is 3, so 3 is returned.
```

 

**Constraints:**

- `n == parent.length == s.length`
- `1 <= n <= 105`
- `0 <= parent[i] <= n - 1` for all `i >= 1`
- `parent[0] == -1`
- `parent` represents a valid tree.
- `s` consists of only lowercase English letters.


## Solutions 



```py
class Solution:
    def longestPath(self, parent: List[int], s: str) -> int:
        n = len(parent)
        g = [[] for _ in range(n)]
        for i in range(1, n):
            g[parent[i]].append(i)

        ans = 0
        def dfs(x, fa):
            nonlocal ans
            x_len = 0
            for y in g[x]:
                if y == fa: continue
                y_len = dfs(y, x) + 1
                if s[y] != s[x]:
                    ans = max(ans, x_len + y_len)
                    x_len = max(x_len, y_len)
            return x_len
        dfs(0, -1)
        return ans + 1
```

Input:  parent = [-1,0,0,1,1,2], s = "abacbe"

output:

```shell
3
```

#### Complexity

- Time complexity: ( O(n) ), where ( n ) is the length of the array.
- Space complexity: ( O(n) ), where ( n) is the length of the array.
