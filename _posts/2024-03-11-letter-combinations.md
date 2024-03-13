---
layout: single
title: "Letter combinations"
date: 2024-03-11 20:48:54 +0800
categories: algo
tags: dfs leetcode 
collection: 2024
classes: wide

toc: true
toc_label: "Content Outline"
toc_icon: "cog"
toc_sticky: true
---

## [17. Letter Combinations of a Phone Number](https://leetcode.com/problems/letter-combinations-of-a-phone-number/)

Given a string containing digits from `2-9` inclusive, return all possible letter combinations that the number could represent. Return the answer in **any order**.

A mapping of digits to letters (just like on the telephone buttons) is given below. Note that 1 does not map to any letters.

![img](https://assets.leetcode.com/uploads/2022/03/15/1200px-telephone-keypad2svg.png)

 

**Example 1:**

```
Input: digits = "23"
Output: ["ad","ae","af","bd","be","bf","cd","ce","cf"]
```

**Example 2:**

```
Input: digits = ""
Output: []
```

**Example 3:**

```
Input: digits = "2"
Output: ["a","b","c"]
```



## Solutions



### 1. DFS way

```py
MAPPING = ["", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"]
class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        n = len(digits)
        if n == 0:
            return []
        ans = []
        path = [''] * n
        def dfs(i):
            if i == n:
                ans.append(''.join(path))
                return
            for c in MAPPING[int(digits[i])]:
                path[i] = c
                dfs(i+1)
        dfs(0)
        return ans
```

Input:  `23`

output:

```shell
['ad', 'ae', 'af', 'bd', 'be', 'bf', 'cd', 'ce', 'cf']
```



This solution is pretty neat. We just iterate one digit after another recursive until we reach the end



### 2.  Stack way

```python
MAPPING = ["", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"]
class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
 		ans = []
        if len(digits) == 0:    
            return []

        q = [('',0)] # '' is the previous str, 0 is the length of the current select
        while len(q) > 0:
            ch,count = q.pop(0)

            if count == len(digits):
                ans.append(ch)
            else:
                letters = MAPPING[int(digits[count])]
                for letter in letters:
                    q.append((ch + letter, count+1))
            
        return ans
```

Input:  `23`

output:

```shell
['ad', 'ae', 'af', 'bd', 'be', 'bf', 'cd', 'ce', 'cf']
```

## Derivation

What if if we choose all least one element from number's corresponding letters ? For example, we can choose `'a', 'b', 'c', 'ab', 'ac', 'bc', 'abc'`  from number `1`. Then the available combinations will be???

If we want to gain all the available combinations of the given string. First we need to get all the combinations for a given letter. To achieve that, we can use the following function.

```python
def list_powerset(lst):
	result = [""]
	for x in lst:
		result.extend([subset + x for subset in result])
	result.remove("")
	return result
```
The `list_powerset` will take  an array, for example `abc`. It will return all the possible combination except `""`, Since the question asked for we select at least one letter in the possible string array.

The powerset of `abc` is `['a', 'b', 'ab', 'c', 'ac', 'bc', 'abc']`

After we get the possibility one specific number, we can modified the previous solution into the following:

```python
MAPPING = ["", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"]

def list_powerset(lst):
	result = [""]
	for x in lst:
		result.extend([subset + x for subset in result])
	result.remove("")
	return result
class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
 		ans = []
        if len(digits) == 0:    
            return []

        q = [('',0)]
        while len(q) > 0:
            ch,count = q.pop(0)

            if count == len(digits):
                ans.append(ch)
            else:
                letters = MAPPING[int(digits[count])]

                for letter in list_powerset(letters):
                    q.append((ch + letter, count+1))
            
        return ans
```
Input:  `23`

output:

```shell
['ad', 'ae', 'ade', 'af', 'adf', 'aef', 'adef', 'bd', 'be', 'bde', 'bf', 'bdf', 'bef', 'bdef', 'abd', 'abe', 'abde', 'abf', 'abdf', 'abef', 'abdef', 'cd', 'ce', 'cde', 'cf', 'cdf', 'cef', 'cdef', 'acd', 'ace', 'acde', 'acf', 'acdf', 'acef', 'acdef', 'bcd', 'bce', 'bcde', 'bcf', 'bcdf', 'bcef', 'bcdef', 'abcd', 'abce', 'abcde', 'abcf', 'abcdf', 'abcef', 'abcdef']
```

