import React, {
  useRef,
  useState,
  useLayoutEffect,
  useMemo,
  useCallback,
  useContext,
  useEffect,
  useTransition,
} from "react";
import { useLazyQuery, useQuery, useReactiveVar } from "@apollo/client";
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
  XMarkIcon,
} from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import {
  GET_ALL_PRODUCTS_ID_IN_COLLECTION,
  GET_COLLECTION_BY_ID,
} from "../graphql/queries";
import { CollectionCard } from "../components/CollectionCard";
import { LinearGradient } from "expo-linear-gradient";
import Button from "../components/buttons/Button";
import TextBody from "../components/texts/TextBody";
import CardSkeleton from "../components/skeletons/CardSkeleton";
import HeaderActions from "../components/actions/HeaderActions";
import SmallButton from "../components/Sidebar/Buttons/SmallButton";
import { ScreenHeader } from "../components/actions/ScreenHeader";
import MyModal from "../components/Modal/MyModal";
import FilterBody from "../components/Modal/FilterBody";
import {
  FilterSelectionContext,
  FilterSelectionProvider,
} from "../contexts/FilterSelectionContext";
import BottomModal from "../components/Modal/BottomModal";
import { userVar } from "../App";

const SCREEN_WIDTH = Dimensions.get("screen").width;

export default function CollectionScreen({ route }) {
  const user = useReactiveVar(userVar)

  console.log("USER LOGGED IN COLLECTION SCREEN : ", user?.email);
  const [isSideBarVisible, setSideBarVisible] = useState(false);
  const handleSideBarClose = () => setSideBarVisible(false);
  return (
    <View className="flex-1 items-center bg-white">
      <SafeAreaView style={{ flex: 0, backgroundColor: "white" }} />
      <FilterSelectionProvider>
        <CollectionData
          route={route}
          openSideBar={() => setSideBarVisible(true)}
        />
        <MyModal visible={isSideBarVisible}>
          <FilterBody onClose={handleSideBarClose} />
        </MyModal>
      </FilterSelectionProvider>
    </View>
  );
}

