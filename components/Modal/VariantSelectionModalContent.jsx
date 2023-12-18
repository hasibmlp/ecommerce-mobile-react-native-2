import { useContext, useEffect, useState } from "react";
import { Pressable, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import VariantHeader from "./VariantHeader";
import VariantOption from "./VariantOption";
import Button from "../buttons/Button";
import ModalSkeleton from "./ModalSkeleton";
import { PlusCircleIcon } from "react-native-heroicons/solid";
import MyModal from "./MyModal";
import { ChevronDownIcon, XMarkIcon } from "react-native-heroicons/outline";
import { useFonts } from 'expo-font';

import ColorSwatchImage from "../buttons/ColorSwatchImage";
import ShowAndHide from "../ShowAndHide";
import BottomModal from "./BottomModal";

export default function VariantSelectionModalContent({handleClose, context}) {
  const {options, handleAddCartBtn, currentlyNotInStock, selectedVariant, activeOptions} = useContext(context)
  const [loading, setLoading] = useState(true)

  let label 
  if(selectedVariant.id) {
    if(selectedVariant.availableForSale) label = 'add to cart'
    else label = 'notify me when available'
  }else {
    label = activeOptions.length === options?.length ? 'unavilable' : 'add to cart' 
  }

  useEffect(() => {
    options && setLoading(false)
  },[options])
    
    return (
      <View className="items-center justify-center bg-white">
        <View className="pb-10 self-stretch">
          <View className="">
            {!options && <ModalSkeleton />}
            {options && options.map((option, index) => (
              <VariantOption
                key={index.toString()}
                option={option}
                context={context}
              />
              ))}
          </View>

          <CustomizationContainer/>

          <Button 
            label={label} 
            size="md" active={selectedVariant.id ? true : false} 
            onPress={currentlyNotInStock ? () => {} : () => handleAddCartBtn(onClose=handleClose)} 
            style={{marginVertical: 12, marginHorizontal: 12}}/>
        </View>
      </View>
      )
    }
    
    
    
    function CustomizationContainer() {
      const [isModalVisible, setModalVisible] = useState(false)
      return(
        <View className="pb-4 pt-2">
          <Text className="text-[12px] font-normal text-black uppercase mx-4 pb-3">
            Customization:
          </Text>
          <TouchableOpacity 
            onPress={() => setModalVisible(true)}
            className="flex-row items-center justify-center self-start mx-3"
          >
            <PlusCircleIcon size={18} color='#89c157' />
            <Text className="text-[13px] text-[#89c157] font-normal uppercase ml-1">Add Customization</Text>
          </TouchableOpacity>

          <MyModal visible={isModalVisible} slide="toUp">
            <EmbroiderySelection 
              onClose={() => setModalVisible(false)}
            />
          </MyModal>

        </View>
      )
    }
    

const EmbroiderySelection = ({onClose}) => {
  const [activeTab, setActiveTab] = useState('tab-a')
  const [activeSelections, setActiveSelections] = useState([])

  const [fontsLoaded] = useFonts({
    'Robo-Mono': require('../../assets/fonts/RobotoMono-SemiBold.ttf'),
    'Kalnia': require('../../assets/fonts/Kalnia-SemiBold.ttf'),
    'Ubuntu': require('../../assets/fonts/Ubuntu-Bold.ttf'),
  });
  const activeColorCode = activeSelections.find(i => i.type === 'color-selection')?.colorCode
  const activeFont = activeSelections.find(i => i.type === 'font-selection')?.fontFamily

  useEffect(() => {},[fontsLoaded])

  console.log("ACTIVE SELECTIONS",activeSelections)

  const handleSelections = (item) => {
    setActiveSelections(prevState => {
      const prevSelection = [...prevState]
      const itemIndex = prevSelection.findIndex(i => i.type === item.type)
      if(itemIndex > -1) {
        prevSelection.splice(itemIndex, 1)
      }
      prevSelection.push(item)
      return prevSelection
    })

  }

  if(!fontsLoaded) return null

  return (
    <View className="flex-1">
              <View className="h-10 flex-row items-center justify-end px-3">
                  <Pressable className="p-1" onPress={onClose}>
                    <XMarkIcon size={24} color="black"/>
                  </Pressable>
              </View>

              <View className="flex-1">
                <Text className="text-[20px] text-green-500 font-medium uppercase mx-auto mb-5 tracking-[2px]">Embroidery</Text>

                <View className="bg-gray-100 flex-row justify-between px-3">
                  <Pressable className="flex-1 py-3 items-center" onPress={() => setActiveTab('tab-a')}>
                    <Text className="text-[16px] text-black font-normal">Tab A</Text>
                  </Pressable>
                  <Pressable className="flex-1 py-3 items-center" onPress={() => setActiveTab('tab-b')}>
                    <Text className="text-[16px] text-black font-normal">Tab B</Text>
                  </Pressable>
                </View>

                {activeTab === 'tab-a' && (
                <View className="pt-8 px-4">
                  <View className="mb-6">
                    <Selection
                      name="language-selection"
                      onChange={(item) => handleSelections(item)}
                      label={"Language"}
                      style={{marginBottom: 12}}
                      options={[{name: 'en', value: 'English'}, {name: 'ar', value: 'العربي'}]}
                    />

                    <Selection
                      name="font-selection"
                      label={"Font"}
                      onChange={(item) => handleSelections(item)}
                      options={[
                        {name: 'op1', value: 'Roboto Mono', fontFamily: 'Robo-Mono'},
                        {name: 'op2', value: 'Kalnia', fontFamily: 'Kalnia'},
                        {name: 'op3', value: 'Ubuntu', fontFamily: 'Ubuntu'},
                      ]}
                    />
                    {/* <Text className='text-[14px] text-black font-normal mb-1'>Language</Text> */}

                  </View>

                  <ColorSelection onChange={(item) => handleSelections(item)}/>
                  
                  
                  <View className="mb-6">
                    <Text className='text-[14px] text-black font-normal mb-1'>First Line</Text>
                    <TextInput style={{color: activeColorCode, fontFamily: activeFont}} maxLength={16} className={`h-12 text-[18px] items-cetner bg-gray-100 px-2 rounded-[5px]`}/>
                  </View>

                  <View className="mb-6">
                    <Text className='text-[14px] text-black font-normal mb-1'>Second Line</Text>
                    <TextInput style={{color: activeColorCode, fontFamily: activeFont}} maxLength={16} className={`h-12 text-[18px] items-cetner bg-gray-100 px-2 rounded-[5px]`}/>
                  </View>


                </View>)}



                {activeTab === 'tab-b' && (
                <View className="py-5">
                  <View >
                    <Text className="mb-4 px-4">You can upload your own graphic or logo or you can choose from our university, hospital logo & icon we have</Text>
                    <ShowAndHide title="upload your file"/>
                    <ShowAndHide title="select logo"/>
                  </View>
                </View>)}
              </View>


              <View className="px-4 py-5 w-full justify-center">
                  {/* <Text>Text Selected</Text> */}
                  <Button label="done" onPress={onClose}/>
              </View>
              <SafeAreaView/>
            </View>
  )
}

const ColorSelection = ({onChange}) => {
  const [activeColor, setActiveColor] = useState(null)

  colorValues = [
    {
      name: 'navy',
      value: 'Navy',
      colorCode: '#000080'
    },
    {
      name: 'black',
      value: 'Black',
      colorCode: '#000'
    },
    {
      name: 'orange',
      value: 'Orange',
      colorCode: '#FFA500',
    },
  ]

  const handlePress = (item) => {
    setActiveColor(item)
    onChange && onChange({type: 'color-selection', ...item})
  }


  return (
    <View className="mb-6 px-2">
        <Text className="pb-4">Color: {activeColor?.value}</Text>
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


const Selection = ({options, style, label, onChange, name}) => {
  const [isActive, setActive] = useState(false)
  const [activeSelection, setActiveSelection] = useState(null)



  const [fontsLoaded] = useFonts({
    'Robo-Mono': require('../../assets/fonts/RobotoMono-SemiBold.ttf'),
    'Kalnia': require('../../assets/fonts/Kalnia-SemiBold.ttf'),
    'Ubuntu': require('../../assets/fonts/Ubuntu-Bold.ttf'),
  });

  const handleSelection = (value) => {
    setActiveSelection(value)
    setActive(false)
    onChange && onChange({type: name, ...value})
  }

  useEffect(() => {},[fontsLoaded])

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
            <Pressable key={index.toString()} onPress={() => handleSelection(lang)} className="py-4 px-3 border-b border-gray-200 bg-white self-stretch items-center">
              <Text style={{ fontFamily: lang.fontFamily && lang.fontFamily}} className="text-[16px] text-black font-medium">{lang.value}</Text>
            </Pressable>
          ))}
        </View>
      </BottomModal>

    </View>
  )
}
    
    
    
    
    
    {/* <Button label={`${currentlyNotInStock ? 'Notify me': 'Add to cart' } `} size="md" onPress={currentlyNotInStock ? () => {} : handleAddCartBtn}  style={{marginVertical: 12, marginHorizontal: 20}}/> */}