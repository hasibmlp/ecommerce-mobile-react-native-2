import { SafeAreaView, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useLayoutEffect, useState } from "react";
import {} from "react-native-heroicons/outline";
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeHeader from "../components/HomeHeader";
import GenderSelector from "../components/GenderSelector";
import GreetingHeader from "../components/GreetingHeader";
import MainContentV2 from "../components/MainContentV2";
import { userVar } from "../App";
import { useReactiveVar } from "@apollo/client";

export default function HomeScreen() {
  const user = useReactiveVar(userVar)

  console.log("USER LOGGED IN HOME SCREEN : ", user?.email);
  const [toggleGenderMenuBar, setToggleGenderMenuBar] = useState(false);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const handleToggleMenu = (value) => {
    setToggleGenderMenuBar(value);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView scrollEnabled={!toggleGenderMenuBar} className="bg-gray-100">
        <GreetingHeader
          handleToggleMenu={handleToggleMenu}
          state={toggleGenderMenuBar}
        />
        <HomeHeader
          handleToggleMenu={handleToggleMenu}
          value={toggleGenderMenuBar}
        />
        <GenderSelector
          toggleGenderMenuBar={toggleGenderMenuBar}
          setToggleGenderMenuBar={setToggleGenderMenuBar}
        />

        <MainContentV2
          toggleGenderMenuBar={toggleGenderMenuBar}
          setState={setToggleGenderMenuBar}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
