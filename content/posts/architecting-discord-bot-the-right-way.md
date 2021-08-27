+++
categories = ["microservices", "guide", "architecture"]
date = 2021-08-26T18:30:00Z
description = "Architecting discord bot the right way: In this post I want to talk about something which I did not give much thought at the time when I started working on gmbot in 2019."
keywords = ["design", "system", "scaling", "guide", "ultimate", "bots", "discord", "architecture", "microservices"]
tags = ["system design", "bots", "discord"]
title = "Architecting discord bot the right way"

+++
## Past: Gmbot

If you might not know, I have made a discord bot [Gmbot - Multiplayer Game bot for Discord (itsnikhil.github.io)](https://itsnikhil.github.io/gmbot-site/). The way how this bot used to function was very simple, there was a trigger phrase `gmbot` followed by command name `createwar` and some parameters

```bash
gmbot createwar -players @Player1 @Player2 -game 4 -duration 12 -type ft3
```

I have already written a detailed post showcasing it's various features, database schema, etc. which you can read at [Gmbot - Chatbot for gamers (itsnikhil.codes)](https://www.itsnikhil.codes/projects/gmbot/). I made that bot in python as `discord.py` API wrapper library was written in python and I was comfortable working in that language. Like everyone, I followed whatever tutorials, documentation, etc. were available online. But today in this post I want to talk about something which I did not give much thought at the time when I started working on gmbot in 2019.

### Everything was very monolithic

What I meant with monolithic is that all the functionality existed in a single codebase, everything I wanted to do had to be done in python. Even though the project was well structured into classes, easy to read/understand code and a common pattern was followed for creating each command but it was not testable, not scalable and not flexible. All the business logic was mixed within the command handler.

```py
import discord
import DAO

class Status_Command(commands.Cog):
    def __init__(self, client):
        self.client = client

    @commands.command(aliases=['wars'])
    async def status(self, ctx, *args): # status command handler
        # validate command
        # call DAO to get data from database
        # business logic
        # call success/error
        if message:
            await self.success_message(ctx, message)
        else:
            await self.error_message(ctx, "ERROR")

    async def success_message(self, ctx, error):
        # format and send success message

    async def error_message(self, ctx, reason=None):
        # format and send error message

def setup(client):
	client.add_cog(Status_Command(client))
```

## Can we do better? Micro-services

By micro-services I do not mean having different bots handling different features of the bot. **I want you to think and treat discord bot server as simply a frontend-client like a mobile app and instead of mixing business logic into it, have a separate backend server communicating via RESTful APIs.**

![Architecting discord bot the right way](/img/discord-bot-arch.jpg)

```bash
gmbot createwar -players @Player1 @Player2 -game 4 -duration 12 -type ft3
```

With this architecture commands like above will be passed to chatbot `frontend-client` which can then make a POST request to to backend with the params in the body and client key in headers indicating this is a record from discord.

```bash
curl --location --request POST 'localhost:8080/createwar' \
--header 'client: DISCORD-BFF' \
--header 'x-api-key: **************' \
--header 'Content-Type: application/json' \
--data-raw '{
    "server": {
        "id": "S1",
        "name": "Server1 Name"
    },
    "players": [
        {
            "id": "P1",
            "name": "Player1 Name",
            "role": "member"
        },
        {
            "id": "P2",
            "name": "Player2 Name",
            "role": "co-leader"
        }
    ],
    "game": "Mini Miltitia",
    "duration": "12h",
    "format": "first-to-3-wins"
}'
```

This API would return JSON response and status code based on which `frontend-client` can craft a discord formatted response or slack formatted response

```py
embed = discord.Embed(
	title="WAR REQUEST ACCEPTED",
	url="https://itsnikhil.github.io/gmbot-site/commands/",
	description="Your clanwar request has been accepted...",
	color=0xffff00
)
embed.set_author(
	name="GMBOT",
	url="https://itsnikhil.github.io/gmbot-site/commands/",
	icon_url=self.client.user.avatar_url
)
for key, value in response["data"]:
    embed.add_field(
    	name=key,
    	value=value,
    	inline=False
    )
embed.set_footer(text="Clanwar accepted!")

# Inform host that clanwar request has been accepted
await info_channel.send(embed=embed)
```

## Advantages

* [Much easier to test the features](#much-easier-to-test-the-features)
* [Easy and quick growth/expandability](#easy-and-quick-growth/expandability)
* [Backend servers can be horizontally scaled](#backend-servers-can-be-horizontally-scaled)
* [Flexibility to experiment and optimize](#flexibility-to-experiment-and-optimize)
* [Freedom to try out new technology](#freedom-to-try-out-new-technology)
* [Separate deployments](#\[separate-deployments)
* [Leaner teams and increased productivity](#leaner-teams-and-increased-productivity)

![discord-bot-arch-scale](/img/discord-bot-arch-scale-1.jpg)

### Much easier to test the features

We have been developing backend services for many years now and have developed complex observability tools which can even tell which API request took how much time for a particular database query in real-time. Of course we have proper tooling to test and automate backend servers with proper CI/CD process. Without separate backend there is no good way to test discord/slack bots besides testing manually. If you would search for testing in discord.py official docs [Search (discordpy.readthedocs.io)](https://discordpy.readthedocs.io/en/stable/search.html?q=testing) you will be out of luck.

### Easy and quick growth/expandability

If you create a chatbot for discord, you have to accept the fact that you are limiting your audience group to that matching discord's. Sketch design tool restricted itself to only support MacOS while Figma was web based open-to-all because of which Figma easily captured the market however good Sketch was in it's comparison. Let's say you developed an attendance bot and you want to support both slack and teams, backend can still be shared while clients can vary since core business logic is same across bots/ webapp. This is something I regret not doing for gmbot, when gmbot failed, I could not pivot my idea into a mobile app easily. Having this opportunity is very important for a lean startup which can require pivoting business into different direction any day.

### Backend servers can be horizontally scaled

Let's say your chatbot got famous, everyone is talking about it, your product is in the headlines everywhere <3. There will be a flood of new users trying to use your service. According to some random folks on internet, 1 server can handle \~2500 active discord groups load. This can obviously vary based on your server resources and what actions your bot perform. Fortunately, `discord.js` bot support `sharding` [Getting started | Discord.js Guide (discordjs.guide)](https://discordjs.guide/sharding/#when-to-shard) but I would argue, it is much better to scale backend horizontally by running multiple instances of server behind application load balancers, using in-memory caches, etc. these are webservers in the end, you don't have to depend on discord to provide a way to scale.

### Flexibility to experiment and optimize

Adding/Removing features becomes much easier, you can setup multiple environments like production and development allowing you to safely work on experimental features without affecting actual customers or their data. You can also work on optimizations behind the scenes without touching the `frontend-client`

### Freedom to try out new technology

Freedom to use different technologies without getting locked to any single programming language. Business logic can be written in golang with it's high performance benefits from compiled binary and goroutines while still using discord's JavaScript library in frontend-client to communicate with discord. If something better comes along, you have the ability to try it out. You can have different parts of the service handled by different microservices.

### Separate deployments

Each microservice has separate codebase which can be updated independently of other services. Microservices plays really well with continuous integration and continuous delivery by providing ability to have different deployment pipelines.

### Leaner teams and increased productivity

Micro-service codebases are smaller in size and thus much faster to build, test and release. One do not depend on other to make a release after which you can release yours. We can have people work on domains/areas where they have expertise. Not being forced to collaborate with everyone let's developers focus on their tasks and increase productivity.