import { View } from "react-native";
import Skeleton from "./Skeleton";

export default function CardSkeleton({style, width=200 , height=300}) {

  return (
    <View className={`h-[${height+100}] items-center`} style={style}>
      <Skeleton width={width} height={height} />
      <Skeleton
        width={width-20}
        height={15}
        style={{ borderRadius: 10, marginTop: 10 }}
      />
      <Skeleton
        width={width-100}
        height={15}
        style={{ borderRadius: 10, marginTop: 10 }}
      />
      <Skeleton
        width={width-80}
        height={15}
        style={{ borderRadius: 10, marginTop: 10 }}
      />
    </View>
  );
}
