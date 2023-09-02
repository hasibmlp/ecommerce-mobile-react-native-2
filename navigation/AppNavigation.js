import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  ShoppingBagIcon,
  HomeIcon,
  EllipsisHorizontalIcon,
} from "react-native-heroicons/outline";

import { View, Text } from "react-native";

import HomeScreen from "../screens/HomeScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import FavouriteScreen from "../screens/FavouriteScreen";
import NotificationScreen from "../screens/NotificationScreen";
import CartScreen from "../screens/CartScreen";
import MoreOptionsScreen from "../screens/MoreOptionsScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export function HomeTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <HomeIcon size={size} color="black" strokeWidth={1} />
          ),
        }}
      />
      <Tab.Screen
        name="CartScreen"
        component={CartScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <ShoppingBagIcon size={size} color="black" strokeWidth={1} />
          ),
        }}
      />
      <Tab.Screen
        name="MoreOptionsScreen"
        component={MoreOptionsScreen}
        options={{
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
        <Stack.Screen name="MainScreen" component={HomeTabs} options={{
            headerShown: false
        }} />
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
    </NavigationContainer>
  );
}
