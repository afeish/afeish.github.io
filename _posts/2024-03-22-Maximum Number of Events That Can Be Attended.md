---
layout: single
title: "Maximum Number of Events That Can Be Attended"
date: 2024-03-22 20:48:54 +0800
categories: algo
tags: heap greedy
collection: 2024
classes: wide

toc: true
toc_label: "Content Outline"
toc_icon: "cog"
toc_sticky: true

---

## [1353. Maximum Number of Events That Can Be Attended](https://leetcode.com/problems/maximum-number-of-events-that-can-be-attended/)



You are given an array of `events` where `events[i] = [startDayi, endDayi]`. Every event `i` starts at `startDayi` and ends at `endDayi`.

You can attend an event `i` at any day `d` where `startTimei <= d <= endTimei`. You can only attend one event at any time `d`.

Return *the maximum number of events you can attend*.

 

**Example 1:**

![img](https://assets.leetcode.com/uploads/2020/02/05/e1.png)

```
Input: events = [[1,2],[2,3],[3,4]]
Output: 3
Explanation: You can attend all the three events.
One way to attend them all is as shown.
Attend the first event on day 1.
Attend the second event on day 2.
Attend the third event on day 3.
```

**Example 2:**

```
Input: events= [[1,2],[2,3],[3,4],[1,2]]
Output: 4
```

 

**Constraints:**

- `1 <= events.length <= 105`
- `events[i].length == 2`
- `1 <= startDayi <= endDayi <= 105`





### Solution

```py
class Solution:
    def maxEvents(self, events: List[List[int]]) -> int:
        events = sorted(events, key=lambda x:x[0])
        n = len(events)

        
        from heapq import heappush, heappop
        s = []
        i = 0
        last = 1
        ans = 0

        while i < n or s :
            while i < n and events[i][0] == last:
                heappush(s, events[i][1]) # 把会议的结束事件放进小顶堆
                i += 1
            while s and s[0] < last: # 已经到了新的一天，但是仍有一些会议没有开，主要解决的是会议相邻的场景
                heappop(s)
            if s:
                heappop(s)
                ans += 1
            last += 1 # 代表一天过去啦
        return ans
```

