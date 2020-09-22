---
title: Year in Pixel with Journal
date: 2020-09-21 00:00:00
tags:
    - Journal
    - IFTTT
    - Fitbit
category: Journal
keywords:
    - Journal
    - IFTTT
    - Fitbit
    - Tutorial
---
## Step-by-step guide to setup Journal with IFTTT
### Make sure you are on Journal v4.0 or above

#### Background

> Mail from: Keira Kenealy,
>
> Hello so I downloaded your journal app a long time ago I saw the update and updated for about a month it has not been opening I just now saw the warning please please please fix it I love this app but wish I could use it thanks! Is there anyway i can fix it myself? If not when will the fix come out, hope it comes out soon!
> Love this app thanks for your time

Journal v3 added new calendar feature, analytics, added support for 10 different languages and was re-coded with multi-view SDK. Everything was good for first 30 days. Problem occured when user's data increased until it was no longer enough to keep it all in memory at a time. Fitbit has 64KB heap size limit, doesn't have support for any local database engine. In all it is a challenge to scale Journal. All the data is stored on user's device and that's how the app is available for free, I don't have to purchase servers and keep them running. Regardless, I had to find a solution to this issue.


#### Say hello to IFTTT

IFTTT is a freeware web based service which can be used to automate lot of stuff leveraging Internet of Things. What it means for Journal is whenever you add your day which acts as "trigger". The information can be communicated with IFTTT where we can create an applet which defines "the action" which would be performed. This action can be add record to google sheets or make a tweet or play certain music based on mood, etc. Google sheets action can help us solve the issue of managing the data for us. Also, this is a **"One Time Setup"** which can take a couple of minutes but it **doesn't cost you any money**. So with that in mind lets get into it.

