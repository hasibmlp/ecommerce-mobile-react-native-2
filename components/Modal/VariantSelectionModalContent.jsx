import { useContext, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import VariantOption from "./VariantOption";
import Button from "../buttons/Button";
import ModalSkeleton from "./ModalSkeleton";
import { ExclamationTriangleIcon, PlusCircleIcon } from "react-native-heroicons/solid";
import MyModal from "./MyModal";
import {
  CheckCircleIcon,
  ChevronRightIcon,
  TrashIcon,
  XMarkIcon,
} from "react-native-heroicons/outline";
import { useFonts } from "expo-font";

import TextWithContent from "../customization/TextWithContent";
import TextOnly from "../customization/CustomSelection";
import CustomSelection from "../customization/CustomSelection";
import CustomSelectionInterface from "../customization/CustomSelectionInterface";
import EmbroiderySelection from "./EmbroiderySelection";

export default function VariantSelectionModalContent({ handleClose, context }) {
  const {
    options,
    handleAddCartBtn,
    currentlyNotInStock,
    selectedVariant,
    activeOptions,
    customProductId,
    setCustomProductId,
  } = useContext(context);
  const [loading, setLoading] = useState(true);

  let label;
  if (selectedVariant.id) {
    if (selectedVariant.availableForSale) label = "add to cart";
    else label = "notify me when available";
  } else {
    label =
      activeOptions.length === options?.length ? "unavilable" : "add to cart";
  }

  useEffect(() => {
    options && setLoading(false);
  }, [options]);

  return (
    <View className="items-center justify-center bg-white">
      <View className="pb-10 self-stretch">
        <View className="">
          {!options && <ModalSkeleton />}
          {options &&
            options.map((option, index) => (
              <VariantOption
                key={index.toString()}
                option={option}
                context={context}
              />
            ))}
        </View>

        <CustomizationContainer
          customProductId={customProductId}
          setCustomProductId={setCustomProductId}
        />

        <Button
          label={label}
          size="md"
          active={selectedVariant.id ? true : false}
          onPress={
            currentlyNotInStock
              ? () => {}
              : () => handleAddCartBtn((onClose = handleClose))
          }
          style={{ marginVertical: 12, marginHorizontal: 12 }}
        />
      </View>
    </View>
  );
}

function CustomizationContainer({ customProductId, setCustomProductId }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [totalCustom, setTotalCustom] = useState({
    type: "",
    active: false,
    selections: [],
  });
  return (
    <View className="pb-4 pt-2">
      <Text className="text-[12px] font-normal text-black uppercase mx-4 pb-3">
        Personalize:
      </Text>
      {!customProductId && (
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="flex-row items-center justify-between h-12 px-3 border border-neutral-300 rounded-md mx-3"
        >
          <Text className="text-sm text-black ">Add Embroidery</Text>
          <View className="flex-row items-center">
            <Text className="text-sm text-black mr-1">from AED 58</Text>
            <ChevronRightIcon size={20} color="black" />
          </View>
        </TouchableOpacity>
      )}

      {customProductId && (
        <View className="flex-row items-center justify-between h-12 border border-neutral-300 mx-4 rounded-md px-3">
          <Text>Added Embroidery</Text>
          <View className="flex-row items-center self-stretch">
            <Text className="text-sm text-black px-2">
              AED {customProductId.price}
            </Text>
            <TouchableOpacity className=" self-stretch justify-center px-2">
              <Text className="text-sm text-black">Edit</Text>
            </TouchableOpacity>
            <View className="h-6 w-[1px] bg-neutral-500 mx-2"></View>
            <TouchableOpacity
              onPress={() => {
                setCustomProductId(null)
                setModalVisible(null)
              }}
              className=" self-stretch justify-center px-2"
            >
              <TrashIcon size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <MyModal visible={isModalVisible} slide="toUp">
        <EmbroiderySelection
          onClose={() => setModalVisible(false)}
          totalCustom={totalCustom}
          setTotalCustom={setTotalCustom}
          customProductId={customProductId}
          setCustomProductId={setCustomProductId}
        />
      </MyModal>
    </View>
  );
}

{
  /* <Button label={`${currentlyNotInStock ? 'Notify me': 'Add to cart' } `} size="md" onPress={currentlyNotInStock ? () => {} : handleAddCartBtn}  style={{marginVertical: 12, marginHorizontal: 20}}/> */
}
