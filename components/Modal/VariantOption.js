import { Pressable, Text, View } from "react-native";
import VariantOptionSize from "./VariantOptionSize";
import VariantOptionColor from "./VariantOptionColor";
import VariantOptionType from "./VariantOptionType";
import { useContext } from "react";
import { VariantSelectionContext } from "../../contexts/VariantSelectionContext";

export default function VariantOption({ option, variants }) {
  const { color, setColor, size, setSize, type, setType } = useContext(
    VariantSelectionContext
  );

  const getAvailableVariant = () => {
    const filteredArray =
      variants &&
      variants.filter(
        (item) =>
          item.selectedOptions.find((item) => item.name === "Color").value ===
            color && item.quantityAvailable > 0
      );

    const availableSizeForColor = filteredArray.map((item) => {
      return item.selectedOptions.find((item) => item.name === "Size").value;
    });
    const availableTypeForColor = filteredArray.map((item) => {
      return (
        item.selectedOptions.find((item) => item.name === "TYPE") &&
        item.selectedOptions.find((item) => item.name === "TYPE").value
      );
    });
    // console.log("AVAILABLE SIZE FOR SELECTED COLOR ",availableTypeForColor)

    return { availableSizeForColor, availableTypeForColor };
  };

  const availableSizeForColor = getAvailableVariant().availableSizeForColor;
  const availableTypeForColor = getAvailableVariant().availableTypeForColor;

  return (
    <View className="mb-5">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-[12px] font-normal text-black uppercase">
          {option.name}:{option.name === "Color" && color}
        </Text>
        {option.name === "Size" && (
          <Pressable>
            <Text className="text-[12px] font-medium text-red-700 uppercase underline">
              size guide
            </Text>
          </Pressable>
        )}
      </View>

      {option.name === "Color" ? (
        <VariantOptionColor
          option={option}
          variants={variants}
        />
      ) : option.name === "Size" ? (
        <VariantOptionSize
          option={option}
          availableSizeForColor={availableSizeForColor}
        />
      ) : (
        <VariantOptionType
          option={option}
          availableTypeForColor={availableTypeForColor}
        />
      )}
    </View>
  );
}
