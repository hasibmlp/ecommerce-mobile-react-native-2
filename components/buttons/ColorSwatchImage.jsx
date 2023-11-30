import { Image, View } from 'react-native';

export default function ColorSwatchImage({activeColorUrl}) {
    return (
      <View className="w-4 h-4 rounded-full overflow-hidden mr-2">
        {activeColorUrl && (<Image src={activeColorUrl} className="w-full h-full"/>)}
        {!activeColorUrl && (<Image source={require('../../assets/grid-placeholder-image.png')} className="w-full h-full"/>)}
      </View>
    )
  }