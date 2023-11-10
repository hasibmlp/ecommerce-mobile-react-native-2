import React from 'react';
import { View } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';

const TickIcon = () => {
  return (
    <View>
      <Svg
        fill="#ffffff"
        width="20"
        height="20"
        viewBox="0 0 1024 1024"
        xmlns="http://www.w3.org/2000/svg"
        stroke="#ffffff"
      >
        <G id="SVGRepo_bgCarrier" strokeWidth="0" />
        <G
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="#CCCCCC"
          strokeWidth="8.192"
        />
        <G id="SVGRepo_iconCarrier">
          <Path d="M760 380.4l-61.6-61.6-263.2 263.1-109.6-109.5L264 534l171.2 171.2L760 380.4z" />
        </G>
      </Svg>
    </View>
  );
};

export default TickIcon;
