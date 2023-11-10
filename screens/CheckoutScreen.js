import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect, useState } from "react";
import { Text, View } from "react-native";
import { WebView } from "react-native-webview";
import Overlay from "../components/Overlay";
import LoadingScreen from "../components/LoadingScreen";

export default function CheckoutScreen({ route }) {
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();
  const { url } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Checkout'
    });
  }, []);

  return (
    <View className="flex-1">
        {loading && (<LoadingScreen />)}
      <WebView originWhitelist={['*']} source={{ uri: url }} style={{ flex: 1 }} onLoadEnd={() => {setLoading(false)}} />
    </View>
  );
}
