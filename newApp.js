let nextBranchParentId = null;
let nextActions = [];

window.runTest = (playbook, customer, entities) => {
  const { actions, branches } = entities;
  console.log("branches: ", branches);
  console.log("customer: ", customer);
  const orderedActionsArray = [];

  const previousActionMap = {};
  Object.values(actions).map((action) => {
    if (action.nextActionId) {
      previousActionMap[action.nextActionId] = action.id;
    }
  });

  for (const action in actions) {
    if (actions[action].parentBranchId === null) {
      nextActions.push(actions[action]);
    }
  }

  const FILTER_TO_FUNCTION_MAP = {
    eq: (customerVal, filterVal) => customerVal === filterVal,
    not_eq: (customerVal, filterVal) => customerVal !== filterVal,
    greater: (customerVal, filterVal) => customerVal && customerVal > filterVal,
    less: (customerVal, filterVal) => customerVal && customerVal < filterVal,
    not_null: (customerVal, _filterVal) =>
      customerVal !== null && customerVal !== undefined,
  };

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

  let hasNextAction = true;
  while (hasNextAction) {
    let topActionCandidates = nextActions?.filter(
      (action) =>
        !previousActionMap[action.id] &&
        ((!nextBranchParentId && !action.parentBranchId) || nextBranchParentId)
    );
    let topAction = undefined;
    if (topActionCandidates && topActionCandidates.length == 1) {
      console.log('topAction: ', topActionCandidates)
      topAction = topActionCandidates[0];
    }
    else if (topActionCandidates && topActionCandidates.length > 1) {
      throw 'Malformed playbook!'
    }

    if (topAction) {
      orderedActionsArray.push({ playbookActionId: topAction.id });
      let nextAction = actions[topAction.nextActionId];
      while (nextAction) {
        orderedActionsArray.push({
          playbookActionId: nextAction.id,
        });
        nextAction = actions[nextAction.nextActionId];
      }
    }

    if (Object.keys(branches).length === 0) {
      hasNextAction = false;
      return orderedActionsArray;
    }

    let currentBranches = [];
    for (const branch in branches) {
      if (branches[branch].parentBranchId === nextBranchParentId) {
        currentBranches.push(branches[branch]);
      }
    }

    if (currentBranches.length) {
      console.log("mc-current: ", currentBranches);
      const branch = findBranch(currentBranches);
      orderedActionsArray.push({
        playbookBranchId: branch.id,
      });
      nextBranchParentId = branch.id;

      nextActions = [];
      for (const action in actions) {
        if (actions[action].parentBranchId === branch.id) {
          nextActions.push(actions[action]);
        }
      }
    } else {
      nextBranchParentId = null;
      nextActions = [];
    }

    hasNextAction = !!(nextActions.length || nextBranchParentId);
  }

  return orderedActionsArray;
};