import { Image, View } from "react-native";
// import { Image } from "expo-image";
import swatchData from "../../assets/colorSwatchImages/swatchData.json";

const blurhash = "LEHV6nWB2yk8pyo0adR*.7kCMdnj";

export default function ColorSwatchImage({
  value,
  size = "md",
  disableWhenUnavailable,
  style,
}) {
  const activeColorSwatch = swatchData?.find(
    (item) => item?.name === value?.toLowerCase()?.replace(/\s+/g, "_")
  );
  const activeColorSwatchValue = activeColorSwatch?.value;

  let containerStyle;
  if (size === "sm") containerStyle = `w-3 h-3`;
  else if (size === "xs") containerStyle = `w-[10] h-[10]`;
  else if (size === "lg") containerStyle = `w-5 h-5`;
  else if (size === "xg") containerStyle = `w-7 h-7`;
  else containerStyle = `w-4 h-4`;

  if (disableWhenUnavailable && !activeColorSwatch) return null;

  return (
    <View
      style={style}
      className={`${containerStyle} rounded-full overflow-hidden ${
        value === "White" && "border-[.8px] border-gray-400"
      }`}
    >
      {/* {activeColorSwatchImageUrl && (<Image src={activeColorSwatchImageUrl} className="w-full h-full"/>)} */}

      {activeColorSwatch && (
        <View className="w-full h-full">
          {/* {activeColorSwatch.category === "url" ? (
            <Image
              style={{ flex: 1, width: "100%", backgroundColor: "gray" }}
              source={activeColorSwatchValue}
              placeholder={blurhash}
              contentFit="cover"
              transition={100}
            />
          ) : (
            <View
              style={{ backgroundColor: activeColorSwatchValue }}
              className="w-full h-full"
            ></View>
          )} */}
          <View
            style={{ backgroundColor: activeColorSwatchValue }}
            className="w-full h-full"
          ></View>
        </View>
      )}
      {!activeColorSwatchValue && (
        <Image
          source={require("../../assets/grid-placeholder-image.png")}
          className="w-full h-full"
        />
      )}
    </View>
  );
}
