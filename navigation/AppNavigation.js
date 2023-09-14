import { NavigationContainer } from "@react-navigation/native";
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

import { View, Text, SafeAreaView } from "react-native";

import HomeScreen from "../screens/HomeScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import FavouriteScreen from "../screens/FavouriteScreen";
import NotificationScreen from "../screens/NotificationScreen";
import CartScreen from "../screens/CartScreen";
import MoreOptionsScreen from "../screens/MoreOptionsScreen";
import SearchScreen from "../screens/SearchScreen";
import CategoriesScreen from "../screens/CategoriesScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();


export function HomeTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <HomeIcon size={size} color="black" strokeWidth={1} />
          ),
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
        component={CartScreen}
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
