---
layout: single
title: "Trapping Rain Water"
date: 2024-03-15 20:48:54 +0800
categories: algo
tags: leetcode stack monotonic-stack prefix-sum
collection: 2024
classes: wide

toc: true
toc_label: "Content Outline"
toc_icon: "cog"
toc_sticky: true

---

## [42. Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/)
Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.

 

**Example 1:**

![img](https://assets.leetcode.com/uploads/2018/10/22/rainwatertrap.png)

```
Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6
Explanation: The above elevation map (black section) is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water (blue section) are being trapped.
```

**Example 2:**

```
Input: height = [4,2,0,3,2,5]
Output: 9
```

 

**Constraints:**

- `n == height.length`

- `1 <= n <= 2 * 104`

- `0 <= height[i] <= 105`

  

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
    def trap(self, height: List[int]) -> int:
        s = []
        
        ans = 0
        for i, h in enumerate(height):
            while s and h >= height[s[-1]]:
                b_h = height[s.pop()]
                if not s:
                    break
                left = s[-1]
                dh = (min(h, height[left])) - b_h 
                ans += dh * (i-left-1)
            s.append(i)
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

### 2.  Prefix-Sum

```python
class Solution:
    def trap(self, height: List[int]) -> int:
        n = len(height)
        pre_max = [0] * n
        pre_max[0] = height[0]
        for i in range(1, n):
            pre_max[i] = max(pre_max[i-1], height[i])
        suf_max = [0] * n
        suf_max[-1] = height[-1]
        for i in range(n-2, -1, -1):
            suf_max[i] = max(suf_max[i+1], height[i])
        ans = 0
        for h, pre, suf in zip(height, pre_max, suf_max):
            ans += min(pre, suf) - h
        
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
