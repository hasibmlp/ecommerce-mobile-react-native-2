import { Pressable, Text, View } from "react-native";
import Skeleton from "../skeletons/Skeleton";

export default function ModalSkeleton() {
  return (
    <View>
      <View className="mb-3 px-5">
        <Skeleton width={50} height={15} />
      </View>

      <View className="flex-row w-full mb-5 px-5">
        <Skeleton
          width={100}
          height={150}
          style={{ marginRight: 12, borderRadius: 5 }}
        />
        <Skeleton
          width={100}
          height={150}
          style={{ marginRight: 12, borderRadius: 5 }}
        />
        <Skeleton
          width={100}
          height={150}
          style={{ marginRight: 12, borderRadius: 5 }}
        />
        <Skeleton
          width={100}
          height={150}
          style={{ marginRight: 12, borderRadius: 5 }}
        />
      </View>

      <View className="w-full flex-row justify-between mb-5 px-5">
        <Skeleton width={50} height={15} />
        <Skeleton width={50} height={15} />
      </View>

      <View className="flex-row w-full px-5 mb-3">
        <Skeleton
          width={55}
          height={40}
          style={{ marginRight: 12, borderRadius: 5 }}
        />
        <Skeleton
          width={55}
          height={40}
          style={{ marginRight: 12, borderRadius: 5 }}
        />
        <Skeleton
          width={55}
          height={40}
          style={{ marginRight: 12, borderRadius: 5 }}
        />
        <Skeleton
          width={55}
          height={40}
          style={{ marginRight: 12, borderRadius: 5 }}
        />
        <Skeleton
          width={55}
          height={40}
          style={{ marginRight: 12, borderRadius: 5 }}
        />
        <Skeleton
          width={55}
          height={40}
          style={{ marginRight: 12, borderRadius: 5 }}
        />
      </View>
    </View>
  );
}
