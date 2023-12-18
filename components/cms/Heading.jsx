import { Text } from "react-native";

export default function Heading({content}) {
    return (
      <Text className="text-center text-[22px] text-black bg-white font-normal py-2">
        {content.data.title}
      </Text>
    )
  }