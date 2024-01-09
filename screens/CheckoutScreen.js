import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect, useState } from "react";
import { Text, View } from "react-native";
import { WebView } from "react-native-webview";
import URLParse from 'url-parse'
import Overlay from "../components/Overlay";
import LoadingScreen from "../components/LoadingScreen";
import LoadingFullScreen from "../components/Sidebar/LoadingFullScreen";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../App";

export default function CheckoutScreen({ route }) {
  const [loading, setLoading] = useState(true);
  const user = useReactiveVar(userVar)

  const navigation = useNavigation();
  const { url } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Checkout'
    });
  }, []);

  const parseUrlParams = (url) => {
    const actualUrl = url?.split('?')[0]
    const queryString = url?.split('?')[1];
    const paramsArray = queryString?.split('&');
    const params = {};

    console.log(actualUrl)

    paramsArray?.forEach((param) => {
      const [key, value] = param.split('=');
      params[key] = value;
    });

    return {params, url: actualUrl};
  };


  return (
    <View className="flex-1">
        {loading && (<LoadingFullScreen />)}
      <WebView 
      onNavigationStateChange={(navState) => {
        const url = navState.url
        const { params } = parseUrlParams(url)
        const actualUrl = parseUrlParams(url).url
        const stepValue = params.step

        if(actualUrl === 'https://www.shopscrubsandclogs.com/account/login') {
          navigation.navigate( user ? 'MoreOptionHome' : 'AuthScreen') 
        }


        if(stepValue === 'contact_information'){

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
