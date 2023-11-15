import { useContext, useState } from "react"
import { Pressable, Text } from "react-native"
import { XMarkIcon } from "react-native-heroicons/outline"
import { SideBarContext } from "../../../App"
import { filterActiveInputValues } from "../../utils/UtilsFunctions"

export default function SmallButton ({title, showsWithActiveOnly=true}) {
    const [active , setActive] = useState(true)
    const {setActiveFilterInput} = useContext(SideBarContext)
    const handlePress = () => {
        if(showsWithActiveOnly){
            setActiveFilterInput(prevState => {
                const prevActiveFilters = [...prevState]
                const filterIndex = prevActiveFilters.findIndex(prevActiveInput => filterActiveInputValues(prevActiveInput) === title)
                prevActiveFilters.splice(filterIndex, 1)
                return prevActiveFilters
            })
        }else{
            setActive(!active)
        }
    }

    return (
        <Pressable onPress={handlePress} className={`px-2 h-10 self-start rounded-[5px] ${active ? ' bg-black' : 'bg-white border border-gray-400'} mr-2 flex-row items-center`}>
            <Text className={`text-[14px] ${active ? 'text-white' : 'text-black'} font-normal uppercase`}>{title}</Text>
            {active && (<XMarkIcon size={18} color="white"/>)}
        </Pressable>
    )
}