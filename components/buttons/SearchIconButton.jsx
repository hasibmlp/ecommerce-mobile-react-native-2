import { CommonActions, useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";

export default function ({ color = "black", style }) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: "SearchScreens",
              },
            ],
          })
        )
      }
      style={[style]}
      className="p-1"
    >
      <MagnifyingGlassIcon size={26} color={color} />
    </TouchableOpacity>
  );
}
