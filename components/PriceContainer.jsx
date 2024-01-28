import { Text, View } from "react-native"
import { COLOR_THEME, FONT_FAMILY } from "../theme"

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
        subTextSize = `text-lg`
    }
    else {
        mainTextSize = `text-[14px]`
        subTextSize = `text-[12px]`
    }
    
    return(
      <View style={containerStyle} className={`${position === 'left' ? 'items-start' : position === 'right' ? 'items-end' : 'items-center'}`}>
        <View className="flex-row items-center justify-center">
          <Text style={FONT_FAMILY.secondary} className={`${mainTextSize} font-normal text-[${COLOR_THEME.primary}]`}>
              {price} {currencyCode}
          </Text>
          {isDiscountApplyed && (
            <View className="flex-row item-center ml-2 justify-center">
              <Text style={FONT_FAMILY.secondary} className={`${subTextSize} line-through font-normal text-neutral-400`}>
                {comparePrice} {currencyCode}
              </Text>
            {withOfferTag && (< Text className={`${subTextSize} font-normal text-black ml-2`}>
                {discountPercentage}% Offer
              </Text>)}
            </View>
          )}
        </View>
        {withTax && (<Text style={FONT_FAMILY.secondary} className={`${subTextSize} text-gray-500 font-normal mt-1`}>
          excluding VAT
        </Text>)}
      </View>
    )
  }