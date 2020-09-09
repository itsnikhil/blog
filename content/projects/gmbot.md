---
title: Gmbot - Chatbot for gamers
date: 2020-09-09 09:00:00
tags:
    - python
    - discord
categories:
- notes
keywords:
    - gmbot
---

<h1 align="center">
  Multiplayer GameBot
</h1>

<h4 align="center">A complete clan war system built for gamers in form of a discord chatbot.</h4>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#how-to-setup">How To Setup</a> •
  <a href="#download">Download</a> •
  <a href="#credits">Credits</a> •
  <a href="#related">Related</a> •
  <a href="#license">License</a>
</p>

![screenshot](https://lh3.googleusercontent.com/PTsJnA-PoSgK4woMAs9XLs56x4U7CT5yKQX_1loKbdXTv-plD7zfa9P-MqS3GQJOf75wS5AYalSxh2gU4DhqWLNVs56jfAoBCKhiKLI1WVjkaaWc9h-js9NGX8IjoWKFaO61CKPByUg=w800)

## Key Features

* Clan Wars - Create your clan, Challenge others and Grow
  - After adding chatbot to your server, your server becomes a Clan. After joining a clan you can create or participate in "Clan Wars". Team up with your allies and fight other clans! Each win grants you a certain amount of Glory points. These clans wars are played in many types of formats:
    * 1x1 match
    * 2x2 match
    * 3x3 match
    * 4x4 match
* Create Tournament or League
  - While clan war is played between 2 clans. Tournaments and Leagues are hosted by someone and can have some prize money.
    * Tournament - Knockout single elemination round in which individual players can participate belonging from different clans
    * League - Robin round in which multiple different clans with multiple members can participate where each clan's player plays one of the other clan's player. After all the rounds, top 4 clans proceeds to Semi finals and then finals  
* No need for maintaining spreadsheets for match records
* Powerful tools to ban cheaters
* No need for creating chits for making brackets
* Simple easy commands with video help guide available
* Leaderboard of Glory points
* Statistics of particular clan

## How To Setup

To clone and run this application, you'll need [Git](https://git-scm.com) and [Python 3.6](https://www.python.org/downloads/release/python-368/) (which comes with [pip](https://pip.pypa.io/en/stable/)) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/itsnikhil/Gmbot

# Go into the repository
$ cd Gmbot

# Install dependencies (I would highly recommend to create a virtual enivronment (https://docs.python.org/3/tutorial/venv.html))
$ pip install -r requirements.txt
```
MySQL Workbench is also required as a database which can be downloaded from [here](https://dev.mysql.com/downloads/workbench/).
Create new connection in MySQL Workbench by giving:
* Connection name
* Hostname
* Username
* Password

![screenshot](https://lh3.googleusercontent.com/RovhbqG4LsFp4QwKELjZPa3wDe-u4k1wcAbtOarVrl5CrZlVWtSYGLikq8hwxytm0erHZfDh39dD_8FesMZirJTSzrg34rxLEVtENEx35Vg1GUFzhlWpVKrI3QMX_brrgRVQa98hr2c=w800)

Open that MySQL connection you just created and from top menu File/Open SQL Script and select "database.sql" which has been provided with this github project and execute it to create database tables.

Getting access token by registering at [discord developer portal](https://discordapp.com/developers/applications/). Add necessary details inorder to get "Client Secret Token"

Setting environment variables. This step would be a little different for different OS.

For Windows
 - Search for "Edit environment variables for your account" and click enter
 - Click "New"
 - For variable name enter ```gmbot``` (all in small letters)
 - For variable values enter the following details separated by a terminator ```;```
     - custom string for hashids
     - mysql hostname
     - mysql username
     - mysql password
     - ```chatbot``` (all in small letters)
     - discord client secret token
 
 It would look something like ```secretkey;localhost;python_user;mysqlpassword;chatbot;vgVsJzVyuAuVJKhfuyVUvvbU```

Last step
```bash
# Run the chatbot
$ python main.py
```

##### Note: If you see ```Bot all set and running!``` thats means you were Successful.


## Download

You can [invite](https://discordapp.com/oauth2/authorize?client_id=561953380059316225&permissions=8&scope=bot) the chatbot to your discord server and start trying out it's various features.

## Credits

This software uses the following open source packages:

- [Python](https://www.python.org/)
- [Discord.py](https://pypi.org/project/discord.py/)
- [Hashids](https://pypi.org/project/hashids/)
- [MySQL CE](https://www.mysql.com/products/community/)
- [MySQL Connector](https://pypi.org/project/mysql-connector-python/)

## Related

[Multiplayer GameBot website](/) - Know more about this project

## Support

to be added

## License

GPL3

---

> [My Portfolio](https://itsnikhil.pythonanywhere.com) &nbsp;&middot;&nbsp;
> GitHub [@itsnikhil](https://github.com/itsnikhil) &nbsp;&middot;&nbsp;
> Twitter [@NikhilTaneja03](https://twitter.com/NikhilTaneja03/)
