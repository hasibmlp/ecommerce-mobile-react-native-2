import { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import VariantHeader from "./VariantHeader";
import VariantOption from "./VariantOption";
import Button from "../buttons/Button";
import ModalSkeleton from "./ModalSkeleton";

export default function VariantSelectionModalContent({handleClose, context}) {
  const {options, handleAddCartBtn, activeColor, activeSize, activeType, isCurrentlyInStock} = useContext(context)
  const [isVariantInStock, setVariantInStock] = useState(true)
  const [buttonActive, setButtonActive ] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    options && setLoading(false)
  },[options])

  useEffect(() => {
      const optionArray = []
      activeColor && !optionArray.includes(option => option?.name === 'Color') &&  optionArray.push(activeColor)
      activeSize && !optionArray.includes(option => option === activeSize) && optionArray.push(activeSize)
      activeType && !optionArray.includes(option => option === activeType) && optionArray.push(activeType)

    if(optionArray.length === options?.length && (activeColor || activeSize || activeType)) {
       setVariantInStock(isCurrentlyInStock())
       setButtonActive(true)
    }
  },[activeColor, activeSize, activeType])
    
    return (
      <View className="items-center justify-center bg-white">
        <View className="pb-10 pt-5 self-stretch">
          <View className="">
            <VariantHeader handleClose={handleClose} />
            {!options && <ModalSkeleton />}
            {options && options.map((option, index) => (
              <VariantOption
                key={index.toString()}
                option={option}
                context={context}
              />
              ))}
          </View>
          <Button label={`${isVariantInStock ? 'Add to cart' : 'Notify me'}`} size="md" onPress={isVariantInStock ? handleAddCartBtn : () => {}} active={buttonActive} style={{marginVertical: 12, marginHorizontal: 20}}/>
        </View>
      </View>
      )
  }