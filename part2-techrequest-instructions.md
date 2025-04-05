# Part 2: Technical Requests

## Overview

Technical requests are tasks that our customers ask us to complete on their behalf. These requests typically involve data imports, exports, updates, deletions, and restorations. For part 2 of this coding challenge, you are asked to complete the two technical requests below. You are welcome to use any editor you feel comfortable with, but here are some suggestions:
- VSCode
- Browser console
- https://playcode.io/javascript

## Tech Request #1 - Data Export

Our customer has asked us to generate a report to show how many times each of their users have logged into Vitally per month in 2024.

In our database, we have a UserSession table where each entry represents a session that a user had in Vitally on a specific date. A session is triggered by some interaction that a user had with Vitally (e.g., a survey response, or an event). There can be many sessions for one user for any given date, but sessions are only created for users that are logged into Vitally. 

```
{
  "id": "a3d70218-ff48-4090-afcd-216ed2ad9177",      // The ID of the session
  "date": "2024-01-02",                              // The date of the session
  "user": {                                          // The user that created the session
    "id": "5a25b082-c753-403b-ab1d-c1a40a28bad1",    // The ID of the user
    "name": "Monica Hall"                            // The name of the user
  }
}
```

We’ve exported all of the customer’s sessions from 2024 and stored them in the `user-sessions.txt` file [here](user-sessions.txt).
Assume that a user only logs in once per day, at most. Your task is to write a Javascript function to determine how many times each user logged into Vitally per month. The output from this function should be an array of objects, where each object shows the number of logins per user for a month.

## Tech Request #2 - Data Deletes

The same customer from the above tech request has asked us to remove all of Monica Hall’s sessions from 2024. Using the user sessions provided in the `user-sessions.txt` file, your task is to write a Javascript function to return an array containing all of the original data, except for Monica’s sessions. The output from this function should be an array of objects, where each object represents a session.