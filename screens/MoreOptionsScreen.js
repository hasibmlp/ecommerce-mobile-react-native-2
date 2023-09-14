import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const TAB_WIDTH = 100
const TABS = ['Home', 'Search', 'Profile', 'MoreOption'];

export default function App() {
  const offset = useSharedValue(-TAB_WIDTH);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  const handlePress = (tab) => {
    const newOffset = (() => {
      switch (tab) {
        case 'Home':
          return -TAB_WIDTH;
        case 'Search':
          return 0;
        case 'Profile':
          return TAB_WIDTH;
        case 'MoreOption':
          return TAB_WIDTH + TAB_WIDTH;
        default:
          return -TAB_WIDTH;
      }
    })();

    offset.value = withTiming(newOffset);
  };

  return (
    <View style={styles.container}>
      <View className="items-center bg-lime-400">
          <View style={styles.tabs}>
            {TABS.map((tab, i) => (
              <Pressable
                key={tab}
                style={
                  i !== TABS.length - 1 ? [styles.tab, styles.divider] : styles.tab
                }
                onPress={() => handlePress(tab)}>
                <Text style={styles.tabLabel}>{tab}</Text>
              </Pressable>
            ))}
          </View>
          <Animated.View style={[styles.animatedBorder, animatedStyles]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    height: '100%',
    backgroundColor: 'green'
  },
  tabs: {
    flexDirection: 'row',
  },
  tab: {
    backgroundColor: 'blue',
    width: TAB_WIDTH,
  },
  tabLabel: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  divider: {
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  animatedBorder: {
    height: 8,
    width: 64,
    backgroundColor: 'tomato',
    borderRadius: 20,
  },
});