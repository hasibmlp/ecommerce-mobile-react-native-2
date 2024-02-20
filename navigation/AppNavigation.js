import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  ShoppingBagIcon,
  HomeIcon,
  EllipsisHorizontalIcon,
  MagnifyingGlassIcon,
  RectangleStackIcon,
} from "react-native-heroicons/outline";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useLazyQuery, useMutation, useReactiveVar } from "@apollo/client";

import HomeScreen from "../screens/HomeScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import FavouriteScreen from "../screens/FavouriteScreen";
import NotificationScreen from "../screens/NotificationScreen";
import CartScreen from "../screens/CartScreen";
import MoreOptionsScreen from "../screens/MoreOptionsScreen";
import SearchScreen from "../screens/SearchScreen";
import CategoriesScreen from "../screens/CategoriesScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import Collection from "../screens/CollectionScreen";
import AuthScreen from "../screens/AuthScreen";
import InitialSplashScreen from "../screens/InitialSplashScreen";
import { cartIdVar, cartVar, userVar } from "../makeVars/MakeVars";
import { GET_CART_DETAILS_V2, GET_CUSTOMER } from "../graphql/queries";
import ProfileScreen from "../screens/ProfileScreen";
import { CART_BUYER_IDENTITY_UPDATE, CREATE_CART } from "../graphql/mutations";
import SearchResultsScreen from "../screens/SearchResultsScreen";
import ProfileAddressScreen from "../screens/ProfileAddressScreen";
import OrdersScreen from "../screens/OrdersScreen";
import ProfileOrdersDetailsScreen from "../screens/ProfileOrdersDetailsScreen";

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
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
    </Stack.Navigator>
  );
}

export function CartScreens() {
  const user = useReactiveVar(userVar);

  return (
    <Stack.Navigator>
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen
        navigationKey={user ? "user" : "guest"}
        name="CheckoutScreen"
        component={CheckoutScreen}
      />
    </Stack.Navigator>
  );
}

export function SearchScreens() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SearchResultsScreen"
        component={SearchResultsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ProductDetailScreenInSearch"
        component={ProductDetailScreen}
      />
    </Stack.Navigator>
  );
}

