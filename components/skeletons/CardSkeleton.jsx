import { View } from "react-native";
import Skeleton from "../Skeleton";

export default function CardSkeleton () {
    return (
      <View
          className="h-[400px] items-center"
        >
            <Skeleton width={200} height={300} style={{}} />
            <Skeleton
              width={180}
              height={15}
              style={{ borderRadius: 10, marginTop: 10 }}
            />
            <Skeleton
              width={100}
              height={15}
              style={{ borderRadius: 10, marginTop: 10 }}
            />
            <Skeleton
              width={120}
              height={15}
              style={{ borderRadius: 10, marginTop: 10 }}
            />
        </View>
    )
  }