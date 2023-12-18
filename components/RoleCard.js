import { Image, Text, View } from "react-native";

export default function RoleCard({ title, width=150, height=170, imageUrl }) {
  const product = {
    title: "",
    image: require("../assets/prod.jpg"),
  };
  return (
    <View className="flex-row mr-[10px] rounded-[5px]">
      <View style={{width, height}} className="w-[150px] h-[170px] overflow-hidden rounded-[2px]">
        <View className="flex-1">

          {imageUrl && (<Image
            className="h-full w-full"
            src={imageUrl}
          />)}

        </View>
        <View className=" h-[30px] justify-center">
          {title && (<Text className="text-[14px] font-normal text-black text-center uppercase">
            {title}
          </Text>)}
        </View>
      </View>
    </View>
  );
}
