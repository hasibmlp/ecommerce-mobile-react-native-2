import { Pressable, Text, View } from "react-native";
import VariantOptionSize from "./VariantOptionSize";
import VariantOptionColor from "./VariantOptionColor";
import VariantOptionType from "./VariantOptionType";
import { useContext, useState } from "react";
import { VariantSelectionContext } from "../../contexts/VariantSelectionContext";
import { PreVariantSelectionContext } from "../../contexts/PreVariantSelectionContext";
import Skeleton from "../Skeleton";
import MyModal from "./MyModal";
import { XMarkIcon } from "react-native-heroicons/outline";

export default function VariantOption({ option, context }) {
  const {variants, activeColor} = useContext(context)
  const [isModalVisible, setModalVisible] = useState(false)

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
          <>
          <Pressable onPress={() => setModalVisible(true)}>
            <Text className="text-[12px] font-medium text-red-700 uppercase underline">
              size guide
            </Text>
          </Pressable>

          <MyModal visible={isModalVisible} slide="toUp">
          <View>
            <View className="h-10 flex-row items-center justify-end px-3">
              <Pressable className="p-1 " onPress={() => setModalVisible(false)}>
                <XMarkIcon size={24} color="black"/>
              </Pressable>
            </View>
          </View>
          </MyModal>
          </>
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
