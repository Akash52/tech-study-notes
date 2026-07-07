#  Data Structures & Algorithms Interview Mastery Guide
## Your Complete Preparation Resource for Acing DSA Interviews

---

##  How to Use This Guide

This guide is designed to build your confidence and competence for Data Structures & Algorithms technical interviews. Here's how to get the most from it:

### Study Strategy
1. **Master fundamentals first** - Understand Big O, basic data structures (80% of interviews)
2. **Practice coding daily** - Consistency beats cramming
3. **Understand patterns** - Recognize problem types (sliding window, two pointers, etc.)
4. **Time yourself** - Simulate real interview pressure (30-45 minutes per problem)
5. **Explain while coding** - Practice thinking out loud

### Progressive Learning Path
- **Week 1**: Arrays, Strings, Hash Tables + Big O notation
- **Week 2**: Linked Lists, Stacks, Queues
- **Week 3**: Trees, Binary Search, Recursion
- **Week 4**: Graphs, Dynamic Programming, Advanced patterns
- **Final Week**: Mock interviews, company-specific problems, system design basics

---

##  What Interviewers Look For in DSA Questions

### They're Evaluating:
1. **Problem-Solving Process** - How you approach unknown problems
2. **Code Quality** - Clean, readable, maintainable code
3. **Communication** - Explaining your thought process clearly
4. **Edge Cases** - Thinking about boundary conditions
5. **Optimization** - Understanding time/space trade-offs
6. **Testing** - Verifying your solution works

### Red Flags They're Watching For:
-  Jumping to code without understanding the problem
-  Not asking clarifying questions
-  Poor variable naming, messy code
-  Not considering edge cases
-  Can't analyze time/space complexity
-  Giving up when stuck

### Green Flags That Impress:
-  Asking clarifying questions first
-  Explaining approach before coding
-  Walking through examples
-  Optimizing from brute force to efficient solution
-  Testing with various inputs
-  Discussing trade-offs

---

##  Tips for Answering Confidently

### The UMPIRE Framework for Coding Questions:
- **U**nderstand: Clarify the problem, ask questions
- **M**atch: Identify the pattern/data structure
- **P**lan: Outline your approach
- **I**mplement: Write clean code
- **R**eview: Test with examples
- **E**valuate: Analyze time/space complexity

### Example:
**Q: Find two numbers that add up to a target**
- **Understand**: "Can I have negative numbers? Are there always two numbers? Can I use the same element twice?"
- **Match**: "This is a two-sum problem - hash table pattern"
- **Plan**: "I'll use a hash map to store seen numbers and their indices"
- **Implement**: [Write code]
- **Review**: "Let me test with [1,2,3], target=4"
- **Evaluate**: "Time: O(n), Space: O(n)"

### DSA-Specific Communication Tips:
- **Start with brute force**: "The naive solution would be..."
- **Optimize iteratively**: "We can improve this using..."
- **State assumptions**: "Assuming the input is sorted..."
- **Think aloud**: "I'm checking if the sum is greater than..."

---

##  How to Handle "I Don't Know" Gracefully

### DSA-Specific Recovery Strategies:

#### 1. The Pattern Recognition Response
> "I haven't seen this exact problem, but it reminds me of [similar problem]. Let me try applying that approach."

#### 2. The Brute Force First Response
> "I'm not sure of the optimal solution yet, but here's a working approach: [explain O(n²) solution]. Then we can optimize."

#### 3. The Data Structure Response
> "Let me think about which data structure would help here. A hash map could track... or maybe a heap for..."

#### 4. The Example Response
> "Let me work through a small example to understand the pattern better. With input [1,2,3]..."

---

##  FOUNDATIONAL CONCEPTS (Q1-10)
###  Must-Know DSA Fundamentals Every Developer Should Master

---

### **Q1: Explain Big O notation and analyze time/space complexity**
**Difficulty**:  Junior | **Frequency**: 

####  Strong Answer:
"Big O notation describes the upper bound of an algorithm's growth rate - how runtime or space usage grows as input size increases. It focuses on the dominant term and ignores constants.

**Common Complexities (Best to Worst):**
- **O(1)** - Constant: Array access, hash table lookup
- **O(log n)** - Logarithmic: Binary search, balanced tree operations
- **O(n)** - Linear: Single loop through array
- **O(n log n)** - Linearithmic: Efficient sorting (merge sort, quick sort)
- **O(n²)** - Quadratic: Nested loops, bubble sort
- **O(2ⁿ)** - Exponential: Recursive fibonacci without memoization
- **O(n!)** - Factorial: Permutations"

####  Code Examples with Analysis:
```javascript
// O(1) - Constant Time
function getFirstElement(arr) {
  return arr[0];  // Same time regardless of array size
}

// O(n) - Linear Time
function sumArray(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {  // n iterations
    sum += arr[i];
  }
  return sum;
}

// O(n²) - Quadratic Time
function findDuplicates(arr) {
  const duplicates = [];
  for (let i = 0; i < arr.length; i++) {      // n iterations
    for (let j = i + 1; j < arr.length; j++) { // n iterations
      if (arr[i] === arr[j]) {
        duplicates.push(arr[i]);
      }
    }
  }
  return duplicates;
}

// O(log n) - Logarithmic Time
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  
  return -1;
}
// Input halves each iteration: n → n/2 → n/4 → ... → 1

// O(n log n) - Linearithmic Time
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));    // log n divisions
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);  // O(n) merge per level
}

// O(2ⁿ) - Exponential Time
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);  // Tree branches exponentially
}

// Space Complexity Examples

// O(1) Space - Constant
function reverseInPlace(arr) {
  let left = 0, right = arr.length - 1;
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }
}

// O(n) Space - Linear
function reverseWithNewArray(arr) {
  const result = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    result.push(arr[i]);  // New array of size n
  }
  return result;
}

// O(n) Space - Recursive call stack
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);  // n recursive calls on stack
}

// Analyzing Complex Code
function complexExample(arr) {
  // O(n) - sorting
  arr.sort((a, b) => a - b);
  
  // O(n) - single loop
  for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
  }
  
  // O(n²) - nested loops
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] + arr[j] === 10) {
        console.log(arr[i], arr[j]);
      }
    }
  }
  
  // Total: O(n log n) + O(n) + O(n²) = O(n²)
  // Dominant term is O(n²)
}

// Drop Constants and Lower Order Terms
function dropConstants(arr) {
  // 2 loops = 2n operations
  for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
  }
  
  for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
  }
  
  // Still O(n), not O(2n) - we drop constants
}

function dropLowerTerms(arr) {
  // O(n²) nested loops
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      console.log(arr[i], arr[j]);
    }
  }
  
  // O(n) single loop
  for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
  }
  
  // Total: O(n²) + O(n) = O(n²)
  // Drop lower order term O(n)
}
```

####  Key Points:
- "**Big O describes worst-case** upper bound by default"
- "**Drop constants and lower terms** - O(2n) becomes O(n)"
- "**Space complexity includes** input space + auxiliary space"
- "**Amortized analysis** - average case over many operations (e.g., dynamic array resize)"

####  Weak Answer:
- "Big O is how fast code runs" (imprecise)
- Not being able to calculate complexity
- Confusing time and space complexity
- Not understanding log n

#### Common Interviewer Follow-ups:
1. **"What's the difference between O(n) and O(n²)?"**
   - "O(n) grows linearly - 100 items = 100 operations. O(n²) grows quadratically - 100 items = 10,000 operations. The difference becomes massive with large inputs."

2. **"Why is binary search O(log n)?"**
   - "Each comparison eliminates half the remaining elements. With 1000 items, you need at most 10 comparisons (2¹⁰ = 1024). The input is halved each step."

3. **"What's space complexity of recursion?"**
   - "Recursive calls use call stack memory. Each call adds a frame, so n recursive calls = O(n) space. Tail-call optimization can reduce this in some languages."

---

### **Q2: Implement and explain Arrays/Dynamic Arrays**
**Difficulty**:  Junior | **Frequency**: 

####  Strong Answer:
"Arrays are contiguous blocks of memory storing elements of the same type. Static arrays have fixed size, dynamic arrays (like JavaScript arrays) can grow/shrink. Elements are accessed in O(1) time via index."

####  Implementation & Operations:
```javascript
class DynamicArray {
  constructor() {
    this.data = {};
    this.length = 0;
    this.capacity = 2;  // Initial capacity
  }
  
  // O(1) - Access by index
  get(index) {
    if (index < 0 || index >= this.length) {
      throw new Error("Index out of bounds");
    }
    return this.data[index];
  }
  
  // O(1) amortized - Push to end
  push(item) {
    // Resize if needed
    if (this.length === this.capacity) {
      this.resize(this.capacity * 2);
    }
    
    this.data[this.length] = item;
    this.length++;
  }
  
  // O(1) - Pop from end
  pop() {
    if (this.length === 0) {
      return undefined;
    }
    
    const item = this.data[this.length - 1];
    delete this.data[this.length - 1];
    this.length--;
    
    return item;
  }
  
  // O(n) - Insert at index (shift elements)
  insert(index, item) {
    if (index < 0 || index > this.length) {
      throw new Error("Index out of bounds");
    }
    
    if (this.length === this.capacity) {
      this.resize(this.capacity * 2);
    }
    
    // Shift elements right
    for (let i = this.length; i > index; i--) {
      this.data[i] = this.data[i - 1];
    }
    
    this.data[index] = item;
    this.length++;
  }
  
  // O(n) - Delete at index (shift elements)
  delete(index) {
    if (index < 0 || index >= this.length) {
      throw new Error("Index out of bounds");
    }
    
    const item = this.data[index];
    
    // Shift elements left
    for (let i = index; i < this.length - 1; i++) {
      this.data[i] = this.data[i + 1];
    }
    
    delete this.data[this.length - 1];
    this.length--;
    
    return item;
  }
  
  // O(n) - Resize array
  resize(newCapacity) {
    const newData = {};
    for (let i = 0; i < this.length; i++) {
      newData[i] = this.data[i];
    }
    this.data = newData;
    this.capacity = newCapacity;
  }
}

// Common Array Problems

// 1. Two Sum - O(n) time, O(n) space
function twoSum(nums, target) {
  const seen = new Map();  // value -> index
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    
    seen.set(nums[i], i);
  }
  
  return [];
}

// 2. Remove Duplicates from Sorted Array - O(n) time, O(1) space
function removeDuplicates(nums) {
  if (nums.length === 0) return 0;
  
  let writeIndex = 1;
  
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[i - 1]) {
      nums[writeIndex] = nums[i];
      writeIndex++;
    }
  }
  
  return writeIndex;
}

// 3. Rotate Array - O(n) time, O(1) space
function rotateArray(nums, k) {
  k = k % nums.length;
  
  // Reverse entire array
  reverse(nums, 0, nums.length - 1);
  // Reverse first k elements
  reverse(nums, 0, k - 1);
  // Reverse remaining elements
  reverse(nums, k, nums.length - 1);
  
  function reverse(arr, start, end) {
    while (start < end) {
      [arr[start], arr[end]] = [arr[end], arr[start]];
      start++;
      end--;
    }
  }
}

// 4. Maximum Subarray Sum (Kadane's Algorithm) - O(n)
function maxSubArray(nums) {
  let maxSum = nums[0];
  let currentSum = nums[0];
  
  for (let i = 1; i < nums.length; i++) {
    // Either extend existing subarray or start new one
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  
  return maxSum;
}

// 5. Product of Array Except Self - O(n) time, O(1) space (output doesn't count)
function productExceptSelf(nums) {
  const n = nums.length;
  const result = new Array(n);
  
  // Left products
  result[0] = 1;
  for (let i = 1; i < n; i++) {
    result[i] = result[i - 1] * nums[i - 1];
  }
  
  // Right products
  let rightProduct = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] *= rightProduct;
    rightProduct *= nums[i];
  }
  
  return result;
}

// 6. Container With Most Water - O(n) two pointers
function maxArea(height) {
  let maxArea = 0;
  let left = 0;
  let right = height.length - 1;
  
  while (left < right) {
    const width = right - left;
    const minHeight = Math.min(height[left], height[right]);
    const area = width * minHeight;
    
    maxArea = Math.max(maxArea, area);
    
    // Move pointer with smaller height
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  
  return maxArea;
}

// 7. Merge Sorted Arrays - O(m + n)
function mergeSortedArrays(arr1, arr2) {
  const merged = [];
  let i = 0, j = 0;
  
  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] < arr2[j]) {
      merged.push(arr1[i]);
      i++;
    } else {
      merged.push(arr2[j]);
      j++;
    }
  }
  
  // Add remaining elements
  while (i < arr1.length) {
    merged.push(arr1[i]);
    i++;
  }
  
  while (j < arr2.length) {
    merged.push(arr2[j]);
    j++;
  }
  
  return merged;
}
```

####  Key Points:
- "**Random access is O(1)** - direct memory address calculation"
- "**Insertion/deletion at end is O(1)**, at beginning/middle is O(n) due to shifting"
- "**Dynamic arrays resize** when full - amortized O(1) for push"
- "**Cache-friendly** - elements stored contiguously in memory"

---

### **Q3: Implement Hash Tables/Hash Maps**
**Difficulty**:  Junior | **Frequency**: 

####  Strong Answer:
"Hash tables store key-value pairs with O(1) average lookup, insert, and delete. They use a hash function to map keys to array indices. Collisions are handled via chaining (linked lists) or open addressing."

####  Implementation:
```javascript
class HashTable {
  constructor(size = 53) {  // Prime number reduces collisions
    this.keyMap = new Array(size);
  }
  
  // Hash function - O(1)
  _hash(key) {
    let total = 0;
    const PRIME = 31;  // Prime number for better distribution
    
    for (let i = 0; i < Math.min(key.length, 100); i++) {
      const char = key[i];
      const value = char.charCodeAt(0) - 96;
      total = (total * PRIME + value) % this.keyMap.length;
    }
    
    return total;
  }
  
  // Set - O(1) average
  set(key, value) {
    const index = this._hash(key);
    
    if (!this.keyMap[index]) {
      this.keyMap[index] = [];
    }
    
    // Check if key exists, update if so
    for (let i = 0; i < this.keyMap[index].length; i++) {
      if (this.keyMap[index][i][0] === key) {
        this.keyMap[index][i][1] = value;
        return;
      }
    }
    
    // Add new key-value pair
    this.keyMap[index].push([key, value]);
  }
  
  // Get - O(1) average
  get(key) {
    const index = this._hash(key);
    const bucket = this.keyMap[index];
    
    if (bucket) {
      for (let i = 0; i < bucket.length; i++) {
        if (bucket[i][0] === key) {
          return bucket[i][1];
        }
      }
    }
    
    return undefined;
  }
  
  // Delete - O(1) average
  delete(key) {
    const index = this._hash(key);
    const bucket = this.keyMap[index];
    
    if (bucket) {
      for (let i = 0; i < bucket.length; i++) {
        if (bucket[i][0] === key) {
          bucket.splice(i, 1);
          return true;
        }
      }
    }
    
    return false;
  }
  
  // Get all keys - O(n)
  keys() {
    const keys = [];
    
    for (let bucket of this.keyMap) {
      if (bucket) {
        for (let pair of bucket) {
          keys.push(pair[0]);
        }
      }
    }
    
    return keys;
  }
  
  // Get all values - O(n)
  values() {
    const values = [];
    const seen = new Set();
    
    for (let bucket of this.keyMap) {
      if (bucket) {
        for (let pair of bucket) {
          if (!seen.has(pair[1])) {
            values.push(pair[1]);
            seen.add(pair[1]);
          }
        }
      }
    }
    
    return values;
  }
}

// Common Hash Table Problems

// 1. First Unique Character - O(n)
function firstUniqChar(s) {
  const freq = new Map();
  
  // Count frequencies
  for (let char of s) {
    freq.set(char, (freq.get(char) || 0) + 1);
  }
  
  // Find first unique
  for (let i = 0; i < s.length; i++) {
    if (freq.get(s[i]) === 1) {
      return i;
    }
  }
  
  return -1;
}

// 2. Group Anagrams - O(n * k log k) where k is max string length
function groupAnagrams(strs) {
  const groups = new Map();
  
  for (let str of strs) {
    // Sort string as key
    const sorted = str.split('').sort().join('');
    
    if (!groups.has(sorted)) {
      groups.set(sorted, []);
    }
    
    groups.get(sorted).push(str);
  }
  
  return Array.from(groups.values());
}

// 3. Longest Substring Without Repeating Characters - O(n)
function lengthOfLongestSubstring(s) {
  const seen = new Map();  // char -> last index
  let maxLength = 0;
  let start = 0;
  
  for (let end = 0; end < s.length; end++) {
    const char = s[end];
    
    // If char seen and in current window, move start
    if (seen.has(char) && seen.get(char) >= start) {
      start = seen.get(char) + 1;
    }
    
    seen.set(char, end);
    maxLength = Math.max(maxLength, end - start + 1);
  }
  
  return maxLength;
}

// 4. Subarray Sum Equals K - O(n)
function subarraySum(nums, k) {
  const prefixSums = new Map([[0, 1]]);  // sum -> count
  let currentSum = 0;
  let count = 0;
  
  for (let num of nums) {
    currentSum += num;
    
    // Check if (currentSum - k) exists
    if (prefixSums.has(currentSum - k)) {
      count += prefixSums.get(currentSum - k);
    }
    
    prefixSums.set(currentSum, (prefixSums.get(currentSum) || 0) + 1);
  }
  
  return count;
}

// 5. LRU Cache - O(1) for get and put
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();  // key -> value (maintains insertion order)
  }
  
  get(key) {
    if (!this.cache.has(key)) {
      return -1;
    }
    
    // Move to end (most recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    
    return value;
  }
  
  put(key, value) {
    // If exists, delete it first
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    
    // Add to end
    this.cache.set(key, value);
    
    // Evict least recently used if over capacity
    if (this.cache.size > this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }
}
```

