import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { HeaderBackButton } from "@react-navigation/elements";
import {
  ShoppingBagIcon,
  HomeIcon,
  EllipsisHorizontalIcon,
  MagnifyingGlassIcon,
  RectangleStackIcon,
} from "react-native-heroicons/outline";
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from "../screens/HomeScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import FavouriteScreen from "../screens/FavouriteScreen";
import NotificationScreen from "../screens/NotificationScreen";
import CartScreen from "../screens/CartScreen";
import MoreOptionsScreen from "../screens/MoreOptionsScreen";
import SearchScreen from "../screens/SearchScreen";
import CategoriesScreen from "../screens/CategoriesScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import CheckoutShippingAddressUpdate from "../components/CheckoutShippingAddressUpdate";
import CheckoutReview from "../components/CheckoutReview";
import Collection from "../components/Collection";
import AuthScreen from "../screens/AuthScreen";
import UserAndAddress from "../components/cart/UserAndAddress";
import InitialSplashScreen from "../components/splash/InitialSplashScreen";
import { useEffect, useState } from "react";
import { cartIdVar, cartVar, userVar } from "../App";
import { useLazyQuery, useMutation, useReactiveVar } from "@apollo/client";
import { GET_CART_DETAILS, GET_CART_DETAILS_V2, GET_CUSTOMER } from "../graphql/queries";
import ProfileScreen from "../screens/ProfileScreen";
import { CREATE_CART } from "../graphql/mutations";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

export function Home() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Home" }}
      />
      <Stack.Screen
        name="Collection"
        component={Collection}
        options={{ title: "Collection" }}
      />
      <Stack.Screen
        name="ProductDetailScreen"
        component={ProductDetailScreen}
      />
      <Stack.Screen name="FavouriteScreen" component={FavouriteScreen} />
      <Stack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
      />
    </Stack.Navigator>
  );
}

export function CartScreens() {
  const navigation = useNavigation();
  return (
    <Stack.Navigator>
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
      <Stack.Screen
        name="ShippingAddressUpdateScreen"
        component={CheckoutShippingAddressUpdate}
        options={{ title: "Shipping Address" }}
      />
      <Stack.Screen name="UserAndAddressScreen" component={UserAndAddress}/>
      <Stack.Screen
        name="CheckoutReviewScreen"
        component={CheckoutReview}
        options={{
          title: "Checkout Review",
          headerLeft: () => (
            <HeaderBackButton
              onPress={() => {
                navigation.navigate("Cart");
              }}
              label="Bag"
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

export const MoreOptionsScreens = () => {
  const user = useReactiveVar(userVar)
  return (
    <Stack.Navigator>
      <Stack.Screen name="MoreOptionHome" component={MoreOptionsScreen} options={{
        headerShown: false
      }} />
      <Stack.Screen
       navigationKey={user ? 'user' : 'guest'}
       name="ProfileScreen"
       component={ProfileScreen} options={{
       headerShown: false
      }} />
    </Stack.Navigator>
  )
}

export function HomeTabs() {
  const user = useReactiveVar(userVar)
  const cartGlobalId = useReactiveVar(cartIdVar)
  const cart = useReactiveVar(cartVar)

  const [ createCart ] = useMutation(CREATE_CART)
  const [ getCartDetails, { data: cartDetailData } ] = useLazyQuery(GET_CART_DETAILS_V2)

  // useEffect(() => {
  //   async () => {
  //     try{
  //       await AsyncStorage.setItem('app-initial', true)
  //     }catch(e){

  //     }
  //   }
  // }, [])

  // useEffect(() => {
  //   const rm = async () => {
  //     await AsyncStorage.removeItem('cart-id')
  //   }
  //   rm()
  // }, [])

  useEffect(() => {
  
    const setCart = async () => {
      try {
        const token = await AsyncStorage.getItem('my-key');
        const cartId = await AsyncStorage.getItem('cart-id');
  
        console.log("CART ID", cartId);
  
        const cartInput = token ? { email: user.email, phone: user.phone, customerAccessToken: token } : {};
  
        if (!cartId ) {
          await createCart({
            variables: {
              input: cartInput
            },
            onCompleted: (data) => {
              const set = async () => {
                if (data?.cartCreate?.cart?.id) {
                  try {
                    await AsyncStorage.setItem('cart-id', data?.cartCreate?.cart?.id);
                    console.log("Successfully created cart id");
                  } catch (e) {
                    console.log("Error setting cart ID in AsyncStorage:", e);
                  }
                }
              };
              set();
            },
            refetchQueries: [
              {
                query: GET_CART_DETAILS_V2
              },
            ]
          });
        } else {
          console.log("Cart id exists");
        }
      } catch (e) {
        console.log("Error setting up the cart: ", e);
      }
    };
  
    const getCart = async () => {
      const cartId = await AsyncStorage.getItem('cart-id');
      if (cartId) {
        getCartDetails({
          variables: {
            cartId: cartId
          },
          onCompleted: (data) => {
            console.log("cart details fetched successfully");
            cartVar(data?.cart)
          }
        });
      }
    };
  
    const initializeCart = async () => {
      await setCart();
      await getCart();
    };
  
    initializeCart();

  },[user])
  


  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="HomeScreen"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <HomeIcon size={size} color="black" strokeWidth={1} />
          ),
            tabBarVisible: false, //like this
        }}
      />
      <Tab.Screen
        name="CatogoriesScreen"
        component={CategoriesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <RectangleStackIcon size={size} color="black" strokeWidth={1} />
          ),
          title: "Categories",
        }}
      />
      <Tab.Screen
        name="CartScreen"
        component={CartScreens}
        options={{
          tabBarIcon: ({ color, size }) => (
            <ShoppingBagIcon size={size} color="black" strokeWidth={1} />
          ),
          title: "Bag",
        }}
      />
      <Tab.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MagnifyingGlassIcon size={size} color="black" strokeWidth={1} />
          ),
          title: "Search",
        }}
      />
      <Tab.Screen
        name="MoreOptionsScreen"
        component={MoreOptionsScreens}
        options={{
          title: "More",
          tabBarIcon: ({ color, size }) => (
            <EllipsisHorizontalIcon size={30} color="black" strokeWidth={2} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}


export default function AppNavigation() {
  const user = useReactiveVar(userVar)
  const [getUser, { data, loading, error }] = useLazyQuery(GET_CUSTOMER)
  const [appInitialFlag, setAppInitialFlag] = useState(false);

  useEffect(() => {
    const checkAppInitial = async () => {
      const appInitial = await AsyncStorage.getItem('app-initial');
      setAppInitialFlag(appInitial);
    };

    checkAppInitial();
  },[])

  useEffect(() => {
    const getToken = async () => {
      try{
        const token = await AsyncStorage.getItem('my-key')
        console.log("TOKEN",token)
        if(token) {
          getUser({
            variables: {
              customerAccessToken: token
            }
          })
        }
        else {
          userVar(null)
        }
      }catch(e) {
        console.log(e)
      }
    }
    getToken()
  },[user])

  useEffect(() => {
    if(data?.customer) {
      userVar(data?.customer)
    }
  }, [data])

  return (
    <NavigationContainer>

      <Stack.Navigator>
        {appInitialFlag && (<Stack.Screen 
        name="InitialScreen" 
        component={InitialSplashScreen}
        options={{
          headerShown: false
        }}
        />)}
        <Stack.Screen
          name="MainScreen"
          component={HomeTabs}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="AuthScreen" component={AuthScreen} />
      </Stack.Navigator>

    </NavigationContainer>
  );
}
