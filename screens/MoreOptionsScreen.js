import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable, SafeAreaView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../components/buttons/Button';
import { useReactiveVar } from '@apollo/client';
import { accessTokenVar } from '../App';
import { useNavigation } from '@react-navigation/native';

const TAB_WIDTH = 100
const TABS = ['Home', 'Search', 'Profile', 'MoreOption'];

export default function MoreOptionScreen() {
  const accessToken = useReactiveVar(accessTokenVar)
  const navigation = useNavigation()

  console.log("ACCESS TOKEN AVAILABLE IN LOGIN PROFILE SCREEN", accessToken)

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('my-key')
      accessTokenVar(null)
    } catch(e) {
     console.log("log out failed!")
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white ">
      <View className="w-full items-center mt-40">
        <Text className="text-lg mb-3">hello</Text>
        {accessToken && (<Button style={{backgroundColor: 'red'}} onPress={handleLogout} label="log out" flex={false} />)}
        {accessToken === null && (<Button onPress={() => navigation.navigate("AuthScreen")} label="log in" flex={false} />)}
      </View>
    </SafeAreaView>
  );
}
