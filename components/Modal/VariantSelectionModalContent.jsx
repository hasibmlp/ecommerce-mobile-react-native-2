import { useContext, useEffect, useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import VariantHeader from "./VariantHeader";
import VariantOption from "./VariantOption";
import Button from "../buttons/Button";
import ModalSkeleton from "./ModalSkeleton";
import { PlusCircleIcon } from "react-native-heroicons/solid";
import MyModal from "./MyModal";
import { XMarkIcon } from "react-native-heroicons/outline";
import ImageSelectorButton from "../buttons/ImageSelectorButton";

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
        <View>
          <TouchableOpacity 
            onPress={() => setModalVisible(true)}
            className="flex-row items-center justify-center self-start mx-3 pb-4 pt-2"
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
              <Text className="text-[18px] text-black font-light px-5 mb-5">Please Choose a position:</Text>
            <View className="w-[85%] mx-auto flex-row justify-between">
              <ImageSelectorButton

                style={{ width: 130, height: 170}}
                imageUrl={"https://cdn.shopify.com/s/files/1/2610/4676/products/littmann-classic-iii-monitoring-stethoscope-5831.jpg?v=1687174127"}
                textContainer={(
                  <Text className="text-[14px] text-black font-light text-center">Doctor Side-Stright Tube</Text>
                )}
              />
              <ImageSelectorButton

                style={{ width: 130, height: 170}}
                imageUrl={"https://cdn.shopify.com/s/files/1/2610/4676/products/littmann-classic-iii-monitoring-stethoscope-5831.jpg?v=1687174127"}
                textContainer={(
                  <Text className="text-[14px] text-black font-light text-center">Doctor Side-Curve Tube</Text>
                )}
              />
            </View>
          </MyModal>

        </View>
      )
    }
    
    
    
    
    
    
    {/* <Button label={`${currentlyNotInStock ? 'Notify me': 'Add to cart' } `} size="md" onPress={currentlyNotInStock ? () => {} : handleAddCartBtn}  style={{marginVertical: 12, marginHorizontal: 20}}/> */}