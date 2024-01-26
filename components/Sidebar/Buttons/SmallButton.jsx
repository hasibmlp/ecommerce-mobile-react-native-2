import { useContext, useState } from "react"
import { Pressable, Text, TouchableOpacity } from "react-native"
import { XMarkIcon } from "react-native-heroicons/outline"
import { SideBarContext } from "../../../makeVars/MakeVars"
import { FilterSelectionContext } from "../../../contexts/FilterSelectionContext"

export default function SmallButton ({title, id, showsWithActiveOnly=true, setActiveFilterInput, setLoading}) {
    const [active , setActive] = useState(true)
    const handlePress = () => {
        setLoading(true)
        if(showsWithActiveOnly){
            setActiveFilterInput(prevState => {
                const prevActiveFilters = [...prevState]
                const filterIndex = prevActiveFilters.findIndex(prevActiveInput => prevActiveInput.id === id)
                prevActiveFilters.splice(filterIndex, 1)
                return prevActiveFilters
            })
        }else{
            setActive(!active)
        }
    }

    return (
        <TouchableOpacity onPress={handlePress} className={`px-2 h-10 self-start rounded-[5px] ${active ? ' bg-black' : 'bg-white border border-gray-400'} mr-2 flex-row items-center`}>
            <Text className={`text-[14px] ${active ? 'text-white' : 'text-black'} font-normal uppercase`}>{title}</Text>
            {active && (<XMarkIcon size={18} color="white"/>)}
        </TouchableOpacity>
    )
}