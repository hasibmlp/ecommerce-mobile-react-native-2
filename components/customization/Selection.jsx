import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { ChevronDownIcon } from "react-native-heroicons/outline";
import BottomModal from "../Modal/BottomModal";
import { useEffect, useState } from "react";
import ColorSwatchImage from "../buttons/ColorSwatchImage";

const Selection = ({
  options,
  style,
  label,
  onChange,
  name,
  handleChange,
  error,
  touched,
  value,
  fontsLoaded,
  context = "box",
  colorValues,
}) => {
  const assignedOption = context === "color" ? colorValues : options;
  const initialValue = assignedOption.find((item) => item.value?.toLowerCase() === value?.toLowerCase()) ?? assignedOption[0]
  const [isActive, setActive] = useState(false);
  const [activeSelection, setActiveSelection] = useState(initialValue);

  console.log("ASSINGED VALUES: ",value)

  const handleSelection = (value) => {
    setActiveSelection(value);
    setActive(false);
    onChange && onChange({ type: name, ...value });
    handleChange(value.value);
  };

  const handleColorPress = (item) => {
    setActiveSelection(item);
    handleChange(item.name);
  };

  useEffect(() => {}, [fontsLoaded]);

  useEffect(() => {
    onChange && onChange({ type: name, ...activeSelection });
  }, [activeSelection]);

  if (!fontsLoaded && context !== "color") return null;

  if (context === "box")
    return (
      <View className="mb-5">
        <Text className="text-base text-black font-medium mb-3">
          {label}
        </Text>
        <View className="flex-row items-center w-full flex-wrap">
          {options.map((item, index) => (
            <TouchableOpacity
              key={index.toString()}
              onPress={() => handleSelection(item)}
              className={`py-2 min-w-[90] px-2 ${
                activeSelection?.value === item.value
                  ? "bg-black"
                  : "border border-neutral-300"
              }  items-center justify-center rounded-md mr-3`}
            >
              <Text
                className={`text-base ${
                  activeSelection?.value === item.value
                    ? "text-white"
                    : "text-black"
                } font-medium `}
              >
                {item.value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );

  if (context === "modal")
    return (
      <View style={style} className="mb-3">
        <TouchableOpacity
          onPress={() => setActive(true)}
          className="border border-neutral-300 h-12 items-center px-3 rounded-md flex-row justify-between"
        >
          <Text
            style={{
              fontFamily:
                activeSelection?.fontFamily && activeSelection?.fontFamily,
            }}
            className="text-[14px] text-black font-normal mb-1"
          >
            {activeSelection?.value || label}
          </Text>
          <ChevronDownIcon size={20} color="black" />
        </TouchableOpacity>

        <BottomModal visible={isActive} onClose={() => setActive(false)}>
          <View className=" pb-20 w-full bg-white">
            {options.map((lang, index) => (
              <Pressable
                key={index.toString()}
                onPress={() => handleSelection(lang)}
                className="py-4 px-3 border-b border-gray-200 bg-white self-stretch items-center"
              >
                <Text
                  style={{ fontFamily: lang.fontFamily && lang.fontFamily }}
                  className="text-[16px] text-black font-medium"
                >
                  {lang.value}
                </Text>
              </Pressable>
            ))}
          </View>
        </BottomModal>
      </View>
    );

  if (context === "color") console.log("color values: ", colorValues);
  return (
    <View className="mb-5">
      <Text className="text-base text-black font-medium mb-3">Color: {activeSelection?.value}</Text>
      <View className="flex-row flex-wrap gap-2">
        {colorValues?.map((item, index) => (
          <TouchableOpacity
            className={`${
              activeSelection?.name === item.name
                ? "border border-black-300"
                : "border border-gray-50"
            } rounded-full `}
            key={index.toString()}
            onPress={() => handleColorPress(item)}
          >
            <View className="border-2 border-transparent rounded-full">
              <ColorSwatchImage size="xg" value={item.name} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Selection;
