import React, {
  useRef,
  useState,
  useLayoutEffect,
  useMemo,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { useQuery } from "@apollo/client";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
  SafeAreaView,
} from "react-native";
import {
  AdjustmentsHorizontalIcon,
  ArrowUpIcon,
  ArrowsUpDownIcon,
} from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import { GET_COLLECTION_BY_ID } from "../graphql/queries";
import { CollectionCard } from "./CollectionCard";
import { LinearGradient } from "expo-linear-gradient";
import { SideBarContext } from "../App";
import Button from "./buttons/Button";
import BackIconButton from "./buttons/BackIconButton";
import SearchIconButton from "./buttons/SearchIconButton";
import WishListIconButton from "./buttons/WishListIconButton";
import TextBody from "./texts/TextBody";
import CollectionSkeleton from "./skeletons/CollectionSkeleton";
import CardSkeleton from "./skeletons/CardSkeleton";
import HeaderActions from "./actions/HeaderActions";

const SCREEN_WIDTH = Dimensions.get("screen").width;

const desc =
  "American House of leather. Couch, values authenticiy and innovation. Founded on 1991, as a family running bussiness";

export default function Collection({ route }) {
  const [showPageIndicator, setShowPageIndicator] = useState(false);

  const navigation = useNavigation();
  const { collectionId } = route.params;
  const flatListRef = useRef();
  const filterActionsLayout = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const {setFilters, activeFilterInput} = useContext(SideBarContext)

  console.log("ACTIVE FILTER INPUT",activeFilterInput)

  const {
    loading: colloctionLoading,
    error: colloctionError,
    data: colloctionData,
    fetchMore,
  } = useQuery(GET_COLLECTION_BY_ID, {
    variables: {
      collectionId,
      filterInput: activeFilterInput,
    },
    fetchPolicy: "network-only",
  }); 

  // Load filters into setFilters state in ../..App.js
  useEffect(() => {
    if(colloctionData) {
      setFilters(colloctionData?.collection?.products?.filters)
    }
  },[colloctionData])


  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  if (colloctionError) {
    return <Text>Error occured: {colloctionError.message}</Text>;
  }

  return (
    <View className="flex-1 items-center bg-white">
      <SafeAreaView style={{ flex: 0, backgroundColor: "white" }} />

      <CollectionHeader scrollY={scrollY} filterActionsLayout={filterActionsLayout} />

      {colloctionLoading && (<CollectionSkeleton/>)}
      {!colloctionLoading && (<CollectionBody
        colloctionData={colloctionData}
        flatListRef={flatListRef}
        filterActionsLayout={filterActionsLayout}
        scrollY={scrollY}
        setShowPageIndicator={setShowPageIndicator}
        fetchMore={fetchMore}
      />)}

      {showPageIndicator && (<PageIndicatorPopup flatListRef={flatListRef} />)}

    </View>
  );
}

function CollectionBody ({colloctionData, flatListRef, filterActionsLayout, scrollY, setShowPageIndicator, fetchMore}) {

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  const handleOnScrollBeginDrag = useCallback(() => {
    setShowPageIndicator(true);
  });

  const handleOnMomentumScrollEnd = useCallback(() => {
    setShowPageIndicator(false);
  });

  function handlePagingation() {
    if (colloctionData?.collection?.products?.pageInfo?.hasNextPage) {
      fetchMore({
        variables: {
          cursor: colloctionData?.collection?.products?.pageInfo.endCursor,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newEdges = fetchMoreResult.collection.products.edges || [];
          const prevEdges = previousResult.collection.products.edges || [];
          const updatedEdges = [...prevEdges, ...newEdges];
          fetchMoreResult.collection.products.edges = updatedEdges;

          return fetchMoreResult;
        },
      })
    }
  }

  const ListHeaderComponent = useMemo(() => (
    <View className="w-full">
      <ImageWrapper />
      <CollectionInfo/>
      <View
        onLayout={(e) => {
          filterActionsLayout.value = e.nativeEvent.layout;
        }}
        className="w-full"
      >
        <ActionSlider/>
      </View>
    </View>
  ));
  
  return (
    <View className="pb-1 px-1">
          <Animated.FlatList
            data={colloctionData?.collection?.products?.edges}
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
                />

                {colloctionData?.collection?.products?.pageInfo?.hasNextPage &&
                  colloctionData?.collection?.products?.edges.length - 2 ===
                    index && (
                    <CardSkeleton key='123'/>
                  )}
                {colloctionData?.collection?.products?.pageInfo?.hasNextPage &&
                  colloctionData?.collection?.products?.edges.length - 1 ===
                    index && (
                    <CardSkeleton key='124'/>
                  )}
              </View>
            )}
          />
      </View>
  )
}

