import { Text, TouchableOpacity } from "react-native";

const themeColor = 'bg-[#4baaca]';

export default function Button({
  label,
  type = 'primary',
  size = 'md',
  style,
  textStyle,
  flex = true,
  onPress,
  active = true,
  colors=[],
  textColors=[],
}) {
  console.log("Color: ",colors[active? 0 : 1])
  const { container: buttonContainer, text: buttonText } =
    size === 'sm'
      ? { container: 'p-2', text: 'text-[13px]' }
      : size === 'lg'
      ? { container: 'py-5 px-8', text: 'text-[15px]' }
      : { container: 'py-4 px-6', text: 'text-[14]' };

  const buttonStyle =
    type === 'secondary'
      ? {
          container: `bg-white border ${colors ? `border-[${colors[active ? 0 : 1]}]` : 'border-blue-300'} rounded-[5px] ${buttonContainer}`,
          text: `${textColors ? `text-[${textColors[active ? 0 : 1]}]` : 'text-blue-300'}`,
        }
      : type === 'action'
      ? {
          container: '',
          text: `${textColors ? `text-[${textColors[active ? 0 : 1]}]` : 'text-[#89c157]'} underline ${buttonText}`,
        }
      : {
          container: `${colors ? `bg-[${colors[active ? 0 : 1]}]` : themeColor} py-4 rounded-[5px] ${buttonContainer}`,
          text: `${textColors ? `text-[${textColors[active ? 0 : 1]}]` : 'text-white'}`,
        };

  const containerClasses = `${flex ? 'self-stretch' : 'self-center'} ${buttonStyle.container} items-center`;

  return (
    <TouchableOpacity disabled={!active} onPress={onPress} style={[style]} className={containerClasses}>
      <Text style={textStyle} className={`${buttonStyle.text} font-medium uppercase`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
