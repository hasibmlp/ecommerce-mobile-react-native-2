import { View, Image, Text } from "react-native";
import DiscoverBoutiqueItem from "./DiscoverBoutiqueItem";

export default function DiscoverBoutique() {
  return (
    <View className=" justify-endmb-3">
      <Text className='text-center text-[24px] text-black bg-white font-normal py-4 mb-3'>Discover our Boutiques</Text>
      <DiscoverBoutiqueItem title={"Beauty Lounge"} image={require("../assets/boutique1.jpeg")} />
      <DiscoverBoutiqueItem title={"Jewellery Boutique"} image={require("../assets/boutique2.webp")} />
      <DiscoverBoutiqueItem title={"Ounass Occasions"} image={require("../assets/boutique3.jpeg")} />
    </View>
  );
}
