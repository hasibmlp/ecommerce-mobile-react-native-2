import { FlatList, View } from "react-native";
import Skeleton from "../Skeleton";

const placeholderGridArray = [1, 2, 3, 4];

export default function CollectionSkeleton () {
    return (
      <View className="flex-1">
            <FlatList
              data={placeholderGridArray}
              keyExtractor={(index) => index.toString()}
              horizontal={false}
              numColumns={2}
              renderItem={({ item, index }) => (
                <View className="w-[50%] p-1">
                  <View className="h-[400px] items-center">
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
                </View>
              )}
            />
          </View>
    )
  }