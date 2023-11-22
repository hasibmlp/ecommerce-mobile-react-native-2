import { useContext } from "react";
import { ScrollView } from "react-native";

import SmallButton from "./Buttons/SmallButton";
import { SideBarContext } from "../../App";
import { filterActiveInputValues } from "../utils/UtilsFunctions";
import { FilterSelectionContext } from "../../contexts/FilterSelectionContext";

export default function ActiveFilter ({style, showsWithActiveOnly=false}) {
     const {activeFilterInput} = useContext(FilterSelectionContext)
    
    return (
        <ScrollView
            style={[style]}
            className="w-full"
            horizontal={true}
            showsHorizontalScrollIndicator={false}
        >
            {activeFilterInput && activeFilterInput.map((activeFilter, index) => {
                return <SmallButton key={index.toString()} id={activeFilter.id} title={activeFilter.label} />
            })}
        </ScrollView>
    )
}
