import { Pressable, Text, View } from "react-native"
import Button from "../buttons/Button"
import { PlusIcon, XMarkIcon } from "react-native-heroicons/outline"
import { useState } from "react"

const UploadFile = ({selectedImage, type="preset", onPress, handleUploadFile}) => {
    const [isUploaded, setUploaded] = useState(false)
    const [isModalVisible, setModalVisible] = useState(true)
  
  
    return (
      <View className=" w-full border border-dashed justify-between py-6 px-3 mb-4">
        <View className="items-center">
  
          
          {type === 'preset' && (<View className="pb-5">
            <Button label="Presets" flex={false} size="sm" onPress={onPress}/>
          </View>)}
  
          {type === 'manual' && (<View className="items-center">
              <Pressable onPress={() => handleUploadFile()} className="w-20 h-20 bg-gray-200 items-center justify-center">
              <PlusIcon size={38} color="gray" />
            </Pressable>
            <Text className="text-[13px] text-gray-500 font-light text-center mt-2">JPED, PNG, SVG & Vectors are accepted</Text>
          </View>)}
  
  
          {selectedImage && (<View className="flex-row">
            <View className="w-40 h-40 bg-gray-100">
              {/* <Image/> */}
            </View>
            <Pressable className="absolute right-[-30]">
              <XMarkIcon size={24} color="black" />
            </Pressable>
  
          </View>)}
        </View>
  
      </View>
    )
  }


export default UploadFile