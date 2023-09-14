import { useEffect, useRef, useState } from "react";
import { Image, Text, View, Pressable } from "react-native";
import { ChevronDownIcon } from "react-native-heroicons/outline";
import CategorySubMenuCard from "./CategorySubMenuCard";
import Animated from "react-native-reanimated";
import { Layout } from "react-native-reanimated";


export default function CategoryCard({ title, id, imgUrl, content }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const [ imgUrlState, setImgUrlState ] = useState('')
  
  useEffect(() => {
    setImgUrlState(imgUrl)
  })


  const handlePress = () => {
    setActiveIndex(id === activeIndex ? null : id);
  };

  const handleSubmenuPress = (target) => {
    setIsSubMenuOpen(!isSubMenuOpen);
    setCurrentSubmenu(target);
  };

  return (
    <Animated.View
      layout={Layout}
      className="border-b-[1px] border-gray-100 relative grow bg-white"
    >
      <Pressable
        onPress={() => handlePress()}
        className={`w-full flex-row justify-between items-center bg-white ${
          isMenuOpen ? "border-b-[.5px] border-gray-200" : ""
        } `}
      >
        <View className="flex-1 flex-row gap-3 items-center pl-5">
          <Text className="text-black text-[20px] font-normal capitalize">{title}</Text>
          <View>
            <ChevronDownIcon size={15} color="black" />
          </View>
        </View>
        <View className="h-[130px] w-[150px] bg-gray-400">
          <Image
            className="w-full h-full"
            source={imgUrlState}
          />
        </View>
      </Pressable>

      <View>
        <View className={`bg-white w-full flex overflow-hidden`}>
          {id === activeIndex && (
            <>
                {content.l2.map((subContent, index) => (
                    <CategorySubMenuCard key={index.toString()} id={index + 1} title={subContent.title} subLists={subContent.l3} />
                ))}
            </>
          )}
        </View>
      </View>
    </Animated.View>
  );
}
