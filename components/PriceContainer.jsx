import { Text, View } from "react-native"
import { FONT_FAMILY } from "../theme"

export default function PriceContainer({amount, size='md', withTax=false, withOfferTag=false, containerStyle, position="center"}) {
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
    else if(size === 'xl') {
        mainTextSize = `text-xl`
        subTextSize = `text-xl`
    }
    else {
        mainTextSize = `text-[14px]`
        subTextSize = `text-[12px]`
    }
    
    return(
      <View style={containerStyle} className={`${position === 'left' ? 'items-start' : position === 'right' ? 'items-end' : 'items-center'}`}>
        <View className="flex-row items-center">
          <Text style={FONT_FAMILY.secondary} className={`${mainTextSize} font-normal text-[#3198bb]`}>
              {price} {currencyCode}
          </Text>
          {isDiscountApplyed && (
            <>
              <Text style={FONT_FAMILY.secondary} className={`${subTextSize} line-through font-normal text-black ml-2`}>
                {comparePrice} {currencyCode}
              </Text>
            {withOfferTag && (< Text className={`${subTextSize} font-normal text-black ml-1`}>
                {discountPercentage}% offer
              </Text>)}
            </>
          )}
        </View>
        {withTax && (<Text style={FONT_FAMILY.secondary} className={`${subTextSize} text-gray-500 font-normal mt-1`}>
          excluding VAT
        </Text>)}
      </View>
    )
  }