####  Key Points:
- "**Average O(1)** operations, **worst O(n)** with many collisions"
- "**Hash function quality** determines collision rate"
- "**Load factor** (items/buckets) affects performance - resize when high"
- "**JavaScript Map** maintains insertion order, object keys are strings only"

---

### **Q4: Implement Linked Lists (Singly & Doubly)**
**Difficulty**:  Junior | **Frequency**: 

####  Strong Answer:
"Linked lists are sequences of nodes, each containing data and pointer(s) to next node(s). Singly-linked have one pointer (next), doubly-linked have two (next, prev). They excel at insertions/deletions but lack random access."

####  Implementation:
```javascript
// Singly Linked List Node
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class SinglyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
  
  // O(1) - Add to end
  push(value) {
    const newNode = new Node(value);
    
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    
    this.length++;
    return this;
  }
  
  // O(n) - Remove from end (need to find second-to-last)
  pop() {
    if (!this.head) return undefined;
    
    let current = this.head;
    let newTail = current;
    
    while (current.next) {
      newTail = current;
      current = current.next;
    }
    
    this.tail = newTail;
    this.tail.next = null;
    this.length--;
    
    if (this.length === 0) {
      this.head = null;
      this.tail = null;
    }
    
    return current;
  }
  
  // O(1) - Remove from beginning
  shift() {
    if (!this.head) return undefined;
    
    const removed = this.head;
    this.head = this.head.next;
    this.length--;
    
    if (this.length === 0) {
      this.tail = null;
    }
    
    return removed;
  }
  
  // O(1) - Add to beginning
  unshift(value) {
    const newNode = new Node(value);
    
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head = newNode;
    }
    
    this.length++;
    return this;
  }
  
  // O(n) - Get node at index
  get(index) {
    if (index < 0 || index >= this.length) return null;
    
    let current = this.head;
    let counter = 0;
    
    while (counter !== index) {
      current = current.next;
      counter++;
    }
    
    return current;
  }
  
  // O(n) - Insert at index
  insert(index, value) {
    if (index < 0 || index > this.length) return false;
    if (index === 0) return !!this.unshift(value);
    if (index === this.length) return !!this.push(value);
    
    const newNode = new Node(value);
    const prev = this.get(index - 1);
    
    newNode.next = prev.next;
    prev.next = newNode;
    this.length++;
    
    return true;
  }
  
  // O(n) - Remove at index
  remove(index) {
    if (index < 0 || index >= this.length) return undefined;
    if (index === 0) return this.shift();
    if (index === this.length - 1) return this.pop();
    
    const prev = this.get(index - 1);
    const removed = prev.next;
    prev.next = removed.next;
    this.length--;
    
    return removed;
  }
  
  // O(n) - Reverse in place
  reverse() {
    let node = this.head;
    this.head = this.tail;
    this.tail = node;
    
    let prev = null;
    let next;
    
    for (let i = 0; i < this.length; i++) {
      next = node.next;
      node.next = prev;
      prev = node;
      node = next;
    }
    
    return this;
  }
}

// Doubly Linked List
class DoublyNode {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
  
  // O(1) - Add to end
  push(value) {
    const newNode = new DoublyNode(value);
    
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    }
    
    this.length++;
    return this;
  }
  
  // O(1) - Remove from end
  pop() {
    if (!this.head) return undefined;
    
    const removed = this.tail;
    
    if (this.length === 1) {
      this.head = null;
      this.tail = null;
    } else {
      this.tail = removed.prev;
      this.tail.next = null;
      removed.prev = null;
    }
    
    this.length--;
    return removed;
  }
}

// Common Linked List Problems

// 1. Detect Cycle - Floyd's Algorithm O(n)
function hasCycle(head) {
  let slow = head;
  let fast = head;
  
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    
    if (slow === fast) {
      return true;
    }
  }
  
  return false;
}

// 2. Find Middle Node - O(n)
function findMiddle(head) {
  let slow = head;
  let fast = head;
  
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  
  return slow;
}

// 3. Merge Two Sorted Lists - O(n + m)
function mergeTwoLists(l1, l2) {
  const dummy = new Node(0);
  let current = dummy;
  
  while (l1 && l2) {
    if (l1.value < l2.value) {
      current.next = l1;
      l1 = l1.next;
    } else {
      current.next = l2;
      l2 = l2.next;
    }
    current = current.next;
  }
  
  current.next = l1 || l2;
  return dummy.next;
}

// 4. Remove Nth Node From End - O(n)
function removeNthFromEnd(head, n) {
  const dummy = new Node(0);
  dummy.next = head;
  
  let first = dummy;
  let second = dummy;
  
  // Move first n+1 steps ahead
  for (let i = 0; i <= n; i++) {
    first = first.next;
  }
  
  // Move both until first reaches end
  while (first) {
    first = first.next;
    second = second.next;
  }
  
  // Remove node
  second.next = second.next.next;
  return dummy.next;
}

// 5. Palindrome Linked List - O(n) time, O(1) space
function isPalindrome(head) {
  if (!head || !head.next) return true;
  
  // Find middle
  let slow = head;
  let fast = head;
  while (fast.next && fast.next.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  
  // Reverse second half
  let secondHalf = reverseList(slow.next);
  
  // Compare
  let firstHalf = head;
  while (secondHalf) {
    if (firstHalf.value !== secondHalf.value) {
      return false;
    }
    firstHalf = firstHalf.next;
    secondHalf = secondHalf.next;
  }
  
  return true;
  
  function reverseList(head) {
    let prev = null;
    while (head) {
      const next = head.next;
      head.next = prev;
      prev = head;
      head = next;
    }
    return prev;
  }
}
```

####  Key Points:
- "**No random access** - must traverse from head O(n)"
- "**Efficient insertions/deletions** at known positions O(1)"
- "**Doubly-linked allows backward traversal** - O(1) pop vs O(n) for singly"
- "**Floyd's cycle detection** - slow/fast pointers"

---

*[Continuing with Q5-Q10 covering Stacks, Queues, Trees, Graphs, Recursion, and Sorting...]*

### **Q5: Implement Stacks and Queues**
**Difficulty**:  Junior | **Frequency**: 

####  Strong Answer:
"Stacks follow LIFO (Last In, First Out) - like a stack of plates. Queues follow FIFO (First In, First Out) - like a line of people. Both support O(1) insertion and removal."

####  Implementation:
```javascript
// Stack Implementation (Array-based)
class Stack {
  constructor() {
    this.items = [];
  }
  
  // O(1) - Add to top
  push(element) {
    this.items.push(element);
  }
  
  // O(1) - Remove from top
  pop() {
    if (this.isEmpty()) return undefined;
    return this.items.pop();
  }
  
  // O(1) - View top element
  peek() {
    if (this.isEmpty()) return undefined;
    return this.items[this.items.length - 1];
  }
  
  // O(1) - Check if empty
  isEmpty() {
    return this.items.length === 0;
  }
  
  // O(1) - Get size
  size() {
    return this.items.length;
  }
  
  // O(1) - Clear stack
  clear() {
    this.items = [];
  }
}

// Queue Implementation (Array-based)
class Queue {
  constructor() {
    this.items = [];
  }
  
  // O(1) - Add to back
  enqueue(element) {
    this.items.push(element);
  }
  
  // O(n) - Remove from front (array shift is O(n))
  dequeue() {
    if (this.isEmpty()) return undefined;
    return this.items.shift();
  }
  
  // O(1) - View front element
  front() {
    if (this.isEmpty()) return undefined;
    return this.items[0];
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
  
  size() {
    return this.items.length;
  }
}

// Efficient Queue (Object-based) - O(1) dequeue
class EfficientQueue {
  constructor() {
    this.items = {};
    this.frontIndex = 0;
    this.backIndex = 0;
  }
  
  // O(1)
  enqueue(element) {
    this.items[this.backIndex] = element;
    this.backIndex++;
  }
  
  // O(1)
  dequeue() {
    if (this.isEmpty()) return undefined;
    
    const item = this.items[this.frontIndex];
    delete this.items[this.frontIndex];
    this.frontIndex++;
    
    return item;
  }
  
  front() {
    return this.items[this.frontIndex];
  }
  
  isEmpty() {
    return this.backIndex === this.frontIndex;
  }
  
  size() {
    return this.backIndex - this.frontIndex;
  }
}

// Common Stack/Queue Problems

// 1. Valid Parentheses - O(n)
function isValid(s) {
  const stack = [];
  const pairs = { ')': '(', '}': '{', ']': '[' };
  
  for (let char of s) {
    if (!pairs[char]) {
      // Opening bracket
      stack.push(char);
    } else {
      // Closing bracket
      if (stack.pop() !== pairs[char]) {
        return false;
      }
    }
  }
  
  return stack.length === 0;
}

// 2. Min Stack - O(1) for all operations
class MinStack {
  constructor() {
    this.stack = [];
    this.minStack = [];  // Track minimums
  }
  
  push(val) {
    this.stack.push(val);
    
    const min = this.minStack.length === 0
      ? val
      : Math.min(val, this.minStack[this.minStack.length - 1]);
    
    this.minStack.push(min);
  }
  
  pop() {
    this.stack.pop();
    this.minStack.pop();
  }
  
  top() {
    return this.stack[this.stack.length - 1];
  }
  
  getMin() {
    return this.minStack[this.minStack.length - 1];
  }
}

// 3. Implement Queue using Stacks - O(1) amortized
class QueueWithStacks {
  constructor() {
    this.inStack = [];
    this.outStack = [];
  }
  
  enqueue(x) {
    this.inStack.push(x);
  }
  
  dequeue() {
    if (this.outStack.length === 0) {
      while (this.inStack.length > 0) {
        this.outStack.push(this.inStack.pop());
      }
    }
    return this.outStack.pop();
  }
  
  peek() {
    if (this.outStack.length === 0) {
      while (this.inStack.length > 0) {
        this.outStack.push(this.inStack.pop());
      }
    }
    return this.outStack[this.outStack.length - 1];
  }
}

// 4. Daily Temperatures - O(n) monotonic stack
function dailyTemperatures(temperatures) {
  const result = new Array(temperatures.length).fill(0);
  const stack = [];  // Store indices
  
  for (let i = 0; i < temperatures.length; i++) {
    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      const index = stack.pop();
      result[index] = i - index;
    }
    stack.push(i);
  }
  
  return result;
}

// 5. Sliding Window Maximum - O(n) deque
function maxSlidingWindow(nums, k) {
  const result = [];
  const deque = [];  // Store indices, decreasing order
  
  for (let i = 0; i < nums.length; i++) {
    // Remove indices outside window
    while (deque.length > 0 && deque[0] <= i - k) {
      deque.shift();
    }
    
    // Remove smaller elements from back
    while (deque.length > 0 && nums[deque[deque.length - 1]] < nums[i]) {
      deque.pop();
    }
    
    deque.push(i);
    
    // Add to result after first window
    if (i >= k - 1) {
      result.push(nums[deque[0]]);
    }
  }
  
  return result;
}
```

####  Key Points:
- "**Stacks**: DFS, recursion simulation, undo operations, expression evaluation"
- "**Queues**: BFS, task scheduling, level-order traversal"
- "**Monotonic stack/queue** - maintain increasing/decreasing order for optimization"
- "**Array-based queue** has O(n) dequeue, object-based has O(1)"

---

### **Q6: Explain Binary Trees and implement traversals**
**Difficulty**:  Mid-Level | **Frequency**: 

####  Strong Answer:
"Binary trees have nodes with at most two children (left, right). Binary Search Trees (BST) maintain left < parent < right ordering for O(log n) operations. Common traversals: inorder (left-root-right), preorder (root-left-right), postorder (left-right-root), level-order (BFS)."

