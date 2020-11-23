---
title: Gmbot - Chatbot for gamers
date: 2020-09-09 09:00:00
tags:
    - python
    - discord
categories:
- Miscellaneous
keywords:
    - gmbot
cover: /blog/img/gmbot/gmbot.png
description: A complete clan war system built for gamers in form of a discord chatbot
---

## INTRODUCTION

I used to play Clash of Clans (COC) which had a system of clan wars. Then on April 2016 I quitted from the COC and started playing Doodle Army 2: Mini Militia (DA2) and I played it a lot, so much so that I made friends from Kerala, Rajasthan, Delhi and even outside India. We friends created a group over WhatsApp and named our group Headshot Killers (HSK) and every player in that group had to put HSK after their in-game name (IGN). Similarly, other people created their own groups. Our group used to practice together and challenge other groups.

> In a way, I found that if we had a clan war system like the one in the Clash of Clans for Doodle Army 2: Mini Militia it would have been so nice. We requested appsomniacs developers over their Beta testers google group, they did add a friend system in one of their updates, but it was far from what we requested. Thus, this Gmbot is my gift to the community, a feature what we gamers wanted.

### Overview
![](/blog/img/gmbot/gmbot.png)

Create your clan, challenge others and grow

- After adding chatbot to a discord server, the server acts as a "Clan". All the users in that server acts as clan members or co-leaders or leader. A clan can create or participate in "Clan Wars". Team up with allies and fight other clans! Each win grants you a certain amount of Glory points.
- These clan wars are played in many types of formats depending upon games:
  - 1x1 match
  - 2x2 match
  - 3x3 match
  - 4x4 match

### Key Features

- No need for maintaining spreadsheets for match records
- Simple easy commands with help guide
- Finding similar gaming community
- Leader board of Glory points
- Roles to manage clan
- Statistics of clan

### How it works

1. A clan leader or co-leader creates a war request taking some players who are available and game
2. Other clans who have subscribed to that game will receive challenge request
3. One of the clans accept the challenge
4. Now both clans can communicate and share game details
5. After the war duration gets completed clan war is over
6. Bot will ask for the winner from both the clans
7. And the winning clan gets glory points

### Roles

**Leader** 
- Can promote and demote players.
- Can update clan details.
- Can create/delete/accept clan wars.
- Can subscribe/unsubscribe games
- Can participate in clan wars

**Co-Leader** 
- Can create/delete/accept clan wars.
- Can subscribe/unsubscribe games.
- Can participate in clan wars

**Regular Member** 
- Can participate in clan wars

**Unavailable** 
- Can't do anything

## RESEARCH

### Online Gaming Communities ###

Unlike classical forms of online communities or the newer phenomenon of social network sites, community structures of online gamer communities tend to be diverse, highly complex socio-technological structures centred around the organization, (meta-) communication, exchange (e.g., of virtual items) of game-related issues and events. Memories of staying up late playing Warcraft 3 with friends or sharing creations in The Sims.

### Identifying right Platform

Discord's free voice and text chat is about making it easier for these online gamers create their communities on this platform. Many gamers from all over the world have started their groups with the people they play together, create these memories, and land a headshot or two.

The core idea was to help connect multiple clans playing same game to play against each other. Heavy part of the idea relies on creating a clan like experience where clan members can collaborate, practice and share memories via text and voice chat. Developing my own system providing such experience with limited knowledge, resources and time is quite a challenge. Also, making gamers who have their groups on discord switch to my own such platform would have placed me against Discord. So, it was ideal to leverage 87 million potential registered uses of discord which tends to overlap with our target users via chatbot for discord.

## CONCEPT/ SOLUTION

**Step 1 - Installation**

Most people having their discord group will start by adding the chatbot to their server (group) by clicking "Add to Server" button on visiting the static landing website of Gmbot. This website will also act as a command directory.

After clicking add to server, user will be taken to discord's official website where that user will need to give necessary permissions to bot and Authorize. After that server will start acting as a Clan and chatbot will start responding to querries.

| | |
|-|-|
|![](/blog/img/gmbot/Picture2.png)|![](/blog/img/gmbot/Picture3.png)|

**Step 2 – Subscribe game(s)**

![](/blog/img/gmbot/Picture4.png)

**Step 3 – Create war request**

![](/blog/img/gmbot/Picture5.png)

**Step 4 – Accept Incoming war**

![](/blog/img/gmbot/Picture6.png)

**Step 5 – Communicate**

![](/blog/img/gmbot/Picture8.png)

**Step 6 – Ask for results**

![](/blog/img/gmbot/Picture9.png)

## DIAGRAMS
### Flow diagram

![](/blog/img/gmbot/Picture10.png)

