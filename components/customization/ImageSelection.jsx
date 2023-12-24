import { Image, Pressable, Text, View } from "react-native"
import RadioButton from "../RadioButton"
import { useEffect, useState } from "react"

const ImageSelection = ({style, title, onChange, defaultValue}) => {
    const initialColorValue = defaultValue
    const [active, setActive] = useState(initialColorValue)
  
    useEffect(() => {
      onChange && onChange({type: 'position', postion: active})
    },[active])
  
    
    return (
      <View style={style} className="w-full">
        <Text className="text-[16px] text-black font-normal mb-3">{title}</Text>
        <View className="flex-row justify-center">
          <ImageSelectionCard onPress={() => setActive('left')} active={active === 'left'} label="left" />
          <ImageSelectionCard onPress={() => setActive('right')} active={active === 'right'} label="right" style={{marginLeft: 12}} />
        </View>
      </View>
    )
}

const ImageSelectionCard = ({style, label, active, onPress}) => {

  return (
    <Pressable style={style} className="items-center" onPress={onPress}>
        <View className="w-40 h-40 bg-gray-200">
          <Image className="w-full h-full" src="" />
        </View>
        <View className="flex-row mt-2 items-center ">
          <Text className="text-[14px] text-black font-normal uppercase mr-2">{label}</Text>
          <RadioButton checked={active} />
        </View>
    </Pressable>
  )
}

export default ImageSelection