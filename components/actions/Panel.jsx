import { Pressable, Text, View } from "react-native"

export default function Panel({children, label, leftIcon, rightIcon, style, alignment="left", onPress}) {
    let alignmentStyle
     if(alignment === 'center') alignmentStyle = `items-center`
     else if (alignment === 'right') alignmentStyle = `items-end `
     else alignmentStyle = `items-start ${leftIcon && ''}`
  
    // return(
    //   <Pressable style={style} onPress={onPress} className={`flex-row gap-x-1 items-center justify-center bg-white p-5`}>
    //     {leftIcon && (<View className="absolute left-5 ">{leftIcon}</View>)}
    //     {children && (<View className={`w-full ${alignmentStyle} ${leftIcon && 'pl-8'} ${rightIcon && 'pr-8'}`}>{children}</View>)}
    //     {label && !children && (<View className={` w-full ${alignmentStyle} ${leftIcon && 'pl-8'} ${rightIcon && 'pr-8'}`}><Text className={`text-[13px] text-black font-light`}>{label}</Text></View>)}
    //     {rightIcon && (<View className="absolute right-5 ">{rightIcon}</View>)}
    //   </Pressable>
    // )
    return (
      <Pressable onPress={onPress} style={style} className="flex-row bg-white min-h-[60px]">
        {leftIcon && (<View className="min-w-[50px] max-w-[100px] items-center justify-center p-2">{leftIcon}</View>)}
        <View className={`flex-1 justify-center ${alignmentStyle}`}>
          {children && (<View className={`flex-1 justify-center ${alignmentStyle}`}>{children}</View>)}
          {label && !children && (<Text className={`text-[13px] text-black font-light`}>{label}</Text>)}
        </View>
        {rightIcon && (<View className="min-w-[50px] items-center justify-center p-2">
          {rightIcon}
        </View>)}
      </Pressable>
    )
  }