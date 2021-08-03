+++
categories = ["golang", "programming"]
date = 2021-08-03T11:30:00Z
description = ""
keywords = ["tutorial", "advanced", "programming", "rate limit", "speed", "performance", "concurrency", "goroutine", "go", "golang"]
tags = ["performance", "goroutine", "concurrency"]
title = "Understanding concurrency in go"

+++
> Concurrency is about dealing with lots of things at once. Parallelism is about doing lots of things at once - Rob Pike

Go language itself provides some features to handle concurrency out of the box, hiding all the complexities so that developers write better, faster, more efficient code. These features include :-

**Goroutines**: A _goroutine_ is a lightweight thread managed by the Go runtime.

Just add `go` in front of your function call to convert it into goroutine and you can take advantage of concurrency.

```go
func main() {
	go say("hello") // concurrently executes func say
}

// you might also see the following pattern
func main() {
	go func(greeting string){ // concurrently executes anonymous func and 
    	say(greeting) // call our function inside it
    }("hello")
}
```

**Channels**: Channels are a typed conduit through which you can send and receive values with the channel operator, `<-`.

```go
ch := make(chan int) // unbuffered channel
ch := make(chan int, 30) // buffered channel
ch := make(<-chan int) // Receive only channel
ch := make(chan<- int) // Send only channel

ch <- 1 // sends value to channel
x = <-ch // assign value from channel to x

close(ch) // close channel and clean memory
```

**WaitGroups**: A WaitGroup waits for a collection of goroutines to finish.

```go
var wg sync.WaitGroup
        
func main() {
	wg.Add(1) // Add to set the number of goroutines to wait for
	go func(asyncFuncParam string) {
    	// each of the goroutines runs and calls Done when finished
		defer wg.Done() // executed after functions returns
		asyncFunc(asyncFuncParam)
	}("USING WAIT GROUP")
    wg.Wait() // block until all goroutines have finished
}
```

## Concurrency in go

If you are not taking advantage of goroutines then ask yourself why not? I mean why don't you want your code to go faaassstttt? While there are a lot of cases where sequential execution of code is important, here we really cannot do anything but there are some situations where we could take advantage of concurrency but uncontrolled concurrency is harmful. For example: Making multiple concurrent API requests might get you in trouble of getting rate limited HTTP 429 - Too Many Requests. Luck you, even in such cases we can take advantage of language features like channels and use it's properties to limit concurrency.

In this post, I have shared 2 different ways of handling concurrency

### Uncontrolled concurrency

This will queue as many goroutines to execute in concurrent mode as your system can handle. **Use this** **when your program has many autonomous pieces independent of each other (non-atomic)**

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

The will create a bounded queue and limit goroutines  according to a set limit per seconds while execute in concurrent mode following bucketing/ short bursts pattern. **Use this** **when your program has many autonomous pieces independent of each other (non-atomic) but you are rate limited due to some bottleneck.**

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

## Benchmarks

200+ API requests

|Mode|Time of Execution|Outcome|
|-|-|-|
|Synchronous|~1 min 20 sec|All API succeeded|
|Uncontrolled concurrency|~5 sec|Many API failed with error|
|Controlled concurrency|~10 sec|All API succeeded|

No doubt uncontrolled concurrency will be the fastest to complete the job but in the end it failed to get all the response successfully. With controlled concurrency, I can manually tweak performance and find right balance between rate limits and execution time.

### Learning resources

* Concurrency section of A Tour of Go - One of the best official resource [_https://tour.golang.org/concurrency/1_](https://tour.golang.org/concurrency/1 "https://tour.golang.org/concurrency/1")
* If you want know internal workings of goroutines, i would highly recommend you read the following article [_https://medium.com/the-polyglot-programmer/what-are-goroutines-and-how-do-they-actually-work-f2a734f6f991_](https://medium.com/the-polyglot-programmer/what-are-goroutines-and-how-do-they-actually-work-f2a734f6f991 "https://medium.com/the-polyglot-programmer/what-are-goroutines-and-how-do-they-actually-work-f2a734f6f991")