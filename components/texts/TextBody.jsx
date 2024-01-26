import { Text } from "react-native";
import Skeleton from "../skeletons/Skeleton";
import { FONT_FAMILY } from "../../theme";

export default function TextBody({ body, length = 500, style }) {
  return (
    <Text
      style={[style, FONT_FAMILY.primary]}
      className="text-[15px] text-black font-normal text-center mt-2"
    >
      {body?.length > length ? body.slice(0, length) + "..." : body}
    </Text>
  );
}