function CollectionData({ route, openSideBar }) {
  const [showPageIndicator, setShowPageIndicator] = useState(false);
  const [productTotalCount, setProductTotalCount] = useState(0);
  const [sortKeys, setSortKeys] = useState({
    handle: "default",
    sort_key: "COLLECTION_DEFAULT",
    label: "Sort By",
    reverse: false,
  });

  const { setFilters, activeFilterInput } = useContext(FilterSelectionContext);

  const navigation = useNavigation();
  const { collectionId } = route.params;
  const flatListRef = useRef();
  const filterActionsLayout = useSharedValue(100);
  const scrollY = useSharedValue(0);
  const filterInputs = activeFilterInput.map(
    (filterValue) => filterValue.input
  );

  const [isPending, startTransition] = useTransition();

  const {
    loading: colloctionLoading,
    error: colloctionError,
    data: colloctionData,
    fetchMore,
  } = useQuery(GET_COLLECTION_BY_ID, {
    variables: {
      collectionId,
      filterInput: filterInputs,
      sortKey: sortKeys.sort_key,
      reverse: sortKeys.reverse,
    },
  });

  const [
    getAllProductId,
    {
      loading: allProductsLoading,
      error: allProductsError,
      data: allProductsData,
      fetchMore: allProductsFetchMore,
    },
  ] = useLazyQuery(GET_ALL_PRODUCTS_ID_IN_COLLECTION, {
    variables: {
      collectionId,
      filterInput: filterInputs,
    },
    fetchPolicy: "network-only",
    // notifyOnNetworkStatusChange: true,
  });

  const handleSortPress = (item) => {
    startTransition(() => {
      setSortKeys(item);
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  useEffect(() => {
    setProductTotalCount(0);
    getAllProductId();
  }, [getAllProductId, activeFilterInput]);

  useEffect(() => {
    if (allProductsData && !allProductsLoading) {
      let hasNextPage =
        allProductsData?.collection?.products?.pageInfo?.hasNextPage;
      let allProductsCount = 0;
      let count = 1;

      const fetchMoreProducts = async () => {
        await allProductsFetchMore({
          variables: {
            cursor: allProductsData?.collection?.products?.pageInfo.endCursor,
          },
          updateQuery: (result, { fetchMoreResult }) => {
            setProductTotalCount(
              (prevState) =>
                prevState + fetchMoreResult?.collection?.products?.edges?.length
            );
            fetchMoreResult.collection.products.pageInfo.hasNextPage =
              fetchMoreResult.collection.products.pageInfo.hasNextPage;
            return fetchMoreResult;
          },
        });

        allProductsCount =
          allProductsCount +
          allProductsData?.collection?.products?.edges?.length;
      };

      if (hasNextPage) {
        fetchMoreProducts();
      } else if (productTotalCount === 0) {
        setProductTotalCount(
          allProductsData?.collection?.products?.edges?.length
        );
      }
    }
  }, [allProductsData, allProductsLoading]);

  useEffect(() => {
    if (colloctionData) {
      setFilters(colloctionData?.collection?.products?.filters);
    }
  }, [colloctionData]);

  if (colloctionError) {
    return <Text>Error occured: {colloctionError.message}</Text>;
  }

  return (
    <>
      {isPending && (
        <View className="flex-1 bg-red-200 absolute top-0 left-0 right-0 bottom-0 z-50"></View>
      )}
      {/* <Suspense fallback={<View className="flex-1 absolute top-0 left-0 bottom-0 right-0 z-40 overlay-[0.3] items-center justify-center"><Text>Loading..</Text></View>}> */}
      <CollectionHeader
        scrollY={scrollY}
        filterActionsLayout={filterActionsLayout}
        data={colloctionData}
        sortKeys={sortKeys}
        setSortKeys={setSortKeys}
        startTransition={startTransition}
        isPending={isPending}
        handleSortPress={handleSortPress}
      />
      {/* {colloctionLoading && (<View className="absolute top-0 left-0 bottom-0 right-0 bg-white opacity-[0.6] z-50 items-center justify-center"><SafeAreaView/><ActivityIndicator size='small' color='black' /><SafeAreaView/></View>)} */}
      {
        <CollectionBody
          colloctionData={colloctionData}
          colloctionLoading={colloctionLoading}
          flatListRef={flatListRef}
          filterActionsLayout={filterActionsLayout}
          scrollY={scrollY}
          setShowPageIndicator={setShowPageIndicator}
          fetchMore={fetchMore}
          openSideBar={openSideBar}
          sortKeys={sortKeys}
          setSortKeys={setSortKeys}
          startTransition={startTransition}
          isPending={isPending}
          handleSortPress={handleSortPress}
        />
      }
      {colloctionData?.collection?.products < 0 && (
        <View className="flex-1 items-center justify-center">
          <Image
            className="w-32 h-32"
            source={require("../assets/empty-box.png")}
          />
          <Text className="text-[18px] text-gray-500 font-normal capitalize mt-4 mb-6">
            No Products found !!!
          </Text>
          <Button
            onPress={() => navigation.navigate("Home")}
            label="go home"
            size="sm"
            flex={false}
          />
        </View>
      )}

      {showPageIndicator && (
        <PageIndicatorPopup
          current={colloctionData.collection?.products?.edges?.length}
          flatListRef={flatListRef}
          total={productTotalCount}
        />
      )}
      {/* </Suspense> */}
    </>
  );
}

function CollectionBody({
  colloctionData,
  flatListRef,
  filterActionsLayout,
  scrollY,
  setShowPageIndicator,
  fetchMore,
  openSideBar,
  setSortKeys,
  sortKeys,
  startTransition,
  isPending,
  handleSortPress,
}) {

  
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
      });
    }
  }

  const ListHeaderComponent = useMemo(() => (
    <View style={{ width: SCREEN_WIDTH }} className="w-full">
      <ImageWrapper data={colloctionData} />
      <CollectionInfo data={colloctionData} />
      <View
        onLayout={(e) => {
          filterActionsLayout.value = e.nativeEvent.layout;
        }}
        className="w-full"
      >
        <ActionSlider
          onPress={openSideBar}
          setSortKeys={setSortKeys}
          sortKeys={sortKeys}
          startTransition={startTransition}
          isPending={isPending}
          handleSortPress={handleSortPress}
        />
      </View>
    </View>
  ));

  return (
    <View className="pb-14">
      <Animated.FlatList
        data={colloctionData?.collection?.products?.edges}
        ref={flatListRef}
        keyExtractor={(item) => item.node.id}
        horizontal={false}
        onScroll={scrollHandler}
        onScrollBeginDrag={handleOnScrollBeginDrag}
        onMomentumScrollEnd={handleOnMomentumScrollEnd}
        numColumns={2}
        columnWrapperStyle={{ padding: 4 }}
        onEndReached={handlePagingation}
        onEndReachedThreshold={1}
        ListHeaderComponent={colloctionData && ListHeaderComponent}
        renderItem={({ item, index }) => (
          <View className="w-[50%] pb-1 px-1">
            <CollectionCard key={item.node.id} product={item.node} />

            {colloctionData?.collection?.products?.pageInfo?.hasNextPage &&
              colloctionData?.collection?.products?.edges.length - 2 ===
                index && <CardSkeleton key="123" />}
            {colloctionData?.collection?.products?.pageInfo?.hasNextPage &&
              colloctionData?.collection?.products?.edges.length - 1 ===
                index && <CardSkeleton key="124" />}
          </View>
        )}
      />
    </View>
  );
}

