import { View } from "react-native";
import Skeleton from "../Skeleton";

export default function CollectionContentSkeleton () {
    return (
        <View className="items-center">
                <Skeleton
                  width={100}
                  height={20}
                  style={{ marginBottom: 12 }}
                />
                <Skeleton width={350} height={20} style={{ marginBottom: 4 }} />
                <Skeleton
                  width={300}
                  height={20}
                  style={{ marginBottom: 12 }}
                />
                <Skeleton width={100} height={20} style={{ marginBottom: 6 }} />
                <Skeleton
                  width={350}
                  height={20}
                  style={{ marginBottom: 12 }}
                />
                <Skeleton
                  width={100}
                  height={20}
                  style={{ marginBottom: 12 }}
                />
                <Skeleton
                  width={150}
                  height={20}
                  style={{ marginBottom: 12 }}
                />
        </View>
    )
}