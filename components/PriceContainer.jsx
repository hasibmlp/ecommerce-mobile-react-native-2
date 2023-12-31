import { Text, View } from "react-native"

export default function PriceContainer({amount, size='md', withTax=false, withOfferTag=false, containerStyle}) {
    const {price, comparePrice, currencyCode} = amount
    const discountPercentage = Math.round(((comparePrice - price) / comparePrice) * 100)
    const isDiscountApplyed = price < comparePrice

    let mainTextSize
    let subTextSize
    if(size === 'sm') {
        mainTextSize = `text-[14px]`
        subTextSize = `text-[12px]`
    }
    else if(size === 'lg') {
        mainTextSize = `text-[18px]`
        subTextSize = `text-[16px]`
    }
    else {
        mainTextSize = `text-[14px]`
        subTextSize = `text-[12px]`
    }
    
    return(
      <View style={containerStyle} className="items-center">
        <View className="flex-row items-center">
          <Text className={`${mainTextSize} font-normal text-[#4baaca]`}>
              {price} {currencyCode}
          </Text>
          {isDiscountApplyed && (
            <>
              <Text className={`${subTextSize} line-through font-normal text-black ml-2`}>
                {comparePrice} {currencyCode}
              </Text>
            {withOfferTag && (< Text className={`${subTextSize} font-normal text-black ml-1`}>
                {discountPercentage}% offer
              </Text>)}
            </>
          )}
        </View>
        {withTax && (<Text className={`${subTextSize} text-gray-500 font-normal mt-1`}>
          excluding VAT
        </Text>)}
      </View>
    )
  }