function ActionSlider () {
  return (
    <ScrollView
          horizontal={true}
          className="px-2 py-4"
          showsHorizontalScrollIndicator={false}
        >
        <FilterButton/>
        <SortButton/>
        {/* <SmallButton title="Bags"/> */}
      </ScrollView>
  )
}

function SortButton () {
  [isSortactive, setSortActive] = useState(false)
return (
    <Pressable onPress={() => setSortActive(!isSortactive)} className={`px-2 h-10 self-start rounded-[5px] border border-gray-400 ${isSortactive ? ' bg-black' : 'bg-white'} mr-2 flex-row items-center`}>
      <ArrowsUpDownIcon size={20} color={`${isSortactive ? 'white' : 'black'}`} />
      <Text className={`text-[14px] ${isSortactive ? 'text-white' : 'text-black'} font-normal uppercase ml-1`}>
        most wislisted
      </Text>
    </Pressable>
)
}

function FilterButton () {
  [isFilterActive, setFilterActive] = useState(false)
  const {setSideBarOpen} = useContext(SideBarContext)
return (
    <Pressable onPress={() => setSideBarOpen(true)} className={`px-2 h-10 self-start rounded-[5px] border border-gray-400 ${isFilterActive ? ' bg-black' : 'bg-white'} mr-2 flex-row items-center`}>
      <AdjustmentsHorizontalIcon size={20} color={`${isFilterActive ? 'white' : 'black'}`} />
      <Text className={`text-[14px] ${isFilterActive ? 'text-white' : 'text-black'} font-normal uppercase ml-1`}>
        filter {isFilterActive ? '(' + 0 + ')' : ''}
      </Text>
  </Pressable>
)
}

function CollectionInfo () {
  return(
    <View className="items-center px-5 bg-white">
        <Text className="text-[26px] text-black font-light mt-2">Coach</Text>
        <TextBody body={desc} length={100} style={{marginBottom: 12}}/>
        <Button type="action" label="read more" />
    </View>
  )
}

function ImageWrapper () {
  return (
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
  )
}

function CollectionHeader ({scrollY, filterActionsLayout}) {

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

  return (
    <View className="w-full z-20">

        <HeaderActions/>
        <ScreenHeader headerAnimatedStyle={headerAnimatedStyle}/>

        <Animated.View
          style={[{backgroundColor:'#fff', shadowColor:'#000', shadowOffset:{width:0, height:4}, shadowOpacity:0.05, elevation:3}, filterSliderAnimatedStyle]}
          className="absolute top-[50px] z-20 bg-white w-full "
        >
          <ActionSlider/>
        </Animated.View>
      </View>
  )
}

function ScreenHeader ({headerAnimatedStyle}) {
  return(
    <Animated.View
          style={[{ backgroundColor: "white" }, headerAnimatedStyle]}
          className="w-full h-[50px] absolute top-[0px] z-20 bg-white flex-row items-center justify-center"
        >
          <BackIconButton color="black" style={{position: 'absolute', left: 12}}/>
          <Text className="text-[18px] text-black font-normal p-3">Coach</Text>
          <View className="flex-row absolute right-3">
            <SearchIconButton style={{marginRight: 8}} />
            <WishListIconButton />
          </View>
      </Animated.View>
  )
}

function PageIndicatorPopup ({flatListRef}) {
  return (
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
  )
}