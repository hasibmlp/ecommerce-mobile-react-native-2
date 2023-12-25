import { useEffect, useState } from "react"
import { Image, Pressable, SafeAreaView, Text, View } from "react-native"
import { XMarkIcon } from "react-native-heroicons/outline"
import { useFonts } from 'expo-font';
import CustomSelection from "./CustomSelection";
import Button from "../buttons/Button";
import { useNavigation } from "@react-navigation/native";
import CustomSelectionOptions from "./CustomSelectionOptions";


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


const CustomSelectionInterface = ({totalCustom, setTotalCustom, onClose}) => {
    const [activeScreen, setActiveScreen] = useState(false)
    const [activeSelectionsForTextDisplay, setActiveSelectionsForTextDisplay] = useState({postion: '', selections: []})
    const [price, setPrice] = useState(0)
    const [image, setImage] = useState(null)
    const navigation = useNavigation()
    const [fontsLoaded] = useFonts({
        'Robo-Mono': require('../../assets/fonts/RobotoMono-SemiBold.ttf'),
        'Kalnia': require('../../assets/fonts/Kalnia-SemiBold.ttf'),
        'Ubuntu': require('../../assets/fonts/Ubuntu-Bold.ttf'),
      });
    const activeColorCode = activeSelectionsForTextDisplay.selections.find(i => i.type === 'color-selection')?.colorCode
    const activeFont = activeSelectionsForTextDisplay.selections.find(i => i.type === 'font-selection')?.fontFamily
    const initialCustomTextData = totalCustom?.selections.find(item => item.type === 'text-upload')?.data
    const handleTextStyle = (item) => {
        setActiveSelectionsForTextDisplay(prevState => {
        if(item.type === 'position') {
            const prevSelections = prevState.selections
            return {postion: item.postion, selections: prevSelections}
        }else {
            const prevSelection = [...prevState.selections]
            const itemIndex = prevSelection.findIndex(i => i.type === item.type)
            if(itemIndex > -1) {
            prevSelection.splice(itemIndex, 1)
            }
            prevSelection.push(item)
            return {selections: prevSelection}
        }
        })
    }

    const handleSelection = (type) => {
            setTotalCustom(prevState => {
                return {type: type, active: false,  selections: prevState.selections}
            })
            setActiveScreen(true)
    }
    const handleReset = () => {
        setTotalCustom({type: '', position: '', selections: []})
    }

    useEffect(() => {
        let newPrice = 0
        if(totalCustom.type === 'text-only')
            newPrice = 50
        else if(totalCustom.type === 'graphics-only')
            newPrice = 100
        else newPrice = 150

        setPrice(newPrice)
    },[totalCustom])

    useEffect(() => {},[fontsLoaded])

    if(!fontsLoaded) return null

    console.log(totalCustom)

    return (
        <View className="flex-1">
              {/* <CustomSelection
                  context="text-only"
                  activeSelectionsForTextDisplay={activeSelectionsForTextDisplay}
                  handleTextStyle={handleTextStyle}
                  initialCustomTextData={initialCustomTextData}
                  setTotalCustom={setTotalCustom}
                  totalCustom={totalCustom}
                  onClose={onClose}
                  price={price}
                  fontsLoaded={fontsLoaded}
                  activeColorCode={activeColorCode}
                  activeFont={activeFont}
                  logoCollection={logoCollection}
                  colorValues={colorValues}
                />
                <CustomSelection
                  context="graphics-only"
                  activeSelectionsForTextDisplay={activeSelectionsForTextDisplay}
                  handleTextStyle={handleTextStyle}
                  initialCustomTextData={initialCustomTextData}
                  setTotalCustom={setTotalCustom}
                  totalCustom={totalCustom}
                  onClose={onClose}
                  price={price}
                  fontsLoaded={fontsLoaded}
                  activeColorCode={activeColorCode}
                  activeFont={activeFont}
                  logoCollection={logoCollection}
                  colorValues={colorValues}
                /> */}

                {activeScreen && (<CustomSelection
                  context={totalCustom.type}
                  activeSelectionsForTextDisplay={activeSelectionsForTextDisplay}
                  handleTextStyle={handleTextStyle}
                  initialCustomTextData={initialCustomTextData}
                  setTotalCustom={setTotalCustom}
                  totalCustom={totalCustom}
                  onClose={onClose}
                  price={price}
                  fontsLoaded={fontsLoaded}
                  activeColorCode={activeColorCode}
                  activeFont={activeFont}
                  logoCollection={logoCollection}
                  colorValues={colorValues}
                  image={image}
                  setImage={setImage}
                />)}

                {!activeScreen && (<View>
                    <View className="w-full h-[200] bg-gray-200">
                        <Image className="w-full h-full" src="https://img.freepik.com/premium-vector/cute-pattern-small-colorful-flowers-dark-blue-background-seamless-floral-pattern_264287-269.jpg"/>
                    </View>

                    <View className="py-5">
                        <Text className="text-[16px] text-black font-medium px-5 uppercase pb-5">Embriodery</Text>
                        <Text className="text-[16px] text-black font-medium text-center pb-10">Choose an embroidery option</Text>
                        <View className="w-[90%] mx-auto h-full items-center">
                            <View className="ml-auto mb-3">
                                <Button onPress={handleReset} label="reset" type="action"/>
                            </View>
                            <View className="w-full">
                                <Button onPress={() => handleSelection('text-only')} label="Text Only" type="secondary" active={totalCustom.selections.length > 0 ? (totalCustom.type === 'text-only' && totalCustom.active === true) : true} colors={['green', 'lightgray']} textColors={['#32cd32', '#d3d3d3']}/>
                                <Button onPress={() => handleSelection('graphics-only')} label="Graphics Only" type="secondary" style={{marginTop: 24}} active={totalCustom.selections.length > 0 ? (totalCustom.type === 'graphics-only' && totalCustom.active === true) : true} colors={['green', 'lightgray']} textColors={['#32cd32', '#d3d3d3']}/>
                                <Button onPress={() => handleSelection('text-with-grahpics')} label="Text & Graphics" type="secondary" style={{marginTop: 24}} active={totalCustom.selections.length > 0 ? (totalCustom.type === 'text-with-graphics' && totalCustom.active === true) : true} colors={['green', 'lightgray']} textColors={['#32cd32', '#d3d3d3']}/>
                            </View>

                        </View>
                    </View>

                </View>)}
                
        </View>
    )
}

export default CustomSelectionInterface