####  Implementation:
```javascript
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }
  
  // O(log n) average, O(n) worst (unbalanced)
  insert(value) {
    const newNode = new TreeNode(value);
    
    if (!this.root) {
      this.root = newNode;
      return this;
    }
    
    let current = this.root;
    while (true) {
      if (value === current.value) return undefined;  // Duplicate
      
      if (value < current.value) {
        if (!current.left) {
          current.left = newNode;
          return this;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          return this;
        }
        current = current.right;
      }
    }
  }
  
  // O(log n) average, O(n) worst
  search(value) {
    let current = this.root;
    
    while (current) {
      if (value === current.value) return current;
      if (value < current.value) current = current.left;
      else current = current.right;
    }
    
    return null;
  }
  
  // Inorder: Left -> Root -> Right (sorted order for BST)
  inorderTraversal(node = this.root, result = []) {
    if (node) {
      this.inorderTraversal(node.left, result);
      result.push(node.value);
      this.inorderTraversal(node.right, result);
    }
    return result;
  }
  
  // Preorder: Root -> Left -> Right (copy tree)
  preorderTraversal(node = this.root, result = []) {
    if (node) {
      result.push(node.value);
      this.preorderTraversal(node.left, result);
      this.preorderTraversal(node.right, result);
    }
    return result;
  }
  
  // Postorder: Left -> Right -> Root (delete tree)
  postorderTraversal(node = this.root, result = []) {
    if (node) {
      this.postorderTraversal(node.left, result);
      this.postorderTraversal(node.right, result);
      result.push(node.value);
    }
    return result;
  }
  
  // Level-order: BFS (level by level)
  levelOrderTraversal() {
    if (!this.root) return [];
    
    const result = [];
    const queue = [this.root];
    
    while (queue.length > 0) {
      const node = queue.shift();
      result.push(node.value);
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    return result;
  }
}

// Common Tree Problems

// 1. Maximum Depth - O(n)
function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

// 2. Validate BST - O(n)
function isValidBST(root, min = -Infinity, max = Infinity) {
  if (!root) return true;
  
  if (root.value <= min || root.value >= max) {
    return false;
  }
  
  return isValidBST(root.left, min, root.value) &&
         isValidBST(root.right, root.value, max);
}

// 3. Lowest Common Ancestor - O(n)
function lowestCommonAncestor(root, p, q) {
  if (!root || root === p || root === q) {
    return root;
  }
  
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  
  if (left && right) return root;
  return left || right;
}

// 4. Serialize and Deserialize - O(n)
function serialize(root) {
  if (!root) return 'null';
  
  return `${root.value},${serialize(root.left)},${serialize(root.right)}`;
}

function deserialize(data) {
  const values = data.split(',');
  
  function buildTree() {
    const val = values.shift();
    
    if (val === 'null') return null;
    
    const node = new TreeNode(parseInt(val));
    node.left = buildTree();
    node.right = buildTree();
    
    return node;
  }
  
  return buildTree();
}

// 5. Binary Tree Right Side View - O(n)
function rightSideView(root) {
  if (!root) return [];
  
  const result = [];
  const queue = [root];
  
  while (queue.length > 0) {
    const levelSize = queue.length;
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      
      // Last node in level
      if (i === levelSize - 1) {
        result.push(node.value);
      }
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }
  
  return result;
}

// 6. Path Sum - O(n)
function hasPathSum(root, targetSum) {
  if (!root) return false;
  
  if (!root.left && !root.right) {
    return root.value === targetSum;
  }
  
  const remaining = targetSum - root.value;
  return hasPathSum(root.left, remaining) || hasPathSum(root.right, remaining);
}

// 7. Invert Binary Tree - O(n)
function invertTree(root) {
  if (!root) return null;
  
  // Swap children
  [root.left, root.right] = [root.right, root.left];
  
  // Recursively invert subtrees
  invertTree(root.left);
  invertTree(root.right);
  
  return root;
}

// 8. Diameter of Binary Tree - O(n)
function diameterOfBinaryTree(root) {
  let diameter = 0;
  
  function height(node) {
    if (!node) return 0;
    
    const leftHeight = height(node.left);
    const rightHeight = height(node.right);
    
    // Update diameter
    diameter = Math.max(diameter, leftHeight + rightHeight);
    
    return 1 + Math.max(leftHeight, rightHeight);
  }
  
  height(root);
  return diameter;
}
```

####  Key Points:
- "**BST property**: Left subtree < node < right subtree"
- "**Balanced trees** (AVL, Red-Black) guarantee O(log n) operations"
- "**Inorder traversal of BST** gives sorted order"
- "**Recursion natural** for tree problems - base case: null node"

---

### **Q7: Implement Graph representations and traversals**
**Difficulty**:  Mid-Level | **Frequency**: 

####  Strong Answer:
"Graphs have vertices (nodes) connected by edges. Representations: adjacency list (space-efficient) or adjacency matrix (fast edge lookup). Traversals: DFS (stack/recursion - explore deep first) and BFS (queue - explore level by level)."

####  Implementation:
```javascript
// Graph using Adjacency List
class Graph {
  constructor() {
    this.adjacencyList = {};
  }
  
  // O(1)
  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }
  
  // O(1) - Undirected graph
  addEdge(v1, v2) {
    this.adjacencyList[v1].push(v2);
    this.adjacencyList[v2].push(v1);
  }
  
  // O(E) - Remove edge where E is number of edges
  removeEdge(v1, v2) {
    this.adjacencyList[v1] = this.adjacencyList[v1].filter(v => v !== v2);
    this.adjacencyList[v2] = this.adjacencyList[v2].filter(v => v !== v1);
  }
  
  // O(V + E) - Remove vertex
  removeVertex(vertex) {
    while (this.adjacencyList[vertex].length) {
      const adjacentVertex = this.adjacencyList[vertex].pop();
      this.removeEdge(vertex, adjacentVertex);
    }
    delete this.adjacencyList[vertex];
  }
  
  // DFS Recursive - O(V + E)
  dfsRecursive(start) {
    const result = [];
    const visited = {};
    
    const dfs = (vertex) => {
      if (!vertex) return;
      
      visited[vertex] = true;
      result.push(vertex);
      
      this.adjacencyList[vertex].forEach(neighbor => {
        if (!visited[neighbor]) {
          dfs(neighbor);
        }
      });
    };
    
    dfs(start);
    return result;
  }
  
  // DFS Iterative - O(V + E)
  dfsIterative(start) {
    const stack = [start];
    const result = [];
    const visited = {};
    
    visited[start] = true;
    
    while (stack.length) {
      const vertex = stack.pop();
      result.push(vertex);
      
      this.adjacencyList[vertex].forEach(neighbor => {
        if (!visited[neighbor]) {
          visited[neighbor] = true;
          stack.push(neighbor);
        }
      });
    }
    
    return result;
  }
  
  // BFS - O(V + E)
  bfs(start) {
    const queue = [start];
    const result = [];
    const visited = {};
    
    visited[start] = true;
    
    while (queue.length) {
      const vertex = queue.shift();
      result.push(vertex);
      
      this.adjacencyList[vertex].forEach(neighbor => {
        if (!visited[neighbor]) {
          visited[neighbor] = true;
          queue.push(neighbor);
        }
      });
    }
    
    return result;
  }
}

// Common Graph Problems

// 1. Number of Islands - O(m * n)
function numIslands(grid) {
  if (!grid || grid.length === 0) return 0;
  
  let count = 0;
  
  function dfs(i, j) {
    if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length || grid[i][j] === '0') {
      return;
    }
    
    grid[i][j] = '0';  // Mark as visited
    
    // Explore 4 directions
    dfs(i + 1, j);
    dfs(i - 1, j);
    dfs(i, j + 1);
    dfs(i, j - 1);
  }
  
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === '1') {
        count++;
        dfs(i, j);
      }
    }
  }
  
  return count;
}

// 2. Clone Graph - O(V + E)
function cloneGraph(node) {
  if (!node) return null;
  
  const clones = new Map();
  
  function clone(node) {
    if (clones.has(node)) {
      return clones.get(node);
    }
    
    const copy = new Node(node.val);
    clones.set(node, copy);
    
    for (let neighbor of node.neighbors) {
      copy.neighbors.push(clone(neighbor));
    }
    
    return copy;
  }
  
  return clone(node);
}

// 3. Course Schedule (Detect Cycle) - O(V + E)
function canFinish(numCourses, prerequisites) {
  const graph = Array.from({ length: numCourses }, () => []);
  
  // Build graph
  for (let [course, prereq] of prerequisites) {
    graph[prereq].push(course);
  }
  
  const visited = new Array(numCourses).fill(0);  // 0: unvisited, 1: visiting, 2: visited
  
  function hasCycle(course) {
    if (visited[course] === 1) return true;  // Cycle detected
    if (visited[course] === 2) return false;  // Already processed
    
    visited[course] = 1;  // Mark as visiting
    
    for (let next of graph[course]) {
      if (hasCycle(next)) return true;
    }
    
    visited[course] = 2;  // Mark as visited
    return false;
  }
  
  for (let i = 0; i < numCourses; i++) {
    if (hasCycle(i)) return false;
  }
  
  return true;
}

// 4. Shortest Path in Binary Matrix - O(n²) BFS
function shortestPathBinaryMatrix(grid) {
  const n = grid.length;
  
  if (grid[0][0] === 1 || grid[n-1][n-1] === 1) return -1;
  
  const directions = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  const queue = [[0, 0, 1]];  // [row, col, distance]
  grid[0][0] = 1;  // Mark visited
  
  while (queue.length) {
    const [row, col, dist] = queue.shift();
    
    if (row === n - 1 && col === n - 1) return dist;
    
    for (let [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;
      
      if (newRow >= 0 && newRow < n && newCol >= 0 && newCol < n && grid[newRow][newCol] === 0) {
        queue.push([newRow, newCol, dist + 1]);
        grid[newRow][newCol] = 1;
      }
    }
  }
  
  return -1;
}

// 5. Dijkstra's Algorithm - O((V + E) log V) with priority queue
function dijkstra(graph, start) {
  const distances = {};
  const pq = new PriorityQueue();
  
  // Initialize distances
  for (let vertex in graph) {
    distances[vertex] = Infinity;
  }
  distances[start] = 0;
  
  pq.enqueue(start, 0);
  
  while (!pq.isEmpty()) {
    const { value: vertex } = pq.dequeue();
    
    for (let neighbor in graph[vertex]) {
      const distance = distances[vertex] + graph[vertex][neighbor];
      
      if (distance < distances[neighbor]) {
        distances[neighbor] = distance;
        pq.enqueue(neighbor, distance);
      }
    }
  }
  
  return distances;
}
```

####  Key Points:
- "**DFS**: Stack (LIFO) - good for path finding, cycle detection"
- "**BFS**: Queue (FIFO) - guarantees shortest path in unweighted graph"
- "**Adjacency list** O(V+E) space, O(V) to check edge"
- "**Adjacency matrix** O(V²) space, O(1) to check edge"

---

### **Q8: Explain Recursion and Dynamic Programming**
**Difficulty**:  Mid-Level | **Frequency**: 

####  Strong Answer:
"Recursion solves problems by breaking them into smaller subproblems. Dynamic Programming optimizes recursion by caching (memoization) or building solutions bottom-up (tabulation) to avoid redundant calculations."

####  Implementation:
```javascript
// Fibonacci - Three approaches

// 1. Naive Recursion - O(2ⁿ) time, O(n) space
function fibRecursive(n) {
  if (n <= 1) return n;
  return fibRecursive(n - 1) + fibRecursive(n - 2);
}

// 2. Memoization (Top-Down DP) - O(n) time, O(n) space
function fibMemo(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  
  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  return memo[n];
}

// 3. Tabulation (Bottom-Up DP) - O(n) time, O(n) space
function fibTabulation(n) {
  if (n <= 1) return n;
  
  const dp = [0, 1];
  
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  
  return dp[n];
}

// 4. Space Optimized - O(n) time, O(1) space
function fibOptimized(n) {
  if (n <= 1) return n;
  
  let prev = 0, curr = 1;
  
  for (let i = 2; i <= n; i++) {
    [prev, curr] = [curr, prev + curr];
  }
  
  return curr;
}

// Common DP Problems

// 1. Climbing Stairs - O(n)
function climbStairs(n) {
  if (n <= 2) return n;
  
  let oneStep = 2, twoSteps = 1;
  
  for (let i = 3; i <= n; i++) {
    [oneStep, twoSteps] = [oneStep + twoSteps, oneStep];
  }
  
  return oneStep;
}

// 2. Coin Change - O(amount * coins.length)
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  
  for (let i = 1; i <= amount; i++) {
    for (let coin of coins) {
      if (i >= coin) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  
  return dp[amount] === Infinity ? -1 : dp[amount];
}

// 3. Longest Increasing Subsequence - O(n²)
function lengthOfLIS(nums) {
  const dp = new Array(nums.length).fill(1);
  
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[i] > nums[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }
  
  return Math.max(...dp);
}

// 4. 0/1 Knapsack - O(n * capacity)
function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          dp[i - 1][w],
          values[i - 1] + dp[i - 1][w - weights[i - 1]]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  
  return dp[n][capacity];
}

// 5. Edit Distance - O(m * n)
function minDistance(word1, word2) {
  const m = word1.length;
  const n = word2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  
  // Initialize base cases
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],      // Delete
          dp[i][j - 1],      // Insert
          dp[i - 1][j - 1]   // Replace
        );
      }
    }
  }
  
  return dp[m][n];
}
```

####  Key Points:
- "**Recursion needs** base case (stop condition) and recursive case"
- "**DP identifies**: overlapping subproblems + optimal substructure"
- "**Memoization** = top-down (recursive with cache)"
- "**Tabulation** = bottom-up (iterative with table)"

---

### **Q9: Implement common Sorting algorithms**
**Difficulty**:  Mid-Level | **Frequency**: 

####  Strong Answer:
"Common sorts: Bubble/Selection/Insertion O(n²) - simple but slow. Merge/Quick/Heap O(n log n) - efficient. Counting/Radix O(n+k) - linear for specific inputs."

####  Implementation:
```javascript
// 1. Bubble Sort - O(n²) time, O(1) space
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    let swapped = false;
    
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    
    if (!swapped) break;  // Already sorted
  }
  return arr;
}

// 2. Selection Sort - O(n²) time, O(1) space
function selectionSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    let minIndex = i;
    
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
  return arr;
}

// 3. Insertion Sort - O(n²) time, O(1) space
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    
    arr[j + 1] = key;
  }
  return arr;
}

// 4. Merge Sort - O(n log n) time, O(n) space
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
  
  function merge(left, right) {
    const result = [];
    let i = 0, j = 0;
    
    while (i < left.length && j < right.length) {
      if (left[i] < right[j]) {
        result.push(left[i++]);
      } else {
        result.push(right[j++]);
      }
    }
    
    return result.concat(left.slice(i)).concat(right.slice(j));
  }
}

// 5. Quick Sort - O(n log n) average, O(n²) worst, O(log n) space
function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    const pivotIndex = partition(arr, left, right);
    quickSort(arr, left, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, right);
  }
  return arr;
  
  function partition(arr, left, right) {
    const pivot = arr[right];
    let i = left - 1;
    
    for (let j = left; j < right; j++) {
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
    
    [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
    return i + 1;
  }
}

// 6. Heap Sort - O(n log n) time, O(1) space
function heapSort(arr) {
  const n = arr.length;
  
  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  
  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  
  return arr;
  
  function heapify(arr, n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    if (left < n && arr[left] > arr[largest]) {
      largest = left;
    }
    
    if (right < n && arr[right] > arr[largest]) {
      largest = right;
    }
    
    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      heapify(arr, n, largest);
    }
  }
}
```

####  Key Points:
- "**Stable sorts** preserve relative order of equal elements (Merge, Insertion)"
- "**In-place sorts** use O(1) extra space (Quick, Heap, Bubble)"
- "**Merge sort** best for linked lists, guaranteed O(n log n)"
- "**Quick sort** best average case, cache-friendly"

---

### **Q10: Explain Binary Search and its variants**
**Difficulty**:  Junior | **Frequency**: 

####  Strong Answer:
"Binary search finds element in sorted array in O(log n) by repeatedly dividing search space in half. Variants include finding first/last occurrence, searching rotated arrays, and finding peak elements."

####  Implementation:
```javascript
// 1. Basic Binary Search - O(log n)
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  
  return -1;
}

// 2. Binary Search Recursive
function binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {
  if (left > right) return -1;
  
  const mid = Math.floor((left + right) / 2);
  
  if (arr[mid] === target) return mid;
  if (arr[mid] < target) return binarySearchRecursive(arr, target, mid + 1, right);
  return binarySearchRecursive(arr, target, left, mid - 1);
}

// 3. Find First Occurrence
function findFirst(arr, target) {
  let left = 0, right = arr.length - 1;
  let result = -1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      result = mid;
      right = mid - 1;  // Continue searching left
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return result;
}

// 4. Find Last Occurrence
function findLast(arr, target) {
  let left = 0, right = arr.length - 1;
  let result = -1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      result = mid;
      left = mid + 1;  // Continue searching right
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return result;
}

// 5. Search in Rotated Sorted Array
function searchRotated(nums, target) {
  let left = 0, right = nums.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (nums[mid] === target) return mid;
    
    // Left half is sorted
    if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    // Right half is sorted
    else {
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }
  
  return -1;
}

// 6. Find Peak Element
function findPeakElement(nums) {
  let left = 0, right = nums.length - 1;
  
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    
    if (nums[mid] > nums[mid + 1]) {
      right = mid;  // Peak is on left or mid
    } else {
      left = mid + 1;  // Peak is on right
    }
  }
  
  return left;
}

// 7. Square Root (Integer)
function mySqrt(x) {
  if (x < 2) return x;
  
  let left = 1, right = Math.floor(x / 2);
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const square = mid * mid;
    
    if (square === x) return mid;
    if (square < x) left = mid + 1;
    else right = mid - 1;
  }
  
  return right;
}
```

