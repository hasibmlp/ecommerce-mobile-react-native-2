import { useState } from "react";
import { Text, View, Pressable } from "react-native";
import { ChevronDownIcon } from "react-native-heroicons/outline";
import Animated, { Layout } from "react-native-reanimated";

export default function CategorySubMenuCard({ title, id, subLists }) {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  const [activeIndex, setActiveIndex] = useState(0);

  const handleSubmenuPress = () => {
    setActiveIndex(id === activeIndex ? null : id);
  };

  return (
    <Animated.View layout={Layout} className="submenu relative overflow-hidden">
      <Pressable
        onPress={() => handleSubmenuPress()}
        className="flex-row items-center justify-between px-5 py-5"
      >
        <Text
          className={`text-[14px] text-black font-light ${
            isSubMenuOpen && "font-medium"
          }`}
        >
          {title}
        </Text>

        <ChevronDownIcon size={12} color="black" />
      </Pressable>
      <View className="related">
        {id === activeIndex && (
          <>
            {subLists.map((list, index) => (
              <View key={index.toString()} className="px-5 bg-gray-100">
                <Text className="text-[14px] text-black font-light py-3">
                  {list}
                </Text>
              </View>
            ))}
          </>
        )}
      </View>
    </Animated.View>
  );
}
