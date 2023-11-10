import { useContext } from "react"
import { Pressable, Text, View } from "react-native"
import { FilterContext } from "../SideBar"
import TickIcon from "../Icon/TickIcon"

export default function CheckButton ({option}) {
    const {activeFilters, setActiveFilters, setLoading} = useContext(FilterContext)
    const isActive = activeFilters.includes(option.title)

    const handlePress = () => {
        setLoading(true)
        setActiveFilters(prevState => {
            const prevActiveFilters = [...prevState]
            const filterIndex = prevActiveFilters.indexOf(option.title)
            console.log(filterIndex)

            if(filterIndex > -1) {
                prevActiveFilters.splice(filterIndex, 1)
                setTimeout(() => {setLoading(false), 5000})
                return prevActiveFilters
            }else {
                setTimeout(() => {setLoading(false), 5000})
                return [...prevActiveFilters, option.title]
            }
        })
    }

    return(
        <Pressable onPress={handlePress} className="flex-row items-center px-2 py-3">
                <View className={`w-[15px] h-[15px] border ${isActive ? 'bg-black' : ''} border-gray-500 rounded-[3px] items-center justify-center`}>
                {isActive && (<TickIcon />)}
                </View>
                <View className="ml-2">
                    <Text className="text-[14px] text-black font-light ">{option.title}</Text>
                    <Text className="text-[11px] text-gray-500 font-normal mt-1">{option.count} items</Text>
                </View>
        </Pressable>
    )
}