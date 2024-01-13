import { Text, TouchableOpacity, View } from "react-native";
import React, { Component, useState } from "react";
import { HeartIcon } from "react-native-heroicons/outline";

export default function HeartButton() {
  const [favourite, setFavourite] = useState(false);
  return (
    <TouchableOpacity
      onPress={() => setFavourite(!favourite)}
      className="bg-white h-[50px] w-[50px] rounded-full items-center justify-center absolute z-1 right-[15px] -top-[25px] shadow-sm"
    >
      {favourite ? (
        <HeartIcon
          color="black"
          size={30}
          strokeWidth={1}
          fill="red"
          stroke="red"
        />
      ) : (
        <HeartIcon color="black" size={30} strokeWidth={1} />
      )}
    </TouchableOpacity>
  );
}
