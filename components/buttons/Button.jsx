import { Text, TouchableOpacity } from "react-native";
const themeColor = 'bg-[#4baaca]'


export default function Button ({label, type='primary', size='md', style, flex, onPress, active=true }) {

    let buttonSize
    if(size === 'sm') buttonSize = {conntainer: 'p-2', text: 'text-[13px]'}
    else if(size === 'lg') buttonSize = {conntainer: 'py-5 px-8', text: 'text-[15px]'}
    else buttonSize = {conntainer: 'py-4 px-6', text: 'text-[14]'}

    let buttonStyle
    if (type === 'secondary')  buttonStyle =  {container: `bg-white border border-blue-300 rounded-[5px] ${buttonSize.conntainer}`, text: 'text-blue-500'}
    else if (type === 'action') buttonStyle =  {container: '', text: `text-red-800 underline ${buttonSize.text}`}
    else buttonStyle =  {container: `${themeColor} py-4 rounded-[5px] ${buttonSize.conntainer}`, text: 'text-white'}


    return (
        <TouchableOpacity disabled={!active} onPress={onPress} style={[style]} className={`${flex ? 'flex-1' : ''} ${buttonStyle.container} ${!active && 'bg-blue-200'} items-center`}>
            <Text className={`${buttonStyle.text} font-medium uppercase`}>{label}</Text>
        </TouchableOpacity>
    )
}