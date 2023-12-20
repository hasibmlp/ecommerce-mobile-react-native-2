import { useContext, useEffect, useState } from "react";
import { FlatList, Image, Platform, Pressable, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import VariantHeader from "./VariantHeader";
import VariantOption from "./VariantOption";
import Button from "../buttons/Button";
import ModalSkeleton from "./ModalSkeleton";
import { PlusCircleIcon } from "react-native-heroicons/solid";
import MyModal from "./MyModal";
import { CheckCircleIcon, ChevronDownIcon, PlusIcon, XMarkIcon } from "react-native-heroicons/outline";
import { useFonts } from 'expo-font';
import * as DocumentPicker from 'expo-document-picker';
import {Cloudinary} from "@cloudinary/url-gen";


import ColorSwatchImage from "../buttons/ColorSwatchImage";
import ShowAndHide from "../ShowAndHide";
import BottomModal from "./BottomModal";
import LoadingFullScreen from "../Sidebar/LoadingFullScreen";

const logoCollection = [
  {
    id: '0',
    title: 'hospital',
    images : [
      {
        name: '',
        url: "https://cdn.shopify.com/s/files/1/2610/4676/files/Palestinesurgicalhat3.jpg?v=1702905282",
      },
      {
        name: '',
        url: "https://cdn.shopify.com/s/files/1/2610/4676/files/Palestinesurgicalhat3.jpg?v=1702905282",
      },
      {
        name: '',
        url: "https://cdn.shopify.com/s/files/1/2610/4676/files/Palestinesurgicalhat3.jpg?v=1702905282",
      },
      {
        name: '',
        url: "https://cdn.shopify.com/s/files/1/2610/4676/files/Palestinesurgicalhat3.jpg?v=1702905282",
      },
      {
        name: '',
        url: "https://cdn.shopify.com/s/files/1/2610/4676/files/Palestinesurgicalhat3.jpg?v=1702905282",
      },
      {
        name: '',
        url: "https://cdn.shopify.com/s/files/1/2610/4676/files/Palestinesurgicalhat3.jpg?v=1702905282",
      },
      {
        name: '',
        url: "https://cdn.shopify.com/s/files/1/2610/4676/files/Palestinesurgicalhat3.jpg?v=1702905282",
      },
      {
        name: '',
        url: "https://cdn.shopify.com/s/files/1/2610/4676/files/Palestinesurgicalhat3.jpg?v=1702905282",
      },
    ]
  }, 
  {
    id: '1',
    title: 'university',
    images : [
      {
        name: '',
        url: "https://cdn.shopify.com/s/files/1/2610/4676/files/MAZ-12097.jpg?v=1702743914",
      },
      {
        name: '',
        url: "https://cdn.shopify.com/s/files/1/2610/4676/files/MAZ-12097.jpg?v=1702743914",
      },
      {
        name: '',
        url: "https://cdn.shopify.com/s/files/1/2610/4676/files/MAZ-12097.jpg?v=1702743914",
      },
      {
        name: '',
        url: "https://cdn.shopify.com/s/files/1/2610/4676/files/MAZ-12097.jpg?v=1702743914",
      },
      {
        name: '',
        url: "https://cdn.shopify.com/s/files/1/2610/4676/files/MAZ-12097.jpg?v=1702743914",
      },
      {
        name: '',
        url: "https://cdn.shopify.com/s/files/1/2610/4676/files/MAZ-12097.jpg?v=1702743914",
      },
      {
        name: '',
        url: "https://cdn.shopify.com/s/files/1/2610/4676/files/MAZ-12097.jpg?v=1702743914",
      },
      {
        name: '',
        url: "https://cdn.shopify.com/s/files/1/2610/4676/files/MAZ-12097.jpg?v=1702743914",
      },
    ]
  }, 
  {
    id: '2',
    title: 'icons',
    images : [
      {
        name: '',
        url: "https://cdn.shopify.com/s/files/1/2610/4676/files/yemenStethoscopeflagpin1.jpg?v=1702674227",
      },
      {
        name: '',
        url: "https://cdn.shopify.com/s/files/1/2610/4676/files/yemenStethoscopeflagpin1.jpg?v=1702674227",
      },
      {
        name: '',
        url: "https://cdn.shopify.com/s/files/1/2610/4676/files/yemenStethoscopeflagpin1.jpg?v=1702674227",
      },
      {
        name: '',
        url: "https://cdn.shopify.com/s/files/1/2610/4676/files/yemenStethoscopeflagpin1.jpg?v=1702674227",
      },
      {
        name: '',
        url: "https://cdn.shopify.com/s/files/1/2610/4676/files/yemenStethoscopeflagpin1.jpg?v=1702674227",
      },
      {
        name: '',
        url: "https://cdn.shopify.com/s/files/1/2610/4676/files/yemenStethoscopeflagpin1.jpg?v=1702674227",
      },
      {
        name: '',
        url: "https://cdn.shopify.com/s/files/1/2610/4676/files/yemenStethoscopeflagpin1.jpg?v=1702674227",
      },
      {
        name: '',
        url: "https://cdn.shopify.com/s/files/1/2610/4676/files/yemenStethoscopeflagpin1.jpg?v=1702674227",
      },
    ]
  }, 
]

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

              <View className="flex-1 overflow-hidden">
                <View>
                  <Text className="text-[20px] text-[#89c157] font-medium uppercase mx-auto mb-5 tracking-[2px]">Embroidery</Text>
                  <View className="border-y border-gray-200 flex-row justify-between px-3">
                    <Pressable className="flex-1 py-3 items-center border-r border-gray-200 flex-row justify-center" onPress={() => setActiveTab('tab-a')}>
                      <Text className="text-[16px] text-black font-normal">Text</Text>
                      <View className="absolute right-5">
                        <CheckCircleIcon size={24} color={'#89c157'} />
                      </View>
                    </Pressable>
                    <Pressable className="flex-1 py-3 items-center" onPress={() => setActiveTab('tab-b')}>
                      <Text className="text-[16px] text-black font-light">Logo & Graphics</Text>
                    </Pressable>
                  </View>
                </View>

                {activeTab === 'tab-a' && (
                <ScrollView className="pt-8 px-4">
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


                </ScrollView>)}



                {activeTab === 'tab-b' && (
                <View className="items-center py-5">
                    <Text className="mb-4 px-4">You can upload your own graphic or logo or you can choose from our university, hospital logo & icon we have</Text>

                      <GraphicSelectin/>

                </View>)}
              </View>


              <View className="px-4 py-5 w-full justify-center ">
                <View className="flex-row justify-between py-4 mb-2 ">
                  <Text className="text-[16px] text-black font-normal">Total Customization Price</Text>
                  <Text className="text-[17px] text-[#89c157] font-medium">123 AED</Text>
                </View>
                  <Button label="done" onPress={onClose}/>
              </View>


              <SafeAreaView/>
            </View>
  )
}