####  Key Points:
- "**Requires sorted input** - O(n log n) sort + O(log n) search"
- "**Avoid overflow**: Use `mid = left + Math.floor((right - left) / 2)`"
- "**Invariant**: Target must be in [left, right] if it exists"
- "**Binary search on answer** - guess and validate pattern"

---

##  PRACTICAL CODING PATTERNS (Q11-20)
### Essential Problem-Solving Techniques

---

### **Q11: Two Pointers Pattern**
**Difficulty**:  Junior | **Frequency**: 

####  Explanation:
"Two pointers technique uses two indices moving through data structure simultaneously. Common variants: opposite ends converging, slow/fast pointers, sliding window."

####  Common Problems:
```javascript
// 1. Two Sum II (Sorted Array) - O(n)
function twoSumSorted(numbers, target) {
  let left = 0, right = numbers.length - 1;
  
  while (left < right) {
    const sum = numbers[left] + numbers[right];
    
    if (sum === target) return [left + 1, right + 1];
    if (sum < target) left++;
    else right--;
  }
  
  return [];
}

// 2. Remove Duplicates - O(n)
function removeDuplicates(nums) {
  if (nums.length === 0) return 0;
  
  let writeIndex = 1;
  
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[i - 1]) {
      nums[writeIndex] = nums[i];
      writeIndex++;
    }
  }
  
  return writeIndex;
}

// 3. 3Sum - O(n²)
function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];
  
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    
    let left = i + 1, right = nums.length - 1;
    
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        
        left++;
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }
  
  return result;
}

// 4. Trap Rain Water - O(n)
function trap(height) {
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0;
  let water = 0;
  
  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) {
        leftMax = height[left];
      } else {
        water += leftMax - height[left];
      }
      left++;
    } else {
      if (height[right] >= rightMax) {
        rightMax = height[right];
      } else {
        water += rightMax - height[right];
      }
      right--;
    }
  }
  
  return water;
}

// 5. Palindrome Check - O(n)
function isPalindrome(s) {
  s = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  let left = 0, right = s.length - 1;
  
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }
  
  return true;
}
```

####  Key Points:
- "**Sorted arrays** - converging pointers from ends"
- "**Fast/slow pointers** - cycle detection (Floyd's algorithm)"
- "**Time O(n)** vs nested loops O(n²)"
- "**Common use**: Merge, partition, remove duplicates"

---

*[Continuing with remaining patterns Q12-Q20...]*

### **Q12: Sliding Window Pattern**
**Difficulty**:  Mid-Level | **Frequency**: 

####  Explanation:
"Sliding window maintains a subset of elements using two pointers. Fixed-size windows move by adding new element and removing old. Variable-size windows expand/shrink based on condition."

####  Common Problems:
```javascript
// 1. Maximum Sum Subarray of Size K - O(n)
function maxSumSubarray(arr, k) {
  let maxSum = 0, windowSum = 0;
  
  // First window
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }
  maxSum = windowSum;
  
  // Slide window
  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum - arr[i - k] + arr[i];
    maxSum = Math.max(maxSum, windowSum);
  }
  
  return maxSum;
}

// 2. Longest Substring Without Repeating Characters - O(n)
function lengthOfLongestSubstring(s) {
  const seen = new Map();
  let maxLength = 0;
  let start = 0;
  
  for (let end = 0; end < s.length; end++) {
    const char = s[end];
    
    // If char seen and in current window
    if (seen.has(char) && seen.get(char) >= start) {
      start = seen.get(char) + 1;
    }
    
    seen.set(char, end);
    maxLength = Math.max(maxLength, end - start + 1);
  }
  
  return maxLength;
}

// 3. Minimum Window Substring - O(n + m)
function minWindow(s, t) {
  if (s.length < t.length) return "";
  
  const need = new Map();
  const window = new Map();
  
  for (let char of t) {
    need.set(char, (need.get(char) || 0) + 1);
  }
  
  let left = 0, right = 0;
  let valid = 0;
  let start = 0, minLen = Infinity;
  
  while (right < s.length) {
    const char = s[right];
    right++;
    
    if (need.has(char)) {
      window.set(char, (window.get(char) || 0) + 1);
      if (window.get(char) === need.get(char)) {
        valid++;
      }
    }
    
    // Shrink window when valid
    while (valid === need.size) {
      if (right - left < minLen) {
        start = left;
        minLen = right - left;
      }
      
      const d = s[left];
      left++;
      
      if (need.has(d)) {
        if (window.get(d) === need.get(d)) {
          valid--;
        }
        window.set(d, window.get(d) - 1);
      }
    }
  }
  
  return minLen === Infinity ? "" : s.substr(start, minLen);
}

// 4. Fruits Into Baskets (Max 2 Types) - O(n)
function totalFruit(fruits) {
  const basket = new Map();
  let maxFruits = 0;
  let left = 0;
  
  for (let right = 0; right < fruits.length; right++) {
    basket.set(fruits[right], (basket.get(fruits[right]) || 0) + 1);
    
    // Shrink if more than 2 types
    while (basket.size > 2) {
      basket.set(fruits[left], basket.get(fruits[left]) - 1);
      if (basket.get(fruits[left]) === 0) {
        basket.delete(fruits[left]);
      }
      left++;
    }
    
    maxFruits = Math.max(maxFruits, right - left + 1);
  }
  
  return maxFruits;
}

// 5. Find All Anagrams in String - O(n)
function findAnagrams(s, p) {
  if (s.length < p.length) return [];
  
  const result = [];
  const pCount = new Array(26).fill(0);
  const sCount = new Array(26).fill(0);
  
  const aCode = 'a'.charCodeAt(0);
  
  // Count p characters
  for (let char of p) {
    pCount[char.charCodeAt(0) - aCode]++;
  }
  
  // First window
  for (let i = 0; i < p.length; i++) {
    sCount[s.charCodeAt(i) - aCode]++;
  }
  
  if (arraysEqual(pCount, sCount)) {
    result.push(0);
  }
  
  // Slide window
  for (let i = p.length; i < s.length; i++) {
    sCount[s.charCodeAt(i) - aCode]++;
    sCount[s.charCodeAt(i - p.length) - aCode]--;
    
    if (arraysEqual(pCount, sCount)) {
      result.push(i - p.length + 1);
    }
  }
  
  return result;
  
  function arraysEqual(arr1, arr2) {
    return arr1.every((val, i) => val === arr2[i]);
  }
}
```

####  Key Points:
- "**Fixed window** - add right, remove left, O(n) single pass"
- "**Variable window** - expand right until invalid, shrink left until valid"
- "**Hash map** tracks window contents for frequency/uniqueness"
- "**Templates**: Substring, subarray, consecutive elements problems"

---

### **Q13: Fast & Slow Pointers (Floyd's Cycle)**
**Difficulty**:  Mid-Level | **Frequency**: 

####  Explanation:
"Fast pointer moves 2 steps, slow moves 1 step. Detects cycles (linked list), finds middle element, determines cycle start. Also called 'tortoise and hare' algorithm."

####  Common Problems:
```javascript
// 1. Linked List Cycle Detection - O(n)
function hasCycle(head) {
  let slow = head;
  let fast = head;
  
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    
    if (slow === fast) return true;
  }
  
  return false;
}

// 2. Find Cycle Start - O(n)
function detectCycle(head) {
  let slow = head;
  let fast = head;
  
  // Find meeting point
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    
    if (slow === fast) {
      // Reset slow to head
      slow = head;
      
      // Move both 1 step at a time
      while (slow !== fast) {
        slow = slow.next;
        fast = fast.next;
      }
      
      return slow;
    }
  }
  
  return null;
}

// 3. Find Middle of Linked List - O(n)
function findMiddle(head) {
  let slow = head;
  let fast = head;
  
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  
  return slow;
}

// 4. Happy Number - O(log n)
function isHappy(n) {
  function getNext(num) {
    let sum = 0;
    while (num > 0) {
      const digit = num % 10;
      sum += digit * digit;
      num = Math.floor(num / 10);
    }
    return sum;
  }
  
  let slow = n;
  let fast = n;
  
  do {
    slow = getNext(slow);
    fast = getNext(getNext(fast));
  } while (slow !== fast);
  
  return slow === 1;
}

// 5. Palindrome Linked List - O(n) time, O(1) space
function isPalindromeList(head) {
  if (!head || !head.next) return true;
  
  // Find middle
  let slow = head;
  let fast = head;
  
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  
  // Reverse second half
  let prev = null;
  let curr = slow;
  
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  
  // Compare halves
  let left = head;
  let right = prev;
  
  while (right) {
    if (left.value !== right.value) return false;
    left = left.next;
    right = right.next;
  }
  
  return true;
}

// 6. Reorder List - O(n)
function reorderList(head) {
  if (!head || !head.next) return;
  
  // Find middle
  let slow = head;
  let fast = head;
  
  while (fast.next && fast.next.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  
  // Reverse second half
  let prev = null;
  let curr = slow.next;
  slow.next = null;
  
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  
  // Merge two halves
  let first = head;
  let second = prev;
  
  while (second) {
    const temp1 = first.next;
    const temp2 = second.next;
    
    first.next = second;
    second.next = temp1;
    
    first = temp1;
    second = temp2;
  }
}
```

####  Key Points:
- "**Why it works**: Fast catches slow in cycle (mathematical proof)"
- "**Cycle start**: Distance from head = distance from meeting point"
- "**Space O(1)** - no hash set needed for cycle detection"
- "**Applications**: Middle node, palindrome check, reorder list"

---

### **Q14: Merge Intervals Pattern**
**Difficulty**:  Mid-Level | **Frequency**: 

####  Explanation:
"Merge intervals deals with overlapping ranges. Key: sort intervals, then merge/check overlaps. Common in scheduling, calendar problems."

####  Common Problems:
```javascript
// 1. Merge Intervals - O(n log n)
function merge(intervals) {
  if (intervals.length <= 1) return intervals;
  
  // Sort by start time
  intervals.sort((a, b) => a[0] - b[0]);
  
  const result = [intervals[0]];
  
  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i];
    const lastMerged = result[result.length - 1];
    
    if (current[0] <= lastMerged[1]) {
      // Overlap - merge
      lastMerged[1] = Math.max(lastMerged[1], current[1]);
    } else {
      // No overlap
      result.push(current);
    }
  }
  
  return result;
}

// 2. Insert Interval - O(n)
function insert(intervals, newInterval) {
  const result = [];
  let i = 0;
  
  // Add intervals before newInterval
  while (i < intervals.length && intervals[i][1] < newInterval[0]) {
    result.push(intervals[i]);
    i++;
  }
  
  // Merge overlapping intervals
  while (i < intervals.length && intervals[i][0] <= newInterval[1]) {
    newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
    newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
    i++;
  }
  result.push(newInterval);
  
  // Add remaining intervals
  while (i < intervals.length) {
    result.push(intervals[i]);
    i++;
  }
  
  return result;
}

// 3. Non-overlapping Intervals (Min Removals) - O(n log n)
function eraseOverlapIntervals(intervals) {
  if (intervals.length <= 1) return 0;
  
  // Sort by end time (greedy)
  intervals.sort((a, b) => a[1] - b[1]);
  
  let count = 0;
  let end = intervals[0][1];
  
  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] < end) {
      // Overlap - remove interval
      count++;
    } else {
      // No overlap - update end
      end = intervals[i][1];
    }
  }
  
  return count;
}

// 4. Meeting Rooms II (Min Rooms Needed) - O(n log n)
function minMeetingRooms(intervals) {
  if (intervals.length === 0) return 0;
  
  const starts = intervals.map(i => i[0]).sort((a, b) => a - b);
  const ends = intervals.map(i => i[1]).sort((a, b) => a - b);
  
  let rooms = 0;
  let endPtr = 0;
  
  for (let start of starts) {
    if (start < ends[endPtr]) {
      // Need new room
      rooms++;
    } else {
      // Reuse room
      endPtr++;
    }
  }
  
  return rooms;
}

// 5. Interval List Intersections - O(n + m)
function intervalIntersection(firstList, secondList) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < firstList.length && j < secondList.length) {
    const start = Math.max(firstList[i][0], secondList[j][0]);
    const end = Math.min(firstList[i][1], secondList[j][1]);
    
    if (start <= end) {
      result.push([start, end]);
    }
    
    // Move pointer with smaller end
    if (firstList[i][1] < secondList[j][1]) {
      i++;
    } else {
      j++;
    }
  }
  
  return result;
}

// 6. Employee Free Time - O(n log n)
function employeeFreeTime(schedule) {
  const intervals = [];
  
  // Flatten all schedules
  for (let employee of schedule) {
    for (let interval of employee) {
      intervals.push(interval);
    }
  }
  
  // Sort by start time
  intervals.sort((a, b) => a.start - b.start);
  
  const result = [];
  let end = intervals[0].end;
  
  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i].start > end) {
      // Gap found - free time
      result.push(new Interval(end, intervals[i].start));
    }
    end = Math.max(end, intervals[i].end);
  }
  
  return result;
}
```

####  Key Points:
- "**Always sort first** - by start or end depending on problem"
- "**Greedy approach** - sort by end time for max intervals"
- "**Two pointers** for merging sorted interval lists"
- "**Priority queue** for dynamic interval processing"

---

### **Q15: Top K Elements (Heap)**
**Difficulty**:  Mid-Level | **Frequency**: 

####  Explanation:
"Find top K elements using heap (priority queue). Min heap of size K keeps K largest elements. Max heap finds K smallest. O(n log k) better than O(n log n) sort."

