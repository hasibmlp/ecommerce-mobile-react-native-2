import { useContext } from "react";
import { Pressable, View } from "react-native";

import ColorSwatch from "../swatches/ColorSwatch";
import CheckBox from "./Checkbox";
import OptionLabel from "../OptionLabel";
import { SideBarContext } from "../../../makeVars/MakeVars";
import { isFilterValueActive } from "../../utils/UtilsFunctions";
import { FilterSelectionContext } from "../../utils/UtilsFunctions";

export default function CheckList({ option, setLoading, setActiveFilterInput, activeFilterInput }) {
  let isActive = isFilterValueActive(activeFilterInput, option);

  const input = JSON.parse(option.input);
  const filterValue = { id: option.id, input: input, label: option.label };
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
        return preFilterInputs;
      } else {
        // setLoading(false)
        return [...preFilterInputs, filterValue];
      }
    });
  };

  return (
    <Pressable
      onPress={handlePress}
      className="flex-row justify-between items-center px-2 py-3"
    >
      <View className="flex-row items-center justify-between">
        <CheckBox active={isActive} />
        <OptionLabel label={option.label} count={option.count} />
      </View>
      {color && <ColorSwatch color={color.toLowerCase()} />}
    </Pressable>
  );
}
