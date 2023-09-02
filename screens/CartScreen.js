import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import {
    SafeAreaView,
    Text,
    View,
  } from "react-native";

  
  export default function CartScreen() {

    const navigation = useNavigation()
  
    return (
      <View className='flex-1 items-center justify-center'>
        <Text>CartScreen</Text>
      </View>
    );
  }
  