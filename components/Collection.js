import { useQuery } from "@apollo/client";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import {
  AdjustmentsHorizontalIcon,
  ArrowLongLeftIcon,
  ArrowUpIcon,
  ArrowsUpDownIcon,
  HeartIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import { GET_COLLECTION_BY_ID } from "../graphql/queries";
import LoadingScreen from "./LoadingScreen";
import { CollectionCard } from "./CollectionCard";
import React, {
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
  useMemo,
  useCallback,
  useContext,
} from "react";
import Skeleton from "./Skeleton";
import { LinearGradient } from "expo-linear-gradient";
import BottomModal from "./BottomModal";
import BottomModalColor from "./BottomModalV2";
import BottomModalV2 from "./BottomModalV2";
import CallBottomModal from "./CallBottomModal";
import Overlay from "./Overlay";
import { SideBarContext } from "../App";

const SCREEN_WIDTH = Dimensions.get("screen").width;

const placeholderGridArray = [1, 2, 3, 4];
const desc =
  "American House of leather. Couch, values authenticiy and innovation. Founded on 1991, as a family running bussiness";

export default function Collection({ route }) {
  const navigation = useNavigation();
  const { collectionId } = route.params;

  const [showPageIndicator, setShowPageIndicator] = useState(false);
  const [showMoreLoading, setShowMoreLoading] = useState(false);

  const [bottomModalOpen, setBottomModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [SelectedProductId, setSelectedProductId] = useState(null);
  
  const {setSideBarOpen} = useContext(SideBarContext)

  const filterActionsLayout = useSharedValue(0);
  const flatListRef = useRef();

  const scrollY = useSharedValue(0);

  const {
    loading: collLoading,
    error: collError,
    data: collData,
    fetchMore,
  } = useQuery(GET_COLLECTION_BY_ID, {
    variables: {
      collectionId,
    },
    fetchPolicy: "network-only",
  }); 

  function handlePagingation() {
    // if(showMoreLoading) return
    console.log("END OF SCROLL");
    if (collData?.collection?.products?.pageInfo?.hasNextPage) {
      console.log("IT HAS NEXT PAGE");
      setShowMoreLoading(true);
      fetchMore({
        variables: {
          cursor: collData?.collection?.products?.pageInfo.endCursor,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newEdges = fetchMoreResult.collection.products.edges || [];
          const prevEdges = previousResult.collection.products.edges || [];
          const updatedEdges = [...prevEdges, ...newEdges];
          fetchMoreResult.collection.products.edges = updatedEdges;

          return fetchMoreResult;
        },
      }).then((res) => {
        console.log("ehelldldle");
        // setShowMoreLoading(false);
      });
    }
  }

  function handleAddCartBtn() {
    if (selectedVariant) {
      console.log("HANDLE CART FUNCTION SUCCEFULLY RUNNING");

      if (cartId) {
        console.log("CART ID IS SET");
        addCartItem({
          variables: {
            checkoutId: cartId,
            variantId: selectedVariant,
          },
          refetchQueries: [
            {
              query: GET_CART_DETAILS,
              variables: {
                checkoutId: cartId,
              },
            },
          ],
          onCompleted: () => {
            setBottomModal(false);
            navigation.navigate("CartScreen");
          },
        });
      } else {
        console.log("NO CART ID IS SET");
        createCart({
          variables: {
            productQuantity: 1,
            productId: selectedVariant,
          },
          onCompleted: () => {
            setBottomModal(false);
            navigation.navigate("CartScreen");
          },
        });
      }

      setaddToCartbuttonDisabled(false);
      // setTimeout(() => {
      //   navigation.navigate("CartScreen");
      // }, 600);
    } else {
      setBottomModal(true);
    }
  }

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [
        90,
        filterActionsLayout.value.y
          ? filterActionsLayout.value.y - 50
          : filterActionsLayout.value,
      ],
      [0, 1]
    );
    return {
      opacity: opacity,
    };
  });

  const filterSliderAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [
        filterActionsLayout.value.y
          ? filterActionsLayout.value.y - 50
          : filterActionsLayout.value,
        filterActionsLayout.value.y
          ? filterActionsLayout.value.y - 49
          : filterActionsLayout.value,
      ],
      [0, 1]
    );
    return {
      opacity: opacity,
    };
  });

  const ListHeaderComponent = useMemo(() => (
    <View className="w-full">
      <View className="w-full h-[200px]">
        <View className="w-full z-10 flex-row justify-between items-center px-2">
          <LinearGradient
            style={{ width: SCREEN_WIDTH }}
            className="absolute top-0 h-[80px]"
            colors={["rgba(0, 0, 0, 0.3)", "transparent"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />
        </View>
        <Image
          className="w-full h-full absolute top-0 left-0"
          source={require("../assets/banner.jpg")}
        />
      </View>
      <View className="items-center px-5 bg-white">
        <Text className="text-[26px] text-black font-light mt-2">Coach</Text>
        <Text className="text-[15px] text-black font-normal text-center mt-2">
          {desc.length > 100 ? desc.slice(0, 100) + "..." : desc}
        </Text>
        <Text className="text-[14px] text-red-800 underline uppercase font-normal mt-2">
          Read More
        </Text>
      </View>
      <View
        onLayout={(e) => {
          // setFilterActionsLayout(e.nativeEvent.layout);
          filterActionsLayout.value = e.nativeEvent.layout;
        }}
        className="bg-white w-full"
      >
        <ScrollView
          horizontal={true}
          className="px-2 py-5"
          showsHorizontalScrollIndicator={false}
        >
          <Pressable onPress={() => setSideBarOpen(true)} className="flex-row items-center p-2 border border-gray-400 rounded-[5px] mr-2">
            <AdjustmentsHorizontalIcon size={20} color="black" />
            <Text className="ml-1 text-[14px] text-black font-normal uppercase">
              filter
            </Text>
          </Pressable>
          <View className="flex-row items-center p-2 border border-gray-400 rounded-[5px] mr-2">
            <ArrowsUpDownIcon size={20} color="black" />
            <Text className="ml-1 text-[14px] text-black font-normal uppercase">
              most wislisted
            </Text>
          </View>
          <View className="flex-row items-center p-2 border border-gray-400 rounded-[5px] mr-2">
            <Text className="ml-1 text-[14px] text-black font-normal uppercase">
              bags
            </Text>
          </View>
          <View className="flex-row items-center p-2 border border-gray-400 rounded-[5px] mr-2">
            <Text className="ml-1 text-[14px] text-black font-normal uppercase">
              accessories
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  ));

  const handleOnScrollBeginDrag = useCallback(() => {
    setShowPageIndicator(true);
  });
  const handleOnMomentumScrollEnd = useCallback(() => {
    setShowPageIndicator(false);
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  // console.log("COLLECTION DETAILS: ", collData?.collection?.products?.filters);

  // if (collLoading) {
  //   return (
  //     <View className="flex-1">
  //       <FlatList
  //         data={placeholderGridArray}
  //         keyExtractor={(index) => index.toString()}
  //         horizontal={false}
  //         numColumns={2}
  //         renderItem={({ item, index }) => (
  //           <View className="w-[50%] p-1">
  //             <View className="h-[400px] items-center">
  //               <Skeleton width={200} height={300} style={{}} />
  //               <Skeleton
  //                 width={180}
  //                 height={15}
  //                 style={{ borderRadius: 10, marginTop: 10 }}
  //               />
  //               <Skeleton
  //                 width={100}
  //                 height={15}
  //                 style={{ borderRadius: 10, marginTop: 10 }}
  //               />
  //               <Skeleton
  //                 width={120}
  //                 height={15}
  //                 style={{ borderRadius: 10, marginTop: 10 }}
  //               />
  //             </View>
  //           </View>
  //         )}
  //       />
  //     </View>
  //   );
  // }

  if (collError) {
    return <Text>Error occured: {collError.message}</Text>;
  }

  return (
    <View className="flex-1 items-center bg-white">
      <SafeAreaView style={{ flex: 0, backgroundColor: "white" }} />

      <View className="w-full z-20">
        <View className="absolute top-0 h-[50px] left-0 z-20 w-full flex-row items-center justify-between px-3">
          <TouchableOpacity className="p-1" onPress={() => navigation.goBack()}>
            <ArrowLongLeftIcon size={38} color="white" strokeWidth={1} />
          </TouchableOpacity>
          <View className="flex-row">
            <TouchableOpacity className="p-1 mr-2">
              <MagnifyingGlassIcon size={26} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="p-1">
              <HeartIcon size={26} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <Animated.View
          style={[{ backgroundColor: "white" }, headerAnimatedStyle]}
          className="w-full h-[50px] absolute top-[0px] z-20 bg-white flex-row items-center justify-center"
        >
          <TouchableOpacity
            className="p-1 absolute left-3"
            onPress={() => navigation.goBack()}
          >
            <ArrowLongLeftIcon size={38} color="black" strokeWidth={1} />
          </TouchableOpacity>
          <Text className="text-[18px] text-black font-normal p-3">Coach</Text>
          <View className="flex-row absolute right-3">
            <TouchableOpacity className="p-1 mr-2">
              <MagnifyingGlassIcon size={26} color="black" />
            </TouchableOpacity>
            <TouchableOpacity className="p-1">
              <HeartIcon size={26} color="black" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View
          style={[{}, filterSliderAnimatedStyle]}
          className="absolute top-[50px] z-20 bg-white w-full "
        >
          <View className="absolute bg-white w-full bottom-0 left-0 shadow-md h-[20px]"></View>
          <ScrollView
            horizontal={true}
            className="px-3 py-5"
            showsHorizontalScrollIndicator={false}
          >
            <View className="flex-row items-center p-2 border border-gray-400 rounded-[5px] mr-2">
              <AdjustmentsHorizontalIcon size={20} color="black" />
              <Text className="ml-1 text-[14px] text-black font-normal uppercase">
                filter
              </Text>
            </View>
            <View className="flex-row items-center p-2 border border-gray-400 rounded-[5px] mr-2">
              <ArrowsUpDownIcon size={20} color="black" />
              <Text className="ml-1 text-[14px] text-black font-normal uppercase">
                most wislisted
              </Text>
            </View>
            <View className="flex-row items-center p-2 border border-gray-400 rounded-[5px] mr-2">
              <Text className="ml-1 text-[14px] text-black font-normal uppercase">
                bags
              </Text>
            </View>
            <View className="flex-row items-center p-2 border border-gray-400 rounded-[5px] mr-2">
              <Text className="ml-1 text-[14px] text-black font-normal uppercase">
                accessories
              </Text>
            </View>
          </ScrollView>
        </Animated.View>
      </View>

      {collLoading && (
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
      )}

      {!collLoading && (
        <View className="pb-1 px-1">
          <Animated.FlatList
            data={collData?.collection?.products?.edges}
            ref={flatListRef}
            keyExtractor={(item) => item.node.id}
            horizontal={false}
            onScroll={scrollHandler}
            onScrollBeginDrag={handleOnScrollBeginDrag}
            onMomentumScrollEnd={handleOnMomentumScrollEnd}
            numColumns={2}
            onEndReached={handlePagingation}
            onEndReachedThreshold={1}
            ListHeaderComponent={ListHeaderComponent}
            renderItem={({ item, index }) => (
              <View className="w-[50%] pb-1 px-1">
                <CollectionCard
                  key={item.node.id}
                  product={item.node}
                  bottomModalOpen={bottomModalOpen}
                  setBottomModalOpen={setBottomModalOpen}
                  setSelectedProductId={setSelectedProductId}
                  handleAddCartBtn={handleAddCartBtn}
                />

                {collData?.collection?.products?.pageInfo?.hasNextPage &&
                  collData?.collection?.products?.edges.length - 2 ===
                    index && (
                    <View
                      key={`showMoreLoading1-${item.node.id}-1`}
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
                  )}
                {collData?.collection?.products?.pageInfo?.hasNextPage &&
                  collData?.collection?.products?.edges.length - 1 ===
                    index && (
                    <View
                      key={`showMoreLoading2-${item.node.id}-2`}
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
                  )}
              </View>
            )}
          />
        </View>
      )}

      {showPageIndicator && (
        <Pressable
          className="bg-gray-100 absolute bottom-6 py-2 px-3 rounded-full shadow-sm flex-row items-center "
          onPress={() => {
            flatListRef.current.scrollToIndex({
              animated: true,
              index: 0,
            });
          }}
        >
          <ArrowUpIcon size={16} color="black" />
          <Text className="text-[14px] text-gray-800 font-normal ml-1">
            18 of 566
          </Text>
        </Pressable>
      )}

      <Overlay state={bottomModalOpen} setState={setBottomModalOpen} />

      
    </View>
  );
}
