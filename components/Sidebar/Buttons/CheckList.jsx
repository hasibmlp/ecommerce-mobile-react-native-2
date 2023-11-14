import { useContext } from "react"
import { Pressable, Text, View } from "react-native"
import ColorSwatch from "../swatches/ColorSwatch"
import CheckBox from "../Checkbox"
import OptionLabel from "../OptionLabel"
import { SideBarContext } from "../../../App"

export default function CheckList ({option}) {
    const {activeFilters, setActiveFilters, setLoading, setActiveFilterInput} = useContext(SideBarContext)
    const isActive = activeFilters.includes(option.label)

    const input = JSON.parse(option.input)
    const varinatType = input?.variantOption?.name
    const color = varinatType === 'color' && option.label

    function deepEqual(object1, object2) {
        const keys1 = Object.keys(object1);
        const keys2 = Object.keys(object2);
      
        if (keys1.length !== keys2.length) {
          return false;
        }
      
        for (const key of keys1) {
          const val1 = object1[key];
          const val2 = object2[key];
          const areObjects = isObject(val1) && isObject(val2);
          if (
            areObjects && !deepEqual(val1, val2) ||
            !areObjects && val1 !== val2
          ) {
            return false;
          }
        }
      
        return true;
      }
      
      function isObject(object) {
        return object != null && typeof object === 'object';
      }

    const handlePress = () => {
        setLoading(true)
        setActiveFilters(prevState => {
            const prevActiveFilters = [...prevState]
            const filterIndex = prevActiveFilters.indexOf(option.label)

            if(filterIndex > -1) {
                prevActiveFilters.splice(filterIndex, 1)
                setTimeout(() => {setLoading(false), 5000})
                return prevActiveFilters
            }else {
                setTimeout(() => {setLoading(false), 5000})
                return [...prevActiveFilters, option.label]
            }
        })
        setActiveFilterInput(prevState => {
            const preFilterInputs = [...prevState]
            const inputIndex = preFilterInputs.findIndex(preFilter => deepEqual(preFilter, input))

            if(inputIndex > -1) {
                preFilterInputs.splice(inputIndex, 1)
                setTimeout(() => {setLoading(false), 5000})
                return preFilterInputs
            }else {
                setTimeout(() => {setLoading(false), 5000})
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