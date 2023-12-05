import { useEffect, useRef, useState } from "react";
import { Image, Text, View, Pressable } from "react-native";
import { ChevronDownIcon } from "react-native-heroicons/outline";
import CategorySubMenuCard from "./CategorySubMenuCard";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Layout } from "react-native-reanimated";


export default function CategoryCard({ content, setActiveSubMenuIndex, index }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);



  const handlePress = () => {
    setActiveIndex(content.id === activeIndex ? null : content.id);
    setActiveSubMenuIndex(index)
  };

  const handleSubmenuPress = (target, index) => {
    setIsSubMenuOpen(!isSubMenuOpen);
    setCurrentSubmenu(target);
    setActiveSubMenuIndex(index)
  };

  return (
    <Animated.View
      entering={FadeIn}
      layout={Layout.delay(100)}
      exiting={FadeOut}
      className="border-b-[1px] border-gray-100 relative grow bg-white"
    >
      <Pressable
        onPress={handlePress}
        className={`flex-row justify-between items-center bg-white ${
          isMenuOpen ? "border-b-[.5px] border-gray-200" : ""
        } `}
      >
        <View className="flex-1 flex-row gap-3 items-center pl-5">
          <Text className="text-black text-[20px] font-normal capitalize">{content?.name}</Text>
          {content?.values?.length > 0 && (<ChevronDownIcon size={15} color="black" />)}
        </View>
        <View className="h-[110px] w-[180px] bg-gray-400">
          <Image
            className="w-full h-full"
            src={content.imageUrl}
          />
        </View>
      </Pressable>

      <View>
        <View className={`bg-white w-full flex overflow-hidden`}>
          {content?.id === activeIndex && (
            <>
                {content?.values?.map((subContent, index) => (
                    <CategorySubMenuCard key={index.toString()} id={index + 1} subContent={subContent} />
                ))}
            </>
          )}
        </View>
      </View>
    </Animated.View>
  );
}
