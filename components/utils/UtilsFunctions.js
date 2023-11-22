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

 function isFilterValueActive (activeFilterInput, option) {
    let isActive = false
    activeFilterInput.forEach(activeFilter => {
        if(activeFilter.label === option.label) isActive = true
    })
    return isActive
}

function checkTabActive(filter) {
    const valueCounts = filter.values.map(value => value.count > 0)
    let activeCount = false
    valueCounts.forEach(count => {
        if(count === true) return activeCount = true
    })
    return activeCount
}

function getVariantImages(images, selectedOption) {
  // get selected variant images if image altText "#color_black" in this format
  let selectedVariantImages = null
  if(images && selectedOption !== null){
    selectedVariantImages = images.filter(image => {
      if(image.alt) {
        const myString = image.alt
        const substrings = myString.split('#');
        const colorSubstring = substrings.find(substring => substring.startsWith("color_"));
        const colorValue = colorSubstring ? colorSubstring.substring("color_".length) : null;
        if (colorValue === selectedOption?.toLowerCase().replace(/\s+/g, '_')) return image
      }
    })
  }
  return selectedVariantImages
}

function getVariantForSingleOption(variants, option, value) {
  const variant = variants.find(
    (variant) =>
      variant.selectedOptions.find((item) => item.name === option).value ===
      value
  );
  return variant
}

function getVariantForOptions(variants, option) {

  let filteredVariants = variants 

  for(let i = 0; i < option.length; i++) {
    const optionName = option[i].name
    const optionValue = option[i].value
    
    if(optionName && optionValue) {
      filteredVariants = filteredVariants.filter(variant => variant.selectedOptions.find(option => option.name === optionName).value === optionValue)

      // if (filteredVariants.length === 0) {  
      //   throw new Error(`Option value for ${optionName} doesn't match. Provide another value.`);
      // } 

    }
  }

  return filteredVariants.length === 1 ? filteredVariants[0] : null



  // const option1 = option[0]?.name
  // const option2 = option[1]?.name
  // const option3 = option[2]?.name
  // const value1 = option[0]?.value
  // const value2 = option[1]?.value
  // const value3 = option[3]?.value
  // let variant = null

  // if(option1 && value1){
  //   const variant1 = variants.filter(variant => variant.selectedOptions.find(option => option.name === option1).value === value1)
  //   console.log(variant1)
  //   if(variant1.length === 1) variant = variant1
  //   else {
  //     if(option2 && value2) {
  //       const variant2 = variant1.filter(variant => variant.selectedOptions.find(option => option.name === option2).value === value2)
  //       if(variant2.length === 1) variant = variant2
  //       else{
  //         if(option3 && value3) {
  //           const variant3 = variant2.filter(variant => variant.selectedOptions.find(option => option.name === option3).value === value3)
  //           if(variant3.length === 1) variant = variant3
  //           else if (variant3.length === 0) throw new Error("Option value doesn't matches, Provide other value")
  //           else throw new Error('Provide more option to get a variant')
  //         }
  //       }
  //     }
  //   }
  // }

  // if(variant) return variant[0]
  // else return null
}

  export {filterActiveInputValues, deepEqual, isObject, isActiveFilterInputMatchesWithValue, checkTabActive, isFilterValueActive, getVariantImages, getVariantForSingleOption, getVariantForOptions}