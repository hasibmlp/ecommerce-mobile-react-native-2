function filterActiveInputValues(activeFilter) {
    let activeValue
    if(activeFilter['price']){
        activeValue = activeFilter['price'].min + ' - ' + activeFilter['price'].max
    }else {
        const activeValuesObject = Object.values(activeFilter)
        if(typeof activeValuesObject[0] === 'object') {
            activeValue = activeValuesObject[0].value
        }else{
            activeValue = activeValuesObject[0]
        }
    }
    return activeValue
  }

  function deepEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
  
    if (keys1.length !== keys2.length) {
      return false;
    }
  
    for (const key of keys1) {
      const val1 = object1[key];
      const val2 = object2[key];
      const areObjects = isObject(val1) && isObject(val2);
      if (
        areObjects && !deepEqual(val1, val2) ||
        !areObjects && val1 !== val2
      ) {
        return false;
      }
    }
  
    return true;
  }
  
  function isObject(object) {
    return object != null && typeof object === 'object';
  }

  function isActiveFilterInputMatchesWithValue(activeFilterInput, valueToCheck) {
    let isTrue = false
    activeFilterInput.forEach(activeFilter => {
        if(filterActiveInputValues(activeFilter) === valueToCheck) {
             isTrue = true 
        }
    })
    return isTrue
}




  export {filterActiveInputValues, deepEqual, isObject, isActiveFilterInputMatchesWithValue}