---
layout: single
title: "Minimum Window Substring"
date: 2024-03-23 20:48:54 +0800
categories: algo
tags: sliding-window
collection: 2024
classes: wide

toc: true
toc_label: "Content Outline"
toc_icon: "cog"
toc_sticky: true

---



## [76. Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/)



Given two strings `s` and `t` of lengths `m` and `n` respectively, return *the **minimum window***  ***substring\*** *of* `s` *such that every character in* `t` *(**including duplicates**) is included in the window*. If there is no such substring, return *the empty string* `""`.



The testcases will be generated such that the answer is **unique**.

 

**Example 1:**

```
Input: s = "ADOBECODEBANC", t = "ABC"
Output: "BANC"
Explanation: The minimum window substring "BANC" includes 'A', 'B', and 'C' from string t.
```

**Example 2:**

```
Input: s = "a", t = "a"
Output: "a"
Explanation: The entire string s is the minimum window.
```

**Example 3:**

```
Input: s = "a", t = "aa"
Output: ""
Explanation: Both 'a's from t must be included in the window.
Since the largest window of s only has one 'a', return empty string.
```

 

**Constraints:**

- `m == s.length`
- `n == t.length`
- `1 <= m, n <= 105`
- `s` and `t` consist of uppercase and lowercase English letters.

 

**Follow up:** Could you find an algorithm that runs in `O(m + n)` time?

### Analysis

![non-overlapping-str](/assets/images/non-overlapping-substr.drawio.svg)

### Solution

```py
class Solution:
    def minWindow(self, s: str, t: str) -> str:
        need = Counter()
        for x in t:
            need[x] += 1
        l = 0
        r = 0
        valid = 0
        start = 0
        n = len(s)
        length = inf
        w = Counter()
        while r < n:
            c = s[r]
            r += 1
            if need[c]:
                w[c] += 1
                if w[c] == need[c]: # only add the count if the window alreay contain enough number of a char
                    valid += 1
            while valid == len(need):
                if r - l < length:
                    start = l
                    length = r - l
                d = s[l]
                l += 1
                if need[d]:
                    if w[d] == need[d]: # only decrement the count if the left-most char's count decrease below the required
                        valid -= 1
                    w[d] -= 1
        if length == inf:
            return ''
        return s[start:start+length]	
                
                
```

