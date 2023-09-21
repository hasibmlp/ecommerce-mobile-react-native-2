import {
  SafeAreaView,
  Text,
  View,
  Dimensions,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {} from "react-native-heroicons/outline";

import HomeHeader from "../components/HomeHeader";
import GenderSelector from "../components/GenderSelector";
import MainContent from "../components/MainContent";
import GreetingHeader from "../components/GreetingHeader";
import { useQuery } from "@apollo/client";
import {
  GET_HOMESCREEN_DATA,
} from "../graphql/queries";

export default function HomeScreen() {
  const [toggleGenderMenuBar, setToggleGenderMenuBar] = useState(false);

  const navigation = useNavigation();
  dispatch = useDispatch();

  const gender = useSelector((state) => state.gender.current);

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

        <MainContent
          toggleGenderMenuBar={toggleGenderMenuBar}
          setState={setToggleGenderMenuBar}
          homeScreenData={[]}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
