import { useEffect, useRef, useState } from "react";
import { Pressable, SafeAreaView, Text, View, ScrollView } from "react-native";
import { ChevronDownIcon, HeartIcon } from "react-native-heroicons/outline";
import SearchInput from "../components/SearchInput";
import CategoryCard from "../components/CategoryCard";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useSelector } from "react-redux";

const TAB_WIDTH = 150;

const tabsArray = [
  {
    title: "women",
    content: [
      {
        id: 1,
        title: "scrubs",
        imgUrl: require("../assets/girl.jpg"),
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
        imgUrl: require("../assets/girl.jpg"),
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
        imgUrl: require("../assets/girl.jpg"),
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
        imgUrl: require("../assets/girl.jpg"),
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
        imgUrl: require("../assets/girl.jpg"),
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
    title: "men",
    content: [
      {
        id: 1,
        title: "scrubs",
        imgUrl: require("../assets/boys.jpg"),
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
        imgUrl: require("../assets/boys.jpg"),
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
        imgUrl: require("../assets/boys.jpg"),
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
        imgUrl: require("../assets/boys.jpg"),
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
        imgUrl: require("../assets/boys.jpg"),
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
    title: "accessories",
    content: [
      {
        id: 1,
        title: "bags",
        imgUrl: require("../assets/baby.jpg"),
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
        imgUrl: require("../assets/baby.jpg"),
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
        imgUrl: require("../assets/baby.jpg"),
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
        imgUrl: require("../assets/baby.jpg"),
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
    title: "specialization",
    content: [
      {
        id: 1,
        title: "new Men",
        imgUrl: require("../assets/baby.jpg"),
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
        imgUrl: require("../assets/baby.jpg"),
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
        imgUrl: require("../assets/baby.jpg"),
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
        imgUrl: require("../assets/baby.jpg"),
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
  const [tabStates, setTabStates] = useState(
    tabsArray.reduce((acc, tab) => {
      acc[tab.title] = { width: 0, x: 0 };
      return acc;
    }, {})
  );
  const [activeTab, setActiveTab] = useState("women");
  const [activeContent, setActiveContent] = useState([]);

  const gender = useSelector((state) => state.gender.current);

  const offsetTransfom = useSharedValue(0 + 10);
  const offsetWidth = useSharedValue(89 - 20);

  useEffect(() => {
    if (gender && tabsArray.some((tab) => tab.title === gender)) {
      setActiveTab(gender);
    }
  }, [gender]);

  useEffect(() => {
    const newOffsetTransfom = tabStates[activeTab].x + 10;
    offsetTransfom.value = withTiming(newOffsetTransfom);
    const newOffsetWidth = tabStates[activeTab].width - 20;
    offsetWidth.value = withTiming(newOffsetWidth);

    const foundTab = tabsArray.find((tab) => tab.title === activeTab);
    foundTab ? setActiveContent(foundTab.content) : setActiveContent([]);
  }, [activeTab, tabStates]);

  const handleLayout = (tabTitle) => (event) => {
    const { x, width } = event.nativeEvent.layout;
    setTabStates((prevState) => ({
      ...prevState,
      [tabTitle]: { x, width },
    }));
  };

  const handlePress = (target) => {
    setActiveTab(target);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offsetTransfom.value }],
    width: offsetWidth.value,
  }));

  return (
    <View>
      <SafeAreaView className="bg-white" />
      <View className="category-header">
        <View className="items-center justify-center h-[45px] bg-white">
          <Text className="text-[20px] font-normal text-black ">
            Categories
          </Text>
          <View className="h-[42px] w-[42px] mr-4 rounded-full bg-white justify-center items-center absolute top-0 right-0">
            <HeartIcon size={24} color="black" />
          </View>
        </View>

        <View className="tab-bar">
          <View className="flex flex-row  justify-between item-center bg-white">
            {tabsArray.map((tab, index) => (
              <Pressable
                key={index.toString()}
                onPress={() => handlePress(tab.title)}
                onLayout={handleLayout(tab.title)}
                className=" items-center py-4 px-5  "
              >
                <View>
                  <Text className="text-[14px] text-black font-normal capitalize">
                    {tab.title}
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
      </View>

      <ScrollView className="">
        <View className="p-4 w-full flex-row">
          <SearchInput text={"Search"} size={14} />
        </View>

        <View className={`women pb-[160px] `}>
          {activeContent.map((content) => (
            <CategoryCard
              content={content}
              key={content.id}
              id={content.id}
              title={content.title}
              imgUrl={content.imgUrl}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
