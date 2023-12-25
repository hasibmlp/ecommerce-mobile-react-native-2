import { FlatList, Image, Pressable, SafeAreaView, Text, View } from "react-native"
import { useState } from "react"
import { XMarkIcon } from "react-native-heroicons/outline"
import * as DocumentPicker from 'expo-document-picker';

import LoadingFullScreen from "../Sidebar/LoadingFullScreen"
import UploadFile from "./UploadFile"
import MyModal from "../Modal/MyModal"

const GraphicSelection = ({logoCollection, handleChange, value}) => {
    const initialValue = value
    const [activeTab, setActiveTab] = useState(logoCollection[0])
    const [isModalVisible, setModalVisible] = useState(false)
    const [loading, setLoading] = useState(false)
  
  
    const handleUploadFile = async (preSelectedImage) => {
      try {
        let result = preSelectedImage
        if (preSelectedImage?.assets) {
          result = preSelectedImage;
        } else {
          result = await DocumentPicker.getDocumentAsync();
        }
  
        const url = "https://api.cloudinary.com/v1_1/dujrllgbs/image/upload"
  
        console.log(result.canceled)
  
        if(!result.canceled) {
          setLoading(true)
          const data = new FormData()
          data.append('file', {
            name: result.assets[0].name,
            type: result.assets[0].mimeType,
            uri: Platform.OS === 'ios' ? 
                  result.assets[0].uri.replace('file://', '')
                  : result.assets[0].uri,
          })
          data.append("upload_preset", "uq0ipq46");
    
          const res = await fetch(url, {
            method: "POST",
            body: data,
          })
    
          const cloudData = await res.json()

          if(cloudData) {

            handleChange(cloudData.url)
          }else {
            handleChange('')
          }

        }
  
  
      } catch (error) {
        console.error('Error picking document:', error);
      }
      finally{
        setLoading(false)
      }
    };
  
  
  
    const handleLogoPress = (item) => {
      handleUploadFile({assets: [{mimeType: "image/jpeg", name: "pexels-pixabay-60597.jpg", size: 322014, uri: item.url}], canceled: false})
      setModalVisible(false)
    }
  
    const handleImageClose = () => {
      handleChange('')
    }
  
    return (
      <View className="w-full">
  
        {loading && (<LoadingFullScreen/>)}
  
        {!initialValue && (<UploadFile selectedImage={initialValue} type="manual" handleUploadFile={handleUploadFile}/> )}
  
        <Text className="mb-4">OR</Text>
  
        {!initialValue && (<UploadFile selectedImage={initialValue} onPress={() => setModalVisible(true)} handleUploadFile={handleUploadFile}/>)}
  
  
        <MyModal visible={isModalVisible} slide="toUp" >
          <View className="flex-1">
            <View className="h-10 flex-row items-center justify-end px-3">
                <Pressable className="p-1" onPress={() => setModalVisible(false)}>
                  <XMarkIcon size={24} color="black"/>
                </Pressable>
            </View>
            <View className="flex-1 items-center">
  
              <View className="w-full flex-row justify-between px-5 border-b border-gray-200 shadow-md">
  
                {logoCollection.map((item, index) => (
                  <Pressable key={index.toString()} onPress={() => setActiveTab(item)} className="flex-1 items-center py-4">
                    <Text className={`text-[14px] ${item.id === activeTab.id ? 'text-[#89c157]' : 'text-black'} font-normal`}>{item.title}</Text>
                  </Pressable>
                ))}
  
              </View>
  
                  <FlatList
                  data={activeTab.images}
                  keyExtractor={(_, index) => index.toString()}
                  numColumns={2}
                  contentContainerStyle={{paddingVertical: 4, paddingHorizontal: 4}}
                  renderItem={({item}) => (
                    <View className="p-1 w-[50%]">
                      <Pressable onPress={() => handleLogoPress(item)} className="w-full h-[180] bg-gray-200">
                        <Image className="w-full h-full" src={item.url}/>
                      </Pressable>
                    </View>
                  )}
                  />
  
            </View>
            <SafeAreaView/>
          </View>
        </MyModal>
  
        {initialValue && (<View className="w-full border border-dashed items-center py-10 mt-10 mb-6">
          <View className="flex-row">
              <View className="w-40 h-40 bg-gray-100">
                {/* <Image className="w-full h-full" source={selectedImage.url}/> */}
                <Image className="w-full h-full" src={initialValue}/>
              </View>
              <Pressable onPress={handleImageClose} className="absolute right-[-30]">
                <XMarkIcon size={24} color="black" />
              </Pressable>
  
          </View>
        </View>)}
  
        <Text className="text-[13px] text-black font-light text-center mt-2 ">We will set to the width we view as most suitable. However, in case you would prefer a specific width kindley mention it in uploaded graphic file</Text>
  
        {/* <ImageSelection title="Select Position" style={{marginTop: 24}} onChange={() => {}}/> */}
  
  
      </View>
    )
  }

export default GraphicSelection