---
layout: single
title: "Maximum Number of Non-Overlapping Substrings"
date: 2024-03-23 20:48:54 +0800
categories: algo
tags: sliding-window greedy
collection: 2024
classes: wide

toc: true
toc_label: "Content Outline"
toc_icon: "cog"
toc_sticky: true

---



## [1520. Maximum Number of Non-Overlapping Substrings](https://leetcode.com/problems/maximum-number-of-non-overlapping-substrings/)



Given a string `s` of lowercase letters, you need to find the maximum number of **non-empty** substrings of `s` that meet the following conditions:

1. The substrings do not overlap, that is for any two substrings `s[i..j]` and `s[x..y]`, either `j < x` or `i > y` is true.
2. A substring that contains a certain character `c` must also contain all occurrences of `c`.

Find *the maximum number of substrings that meet the above conditions*. If there are multiple solutions with the same number of substrings, *return the one with minimum total length.* It can be shown that there exists a unique solution of minimum total length.

Notice that you can return the substrings in **any** order.

 

**Example 1:**

```
Input: s = "adefaddaccc"
Output: ["e","f","ccc"]
Explanation: The following are all the possible substrings that meet the conditions:
[
  "adefaddaccc"
  "adefadda",
  "ef",
  "e",
  "f",
  "ccc",
]
If we choose the first string, we cannot choose anything else and we'd get only 1. If we choose "adefadda", we are left with "ccc" which is the only one that doesn't overlap, thus obtaining 2 substrings. Notice also, that it's not optimal to choose "ef" since it can be split into two. Therefore, the optimal way is to choose ["e","f","ccc"] which gives us 3 substrings. No other solution of the same number of substrings exist.
```

**Example 2:**

```
Input: s = "abbaccd"
Output: ["d","bb","cc"]
Explanation: Notice that while the set of substrings ["d","abba","cc"] also has length 3, it's considered incorrect since it has larger total length.
```

 

**Constraints:**

- `1 <= s.length <= 105`
- `s` contains only lowercase English letters.



### Analysis

![non-overlapping-str](/assets/images/non-overlapping-substr.drawio.svg)

### Solution

```py
class Solution:
    def maxNumOfSubstrings(self, s: str) -> List[str]:
        l = [inf] * 26
        r = [-inf] * 26
        for i, x in enumerate(s):
            idx = ord(x)-ord('a')
            l[idx] = min(i, l[idx])
            r[idx] = max(i, r[idx])
        pos = -1
        ans = []
        for i in range(len(s)):
            if i == l[ord(s[i])-ord('a')]:
                left = l[ord(s[i])-ord('a')]
                right = r[ord(s[i])-ord('a')]
                while left < right and l[ord(s[left])-ord('a')] >= i:
                    right = max(right, r[ord(s[left])-ord('a')])
                    left += 1
                
                if left < right and l[ord(s[left])-ord('a')] < i:
                    continue
                
                if pos < i:
                    ans.append("")
                pos = right
                ans[-1] = s[i:pos+1]
        return ans
```