#### �� Common Problems:
```javascript
// Simple MinHeap implementation
class MinHeap {
  constructor() {
    this.heap = [];
  }
  
  size() {
    return this.heap.length;
  }
  
  peek() {
    return this.heap[0];
  }
  
  push(val) {
    this.heap.push(val);
    this.bubbleUp(this.heap.length - 1);
  }
  
  pop() {
    if (this.size() === 0) return null;
    if (this.size() === 1) return this.heap.pop();
    
    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.bubbleDown(0);
    return min;
  }
  
  bubbleUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      
      if (this.heap[index] >= this.heap[parentIndex]) break;
      
      [this.heap[index], this.heap[parentIndex]] = 
        [this.heap[parentIndex], this.heap[index]];
      
      index = parentIndex;
    }
  }
  
  bubbleDown(index) {
    while (true) {
      let smallest = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      
      if (left < this.size() && this.heap[left] < this.heap[smallest]) {
        smallest = left;
      }
      
      if (right < this.size() && this.heap[right] < this.heap[smallest]) {
        smallest = right;
      }
      
      if (smallest === index) break;
      
      [this.heap[index], this.heap[smallest]] = 
        [this.heap[smallest], this.heap[index]];
      
      index = smallest;
    }
  }
}

// 1. Kth Largest Element - O(n log k)
function findKthLargest(nums, k) {
  const minHeap = new MinHeap();
  
  for (let num of nums) {
    minHeap.push(num);
    
    if (minHeap.size() > k) {
      minHeap.pop();
    }
  }
  
  return minHeap.peek();
}

// 2. Top K Frequent Elements - O(n log k)
function topKFrequent(nums, k) {
  const freq = new Map();
  
  for (let num of nums) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }
  
  // Min heap by frequency
  const heap = [];
  
  for (let [num, count] of freq) {
    heap.push([count, num]);
    
    if (heap.length > k) {
      heap.sort((a, b) => a[0] - b[0]);
      heap.shift();
    }
  }
  
  return heap.map(item => item[1]);
}

// 3. K Closest Points to Origin - O(n log k)
function kClosest(points, k) {
  const distance = ([x, y]) => x * x + y * y;
  
  // Max heap by distance
  const heap = [];
  
  for (let point of points) {
    const dist = distance(point);
    heap.push([dist, point]);
    
    if (heap.length > k) {
      heap.sort((a, b) => b[0] - a[0]);  // Max heap
      heap.shift();
    }
  }
  
  return heap.map(item => item[1]);
}

// 4. Kth Smallest Element in Sorted Matrix - O(k log n)
function kthSmallest(matrix, k) {
  const n = matrix.length;
  const heap = [];
  
  // Add first element from each row
  for (let r = 0; r < Math.min(n, k); r++) {
    heap.push([matrix[r][0], r, 0]);
  }
  
  heap.sort((a, b) => a[0] - b[0]);
  
  let count = 0;
  
  while (count < k) {
    const [val, row, col] = heap.shift();
    count++;
    
    if (count === k) return val;
    
    // Add next element from same row
    if (col + 1 < n) {
      heap.push([matrix[row][col + 1], row, col + 1]);
      heap.sort((a, b) => a[0] - b[0]);
    }
  }
}

// 5. Find Median from Data Stream - O(log n) insert, O(1) find
class MedianFinder {
  constructor() {
    this.maxHeap = [];  // Lower half (max heap)
    this.minHeap = [];  // Upper half (min heap)
  }
  
  addNum(num) {
    // Add to max heap (lower half)
    this.maxHeap.push(num);
    this.maxHeap.sort((a, b) => b - a);
    
    // Balance: move largest from lower to upper
    this.minHeap.push(this.maxHeap.shift());
    this.minHeap.sort((a, b) => a - b);
    
    // Keep max heap size >= min heap
    if (this.maxHeap.length < this.minHeap.length) {
      this.maxHeap.push(this.minHeap.shift());
      this.maxHeap.sort((a, b) => b - a);
    }
  }
  
  findMedian() {
    if (this.maxHeap.length > this.minHeap.length) {
      return this.maxHeap[0];
    }
    return (this.maxHeap[0] + this.minHeap[0]) / 2;
  }
}
```

####  Key Points:
- "**Min heap of size K** for K largest elements (counterintuitive!)"
- "**Max heap of size K** for K smallest elements"
- "**O(n log k)** vs O(n log n) sort - better for small k"
- "**Median maintenance** - two heaps (max for lower, min for upper)"

---

### **Q16: Modified Binary Search**
**Difficulty**:  Mid-Level | **Frequency**: 

####  Explanation:
"Binary search on answer space - guess answer and validate. Common for optimization problems: find minimum/maximum value satisfying condition."

####  Common Problems:
```javascript
// 1. Find Minimum in Rotated Sorted Array - O(log n)
function findMin(nums) {
  let left = 0, right = nums.length - 1;
  
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    
    if (nums[mid] > nums[right]) {
      // Min is in right half
      left = mid + 1;
    } else {
      // Min is in left half or mid
      right = mid;
    }
  }
  
  return nums[left];
}

// 2. Search in 2D Matrix - O(log(m*n))
function searchMatrix(matrix, target) {
  if (matrix.length === 0) return false;
  
  const m = matrix.length;
  const n = matrix[0].length;
  let left = 0, right = m * n - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const row = Math.floor(mid / n);
    const col = mid % n;
    const value = matrix[row][col];
    
    if (value === target) return true;
    if (value < target) left = mid + 1;
    else right = mid - 1;
  }
  
  return false;
}

// 3. Capacity To Ship Packages - O(n * log(sum))
function shipWithinDays(weights, days) {
  let left = Math.max(...weights);  // Min capacity
  let right = weights.reduce((a, b) => a + b);  // Max capacity
  
  function canShip(capacity) {
    let daysNeeded = 1;
    let currentWeight = 0;
    
    for (let weight of weights) {
      if (currentWeight + weight > capacity) {
        daysNeeded++;
        currentWeight = 0;
      }
      currentWeight += weight;
    }
    
    return daysNeeded <= days;
  }
  
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    
    if (canShip(mid)) {
      right = mid;  // Try smaller capacity
    } else {
      left = mid + 1;  // Need larger capacity
    }
  }
  
  return left;
}

// 4. Koko Eating Bananas - O(n * log(max))
function minEatingSpeed(piles, h) {
  let left = 1;
  let right = Math.max(...piles);
  
  function canFinish(speed) {
    let hours = 0;
    for (let pile of piles) {
      hours += Math.ceil(pile / speed);
    }
    return hours <= h;
  }
  
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    
    if (canFinish(mid)) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  
  return left;
}

// 5. Split Array Largest Sum - O(n * log(sum))
function splitArray(nums, m) {
  let left = Math.max(...nums);
  let right = nums.reduce((a, b) => a + b);
  
  function canSplit(maxSum) {
    let splits = 1;
    let currentSum = 0;
    
    for (let num of nums) {
      if (currentSum + num > maxSum) {
        splits++;
        currentSum = 0;
      }
      currentSum += num;
    }
    
    return splits <= m;
  }
  
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    
    if (canSplit(mid)) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  
  return left;
}
```

####  Key Points:
- "**Binary search on answer** - define range, check if answer valid"
- "**Validation function** - O(n) check if guess works"
- "**Total complexity** O(n * log(max-min))"
- "**Pattern**: Minimize maximum or maximize minimum"

---

### **Q17: Tree DFS Patterns**
**Difficulty**:  Mid-Level | **Frequency**: 

####  Explanation:
"Tree DFS explores depth-first using recursion or stack. Common patterns: path sum, subtree, tree construction, views."

####  Common Problems:
```javascript
// 1. All Paths from Root to Leaves - O(n)
function binaryTreePaths(root) {
  const result = [];
  
  function dfs(node, path) {
    if (!node) return;
    
    path += node.val;
    
    // Leaf node
    if (!node.left && !node.right) {
      result.push(path);
      return;
    }
    
    path += '->';
    dfs(node.left, path);
    dfs(node.right, path);
  }
  
  dfs(root, '');
  return result;
}

// 2. Path Sum II (All Paths) - O(n)
function pathSum(root, targetSum) {
  const result = [];
  
  function dfs(node, remaining, path) {
    if (!node) return;
    
    path.push(node.val);
    
    if (!node.left && !node.right && remaining === node.val) {
      result.push([...path]);
    }
    
    dfs(node.left, remaining - node.val, path);
    dfs(node.right, remaining - node.val, path);
    
    path.pop();  // Backtrack
  }
  
  dfs(root, targetSum, []);
  return result;
}

// 3. Count Univalue Subtrees - O(n)
function countUnivalSubtrees(root) {
  let count = 0;
  
  function isUnival(node) {
    if (!node) return true;
    
    const leftUnival = isUnival(node.left);
    const rightUnival = isUnival(node.right);
    
    // Check if current node forms unival subtree
    if (leftUnival && rightUnival) {
      if ((!node.left || node.left.val === node.val) &&
          (!node.right || node.right.val === node.val)) {
        count++;
        return true;
      }
    }
    
    return false;
  }
  
  isUnival(root);
  return count;
}

// 4. Construct Binary Tree from Preorder and Inorder - O(n)
function buildTree(preorder, inorder) {
  if (preorder.length === 0) return null;
  
  const rootVal = preorder[0];
  const root = new TreeNode(rootVal);
  
  const mid = inorder.indexOf(rootVal);
  
  root.left = buildTree(
    preorder.slice(1, mid + 1),
    inorder.slice(0, mid)
  );
  
  root.right = buildTree(
    preorder.slice(mid + 1),
    inorder.slice(mid + 1)
  );
  
  return root;
}

// 5. Binary Tree Maximum Path Sum - O(n)
function maxPathSum(root) {
  let maxSum = -Infinity;
  
  function dfs(node) {
    if (!node) return 0;
    
    // Get max path sum from left and right (ignore negative)
    const left = Math.max(0, dfs(node.left));
    const right = Math.max(0, dfs(node.right));
    
    // Path through current node
    maxSum = Math.max(maxSum, node.val + left + right);
    
    // Return max single path through node
    return node.val + Math.max(left, right);
  }
  
  dfs(root);
  return maxSum;
}

// 6. Flatten Binary Tree to Linked List - O(n)
function flatten(root) {
  if (!root) return;
  
  flatten(root.left);
  flatten(root.right);
  
  // Save right subtree
  const rightSubtree = root.right;
  
  // Move left subtree to right
  root.right = root.left;
  root.left = null;
  
  // Attach original right subtree
  let current = root;
  while (current.right) {
    current = current.right;
  }
  current.right = rightSubtree;
}
```

####  Key Points:
- "**Recursive template**: Base case → process → recurse left/right"
- "**Return values** - aggregate info (height, sum, validity)"
- "**Path tracking** - add before recursion, remove after (backtrack)"
- "**Global variables** for non-local results (max, count)"

---

### **Q18: Tree BFS (Level Order)**
**Difficulty**:  Mid-Level | **Frequency**: 

####  Explanation:
"BFS traverses tree level by level using queue. Track level size to process nodes by level. Useful for level-specific operations."

####  Common Problems:
```javascript
// 1. Level Order Traversal - O(n)
function levelOrder(root) {
  if (!root) return [];
  
  const result = [];
  const queue = [root];
  
  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = [];
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.val);
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    result.push(currentLevel);
  }
  
  return result;
}

// 2. Zigzag Level Order - O(n)
function zigzagLevelOrder(root) {
  if (!root) return [];
  
  const result = [];
  const queue = [root];
  let leftToRight = true;
  
  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = [];
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      
      if (leftToRight) {
        currentLevel.push(node.val);
      } else {
        currentLevel.unshift(node.val);
      }
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    result.push(currentLevel);
    leftToRight = !leftToRight;
  }
  
  return result;
}

// 3. Average of Levels - O(n)
function averageOfLevels(root) {
  const result = [];
  const queue = [root];
  
  while (queue.length > 0) {
    const levelSize = queue.length;
    let levelSum = 0;
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      levelSum += node.val;
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    result.push(levelSum / levelSize);
  }
  
  return result;
}

// 4. Minimum Depth - O(n)
function minDepth(root) {
  if (!root) return 0;
  
  const queue = [[root, 1]];  // [node, depth]
  
  while (queue.length > 0) {
    const [node, depth] = queue.shift();
    
    // First leaf found
    if (!node.left && !node.right) {
      return depth;
    }
    
    if (node.left) queue.push([node.left, depth + 1]);
    if (node.right) queue.push([node.right, depth + 1]);
  }
}

// 5. Connect Level Order Siblings - O(n)
function connect(root) {
  if (!root) return null;
  
  const queue = [root];
  
  while (queue.length > 0) {
    const levelSize = queue.length;
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      
      // Connect to next node in level
      if (i < levelSize - 1) {
        node.next = queue[0];
      }
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }
  
  return root;
}

// 6. Vertical Order Traversal - O(n log n)
function verticalOrder(root) {
  if (!root) return [];
  
  const columnTable = new Map();
  const queue = [[root, 0]];  // [node, column]
  let minColumn = 0, maxColumn = 0;
  
  while (queue.length > 0) {
    const [node, column] = queue.shift();
    
    if (!columnTable.has(column)) {
      columnTable.set(column, []);
    }
    columnTable.get(column).push(node.val);
    
    minColumn = Math.min(minColumn, column);
    maxColumn = Math.max(maxColumn, column);
    
    if (node.left) queue.push([node.left, column - 1]);
    if (node.right) queue.push([node.right, column + 1]);
  }
  
  const result = [];
  for (let i = minColumn; i <= maxColumn; i++) {
    result.push(columnTable.get(i));
  }
  
  return result;
}
```

####  Key Points:
- "**Queue-based** - FIFO ensures level-by-level processing"
- "**Track level size** - process exactly one level per iteration"
- "**Early termination** - BFS finds shortest path first"
- "**Variants**: Zigzag, right view, vertical order, connect siblings"

---

### **Q19: Graph Patterns (Advanced)**
**Difficulty**:  Senior | **Frequency**: 

####  Explanation:
"Advanced graph algorithms: topological sort (DAG ordering), Union-Find (cycle detection, connected components), Dijkstra (shortest path)."

####  Common Problems:
```javascript
// 1. Topological Sort (Kahn's Algorithm) - O(V + E)
function findOrder(numCourses, prerequisites) {
  const graph = Array.from({ length: numCourses }, () => []);
  const indegree = new Array(numCourses).fill(0);
  
  // Build graph
  for (let [course, prereq] of prerequisites) {
    graph[prereq].push(course);
    indegree[course]++;
  }
  
  // Start with courses having no prerequisites
  const queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (indegree[i] === 0) queue.push(i);
  }
  
  const result = [];
  
  while (queue.length > 0) {
    const course = queue.shift();
    result.push(course);
    
    for (let next of graph[course]) {
      indegree[next]--;
      if (indegree[next] === 0) {
        queue.push(next);
      }
    }
  }
  
  return result.length === numCourses ? result : [];
}

// 2. Union-Find (Disjoint Set) - O(α(n)) amortized
class UnionFind {
  constructor(size) {
    this.parent = Array.from({ length: size }, (_, i) => i);
    this.rank = new Array(size).fill(0);
    this.components = size;
  }
  
  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);  // Path compression
    }
    return this.parent[x];
  }
  
  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);
    
    if (rootX === rootY) return false;  // Already connected
    
    // Union by rank
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }
    
    this.components--;
    return true;
  }
  
  connected(x, y) {
    return this.find(x) === this.find(y);
  }
}

// 3. Number of Connected Components - O(E * α(V))
function countComponents(n, edges) {
  const uf = new UnionFind(n);
  
  for (let [u, v] of edges) {
    uf.union(u, v);
  }
  
  return uf.components;
}

// 4. Graph Valid Tree - O(E * α(V))
function validTree(n, edges) {
  if (edges.length !== n - 1) return false;  // Tree has n-1 edges
  
  const uf = new UnionFind(n);
  
  for (let [u, v] of edges) {
    if (!uf.union(u, v)) {
      return false;  // Cycle detected
    }
  }
  
  return uf.components === 1;
}

// 5. Accounts Merge (Union-Find) - O(n * k * α(n))
function accountsMerge(accounts) {
  const emailToName = new Map();
  const emailToId = new Map();
  let id = 0;
  
  // Assign IDs to emails
  for (let account of accounts) {
    const name = account[0];
    for (let i = 1; i < account.length; i++) {
      const email = account[i];
      if (!emailToId.has(email)) {
        emailToId.set(email, id++);
        emailToName.set(email, name);
      }
    }
  }
  
  const uf = new UnionFind(id);
  
  // Union emails in same account
  for (let account of accounts) {
    const firstEmailId = emailToId.get(account[1]);
    for (let i = 2; i < account.length; i++) {
      uf.union(firstEmailId, emailToId.get(account[i]));
    }
  }
  
  // Group emails by root
  const components = new Map();
  for (let [email, id] of emailToId) {
    const root = uf.find(id);
    if (!components.has(root)) {
      components.set(root, []);
    }
    components.get(root).push(email);
  }
  
  // Format result
  const result = [];
  for (let emails of components.values()) {
    emails.sort();
    result.push([emailToName.get(emails[0]), ...emails]);
  }
  
  return result;
}

// 6. Network Delay Time (Dijkstra) - O((V + E) log V)
function networkDelayTime(times, n, k) {
  const graph = new Map();
  
  // Build adjacency list
  for (let [u, v, w] of times) {
    if (!graph.has(u)) graph.set(u, []);
    graph.get(u).push([v, w]);
  }
  
  const distances = new Array(n + 1).fill(Infinity);
  distances[k] = 0;
  
  const pq = [[0, k]];  // [distance, node]
  
  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [dist, node] = pq.shift();
    
    if (dist > distances[node]) continue;
    
    if (!graph.has(node)) continue;
    
    for (let [neighbor, weight] of graph.get(node)) {
      const newDist = dist + weight;
      
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        pq.push([newDist, neighbor]);
      }
    }
  }
  
  let maxDist = 0;
  for (let i = 1; i <= n; i++) {
    if (distances[i] === Infinity) return -1;
    maxDist = Math.max(maxDist, distances[i]);
  }
  
  return maxDist;
}
```

