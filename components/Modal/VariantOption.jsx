import { Pressable, Text, View } from "react-native";
import VariantOptionColor from "./VariantOptionColor";
import VariantOptionType from "./VariantOptionType";
import { useContext, useState } from "react";
import MyModal from "./MyModal";
import { XMarkIcon } from "react-native-heroicons/outline";
import Button from "../buttons/Button";

const textColor = 'text-[#4baaca]'

export default function VariantOption({ option, context }) {
  const {activeOptions} = useContext(context)
  const [isModalVisible, setModalVisible] = useState(false)

  return (
    <View className="mb-5">
      <View className="flex-row justify-between items-center mb-3 px-5">
        <Text className="text-[12px] font-normal text-black uppercase">
          {option.name}: {activeOptions?.find(optionItem => optionItem?.name === option?.name)?.value}
        </Text>
        {option.name === "Size" && (
          <>
          <Button 
            label="size guide" 
            type="action"
            onPress={() => setModalVisible(true)}
            size="sm" 
            flex={false} 
            textStyle={{fontSize: 12, color: '#89c157'}}
          />

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
      ) : (
        <VariantOptionType
          option={option}
          context={context}
        />
      )}
    </View>
  );
}
