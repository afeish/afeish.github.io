---
layout: single
title: "Daily Temperatures"
date: 2024-03-15 20:48:54 +0800
categories: algo
tags: leetcode stack  monotonic-stack
collection: 2024
classes: wide

toc: true
toc_label: "Content Outline"
toc_icon: "cog"
toc_sticky: true

---

## [739. Daily Temperatures](https://leetcode.com/problems/daily-temperatures/)

Given an array of integers `temperatures` represents the daily temperatures, return *an array* `answer` *such that* `answer[i]` *is the number of days you have to wait after the* `ith` *day to get a warmer temperature*. If there is no future day for which this is possible, keep `answer[i] == 0` instead.

 

**Example 1:**

```
Input: temperatures = [73,74,75,71,69,72,76,73]
Output: [1,1,4,2,1,1,0,0]
```

**Example 2:**

```
Input: temperatures = [30,40,50,60]
Output: [1,1,1,0]
```

**Example 3:**

```
Input: temperatures = [30,60,90]
Output: [1,1,0]
```

 

**Constraints:**

- `1 <= temperatures.length <= 105`
- `30 <= temperatures[i] <= 100`

## Analysis

We can use the monotonic stack to resolve the problem. We use a stack named `s` which store the unresolved index, 

1. we check the current temperature `temperature[i]` with the top of stack `s[-1]`. If `temperature[i] > s[-1]`,  it means we found the target temperature, we can pop the index from the stack and mark that index as resolved; then continue the next round until one of bellow condition meet:
   1.  The stack is empty 
   2.  The temperature poped is bigger than `temperature[i]`
2. If it's less, then we should just push the current index.

![img](/assets/images/monotonic-stack.drawio.svg)

## Solutions 



### 1. From left to right

```py
class Solution:
    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:
        n = len(temperatures)
        s = []
        ans = [0] * n
        for i in range(n):
            t = temperatures[i]
            while s and t > temperatures[s[-1]]:
                j = s.pop()
                ans[j] = i - j
            s.append(i)
        return ans

```

Input:   `"bbbab"`

output:

```shell
4
```

#### Complexity

- Time complexity: ( O(n) ), where ( n ) is the length of the array.
- Space complexity: ( O(n) ), where ( n) is the length of the array.

### 2.  From right to left

```python
class Solution:
    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:
        n = len(temperatures)
        s = []
        ans = [0] * n
        for i in range(n-1,-1,-1):
            t = temperatures[i]
            while s and t >= temperatures[s[-1]]:
                s.pop()
            if s:
                ans[i] = s[-1] - i
            s.append(i)
        return ans
```

Input:   `"bbbab"`

output:

```shell
4
```

#### Complexity

- Time complexity: ( O(n) ), where ( n ) is the length of the array.
- Space complexity: ( O(n) ), where ( n) is the length of the array.
