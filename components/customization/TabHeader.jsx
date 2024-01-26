import { Pressable, Text, View } from "react-native"
import { CheckCircleIcon } from "react-native-heroicons/outline"
import { FONT_FAMILY } from "../../theme"

const TabHeader = ({title, active, onPress, selected}) => {
    return (
      <Pressable className="flex-1 py-3 items-center border-r border-gray-200 flex-row justify-center" onPress={onPress}>
        <Text style={FONT_FAMILY.primary} className={`text-[16px] ${active ? 'text-[#89c157] font-bold' : 'text-black font-normal'}  font-normal`}>{title}</Text>
        {selected && (<View className="absolute right-5"> 
          <CheckCircleIcon size={24} color={'#89c157'} />
        </View>)}
      </Pressable>
    )
  }

export default TabHeader