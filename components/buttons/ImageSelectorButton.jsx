import { Image, Text, TouchableOpacity, View } from "react-native";

export default function ImageSelectorButton({onPress, style, active, imageUrl, textContainer}) {
    return(
      <TouchableOpacity
            style={style}
            onPress={onPress}
            className="h-[150px] w-[100]"
          >
            <View
              
              className={`border ${active ? " border-black" : "border-gray-300"} rounded-[5px] overflow-hidden`}>
              <Image
                className="h-full w-full rounded-[5px]"
                src={imageUrl}
              />
            </View>
            <View className="items-center py-2">
                {textContainer}
            </View>
        </TouchableOpacity>
    )
  }