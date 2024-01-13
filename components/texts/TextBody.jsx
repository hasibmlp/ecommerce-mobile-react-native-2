import { Text } from "react-native";
import Skeleton from "../skeletons/Skeleton";

export default function TextBody({ body, length = 500, style }) {
  return (
    <Text
      style={[style]}
      className="text-[15px] text-black font-normal text-center mt-2"
    >
      {body?.length > length ? body.slice(0, length) + "..." : body}
    </Text>
  );
}
