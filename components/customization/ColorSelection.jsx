import { Pressable, Text, View } from "react-native"
import ColorSwatchImage from "../buttons/ColorSwatchImage"
import { useEffect, useState } from "react"
import { FONT_FAMILY } from "../../theme"

const ColorSelection = ({onChange, handleChange, value, colorValues}) => {
    const initialColorValue = colorValues.find(item => item.name === value)
    const [activeColor, setActiveColor] = useState(initialColorValue)
  
  
    const handlePress = (item) => {
      setActiveColor(item)
      handleChange(item.name)
    }
  
    useEffect(() => {
      onChange && onChange({type: 'color-selection', ...activeColor})
    },[activeColor])
  
  
    return (
      <View className="mb-6 px-2">
          <Text style={FONT_FAMILY.primary} className="pb-4">Color: {activeColor?.value}</Text>
          <View className="flex-row flex-wrap gap-4">
            {colorValues.map((item, index) => (
              <Pressable className={`${activeColor?.name === item.name && 'border-[1px]'} rounded-full `} key={index.toString()} onPress={() => handlePress(item)}>
                <ColorSwatchImage size="xg" value={item.name}/>
              </Pressable>
            ))}
          </View>
        </View>
    )
}

export default ColorSelection