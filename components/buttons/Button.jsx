import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { COLOR_THEME, FONT_FAMILY } from "../../theme";

const themeColor = "bg-[#4baaca]";

export default function Button({
  label,
  type = "primary",
  size = "md",
  style,
  textStyle,
  flex = true,
  onPress,
  active = true,
  colors = [],
  textColors = [],
  loading = false,
}) {
  const { container: buttonContainer, text: buttonText } =
    size === "sm"
      ? { container: "p-2", text: "text-[13px]" }
      : size === "lg"
      ? { container: "py-5 px-8", text: "text-[15px]" }
      : { container: "py-4 px-6", text: "text-[14]" };

  const buttonColor =
    type === "secondary"
      ? {
          container: active || !loading ? colors[0] : colors[1],
          text: active || !loading ? textColors[0] : textColors[1],
        }
      : type === "action"
      ? {
          container: {},
          text: active || !loading ? textColors[0] : textColors[1],
        }
      : {
          container: active || !loading ? colors[0] : colors[1],
          text: active || !loading ? textColors[0] : textColors[1],
        };

  const buttonStyle =
    type === "secondary"
      ? {
          container: `bg-white border ${
            colors.length > 0
              ? `border-[${colors[active ? 0 : 1]}]`
              : "border-blue-300"
          } rounded-[5px] ${buttonContainer}`,
          text: `${
            textColors.length > 0
              ? `text-[${textColors[active ? 0 : 1]}]`
              : "text-blue-300"
          }`,
        }
      : type === "action"
      ? {
          container: "",
          text: `${
            textColors.length > 0
              ? `text-[${textColors[active ? 0 : 1]}]`
              : "text-[#89c157]"
          } underline ${buttonText}`,
        }
      : {
          container: `${
            colors.length > 0 ? `bg-${colors[active ? 0 : 1]}` : themeColor
          } py-4 rounded-[5px] ${buttonContainer}`,
          text: `${
            textColors.length > 0
              ? `text-[${textColors[active ? 0 : 1]}]`
              : "text-white"
          }`,
        };

  const containerClasses = `justify-center ${
    flex ? "self-stretch" : "self-center"
  } ${buttonStyle.container} items-center h-14`;

  return (
    <TouchableOpacity
      disabled={loading || !active}
      onPress={onPress}
      style={[
        style,
        {
          backgroundColor:
            colors.length === 0
              ? ["action", "secondary"].includes(type)
                ? "transparent"
                : COLOR_THEME.primary
              : buttonStyle.container,
        },
      ]}
      className={containerClasses}
    >
      {!loading && (
        <Text
          style={[
            textStyle,
            {
              color: textColors.length > 0 ? buttonColor.text : type === 'primary' ? '#fff' : 'black',
            },
            FONT_FAMILY.font_3
          ]}
          className={`${buttonStyle.text} font-normal uppercase`}
        >
          {label}
        </Text>
      )}
      {loading && <ActivityIndicator color={'white'} />}
    </TouchableOpacity>
  );
}
