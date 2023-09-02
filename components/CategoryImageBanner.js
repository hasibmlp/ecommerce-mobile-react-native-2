import { View, Image, Text } from "react-native";
import CategoryImageBannerItem from "./CategoryImageBannerItem";

export default function CategoryImageBanner() {
  return (
      <View className="w-full flex-row gap-1 bg-white mb-3 h-[250px]">

      <View className='w-[33%] h-full  justify-end'>
          <Image
            className="w-full h-full absolute top-0 left-0"
            source={require("../assets/accessories.jpg")}
          />
          <View className='w-full h-[150px] items-center justify-end'>
            <Image className='absolute w-full h-full ' source={require("../assets/transBlack.png")} />
            <Text className='text-[16px] font-medium text-white pb-[20px] uppercase'>men</Text>
          </View>
        </View>
      <View className='w-[33%] h-full  justify-end'>
          <Image
            className="w-full h-full absolute top-0 left-0"
            source={require("../assets/accessories.jpg")}
          />
          <View className='w-full h-[150px] items-center justify-end'>
            <Image className='absolute w-full h-full ' source={require("../assets/transBlack.png")} />
            <Text className='text-[16px] font-medium text-white pb-[20px] uppercase'>men</Text>
          </View>
        </View>
      <View className='w-[33%] h-full  justify-end'>
          <Image
            className="w-full h-full absolute top-0 left-0"
            source={require("../assets/accessories.jpg")}
          />
          <View className='w-full h-[150px] items-center justify-end'>
            <Image className='absolute w-full h-full ' source={require("../assets/transBlack.png")} />
            <Text className='text-[16px] font-medium text-white pb-[20px] uppercase'>men</Text>
          </View>
        </View>

        {/* <CategoryImageBannerItem title={"Bags"} image={require("../assets/accessories.jpg")} />
        <CategoryImageBannerItem title={"Kids"} image={require("../assets/girl.jpg")} />
        <CategoryImageBannerItem title={"Girl"} image={require("../assets/boys.jpg")} /> */}
  
      </View> 
  );
}
