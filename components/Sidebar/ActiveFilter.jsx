import { useContext } from "react";
import { ScrollView } from "react-native";
import SmallButton from "./Buttons/SmallButton";
import { SideBarContext } from "../../App";

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

function filterActiveInputValues(activeFilter) {
    let activeValue
    if(activeFilter['price']){
        activeValue = activeFilter['price'].min + ' - ' + activeFilter['price'].max
    }else {
        const activeValuesObject = Object.values(activeFilter)
        if(typeof activeValuesObject[0] === 'object') {
            activeValue = activeValuesObject[0].value
        }else{
            activeValue = activeValuesObject[0]
        }
    }
    console.log("ACTIVE VALUE: ",activeValue)
    return activeValue
}