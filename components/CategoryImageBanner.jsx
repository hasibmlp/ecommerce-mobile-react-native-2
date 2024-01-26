import { View, Image, Text } from "react-native";
import { FONT_FAMILY } from "../theme";

export default function CategoryImageBanner({ categories }) {
  return (
    <View className="w-full flex-row gap-1 bg-white mb-3 h-[250px]">
      <View className="w-[33%] h-full  justify-end">
        <Image
          className="w-full h-full absolute top-0 left-0"
          src={categories[0].url}
        />
        <View className="w-full h-[150px] items-center justify-end">
          <Image
            className="absolute w-full h-full "
            source={require("../assets/transBlack.png")}
          />
          <Text style={FONT_FAMILY.primary} className="text-[16px] font-normal text-white pb-[20px] uppercase">
            {categories[0].title}
          </Text>
        </View>
      </View>
      <View className="w-[33%] h-full  justify-end">
        <Image
          className="w-full h-full absolute top-0 left-0"
          src={categories[0].url}
        />
        <View className="w-full h-[150px] items-center justify-end">
          <Image
            className="absolute w-full h-full "
            source={require("../assets/transBlack.png")}
          />
          <Text style={FONT_FAMILY.primary} className="text-[16px] font-normal text-white pb-[20px] uppercase">
            {categories[0].title}
          </Text>
        </View>
      </View>
      <View className="w-[33%] h-full  justify-end">
        <Image
          className="w-full h-full absolute top-0 left-0"
          src={categories[0].url}
        />
        <View className="w-full h-[150px] items-center justify-end">
          <Image
            className="absolute w-full h-full "
            source={require("../assets/transBlack.png")}
          />
          <Text style={FONT_FAMILY.primary} className="text-[16px] font-normal text-white pb-[20px] uppercase">
            {categories[0].title}
          </Text>
        </View>
      </View>

      {/* <CategoryImageBannerItem title={"Bags"} image={require("../assets/accessories.jpg")} />
        <CategoryImageBannerItem title={"Kids"} image={require("../assets/girl.jpg")} />
        <CategoryImageBannerItem title={"Girl"} image={require("../assets/boys.jpg")} /> */}
    </View>
  );
}