export const MoreOptionsScreens = () => {
  const user = useReactiveVar(userVar);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MoreOptionHome"
        component={MoreOptionsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        navigationKey={user ? "user" : "guest"}
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ProfileAddressScreen"
        component={ProfileAddressScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ProfileOrdersScreen"
        component={OrdersScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ProfileOrdersDetailsScreen"
        component={ProfileOrdersDetailsScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export function HomeTabs() {
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
        name="SearchScreens"
        component={SearchScreens}
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
  const user = useReactiveVar(userVar);
  const [getUser] = useLazyQuery(GET_CUSTOMER, {
    fetchPolicy: "no-cache",
  });
  const [appInitialFlag, setAppInitialFlag] = useState(false);

  const [createCart] = useMutation(CREATE_CART);
  const [getCartDetails] = useLazyQuery(
    GET_CART_DETAILS_V2,
    {
      fetchPolicy: "no-cache",
    }
  );

  const [
    updateCartBuyer,
    {
      data: updateCartBuyerData,
      loading: updateCartBuyerLoading,
      error: updateCartBuyerError,
    },
  ] = useMutation(CART_BUYER_IDENTITY_UPDATE);

  // const [
  //   updateCartBuyerIdentity,
  //   {
  //     loading: updateCartBuyerIdentityLoading,
  //     error: updateCartBuyerIdentityError,
  //     data: updateCartBuyerIdentityData,
  //   },
  // ] = useMutation(CART_BUYER_IDENTITY_UPDATE);

  //   useEffect(() => {
  //   const removeToken = async() => {
  //     await AsyncStorage.removeItem('cart-id')
  //     cartVar(null)
  //   }
  //   removeToken()
  // }, [])

  useEffect(() => {
    const checkAppInitial = async () => {
      const appInitial = await AsyncStorage.getItem("app-initial");
      setAppInitialFlag(appInitial);
    };

    checkAppInitial();
  }, []);

  useEffect(() => {
    let myUser = null;
    let myToken = null;
    let myCartId = null;
    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem("my-key");
        myToken = token;
        console.log("TOKEN", token);
        console.log("MYTOKEN", myToken);
        if (token) {
          await getUser({
            variables: {
              customerAccessToken: token,
            },
            onCompleted: async (data) => {
              myUser = await data?.customer;
              userVar(await data?.customer);
              console.log(
                "user fetched succefully and assigned to user object: ",
                data?.customer
              );
            },
          });
        } else {
          userVar(null);
        }
      } catch (e) {
        console.log(e);
      }
    };

    const setCart = async () => {
      try {
        const cartId = await AsyncStorage.getItem("cart-id");

        console.log("CART ID", cartId);

        console.log("USER IN SETTING CART: ", myUser);
        console.log("TOKEN IN SETTING CART: ", myToken);

        // const cartInput = (user?.email && user?.phone)
        //   ? { email: user.email, phone: user.phone, customerAccessToken: token }
        //   : {};

        // const cartInput = myToken
        //   ? {
        //       buyerIdentity: {
        //         email: myUser?.email,
        //         phone: myUser?.phone,
        //         customerAccessToken: myToken,
        //       },
        //     }
        //   : {};

        const cartInput = {};

        if (!cartId) {
          await createCart({
            variables: {
              input: cartInput,
            },
            onCompleted: (data) => {
              console.log("CART CREATED SUCCEFULLY");
              const set = async () => {
                if (data?.cartCreate?.cart?.id) {
                  try {
                    await AsyncStorage.setItem(
                      "cart-id",
                      data?.cartCreate?.cart?.id
                    );
                    console.log("CART ID SET TO ASYNC STORAGE");
                  } catch (e) {
                    console.log("Error setting cart ID in AsyncStorage:", e);
                  }
                }
              };
              set();
            },
            refetchQueries: [
              {
                query: GET_CART_DETAILS_V2,
              },
            ],
          });
        } else {
          console.log("Cart id exists");
        }
      } catch (e) {
        console.log("Error setting up the cart: ", e);
      }
    };

    const getCart = async () => {
      const cartId = await AsyncStorage.getItem("cart-id");
      console.log("CART ID IN GETTING CART: ", cartId);
      if (cartId) {
        getCartDetails({
          variables: {
            cartId: cartId,
          },
          onCompleted: async (cartData) => {
            console.log("cart details fetched successfully");

            cartVar(cartData?.cart);

            // if (myToken) {
            //   updateCartBuyer({
            //     variables: {
            //       buyerIdentity: {
            //         customerAccessToken: myToken,
            //         email: myUser.email,
            //         phone: myUser.phone,
            //       },
            //       cartId: cartId,
            //     },
            //     onCompleted: (data) => {
            //       const newCart = { ...cartData?.cart };
            //       newCart.buyerIdentity =
            //         data?.cartBuyerIdentityUpdate?.cart?.buyerIdentity;
            //       console.log(
            //         "BUYER IDENTITY ADDED: ",
            //         JSON.stringify(data, null, 2)
            //       );
            //       newCart;
            //     },
            //   });
            // } else {
            //   cartVar(cartData?.cart);
            // }
          },
        });
      }
    };

    const initializeCart = async () => {
      await setCart();
      await getCart();
      // await setUserToCart();
    };

    const initializeApp = async () => {
      await getToken();
      await initializeCart();
    };

    initializeApp();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {appInitialFlag && (
          <Stack.Screen
            name="InitialScreen"
            component={InitialSplashScreen}
            options={{
              headerShown: false,
            }}
          />
        )}
        <Stack.Screen
          name="MainScreen"
          component={HomeTabs}
          options={{
            headerShown: false,
          }}
        />
        {
          <Stack.Screen
            navigationKey={user ? "user" : "guest"}
            name="AuthScreen"
            component={AuthScreen}
          />
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}
