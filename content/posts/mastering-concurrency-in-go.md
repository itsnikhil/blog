+++
categories = ["golang", "programming"]
date = 2021-08-01T18:30:00Z
description = ""
draft = true
keywords = ["tutorial", "advanced", "programming", "rate limit", "speed", "performance", "concurrency", "goroutine", "go", "golang"]
tags = ["performance", "goroutine", "concurrency", "rate limit", "golang"]
title = "Understanding concurrency in go"

+++
> Concurrency is about dealing with lots of things at once. Parallelism is about doing lots of things at once - Rob Pike

Go language itself provides some features to handle concurrency out of the box, hiding all the complexities so that developers write better, faster, more efficient code. These features include :-

* **Gouroutines**: A _goroutine_ is a lightweight thread managed by the Go runtime.

  Just add `go` in front of your function call to convert it into goroutine and you can take advantage of concurrency.
* **Channels**: Channels are a typed conduit through which you can send and receive values with the channel operator, `<-`.
* **WaitGroups**: A WaitGroup waits for a collection of goroutines to finish. The main goroutine calls Add to set the number of goroutines to wait for. Then each of the goroutines runs and calls Done when finished. At the same time, Wait can be used to block until all goroutines have finished.

If you are not taking advantage of goroutines then ask yourself why not? I mean why wouldn't you are anyone person do not want their code to go faaassstttt? There are some cases where uncontrolled concurrency is harmful. For. example: Making multiple concurrent API requests might get you in trouble of getting rate limited HTTP 429 - Too Many Requests. Luck you, even in such cases we can take advantage of language features channel and use it's properties to limit concurrency.

### Uncontrolled concurrency

```go
var wg sync.WaitGroup
    
for _, item := range items {
	wg.Add(1)
	go func(asyncFuncParam string) {
		defer wg.Done()
		asyncFunc(asyncFuncParam)
	}("USING WAIT GROUP")
}
wg.Wait()
```

### Controlled concurrency

```go
const (
	CONCURRENCY_LIMIT = 30 // max 30 items in a channel per second 
)
    
guard := make(chan struct{}, CONCURRENCY_LIMIT)
    
for _, item := range items {
	guard <- struct{}{}
	go func(asyncFuncParam string) {
		defer func() { <-guard }()
		asyncFunc(asyncFuncParam)
	}("USING CHANNELS FOR CONTROLLED CONCURRENCY")
}
```

### Learning resources:

* Concurrency section of A Tour of Go - One of the best official resource [_https://tour.golang.org/concurrency/1_](https://tour.golang.org/concurrency/1 "https://tour.golang.org/concurrency/1")
* If you want know internal workings of goroutines, i would highly recommend you read the following article [_https://medium.com/the-polyglot-programmer/what-are-goroutines-and-how-do-they-actually-work-f2a734f6f991_](https://medium.com/the-polyglot-programmer/what-are-goroutines-and-how-do-they-actually-work-f2a734f6f991 "https://medium.com/the-polyglot-programmer/what-are-goroutines-and-how-do-they-actually-work-f2a734f6f991")