####  Key Points:
- "**Topological sort** - Kahn's (BFS) or DFS with stack"
- "**Union-Find** - path compression + union by rank = O(α(n))"
- "**Dijkstra** - priority queue, non-negative weights only"
- "**Bellman-Ford** - handles negative weights, detects negative cycles"

---

### **Q20: Dynamic Programming Patterns**
**Difficulty**:  Senior | **Frequency**: 

####  Explanation:
"DP patterns: 1D (Fibonacci-like), 2D (grid/strings), knapsack (0/1, unbounded), intervals, state machines."

####  Common Problems:
```javascript
// 1. House Robber - O(n)
function rob(nums) {
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];
  
  let prev2 = 0;
  let prev1 = nums[0];
  
  for (let i = 1; i < nums.length; i++) {
    const current = Math.max(prev1, prev2 + nums[i]);
    prev2 = prev1;
    prev1 = current;
  }
  
  return prev1;
}

// 2. Longest Common Subsequence - O(m * n)
function longestCommonSubsequence(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = 1 + dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  return dp[m][n];
}

// 3. Unique Paths - O(m * n)
function uniquePaths(m, n) {
  const dp = Array.from({ length: m }, () => new Array(n).fill(1));
  
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    }
  }
  
  return dp[m - 1][n - 1];
}

// 4. Word Break - O(n²)
function wordBreak(s, wordDict) {
  const wordSet = new Set(wordDict);
  const dp = new Array(s.length + 1).fill(false);
  dp[0] = true;
  
  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && wordSet.has(s.substring(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }
  
  return dp[s.length];
}

// 5. Palindromic Substrings - O(n²)
function countSubstrings(s) {
  let count = 0;
  
  function expandAroundCenter(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      count++;
      left--;
      right++;
    }
  }
  
  for (let i = 0; i < s.length; i++) {
    expandAroundCenter(i, i);      // Odd length
    expandAroundCenter(i, i + 1);  // Even length
  }
  
  return count;
}

// 6. Decode Ways - O(n)
function numDecodings(s) {
  if (s[0] === '0') return 0;
  
  const n = s.length;
  let prev2 = 1;  // dp[i-2]
  let prev1 = 1;  // dp[i-1]
  
  for (let i = 1; i < n; i++) {
    let current = 0;
    
    // Single digit
    if (s[i] !== '0') {
      current += prev1;
    }
    
    // Two digits
    const twoDigit = parseInt(s.substring(i - 1, i + 1));
    if (twoDigit >= 10 && twoDigit <= 26) {
      current += prev2;
    }
    
    prev2 = prev1;
    prev1 = current;
  }
  
  return prev1;
}

// 7. Maximum Product Subarray - O(n)
function maxProduct(nums) {
  let maxProd = nums[0];
  let currMax = nums[0];
  let currMin = nums[0];
  
  for (let i = 1; i < nums.length; i++) {
    const num = nums[i];
    
    // Negative number swaps max and min
    if (num < 0) {
      [currMax, currMin] = [currMin, currMax];
    }
    
    currMax = Math.max(num, currMax * num);
    currMin = Math.min(num, currMin * num);
    
    maxProd = Math.max(maxProd, currMax);
  }
  
  return maxProd;
}

// 8. Partition Equal Subset Sum (0/1 Knapsack) - O(n * sum)
function canPartition(nums) {
  const sum = nums.reduce((a, b) => a + b);
  
  if (sum % 2 !== 0) return false;
  
  const target = sum / 2;
  const dp = new Array(target + 1).fill(false);
  dp[0] = true;
  
  for (let num of nums) {
    for (let j = target; j >= num; j--) {
      dp[j] = dp[j] || dp[j - num];
    }
  }
  
  return dp[target];
}
```

####  Key Points:
- "**1D DP** - iterate with prev1, prev2 (space optimized)"
- "**2D DP** - grid problems, string matching (LCS, edit distance)"
- "**Knapsack** - 0/1 (each item once), unbounded (unlimited items)"
- "**State definition** - what does dp[i] represent?"

---


##  REAL-WORLD SCENARIOS (Q21-25)
### System Design Meets Algorithms

---

### **Q21: Design LRU Cache**
**Difficulty**:  Senior | **Frequency**: 

####  Full Implementation:
```javascript
// O(1) for both get and put operations
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();  // Key -> Node
    this.head = { key: 0, value: 0, prev: null, next: null };  // Dummy head
    this.tail = { key: 0, value: 0, prev: null, next: null };  // Dummy tail
    
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }
  
  get(key) {
    if (!this.cache.has(key)) return -1;
    
    const node = this.cache.get(key);
    this.moveToFront(node);
    return node.value;
  }
  
  put(key, value) {
    if (this.cache.has(key)) {
      const node = this.cache.get(key);
      node.value = value;
      this.moveToFront(node);
    } else {
      const newNode = { key, value, prev: null, next: null };
      this.cache.set(key, newNode);
      this.addToFront(newNode);
      
      if (this.cache.size > this.capacity) {
        const lru = this.tail.prev;
        this.removeNode(lru);
        this.cache.delete(lru.key);
      }
    }
  }
  
  moveToFront(node) {
    this.removeNode(node);
    this.addToFront(node);
  }
  
  addToFront(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }
  
  removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }
}

// Usage
const cache = new LRUCache(2);
cache.put(1, 1);
cache.put(2, 2);
console.log(cache.get(1));  // 1
cache.put(3, 3);  // Evicts key 2
console.log(cache.get(2));  // -1 (not found)
```

####  System Design Considerations:
- "**Hash Map + Doubly Linked List** for O(1) operations"
- "**Eviction policy** - remove LRU when capacity exceeded"
- "**Thread safety** - needs locks in production (Java synchronized, Python threading)"
- "**Distributed cache** - Redis implements LRU, handle network partitions"

---

### **Q22: Design Rate Limiter**
**Difficulty**:  Senior | **Frequency**: 

####  Implementation (Sliding Window Log):
```javascript
class RateLimiter {
  constructor(maxRequests, windowSeconds) {
    this.maxRequests = maxRequests;
    this.windowMs = windowSeconds * 1000;
    this.requests = new Map();  // userId -> timestamps array
  }
  
  isAllowed(userId) {
    const now = Date.now();
    
    if (!this.requests.has(userId)) {
      this.requests.set(userId, []);
    }
    
    const userRequests = this.requests.get(userId);
    
    // Remove old requests outside window
    while (userRequests.length > 0 && userRequests[0] <= now - this.windowMs) {
      userRequests.shift();
    }
    
    if (userRequests.length < this.maxRequests) {
      userRequests.push(now);
      return true;
    }
    
    return false;
  }
}

// Token Bucket Algorithm (more efficient)
class TokenBucket {
  constructor(capacity, refillRate) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillRate = refillRate;  // Tokens per second
    this.lastRefill = Date.now();
  }
  
  consume(tokens = 1) {
    this.refill();
    
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }
    
    return false;
  }
  
  refill() {
    const now = Date.now();
    const timePassed = (now - this.lastRefill) / 1000;
    const tokensToAdd = timePassed * this.refillRate;
    
    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }
}

// Usage
const limiter = new RateLimiter(5, 60);  // 5 requests per 60 seconds
console.log(limiter.isAllowed('user1'));  // true
console.log(limiter.isAllowed('user1'));  // true
```

####  Algorithms Compared:
| Algorithm | Pros | Cons | Complexity |
|-----------|------|------|------------|
| **Fixed Window** | Simple, memory-efficient | Burst at window edges | O(1) |
| **Sliding Window Log** | Accurate, no burst | High memory (stores all timestamps) | O(n) |
| **Sliding Window Counter** | Balanced accuracy & memory | Approximate | O(1) |
| **Token Bucket** | Smooth traffic, handles bursts | Complex implementation | O(1) |
| **Leaky Bucket** | Smooths traffic | Drops requests in burst | O(1) |

---

### **Q23: Design Autocomplete System (Trie)**
**Difficulty**:  Senior | **Frequency**: 

####  Implementation:
```javascript
class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
    this.frequency = 0;
    this.sentence = null;
  }
}

class AutocompleteSystem {
  constructor(sentences, times) {
    this.root = new TrieNode();
    this.currentNode = this.root;
    this.currentSentence = '';
    
    // Build trie
    for (let i = 0; i < sentences.length; i++) {
      this.insert(sentences[i], times[i]);
    }
  }
  
  insert(sentence, frequency) {
    let node = this.root;
    
    for (let char of sentence) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char);
    }
    
    node.isEndOfWord = true;
    node.frequency += frequency;
    node.sentence = sentence;
  }
  
  input(c) {
    if (c === '#') {
      // End of input - save sentence
      this.insert(this.currentSentence, 1);
      this.currentSentence = '';
      this.currentNode = this.root;
      return [];
    }
    
    this.currentSentence += c;
    
    if (!this.currentNode.children.has(c)) {
      this.currentNode = null;
      return [];
    }
    
    this.currentNode = this.currentNode.children.get(c);
    return this.getTopSuggestions();
  }
  
  getTopSuggestions() {
    const suggestions = [];
    
    // DFS to collect all sentences with current prefix
    function dfs(node) {
      if (node.isEndOfWord) {
        suggestions.push([node.sentence, node.frequency]);
      }
      
      for (let child of node.children.values()) {
        dfs(child);
      }
    }
    
    dfs(this.currentNode);
    
    // Sort by frequency (desc), then lexicographically
    suggestions.sort((a, b) => {
      if (a[1] !== b[1]) return b[1] - a[1];
      return a[0].localeCompare(b[0]);
    });
    
    return suggestions.slice(0, 3).map(item => item[0]);
  }
}

// Usage
const system = new AutocompleteSystem(
  ['i love you', 'island', 'iroman', 'i love leetcode'],
  [5, 3, 2, 2]
);

console.log(system.input('i'));  // ['i love you', 'island', 'i love leetcode']
console.log(system.input(' '));  // ['i love you', 'i love leetcode']
console.log(system.input('a'));  // []
console.log(system.input('#'));  // [] (saves 'i a')
```

####  Optimization Strategies:
- "**Prefix compression** - merge single-child nodes to save space"
- "**Top-k caching** - store top suggestions at each node (space vs time)"
- "**Inverted index** - for full-text search with ranking"
- "**Distributed** - shard by prefix for horizontal scaling"

---

### **Q24: Design URL Shortener (Hashing)**
**Difficulty**:  Mid-Level | **Frequency**: 

####  Implementation:
```javascript
class URLShortener {
  constructor() {
    this.longToShort = new Map();
    this.shortToLong = new Map();
    this.baseUrl = 'http://short.url/';
    this.counter = 1;
    this.chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  }
  
  // Encode long URL to short URL
  encode(longUrl) {
    if (this.longToShort.has(longUrl)) {
      return this.baseUrl + this.longToShort.get(longUrl);
    }
    
    const shortCode = this.encodeBase62(this.counter);
    this.counter++;
    
    this.longToShort.set(longUrl, shortCode);
    this.shortToLong.set(shortCode, longUrl);
    
    return this.baseUrl + shortCode;
  }
  
  // Decode short URL to long URL
  decode(shortUrl) {
    const shortCode = shortUrl.replace(this.baseUrl, '');
    return this.shortToLong.get(shortCode) || '';
  }
  
  // Base62 encoding
  encodeBase62(num) {
    if (num === 0) return this.chars[0];
    
    let result = '';
    while (num > 0) {
      result = this.chars[num % 62] + result;
      num = Math.floor(num / 62);
    }
    return result;
  }
  
  // Base62 decoding
  decodeBase62(str) {
    let num = 0;
    for (let char of str) {
      num = num * 62 + this.chars.indexOf(char);
    }
    return num;
  }
}

// MD5/Hash-based approach (collision handling needed)
const crypto = require('crypto');

class HashBasedShortener {
  constructor() {
    this.shortToLong = new Map();
  }
  
  encode(longUrl) {
    // Generate MD5 hash
    const hash = crypto.createHash('md5').update(longUrl).digest('hex');
    
    // Take first 7 characters
    const shortCode = hash.substring(0, 7);
    
    // Handle collisions (simple linear probing)
    let finalCode = shortCode;
    let counter = 0;
    
    while (this.shortToLong.has(finalCode) && this.shortToLong.get(finalCode) !== longUrl) {
      finalCode = hash.substring(0, 6) + counter.toString(36);
      counter++;
    }
    
    this.shortToLong.set(finalCode, longUrl);
    return 'http://short.url/' + finalCode;
  }
  
  decode(shortUrl) {
    const shortCode = shortUrl.split('/').pop();
    return this.shortToLong.get(shortCode) || '';
  }
}
```

####  System Design Aspects:
| Approach | Pros | Cons | Use Case |
|----------|------|------|----------|
| **Counter + Base62** | No collisions, predictable length | Sequential, can be guessed | High throughput |
| **MD5/Hash** | Deterministic (same URL = same short) | Collisions possible | Deduplication |
| **Random** | Unpredictable, distributed-friendly | Collision checks needed | Security |
| **ZooKeeper** | Distributed ID generation | Single point of failure | Large scale |

**Scale considerations**:
- "**62^7 = 3.5 trillion** URLs with 7-character shorts"
- "**Database sharding** by hash(shortCode) for reads"
- "**Cache** (Redis) for hot URLs - 80/20 rule"
- "**Analytics** - track clicks asynchronously (Kafka/queues)"

---

### **Q25: Design Twitter News Feed (Timeline)**
**Difficulty**:  Senior | **Frequency**: 

####  Implementation:
```javascript
class Twitter {
  constructor() {
    this.tweets = [];  // [userId, tweetId, timestamp]
    this.following = new Map();  // userId -> Set of followeeIds
    this.tweetId = 0;
  }
  
  postTweet(userId, tweet) {
    this.tweets.push({
      userId,
      tweetId: this.tweetId++,
      tweet,
      timestamp: Date.now()
    });
  }
  
  // Get 10 most recent tweets from user and their followees
  getNewsFeed(userId) {
    const relevantTweets = [];
    
    // Get tweets from user and followees
    const followees = this.following.get(userId) || new Set();
    
    for (let tweet of this.tweets) {
      if (tweet.userId === userId || followees.has(tweet.userId)) {
        relevantTweets.push(tweet);
      }
    }
    
    // Sort by timestamp descending
    relevantTweets.sort((a, b) => b.timestamp - a.timestamp);
    
    return relevantTweets.slice(0, 10).map(t => t.tweetId);
  }
  
  follow(followerId, followeeId) {
    if (!this.following.has(followerId)) {
      this.following.set(followerId, new Set());
    }
    this.following.get(followerId).add(followeeId);
  }
  
  unfollow(followerId, followeeId) {
    if (this.following.has(followerId)) {
      this.following.get(followerId).delete(followeeId);
    }
  }
}

// Optimized with Max Heap (K-way merge)
class OptimizedTwitter {
  constructor() {
    this.userTweets = new Map();  // userId -> array of tweets (newest first)
    this.following = new Map();
    this.tweetId = 0;
  }
  
  postTweet(userId, tweet) {
    if (!this.userTweets.has(userId)) {
      this.userTweets.set(userId, []);
    }
    
    this.userTweets.get(userId).unshift({
      tweetId: this.tweetId++,
      tweet,
      timestamp: Date.now()
    });
  }
  
  getNewsFeed(userId) {
    // K-way merge: merge sorted tweet lists from user + followees
    const users = [userId];
    if (this.following.has(userId)) {
      users.push(...this.following.get(userId));
    }
    
    // Heap approach: get first tweet from each user
    const heap = [];
    
    for (let user of users) {
      const tweets = this.userTweets.get(user) || [];
      if (tweets.length > 0) {
        heap.push({
          tweet: tweets[0],
          userId: user,
          index: 0,
          tweets: tweets
        });
      }
    }
    
    const result = [];
    
    // Extract top 10
    while (result.length < 10 && heap.length > 0) {
      heap.sort((a, b) => b.tweet.timestamp - a.tweet.timestamp);
      const top = heap.shift();
      
      result.push(top.tweet.tweetId);
      
      // Add next tweet from same user
      if (top.index + 1 < top.tweets.length) {
        heap.push({
          tweet: top.tweets[top.index + 1],
          userId: top.userId,
          index: top.index + 1,
          tweets: top.tweets
        });
      }
    }
    
    return result;
  }
  
  follow(followerId, followeeId) {
    if (!this.following.has(followerId)) {
      this.following.set(followerId, new Set());
    }
    this.following.get(followerId).add(followeeId);
  }
  
  unfollow(followerId, followeeId) {
    if (this.following.has(followerId)) {
      this.following.get(followerId).delete(followeeId);
    }
  }
}
```

