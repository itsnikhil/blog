---
title: Is pythonic way the better way?
date: 2020-09-09 09:00:00
tags:
    - programming
    - wat
categories:
- python
keywords:
    - python
    - pythonic
    - code
    - style
---

Here I have share some of my thoughts on some of the pythonic way coding style. These are not design patterns (which are best practices used by experienced object-oriented software developers) of any sort, just some ways of writing code differently or I should say more pythonic. 

If you might not already know - Python is an interpreted, interactive, object-oriented programming language. But more importantly, Python is a programming language that lets you work more quickly and integrate your systems more effectively.

If you want to learn all the recommended python style conventions/guidelines, you can learn [here](https://pep8.org/). So with that, let's start with something which you might already know.

## Swapping of values
This is cool way swapping values among two variables. Python does not create any temporary variables. It is all done on the stack.
```py
a, b = b, a
```
This an tuple unpacking not only makes code more readable but also handles the state better.

## List comprehension
Most people working with python at certain point of time discover about list comprehensions which is shorthand syntax of writing for loop. 
Shorter pythonic way using list comprehension.
```py
a = [i**2 for i in range(10)]
```
Awesome right, short and simple. If you use round brackets `()` instead of square brackets `[]` instead of returning a completely new list, it returns a generator object. Generators are in python are super cool which instead of returning a whole array, it yields one value at a time which requires less memory. Any python function with a keyword "yield" may be called as generator. When generator encounters a yield keyword the state of the function is frozen and all the variables are stored in memory until the generator is called again.
```py
>>> a = (i**2 for i in range(10))
>>> print(a)
<generator object <genexpr> at 0x0000025CADCFA518>
>>> print(sum(a))
285
```
This is where the short comings of pythonic ways are prevalent amongst beginners, most beginners often use square brackets even when not required.

## Compound comparison statements
A compound statement consists of one or more 'clauses.' An example for this will be 
```py
>>> x = 5
>>> 10 < x < 20
False
>>> x = 15
>>> 10 < x < 20
True
>>> x = 25
>>> 10 < x < 20
False
>>>
```
A compound comparison is a neat feature in python. In other languages, you would need to express this as two different comparison joined with an `and` operation
```py
>>> x = 15
>>> (10 < x) and (x < 20)
True
```

## Distinguishing multiple exit points in loops
This is sort of like a replacement for flag values. There are two ways you can exit out of the for loop 1) You hit the break; or 2) You did not in that case else block after the for loop will execute.    
```py
>>> def find(seq, target):
... 	for i, value in enumerate(seq):
...     	if value == target:
... 			break
...     else:
...     	return -1
...     return i
... 
>>> find([3,4,5], 5)
1
>>> find([3,4,5], 6)
-1
```
I do not think there is any reason not to use this except the poor naming of else. I have not seen this used in many codebases maybe because it has a very niche use case unlike list comprehension.

## Ternary operator
Blueprint of general syntax
```py
(if_test_is_false, if_test_is_true)[test]
```
Example usage
```py
a = ('Odd', 'Even')[num//2 == 0]
```
This sounds a lot useful and you wonder why you might not have heard of this before or seen something like this in some codebase. Actually, there is a reason behind this, to understand consider this example
```py
>>> (print('isFalse'), print('isTrue'))[True]
isFalse
isTrue
```
As you can see it prints both cases. Because of this not only extra processing is wasted but it can introduce some bugs. Ternary if else cannot be used to handle None values (or null for non-python world).
```py
>>> import re
>>> message = 'Is pythonic way the better way?'
>>> match = re.search(r'python', message)
>>> (match.group(), 'Not found')[match == None]
'python'
>>> match = re.search(r'python3', message)
>>> (match.group(), 'Not found')[match == None]
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
AttributeError: 'NoneType' object has no attribute 'group'
```
We received this error because if re.search fails it returns `None` and we called a `method` on the something which was `None`. This happens because with the tupled ternary technique, the tuple is first built, then an index is found as a result both `True` case along with `False` gets executed.
So use this with a lot of care because the way I see this, it not an if-else replacement!

## Walrus operator available from Python 3.8 (PEP 572) 
Walrus operator can be used to consolidate an assignment statement and a boolean expression when both assignment and expression would utilize a similar statement. 
```py
>>> import re
>>> message = 'Is pythonic way the better way?'
>>> if(match := re.search(r'python', message)):
... 	print(match.group())
... 
python
>>> if(match := re.search(r'python3', message)):
... 	print(match.group()) # No output
...
```
Parentheses are important as without that it would assign result of boolean expression instead of the statement.
```py
>>> my_list = [1,2,3,4,5]
>>> if (n := len(my_list)) > 3:
... 	print(n)
...
5
>>> if n := len(my_list) > 3: # without parenthesis
... print(n)
...
True
```

## Some good reads
- This article has been inspired from a talk from PyCon US 2013 by Raymond Hettinger [go watch it here](https://www.youtube.com/watch?v=OSGv2VnC0go)
- Mind-bending edge cases in python that make you say "Wat‽" [go watch it here](https://www.youtube.com/watch?v=qjk2pWY4RP0)
- There is a fun project attempting to explain what exactly is happening under the hood for some counter-intuitive snippets and lesser-known features in Python which you can [read here](https://github.com/satwikkansal/wtfpython)

## Thank you!
I hope you find this article insightful, please share it with your friends, you can read my other articles at [my blog](https://itsnikhil.github.io/blog)

If I have missed something, please write a comment and I will update my article. 

---