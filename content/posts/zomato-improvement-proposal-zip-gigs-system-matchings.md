+++
categories = ["algorithm", "proposal", "zomato"]
date = 2022-04-30T18:30:00Z
description = "Zomato Improvement Proposal (ZIP): Gigs system matchings - Many to many stable matching algorithm using the deferred-acceptance."
draft = true
keywords = ["gigs", "matching", "engineering", "zip", "zomato", "proposal", "algorithm"]
tags = ["engineering", "matching", "Gigs", "ZIP", "Zomato Improvement Proposal"]
title = "Zomato Improvement Proposal (ZIP): Gigs system matchings"

+++
```
ZIP: 1
Title: ZIP Many to many stable matching algorithm using the deferred-acceptance.
Author: Nikhil Taneja itsnikhil@duck.com
Status: Proposal
Type: Process
Created: 2022-01-05
```

## Zomato's Gig System
Zomato's gig system is an economic system for delivery partners of the company. In Gigs system, Delivery partners book "gigs" which are their preferred timeslots of work. For completion of every gig, a delivery partner has to complete a few minimum login hours criteria. Delivery partners can browse available gigs a couple days in advance. Information like timings and estimated earnings for each available gig can be accessed from the app. As per the convienence of the delivery partners, they can choose to book as many gigs as they like and start delivering food. A small cancellation fee is charged from a delivery partner everytime they cancel a gig. This is done to avoid abusing the system and so that other delivery partners get their fair chance to book gigs. Delivery partners get fixed order payouts for every order + distance payout for every kilometer of drop both of which can vary across various locations.

### As per the company, benefits of Gigs system include:
- Delivery partners can view etimated payout for a gig before booking based on which they can choose desired gigs
- Higher chances of getting an order
- No rush to meet target to get incentives! More gigs, more earnings
- Payouts as per expectations, everyday

### Medals
In order to ensure good quality of delivery partners is available, Zomato has divided all delivery partners into various different categories denoted by medals. Based on the medal some benifits are given to few high ranking delivery partners including the ability to book gigs few days in advance.

- Blue medal:
	- 1-day early booking
	- Medical insurance
- Bronze medal:
	- 2-day early booking
	- Medical insurance
- Silver medal:
	- 3-day early booking
	- Priority support
	- Medical insurance
- Diamond medal:
	- 4-day early booking
	- Priority support
	- Diamond badge
	- Increased cash limit
	- Medical insurance

Medals for each delivery partner is refreshed after every fixed time interval. In order to improve medal, delivery partner has to meet following requirements in each criteria:

|Medal|Criteria|Requirement|
|-|-|-|
|Blue|Completed orders|0-95%|
||On time orders|0-70%|
||Completed gigs|0-70%|
||Star gigs|0-25%|
|Bronze|Completed orders|95-97%|
||On time orders|70-80%|
||Completed gigs|70-80%|
||Star gigs|25-50%|
|Silver|Completed orders|97-99%|
||On time orders|80-85%|
||Completed gigs|80-90%|
||Star gigs|50-75%|
|Diamond|Completed orders|99-100%|
||On time orders|85-100%|
||Completed gigs|90-100%|
||Star gigs|75-100%|

### Problems with current implementation of the gig system
#### 1. Booking of gigs is a first come first serve process
Everyday at 10:30 AM when gigs booking unlocks for next days, each and every delivery partner has to try to book gig in order to maximize their chances for a gig to be available. Imagine yourself participating in a flash sale everyday. Also, this can cause huge traffic on a system at during that initial booking period.

#### 2. Perferred gig not available
For delivery partners who wanted to work does not get chance because of unavailablity of gig which is more common for blue and bronze delivery partners.

#### 3. Customer feedback do not affect medal
Medal criterias are more aligned how zomato deems as delivery partner to be good than the ratings given by it's customers. Though, I am not aware how much important delivery partner's rating is for a food delivery company than compared to mobility company.

## Imporvement Proposal

### Better matching algorithm
My proposal to Zomato is to implement some version of many to many stable matching algorithm using the deferred-acceptance.

Instead of booking gigs immidiately, delivery partners can share their preferences which is ranked ordered list of how likely are they to work for a certain gig for that day. There will be a deadline before which each delivery partner needs to submit ranked gigs. For example:

- Delivery partner A can book gigs:
1. 10:00AM - 12:00PM
2. 06:00PM - 07:00PM
3. 09:00PM - 11:00PM
4. 02:00PM - 03:00PM
- Delivery partner B can book gigs:
1. 09:00PM - 11:00PM
2. 02:00PM - 03:00PM
3. 06:00PM - 07:00PM

Meanwhile Zomato can rate it's delivery partners based on any criteria. For example:
1. Delivery partner A
2. Delivery partner B

The algorithm starts by respecting first of preference for each and every delivery partner and finding optimal match with Zomato's preference for each delivery partner and performs multiple rounds of iteration for lower preferences. One such algorithm is famously known as [stable marriage problem](https://en.wikipedia.org/wiki/Stable_marriage_problem). It works well enough when there must be only 1 match but in zomato's case, one delivery partner can be assigned to multiple gigs. In order to avoid always selecting same delivery partner again and again for multiple gigs because of higher rating given by zomato, the algorithm needs to reduce the rank of a person after getting a confirmed gig.

![stable marriage problem](https://upload.wikimedia.org/wikipedia/commons/5/52/Gale-Shapley.gif)

`Image CC BY-SA 3.0, https://commons.wikimedia.org/w/index.php?curid=10189057`

### Benefits of this new match making algorithm
- The algorithm is delivery partner proposing
- There is no difference in matchings results if delivery partner ranks gig now or couple of hours later
- Ensures quality of delivery partners remains while still maintaining better matchings
- All delivery partners will atleast get a chance to share their preferences

## Sources:
- https://www.youtube.com/watch?v=y4dEg3LUqAs
- https://www.youtube.com/watch?v=C9m1YwkuY7g
- https://www.youtube.com/watch?v=kvgfgGmemdA