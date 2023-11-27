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
import CallBottomModal from "../components/CallBottomModal";

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
        component={MoreOptionsScreen}
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
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MainScreen"
          component={HomeTabs}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="FavouriteScreen" component={FavouriteScreen} />
        <Stack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
        />
        <Stack.Screen name="BottomModal" component={CallBottomModal} options={{
          presentation: 'transparentModal',
          headerShown: false,
        }} />
      </Stack.Navigator>

    </NavigationContainer>
  );
}
