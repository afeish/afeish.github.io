---
layout: single
title: "Sliding Window Maximum"
date: 2024-03-15 20:48:54 +0800
categories: algo
tags: leetcode queue monotonic-stack
collection: 2024
classes: wide

toc: true
toc_label: "Content Outline"
toc_icon: "cog"
toc_sticky: true

---

## [239. Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/)
​	You are given an array of integers `nums`, there is a sliding window of size `k` which is moving from the very left of the array to the very right. You can only see the `k` numbers in the window. Each time the sliding window moves right by one position.

Return *the max sliding window*.

 

**Example 1:**

```
Input: nums = [1,3,-1,-3,5,3,6,7], k = 3
Output: [3,3,5,5,6,7]
Explanation: 
Window position                Max
---------------               -----
[1  3  -1] -3  5  3  6  7       3
 1 [3  -1  -3] 5  3  6  7       3
 1  3 [-1  -3  5] 3  6  7       5
 1  3  -1 [-3  5  3] 6  7       5
 1  3  -1  -3 [5  3  6] 7       6
 1  3  -1  -3  5 [3  6  7]      7
```

**Example 2:**

```
Input: nums = [1], k = 1
Output: [1]
```

 

**Constraints:**

- `1 <= nums.length <= 105`
- `-104 <= nums[i] <= 104`
- `1 <= k <= nums.length`



## Analysis

We can use the monotonic stack to resolve the problem. We use a stack named `s` which store the unresolved index, 

1. we compare the current height `height[i]` with the top of stack `s[-1]`. If `height[i] > s[-1]`,  it means we cound find a target trap, we can pop the index from the stack twice and calculate the trap area; then continue the next round until one of bellow condition meet:
   1.  The stack is empty 
   2.  The height of stack's top is bigger than `height[i]`
2. If it's less, then we should just push the current index.

![img](/assets/images/trapping-water.drawio.svg)

## Solutions 



### 1. Monotanic-Stack

```py
class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        s = []
        n = len(nums)
        
        ans = 0
       	q = deque()
        for i in range(n):
            while q and q[-1] <= nums[i]:
                q.pop()
            q.append(i)
        	if i - q[0] >= k:
               q.popleft()
            if i > k:
            	ans.append(nums[q[0]])

        return ans
```

Input:   `[0,1,0,2,1,0,1,3,2,1,2,1]`

output:

```shell
6
```

#### Complexity

- Time complexity: ( O(n) ), where ( n ) is the length of the array.
- Space complexity: ( O(n) ), where ( n) is the length of the array.





链接：https://ac.nowcoder.com/acm/contest/1006/D
来源：牛客网



## 题目描述                    

输入一个长度为n的整数序列，从中找出一段不超过m的连续子序列，使得整个序列的和最大。
 例如 1,-3,5,1,-2,3
 当m=4时，S=5+1-2+3=7
 当m=2或m=3时，S=5+1=6

## 输入描述:

```
第一行两个数n,m（n,m≤300000）（n,m \leq 300000）（n,m≤300000）
第二行有n个数，要求在n个数找到最大子序和
```

## 输出描述:

```
一个数，数出他们的最大子序和
```

 示例1                        

## 输入

[复制](javascript:void(0);)

```
6 4
1 -3 5 1 -2 3
```

## 输出

[复制](javascript:void(0);)

```
7
```
