---
title: Algorithm behind TNB Analysis
date: 2021-01-25 09:00:00
tags:
    - algorithm
    - technology
    - javascript
categories:
- programming
keywords:
    - NodeJs
    - Algorithm
    - Data structure
    - Sorted sets
    - Stream json
    - thenewboston
---

[TNB or thenewboston](https://thenewboston.com/) is a digital cryptocurrency network which is being developed by Bucky Roberts and open source community of which I am part of. There are thousands of registered accounts which will increase rapidly in future. At the time of writing this article there are 90 JSON files. My task was to process each of these JSON files and output results providing insights like total coins distribution over time period, total number of accounts, richest account information, wealth distribution, etc. Now that you know background, problem statement and assence of the scale of challenge let's see how I solved it.

Through this article you will learn about **JSON Streams** and **Sorted set** empowering the algorthm behind [TNB Analysis project](https://itsnikhil.github.io/tnb-analysis/)

## Datasource

Everyday for about past 3 months, Bucky or someone from the team takes Account model backup as JSON and push it to GitHub which you can find [account backups here](https://github.com/thenewboston-developers/Account-Backups/tree/master/account_backups). The data is a big object of objects. Opening it on *mobile browser hangs my phone lol*

```json
{
"6649dde16e": {
    "balance": 166700,
    "balance_lock": "c8fa0404d9"
  },
  {...},
  ...
}
```
In the above example, "6649dde16e" is a particular account's public address. Balance is yes you guessed it - TNB coins a particular person owns. You can ignore balance_lock for now as it is irrelevant for analysis.

## Processing JSON files efficiently

Task was to read each object in the JSON one by one and sum up balance for each account, easy right?

```js
const backup = require("path/to/backup/file.json");
let totalBalance = 0;
for (let account in backup) totalBalance += backup[account].balance;
console.log(totalBalance);
```

But this is not the best way of doing things for a particular reason. When it comes to reading a large array of objects (for example, 10,000 objects), we are usually required to deal with major performance issues regarding large memory allocation for objects. [Nodejs has a default memory limit](https://medium.com/@vuongtran/how-to-solve-process-out-of-memory-in-node-js-5f0de8f8464c) of 512mb on 32 bit and 1 gb on 64 bit systems. To deal with the issues, we can use Streaming only small chunks of valid json. I used [stream-json](https://www.npmjs.com/package/stream-json) npm package.

```js
const { chain } = require('stream-chain');

const { parser } = require('stream-json');
const { streamObject } = require('stream-json/streamers/StreamObject');

const fs = require('fs');
const pipeline = chain([
fs.createReadStream(file),
    parser(),
    streamObject()
]);

let total = 0;
let max_balance = 0;
let rich_account = '';
let n_accounts = 0;

// Process each account object in json
pipeline.on('data', (data) => {
    ++n_accounts;
    total += data.value.balance;
    if (data.value.balance > max_balance) { 
        max_balance = data.value.balance;
        rich_account = data.key;
    };
});

// Calculate and print totals on completion
pipeline.on('end', () => {
    console.log(`Total: ${total} coins (${n_accounts} accounts)
    Richest account: ${rich_account} (${max_balance} coins)`);
});
```

## Calculating wealth metrics

Now you can process whole JSON using streams in a single pass with very little memory footprint. Next challenge is to generate a rich list. Rich list is basically ordering account objects based on their balance. For this we keep accounts in memory. But do we need all the accounts? The answer is NO. At this point so far we already know total balance and total no. of accounts. So, if we want to find top 5% richest accounts then we should not care about rest of the 95% whose wealth will be total balance - 5%'s total balance.

I used "Sorted sets" data structure to achieve this. [js-sorted-set]((https://www.npmjs.com/package/js-sorted-set)) internally uses Array or Binary tree or Red-black trees. Time complexity for each:

| Operation | Array | Binary tree | Red-black tree |
| --------- | ----- | ----------- | -------------- |
| Create | O(1) | O(1) | O(1) |
| Length | O(1) | O(1) | O(1) |
| Clear | O(1) | O(n) (in garbage collector) | O(n) (in garbage collector) |
| Insert | O(n) (often slow) | O(n) (often slow) | O(lg n) (fast) |
| Remove | O(n) (often slow) | O(n) (often slow) | O(lg n) (fast) |
| Iterate | O(n) (fast) | O(n) (slowest) | O(n) (slower than Array) |
| Find, Test | O(lg n) (fastest) | O(n) (slowest) | O(lg n) (slower than Array) |

I used red-black implementation of sorted sets mainly because of it's lg(n) complexity for insertion as that was my primary use case. Total time complexity for calculating rich list became (5% of totalAccounts) * lg(totalAccount) which is better than using merge sort or quick source algorithm along with the benefit of not keeping whole object in memory.

After calculating all these metrics, I save the results into CSV which is then used to generate charts using Pandas.

Thank you for your time. If you find the article insightful consider sharing it with your friends. TNB Analysis is open sourced https://github.com/itsnikhil/tnb-analysis and a star to project would be awesome.

---