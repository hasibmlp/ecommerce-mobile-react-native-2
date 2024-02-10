import React, { useRef, useState, useLayoutEffect, useCallback } from "react";
import { useQuery } from "@apollo/client";
import {
  Dimensions,
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
  withSpring,
} from "react-native-reanimated";

import { GET_COLLECTION_BY_ID } from "../graphql/queries";
import { CollectionCard } from "../components/CollectionCard";
import { LinearGradient } from "expo-linear-gradient";
import Button from "../components/buttons/Button";
import TextBody from "../components/texts/TextBody";
import CardSkeleton from "../components/skeletons/CardSkeleton";
import HeaderActions from "../components/actions/HeaderActions";
import SmallButton from "../components/Sidebar/Buttons/SmallButton";
import ScreenHeader from "../components/actions/ScreenHeader";
import MyModal from "../components/Modal/MyModal";
import FilterBody from "../components/Modal/FilterBody";
import BottomModal from "../components/Modal/BottomModal";
import Skeleton from "../components/skeletons/Skeleton";
import { FONT_FAMILY } from "../theme";

const SCREEN_WIDTH = Dimensions.get("screen").width;

export default function CollectionScreen({ route }) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center bg-white">
        <CollectionData route={route} />
      </View>
    </SafeAreaView>
  );
}

function CollectionData({ route }) {
  const maxFilterPriceRange = useRef();
  const [sortKeys, setSortKeys] = useState({
    handle: "default",
    sort_key: "COLLECTION_DEFAULT",
    label: "Sort By",
    reverse: false,
  });

  const [activeFilterInput, setActiveFilterInput] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSideBarVisible, setSideBarVisible] = useState(false);

  const navigation = useNavigation();
  const { collectionId } = route.params;
  const filterActionsLayout = useSharedValue(100);
  const scrollY = useSharedValue(0);
  const filterInputs = activeFilterInput.map(
    (filterValue) => filterValue.input
  );

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
    fetchPolicy: "network-only",
  });

  const filters = colloctionData?.collection?.products?.filters;
  const priceRange = filters?.find((item) => item.type === "PRICE_RANGE")
    .values[0];
  const maxPriceRange =
    priceRange && priceRange.input !== undefined
      ? JSON.parse(priceRange.input)
      : 0;

  if (
    maxFilterPriceRange.current === undefined ||
    !maxFilterPriceRange.current
  ) {
    maxFilterPriceRange.current = maxPriceRange?.price?.max;
  }

  const handleSortPress = (item) => {
    setSortKeys(item);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  if (colloctionError) {
    return <Text>Error occured: {colloctionError.message}</Text>;
  }

  return (
    <>
      <CollectionHeader
        scrollY={scrollY}
        filterActionsLayout={filterActionsLayout}
        data={colloctionData}
        sortKeys={sortKeys}
        setSortKeys={setSortKeys}
        handleSortPress={handleSortPress}
        activeFilterInput={activeFilterInput}
        setActiveFilterInput={setActiveFilterInput}
        setLoading={setLoading}
        openSideBar={() => setSideBarVisible(true)}
      />
      {/* {preventInitialLoadingSpinner && colloctionLoading && (
        <LoadingFullScreen />
      )} */}
      {
        <CollectionBody
          colloctionData={colloctionData}
          colloctionLoading={colloctionLoading}
          filterActionsLayout={filterActionsLayout}
          scrollY={scrollY}
          fetchMore={fetchMore}
          openSideBar={() => setSideBarVisible(true)}
          sortKeys={sortKeys}
          setSortKeys={setSortKeys}
          handleSortPress={handleSortPress}
          activeFilterInput={activeFilterInput}
          setActiveFilterInput={setActiveFilterInput}
          setLoading={setLoading}
        />
      }

      <PageIndicatorPopup />

      <MyModal visible={isSideBarVisible}>
        <FilterBody
          onClose={() => setSideBarVisible(false)}
          loading={loading}
          setLoading={setLoading}
          filters={filters}
          activeFilterInput={activeFilterInput}
          setActiveFilterInput={setActiveFilterInput}
          maxFilterPriceRange={maxFilterPriceRange}
        />
      </MyModal>
    </>
  );
}