function ActionSlider({
  onPress,
  setSortKeys,
  sortKeys,
  startTransition,
  handleSortPress,
}) {
  const [isModalVisible, setModalVisible] = useState(false);
  const { activeFilterInput } = useContext(FilterSelectionContext);

  const sort_keys = [
    {
      handle: "title",
      sort_key: "TITLE",
      label: "Sort By Title",
      reverse: false,
    },
    {
      handle: "price-low",
      sort_key: "PRICE",
      label: "Lowest Price",
      reverse: false,
    },
    {
      handle: "price-hight",
      sort_key: "PRICE",
      label: "Highest Price",
      reverse: true,
    },
    {
      handle: "best-selling",
      sort_key: "BEST_SELLING",
      label: "Best Selling",
      reverse: false,
    },
    {
      handle: "created",
      sort_key: "CREATED",
      label: "Newest",
      reverse: false,
    },
    {
      handle: "manual",
      sort_key: "MANUAL",
      label: "Sort By Manual",
      reverse: false,
    },
    {
      handle: "default",
      sort_key: "COLLECTION_DEFAULT",
      label: "Sort By",
      reverse: false,
    },
  ];

  return (
    <ScrollView
      horizontal={true}
      className="px-2 py-4"
      showsHorizontalScrollIndicator={false}
    >
      <FilterButton onPress={onPress} />
      <SortButton
        active={sortKeys.handle !== "default" ? true : false}
        label={sortKeys?.label}
        onPress={() => setModalVisible(true)}
      />
      {activeFilterInput &&
        activeFilterInput.map((activeFilter, index) => {
          return (
            <SmallButton
              key={index.toString()}
              id={activeFilter.id}
              title={activeFilter.label}
            />
          );
        })}

      <BottomModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        title="Sort by"
      >
        <View className="pb-10">
          {sort_keys.map(
            (item, index) =>
              item.handle !== "default" && (
                <SortCard
                  key={index.toString()}
                  active={sortKeys?.handle === item.handle}
                  label={item.label}
                  onPress={() => handleSortPress(item)}
                  style={{ borderBottomWidth: 1, borderBottomColor: "#ddd" }}
                />
              )
          )}
        </View>
      </BottomModal>
    </ScrollView>
  );
}

function SortCard({ style, active, label, onPress }) {
  return (
    <Pressable
      style={style}
      onPress={onPress}
      className="flex-row justify-between px-5 py-4"
    >
      <Text
        className={`text-[14px] text-black ${
          active ? "font-medium" : "font-light"
        }`}
      >
        {label}
      </Text>
      <View className="w-4 h-4 rounded-full border border-black items-center justify-center">
        {active && (
          <View className="w-[10px] h-[10px] rounded-full bg-black"></View>
        )}
      </View>
    </Pressable>
  );
}

