import { useKeenSliderNative } from "keen-slider/react-native";
import { Text, View } from "react-native";

export default () => {
  const slides = 4;
  const slider = useKeenSliderNative({
    slides, 
  });

  return (
    <View className="w-full h-[50px] bg-green-500" {...slider.containerProps}>
      {[...Array(slides).keys()].map((id) => {
        return (
          <View key={id} {...slider.slidesProps[id]}>
            <Text>Slide {id}</Text>
          </View>
        );
      })}
    </View>
  );
};
