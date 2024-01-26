import { Text } from "react-native";
import { FONT_FAMILY } from "../../theme";

export default function Heading({content}) {
    return (
      <Text style={FONT_FAMILY.primary} className="text-center text-[22px] text-black bg-white font-normal py-2">
        {content.data.title}
      </Text>
    )
  }