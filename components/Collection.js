import React, {
  useRef,
  useState,
  useLayoutEffect,
  useMemo,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
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

import { GET_ALL_PRODUCTS_ID_IN_COLLECTION, GET_COLLECTION_BY_ID } from "../graphql/queries";
import { CollectionCard } from "./CollectionCard";
import { LinearGradient } from "expo-linear-gradient";
import { SideBarContext } from "../App";
import Button from "./buttons/Button";
import TextBody from "./texts/TextBody";
import CollectionSkeleton from "./skeletons/CollectionSkeleton";
import CardSkeleton from "./skeletons/CardSkeleton";
import HeaderActions from "./actions/HeaderActions";
import SmallButton from "./Sidebar/Buttons/SmallButton";
import { ScreenHeader } from "./actions/ScreenHeader";
import MyModal from "./Modal/MyModal";
import FilterBody from "./Modal/FilterBody";
import { FilterSelectionContext, FilterSelectionProvider } from "../contexts/FilterSelectionContext";

const SCREEN_WIDTH = Dimensions.get("screen").width;

const desc =
  "American House of leather. Couch, values authenticiy and innovation. Founded on 1991, as a family running bussiness";

export default function Collection({ route }) {
  const [isSideBarVisible, setSideBarVisible] = useState(false)
  const handleSideBarClose = () => setSideBarVisible(false)
  return (


    <View className="flex-1 items-center bg-white">
      <SafeAreaView style={{ flex: 0, backgroundColor: "white" }} />
      <FilterSelectionProvider>
        <CollectionData route={route} openSideBar={() => setSideBarVisible(true)}/>
        <MyModal visible={isSideBarVisible} >
          <FilterBody onClose={handleSideBarClose}/>
        </MyModal>
      </FilterSelectionProvider>
    </View>
  );
}

function CollectionData ({route, openSideBar}) {
  const [showPageIndicator, setShowPageIndicator] = useState(false);
  const [productTotalCount, setProductTotalCount] = useState(0)

  const {setFilters, activeFilterInput} = useContext(FilterSelectionContext)

  const navigation = useNavigation();
  const { collectionId } = route.params;
  const flatListRef = useRef();
  const filterActionsLayout = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const filterInputs = activeFilterInput.map(filterValue => filterValue.input)

  const {
    loading: colloctionLoading,
    error: colloctionError,
    data: colloctionData,
    fetchMore,
  } = useQuery(GET_COLLECTION_BY_ID, {
    variables: {
      collectionId,
      filterInput: filterInputs,
    },
    fetchPolicy: "network-only",
  });

  const [getAllProductId, {
    loading: allProductsLoading,
    error: allProductsError,
    data: allProductsData,
    fetchMore: allProductsFetchMore
  }] = useLazyQuery(GET_ALL_PRODUCTS_ID_IN_COLLECTION, {
    variables: {
      collectionId,
      filterInput: filterInputs,
    },
    fetchPolicy: 'network-only',
    // notifyOnNetworkStatusChange: true,
  })

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  useEffect(() => {
    setProductTotalCount(0)
    getAllProductId()
  },[getAllProductId,activeFilterInput])

  useEffect(() => {
    if(allProductsData && !allProductsLoading){

      let hasNextPage = allProductsData?.collection?.products?.pageInfo?.hasNextPage
      let allProductsCount = 0
      let count = 1

      const fetchMoreProducts = async () => {
          
          await allProductsFetchMore({
            variables: {
              cursor: allProductsData?.collection?.products?.pageInfo.endCursor,
            },
            updateQuery: (result, {fetchMoreResult}) => {
              setProductTotalCount(prevState => prevState + fetchMoreResult?.collection?.products?.edges?.length)
              fetchMoreResult.collection.products.pageInfo.hasNextPage = fetchMoreResult.collection.products.pageInfo.hasNextPage
              return fetchMoreResult
            }
          })
    
          allProductsCount = allProductsCount + allProductsData?.collection?.products?.edges?.length
      }
      
      if(hasNextPage) {
        fetchMoreProducts()
      }else if(productTotalCount === 0) {
        setProductTotalCount(allProductsData?.collection?.products?.edges?.length)
      }
      
    }
  },[allProductsData, allProductsLoading])

  useEffect(() => {
    if(colloctionData) {
      setFilters(colloctionData?.collection?.products?.filters)
    }
  },[colloctionData])

  if (colloctionError) {
    return <Text>Error occured: {colloctionError.message}</Text>;
  }

  return (
        <>
          <CollectionHeader scrollY={scrollY} filterActionsLayout={filterActionsLayout} />
          {colloctionLoading && (<View className="absolute top-0 left-0 bottom-0 right-0 bg-white opacity-[0.6] z-50 items-center justify-center"><SafeAreaView/><ActivityIndicator size='small' color='black' /><SafeAreaView/></View>)}
          {(<CollectionBody
            colloctionData={colloctionData}
            colloctionLoading={colloctionLoading}
            flatListRef={flatListRef}
            filterActionsLayout={filterActionsLayout}
            scrollY={scrollY}
            setShowPageIndicator={setShowPageIndicator}
            fetchMore={fetchMore}
            openSideBar={openSideBar}
          />)}

          {showPageIndicator && (<PageIndicatorPopup flatListRef={flatListRef} total={productTotalCount} />)}
        </>
  )
}


function CollectionBody ({colloctionData, flatListRef, filterActionsLayout, scrollY, setShowPageIndicator, fetchMore, openSideBar}) {

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
        <ActionSlider onPress={openSideBar}/>

      </View>
    </View>
  ));
  
  return (
    <View className="pb-14 px-1">
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

function ActionSlider ({onPress}) {
  const {activeFilterInput} = useContext(FilterSelectionContext)
  return (
    <ScrollView
          horizontal={true}
          className="px-2 py-4"
          showsHorizontalScrollIndicator={false}
        >
        <FilterButton onPress={onPress}/>
        <SortButton/>
        {activeFilterInput && activeFilterInput.map((activeFilter, index) => {
                return <SmallButton key={index.toString()} id={activeFilter.id} title={activeFilter.label} />
            })}
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

function FilterButton ({onPress}) {
  [isFilterActive, setFilterActive] = useState(false)
return (
    <Pressable onPress={onPress} className={`px-2 h-10 self-start rounded-[5px] border border-gray-400 ${isFilterActive ? ' bg-black' : 'bg-white'} mr-2 flex-row items-center`}>
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
        <ScreenHeader headerAnimatedStyle={headerAnimatedStyle} headerRight={true}/>

        <Animated.View
          style={[{backgroundColor:'#fff', shadowColor:'#000', shadowOffset:{width:0, height:4}, shadowOpacity:0.05, elevation:3}, filterSliderAnimatedStyle]}
          className="absolute top-[50px] z-20 bg-white w-full "
        >
          <ActionSlider/>
        </Animated.View>
      </View>
  )
}

function PageIndicatorPopup ({flatListRef, current = 18, total}) {
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
            {current} of {total}
          </Text>
        </Pressable>
  )
}