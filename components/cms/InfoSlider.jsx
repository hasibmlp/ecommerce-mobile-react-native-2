
import { useLayoutEffect, useState, useRef, useEffect } from "react";
import { SafeAreaView, Text, View, Dimensions, FlatList } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import {
    BellIcon,
    HeartIcon,
    TruckIcon
  } from "react-native-heroicons/outline";

import CardSlider from "../CardSlider";

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

export default function InfoSlider({content}) {

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
            <View style={{width: ITEM_WIDTH, height: content.data.height}} className='flex-row items-center justify-center bg-black mx-[15px] mb-4 rounded-[10px] '>
                <View className="absolute left-5"><MaterialCommunityIcons name={item.iconName || 'square-rounded-outline'} size={24} color="white"/></View>
                <Text className='text-[14px] font-normal text-white uppercase'>{item.title}</Text>
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
    ref={flatListRef}
    data={content.data.banner}
    style={{flexGrow: 0}}
    horizontal
    pagingEnabled
    showsHorizontalScrollIndicator={false}
    keyExtractor={(_ , index) => index.toString()}
    getItemLayout={getItemLayout}
    renderItem={renderItem}
    onScroll={handleScroll}
    key={(_, index) => index.toString()}
    />
  );
}
