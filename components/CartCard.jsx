import { useState } from "react";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import {
  ChevronUpDownIcon,
  TagIcon,
  TrashIcon,
} from "react-native-heroicons/outline";
import BottomModal from "./Modal/BottomModal";
import Button from "./buttons/Button";
import ScreenModal from "./Modal/ScreenModal";
import { FONT_FAMILY } from "../theme";

export default function CartCard({
  lineItem,
  assignedCustomProduct,
  onRemove,
  handleLineItemUpdate,
  onRemoveCustomProduct,
}) {
  const totalPriceOfLineitem = lineItem.cost.totalAmount.amount;
  const subTotalPriceOfLineitem = lineItem.cost.subtotalAmount.amount;
  const costCurrencyCode = lineItem.cost.totalAmount.currencyCode;
  const totalCustomProduct =
    assignedCustomProduct?.node?.cost?.totalAmount?.amount;

  const discountTitle =
    lineItem?.discountAllocations[0]?.title ||
    lineItem?.discountAllocations[0]?.code;

  const parseString = (value) => {
    let parse;
    try {
      parse = JSON.parse(value);
    } catch (error) {}
    return parse;
  };


  const customSelectionId = lineItem?.attributes.find(
    (item) => item.key === "custom-selection-uid"
  )?.value;
  const customSelections = assignedCustomProduct?.node?.attributes.find(
    (item) => item.key === "custom-selection"
  )?.value;

  const customSelectionsParse = parseString(customSelections);
  const customSelectionKeys = Object.keys(customSelectionsParse ?? {});

  const handleCustomProductRemove = () => {

  }

  // console.log(selectedCustomProuduct[1].attribute);
  // console.log(lineItem?.attribute?.value)

  // if (isServiceProduct)
  //   return (
  //     <View className="bg-white flex flex-row items-center mt-0">
  //       <View className="w-full flex flex-col px-5">
  //         <View className="flex-row justify-between">
  //           <Text className="text-[16px] text-black font-medium mb-3">
  //             {lineItem.merchandise.product.title}
  //           </Text>

  //           <View className="flex flex-row">
  //             <Text className="text-[16px] text-black font-medium">
  //               +{totalPriceOfLineitem} {costCurrencyCode}
  //             </Text>
  //           </View>
  //         </View>

  //         {customSelectionKeys.length > 0 && (
  //           <View className="mb-4">
  //             <View className="w-full flex-row justify-between">
  //               <Text className="text-base text-black font-medium">
  //                 Custom selection
  //               </Text>
  //               <View className="absolute right-0 top-1">
  //                 <Button
  //                   onPress={onRemove}
  //                   label="remove"
  //                   type="action"
  //                   flex="false"
  //                 />
  //               </View>
  //             </View>
  //             <View className="">
  //               {customSelectionKeys.map((item) => (
  //                 <Text>
  //                   {item} : {customSelectionsParse[item]},{" "}
  //                 </Text>
  //               ))}
  //             </View>
  //           </View>
  //         )}
  //       </View>
  //     </View>
  //   );

  console.log(assignedCustomProduct);

  return (
    <View>
      <View className="bg-white flex flex-row py-4 px-2 items-center mt-3">
        {lineItem.merchandise.image?.url && (
          <Image
            className="h-[140px] w-[100px] rounded-[10px]"
            src={lineItem.merchandise.image.url}
            alt={lineItem.merchandise.image.altText}
          />
        )}
        <View className="flex flex-col ml-4 w-[55%]">
          <Text style={FONT_FAMILY.primary} className="text-[16px] text-black font-normal mb-3">
            {lineItem.merchandise.product.title}
          </Text>
          <View className="text-[13px] text-gray-600 font-light flex-row mb-2">
            {lineItem.merchandise.selectedOptions.map((option, index) => (
              <Text style={FONT_FAMILY.primary} key={index} className={`mr-5 `}>
                {option.value}
              </Text>
            ))}
            <QuanitySelection
              lineItem={lineItem}
              handleLineItemUpdate={handleLineItemUpdate}
              assignedCustomProduct={assignedCustomProduct}
              customSelections={customSelections}
              customSelectionId={customSelectionId}
            />
          </View>
          {lineItem.discountAllocations.length > 0 && (
            <View className="flex-row items-center mb-2">
              <TagIcon size={18} color="black" />
              <Text style={FONT_FAMILY.primary} className="text-[14px] text-black text-normal ml-1">
                {discountTitle}
              </Text>
            </View>
          )}

          <View className="flex flex-row">
            {subTotalPriceOfLineitem > totalPriceOfLineitem && (
              <Text style={FONT_FAMILY.primary} className="text-[16px] text-neutral-700 font-normal mr-4 line-through">
                {subTotalPriceOfLineitem} {costCurrencyCode}
              </Text>
            )}
            <Text style={FONT_FAMILY.primary} className="text-[16px] text-black font-noraml">
              {totalPriceOfLineitem} {costCurrencyCode}
            </Text>
          </View>
        </View>
        <View className="absolute right-4 top-1">
          <TouchableOpacity onPress={onRemove}>
            <TrashIcon size={24} color="black" strokeWidth={1} />
          </TouchableOpacity>
        </View>
      </View>

      {assignedCustomProduct && (
        <View className="bg-white flex flex-row items-center mt-0">
          <View className="w-full flex flex-col px-5">
            <View className="flex-row justify-between">

              <Text style={FONT_FAMILY.primary}  className="text-[16px] text-black font-medium mb-3">
                {assignedCustomProduct.node?.merchandise?.product?.title}
              </Text>

              <View className="flex flex-row">
                <Text style={FONT_FAMILY.primary} className="text-[16px] text-black font-medium">
                  +{totalCustomProduct} {costCurrencyCode}
                </Text>
              </View>
            </View>

            {customSelectionKeys.length > 0 && (
              <View className="mb-4">
                <View className="w-full flex-row justify-between">
                  <Text style={FONT_FAMILY.primary} className="text-base text-black font-medium">
                    Custom selection
                  </Text>
                  <View className="absolute right-0 top-1">
                    <Button
                      onPress={onRemoveCustomProduct}
                      label="remove"
                      type="action"
                      flex="false"
                    />
                  </View>
                </View>
                <View className="">
                  {customSelectionKeys.map((item, index) => (
                    <Text style={FONT_FAMILY.primary} key={index.toString()}>
                      {item} : {customSelectionsParse[item]},{" "}
                    </Text>
                  ))}
                </View>
              </View>
            )}

            {/* <ScreenModal>
              <View className="flex-1">

              </View>
            </ScreenModal> */}

          </View>
        </View>
      )}
    </View>
  );
}

