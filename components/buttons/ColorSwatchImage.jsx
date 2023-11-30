import { Image, View } from 'react-native';
import { GET_COLOR_SWATCH_IMAGES } from '../../graphql/queries';
import { useQuery } from '@apollo/client';

export default function ColorSwatchImage({value, size='md', disableWhenUnavailable, style}) {
  const {data, loading, error} = useQuery(GET_COLOR_SWATCH_IMAGES)
  const COLOR_SWATCH_IMAGES = data && JSON.parse(data?.collection?.metafield?.value)
  const activeColorSwatchImageUrl = COLOR_SWATCH_IMAGES?.find(item => item?.value === value?.toLowerCase()?.replace(/\s+/g, '_'))?.url

  let containerStyle 
  if(size === 'sm') containerStyle = `w-3 h-3`
  else if (size === 'lg') containerStyle = `w-5 h-5`
  else  containerStyle = `w-4 h-4`

  if(disableWhenUnavailable && !activeColorSwatchImageUrl) return null

    return (
      <View style={style} className={`${containerStyle} rounded-full overflow-hidden ${value === 'White' && 'border-[.8px] border-gray-400'}`}>
        {activeColorSwatchImageUrl && (<Image src={activeColorSwatchImageUrl} className="w-full h-full"/>)}
        {!activeColorSwatchImageUrl && (<Image source={require('../../assets/grid-placeholder-image.png')} className="w-full h-full"/>)}
      </View>
    )
  }