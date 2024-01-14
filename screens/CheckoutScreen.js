import { useNavigation } from "@react-navigation/native";
import { useEffect, useLayoutEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import URLParse from "url-parse";
import Overlay from "../components/Overlay";
import LoadingScreen from "../components/LoadingScreen";
import LoadingFullScreen from "../components/Sidebar/LoadingFullScreen";
import { useReactiveVar } from "@apollo/client";
import { cartVar, checkoutVisitedVar, userVar } from "../makeVars/MakeVars";
import Button from "../components/buttons/Button";

export default function CheckoutScreen({ route }) {
  const [loading, setLoading] = useState(true);
  const checkoutVisited = useReactiveVar(checkoutVisitedVar)
  // const url = route.params.url;
  const [ url, setUrl ] = useState(route.params.url)
  const navigation = useNavigation();

  console.log("CHECKOUT SCREEN RECIEVED URL: ", url)

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Checkout",
    });

  }, []);

  useEffect(() => {
    checkoutVisitedVar(true)
  },[]) 

  const parseUrlParams = (url) => {
    const actualUrl = url?.split("?")[0];
    const queryString = url?.split("?")[1];
    const paramsArray = queryString?.split("&");
    const params = {};

    paramsArray?.forEach((param) => {
      const [key, value] = param.split("=");
      params[key] = value;
    });

    return { params, url: actualUrl };
  };

  const handleShouldStartLoadWithRequest = (event) => {


    if(event.url === 'https://shopscrubsandclogs.com/') {
      return false
    }

    const actualUrl = event.url?.split("?")[0];
    // console.log('ON SHOUD LOAD : ', event)

     if(actualUrl === "https://www.shopscrubsandclogs.com/account/login"){
      navigation.navigate("AuthScreen") 
     return false
     }else if(actualUrl === 'https://www.shopscrubsandclogs.com/cart') {
      navigation.navigate("Cart") 
      return false
     }else if(actualUrl === 'https://www.shopscrubsandclogs.com/account/logout') {
      navigation.navigate("ProfileScreen", { intention: 'logout' })
      return false
     }
     else {
      return true
     }
  };

  return (
    <View className="flex-1">
      {loading && <LoadingFullScreen />}
      {/* <Button label="Press me" onPress={() => setUrl("https://www.shopscrubsandclogs.com/checkouts/cn/Z2NwLXVzLWVhc3QxOjAxSEtUNkNHNzU4NzVNWFZDR0pEWTk1SjMx")}/> */}
      <WebView
        allowsLinkPreview={false}
        // onNavigationStateChange={(navState) => {
        //   const url = navState.url;
        //   const { params } = parseUrlParams(url);
        //   const actualUrl = parseUrlParams(url).url;
        //   const stepValue = params.step;

        //   this.canGoBack = false;
        //   if (
        //     actualUrl === "https://www.shopscrubsandclogs.com/account/login"
        //   ) {
        //     // navigation.navigate("Cart")
        //     navigation.navigate("AuthScreen");
        //   }
        //   if (actualUrl === "https://www.shopscrubsandclogs.com/cart") {
        //     navigation.navigate("Cart");
        //   }

        //   this.canGoBack = false;
        //   return false;
        // }}
        originWhitelist={["*"]}
        source={{ uri: url }}
        style={{ flex: 1 }}
        onLoadEnd={() => {
          setLoading(false);
        }}
        onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
      />
    </View>
  );
}
