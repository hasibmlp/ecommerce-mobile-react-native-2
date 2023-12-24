import { Pressable, Text, View } from 'react-native';
import { ChevronDownIcon } from 'react-native-heroicons/outline';
import BottomModal from '../Modal/BottomModal';
import { useEffect, useState } from 'react';

const Selection = ({options, style, label, onChange, name, handleChange, error, touched, value, fontsLoaded}) => {
    const initialValue = options.find(item => item.value === value)
    const [isActive, setActive] = useState(false)
    const [activeSelection, setActiveSelection] = useState(initialValue)
  
    const handleSelection = (value) => {
  
      setActiveSelection(value)
      setActive(false)
      onChange && onChange({type: name, ...value})
      handleChange(value.value)
    }
  
    useEffect(() => {},[fontsLoaded])
  
    useEffect(() => {
      onChange && onChange({type: name, ...activeSelection})
    },[activeSelection])
  
    if(!fontsLoaded) return null
    
    return (
      <View style={style}>
        <Pressable onPress={() => setActive(true)} className="bg-gray-100 h-12 items-center px-3 rounded-[5px] flex-row justify-between">
            <Text style={{ fontFamily: activeSelection?.fontFamily && activeSelection?.fontFamily}} className='text-[14px] text-black font-normal mb-1'>{activeSelection?.value || label}</Text>
            <ChevronDownIcon size={20} color="black"/>
        </Pressable>
        <View className="bg-red-300 w-full ">
        </View>
  
        <BottomModal visible={isActive} onClose={() => setActive(false)}>
          <View className=" pb-20 w-full bg-white">
            {options.map((lang, index) => (
              <Pressable
                key={index.toString()} 
                onPress={() => handleSelection(lang)}
                className="py-4 px-3 border-b border-gray-200 bg-white self-stretch items-center"
              >
                <Text style={{ fontFamily: lang.fontFamily && lang.fontFamily}} className="text-[16px] text-black font-medium">{lang.value}</Text>
              </Pressable>
            ))}
          </View>
        </BottomModal>
  
      </View>
    )
}

export default Selection