
import { useLayoutEffect, useState, useRef, useEffect } from "react";
import { SafeAreaView, Text, View, Dimensions, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
    BellIcon,
    HeartIcon,
    TruckIcon
  } from "react-native-heroicons/outline";

import CardSlider from "../components/CardSlider";

const informations = [
    {
        iconName: 'TruckIcon',
        text: '2 hour delevery in dubai'
    },
    {
        iconName: 'TruckIcon',
        text: '2 hour delevery in dubai'
    },
    {
        iconName: 'TruckIcon',
        text: '2 hour delevery in dubai'
    }
]

const SCREEN_WIDTH = Dimensions.get('screen').width
const ITEM_WIDTH = SCREEN_WIDTH - 30

export default function InfoSlider() {

    const [ activeIndex, setActiveIndex ] = useState(0)
    const flatListRef = useRef()
    
    const navigation = useNavigation()
    
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
    })

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex(prevIndex => (prevIndex + 1) % informations.length);
        }, 3000);
    
        return () => {
          clearInterval(interval);
        };
      }, []);

      useEffect(() => {
        flatListRef.current.scrollToIndex({
            animation: true,
            index: activeIndex,
        })
    }, [activeIndex]);
    
    function renderItem ({item, index}) {
        return(
            <View style={{width: ITEM_WIDTH}} className='items-center justify-center bg-black h-[42px] mx-[15px] rounded-[10px] '>
                <TruckIcon style={{position: 'absolute', left: 15,}} size={20} color='white' strokeWidth={1.5} />
                <Text className='text-[14px] font-normal text-white uppercase'>{item.text}</Text>
            </View>
        )
    }

    function handleScroll(event) {
        const viewSize = event.nativeEvent.layoutMeasurement.width;
        const containerOffset = event.nativeEvent.contentOffset.x
        const selectedIndex = Math.floor(containerOffset / viewSize)
    }
    const  getItemLayout = (data, index) => ({
        length: SCREEN_WIDTH,
        offset: SCREEN_WIDTH * index,
        index: index,
    })

  return (
    <FlatList
    style={{flexGrow: 0, paddingTop: 5}}
    horizontal
    pagingEnabled
    showsHorizontalScrollIndicator={false}
    data={informations}
    ref={flatListRef}
    keyExtractor={item => item.id}
    getItemLayout={getItemLayout}
    renderItem={renderItem}
    onScroll={handleScroll}
    key={(_, index) => index.toString()}
    />
  );
}
