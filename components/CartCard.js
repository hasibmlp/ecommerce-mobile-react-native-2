import { useMutation, useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect, useState } from "react";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import { ChevronDownIcon, ChevronUpDownIcon, TagIcon, TrashIcon } from "react-native-heroicons/outline";
import { GET_CART_DETAILS, GET_CART_ITEM } from "../graphql/queries";
import { cartIdVar } from "../App";
import { REMOVE_CART_ITEM } from "../graphql/mutations";
import LoadingFullScreen from "./Sidebar/LoadingFullScreen";
import LoadingScreen from "./LoadingScreen";
import BottomModal from "./Modal/BottomModal";

export default function CartCard({ lineItem, onRemove, handleLineItemUpdate }) {
  const cartId = cartIdVar();

  const totalPriceOfLineitem = lineItem.cost.totalAmount.amount 
  const subTotalPriceOfLineitem = lineItem.cost.subtotalAmount.amount 
  const costCurrencyCode = lineItem.cost.totalAmount.currencyCode

  const discountTitle = lineItem?.discountAllocations[0]?.title || lineItem?.discountAllocations[0]?.code

  console.log("TOTAL DISCOUNT DISPLAY: ",lineItem.discountAllocations[0])


  return (
    <View className="bg-white flex flex-row py-4 px-2 items-center mt-0">

     {lineItem.merchandise.image?.url && ( <Image
        className="h-[140px] w-[100px] rounded-[10px]"
        src={lineItem.merchandise.image.url}
        alt={lineItem.merchandise.image.altText}
      />)}
      <View className="flex flex-col ml-4 w-[55%]">
        <Text className="text-[16px] text-black font-medium mb-3">
          {lineItem.merchandise.product.title}
        </Text>
        <View className="text-[13px] text-gray-600 font-light flex-row mb-2">
          {lineItem.merchandise.selectedOptions.map((option, index) => (
            <Text key={index} className={`mr-5 `}>
              {option.value}
            </Text>
          ))} 
          <QuanitySelection 
          lineItem={lineItem}
          handleLineItemUpdate={handleLineItemUpdate}
          />
        </View>
        {lineItem.discountAllocations.length > 0 && (<View className="flex-row items-center mb-2">
          <TagIcon size={18} color="black" />
          <Text className="text-[14px] text-black text-normal ml-1">{discountTitle}</Text>
        </View>)}
        <View className="flex flex-row">
          { subTotalPriceOfLineitem > totalPriceOfLineitem && (<Text className="text-[16px] text-neutral-700 font-normal mr-4 line-through">
            {subTotalPriceOfLineitem} {costCurrencyCode}
          </Text>)}
          <Text className="text-[16px] text-black font-medium">
            {totalPriceOfLineitem} {costCurrencyCode}
          </Text>
        </View>
      </View>
      <View className="absolute right-4 top-1">
        <TouchableOpacity
          onPress={onRemove}
        >
          <TrashIcon size={24} color="black" strokeWidth={1} />
        </TouchableOpacity>
      </View>
    </View>

  );
}

const QuanitySelection = ({lineItem, handleLineItemUpdate}) => {
  const [ isBottomModalVisible, setBottomModalVisible ] = useState(false)
  const options = [
    {
      value: 1,
      label: "1",
    },
    {
      value: 2,
      label: "2",
    },
    {
      value: 3,
      label: "3",
    },
  ]

  const handleBottomCloseButton = () => {
    setBottomModalVisible(false)
  }

  const handleNumberPress = (quantity) => {
    handleLineItemUpdate([
      {
        id: lineItem?.id,
        quantity: quantity
      }
    ])
    setBottomModalVisible(false)
  }

  return (
      <View className="">
        <TouchableOpacity className="flex-row items-center" onPress={() => setBottomModalVisible(true)}>
          <Text className="">Qty {lineItem.quantity}</Text>
          <ChevronUpDownIcon size={22} color="black" />
        </TouchableOpacity>
        <BottomModal 
        visible={isBottomModalVisible}
        onClose={handleBottomCloseButton}
        >
          <View className="w-full pb-20">
            {options.map(item => (
              <Pressable
                key={item.label}
                onPress={() => handleNumberPress(item.value)}
                className="py-4 px-3 border-b border-gray-200 bg-white self-stretch items-center"
              >
                <Text className="text-[16px] text-black font-medium">{item.label}</Text>
              </Pressable>
            ))}
          </View>
        </BottomModal>
      </View>
  )
}