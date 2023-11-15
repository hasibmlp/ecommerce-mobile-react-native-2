import { useContext } from "react";
import { ScrollView } from "react-native";

import SmallButton from "./Buttons/SmallButton";
import { SideBarContext } from "../../App";
import { filterActiveInputValues } from "../utils/UtilsFunctions";

export default function ActiveFilter ({style, showsWithActiveOnly=false}) {
     const {activeFilterInput} = useContext(SideBarContext)
    
    return (
        <ScrollView
            style={[style]}
            className="w-full"
            horizontal={true}
            showsHorizontalScrollIndicator={false}
        >
            {activeFilterInput && activeFilterInput.map((activeFilter, index) => {
                return <SmallButton key={index.toString()} title={filterActiveInputValues(activeFilter)} />
            })}
        </ScrollView>
    )
}
