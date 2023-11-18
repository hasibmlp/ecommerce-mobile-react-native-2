import { useContext } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { VariantSelectionContext } from "../../contexts/VariantSelectionContext";

export default function VariantOptionColor({ option, variants }) {
  const { color, setColor } = useContext(VariantSelectionContext);

  const images = option.values.map((value) => {
    const variant = variants.find(
      (variant) =>
        variant.selectedOptions.find((item) => item.name === "Color").value ===
        value
    );
    return {
      id: variant.image.id,
      url: variant.image.url,
      color: variant.selectedOptions.find((item) => item.name === "Color")
        .value,
    };
  });

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="h-[150px]"
    >
      {images.map((item, index) => (
        <TouchableOpacity
          key={index.toString()}
          onPress={() => setColor({id: item.id, value: item.color}) }
          className=""
        >
          <View
            className={`w-[100px] h-[150px] border ${
              color?.value === item.color ? " border-black" : "border-gray-300"
            } rounded-[5px] overflow-hidden mr-3`}
          >
            <Image
              className="w-[100px] h-[150px] rounded-[5px]"
              src={item.url}
            />
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
