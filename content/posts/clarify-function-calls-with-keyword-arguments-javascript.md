+++
categories = ["JavaScript", "Programming"]
date = 2021-08-06T18:30:00Z
description = "While working with many JavaScript libraries you might have come across this common pattern where in the function call you pass an object many-a-times often referred as options. There is a reason why this is a common good practice and in this article I will be giving the reasoning behind this practice."
draft = true
keywords = []
tags = ["Code readability ", "Good practice"]
title = "Clarify function calls with keyword arguments - JavaScript"

+++
While working with many JavaScript libraries you might have come across this common pattern where in the function call you pass an object many-a-times often referred as `options`. There is a reason why this is a common good practice and in this article I will be giving the reasoning behind this practice.

### Common options pattern

Let's say you are working on an existing codebase and see the following code

    twitter_search('@obama', False, 20, True)

_Some eagle eyed person amongst you might have noticed I have F and T capital in Boolean, that's because it's not JavaScript. This example had been taken from a talk "Transforming Code into Beautiful, Idiomatic Python" by Raymond Hettinger._

In a company there are many people working on same codebase and let's say it was not you who wrote the above code. You might be able to tell this function will search for tweets where Obama has been tagged and maybe you could guess we need to fetch 20 such tweets but False and True what does that mean? You would have to memorize the arguments to check that.

In Python, solving this problem is simple using named arguments. In this way, your function call would become

    twitter_search('@obama', retweets=False, numtweets=20, popular=True)

But unfortunately we do not have luxury of named parameters in JavaScript but we have objects to the rescue.

    twitterSearch('@obama', {
    	retweets: false,
        numtweets: 20,
        popular: true
    });

If you have worked with mongoose library, they share the similar API

    await mongoose.connect('mongodb://localhost/my_database', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });

### From the library developer perspective

Let's say you are writing a module which formats date into a specified format (just for the sake of an example)

    const formatToString = (day, month, year, format, sep) => {
            const dd = day.toString().padStart(2,0);
            const mm = month.toString().padStart(2,0);
            const yyyy = year.toString();
    
            switch (format) {
                case 'dmy' : return `${dd}${sep}${mm}${sep}${yyyy}`;
                case 'mdy' : return `${mm}${sep}${dd}${sep}${yyyy}`;
                case 'ymd' : return `${yyyy}${sep}${mm}${sep}${dd}`;
                default : return `${yyyy}${sep}${mm}${sep}${dd}`;
            }
    }
    
    module.exports = {
        formatDate(date, format, separator, options={skipInvalid, overrideInvalidWith}) {
            options.hasOwnProperty('skipInvalid') ? options.skipInvalid : False;
            options.hasOwnProperty('overrideInvalidWith') ? options.overrideInvalidWith : new Date();
            const dateObj = new Date(date);
            if (isNaN(dateObj)){
                if (options.skipInvalid)
                	return null;
                let overrideInvalidValue = new Date(options.overrideInvalidWith);
                if (isNaN(overrideInvalidValue))
                	overrideInvalidValue = new Date();
                dateObj = overrideInvalidValue;
            }
            const day = dateObj.getDate();
            const month = dateObj.getMonth() + 1;
            const year = dateObj.getFullYear();
    
            return formatToString(day, month, year, format, separator);
        }
    }

Checking if options have been initialised properly with hasOwnProperty might slow down your code by a little bit but really what are you trying to save micro-seconds or hours of programmer time? I hope your answer is hours of programmer time. This is a simple transformation improves code readability a lot.