import { Share, TouchableOpacity } from "react-native"
import { ArrowUpTrayIcon } from "react-native-heroicons/outline"

export default function ShareButton({title, url, message, color='black', size=24}) {

    const onShare = async () => {
      const result = await Share.share({
        title: title,
        message: message, 
        url: url, 
      })
    }
    return (
      <TouchableOpacity onPress={onShare} className="p-1 items-center justify-center absolute right-4 " >
        <ArrowUpTrayIcon size={size} color={color} strokeWidth={1}/>
      </TouchableOpacity>
    )
  }