# Vitally.io Coding Challenge

# Part 1

## Prioritization 

1. Issue #1 as it causes the entire playbook functionality to break for all clients according to the report. 
2. Issue #3 though it could potentially be the same fix as Issue #2 without knowing more, and you can sense the client's urgency around IGN being a top customer they want to keep happy and provide value to.
3. Issue #2 ideally the solution will become clearer after solving the other issues or may already be resolved.

Hilariously, I dived into the playground and just started working through newApp.js to solve whatever I could as <br>
I understood the logic more and ended up honing in on Issue #2 for most of the time I spent. I suppose it would've made sense to follow my own triaging!

## Solved Issues

### Issue #2 (see notes.md for more brain dumping)

#### My Solution

To my non-technical coworker:

When a playbook executes, it makes decisions about which path to take based on filters that are provided. <br>
The playbook was confused between the right path, and the "if no other option path", and I just had to
clarify to the playbook that it only takes the "if no other option path" when there's no other viable paths to take.

Technical breakdown:

    I refactored the findBranch function to add logic that 
    - prioritized branches with a filter array > 0 
    - Otherwise branch is no longer always selected 
    - appears to solve issue #2 for all Run Test on all available Clients

    const findBranch = (currentBranches) => {
    let matchedBranchWithFilters = null;
    let matchedBranchWithoutFilters = null;
  
    // First, try to find a branch with filters (e.g., MRR < 1000, $1k - $2k, etc.)
    for (const branch of currentBranches) {
      console.log("this branch of currentBranches: ", branch);
      const isBranchMatched = testBranch(branch.filters, customer);
      console.log('isbranchmatched: ', isBranchMatched);
  
      // Prioritize branches with filters
      if (branch.filters.length > 0 && isBranchMatched) {
        if (!matchedBranchWithFilters) {
          matchedBranchWithFilters = branch;
        }
      } else if (branch.filters.length === 0 && isBranchMatched) {
        // Mark the "otherwise" or fallback branches
        if (!matchedBranchWithoutFilters) {
          matchedBranchWithoutFilters = branch;
        }
      }
    }
  
    // If a branch with filters is matched, return it
    if (matchedBranchWithFilters) {
      return matchedBranchWithFilters;
    }
  
    // Return fallback "otherwise" branch if no filter matches
    return matchedBranchWithoutFilters;
    }; 

### Issue #3 (see notes.md for more brain dumping)

#### My Solution

To my non-technical coworker:

There was a typo in the field we were checking that holds the data related to subscription status.

Technical breakdown:

    The customer object being passed to the runTest function had a field called
    "type" that was defining the subscriptiun level "subscribed", "trial", etc. However,
    the code logic was looking for a "status" field to compare to. It wasn't finding one,
    so it defaulted to the "otherwise" or empty filter array option. 

    I updated the testBranch function so that it set the property
    being filtered to customer.type.

    const testBranch = (filters, customer) => {
    if (filters.length === 0) {
      // If filters are empty, return true for branches like 'Otherwise' or fallbacks
      return true;
    }
  
    let result = true;
    for (const filter of filters) {
      const compareFn = FILTER_TO_FUNCTION_MAP[filter.operator];
      if (compareFn) {
        let property = customer[filter.property];
        if (property === undefined) {
          console.warn(`Customer property '${filter.property}' is undefined.`);
          property = null; 
        }
        let filterValue = filter.value;
  
        // Log for debugging
        console.log(`Testing filter: ${filter.operator} on ${filter.property}`);
        console.log(`Customer ${filter.property}:`, property);
        console.log(`Filter value:`, filterValue);
  
        // Normalize case and remove extra spaces for string comparisons
        if (typeof property === 'string' && typeof filterValue === 'string') {
          property = property.trim().toLowerCase();
          filterValue = filterValue.trim().toLowerCase();
        }
  
        console.log(`Modified customer ${filter.property}:`, property);
        console.log(`Modified filter value:`, filterValue);
  
        // Check for matching fields (adjusted to check the correct field)
        if (filter.property === 'status') {
          property = customer.type; 
        }
  
        result = result && compareFn(property, filterValue);
      } else {
        throw new Error(`Bad argument: filter operator '${filter.operator}' not supported`);
      }
    }
    return result;
    };

# Part 2
