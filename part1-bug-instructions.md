# Part 1: Bug Prioritization & Fixes
## Overview
This exercise is based on Vitally's "playbooks" feature. Playbooks are automated workflows that perform certain actions (e.g. sending a customer an email, creating a task, updating some data) when customer matches a particular filter. They also support branches - i.e. they can be configured to dynamically select different sets of actions once an account is "enrolled" in the workflow.

We've created a demo account for you to check out some playbooks in the product. Sign in with the below credentials, head to [code-test-support-eng.vitally.io/settings/playbooks](http://code-test-support-eng.vitally.io/settings/playbooks) and click on any of the playbooks there.

- Login url: [code-test-support-eng.vitally.io](http://code-test-support-eng.vitally.io)
- Email: richard@code-test-support-eng.vitally.io
- Password: time2Play!

### Preview playbook execution
When a user is creating or editing a playbook, it's helpful for them to be able to preview the filtering logic as it applies to an existing customer. You can see how this works in the demo application:

<img src="/test-button.png" width="200"/>

Click on that button, select a customer in the modal, and click “Run Test”.

<img src="/test-modal.png" width="500"/>

Once you run your test, you’ll see a path through the playbook highlighted in purple. This represents the path the customer *would* take through the path if enrolled into it.

<img src="/test-result.png" width="700"/>

## Your challenge
Our team has been refactoring the code for testing the path a given customer would take through a playbook, and we're running into issues! You can find this new/broken logic in `newApp.js` Thankfully, we still have the working legacy playbook logic running in [code-test-support-eng.vitally.io](https://code-test-support-eng.vitally.io), so we can compare the refactor with what the results should be.

There are three issues that have been filed below. 

**Your tasks for this challenge are as follows**:

1. List the order in which all three issues should be prioritized, and why you chose this order
2. Fix two of the three issues. The choice of which two is yours!
3. Provide a brief response to your non-technical coworker explaining what caused the issue for the two bugs you chose to fix

For the bug fixes, you will be editing the contents of `newApp.js` and testing those edits by pasting the contents of `newApp.js` into the browser console, then opening the "Run a test" modal and running a test.

If the function returns anything (ie. not `null` or `undefined`), we will compare your results to our legacy logic and show you a message.


### Filed issues

#### Issue #1
Nothing happens when I try to run a test in `1. Simple`. The first test I ran worked, but now it won't work for any account. I've tried a bunch, but Bank of America is one for example. It seems like it might have broken the other playbooks, too?? Not sure what's going on here.

#### Issue #2
I just ran Asana through the new tester on playbook `2. 1 level of branches` and it's not matching the <$1k MRR segment, but their MRR is $500. Can you take a look when you get a chance?

#### Issue #3
Hey, I was testing IGN's path using the new tester in `3. Lots o' branches` and it says they are going to end up in the `Ignore` segment?? We can't be ignoring some of our top customers! This is wrong. Can you look into this please? Is this the same issue as above?

## Function arguments
The test function should take 3 arguments: (1) the playbook, (2) the customer, and (3) the "entities" that make up the playbook structure.

### Argument #1
example:
```
{
  name: 'Onboarding playbook',
  actions: ['action-1', 'action-2'],
  branches: ['branch-1', 'branch-2']
}
```
properties:
| key | description |
| :--- | :--- |
| **name** | string |
| **actions** | array of action IDs (strings). To get each action, you will need to check argument #3 `entities` |
| **branches** | array of branch IDs (strings). To get each branch, you will need to check argument #3 `entities`|

### Argument #2
example:
```
{
  id: 'customer-1',
  name: 'Slack',
  mrr: 1000,
  type: 'subscribed',
  trialEndDate: '2021-01-31T17:00:00.000Z',
  firstPaidDate: '2021-08-08T17:49:12.637Z',
  churnedAt: null
}
```
properties:
| key | description |
| :--- | :--- |
| **id** | string |
| **name** | string |
| **mrr** | integer |
| **type** | string - one of `trial`, `unqualified-trial`, or `subscribed` |
| **trialEndDate** | date string or null |
| **firstPaidDate** | date string or null |
| **churnedAt** | date string or null |

### Argument #3
An object with 2 properties: `actions` and `branches`. Each of these contain a key/value store of actions and branches (keyed by action/branch ID).

example:
```
{ 
  actions: {
    'action-1': {
      id: 'action-1',
      parentBranchId: null,
      actionType: 'assignCSM',
      nextActionId: 'action-2',
    },
    'action-2': {
      id: 'action-2',
      parentBranchId: null,
      actionType: 'sendEmail',
      nextActionId: null,
    },
    'action-3': {
      id: 'action-3',
      parentBranchId: 'branch-1',
      actionType: 'createTask',
      nextActionId: null,
    },
  },
  branches: {
    'branch-1': {
      id: 'branch-1',
      parentBranchId: null,
      name: 'High MRR',
      filters: [{ property: 'mrr', operator: 'greater', value: '500' }],
      position: 0,
    },
    'branch-2': {
      id: 'branch-2',
      parentBranchId: null,
      name: 'Otherwise',
      filters: [],
      position: 1,
    },
  }
}
```

action properties:
| key | description |
| :--- | :--- |
| **id** | string (and the main ID of the action) |
| **nextActionId** | string. A reference to the action to be executed **after** this action |
| **actionType** | string. Just describes what the action does. This is not really used. |
| **parentBranchId** | string. A reference to the branch the action is under. If `null`, then the action is at the ‘top’ of the playbook and not nested under any branches. |

branch properties:
| key | description |
| :--- | :--- |
| **id** | string (and the main ID of the branch) |
| **name** | the name of the branch |
| **parentBranchId** | string. A reference to the branch this branch is under. If `null`, then the branch is one of the first set of branches encountered. Note that actions where `parentBranchId` is `null` are executed first, then followed by any branches where `parentBranchId` is `null` |
| **filters** | an array of filters the `customer` must meet in order for the branch to apply to it. See below for the filter schema |
| **position** | integer. This represents the order of the branch in relation to its siblings. Once the test enrollee reaches a set of branches, the first branch (i.e. the one with the smallest `position`) where the enrollee matches the filters should be applied |

filter properties:
| key | description |
| :--- | :--- |
| **property** | one of the customer properties described (e.g. `mrr`, `churnedAt`, etc) |
| **operator** | One of `eq`(i.e. `=`), `not_eq`(i.e `!=`, `greater`(i.e. `>`), or `less`(i.e. `<`). Note that dates are equal if they occur on the same date, not equal if on different dates. Time should not be considered. |
| **value** | the value of the filter to compare against |
