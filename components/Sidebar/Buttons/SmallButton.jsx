import { useContext } from "react"
import { Pressable, Text } from "react-native"
import { FilterContext } from "../SideBar"

export default function SmallButton ({title}) {
    const {setActiveFilters} = useContext(FilterContext)
    const handlePress = () => {
        setActiveFilters(prevState => {
            const prevActiveFilters = [...prevState]
            const filterIndex = prevActiveFilters.indexOf(title)
            prevActiveFilters.splice(filterIndex, 1)
            return prevActiveFilters
        })
    }

    return (
        <Pressable onPress={handlePress} className="px-2 py-2.5 self-start rounded-[5px] bg-black mr-2">
            <Text className="text-[12px] text-white font-medium uppercase">{title}</Text>
        </Pressable>
    )
}