+++
categories = ["Tutorial", "Web", "Technology"]
date = 2021-05-30T15:30:00Z
description = "Understanding the aspects of access tokens and refresh tokens can be a bit tricky. This post tries to go through short lived tokens and best ways of storing token and implementation of silent refresh"
keywords = ["refresh tokens", "Storing token", "Silent refresh implementation", "JWT", "Authorization"]
tags = ["JWT", "Authorization", "Guide"]
title = "Implementing silent refresh of JWT  "

+++
### Prerequisite knowledge

When you are building services for everyone to access online, you need have a way protect resources so that only the user can access data belonging to them only. For this, websites implement login/ signup, enter username and password and voila access granted! This process is called "Authentication". But what happens when you close your browser or refresh the website. Do you re-login with username and password? No, right. To solve this there is one more thing called "Authorization" which is actually making sure that the user which sends requests to your server is the same user who actually logged in during the authentication process. There are a lot of strategies like Session IDs, API key, Token auth, etc. which comes with the problem of storing client secret securely at a secure place.

#### Session IDs

![](/blog/img/screenshot-2021-05-31-021412.png)

Session ID is a random secret id generated by the server which is stored in database having one to one relationship with primary key of a particular user. This session id is sent to client whenever you login via cookie. Whenever you make a request to private resource. Browser automatically adds this cookie in the new request which is validated by the backend. _This system works but can there be a better solution where we do not need to maintain a state or a database record? Enter JWT_

#### JSON Web Token (JWT)

    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

JSON Web Token (JWT) token follows similar flow diagram to Session like after authentication instead of sending session id in cookie we send a JWT token and for other subsequent requests, this token is used to authorize the user. The key difference here is instead of storing session ids in database we store all the necessary user's info in the token itself. JWT token consists of 3 parts:

![](/blog/img/screenshot-2021-05-31-021417.png)

Each separated by period (dot) and encoded in Base64. Payload is the JSON object containing this data. This token is then stored in the client either in cookie or on browser's localStorage. JWT tokens are signed with a secret key (generally HMACSecret key) following digital signature cryptography, it invalidates the token when tampered by the malicious user.

JWTs are "stateless", which unlocks some benefits like:

* No re-login required for separate services, as same JWT token can be used to authorize as long as all services share same signing secret key. The data is stored in client JWT's payload and not in a particular service's database.
* The token are stored on the client, that's really the import thing about JWT so no matter if there is load balancer or multiple micro services, the user can authenticate with any of those servers as long as they share same secret key.

But with stateless nature, we do not have any mechanism to logout/ stop the access of the user. Typically this token is dropped from localStorage or cookie from their browser but we are trusting the client here, another approach can be to implement a blacklist of restricted tokens which essentially defeats the purpose of stateless. Also, client storing token on localStorage can be vulnerable to XSS attacks or CSRF attack if JWT is stored in cookies.

_All this leads to the gist of this post, following a better approach of having 2 tokens - one short lived access token and another long lived refresh token._

### Introduction to short lived token

Understanding the aspects of access tokens and refresh tokens can be a bit tricky. Whenever a user "authenticate", server sends 2 tokens - access token and refresh token to the client. The speciality of having 2 tokens is they we have expiry on these tokens as part of JWT's payload. Expiry duration of access token is significantly shorter of \~10mins to 24 hours than that of refresh tokens \~months to years or even no expiry. When user want to access any private resource they require access token to "authorize" and everything else works just like with a single token. We can generate new access tokens from refresh tokens.

### Where to store the token?

So now the question comes what is the benefit of having access token if we can generate it from refresh token.

#### LocalStorage

Storing JWT tokens in local storage can leak the token in an event of an XSS attack as hacker can run arbitrary JavaScript code which can provide them access to in-memory variables and localStorage

#### Cookies

Storing token's in cookie can lead to CSRF attack which can make user perform a private action without knowing (or knowing when it's too late) like phishing user to perform `/account/delete`

What is the best way then? According to hasura's ultimate guide `"access token" should be stored in "memory"` and `"refresh token" should be stored in a "secure HTTP only cookie"`. CSRF wouldn't work as access token will not be added automatically and even if hacker can get user to generate new access token via CSRF, they cannot read the access token from response. Now, if XSS is found hacker would still be able to read access token from memory but since the token is short lived the threat level is reduced.

#### Memory

In-memory!! What if user refresh the webpage or re-open the browser? access token will not be available!

In such cases, since refresh token would still be there in cookie we can use it to perform a `silent refresh of access token`.

#### Server's database

Some companies do store refresh token or a unique id of as salt of refresh token (called refresh secret) in database. I am personally against this ideology as it is against JWT's stateless nature but sometimes there can be requirement to logout user immediately. Even in such scenarios find out exact scenarios when you would want to forcefully logout user. Like when user's password is changed or when we suspend a user's account we want their access to terminate immediately. In such cases why not use `isSuspended` and `passwordHash` as part of your refresh salt instead of storing random uuid as refresh secret for each user in database.

### Silent Refresh

Silent refresh is a mechanism to generate new access token from refresh token automatically in the event of browser refresh or when access token is expired but refresh token is available and valid. According to Hasura's guide this is handled at the client side. Client makes very first request to `/refresh_token` as the website loads. This approach is handles browser refresh event but for when token is expired we have to have a `setTimeout event` and make another API call to do silent refresh. 

#### The BAD way

**Handling silent token refresh on sever side, the way I am sharing below is NOT a good idea**. Refreshing token automatically via middleware will render it susceptible to CSRF attacks as we are only depending on refresh tokens which is stored in HTTP only cookie. So, it seems like best approach is the one suggested by Hasura only, it might force you to make a GET request to `/refresh_token` and handle logic of refreshing token on the client side which at the moment is safest way!

On server, having a `middleware IsLoggedIn` whose purpose is to validate the JWT and authorize access. Now, instead of just checking for access token, it also look for refresh token when access token is missing or invalid. IsLoggedIn middleware can generate new access token from the details in token's payload and `return the new-access-token in response header`. Client can `implement an interceptor to update value of in-memory access token`.

![](/blog/img/inkedunknown_li.jpg)

**From the image above I want you to notice 2 things:**

1. Success response on a private resource without providing access token (aka simulating browser refresh)
2. Getting new x-access-token in headers using refresh token which was provided via cookie.

#### The Hasura's (GOOD) way

**Scenario 1:** Page refresh

Since we are only storing access token in memory when page is refreshed we lose access token. This can be handled my making very first requests to `/refresh_token` and generate a new access token. This silent refresh will have 2 steps as explained in the below diagram.  
![](/blog/img/torkn_refresh-page-2.png)

**Scenario 2:** Access token expired

Since access token is short-lived, it will expire very soon and requests will start failing. Whenever this happens client would need to make a request to refresh token again and then retry same request with the new access token. Alternatively, an event can be scheduled to run on every setInterval to refresh access token or some even adopt a strategy to returns new access tokens on every valid private resource request.

![](/blog/img/torkn_refresh-page-1.png)

### References:

[JSON Web Tokens - jwt.io](https://jwt.io/)

[https://www.youtube.com/watch?v=iD49_NIQ-R4](https://www.youtube.com/watch?v=iD49_NIQ-R4 "https://www.youtube.com/watch?v=iD49_NIQ-R4")

[https://hasura.io/blog/best-practices-of-using-jwt-with-graphql](https://hasura.io/blog/best-practices-of-using-jwt-with-graphql "https://hasura.io/blog/best-practices-of-using-jwt-with-graphql")

_This had been a great learning lesson for me which I would have not learned if I used any 3rd party library._