function SortButton({ onPress, label, active }) {
  [isSortactive, setSortActive] = useState(false);
  return (
    <Pressable
      onPress={onPress}
      className={`px-2 h-10 self-start rounded-[5px] border border-gray-400 ${
        active ? " bg-black" : "bg-white"
      } mr-2 flex-row items-center`}
    >
      <ArrowsUpDownIcon size={20} color={`${active ? "white" : "black"}`} />
      <Text
        className={`text-[14px] ${
          active ? "text-white" : "text-black"
        } font-normal uppercase ml-1`}
      >
        {label ? label : "Sort by"}
      </Text>
    </Pressable>
  );
}

function FilterButton({ onPress }) {
  [isFilterActive, setFilterActive] = useState(false);
  return (
    <Pressable
      onPress={onPress}
      className={`px-2 h-10 self-start rounded-[5px] border border-gray-400 ${
        isFilterActive ? " bg-black" : "bg-white"
      } mr-2 flex-row items-center`}
    >
      <AdjustmentsHorizontalIcon
        size={20}
        color={`${isFilterActive ? "white" : "black"}`}
      />
      <Text
        className={`text-[14px] ${
          isFilterActive ? "text-white" : "text-black"
        } font-normal uppercase ml-1`}
      >
        filter {isFilterActive ? "(" + 0 + ")" : ""}
      </Text>
    </Pressable>
  );
}

function CollectionInfo({ data }) {
  const [isModalVisible, setModalVisible] = useState(false);
  return (
    <View className="w-full items-center px-5 bg-white">
      <Text className="text-[26px] text-black font-light text-center capitalize mt-2">
        {data?.collection?.title}
      </Text>
      {data?.collection?.metafield?.value && (
        <TextBody
          body={data?.collection?.metafield?.value}
          length={100}
          style={{ marginBottom: 12 }}
        />
      )}
      {data?.collection?.metafield?.value.length > 100 && (
        <Button
          type="action"
          label="read more"
          onPress={() => setModalVisible(true)}
        />
      )}
      <MyModal visible={isModalVisible} slide="toUp">
        <View className="h-10 flex-row items-center justify-end px-3">
          <Pressable className="p-1 " onPress={() => setModalVisible(false)}>
            <XMarkIcon size={24} color="black" />
          </Pressable>
        </View>
        <View className="p-5">
          <Text className="text-[16px] text-black font-light leading-6">
            {data?.collection?.metafield?.value}
          </Text>
        </View>
      </MyModal>
    </View>
  );
}

function ImageWrapper({ data }) {
  return (
    <View className="w-full h-[150px]">
      <View className="w-full z-10 flex-row justify-between items-center px-2">
        <LinearGradient
          style={{ width: SCREEN_WIDTH }}
          className="absolute top-0 h-[80px]"
          colors={["rgba(0, 0, 0, 0.3)", "transparent"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </View>
      {!data?.collection?.image?.url && (
        <Image
          className="w-full h-full absolute top-0 left-0"
          source={require("../assets/snc-logo.avif")}
        />
      )}
      {data?.collection?.image?.url && (
        <Image
          className="w-full h-full absolute top-0 left-0"
          src={data?.collection?.image?.url}
        />
      )}
    </View>
  );
}

function CollectionHeader({
  scrollY,
  filterActionsLayout,
  data,
  sortKeys,
  setSortKeys,
  startTransition,
  isPending,
  handleSortPress,
}) {
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
      <HeaderActions />
      {
        <ScreenHeader
          headerAnimatedStyle={headerAnimatedStyle}
          headerRight={true}
          title={data?.collection?.title}
        />
      }

      <Animated.View
        style={[
          {
            backgroundColor: "#fff",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            elevation: 3,
          },
          filterSliderAnimatedStyle,
        ]}
        className="absolute top-[50px] z-20 bg-white w-full "
      >
        <ActionSlider
          sortKeys={sortKeys}
          setSortKeys={setSortKeys}
          startTransition={startTransition}
          isPending={isPending}
          handleSortPress={handleSortPress}
        />
      </Animated.View>
    </View>
  );
}

function PageIndicatorPopup({ flatListRef, current = 18, total }) {
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
  );
}
