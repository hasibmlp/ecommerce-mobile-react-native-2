import { Pressable, Text, View } from "react-native"

export default function Panel({children, label, leftIcon, rightIcon, style, alignment="left", onPress}) {
    let alignmentStyle
     if(alignment === 'center') alignmentStyle = `items-center`
     else if (alignment === 'right') alignmentStyle = `items-end `
     else alignmentStyle = `items-start ${leftIcon && ''}`
  
    return(
      <Pressable style={style} onPress={onPress} className={`flex-row gap-x-1 items-center justify-center bg-white p-5`}>
        {leftIcon && (<View className="absolute left-5 ">{leftIcon}</View>)}
        {children && (<View className={`w-full ${alignmentStyle} ${leftIcon && 'pl-8'} ${rightIcon && 'pr-8'}`}>{children}</View>)}
        {label && !children && (<View className={` w-full ${alignmentStyle} ${leftIcon && 'pl-8'} ${rightIcon && 'pr-8'}`}><Text className={`text-[13px] text-black font-light`}>{label}</Text></View>)}
        {rightIcon && (<View className="absolute right-5 right-auto">{rightIcon}</View>)}
      </Pressable>
    )
  }