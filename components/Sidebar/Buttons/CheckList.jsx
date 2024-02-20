import { useContext, useEffect, useState } from "react";
import { Pressable, TouchableOpacity, View } from "react-native";

import ColorSwatch from "../swatches/ColorSwatch";
import CheckBox from "./Checkbox";
import OptionLabel from "../OptionLabel";
import { SideBarContext } from "../../../makeVars/MakeVars";
import { isFilterValueActive } from "../../utils/UtilsFunctions";
import { FilterSelectionContext } from "../../utils/UtilsFunctions";
import ColorSwatchImage from "../../buttons/ColorSwatchImage";

export default function CheckList({
  option,
  setLoading,
  setActiveFilterInput,
  activeFilterInput,
  active,
  loading,
  activeTabLabel,
}) {
  const isChecked = activeFilterInput.some((i) => i.id === option.id);

  const input = JSON.parse(option.input);
  const varinatType = input?.variantOption?.name;
  const color = varinatType === "color" && option.label;

  const handlePress = () => {
    setLoading(true);
    setActiveFilterInput((prevState) => {
      const preFilterInputs = [...prevState];
      const inputIndex = preFilterInputs.findIndex(
        (preFilter) => preFilter.id === option.id
      );

      if (inputIndex > -1) {
        preFilterInputs.splice(inputIndex, 1);
        // setLoading(false)
      } else {
        // setLoading(false)
        preFilterInputs.push({
          id: option.id,
          input: input,
          label: option.label,
          totalCount: option.count,
          parent: activeTabLabel,
        });
      }
      return preFilterInputs;
    });
  };
  

  return (
    <TouchableOpacity
      disabled={loading}
      onPress={handlePress}
      className="flex-row justify-between items-center px-2 py-3"
    >
      <View className="flex-row items-center justify-between">
        <CheckBox active={isChecked} />
        <OptionLabel label={option.label} count={option.count} />
      </View>
      {/* {color && <ColorSwatchImage value={color} size="lg" />} */}
    </TouchableOpacity>
  );
}
