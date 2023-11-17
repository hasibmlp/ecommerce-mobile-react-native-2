import { Text, TextInput, View } from "react-native";

export default function InputListItem({style, priceType, price, values, handleBlur, handleChange}) {

    const error = false

    return (
        <View style={[style]} className="">
            <Text className={`text-[14px] ${error ? 'text-red-500' : 'text-black'} font-normal`}>{priceType === 'min' ? 'Minimum' : 'Maximum'} Amount</Text>
            <PriceInput label={`${priceType === 'min' ? 'Min' : 'Max'} AED ${price}`} currencyCode="AED" error={error} values={priceType === 'min' ? values.min : values.max} handleBlur={handleBlur(priceType === 'min' ? 'min' : 'max')} handleChange={handleChange(priceType === 'min' ? 'min' : 'max')}/>
        </View>
    )
}

function PriceInput ({label, currencyCode, error, values, handleBlur, handleChange}) {
    return (
        <View className={`relative justify-center border-b ${error ? 'border-red-500' : 'border-gray-300'} `}>
            <Text className="text-[16px] text-black font-normal uppercase absolute z-10 left-0">{currencyCode}</Text>
            <Text className="text-[13px] text-gray-500 font-normal absolute z-10 right-0">{label}</Text>
            <TextInput 
                className="pl-10 pr-24 py-3 text-[16px]"
                inputMode='numeric' 
                maxLength={16}
                onChangeText={handleChange}
                onBlur={handleBlur}
                value={values}
            />
        </View>
    )
}