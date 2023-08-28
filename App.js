import { StatusBar } from "expo-status-bar";
import { SafeAreaView, Text, View } from "react-native";
import Hello from "./components/Hello";

import CardSlider from "./components/CardSlider";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "#ddd" }}>
        <View style={{ flex: 1 }}>
          <CardSlider />
        </View>
      </View>
    </SafeAreaView>
  );
}
