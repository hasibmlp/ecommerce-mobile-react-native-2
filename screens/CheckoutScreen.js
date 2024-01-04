import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect, useState } from "react";
import { Text, View } from "react-native";
import { WebView } from "react-native-webview";
import URLParse from 'url-parse'
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

  const parseUrlParams = (url) => {
    const queryString = url.split('?')[1];
    const paramsArray = queryString.split('&');
    const params = {};

    paramsArray.forEach((param) => {
      const [key, value] = param.split('=');
      params[key] = value;
    });

    return params;
  };


  return (
    <View className="flex-1">
        {loading && (<LoadingScreen />)}
      <WebView 
      onNavigationStateChange={(navState) => {
        const url = navState.url
        const params = parseUrlParams(url)
        const stepValue = params.step
        console.log("SKBVAOIDFAJFOWEJOSFJ",stepValue)
        console.log(navState)
        if(stepValue === 'contact_information'){
          console.log("CONTANCT INFORMATION HIT")
          navigation.navigate("ShippingAddressUpdateScreen", {shippingFormVisible : true})
        }else if (stepValue === 'shipping_method') {
          // navigation.navigate("CheckoutReviewScreen")
        } 
        this.canGoBack = false;
        return false
      }}
      originWhitelist={['*']} source={{ uri: url }} style={{ flex: 1 }} onLoadEnd={() => {setLoading(false)}} />
    </View>
  );
}
