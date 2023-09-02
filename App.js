import { StatusBar } from "expo-status-bar";
import { SafeAreaView, Text, View } from "react-native";
import Hello from "./components/Hello";

import CardSlider from "./components/CardSlider";
import AppNavigation from "./navigation/AppNavigation";

export default function App() {
  return (
    <AppNavigation />
  );
}
