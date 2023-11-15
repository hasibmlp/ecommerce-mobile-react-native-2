import { useContext } from "react"
import { Pressable, View } from "react-native"

import ColorSwatch from "../swatches/ColorSwatch"
import CheckBox from "../Checkbox"
import OptionLabel from "../OptionLabel"
import { SideBarContext } from "../../../App"
import { deepEqual, isActiveFilterInputMatchesWithValue } from "../../utils/UtilsFunctions"

export default function CheckList ({option}) {
    const {setLoading, setActiveFilterInput, activeFilterInput} = useContext(SideBarContext)

    const isActive = isActiveFilterInputMatchesWithValue(activeFilterInput, option.label)

    const input = JSON.parse(option.input)
    const varinatType = input?.variantOption?.name
    const color = varinatType === 'color' && option.label

    const handlePress = () => {
        setLoading(true)
        setActiveFilterInput(prevState => {
            const preFilterInputs = [...prevState]
            const inputIndex = preFilterInputs.findIndex(preFilter => deepEqual(preFilter, input))

            if(inputIndex > -1) {
                preFilterInputs.splice(inputIndex, 1)
                setLoading(false)
                return preFilterInputs
            }else {
                setLoading(false)
                return [...preFilterInputs, input]
            }
        })
    }

    return(
        <Pressable onPress={handlePress} className="flex-row justify-between items-center px-2 py-3">
            <View className="flex-row items-center justify-between">
                <CheckBox active={isActive}/>
                <OptionLabel label={option.label} count={option.count}/>
            </View>
            {color && (<ColorSwatch color={color.toLowerCase()}/>)}
        </Pressable>
    )
}
