import { useEffect, useRef, useState } from "react";
import { Pressable, SafeAreaView, Text, View, ScrollView, FlatList } from "react-native";
import { ChevronDownIcon, HeartIcon } from "react-native-heroicons/outline";
import SearchInput from "../components/SearchInput";
import CategoryCard from "../components/CategoryCard";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
  FadeOut,
  Layout,
} from "react-native-reanimated";
import { useSelector } from "react-redux";
import ScreenHeaderV2 from "../components/actions/ScreenHeaderV2";
import { useQuery, useReactiveVar } from "@apollo/client";
import { GET_CATEGORIES_OF_COLLECTIONS } from "../graphql/queries";
import LoadingScreen from "../components/LoadingScreen";
import { userVar } from "../makeVars/MakeVars";
import { FONT_FAMILY } from "../theme";

const TAB_WIDTH = 150;

const tabsArray = [
  {
    id: '001',
    title: "women",
    content: [
      {
        id: 1,
        title: "scrubs",
        imgUrl: "https://www.houseofthreestudio.com/cdn/shop/collections/House-of-three-dresses-01_1200x1200.jpg?v=1628608293",
        l2: [
          {
            title: "name",
            l3: ["subList", "subList2", "subList3", "subList4"],
          },
        ],
      },
      {
        id: 2,
        title: "labcoats",
        imgUrl: "https://www.houseofthreestudio.com/cdn/shop/collections/House-of-three-dresses-01_1200x1200.jpg?v=1628608293",
        l2: [
          {
            title: "name",
            l3: ["subList", "subList2", "subList3", "subList4"],
          },
        ],
      },
      {
        id: 3,
        title: "scrub jacket",
        imgUrl: "https://www.houseofthreestudio.com/cdn/shop/collections/House-of-three-dresses-01_1200x1200.jpg?v=1628608293",
        l2: [
          {
            title: "name",
            l3: ["subList", "subList2", "subList3", "subList4"],
          },
        ],
      },
      {
        id: 4,
        title: "printed tops",
        imgUrl: "https://www.houseofthreestudio.com/cdn/shop/collections/House-of-three-dresses-01_1200x1200.jpg?v=1628608293",
        l2: [
          {
            title: "name",
            l3: ["subList", "subList2", "subList3", "subList4"],
          },
        ],
      },
      {
        id: 5,
        title: "shoes & clogs",
        imgUrl: "https://www.houseofthreestudio.com/cdn/shop/collections/House-of-three-dresses-01_1200x1200.jpg?v=1628608293",

      },
      {
        id: 6,
        title: "shoes & clogs",
        imgUrl: "https://www.houseofthreestudio.com/cdn/shop/collections/House-of-three-dresses-01_1200x1200.jpg?v=1628608293",
        l2: [
          {
            title: "name",
            l3: ["subList", "subList2", "subList3", "subList4"],
          },
        ],
      },
    ],
  },
  {
    id: '002',
    title: "men",
    content: [
      {
        id: 1,
        title: "scrubs",
        imgUrl: "https://www.fashionbeans.com/wp-content/uploads/2018/05/male-models-top-ms3.jpg",
        l2: [
          {
            title: "all scrubs",
            l3: ["subList", "subList2", "subList3", "subList4"],
          },
          {
            title: "scrubs sets",
            l3: ["subList", "subList2", "subList3", "subList4"],
          },
          {
            title: "scrubs top",
            l3: ["subList", "subList2", "subList3", "subList4"],
          },
          {
            title: "scrubs pants",
            l3: ["subList", "subList2", "subList3", "subList4"],
          },
        ],
      },
      {
        id: 2,
        title: "labcoats",
        imgUrl: "https://www.fashionbeans.com/wp-content/uploads/2018/05/male-models-top-ms3.jpg",
        l2: [
          {
            title: "all labcoats",
            l3: ["subList", "subList2", "subList3", "subList4"],
          },
          {
            title: "long labcoats",
            l3: ["subList", "subList2", "subList3", "subList4"],
          },
          {
            title: "short labcoats",
            l3: ["subList", "subList2", "subList3", "subList4"],
          },
          {
            title: "colored labcoats",
            l3: ["subList", "subList2", "subList3", "subList4"],
          },
        ],
      },
      {
        id: 3,
        title: "scrub jacket",
        imgUrl: "https://www.fashionbeans.com/wp-content/uploads/2018/05/male-models-top-ms3.jpg",
        l2: [
          {
            title: "name",
            l3: ["subList", "subList2", "subList3", "subList4"],
          },
        ],
      },
      {
        id: 4,
        title: "printed tops",
        imgUrl: "https://www.fashionbeans.com/wp-content/uploads/2018/05/male-models-top-ms3.jpg",
        l2: [
          {
            title: "name",
            l3: ["subList", "subList2", "subList3", "subList4"],
          },
        ],
      },
      {
        id: 5,
        title: "shoes & clogs",
        imgUrl: "https://www.fashionbeans.com/wp-content/uploads/2018/05/male-models-top-ms3.jpg",
        l2: [
          {
            title: "name",
            l3: ["subList", "subList2", "subList3", "subList4"],
          },
        ],
      },
    ],
  },
  {
    id: '003',
    title: "accessories",
    content: [
      {
        id: 1,
        title: "bags",
        imgUrl: "https://cdn.shopify.com/s/files/1/1209/1968/files/Hidesign.jpg?8663230547561987584",
        l2: [
          {
            title: "name",
            l3: ["subList", "subList2", "subList3", "subList4"],
          },
        ],
      },
      {
        id: 2,
        title: "stationary",
        imgUrl: "https://cdn.shopify.com/s/files/1/1209/1968/files/Hidesign.jpg?8663230547561987584",
        l2: [
          {
            title: "name",
            l3: ["subList", "subList2", "subList3", "subList4"],
          },
        ],
      },
      {
        id: 3,
        title: "decorations",
        imgUrl: "https://cdn.shopify.com/s/files/1/1209/1968/files/Hidesign.jpg?8663230547561987584",
        l2: [
          {
            title: "name",
            l3: ["subList", "subList2", "subList3", "subList4"],
          },
        ],
      },
      {
        id: 4,
        title: "toys",
        imgUrl: "https://cdn.shopify.com/s/files/1/1209/1968/files/Hidesign.jpg?8663230547561987584",
        l2: [
          {
            title: "name",
            l3: ["subList", "subList2", "subList3", "subList4"],
          },
        ],
      },
    ],
  },
  {
    id: '004',
    title: "specialization",
    content: [
      {
        id: 1,
        title: "new Men",
        imgUrl: "https://cehs.unl.edu/images/cehs/majors/ApparelDesign_programfeatures.jpg",
        l2: [
          {
            title: "name",
            l3: ["subList", "subList2", "subList3", "subList4"],
          },
        ],
      },
      {
        id: 2,
        title: "new",
        imgUrl: "https://cehs.unl.edu/images/cehs/majors/ApparelDesign_programfeatures.jpg",
        l2: [
          {
            title: "name",
            l3: ["subList", "subList2", "subList3", "subList4"],
          },
        ],
      },
      {
        id: 3,
        title: "new",
        imgUrl: "https://cehs.unl.edu/images/cehs/majors/ApparelDesign_programfeatures.jpg",
        l2: [
          {
            title: "name",
            l3: ["subList", "subList2", "subList3", "subList4"],
          },
        ],
      },
      {
        id: 4,
        title: "new",
        imgUrl: "https://cehs.unl.edu/images/cehs/majors/ApparelDesign_programfeatures.jpg",
        l2: [
          {
            title: "name",
            l3: ["subList", "subList2", "subList3", "subList4"],
          },
        ],
      },
    ],
  },
];