## 1) Connect to Journal IFTTT Applet 
1. Connect Journal applet by going to **[Journal Google Sheet Logging](https://ifttt.com/applets/qx5mK2Sa)**

![Example image](/blog/img/1.png)

2. If you are not logged in, **please login/ signup to IFTTT account**

![Example image](/blog/img/2.png)

3. Journal Year in Pixel Applet needs Google Sheets and Maker Webook to work

![Example image](/blog/img/4.png)

4. After clicking connect, you will see IFTTT going to google and will ask for permission __"IFTTT wants to access your Google Account"__ in-order to read/write to Google Sheets on your behalf - **Click Allow**

![Example image](/blog/img/5.png)

5. Wait a couple of seconds untill you see **"Connected"**

![Example image](/blog/img/9.png)

6. Now you need to copy API key by going to **[IFTTT Maker Webook](https://ifttt.com/maker_webhooks)**
7. **Click on Setting** present at the top right corner

![Example image](/blog/img/11.png)

8. **Copy API KEY** which is the last part of the URL. For example: 
```https://maker.ifttt.com/use/{API-KEY}```

![Example image](/blog/img/13.png)

9. Open Fitbit app on your phone and **go to Journal App settings**
10. Click on API Key and **paste/type the key** you have copied from the IFTTT website and click save.

![Example image](/blog/img/15.png)

11. Under IFTTT settings, **enable "Send to IFTTT"** toggle

![Example image](/blog/img/16.png)

## 2) Setup google sheet template
1. Make a copy of **[Journal Stories google sheet](https://docs.google.com/spreadsheets/d/1LOESqkXC_Kj3wDzoxpCziA8EK4SHSmoY3Zl9Y8M1Gc8/copy)**

![Example image](/blog/img/17.png)

2. **Rename to exactly "Journal Stories"** for IFTTT to discover.

![Example image](/blog/img/19.png)

3. You have to create the following folders named exactly "IFTTT". Then inside that folder create another folder "MakerWebooks". Then inside that create another folder "mood_log".

![Example image](/blog/img/20.png)

4. Move Journal Stoies google sheet inside mood_log folder. Make sure the file is exactly located here **"IFTTT/MakerWebooks/mood_log/Journal Stories"** for IFTTT to discover properly.

| | |
------------------------- | -------------------------
| ![Example image](/blog/img/21.png) | ![Example image](/blog/img/22.png) |
| ![Example image](/blog/img/23.png) | ![Example image](/blog/img/24.png) |

5. From the  Menu click on **Tools > Script Editor**. This will open script editor in new tab

![Example image](/blog/img/25.png)

6. Copy the specific code in your language provided here:
    + **[CHINESE (SIMPLIFIED) sheets code.gs](https://gist.github.com/itsnikhil/69c3478f19e9cc33e96659a90f27d458#file-chinese_simple_journal_ifttt_sheets_code-gs)**
    + **[CHINESE (TRADITIONAL) sheets code.gs](https://gist.github.com/itsnikhil/69c3478f19e9cc33e96659a90f27d458#file-chinese_traditional_journal_ifttt_sheets_code-gs)**
    + **[DUTCH sheets code.gs](https://gist.github.com/itsnikhil/69c3478f19e9cc33e96659a90f27d458#file-dutch_journal_ifttt_sheets_code-gs)**
    + **[ENGLISH sheets code.gs](https://gist.github.com/itsnikhil/69c3478f19e9cc33e96659a90f27d458#file-english_journal_ifttt_sheets_code-gs)**
    + **[FRENCH sheets code.gs](https://gist.github.com/itsnikhil/69c3478f19e9cc33e96659a90f27d458#file-french_journal_ifttt_sheets_code-gs)**
    + **[GERMAN sheets code.gs](https://gist.github.com/itsnikhil/69c3478f19e9cc33e96659a90f27d458#file-german_journal_ifttt_sheets_code-gs)**
    + **[ITALIAN sheets code.gs](https://gist.github.com/itsnikhil/69c3478f19e9cc33e96659a90f27d458#file-italian_journal_ifttt_sheets_code-gs)**
    + **[JAPANESE sheets code.gs](https://gist.github.com/itsnikhil/69c3478f19e9cc33e96659a90f27d458#file-japanese_journal_ifttt_sheets_code-gs)**
    + **[KOREAN sheets code.gs](https://gist.github.com/itsnikhil/69c3478f19e9cc33e96659a90f27d458#file-korean_journal_ifttt_sheets_code-gs)**
    + **[SPANISH sheets code.gs](https://gist.github.com/itsnikhil/69c3478f19e9cc33e96659a90f27d458#file-spanish_journal_ifttt_sheets_code-gs)**
    + **[SWEDISH sheets code.gs](https://gist.github.com/itsnikhil/69c3478f19e9cc33e96659a90f27d458#file-swedish_journal_ifttt_sheets_code-gs)**

```js
// Sample code for English users
const app = SpreadsheetApp;
const activeSpreadsheet = app.getActiveSpreadsheet();
var activeSheet = activeSpreadsheet.getSheetByName('IFTTT');
var yipSheet = activeSpreadsheet.getSheetByName('Year in Pixels');

function setUpTrigger() {
  ScriptApp.newTrigger('updateData')
  .forSpreadsheet(activeSpreadsheet)
  .onChange()
  .create();
}

function updateData(e){
  if (e.changeType === "INSERT_ROW"){
    const lastRow = activeSheet.getLastRow();
    d = new Date(activeSheet.getRange(lastRow, 3).getValue());
    let value = 0;
    let mood = activeSheet.getRange(lastRow, 2).getValue();
    if (mood === "Amazing") value = 7;
    else if (mood === "Cool") value = 6;
    else if (mood === "Happy") value = 5;
    else if (mood === "Normal") value = 4;
    else if (mood === "Cursed") value = 3;
    else if (mood === "Sad") value = 2;
    else if (mood === "Worst") value = 1;
    let range = yipSheet.getRange(d.getDate()+2, d.getMonth()+3);
    yipSheet.setActiveSelection(range.getA1Notation()).setValue(value);
  }
}
```

![Example image](/blog/img/26.png)

7. After pasting the code at script editor, click on "Select function" which will open a drop-down and select **setUpTrigger**

![Example image](/blog/img/27.png)

8. From the Menu **Hit run**. A pop-up will appear asking "Authorization required". Click on **Review Permissions** 

![Example image](/blog/img/28.png)

9. "Journal wants to access your Google Account". This is required to listen for insert row event - **Click Allow**

![Example image](/blog/img/29.png)
![Example image](/blog/img/31.png)

10. From the Menu click on **View > Executions**. This will open admin panel in new tab

![Example image](/blog/img/32.png)

11. Then, from the side navigation go to **My Triggers**
12. **Make sure "Journal" is present in the list only one time**

![Example image](/blog/img/34.png)

## 3) Test everything is working
1. Make sure your **fitbit watch is connected to Phone**
2. Open Journal app
3. **Record your day**

| | |
------------------------- | -------------------------
| ![Example image](/blog/img/35.png) | ![Example image](/blog/img/36.png) |

4. Select **your mood**
5. Select **most memorable thing**

| | |
------------------------- | -------------------------
| ![Example image](/blog/img/37.png) | ![Example image](/blog/img/38.png) |

6. **Open google sheets** and confirm new record automatically inserted

![Example image](/blog/img/39.png)

7. Explore different sheets to see **Year in Pixel**

![Example image](/blog/img/40.png)


That was it... definitely it takes some time to setup but I hope steps were clear enough. If you still confused please comment below and I would be happy to help. IFTTT is not necessary to use Journal, but I would recommend it as it allows you to persist, analyze and export your data which was not possible before. 
You can setup custom events to trigger with journal utilizing full power of Internet of Things but that would be another post.

**Note:** IFTTT is 3rd party service! IFTTT account is subject to their privacy policy.