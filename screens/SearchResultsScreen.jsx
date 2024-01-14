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
  GET_ALL_PRODUCTS_ID_IN_SEARCH_RESULTS,
  GET_COLLECTION_BY_ID,
  SEARCH_PRODUCTS,
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
import BottomModal from "../components/Modal/BottomModal";
import { userVar } from "../makeVars/MakeVars";
import ScreenHeaderV2 from "../components/actions/ScreenHeaderV2";
import BackIconButton from "../components/buttons/BackIconButton";
import LoadingFullScreen from "../components/Sidebar/LoadingFullScreen";

const SCREEN_WIDTH = Dimensions.get("screen").width;

const SearchResultsScreen = ({ route }) => {
  const user = useReactiveVar(userVar);

  console.log("USER LOGGED IN COLLECTION SCREEN : ", user?.email);
  return (
    <View className="flex-1 items-center bg-white">
      <SafeAreaView style={{ flex: 0, backgroundColor: "white" }} />
      <CollectionData route={route} />
    </View>
  );
};

function CollectionData({ route, openSideBar }) {
  const [showPageIndicator, setShowPageIndicator] = useState(false);
  const [productTotalCount, setProductTotalCount] = useState(0);
  const [sortKeys, setSortKeys] = useState({
    handle: "default",
    sort_key: "RELEVANCE",
    label: "Sort By",
    reverse: false,
  });
  const [isSideBarVisible, setSideBarVisible] = useState(false);
  const [filters, setFilters] = useState([]);
  const [activeFilterInput, setActiveFilterInput] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const { query } = route.params;
  const flatListRef = useRef();
  const filterActionsLayout = useSharedValue(100);
  const scrollY = useSharedValue(0);
  const filterInputs = activeFilterInput.map(
    (filterValue) => filterValue.input
  );

  const {
    data,
    loading: networkLoading,
    error,
    fetchMore,
  } = useQuery(SEARCH_PRODUCTS, {
    variables: {
      query: query,
      first: 18,
      filterInput: filterInputs,
      sortKey: sortKeys.sort_key,
      reverse: sortKeys.reverse,
    },
  });

  console.log("SEARCH RESULTS", data?.search?.productFilters);

  const handleSortPress = (item) => {
    setSortKeys(item);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  useEffect(() => {
    if (data) {
      console.log("FILTERS FROM DATA: ", data?.search?.productFilters);
      setFilters(data?.search?.productFilters);
    }
  }, [data]);

  if (error) {
    return <Text>Error occured: {error.message}</Text>;
  }

  return (
    <>
      {networkLoading && <LoadingFullScreen />}
      <CollectionHeader
        title={query}
        sortKeys={sortKeys}
        handleSortPress={handleSortPress}
        activeFilterInput={activeFilterInput}
        setSideBarVisible={setSideBarVisible}
        setActiveFilterInput={setActiveFilterInput}
        setLoading={setLoading}
      />
      {/* {loading && (<View className="absolute top-0 left-0 bottom-0 right-0 bg-white opacity-[0.6] z-50 items-center justify-center"><SafeAreaView/><ActivityIndicator size='small' color='black' /><SafeAreaView/></View>)} */}
      {
        <CollectionBody
          data={data}
          filterActionsLayout={filterActionsLayout}
          setShowPageIndicator={setShowPageIndicator}
          openSideBar={openSideBar}
          sortKeys={sortKeys}
          setSortKeys={setSortKeys}
          handleSortPress={handleSortPress}
          fetchMore={fetchMore}
        />
      }
      {data?.search?.edges.length === 0 && (
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
          current={data.search?.edges?.length}
          flatListRef={flatListRef}
          total={data?.search?.totalCount}
        />
      )}
      <MyModal visible={isSideBarVisible}>
        <FilterBody
          onClose={() => setSideBarVisible(false)}
          loading={loading}
          filters={filters}
          activeFilterInput={activeFilterInput}
          setLoading={setLoading}
          setActiveFilterInput={setActiveFilterInput}
          fetchMore={fetchMore}
        />
      </MyModal>
    </>
  );
}

function CollectionBody({
  data,
  flatListRef,
  setShowPageIndicator,
  fetchMore,
}) {
    const navigation = useNavigation()
  const handleOnScrollBeginDrag = useCallback(() => {
    setShowPageIndicator(true);
  });

  const handleOnMomentumScrollEnd = useCallback(() => {
    setShowPageIndicator(false);
  });

  const handlePagingation = () => {
    if (data?.search?.pageInfo?.hasNextPage) {
      fetchMore({
        variables: {
          cursor: data?.search?.pageInfo?.endCursor,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newEdges = fetchMoreResult.search.edges || [];
          const prevEdges = previousResult.search.edges || [];
          console.log("NEW BRANCH",newEdges[0].node)
          console.log("PREV BRANCH",prevEdges[0].node)
          const updatedEdges = [...prevEdges, ...newEdges];
          fetchMoreResult.search.edges = updatedEdges;
          return fetchMoreResult;
        },
      });
    }
  };

  return (
    <View className="pb-14">
      <Animated.FlatList
        data={data?.search?.edges}
        ref={flatListRef}
        keyExtractor={(item) => item.node.id}
        horizontal={false}
        onScrollBeginDrag={handleOnScrollBeginDrag}
        onMomentumScrollEnd={handleOnMomentumScrollEnd}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 150 }}
        columnWrapperStyle={{ padding: 4 }}
        onEndReached={handlePagingation}
        onEndReachedThreshold={1}
        // onEndReached={handlePagingation}
        ListHeaderComponent={
          <View className="py-4 items-center">
            <Text className="text-sm text-neutral-700">
              Total {data?.search?.totalCount} results
            </Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <View className="w-[50%] pb-1 px-1">
            <CollectionCard
              key={item.node.id}
              product={item.node}
              onPress={() =>
                navigation.navigate("ProductDetailScreenInSearch", {
                  productId: item.node.id,
                })
              }
            />

            {data?.search?.pageInfo?.hasNextPage &&
              data?.search?.edges.length - 2 === index && (
                <CardSkeleton key="123" />
              )}
            {data?.search?.pageInfo?.hasNextPage &&
              data?.search?.edges.length - 1 === index && (
                <CardSkeleton key="124" />
              )}
          </View>
        )}
      />
    </View>
  );
}

function ActionSlider({
  handleFilterPress,
  sortKeys,
  handleSortPress,
  activeFilterInput,
  setSideBarVisible,
  setActiveFilterInput,
  setLoading,
}) {
  const [isModalVisible, setModalVisible] = useState(false);

  const sort_keys = [
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
      handle: "default",
      sort_key: "RELEVANCE",
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
      <FilterButton onPress={() => setSideBarVisible(true)} />
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

function CollectionHeader({
  title,
  sortKeys,
  handleSortPress,
  activeFilterInput,
  setSideBarVisible,
  setActiveFilterInput,
  setLoading,
}) {
  return (
    <View className="w-full z-20">
      <View className="h-[50px]">
        <ScreenHeaderV2 left={<BackIconButton />} title={title} />
      </View>

      <View
        style={[
          {
            backgroundColor: "#fff",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            elevation: 3,
          },
        ]}
        className="bg-white w-full "
      >
        <ActionSlider
          handleFilterPress={() => {}}
          sortKeys={sortKeys}
          handleSortPress={handleSortPress}
          activeFilterInput={activeFilterInput}
          setSideBarVisible={setSideBarVisible}
          setActiveFilterInput={setActiveFilterInput}
          setLoading={setLoading}
        />
      </View>
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

export default SearchResultsScreen;
