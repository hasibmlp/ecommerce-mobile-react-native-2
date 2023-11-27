import { Pressable, Text, View } from "react-native";
import VariantOptionSize from "./VariantOptionSize";
import VariantOptionColor from "./VariantOptionColor";
import VariantOptionType from "./VariantOptionType";
import { useContext } from "react";
import { VariantSelectionContext } from "../../contexts/VariantSelectionContext";
import { PreVariantSelectionContext } from "../../contexts/PreVariantSelectionContext";
import Skeleton from "../Skeleton";

export default function VariantOption({ option, context }) {
  const {variants, activeColor} = useContext(context)

  const getAvailableVariant = () => {
    const filteredArray =
      variants &&
      variants.filter(
        (item) =>
          item.selectedOptions.find((item) => item.name === "Color")?.value ===
          activeColor?.value
      );

    const availableSizeForColor = filteredArray.map((item) => {
      return {
        size: item.selectedOptions.find((item) => item.name === "Size")?.value,
        availableForSale: item.quantityAvailable <= 0 ? item.availableForSale ? item.currentlyNotInStock ? false : true : false : true
      }
    });
    const availableTypeForColor = filteredArray.map((item) => {
      return (
        item.selectedOptions.find((item) => item.name === "TYPE") &&
        item.selectedOptions.find((item) => item.name === "TYPE")?.value
      );
    });

    return { availableSizeForColor, availableTypeForColor };
  };

  const availableSizeForColor = getAvailableVariant().availableSizeForColor;
  const availableTypeForColor = getAvailableVariant().availableTypeForColor;

  return (
    <View className="mb-5">
      <View className="flex-row justify-between items-center mb-3 px-5">
        <Text className="text-[12px] font-normal text-black uppercase">
          {option.name}:{option.name === "Color" && activeColor?.value}
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
          context={context}
        />
      ) : option.name === "Size" ? (
        <VariantOptionSize
          option={option}
          availableSizeForColor={availableSizeForColor}
          context={context}
        />
      ) : (
        <VariantOptionType
          option={option}
          availableTypeForColor={availableTypeForColor}
          context={context}
        />
      )}
    </View>
  );
}
