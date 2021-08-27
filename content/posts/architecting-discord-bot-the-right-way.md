+++
categories = []
date = ""
description = ""
draft = true
keywords = []
tags = []
title = "Architecting discord bot the right way"

+++
## Past: Gmbot

If you might not know, I have made a discord bot [Gmbot - Multiplayer Game bot for Discord (itsnikhil.github.io)](https://itsnikhil.github.io/gmbot-site/). The way how this bot used to function was very simple, there was a trigger phrase `gmbot` followed by command name `createwar` and some parameters

```bash
gmbot createwar -players @Player1 @Player2 -game 4 -duration 12 -type ft3
```

I have already written a detailed post showcasing it's various features, database schema, etc. read more at [Gmbot - Chatbot for gamers (itsnikhil.codes)](https://www.itsnikhil.codes/projects/gmbot/). I made that bot in python as `discord.py` API wrapper library was written in python and I was comfortable working in that language. Like everyone, I followed whatever tutorials, documentation, etc. available online. But today in this post I want to talk about something which I did not give much thought about at the time when I started working on gmbot in 2019.

### Everything was very monolithic

What I meant with this is that all the functionality existed in a single codebase, everything I wanted to do had to be done in python. Even thought the project was well structured into classes, easy to read/understand code and a common pattern was followed for creating each command but it was not testable, not scalable and not flexible. All the business logic was mixed within the command handler.

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

By micro-services I do not mean having different bots handing different features of the bot. **I want you to think and treat discord bot server as a Backend for Frontend(BFF) or simply a frontend-client and instead of mixing business logic into it, have a separate Backend server communicating via RESTful APIs.**

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

This API would return JSON response and status code based on which `frontend-client` can craft a discord formatted message or slack formatted response

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

### Much easier to test the features

We have been developing backend services for many years now and have developed complex observability tools which can even tell which API request took how much time for a particular database query in real-time. Of course we have proper tooling to test and automate backend servers with proper CI/CD process. Without separate backend there is no good way to test discord/slack bots besides testing manually. If you would search for testing in discord.py official docs [Search (discordpy.readthedocs.io)](https://discordpy.readthedocs.io/en/stable/search.html?q=testing) you will be out of luck.

### Easy and quick growth/expandability

If you create a chatbot for discord, you have to accept the fact that you are limiting your audience group to that matching discord's. Sketch design tool restricted itself to only support MacOS and Figma easily captured the market however good Sketch was in it's comparison. Let's say you developed an attendance bot and you want to support both slack and teams, backend can still be shared while clients can vary since core business logic is same across bots/ webapp. This is something I regret not doing for gmbot, when gmbot failed, I could not pivot to my idea into a mobile app easily. Having this opportunity is very important for a lean startup which can require pivoting business into different direction any day.     

### Backend servers can be horizontally scaled

Let's say your chatbot got famous, everyone is talking about it, your product is in the headlines everywhere <3. There will be flood of new users trying to use your service. According to some random folks on internet, 1 server can handle \~2500 active discord groups load. This can obviously vary based on your server resources and what they action your bot perform. Fortunately, `discord.js` bot support `sharding` [Getting started | Discord.js Guide (discordjs.guide)](https://discordjs.guide/sharding/#when-to-shard) but I would argue, it is much better to scale backend separately horizontally but running multiple instances of server behind application load balancers, using in-memory caches, etc. these are webservers in the end, you don't have to depend on discord to provide a way to scale.    

### Flexibility to experiment and optimize

### Freedom to try out new technology

### Separate deployments

### Leaner teams and increased productivity