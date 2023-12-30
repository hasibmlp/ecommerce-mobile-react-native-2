import { useContext, useEffect, useState } from "react";
import { FlatList, Image, Platform, Pressable, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

import VariantOption from "./VariantOption";
import Button from "../buttons/Button";
import ModalSkeleton from "./ModalSkeleton";
import { PlusCircleIcon } from "react-native-heroicons/solid";
import MyModal from "./MyModal";
import { CheckCircleIcon, XMarkIcon } from "react-native-heroicons/outline";
import { useFonts } from 'expo-font';

import TextWithContent from "../customization/TextWithContent";
import TextOnly from "../customization/CustomSelection";
import CustomSelection from "../customization/CustomSelection";
import CustomSelectionInterface from "../customization/CustomSelectionInterface";



export default function VariantSelectionModalContent({handleClose, context}) {
  const {options, handleAddCartBtn, currentlyNotInStock, selectedVariant, activeOptions, customProductId, setCustomProductId} = useContext(context)
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

          <CustomizationContainer
            customProductId={customProductId}
            setCustomProductId={setCustomProductId}
          />

          <Button 
            label={label} 
            size="md" active={selectedVariant.id ? true : false}
            onPress={currentlyNotInStock ? () => {} : () => handleAddCartBtn(onClose=handleClose)} 
            style={{marginVertical: 12, marginHorizontal: 12}}/>
        </View>
      </View>
      )
    }
    
    
    
    function CustomizationContainer({customProductId, setCustomProductId}) {
      const [isModalVisible, setModalVisible] = useState(false)
      const [totalCustom, setTotalCustom] = useState({type: '', active: false, selections: []})
      console.log("TOTAL CUSTOM ARRAY: ", customProductId)
      return(
        <View className="pb-4 pt-2">
          <Text className="text-[12px] font-normal text-black uppercase mx-4 pb-3">
            Customization:
          </Text>
          <TouchableOpacity 
            onPress={() => setModalVisible(true)}
            className="flex-row items-center justify-center self-start mx-3"
          >
            {customProductId && (<CheckCircleIcon size={18} color='#000'/>)}
            {!customProductId && (<PlusCircleIcon size={18} color='#89c157' />)}
            <Text className={`text-[13px] ${customProductId ? 'text-black' : 'text-[#89c157]'} font-normal uppercase ml-1`}>{
              customProductId ? 'Customization Added' : 'Add Customization'
            }</Text>
          </TouchableOpacity>


          <MyModal visible={isModalVisible} slide="toUp">
            <EmbroiderySelection 
              onClose={() => setModalVisible(false)}
              totalCustom={totalCustom}
              setTotalCustom={setTotalCustom}
              customProductId={customProductId}
              setCustomProductId={setCustomProductId}
            />
          </MyModal>

        </View>
      )
    }
    

const EmbroiderySelection = ({onClose, totalCustom, setTotalCustom, customProductId, setCustomProductId}) => {
  return (
    <View className="flex-1">
              <View className="h-10 flex-row items-center justify-end px-3">
                  <Pressable className="p-1" onPress={onClose}>
                    <XMarkIcon size={24} color="black"/>
                  </Pressable>
              </View>

              <View className="flex-1 overflow-hidden">

                <CustomSelectionInterface 
                totalCustom={totalCustom}
                setTotalCustom={setTotalCustom}
                onClose={onClose}
                customProductId={customProductId}
                setCustomProductId={setCustomProductId}
                />

                {/* <View>
                  <Text className="text-[20px] text-[#89c157] font-medium uppercase mx-auto mb-5 tracking-[2px]">Embroidery</Text>
                  <View className="border-y border-gray-200 flex-row justify-between px-3">
                    <TabHeader 
                      title="Text" 
                      onPress={() => setActiveTab('tab-a')}
                      selected={totalCustom.selections.find(item => (item.type === 'text-upload')?.data?.firstLine?.length > 0 || totalCustom.selections.find(item => item.type === 'text-upload')?.data?.secondLine?.length > 0)}
                      active={activeTab === 'tab-a'}
                    />

                    <TabHeader 
                      title="Logo & Graphics" 
                      onPress={() => setActiveTab('tab-b')}
                      selected={totalCustom.selections.find(item => (item.type === 'text-upload')?.data?.firstLine?.length > 0 || totalCustom.selections.find(item => item.type === 'text-upload')?.data?.secondLine?.length > 0)}
                      active={activeTab === 'tab-b'}
                    />

                  </View>
                </View> */}

                

              </View>


              <SafeAreaView/>
    </View>
  )
}
    
    
    
    {/* <Button label={`${currentlyNotInStock ? 'Notify me': 'Add to cart' } `} size="md" onPress={currentlyNotInStock ? () => {} : handleAddCartBtn}  style={{marginVertical: 12, marginHorizontal: 20}}/> */}
