---
title: Fidelity Internship 2020
date: 2020-09-10 00:00:00
tags:
    - Internship
category: Experience
keywords:
    - Fidelity
    - Blockchain
mathjax: true
---

#### Hello everyone!

I wanted to share my internship experience at Fidelity International, hence I am writing this blog. I
started my internship with Fidelity International in May. This opportunity was provided to me by my
University. It was a journey of 8 weeks where I got to know about the Finance Industry, exposure to
Blockchain Technology, and made some great friends – Neil Dahiya from DCRUST, Murthal, and
Harsimran Kaur Bajaj from Banasthali University, Rajasthan. Together we were called the "Happiest
Team". Fidelity has a really special place – "Innovation Garage" for the interns where anyone from the
company can bring their ideas to reality throughout any domain of technology like machine learning,
AR/VR, Blockchain, etc and they are provided with all the tools needed for it. Drones, VR headsets,
beacons, you name it, they've got it.

I was supposed to be working at their amazing office at Gurugram, enjoy free food and transport. But
as you know what happened on January 3rd, 2020 (also my birthday) – China reported "unexplained
pneumonia" (namely – SARS COVID 19) outbreak to WHO wherein the pathogen of the disease was
unclear. Later on, March 24th, 2020 – Honourable Prime Minister of India Mr. Narendra Modi declared
a nation-wide lockdown by virtue of which many businesses were shut. Even the heavily funded
startups like OYO laid off many (~360) employees. My LinkedIn feed was full of people who lost their
internships due to the pandemic as companies stopped hiring and international travel was banned.
During this period, my offer letter was yet to come, and I was very tensed. I reached out to the
placement office of my University (SPA) and folks at Fidelity who ensured that my internship was
confirmed but it would now happen virtually from the comfort of our home (WFH).

To be honest, I was a little disappointed by the fact that I would not be able to go to their office,
interact with my colleagues, etc. But during the course of the internship, I realized that WFH cannot
change the people, the fun, and the corporate experience. Though I would have loved going to the
workplace, enjoyed the free food and the brainstorming sessions, a virtual internship made me learn
that productive work needs no infrastructure, but only a group of dedicated people.

The basic structure and work of my internship were that all the interns were divided into teams of 3
or 4. Our team was assigned 2 projects 1) CryptoLeague 2.0 – Stimulated Trading Platform 2)
CryptoWallet – New way to Transact. As the name suggests, it had everything to do with blockchain
technology.

### CRYPTOLEAGUE 2

CryptoLeague 1.0 was a superhit, super famous project within the company. We had a meeting with
one of the Business Analysts of the company who explained to us our tasks. CryptoLeague 2.0 had 4
parties involved 1) End Investor 2) Fund Manager 3) Regulator 4) Market. Fund Managers are the
manufacturers of funds while end investors are the traders who invest in these funds created by fund
managers. All the assets are available in the market and regulators to impose protocols to undertake
consolidated supervision of the financial sector. All the transactions used to settle on Spring boot
server which used MongoDB to save the transactions. At its core, one of the most important
characteristics of Blockchain Technology is a distributed immutable ledger which inculcates
confidence amongst the investors and adds transparency among the parties. On a high level, there are
two main types of blockchain network – Public and Private. Public blockchains like Bitcoin and
Ethereum. Private blockchains like Hyperledger and R3 Corda. The difference being in public networks


anyone can join the blockchain network, meaning that they can read, write, or participate. On the
other hand, a private blockchain is a permissioned blockchain. Permissioned networks where parties
have designated privileges, so the information is shared on a need to know basis it is important for
enterprise use cases. We ended up choosing with R3 Corda (private blockchain network technology).
We modified existing architecture to include Corda which internally used Postgres SQL to store data
on each individual node and Rabbit MQ to interface it with frontend. In the end, all the funds' creation
and transactions used to take place on the Blockchain network, but we kept Spring boot server
replicating data to MongoDB as some of the price feed API was still dependent on it. Also, I created
an onboarding tutorial for the first-time user in the frontend to help him/her get familiar with the
platform.

### CRYPTOWALLET

Crypto Wallet was a new exploratory project. When I say exploratory, I mean it. We had no business
analyst to explain to us what to do. My mentor helped us to focus on the basics. As we were working
on 2 projects parallelly it often happens that you tend to focus more on one project. This is especially
true when you have the option to choose between "a task at hand" vs "straight-up research". Because
of this, it took us a whole week to come up with a diagram of "Basic functionalities in a crypto wallet".
But it was all worth it! During the research, we got to know about Hierarchical Deterministic Wallet.
It was like a eureka moment when we got to know about it, because like a domino effect we discovered
new things linked to it which unfolded another important new information regarding wallet like
private and public key, mnemonics, bip standards, ECDSA, etc. In HD Wallets with just 12 words, you
can deterministically generate new keys so that for each transaction different keys are used. We did
not store any private key on the server which made it very secure, the only caveat being user had to
remember 12-word mnemonics which they needed to enter before every transaction. As CryptoWallet
was a web-based soft wallet solution there is no option to have secure persistent storage on the client-
side and if we store private keys on the server, our server will become a gold mine for hackers. Since
we were developing it from scratch, we were free to use any technology. We used R3 Corda again as
ledger and Django for developing the web app. I had heard about Tailwind CSS a lot, so I gave it a shot
for this project. With my experience in Python, we were able to develop it rapidly and everyone,
especially my mentor was really happy seeing the final results.

I am very thankful to Sharma TECH Abhishek, Chirag Chillar, Akshay Mathur, Sambhav Gaur, Prakash
Jashnani, Jappan Wadhwa, Mehta Pranay, Akash all the Fidelity management team and my teammates
for giving me this opportunity, for the smooth onboarding process, for helping me throughout my
projects. I will miss all the fun activities we did, and I will miss our morning stand-ups. Special thanks
to all hidden faces like support team, infrastructure team, etc. for always being there to help. One of
the best things there was work-life balance. I am extremely happy and delighted to share that I was
offered a pre-placement offer (PPO) after the internship. In the end, I would conclude by saying,
Internships are often seen as something very important and a must for students before they Graduate.
I do agree with the reason behind it. A trial version of a life which most of us may end up living all our
life.