const GraphicSelectin = () => {
  const [activeTab, setActiveTab] = useState(logoCollection[0])
  const [selectedImage, setSelectedImage] = useState(null)
  const [isModalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)



  const images = [
    {
      name: '',
      url: '123.jpg',
    },
    {
      name: '',
      url: '123.jpg',
    },
    {
      name: '',
      url: '123.jpg',
    },
    {
      name: '',
      url: '123.jpg',
    },
    {
      name: '',
      url: '123.jpg',
    },
    {
      name: '',
      url: '123.jpg',
    },
    {
      name: '',
      url: '123.jpg',
    },
    {
      name: '',
      url: '123.jpg',
    },
    {
      name: '',
      url: '123.jpg',
    },
    {
      name: '',
      url: '123.jpg',
    },
    {
      name: '',
      url: '123.jpg',
    },
    {
      name: '',
      url: '123.jpg',
    },
    {
      name: '',
      url: '123.jpg',
    },
    {
      name: '',
      url: '123.jpg',
    },
    {
      name: '',
      url: '123.jpg',
    },
    {
      name: '',
      url: '123.jpg',
    },
    {
      name: '',
      url: '123.jpg',
    },
  ]


  const handleUploadFile = async (preSelectedImage) => {
    try {
      let result = preSelectedImage
      if (preSelectedImage?.assets) {
        result = preSelectedImage;
        console.log("yyyyyesssssss")
      } else {
        result = await DocumentPicker.getDocumentAsync();
        console.log("nnnnooooooo")
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
        setSelectedImage(cloudData)
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


  return (
    <View className="w-[85%] items-center">

      {loading && (<LoadingFullScreen/>)}

      {!selectedImage && (<UploadFile selectedImage={selectedImage} type="manual" handleUploadFile={handleUploadFile} setSelectedImage={setSelectedImage}/> )}

      <Text className="mb-4">OR</Text>

      {!selectedImage && (<UploadFile selectedImage={selectedImage} onPress={() => setModalVisible(true)} handleUploadFile={handleUploadFile} setSelectedImage={setSelectedImage}/>)}


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

      {selectedImage && (<View className="w-full border border-dashed items-center py-10 mt-10 mb-6">
        <View className="flex-row">
            <View className="w-40 h-40 bg-gray-100">
              {/* <Image className="w-full h-full" source={selectedImage.url}/> */}
              <Image className="w-full h-full" src={selectedImage.url}/>
            </View>
            <Pressable onPress={() => setSelectedImage(null)} className="absolute right-[-30]">
              <XMarkIcon size={24} color="black" />
            </Pressable>

        </View>
      </View>)}

      <Text className="text-[13px] text-black font-light text-center mt-2 ">We will set to the width we view as most suitable. However, in case you would prefer a specific width kindley mention it in uploaded graphic file</Text>


    </View>
  )
}

const UploadFile = ({selectedImage, type="preset", onPress, setSelectedImage, handleUploadFile}) => {
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

const ColorSelection = ({onChange}) => {
  const [activeColor, setActiveColor] = useState(null)

  const colorValues = [
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