function CollectionBody({
  colloctionData,
  colloctionLoading,
  filterActionsLayout,
  scrollY,
  fetchMore,
  openSideBar,
  setSortKeys,
  sortKeys,
  handleSortPress,
  activeFilterInput,
  setActiveFilterInput,
  setLoading,
}) {
  const navigation = useNavigation();
  const [flatListData, setFlatListData] = useState(
    colloctionData?.collection?.products?.edges
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
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
          fetchMoreResult.collection.products.edges = [
            ...prevEdges,
            ...newEdges,
          ];

          return fetchMoreResult;
        },
      });
    }
  }

  const hasNextPage =
    colloctionData?.collection?.products?.pageInfo?.hasNextPage;

  if (
    !colloctionLoading &&
    colloctionData?.collection?.products?.edges.length === 0
  )
    return (
      <View className="flex-1 items-center justify-center">
        <Image
          className="w-32 h-32"
          source={require("../assets/empty-box.png")}
        />
        <Text
          style={FONT_FAMILY.primary}
          className="text-[18px] text-gray-500 font-normal capitalize mt-4 mb-6"
        >
          No Products found !!!
        </Text>
        <Button
          onPress={() => navigation.navigate("Home")}
          label="go home"
          size="sm"
          flex={false}
        />
      </View>
    );

  return (
    <View className="">
      <Animated.FlatList
        data={colloctionData?.collection?.products?.edges}
        keyExtractor={(item) => item?.node?.id}
        horizontal={false}
        removeClippedSubviews={true}
        onScroll={scrollHandler}
        numColumns={2}
        columnWrapperStyle={{ padding: 4 }}
        onEndReached={handlePagingation}
        onEndReachedThreshold={2}
        ListEmptyComponent={
          <View className="w-full h-full">
            <View className="flex-row w-full px-1 pt-1">
              <View className="w-[50%] items-center justify-center overflow-hidden p-1 rounded-md">
                <View className="w-full overflow-hidden rounded-lg">
                  <Skeleton width={SCREEN_WIDTH / 2 - 4} height={300} />
                  <View className="pt-2 items-center">
                    <Skeleton
                      width={200}
                      height={15}
                      rounded
                      style={{ marginBottom: 8 }}
                    />
                    <Skeleton
                      width={150}
                      height={15}
                      rounded
                      style={{ marginBottom: 8 }}
                    />
                    <Skeleton width={200} height={15} rounded />
                  </View>
                </View>
              </View>
              <View className="w-[50%] items-center justify-center overflow-hidden p-1 rounded-md">
                <View className="w-full overflow-hidden rounded-lg">
                  <Skeleton width={SCREEN_WIDTH / 2 - 4} height={300} />
                  <View className="pt-2 items-center">
                    <Skeleton
                      width={200}
                      height={15}
                      rounded
                      style={{ marginBottom: 8 }}
                    />
                    <Skeleton
                      width={150}
                      height={15}
                      rounded
                      style={{ marginBottom: 8 }}
                    />
                    <Skeleton width={200} height={15} rounded />
                  </View>
                </View>
              </View>
            </View>
            <View className="flex-row w-full px-1 pt-1">
              <View className="w-[50%] items-center justify-center overflow-hidden p-1 rounded-md">
                <View className="w-full overflow-hidden rounded-lg">
                  <Skeleton width={SCREEN_WIDTH / 2 - 4} height={300} />
                  <View className="pt-2 items-center">
                    <Skeleton
                      width={200}
                      height={15}
                      rounded
                      style={{ marginBottom: 8 }}
                    />
                    <Skeleton
                      width={150}
                      height={15}
                      rounded
                      style={{ marginBottom: 8 }}
                    />
                    <Skeleton width={200} height={15} rounded />
                  </View>
                </View>
              </View>
              <View className="w-[50%] items-center justify-center overflow-hidden p-1 rounded-md">
                <View className="w-full overflow-hidden rounded-lg">
                  <Skeleton width={SCREEN_WIDTH / 2 - 4} height={300} />
                  <View className="pt-2 items-center">
                    <Skeleton
                      width={200}
                      height={15}
                      rounded
                      style={{ marginBottom: 8 }}
                    />
                    <Skeleton
                      width={150}
                      height={15}
                      rounded
                      style={{ marginBottom: 8 }}
                    />
                    <Skeleton width={200} height={15} rounded />
                  </View>
                </View>
              </View>
            </View>
          </View>
        }
        ListHeaderComponent={
          <View style={{ width: SCREEN_WIDTH }} className="w-full">
            <ImageWrapper data={colloctionData} />
            <CollectionInfo data={colloctionData} loading={colloctionLoading} />
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
                handleSortPress={handleSortPress}
                activeFilterInput={activeFilterInput}
                setActiveFilterInput={setActiveFilterInput}
                setLoading={setLoading}
              />
            </View>
          </View>
        }
        renderItem={({ item, index }) => (
          <View className="w-[50%] pb-1 px-1">
            <CollectionCard
              key={item.node.id}
              product={item.node}
              onPress={() =>
                navigation.navigate("ProductDetailScreen", {
                  productId: item.node.id,
                })
              }
            />
            {hasNextPage &&
              colloctionData?.collection?.products?.edges.length - 2 ===
                index && <CardSkeleton key="123" />}
            {hasNextPage &&
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
  sortKeys,
  handleSortPress,
  activeFilterInput,
  setActiveFilterInput,
  setLoading,
}) {
  const [isModalVisible, setModalVisible] = useState(false);

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

  const sharedValue = useSharedValue(0);

  const animatedStylec = useAnimatedStyle(() => ({
    width: interpolate(sharedValue.value, [0, 1], [0, 50]),
  }));

  const handlePress = () => {
    sharedValue.value = withSpring(1);
  };

  return (
    <View className="w-full flex-row items-center px-2 py-4">
      <FilterButton onPress={onPress} />

      <SortButton
        sharedValue={sharedValue}
        active={sortKeys.handle !== "default" ? true : false}
        label={sortKeys?.label}
        onPress={() => setModalVisible(true)}
      />
      <ScrollView
        horizontal={true}
        className=""
        showsHorizontalScrollIndicator={false}
      >
        {activeFilterInput &&
          activeFilterInput.map((activeFilter, index) => {
            return (
              <SmallButton
                key={index.toString()}
                id={activeFilter.id}
                title={activeFilter.label}
                setActiveFilterInput={setActiveFilterInput}
                setLoading={setLoading}
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
                    onPress={() => {
                      setModalVisible(false);
                      handleSortPress(item);
                    }}
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: "#ddd",
                    }}
                  />
                )
            )}
          </View>
        </BottomModal>
      </ScrollView>
    </View>
  );
}

function SortCard({ style, active, label, onPress, onClose }) {
  return (
    <TouchableOpacity
      style={style}
      onPress={onPress}
      className="flex-row justify-between px-5 py-4"
    >
      <Text
        style={FONT_FAMILY.primary}
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
    </TouchableOpacity>
  );
}

function SortButton({ onPress, label, active, sharedValue }) {
  [isSortactive, setSortActive] = useState(false);

  return (
    <Animated.View
      className={`px-2 h-10 self-start rounded-[5px] border border-gray-400 ${
        active ? " bg-black" : "bg-white"
      } mr-2 flex-row items-center`}
    >
      <TouchableOpacity onPress={onPress}>
        <ArrowsUpDownIcon size={20} color={`${active ? "white" : "black"}`} />
        {/* <Text
        style={FONT_FAMILY.primary}
        className={`text-[14px] ${
          active ? "text-white" : "text-black"
        } font-normal uppercase ml-1`}
      >
        {label ? label : "Sort by"}
      </Text> */}
      </TouchableOpacity>
    </Animated.View>
  );
}

function FilterButton({ onPress }) {
  [isFilterActive, setFilterActive] = useState(false);
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-2 h-10 self-start rounded-[5px] border border-gray-400 ${
        isFilterActive ? " bg-black" : "bg-white"
      } mr-2 flex-row items-center`}
    >
      <AdjustmentsHorizontalIcon
        size={20}
        color={`${isFilterActive ? "white" : "black"}`}
      />
      {/* <Text
        style={FONT_FAMILY.primary}
        className={`text-[14px] ${
          isFilterActive ? "text-white" : "text-black"
        } font-normal uppercase ml-1`}
      >
        filter {isFilterActive ? "(" + 0 + ")" : ""}
      </Text> */}
    </TouchableOpacity>
  );
}

function CollectionInfo({ data, loading }) {
  const [isModalVisible, setModalVisible] = useState(false);

  // const cachedInfo = useMemo(() => {}, []);

  return (
    <View className="w-full items-center px-5 bg-white pt-3">
      {data?.collection?.title && (
        <Text
          style={FONT_FAMILY.primary}
          className="text-[26px] text-black font-light text-center capitalize mt-2"
        >
          {data?.collection?.title}
        </Text>
      )}
      {!data?.collection?.title && (
        <View className="pt-2 items-center">
          <Skeleton
            width={200}
            height={15}
            rounded
            style={{ marginBottom: 8 }}
          />
          <Skeleton
            width={150}
            height={15}
            rounded
            style={{ marginBottom: 8 }}
          />
        </View>
      )}
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
          <Text
            style={FONT_FAMILY.primary}
            className="text-[16px] text-black font-light leading-6"
          >
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
          colors={["rgba(0, 0, 0, 0.4)", "transparent"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </View>
      {!data?.collection?.image?.url && (
        <Image
          className="w-full h-full absolute top-0 left-0"
          source={require("../assets/logo-collection.jpeg")}
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
  handleSortPress,
  activeFilterInput,
  setActiveFilterInput,
  setLoading,
  openSideBar,
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

      <ScreenHeader
        headerAnimatedStyle={headerAnimatedStyle}
        headerRight={true}
        title={data?.collection?.title}
      />

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
          onPress={openSideBar}
          sortKeys={sortKeys}
          setSortKeys={setSortKeys}
          handleSortPress={handleSortPress}
          activeFilterInput={activeFilterInput}
          setActiveFilterInput={setActiveFilterInput}
          setLoading={setLoading}
        />
      </Animated.View>
    </View>
  );
}

function PageIndicatorPopup() {
  return (
    <Pressable className="bg-gray-100 absolute bottom-6 py-2 px-3 rounded-full shadow-sm flex-row items-center ">
      <ArrowUpIcon size={16} color="black" />
    </Pressable>
  );
}