const QuanitySelection = ({
  lineItem,
  handleLineItemUpdate,
  assignedCustomProduct,
  customSelections,
  customSelectionId
}) => {
  const [isBottomModalVisible, setBottomModalVisible] = useState(false);
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
  ];

  const handleBottomCloseButton = () => {
    setBottomModalVisible(false);
  };

  const handleNumberPress = (quantity) => {
    handleLineItemUpdate(
      assignedCustomProduct
        ? [
            {
              id: assignedCustomProduct?.node?.id,
              quantity: quantity,
              attributes: [
                {
                  key: "custom-selection-uid",
                  value: customSelectionId,
                },
                {
                  key: "custom-product-uid",
                  value: customSelectionId,
                },
                {
                  key: "custom-selection",
                  value: customSelections,
                },
              ],
            },
            {
              id: lineItem?.id,
              quantity: quantity,
              attributes: [
                {
                  key: "custom-selection-uid",
                  value: customSelectionId,
                },
              ],
            },
          ]
        : [
            {
              id: lineItem?.id,
              quantity: quantity,
            },
          ]
    );
    setBottomModalVisible(false);
  };

  return (
    <View className="">
      <TouchableOpacity
        className="flex-row items-center"
        onPress={() => setBottomModalVisible(true)}
      >
        <Text style={FONT_FAMILY.primary} className="">Qty {lineItem.quantity}</Text>
        <ChevronUpDownIcon size={22} color="black" />
      </TouchableOpacity>
      <BottomModal
        visible={isBottomModalVisible}
        onClose={handleBottomCloseButton}
      >
        <View className="w-full pb-20">
          {options.map((item) => (
            <Pressable
              key={item.label}
              onPress={() => handleNumberPress(item.value)}
              className="py-4 px-3 border-b border-gray-200 bg-white self-stretch items-center"
            >
              <Text style={FONT_FAMILY.primary} className="text-[16px] text-black font-normal">
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </BottomModal>
    </View>
  );
};