####  Production Systems:
**Fan-out approaches**:
- "**Fan-out on write** (Push model) - precompute feeds when tweet posted"
  - Pros: Fast read (O(1)), good for few followers
  - Cons: Slow write for celebrities (millions of writes)
  
- "**Fan-out on read** (Pull model) - compute feed on request"
  - Pros: Fast write (O(1)), saves storage
  - Cons: Slow read (merge K sorted lists)
  
- "**Hybrid** - fan-out for normal users, pull for celebrities"

**Database schema**:
```sql
-- Tweets table (partitioned by timestamp)
CREATE TABLE tweets (
  tweet_id BIGINT PRIMARY KEY,
  user_id BIGINT,
  content TEXT,
  created_at TIMESTAMP,
  INDEX idx_user_time (user_id, created_at DESC)
);

-- Feed cache (Redis sorted set by timestamp)
ZADD user:123:feed tweet_id timestamp
```

---

##  ADVANCED & TRICKY (Q26-30)

### **Q26: Backtracking Pattern**
**Difficulty**: �� Senior | **Frequency**: 

####  Common Problems:
```javascript
// 1. Generate Parentheses - O(4ⁿ/√n) Catalan number
function generateParenthesis(n) {
  const result = [];
  
  function backtrack(current, open, close) {
    if (current.length === 2 * n) {
      result.push(current);
      return;
    }
    
    if (open < n) {
      backtrack(current + '(', open + 1, close);
    }
    
    if (close < open) {
      backtrack(current + ')', open, close + 1);
    }
  }
  
  backtrack('', 0, 0);
  return result;
}

// 2. N-Queens - O(n!)
function solveNQueens(n) {
  const result = [];
  const board = Array.from({ length: n }, () => '.'.repeat(n));
  const cols = new Set();
  const diag1 = new Set();  // row - col
  const diag2 = new Set();  // row + col
  
  function backtrack(row) {
    if (row === n) {
      result.push([...board]);
      return;
    }
    
    for (let col = 0; col < n; col++) {
      if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) {
        continue;
      }
      
      // Place queen
      board[row] = board[row].substring(0, col) + 'Q' + board[row].substring(col + 1);
      cols.add(col);
      diag1.add(row - col);
      diag2.add(row + col);
      
      backtrack(row + 1);
      
      // Remove queen (backtrack)
      board[row] = board[row].substring(0, col) + '.' + board[row].substring(col + 1);
      cols.delete(col);
      diag1.delete(row - col);
      diag2.delete(row + col);
    }
  }
  
  backtrack(0);
  return result;
}

// 3. Sudoku Solver - O(9^m) where m is empty cells
function solveSudoku(board) {
  function isValid(row, col, num) {
    // Check row
    for (let j = 0; j < 9; j++) {
      if (board[row][j] === num) return false;
    }
    
    // Check column
    for (let i = 0; i < 9; i++) {
      if (board[i][col] === num) return false;
    }
    
    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[boxRow + i][boxCol + j] === num) return false;
      }
    }
    
    return true;
  }
  
  function solve() {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] === '.') {
          for (let num = '1'; num <= '9'; num++) {
            if (isValid(i, j, num)) {
              board[i][j] = num;
              
              if (solve()) return true;
              
              board[i][j] = '.';  // Backtrack
            }
          }
          return false;
        }
      }
    }
    return true;
  }
  
  solve();
}
```

---

### **Q27: Bit Manipulation Tricks**
**Difficulty**:  Senior | **Frequency**: 

####  Essential Operations:
```javascript
// Bit manipulation basics
const getBit = (num, i) => (num & (1 << i)) !== 0;
const setBit = (num, i) => num | (1 << i);
const clearBit = (num, i) => num & ~(1 << i);
const updateBit = (num, i, value) => {
  const mask = ~(1 << i);
  return (num & mask) | (value << i);
};

// 1. Single Number (XOR trick) - O(n)
function singleNumber(nums) {
  let result = 0;
  for (let num of nums) {
    result ^= num;  // a ^ a = 0, a ^ 0 = a
  }
  return result;
}

// 2. Count Set Bits - O(k) where k is number of 1s
function hammingWeight(n) {
  let count = 0;
  while (n !== 0) {
    n &= (n - 1);  // Remove rightmost 1
    count++;
  }
  return count;
}

// 3. Power of Two
function isPowerOfTwo(n) {
  return n > 0 && (n & (n - 1)) === 0;
}

// 4. Reverse Bits
function reverseBits(n) {
  let result = 0;
  for (let i = 0; i < 32; i++) {
    result = (result << 1) | (n & 1);
    n >>= 1;
  }
  return result >>> 0;  // Unsigned
}

// 5. Missing Number (XOR)
function missingNumber(nums) {
  let xor = nums.length;
  for (let i = 0; i < nums.length; i++) {
    xor ^= i ^ nums[i];
  }
  return xor;
}
```

---

### **Q28: String Algorithms**
**Difficulty**:  Senior | **Frequency**: 

####  Advanced Patterns:
```javascript
// 1. KMP Pattern Matching - O(n + m)
function kmpSearch(text, pattern) {
  const lps = computeLPS(pattern);
  const matches = [];
  let i = 0, j = 0;
  
  while (i < text.length) {
    if (text[i] === pattern[j]) {
      i++;
      j++;
    }
    
    if (j === pattern.length) {
      matches.push(i - j);
      j = lps[j - 1];
    } else if (i < text.length && text[i] !== pattern[j]) {
      if (j !== 0) {
        j = lps[j - 1];
      } else {
        i++;
      }
    }
  }
  
  return matches;
}

function computeLPS(pattern) {
  const lps = new Array(pattern.length).fill(0);
  let len = 0;
  let i = 1;
  
  while (i < pattern.length) {
    if (pattern[i] === pattern[len]) {
      len++;
      lps[i] = len;
      i++;
    } else {
      if (len !== 0) {
        len = lps[len - 1];
      } else {
        lps[i] = 0;
        i++;
      }
    }
  }
  
  return lps;
}

// 2. Rabin-Karp (Rolling Hash) - O(n + m) average
function rabinKarp(text, pattern) {
  const d = 256;  // Number of characters
  const q = 101;  // Prime number
  const m = pattern.length;
  const n = text.length;
  let h = 1;
  
  // h = d^(m-1) % q
  for (let i = 0; i < m - 1; i++) {
    h = (h * d) % q;
  }
  
  let patternHash = 0;
  let textHash = 0;
  
  // Calculate initial hashes
  for (let i = 0; i < m; i++) {
    patternHash = (d * patternHash + pattern.charCodeAt(i)) % q;
    textHash = (d * textHash + text.charCodeAt(i)) % q;
  }
  
  const matches = [];
  
  // Slide pattern
  for (let i = 0; i <= n - m; i++) {
    if (patternHash === textHash) {
      // Double check
      if (text.substring(i, i + m) === pattern) {
        matches.push(i);
      }
    }
    
    if (i < n - m) {
      textHash = (d * (textHash - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % q;
      
      if (textHash < 0) {
        textHash += q;
      }
    }
  }
  
  return matches;
}

// 3. Manacher's Algorithm (Longest Palindromic Substring) - O(n)
function longestPalindrome(s) {
  // Transform string: "abc" -> "#a#b#c#"
  const t = '#' + s.split('').join('#') + '#';
  const n = t.length;
  const p = new Array(n).fill(0);
  
  let center = 0, right = 0;
  let maxLen = 0, centerIndex = 0;
  
  for (let i = 0; i < n; i++) {
    const mirror = 2 * center - i;
    
    if (i < right) {
      p[i] = Math.min(right - i, p[mirror]);
    }
    
    // Expand around i
    while (i + p[i] + 1 < n && i - p[i] - 1 >= 0 && 
           t[i + p[i] + 1] === t[i - p[i] - 1]) {
      p[i]++;
    }
    
    // Update center and right
    if (i + p[i] > right) {
      center = i;
      right = i + p[i];
    }
    
    // Track max
    if (p[i] > maxLen) {
      maxLen = p[i];
      centerIndex = i;
    }
  }
  
  const start = (centerIndex - maxLen) / 2;
  return s.substring(start, start + maxLen);
}
```

---

### **Q29: Advanced Tree Structures**
**Difficulty**:  Senior | **Frequency**: 

####  Segment Tree & Fenwick Tree:
```javascript
// Segment Tree (Range Query + Update)
class SegmentTree {
  constructor(arr) {
    this.n = arr.length;
    this.tree = new Array(4 * this.n);
    this.build(arr, 0, 0, this.n - 1);
  }
  
  build(arr, node, start, end) {
    if (start === end) {
      this.tree[node] = arr[start];
      return;
    }
    
    const mid = Math.floor((start + end) / 2);
    const leftChild = 2 * node + 1;
    const rightChild = 2 * node + 2;
    
    this.build(arr, leftChild, start, mid);
    this.build(arr, rightChild, mid + 1, end);
    
    this.tree[node] = this.tree[leftChild] + this.tree[rightChild];
  }
  
  query(L, R, node = 0, start = 0, end = this.n - 1) {
    if (R < start || L > end) return 0;
    if (L <= start && end <= R) return this.tree[node];
    
    const mid = Math.floor((start + end) / 2);
    const leftChild = 2 * node + 1;
    const rightChild = 2 * node + 2;
    
    return this.query(L, R, leftChild, start, mid) + 
           this.query(L, R, rightChild, mid + 1, end);
  }
  
  update(index, value, node = 0, start = 0, end = this.n - 1) {
    if (start === end) {
      this.tree[node] = value;
      return;
    }
    
    const mid = Math.floor((start + end) / 2);
    const leftChild = 2 * node + 1;
    const rightChild = 2 * node + 2;
    
    if (index <= mid) {
      this.update(index, value, leftChild, start, mid);
    } else {
      this.update(index, value, rightChild, mid + 1, end);
    }
    
    this.tree[node] = this.tree[leftChild] + this.tree[rightChild];
  }
}

// Fenwick Tree (Binary Indexed Tree) - O(log n) updates
class FenwickTree {
  constructor(n) {
    this.tree = new Array(n + 1).fill(0);
  }
  
  update(index, delta) {
    while (index < this.tree.length) {
      this.tree[index] += delta;
      index += index & (-index);  // Add last set bit
    }
  }
  
  query(index) {
    let sum = 0;
    while (index > 0) {
      sum += this.tree[index];
      index -= index & (-index);  // Remove last set bit
    }
    return sum;
  }
  
  rangeQuery(left, right) {
    return this.query(right) - this.query(left - 1);
  }
}
```

---

### **Q30: Matrix Algorithms**
**Difficulty**:  Senior | **Frequency**: 

####  Advanced Matrix Problems:
```javascript
// 1. Rotate Matrix 90° Clockwise - O(n²) in-place
function rotate(matrix) {
  const n = matrix.length;
  
  // Transpose
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }
  
  // Reverse each row
  for (let i = 0; i < n; i++) {
    matrix[i].reverse();
  }
}

// 2. Spiral Matrix Traversal - O(m*n)
function spiralOrder(matrix) {
  if (matrix.length === 0) return [];
  
  const result = [];
  let top = 0, bottom = matrix.length - 1;
  let left = 0, right = matrix[0].length - 1;
  
  while (top <= bottom && left <= right) {
    // Top row
    for (let j = left; j <= right; j++) {
      result.push(matrix[top][j]);
    }
    top++;
    
    // Right column
    for (let i = top; i <= bottom; i++) {
      result.push(matrix[i][right]);
    }
    right--;
    
    // Bottom row
    if (top <= bottom) {
      for (let j = right; j >= left; j--) {
        result.push(matrix[bottom][j]);
      }
      bottom--;
    }
    
    // Left column
    if (left <= right) {
      for (let i = bottom; i >= top; i--) {
        result.push(matrix[i][left]);
      }
      left++;
    }
  }
  
  return result;
}

// 3. Set Matrix Zeroes - O(m*n) time, O(1) space
function setZeroes(matrix) {
  const m = matrix.length;
  const n = matrix[0].length;
  let firstRowZero = false;
  let firstColZero = false;
  
  // Check if first row/col should be zero
  for (let j = 0; j < n; j++) {
    if (matrix[0][j] === 0) firstRowZero = true;
  }
  
  for (let i = 0; i < m; i++) {
    if (matrix[i][0] === 0) firstColZero = true;
  }
  
  // Use first row/col as markers
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (matrix[i][j] === 0) {
        matrix[i][0] = 0;
        matrix[0][j] = 0;
      }
    }
  }
  
  // Set zeros based on markers
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (matrix[i][0] === 0 || matrix[0][j] === 0) {
        matrix[i][j] = 0;
      }
    }
  }
  
  // Handle first row/col
  if (firstRowZero) {
    for (let j = 0; j < n; j++) matrix[0][j] = 0;
  }
  
  if (firstColZero) {
    for (let i = 0; i < m; i++) matrix[i][0] = 0;
  }
}
```

---

##  BEHAVIORAL QUESTIONS (Q31-35)
### Problem-Solving & Communication

---

### **Q31: Describe a challenging algorithm problem you solved**

####  STAR Format Answer:
**Situation**: "In production, our recommendation engine was timing out for users with 10,000+ items. The naive O(n²) similarity calculation couldn't scale."

**Task**: "I needed to reduce time complexity while maintaining recommendation quality - target was sub-100ms response time."

**Action**: 
- "Profiled code and identified nested loop in collaborative filtering as bottleneck"
- "Implemented **locality-sensitive hashing (LSH)** to reduce candidate set from O(n²) to O(n)"
- "Added **approximate nearest neighbors** using KD-trees for top-k similar items"
- "Benchmarked against naive approach - maintained 95% accuracy with 50x speedup"

**Result**: "Reduced latency from 8 seconds to 120ms. Handled 10x user base growth without infrastructure changes. Learned importance of algorithm choice for production systems."

####  Key Points to Emphasize:
- "**Complexity analysis** - understood problem was algorithmic, not hardware"
- "**Trade-offs** - approximate vs exact, space vs time"
- "**Measurement** - profiled before optimizing, benchmarked after"
- "**Business impact** - connected technical solution to user experience"

---

### **Q32: How do you approach an unfamiliar algorithm problem?**

####  STAR Format Answer:
**UMPIRE Framework**:

