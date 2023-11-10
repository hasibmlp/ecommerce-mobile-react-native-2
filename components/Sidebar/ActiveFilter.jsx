import { useContext } from "react";
import { Pressable, ScrollView, Text } from "react-native";
import { FilterContext } from "./SideBar";
import SmallButton from "./Buttons/SmallButton";

export default function () {
     const {activeFilters} = useContext(FilterContext)
    console.log('ACTIVEFILTERS', activeFilters) 
    
    return (
        <ScrollView
            className="w-full px-2 py-3"
            horizontal={true}
            showsHorizontalScrollIndicator={false}
        >
            {activeFilters && activeFilters.map((activeFilter, index) => { 
                return <SmallButton key={index.toString()} title={activeFilter} />
            })}

        </ScrollView>
    )
}