### Tree diagram
```bash
│ Gmbot
├─── COGS (Separate python file for each command all inside this folder)
│ ├─── command1.py
│ └─── command2.py
├─── DAO (SQL Queries related to each command)
│ ├─── command1Query.py
│ └─── command2Query.py
├─── guide (images/ resources)
│ └─── ERDiagram.png
├─── database.py (Singleton class, Database related functions will be present here)
├─── database.sql (SQL script to create all database tables)
├─── discord.log (Log dump)
├─── helper.py (Command parser and checker)
└─── main.py (Root main file which executes first and loads all the commands)
```

## DEVELOPMENT PROCESS

### Code Structure

All the SOLID design principles have been taken in mind for structuring the code.

The code has been structed so beautifully that extending the project is super simple, all command follows similar structure.

- Create class command\_name\_Command implementing discord.commands.Cog
- Create 3 methods:

1. Name same as command\_name with @commands.command() as a decorator.

This method calls methods from Query

Based upon query response, it calls success response or error response

1. Success message response
2. Error message response

- Setup method to add that command class

`COGS/status.py`

![](/blog/img/gmbot/Picture11.png)

`DAO/communicateQuery.py`

![](/blog/img/gmbot/Picture12.png)

### List of Commands

|List of Commands                                  |Function                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |Access level                                                   |
|--------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------|
|**setup**|<ul><li>Please enter/edit your clan name [REQUIRED]</li><li>Please enter/edit clan location [OPTIONAL, DEFAULT=International]</li><li>Please enter/edit clan language [OPTIONAL, DEFAULT=English]</li>|Leader only|
|**createWar**|<ul><li>Please tag all the players you want to take part [REQUIRED]</li><li>Please enter game id [REQUIRED]</li><li>Please enter duration in hours after which the war will end [OPTIONAL, DEFAULT=24 hours]</li><li>Please enter type id of clanwar [OPTIONAL, DEFAULT=First to 3 wins]</li>|Leader and Co-Leaders only|
|**privateWar**  (does not broadcast war request)|<ul><li>Please tag all the players you want to take part [REQUIRED]</li><li>Please enter game id [REQUIRED]</li><li>Please enter duration in hours after which the war will end [OPTIONAL, DEFAULT=24 hours]</li><li>Please enter type id of clanwar [OPTIONAL, DEFAULT=First to 3 wins]</li>|Leader and Co-Leaders only|
|**removeWar**|<ul><li>Please enter war id [REQUIRED]</li>|Leader and Co-Leaders only|
|**accept**|<ul><li>Please enter war id [REQUIRED]</li><li>Please tag all the players you want to take part [REQUIRED]</li>|Leader and Co-Leaders only|
|**communicate**|<ul><li>Please enter message you want to convey [REQUIRED]</li><li>Shares messages between 2 parties</li>|Only works for participating players when 2 clans will match-up|
|**subscribe**|<ul><li>Please enter comma separated valid game ids you want to subscribe [REQUIRED]</li><li>Lists all games subscribed by a clan</li>|Leader and Co-Leaders only|
|**unsubscribe**|<ul><li>Please enter comma separated valid game ids you want to unsubscribe [REQUIRED]</li><li>Lists all games subscribed by a clan</li>|Leader and Co-Leaders only|
|**relinquish**|<ul><li>Please tag the player you want to transfer ownership (Leader role) [REQUIRED]</li>|Leader only|
|**promote**|<ul><li>Please tag all the player you want to make Co-leader responsibility [REQUIRED]</li>|Leader only|
|**demote**|<ul><li>Please tag all the player you want to take away Co-leader responsibility [REQUIRED]</li>|Leader only|
|**status**|<ul><li>Lists all ongoing war</li><li>Lists all open war requests</li><li>Checks alls game subscribed</li>|Anyone|
|**games**|<ul><li>Lists all supported games with ID</li>|Anyone|
|**formats**|<ul><li>Lists all available clanwar types</li>|Anyone|
|**mygames**|<ul><li>Lists all games subscribed by a clan</li>|Anyone|
|**roles**|<ul><li>Lists all the players along with their role</li>|Anyone|
|**available**|<ul><li>Mark yourself available to take part in clan war</li>|Anyone|
|**unavailable**|<ul><li>Mark yourself unavailable to take part in clan war</li>|Anyone|

## DATABASE SCHEMA
![](/blog/img/gmbot/Picture13.png)

## ANALYTICS

### Google Analytics
![](/blog/img/gmbot/Picture14.png)
![](/blog/img/gmbot/Picture15.png)

### Play Testing

The setup command was used to provide clan name, language, location and required game ids to subscribe for a game. But most alpha testers ignored to subscribe to games as the command wasn't as descriptive and started creating clan war requests. Which lead to a separate command to subscribe and unsubscribe. Also, Testers did not like long commands name especially communication command which was shortened to "gmbot say".

![Play Test and Feedback](/blog/img/gmbot/Picture1.png)