export default function CategoriesScreen() {
  const user = useReactiveVar(userVar)

  console.log("USER LOGGED IN CATEGORY SCREEN : ", user?.email);
  const [activeContent, setActiveContent] = useState([]);
  const [activeSubMenuIndex, setActiveSubMenuIndex] = useState(null)
  const scrollRef = useRef()


  const {data, loading, error} = useQuery(GET_CATEGORIES_OF_COLLECTIONS, {
    fetchPolicy: 'no-cache'
  })

  const categories = data && JSON.parse(data?.collection?.metafield?.value)
  
  useEffect(() => {
    if(scrollRef) 
      setTimeout(() => {
        scrollRef?.current?.scrollToOffset({
          offset: activeSubMenuIndex * 110,
          animated: true,
        })
      },1)
  },[activeSubMenuIndex])

  if(loading) return (<LoadingScreen/>)

  return (
    <View className="flex-1">
      <SafeAreaView className="bg-white" />
      <View className="category-header">
        <ScreenHeaderV2 title="Categories" right={(<HeartIcon size={24} color="black"/>)} fly={false}/>
        <TabContainer tabsArray={categories} setActiveContent={setActiveContent}/>
      </View>

        <Animated.FlatList
          className="z-[-1]"
          ref={scrollRef}
          data={activeContent?.category}
          key={activeContent?.id}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({index, item}) => (
            <CategoryCard
            index={index}
            content={item}
            setActiveSubMenuIndex={setActiveSubMenuIndex}
          />
          )}
        />
      
    </View>
  );
}

function TabContainer({tabsArray, setActiveContent}) {
  const [tabStates, setTabStates] = useState(
    tabsArray?.reduce((acc, tab) => {
      acc[tab.name] = { width: 0, x: 0 };
      return acc;
    }, {})
  );

  const [activeTab, setActiveTab] = useState("women");
  const gender = useSelector((state) => state.gender.current);

  const offsetTransfom = useSharedValue(0 + 10);
  const offsetWidth = useSharedValue(89 - 20);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offsetTransfom.value }],
    width: offsetWidth.value,
  }));

  const handlePress = (target) => {
    setActiveTab(target);
  };

  const handleLayout = (tabTitle) => (event) => {
    const { x, width } = event.nativeEvent.layout;
    setTabStates((prevState) => ({
      ...prevState,
      [tabTitle]: { x, width },
    }));
  };

  useEffect(() => {
    if (gender && tabsArray.some((tab) => tab.name === gender)) {
      setActiveTab(gender);
    }
  }, [gender]);

  useEffect(() => {
    const newOffsetTransfom = tabStates[activeTab].x + 10;
    offsetTransfom.value = withTiming(newOffsetTransfom);
    const newOffsetWidth = tabStates[activeTab].width - 20;
    offsetWidth.value = withTiming(newOffsetWidth);

    const foundTab = tabsArray.find((tab) => tab.name === activeTab);
    foundTab ? setActiveContent(foundTab) : setActiveContent([]);
  }, [activeTab, tabStates]);

  return (
    <View className="tab-bar shadow-md">
        <View className="flex flex-row  justify-between item-center bg-white">
          {tabsArray.map((tab, index) => (
            <Pressable
              key={index.toString()}
              onPress={() => handlePress(tab.name)}
              onLayout={handleLayout(tab.name)}
              className=" items-center py-4 px-5"
            >
              <View>
                <Text style={FONT_FAMILY.primary} className="text-[14px] text-black font-normal capitalize">
                  {tab.name}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        <Animated.View
          style={[{ width: 50 }, animatedStyle]}
          className=" rounded-full h-[2px] bg-black"
        />
    </View>
  )
}