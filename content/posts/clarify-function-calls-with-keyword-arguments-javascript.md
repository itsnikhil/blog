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

```py
twitter_search('@obama', False, 20, True)
```

_Some eagle eyed person amongst you might have noticed I have F and T capital in Boolean, that's because it's not JavaScript. This example had been taken from a talk "Transforming Code into Beautiful, Idiomatic Python" by Raymond Hettinger._

In a company there are many people working on same codebase and let's say it was not you who wrote the above code. You might be able to tell this function will search for tweets where Obama has been tagged and maybe you could guess we need to fetch 20 such tweets but False and True what does that mean? You would have to memorize the arguments to check that.

In Python, solving this problem is simple using named arguments. In this way, your function call would become
```py
twitter_search('@obama', retweets=False, numtweets=20, popular=True)
```
But unfortunately we do not have luxury of named parameters in JavaScript but we have objects to the rescue.
```js
twitterSearch('@obama', {
	retweets: false,
    numtweets: 20,
    popular: true
});
```

If you have worked with mongoose library, they share the similar API
```js
await mongoose.connect('mongodb://localhost/my_database', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});
```
### From the library developer perspective

Let's say you are writing a module which formats date into a specified format (just for the sake of an example)
```js
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
    formatDate(date, format, separator, options={skipInvalid: false, overrideInvalidWith: new Date()}) {
        options.hasOwnProperty('skipInvalid') ? options.skipInvalid : false;
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
```
This module export `formatDate` public function which take date, format, separator and a couple of optional parameters. And the function call will be like

    formatDate("2021-08-07T12:06:07.484Z", "ymd", "-") // without options
    formatDate("2021-08-07T12:06:07.484Z", "ymd", "-", {skipInvalid: true}) // converts invalid date to null
    formatDate("2021-08-07T12:06:07.484Z", "ymd", "-", {overrideInvalidWith: "2021-08-07T12:06:07.484Z"})
    
    // special edge case which need to be handled by library properly using hasOwnProperty
    formatDate("2021-08-07T12:06:07.484Z", "ymd", "-", {})

Checking if options have been initialized properly with `hasOwnProperty` might slow down your code by a little bit but really what are you trying to save "micro-seconds" or "hours of programmer's time"? I hope your answer is hours of programmer time. This simple transformation improves code readability a lot. 

Another advantage of having options is that we can add other optional arguments with sensible defaults without breaking existing functionality from the library consumer's end.

### General rule

Whenever you see a need for having a optional parameter which has some default value, consider using options object as one of the parameter which will provide all these benefits. For private function like `formatToString` in the above example it does not make use of options object because it has not been exposed to the outside world,  it's scope is limited to that particular file only.