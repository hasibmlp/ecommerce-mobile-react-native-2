import { useContext } from "react";
import { ScrollView } from "react-native";

import SmallButton from "./Buttons/SmallButton";
import {} from "../../makeVars/MakeVars";
import { FilterSelectionContext } from "../../contexts/FilterSelectionContext";

export default function ActiveFilter({
  style,
  showsWithActiveOnly = false,
  activeFilterInput2,
}) {
  const activeFilterInput =
    activeFilterInput2 || useContext(FilterSelectionContext);

  return (
    <ScrollView
      style={[style]}
      className="w-full"
      horizontal={true}
      showsHorizontalScrollIndicator={false}
    >
      {activeFilterInput &&
        activeFilterInput.map((activeFilter, index) => {
          return (
            <SmallButton
              key={index.toString()}
              id={activeFilter.id}
              title={activeFilter.label}
            />
          );
        })}
    </ScrollView>
  );
}
