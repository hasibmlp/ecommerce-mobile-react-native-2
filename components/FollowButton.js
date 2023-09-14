import { useState } from "react";
import { Pressable, Text } from "react-native";
import { StarIcon } from "react-native-heroicons/outline";

export default function FollowButton() {
  const [follow, setFollow] = useState(false);

  return (
    <Pressable
      onPress={() => setFollow(!follow)}
      className="flex-row items-center border-[.5px] rounded-[3px] border-black py-[2px] px-2"
    >
      {follow ? (
        <StarIcon size={18} color="black" fill="black" />
      ) : (
        <StarIcon size={18} color="black" />
      )}

      <Text className="ml-1 text-[11px] text-black font-medium uppercase">
        follow
      </Text>
    </Pressable>
  );
}
