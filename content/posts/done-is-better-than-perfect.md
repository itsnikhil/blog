+++
categories = ["software engineering", "motivation"]
date = 2021-12-17T18:30:00Z
description = "Every new codebase I used to touch, I could find some place where something can be improved by using a different data structure, or an algorithm, or some design pattern avoiding nested if-else, or simply abstracting big functions into smaller ones. But as when I started working on big features I came to realize this famous saying of Done is better than perfect"
keywords = ["experience", "startup", "engineering", "development", "software", "agile", "motivation", "programming"]
tags = ["startup experience", "agile"]
title = "Done is better than perfect"

+++
## Introduction

"Done is better than perfect" is a lesson that I learned from working in a fast-paced competitive startup environment.. and agile software development in general.

Every new codebase I used to touch, I could find some place where something can be improved by using a different data structure, or an algorithm, or some design pattern avoiding nested if-else, or simply abstracting big functions into smaller ones. But as when I started working on big features I came to realize this famous saying.

In this article, I would like to share some of my thoughts on this ideology and hopefully give you some motivation to release your next amazing startup or project you are working on and not get yourself stuck in catch-22.

## Perfection

> the state or quality of being perfect

In software development world - When you’ve developed a working product, it’s normal to take pride in its performance you’ve worked hard on it. It’s normal to want to hold off on release until it’s got _this_ feature, or _that’s_ been tweaked, or it’s gone through yet another round of testing.

_Source:_ [_The ‘done is better than perfect’ approach to programming - Parker Software_](https://www.parkersoftware.com/blog/the-done-is-better-than-perfect-approach-to-programming/)

## Chasing perfection

If somebody asks me if the system I have developed is perfect or not? I would say comeback after couple of years and ask the same question as I cannot answer it today. Gone are the days where software was sold via floppy disk/DVDs, now software's are getting more personalized and unique to each and every customer. System once perfect needs to evolve with new requirements which one would have never anticipated while designing/developing it.

Over-engineering is often identified with design changes that increase a factor of safety, add functionality, or overcome perceived design flaws that most users would accept. It can be desirable when safety or performance is critical (e.g. in aerospace vehicles and luxury road vehicles), or when extremely broad functionality is required (e.g. diagnostic and medical tools, power users of products).

As a design philosophy, it is the opposite of the minimalist ethos of "less is more" (or: “worse is better”) and a disobedience of the KISS principle. _- Wikipedia_

### Example

Let's say you are a student and as an assignment your teacher asks you to submit a research report on sustainable future or solar energy before next week. If you submit your assignment after the deadline, your marks will get affected even though how in-depth you went into research analyzing sun's orientation, affect of weather, calculating perfect tilt angle, finding how much power output one solar panel can generate, finding return on investment... doing justice to the topic.

Even if your teacher was generous and because of your amazing report gave you full marks. This is not always the case, imagine if this was a question part of your final exam and if you spend all the time answering it so well, you will not get enough time to answer other questions.

Some might argue in the above example a short-crisp, to the point answer would have been perfect. In reality it takes a lot of good efforts, right knowledge and experience, to setup a great foundation and even then you have to adapt to changes and keep on enhancing the product.

Maybe this example is not perfect, so are the projects we work on. There are memes around project requirement not being clear enough. Not everyone is building a medical device where margin of error is a difference of life and death where you have to consider using special tools like [ROS](https://www.ros.org/ "ROS") to control system clock and scheduler. Not every requirement is like [The Thames Barrier must never fail. Here's why it doesn't. - YouTube](https://www.youtube.com/watch?v=eY-XHAoVEeU)

## Finding the balance

### Understand the requirements

Let's say you are working on a feature that will be very important for winter vacation season sale - Chrisman and New Year. Then this is a strict requirement which you have to follow. Christmas is always on 25th of dec. and if your feature is not ready by then business can get affected. That being said not all requirements are strict and it is important to understand them well to avoid doing unnecessary work. Writing good readable code, following coding standards (linters) and writing testcases should be part of requirements of a good tech team and should be caught in code reviews.

Once I was almost about to write a wrapper library on top of RestAPIs of one of our web service. Was it part of the project requirements? - No! Were estimates taken in account for writing the library? - No!

### Know your customer

Your customer is the consumer of the features you build. You should be aware of the impact it can have on them not just positively but repercussion if anything goes wrong. This provides sense of responsibility you have, skipping on testcases and not doing non-functional requirements testing reduces your confidence so it is advised to given them attention. Trust me, it makes you happy seeing your customers are happy.

Will customer's care about the technology used? - No/maybe! Will customers have a bad experience if they are not able to login? - Definitely!

### What are your expertise

One cannot have knowledge of everything. You should know your boundaries and capabilities. Technology evolves rapidly and it's very hard to keep up-to date with everything. This not only restricted to knowledge of a particular programming-language/framework.

If you are asked to make changes in a totally new codebase, You are no longer an expert and it's your responsibility to get enough context/knowledge from the right person to do full justice to the requirements and communicate this thing clearly to your manager.

### Engineering process is a loop

![Is the following diagrams correct for RAD and Agile ...](https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.stack.imgur.com%2FKdKKT.png&f=1&nofb=1)

We(Software engineers) have luxury to ship the Minimal Viable Product (MVP) and constantly evolve it incrementally. We do not need to know the final state of the project in the beginning. We should be able to collect necessary feedback and act upon data what works and what does not. This also applies to issues, gives us ability to accept stop gaps while actual fix gets released in next sprint.

_Good read:_ [_Scaling with common sense - Zerodha Tech Blog_](https://zerodha.tech/blog/scaling-with-common-sense/)