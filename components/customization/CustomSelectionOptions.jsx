import { View } from "react-native"
import CustomSelection from "./CustomSelection"
import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";

const CustomSelectionOptions = ({
    type,
    activeSelections,
    handleSelections,
    initialCustomTextData,
    setTotalCustom,
    totalCustom,
    onClose,
    price,
    fontsLoaded,
    activeColorCode,
    activeFont,
    logoCollection,
    colorValues,

}) => {

    return (
        <View class="flex-1">
            {type === 'text-only' && (<CustomSelection
                  context="text-only"
                  activeSelections={activeSelections}
                  handleSelections={handleSelections}
                  initialCustomTextData={initialCustomTextData}
                  setTotalCustom={setTotalCustom}
                  totalCustom={totalCustom}
                  onClose={onClose}
                  price={price}
                  fontsLoaded={fontsLoaded}
                  activeColorCode={activeColorCode}
                  activeFont={activeFont}
                  logoCollection={logoCollection}
                  colorValues={colorValues}
                />)}
                {type === 'graphics-only' && (<CustomSelection
                  context="graphics-only"
                  activeSelections={activeSelections}
                  handleSelections={handleSelections}
                  initialCustomTextData={initialCustomTextData}
                  setTotalCustom={setTotalCustom}
                  totalCustom={totalCustom}
                  onClose={onClose}
                  price={price}
                  fontsLoaded={fontsLoaded}
                  activeColorCode={activeColorCode}
                  activeFont={activeFont}
                  logoCollection={logoCollection}
                  colorValues={colorValues}
                />)}

                {(type !== 'text-only' && type !== 'graphics-only') &&(<CustomSelection
                  activeSelections={activeSelections}
                  handleSelections={handleSelections}
                  initialCustomTextData={initialCustomTextData}
                  setTotalCustom={setTotalCustom}
                  totalCustom={totalCustom}
                  onClose={onClose}
                  price={price}
                  fontsLoaded={fontsLoaded}
                  activeColorCode={activeColorCode}
                  activeFont={activeFont}
                  logoCollection={logoCollection}
                  colorValues={colorValues}
                />)}
        </View>
    )
}

export default CustomSelectionOptions