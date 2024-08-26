---
layout: single
title: "Search in Rotated Sorted Array"
date: 2024-03-24 20:48:54 +0800
categories: algo
tags: binary
collection: 2024
classes: wide

toc: true
toc_label: "Content Outline"
toc_icon: "cog"
toc_sticky: true

---



## [33. Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/)



There is an integer array `nums` sorted in ascending order (with **distinct** values).

Prior to being passed to your function, `nums` is **possibly rotated** at an unknown pivot index `k` (`1 <= k < nums.length`) such that the resulting array is `[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]` (**0-indexed**). For example, `[0,1,2,4,5,6,7]` might be rotated at pivot index `3` and become `[4,5,6,7,0,1,2]`.

Given the array `nums` **after** the possible rotation and an integer `target`, return *the index of* `target` *if it is in* `nums`*, or* `-1` *if it is not in* `nums`.

You must write an algorithm with `O(log n)` runtime complexity.

 

**Example 1:**

```
Input: nums = [4,5,6,7,0,1,2], target = 0
Output: 4
```

**Example 2:**

```
Input: nums = [4,5,6,7,0,1,2], target = 3
Output: -1
```

**Example 3:**

```
Input: nums = [1], target = 0
Output: -1
```

 

**Constraints:**

- `1 <= nums.length <= 5000`
- `-104 <= nums[i] <= 104`
- All values of `nums` are **unique**.
- `nums` is an ascending array that is possibly rotated.
- `-104 <= target <= 104`

### Analysis

We can divide the binary search by the relationship between `mid` , `end` and `target`. For example, there are 3 scenarios that we should consider

1. `[4, 5, 6, 1, 2]` with mid = 6, end = 2, target = 4

   In this case, if we are in current index of `2` with value `6`, and the target value is `4`, we need to move our right pointer to mid pos `2`.

   The relationship is `mid > end and target > end and mid > target`

2.   `[6, 1, 2, 3, 4, 5]` with mid =2, end = 5

   - if the target is `6`.  we have the relationship `mid <= end and target > end`, so we need to move our right pointer to mid pos `2`
   - if the target is `1`, we have the relationsip `mid <= end and mid > target`, so  we need to move our right pointer to mid pos `2`

### Solution

```py
class Solution:
    def search(self, nums: List[int], t: int) -> int:

        def is_blue(i): # should we move the right pointer to the mid
            x = nums[i]
            e = nums[-1]
            # e < t < x
            # 4 5 6 1 2 [t=4,x=6]
            if x > e:
                return t > e and x >= t
            else:
                # x < e and t > e
                # 4 5 0 1 2 3 [t=4,x=0,e=3] x <= e
                # x < e and x >= t
                # 4 0 1 2 3 [t=0,x=1,e=3]  x <= e
                return t > e or x >= t 

        l = -1
        r = len(nums)

        while l+1 < r:
            mid = (l+r)//2
            if is_blue(mid): # move the right pointer to the mid
                r = mid
            else:
                l = mid
        if r == len(nums) or nums[r] != t:
            return -1
        return r
                
                
```

