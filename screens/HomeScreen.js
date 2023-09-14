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
import {
  BellIcon,
  HeartIcon,
  TruckIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from "react-native-heroicons/outline";

import { Circle } from "react-native-svg";

import CardSlider from "../components/CardSlider";
import InfoSlider from "../components/InfoSlider";
import HomeHeader from "../components/HomeHeader";
import ImageBanner from "../components/ImageBanner";
import DiscoverBanner from "../components/DiscoverBanner";
import MostWantedBanner from "../components/MostWantedBanner";
import CategoryImageBanner from "../components/CategoryImageBanner";
import GenderBanner from "../components/GenderBanner";
import DiscoverBoutique from "../components/DiscoverBoutique";
import ContentBanner from "../components/ContentBanner";
import { changeGender } from "../redux/features/gender/genderSlice";
import GenderSelector from "../components/GenderSelector";
import HomeHeaderMain from "../components/HomeHeaderMain";
import MainContent from "../components/MainContent";
import GreetingHeader from "../components/GreetingHeader";

const SCREEN_WIDTH = Dimensions.get("screen").width;

export default function HomeScreen() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const gender = useSelector((state) => state.gender.current);
  dispatch = useDispatch();

  const [toggleGenderMenuBar, setToggleGenderMenuBar] = useState(false);
  const handleToggleMenu = (value) => {
    setToggleGenderMenuBar(value);
  };

  const currentGender = useSelector(state => state.gender.current)

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView scrollEnabled={!toggleGenderMenuBar} className="bg-gray-100">

      <GreetingHeader handleToggleMenu={handleToggleMenu} state={toggleGenderMenuBar} />

          <HomeHeader
            handleToggleMenu={handleToggleMenu}
            value={toggleGenderMenuBar}
          />
          <GenderSelector
            toggleGenderMenuBar={toggleGenderMenuBar}
            setToggleGenderMenuBar={setToggleGenderMenuBar}
          />

        <MainContent toggleGenderMenuBar={toggleGenderMenuBar} setState={setToggleGenderMenuBar} />
      </ScrollView>
    </SafeAreaView>
  );
}
