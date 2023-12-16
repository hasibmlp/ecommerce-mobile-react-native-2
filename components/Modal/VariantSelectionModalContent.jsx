import { useContext, useEffect, useState } from "react";
import { Pressable, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import VariantHeader from "./VariantHeader";
import VariantOption from "./VariantOption";
import Button from "../buttons/Button";
import ModalSkeleton from "./ModalSkeleton";
import { PlusCircleIcon } from "react-native-heroicons/solid";
import MyModal from "./MyModal";
import { XMarkIcon } from "react-native-heroicons/outline";
import ImageSelectorButton from "../buttons/ImageSelectorButton";
import ColorSwatchImage from "../buttons/ColorSwatchImage";
import ShowAndHide from "../ShowAndHide";

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
      const [activeTab, setActiveTab] = useState('tab-a')
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
            <View className="h-10 flex-row items-center justify-end px-3">
                <Pressable className="p-1 " onPress={() => setModalVisible(false)}>
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
                  <Text className='text-[14px] text-black font-normal mb-1'>Language</Text>
                  <TextInput className="bg-gray-100 p-2 rounded-[5px]"/>
                </View>
                <View className="mb-6">
                  <Text className='text-[14px] text-black font-normal mb-1'>Font</Text>
                  <TextInput className="bg-gray-100 p-2 rounded-[5px]"/>
                </View>
                <View className="mb-6 ">
                  <Text className="pb-4">Color: Purple</Text>
                  <View className="flex-row flex-wrap gap-4">
                    <ColorSwatchImage size="lg"/>
                    <ColorSwatchImage size="lg"/>
                    <ColorSwatchImage size="lg"/>
                    <ColorSwatchImage size="lg"/>
                    <ColorSwatchImage size="lg"/>
                    <ColorSwatchImage size="lg"/>
                    <ColorSwatchImage size="lg"/>
                    <ColorSwatchImage size="lg"/>
                    <ColorSwatchImage size="lg"/>
                    <ColorSwatchImage size="lg"/>
                    <ColorSwatchImage size="lg"/>
                    <ColorSwatchImage size="lg"/>
                    <ColorSwatchImage size="lg"/>
                    <ColorSwatchImage size="lg"/>
                    <ColorSwatchImage size="lg"/>
                  </View>
                </View>
                <View className="mb-6">
                  <Text className='text-[14px] text-black font-normal mb-1'>First line</Text>
                  <TextInput className="bg-gray-100 p-2 rounded-[5px]"/>
                </View>
                <View className="mb-6">
                  <Text className='text-[14px] text-black font-normal mb-1'>Second Line</Text>
                  <TextInput className="bg-gray-100 p-2 rounded-[5px]"/>
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
                <Button label="done" onPress={() => setModalVisible(false)}/>
            </View>
            <SafeAreaView/>
          </MyModal>

        </View>
      )
    }
    
    
    
    
    
    
    {/* <Button label={`${currentlyNotInStock ? 'Notify me': 'Add to cart' } `} size="md" onPress={currentlyNotInStock ? () => {} : handleAddCartBtn}  style={{marginVertical: 12, marginHorizontal: 20}}/> */}