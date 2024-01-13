import { Image, Pressable, Text, View } from "react-native";
import RadioButton from "../buttons/RadioButton";
import { useEffect, useState } from "react";

const ImageSelection = ({
  style,
  title,
  onChange,
  defaultValue,
  handleChange,
  images,
}) => {
  const initialColorValue = defaultValue;
  const [active, setActive] = useState(initialColorValue);

  const handlePress = (item) => {
    setActive(item);
    handleChange(item);
  };

  useEffect(() => {
    onChange && onChange({ type: "position", postion: active });
  }, [active]);

  return (
    <View style={style} className="w-full">
      <Text className="text-[16px] text-black font-normal mb-3">{title}</Text>
      <View className="flex-row justify-center">
        <ImageSelectionCard
          imageUrl={images[0]?.url}
          label={images[0]?.title}
          onPress={() => handlePress("left")}
          active={active === "left"}
        />
        <ImageSelectionCard
          imageUrl={images[1]?.url}
          label={images[1]?.title}
          onPress={() => handlePress("right")}
          active={active === "right"}
          style={{ marginLeft: 12 }}
        />
      </View>
    </View>
  );
};

const ImageSelectionCard = ({ style, label, active, onPress, imageUrl }) => {
  return (
    <Pressable style={style} className="items-center" onPress={onPress}>
      <View className="w-40 h-40 bg-gray-200">
        <Image src={imageUrl} className="w-full h-full" />
      </View>
      <View className="flex-row mt-2 items-center ">
        {label && (
          <Text className="text-[14px] text-black font-normal uppercase mr-2">
            {label}
          </Text>
        )}
        <RadioButton checked={active} />
      </View>
    </Pressable>
  );
};

export default ImageSelection;
