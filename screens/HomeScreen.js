import {
  SafeAreaView,
  Text,
  View,
  Dimensions,
  ScrollView,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BellIcon,
  HeartIcon,
  TruckIcon,
  ChevronDownIcon,
} from "react-native-heroicons/outline";

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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView className="bg-gray-100">
        <HomeHeader />
        <View>
          <Pressable onPress={() => dispatch(changeGender('men')) }>
            <Text className="text-2xl">Men</Text>
          </Pressable>
          <Pressable onPress={() => dispatch(changeGender('women')) }>
            <Text className="text-2xl">Women</Text>
          </Pressable>
          <Text className="text-2xl">Current Gender: {gender} </Text>
        </View>
        <ImageBanner />
        <DiscoverBanner />
        <MostWantedBanner />
        <CardSlider />
        <CategoryImageBanner />
        <DiscoverBoutique />
        <ContentBanner />
        <GenderBanner gender={"Men"} />
        <GenderBanner gender={"Kids"} />
        {/* <CardSlider /> */}
      </ScrollView>
    </SafeAreaView>
  );
}
