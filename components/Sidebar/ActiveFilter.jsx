import { useContext } from "react";
import { Pressable, ScrollView, Text } from "react-native";
import SmallButton from "./Buttons/SmallButton";
import { SideBarContext } from "../../App";

export default function ActiveFilter ({style, showsWithActiveOnly=false}) {
     const {activeFilters} = useContext(SideBarContext)

     console.log('ACTIVE FILTERS: ', activeFilters)

    // if(showsWithActiveOnly === true) return null
    
    return (
        <ScrollView
            style={[style]}
            className="w-full"
            horizontal={true}
            showsHorizontalScrollIndicator={false}
        >
            {activeFilters && activeFilters.map((activeFilter, index) => {
                if(typeof activeFilter === 'object') return <SmallButton key={index.toString()} title={activeFilter.value} />
                return <SmallButton key={index.toString()} title={activeFilter} />
            })}

        </ScrollView>
    )
}