---
layout: single
title: "Longest Palindromic Subsequence"
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

## [516. Longest Palindromic Subsequence](https://leetcode.com/problems/longest-palindromic-subsequence/)

Given a string `s`, find *the longest palindromic **subsequence**'s length in* `s`.

A **subsequence** is a sequence that can be derived from another sequence by deleting some or no elements without changing the order of the remaining elements.

 

**Example 1:**

```
Input: s = "bbbab"
Output: 4
Explanation: One possible longest palindromic subsequence is "bbbb".
```

**Example 2:**

```
Input: s = "cbbd"
Output: 2
Explanation: One possible longest palindromic subsequence is "bb".
```

 

**Constraints:**

- `1 <= s.length <= 1000`
- `s` consists only of lowercase English letters.

## Analysis

​	The problem can be divided into the small problems. Suppose we have the definition of  `dfs(i,j)` which stands for the longest palindromic **subsequence**'s length that start from `i` and end with  `j` ,then we can deduce that 

$$
dfs(i,j) =  \begin{cases}
df(i+1,j-1) + 2 & \text{s[i] == s[j]}\\
max(dfs(i+1, j), dfs(i,j-1)) & \text{s[i] != s[j]} \\
1  & \text{i == j} \\
0  & \text{i > j} \\
\end{cases}
$$

​	For example, we have a sequence `"aba"` and current start index  `i` is `0`, end index `j` is `2`, then `dfs(0, 2)` is 

$$
dfs(0, 2) =  dfs(1,1) + 2 = 1 + 2 = 3 \\
$$

​	Another example, if we have sequence `"aab"`and current start index  `i` is `0`, end index `j` is `2`, then `dfs(0, 2)` is


$$
dfs(0, 2) =  max(dfs(1,2), dfs(0, 1)) = max(max(dfs(2,2)， dfs(1,1)), 2)) = 2 \\
$$
​	

​	So the max profit we can get on day 1 is `max(0, -7)=0`	

​	We can also deduce the DP function:


$$
f[i][j] =  \begin{cases}
f[i+1][j-1] + 2 & \text{s[i] == s[j]} \\
max(f[i+1][j], f[i][j-1]) & \text{s[i] != s[j]} \\

1 & \text{i == j} \\
0 & \text{i > j} \\
\end{cases}
$$


## Solutions 



### 1. DFS way

```py
class Solution:
    def longestPalindromeSubseq(self, s: str) -> int:
        n = len(s)
        @cache
        def dfs(i, j):
            if i == j:
                return 1
            if i-j == 1:
                return 0
            if s[i] == s[j]:
                return dfs(i+1, j-1) + 2
            else:
                return max(dfs(i+1, j), dfs(i, j-1))
        return dfs(0, n-1)
```

Input:   `"bbbab"`

output:

```shell
4
```

#### Complexity

- Time complexity: ( O(n^2) ), where ( n ) is the length of the array.
- Space complexity: ( O(n^2) ), where ( n) is the length of the array.

### 2.  DP

```python
class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        n = len(nums)
    	f = [[0]*n for _ in range(n)]
        for i in range(n-1, -1, -1): # we calculate f[i][j] from f[i+1][...], so we reverse the traverse
            f[i][i] = 1
            for j in range(i+1,n):
                if s[i] == s[j]:
                    f[i][j] =  f[i+1][j-1] + 2
                else:
                    f[i][j] =  max(f[i+1][j], f[i][j-1])
        return f[0][n-1]
```

Input:   `"bbbab"`

output:

```shell
4
```

#### Complexity

- Time complexity: ( O(n^2) ), where ( n ) is the length of the array.
- Space complexity: ( O(n^2) ), where ( n) is the length of the array.
