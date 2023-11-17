import { Dimensions, FlatList, View } from "react-native";
import Skeleton from "../Skeleton";

const placeholderGridArray = [1, 2, 3, 4];

const SCREEN_WIDHT = Dimensions.get('window').width

export default function CollectionSkeleton () {
    return (
      <View className="flex-1">
          <Skeleton width={SCREEN_WIDHT} height={200}/>
          <View className="items-center mt-3">
            <Skeleton width={100} height={30} />
            <Skeleton width={200} height={15} style={{marginTop: 12}}/>
            <Skeleton width={200} height={15} style={{marginTop: 4}}/>
            <Skeleton width={80} height={15} style={{marginTop: 8}}/>
          </View>
          <View className="my-3 flex-row gap-x-2 pl-3">
            <Skeleton width={100} height={38} style={{borderRadius: 5}} />
            <Skeleton width={170} height={38} style={{borderRadius: 5}} />
            <Skeleton width={60} height={38} style={{borderRadius: 5}} />
            <Skeleton width={60} height={38} style={{borderRadius: 5}} />
          </View>
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