1. **Understand** - "Clarify inputs, outputs, constraints, edge cases"
   - Example: "Is array sorted? Can values be negative? What's size limit?"

2. **Match** - "Pattern recognition - does this fit known patterns?"
   - "Sorted array → Binary search"
   - "All substrings → Sliding window"
   - "Path problems → BFS/DFS"

3. **Plan** - "Outline approach before coding"
   - "Brute force first - O(n²) nested loop"
   - "Optimize - use hash map to get O(n)"
   - "Edge cases - empty input, single element, duplicates"

4. **Implement** - "Write clean code with clear variable names"

5. **Review** - "Walk through example, check edge cases"

6. **Evaluate** - "Time O(n), Space O(n), can we optimize space?"

####  Example in Action:
**Problem**: "Find pair of numbers that sum to target"

- **Understand**: Sorted? Duplicates? Multiple pairs?
- **Match**: Two pointers (if sorted) or Hash map (if unsorted)
- **Plan**: Hash map stores complements, O(n) single pass
- **Implement**: 
  ```javascript
  function twoSum(nums, target) {
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
      const complement = target - nums[i];
      if (seen.has(complement)) {
        return [seen.get(complement), i];
      }
      seen.set(nums[i], i);
    }
    return [];
  }
  ```
- **Review**: Test [2,7,11,15], target=9 → [0,1] 
- **Evaluate**: O(n) time, O(n) space - optimal for unsorted

---

### **Q33: Explain a time you optimized code performance**

####  STAR Format Answer:
**Situation**: "Dashboard loading large datasets (100k rows) was taking 5+ seconds, causing user complaints."

**Task**: "Reduce load time to under 1 second without changing backend API."

**Action**:
- "**Profiled**: Chrome DevTools showed 80% time in Array.sort() and Array.filter() chains"
- "**Analyzed**: Multiple passes over same data - O(n) repeated 5 times"
- "**Optimized**:
  - Combined filters into single pass: `O(5n) → O(n)`
  - Replaced Array.sort() with optimized quicksort for our use case
  - Added **memoization** for expensive calculations (user permissions)
  - Implemented **virtual scrolling** - render only visible rows"
- "**Measured**: Lighthouse scores improved from 45 to 92"

**Result**: "Load time reduced from 5.2s to 0.7s (86% improvement). Monthly active users increased 15% as users stopped dropping off."

####  Optimization Principles:
- "**Measure first** - don't guess, profile"
- "**Low-hanging fruit** - O(n²) → O(n) gives more gains than micro-optimizations"
- "**Caching** - time vs space trade-off, works when reads >> writes"
- "**Lazy evaluation** - don't compute what you won't use"

---

### **Q34: How do you handle disagreements about technical approaches?**

####  STAR Format Answer:
**Situation**: "Team debated using recursive vs iterative tree traversal for critical data pipeline. I advocated recursion for readability, senior engineer preferred iteration for performance."

**Task**: "Resolve disagreement objectively to ship feature on time."

**Action**:
- "**Data-driven decision**: Wrote both implementations, benchmarked with production-size data"
- "**Results**: Recursion was 40ms, iteration was 35ms (12% faster) but required 3x more code"
- "**Trade-off analysis**:
  | Aspect | Recursive | Iterative |
  |--------|-----------|-----------|
  | Speed | 40ms | 35ms |
  | Code lines | 15 | 45 |
  | Maintainability | High | Medium |
  | Stack overflow risk | Yes (deep trees) | No |"
- "**Compromise**: Used recursion with **tail call optimization** and stack depth limit"

**Result**: "Combined best of both - clean code with safeguards. Learned to benchmark assumptions rather than debate opinions."

#### �� Key Principles:
- "**Benchmark, don't guess** - opinions → data"
- "**Context matters** - no universal 'best' algorithm"
- "**Find middle ground** - hybrid approaches often optimal"
- "**Document decision** - write ADR (Architecture Decision Record)"

---

### **Q35: Describe debugging a complex algorithm issue**

####  STAR Format Answer:
**Situation**: "Production bug - Dijkstra's shortest path algorithm returned incorrect paths 2% of time. No clear pattern, intermittent failures."

**Task**: "Find root cause and fix without service downtime."

**Action**:
1. "**Reproduced locally**: Captured production data, created failing test case"
2. "**Binary search debugging**: Added assertions at each step to narrow down"
3. "**Visualized**: Drew graph on paper, traced algorithm by hand"
4. "**Found bug**: Priority queue comparison was using **floating-point distances**"
   - Issue: `0.1 + 0.2 !== 0.3` in JavaScript
   - Intermittent because depended on path order
5. "**Fixed**: Multiplied distances by 10^6, used integers for comparisons"
6. "**Validated**: Ran 10,000 random graphs, added property-based tests"

**Result**: "100% pass rate after fix. Added **fuzzing tests** to catch similar issues. Learned to be careful with float comparisons in critical algorithms."

####  Debugging Strategies:
- "**Reproduce reliably** - can't fix what you can't reproduce"
- "**Simplify input** - minimize test case to essential elements"
- "**Visualize** - draw data structures, trace algorithm steps"
- "**Rubber duck** - explain problem out loud, often reveals issue"
- "**Add invariants** - assertions catch bugs at source, not symptoms"

---

##  QUICK FIRE ROUND (Q36-45)

### **Q36: What's the difference between BFS and DFS?**
"BFS uses queue (FIFO), explores level by level, finds shortest path in unweighted graphs. DFS uses stack/recursion (LIFO), explores deep first, better for path existence and topological sort."

### **Q37: When to use HashMap vs TreeMap?**
"HashMap - O(1) average, unordered, allows null key. TreeMap - O(log n), sorted order, range queries. Use HashMap for simple lookups, TreeMap when you need sorted iteration or ceiling/floor operations."

### **Q38: Explain time complexity of QuickSort**
"Average O(n log n) with random pivot - divides array in half log n times, each partition is O(n). Worst O(n²) if already sorted and pick first/last as pivot. Best case also O(n log n). Space O(log n) for recursion stack."

### **Q39: What is Dynamic Programming?**
"DP breaks problems into overlapping subproblems, caches results to avoid recomputation. Two approaches: **memoization** (top-down, recursive with cache) and **tabulation** (bottom-up, iterative with table). Works when problem has optimal substructure."

### **Q40: How does Union-Find work?**
"Disjoint set data structure. **Find** traces parent pointers to root, uses **path compression** (flatten tree during find). **Union** connects roots, uses **rank** (tree height) to keep trees balanced. Both operations nearly O(1) amortized - specifically O(α(n)) where α is inverse Ackermann."

### **Q41: Explain how hashing works**
"Hash function maps key to array index. **Good hash**: uniform distribution, deterministic, fast to compute. **Collision resolution**: chaining (linked list at each bucket) or open addressing (probe for next empty slot). Load factor α = n/m affects performance - keep under 0.75."

### **Q42: What's the difference between stack and heap memory?**
"Stack - LIFO, stores local variables, function calls, fixed size, automatic management, very fast (CPU cache friendly). Heap - dynamic allocation, manually managed (or GC), slower access, fragmentation possible. Stack overflow from deep recursion, heap exhaustion from memory leaks."

### **Q43: Explain binary search requirements**
"Requires **sorted** data (ascending/descending order). Works by repeatedly dividing search space in half. O(log n) time. Fails on unsorted data - can return wrong answer or miss target. Sorting takes O(n log n), so only beneficial if searching multiple times."

### **Q44: What are greedy algorithms?**
"Makes locally optimal choice at each step, hoping for global optimum. **Works** when problem has greedy choice property and optimal substructure (e.g., Dijkstra, Huffman coding, activity selection). **Fails** when local optimum ≠ global (e.g., coin change with arbitrary denominations needs DP)."

### **Q45: Explain Big O vs Big Omega vs Big Theta**
"**Big O** - upper bound (worst case), f(n) ≤ cg(n). **Big Omega** - lower bound (best case), f(n) ≥ cg(n). **Big Theta** - tight bound (average), both upper and lower. Example: Binary search is O(log n) worst case, Ω(1) best case (found immediately), Θ(log n) average."

---

##  INTERVIEW SUCCESS TIPS

### **Pattern Recognition (Most Important!)**

| Pattern | When to Use | Example Problems | Time Complexity |
|---------|-------------|------------------|-----------------|
| **Two Pointers** | Sorted arrays, palindromes, pairs | Two Sum II, 3Sum, Container With Most Water | O(n) |
| **Sliding Window** | Subarray/substring, contiguous elements | Longest Substring, Max Sum Subarray | O(n) |
| **Fast & Slow Pointers** | Cycle detection, middle element | Linked List Cycle, Happy Number | O(n) |
| **Merge Intervals** | Overlapping ranges, scheduling | Meeting Rooms, Insert Interval | O(n log n) |
| **Binary Search** | Sorted data, "guess and validate" | Search Insert Position, Capacity to Ship | O(log n) |
| **Tree BFS** | Level-order, shortest path in tree | Right Side View, Zigzag Traversal | O(n) |
| **Tree DFS** | Path problems, subtree validation | Path Sum, Validate BST, Serialize Tree | O(n) |
| **Topological Sort** | DAG ordering, dependencies | Course Schedule, Build Order | O(V + E) |
| **Union-Find** | Connected components, cycles | Number of Islands, Account Merge | O(α(n)) |
| **Dynamic Programming** | Overlapping subproblems, optimization | Coin Change, Knapsack, LIS | O(n²) typical |

### **Problem-Solving Framework**

```
1. UNDERSTAND (5 min)
    Clarify inputs, outputs, constraints
    Ask about edge cases: empty, single element, duplicates
    Confirm examples
   
2. MATCH (2 min)
    Recognize pattern from list above
    Similar problems solved before?
   
3. PLAN (5 min)
    Explain brute force first - shows you can solve it
    Discuss optimization - shows you can think critically
    Mention time/space complexity
   
4. IMPLEMENT (20 min)
    Write clean, modular code
    Use meaningful variable names
    Handle edge cases
   
5. TEST (5 min)
    Walk through example
    Test edge cases
    Dry run complex sections
   
6. OPTIMIZE (5 min)
    Can we use less space?
    Can we avoid repeated work?
```

### **Company-Specific Focus**

**FAANG/Big Tech**:
- Heavy on graphs, trees, DP
- Often ask "design" + "implement" combo (LRU Cache, Rate Limiter)
- Expect O(optimal) solution
- System design rounds for senior roles

**Startups**:
- More practical problems (parsing, text processing)
- Speed matters - can you ship fast?
- Often real problems from their codebase
- Less emphasis on obscure algorithms

**Finance/Trading**:
- Optimization problems (DP, greedy)
- Probability questions
- Time complexity critical (latency sensitive)
- Often C++ or Java required

### **Common Mistakes to Avoid**

 **Jumping into code immediately** - always clarify and plan first
 **Not communicating** - interviewers want to hear your thought process
 **Ignoring edge cases** - empty arrays, single elements, negatives
 **Not testing code** - walk through examples before saying "done"
 **Memorizing solutions** - understand patterns, not specific problems
 **Silent debugging** - explain what you're looking for
 **Giving up** - ask for hints, show problem-solving even if stuck

### **The Day Before**

- Review: Arrays, Strings, Hash Maps, Trees, Graphs basics
- Do 2-3 easy problems to warm up
- **Sleep well** - tired brain performs 50% worse
- Prepare questions to ask interviewer
- Set up clean interview environment (for remote)

### **During the Interview**

 **Think out loud** - "I'm considering using a hash map because..."
 **Start simple** - brute force shows you can solve it
 **Ask questions** - "Can I assume input is valid?"
 **Iterate** - brute force → optimize → optimal
 **Handle hints gracefully** - they want you to succeed!
 **Manage time** - if stuck >5 min, ask for hint
 **Stay positive** - don't apologize, keep forward momentum

---

##  ESSENTIAL RESOURCES

### **Practice Platforms**
1. **LeetCode** - 75 Study Plan (best coverage)
   - Easy: 30 problems → Junior level
   - Medium: 120 problems → Mid level
   - Hard: 30 problems → Senior level
   
2. **HackerRank** - Algorithm domain
3. **CodeSignal** - Company assessments
4. **AlgoExpert** - Video explanations
5. **Pramp** - Mock interviews (free)

### **Books**
- "Cracking the Coding Interview" - McDowell (Bible of interviews)
- "Elements of Programming Interviews" - Aziz, Lee, Prakash
- "Introduction to Algorithms" - CLRS (theory deep dive)
- "Grokking Algorithms" - Bhargava (visual explanations)

### **Video Courses**
- NeetCode (YouTube) - Problem patterns
- Back to Back SWE - Detailed explanations
- William Fiset - Data structures
- Abdul Bari - Algorithms (theory)

### **Study Plan (8 Weeks)**

**Week 1-2: Arrays & Strings**
- Two pointers, sliding window
- 20 Easy + 10 Medium problems

**Week 3-4: Linked Lists, Stacks, Queues, Trees**
- Fast/slow pointers, tree traversals
- 15 Easy + 15 Medium problems

**Week 5-6: Graphs, Recursion, DP**
- BFS, DFS, memoization/tabulation
- 10 Easy + 20 Medium + 5 Hard problems

**Week 7: Advanced (Heaps, Tries, Union-Find)**
- Top K elements, string algorithms
- 5 Medium + 10 Hard problems

**Week 8: Mock Interviews & Review**
- 2-3 full mock interviews (45 min each)
- Review mistakes, solidify patterns

---

##  FINAL CHECKLIST

### **Must Know Data Structures**
-  Arrays / Dynamic Arrays
-  Hash Maps / Hash Sets
-  Linked Lists (singly, doubly)
-  Stacks / Queues
-  Binary Trees / BST
-  Heaps (Priority Queue)
-  Graphs (Adjacency List/Matrix)
-  Trie (for string problems)
-  Union-Find (Disjoint Set)
-  Segment Tree / Fenwick Tree (advanced)

### **Must Know Algorithms**
-  Binary Search + variants
-  Tree Traversals (DFS: inorder, preorder, postorder; BFS)
-  Graph Traversals (DFS, BFS)
-  Sorting (Merge, Quick, Heap Sort)
-  Dynamic Programming (1D, 2D patterns)
-  Topological Sort
-  Dijkstra's Algorithm
-  Union-Find operations
-  Backtracking template

### **Must Know Patterns** (Top 14)
1. Two Pointers
2. Sliding Window
3. Fast & Slow Pointers
4. Merge Intervals
5. Cyclic Sort
6. In-place Linked List Reversal
7. Tree BFS
8. Tree DFS
9. Two Heaps (Median maintenance)
10. Subsets / Permutations (Backtracking)
11. Modified Binary Search
12. Top K Elements
13. K-way Merge
14. Dynamic Programming

### **Complexity Analysis Checklist**
- Can explain time complexity of your solution
- Can explain space complexity (including recursion stack)
- Know common complexities: O(1), O(log n), O(n), O(n log n), O(n²)
- Can identify when optimization is needed

### **Behavioral Prep**
- 3-5 STAR stories prepared
- Include: challenging bug, optimization, teamwork conflict, failed project
- Practice explaining technical concepts to non-technical audience

---

##  YOU'RE READY!

Remember:
- **Interviews test problem-solving, not memorization**
- **Communication > perfect solution** - explain your thinking
- **Patterns > individual problems** - learn the why, not just the what
- **Practice consistently** - 2-3 problems daily > 20 once a week
- **Mock interviews** - simulate pressure before real thing

**Core Philosophy**: "I may not know every algorithm, but I can recognize patterns, break down problems, and communicate my approach clearly."

Good luck! You've got this! 

---

*Last Updated: 2024*
*Based on interviews at Google, Facebook, Amazon, Microsoft, and 50+ tech companies*

