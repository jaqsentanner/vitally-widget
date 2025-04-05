# Part 1

## Playbook 1 (Simple) *TINKERED, BUT LEFT IT ALONE*

Single path/branch automation that is triggered by an account being less than 2 days old.
<br>
Assigns a CSM from a pool of reps.
<br>
Create's an indicator at the account level.
<br>
Add's the account in question to the "Onboarding" segment or group.
<br>
Waits 2 days.
<br>
Create's a task for the CSM to check in with the account and see how onboarding is going.

## Playbook 2 (1 level of branches) *SOLVED*

Tested with Asana and got the correct path with deployed code in playground.
<br>
Pasted newApp.js and ran it to see what happens and debug -  hitting the "Malformed Playbook" error handler.
Likely, the function is confused over what the next action is because there are multiple next top actions being served. 
<br>
The filter should push Asana to the correct branch, but it isnt. 
Is there a filtering issue?
<br>
Does nextActions contain multiple actions that match the criteria at one given time?
<br>
Confirmed two topActionCandidates are being logged in existing broken code. One of which has a nextActionId === null.
<br>
Sanity checked that the issue wasn't strings vs integers with the comparison, didn't fix.
<br>
Seeing two "topActionCandidates" in the logs, one with a null nextActionId. <br>
Updated the code to exclude topActionCandidates with nextActionId === null, still a branching issue.
<br>
Taking a closer look at the filtering logic here to understand why it's evalutating true for <$1k MRR and for "Otherwise"
<br>

### More Notes
Logged the branches and filters and realized the testBranch. <br>
functionality was getting confused between <$1k MRR path and Otherwise path. <br>
I noticed the "otherwise" path had no filters in the array, and I modified the
testBranch function to check the branches filters array if the length was 0
it would return false for that branch, therefore leaving only one path, <$1k MRR
remaining. <br> <br> Appeared to solve Issue #2, but not convinced. Will test with other clients besides Asana. 
This turned out not to be the fix as it only solved Asana. <br>
I dug deeper and console.log the entire flow to determine that all 3 branches were
pushing to currentBranches because the nextBranchParentId initialized in file as null
matched the null value of parentBranchId on all 3 branches. <br> <br>
I refactored the findBranch function to add logic that <br>
    - prioritized branches with a filter array > 0 <br>
    - Otherwise branch is no longer always selected <br>
    - appears to solve issue #2 for all Run Test on all available Clients <br>

## Playbook 3 (Lots o' branches at land o' lakes) *SOLVED*

This playbook is triggered if a client's overal health score is less than 2.
<br>
It will create an action to update the trait "CSM Pulse" to "Poor".
<br>
Then, there is a fork based on the subscription status <br>
    1. Status === subscribed <br>
    2. Status === qualified trial <br>
    3. otherwise
<br>

### Status = subscribed

    1. < $1k MRR ends the playbook 
    2. otherwise, (MRR $1k or greater) 
        - Action: Assign a CSM to the account 
        - Action: Create an account indicator "Risk" 
            - MRR < $3k = SMB 
                - Action: Start a conversation with the Account 
            - MRR > $2999 = Mid Market 
                - Action: Create an account task (Reach out: Mid Market) 
            - otherwise 
                - Action: Create an account task (Reach out: ENTERPRISE! BIG FISH!)


### Status = qualified trial

    1. If status != qualified trial, end the playbook
    2. If status === qualified trial start a convo with the account
        - "How can we help?"

### Status = otherwise

    1. Action: Add account to segment "Ignored"

### Goal

Per the working example and known client data, we want this to land in Mid Market as<br>
    - IGN is subscribed<br>
    - They have a MRR over $1000<br>
    - They have an MRR over $2999<br>
    - Where is the top-end of Mid Market defined?<br>
    - What pushes the playbook to the ENTERPRISE path ultimately?<br>

### More Notes
I started console.logging everything again to find the mismatch. <br>
I had to work my way through it but ultimately caught it in the logs! <br>
customer object has a "type" === subscribed <br>
default code was looking for "status" === subscribed <br>
We're in the green!!!




