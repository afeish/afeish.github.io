---
layout: single
title: "最大子序和"
date: 2024-03-15 20:48:54 +0800
categories: algo
tags: leetcode queue monotonic-stack pre-sum
collection: 2024
classes: wide

toc: true
toc_label: "Content Outline"
toc_icon: "cog"
toc_sticky: true

---

## [最大子序和](https://ac.nowcoder.com/acm/contest/1006/D)

**题目描述**                    

输入一个长度为n的整数序列，从中找出一段不超过m的连续子序列，使得整个序列的和最大。
 例如 1,-3,5,1,-2,3
 当m=4时，S=5+1-2+3=7
 当m=2或m=3时，S=5+1=6

**输入描述:**

```
第一行两个数n,m（n,m≤300000）
第二行有n个数，要求在n个数找到最大子序和
```

**输出描述:**

```
一个数，数出他们的最大子序和
```

 示例1                        

**输入**

```
6 4
1 -3 5 1 -2 3
```

**输出**

```
7
```





## Analysis

1. 求以 `a[i]` 为结尾的最大子段和，我们需要维护一个最小的前缀和 pre_sum[j]，其中 j <=i, [j+1, i] 就是我们的答案
2. 本题要求子段区间不能长于 m， 则需要满足：i-j<=k， 如果不满足条件，则循环弹出栈首元素直到满足条件
3. 依次遍历栈顶元素 `q[j]`，如果 pre_sum[q[j]] >pre_sum[i]， 则弹出次大元素 `q[j]`，所以我们要求一个最大长度为 m 的单调递减栈



## Solutions 



### 1. Monotanic-Stack

```py
n, m = map(int, input().split())
nums = [int(el) for el in input().split()]

q = []
pre_sum = [nums[0]] * n
for i in range(1, n):
    pre_sum[i] = pre_sum[i-1] + nums[i]

from math import inf
from collections import deque
ans = pre_sum[0]
q = deque()
for i in range(1, n):
    while q and pre_sum[i] < pre_sum[q[-1]] :
        q.pop()
    q.append(i)    
    while q and i-q[0] > m: q.popleft()
    if pre_sum[i] - pre_sum[q[0]] > ans:
        ans = pre_sum[i] - pre_sum[q[0]]
        
print(ans)
```

Input: 
```shell
6 4
1 -3 5 1 -2 3
```

output:

```shell
7
```

#### Complexity

- Time complexity: ( O(n) ), where ( n ) is the length of the array.
- Space complexity: ( O(n) ), where ( n) is the length of the array.
