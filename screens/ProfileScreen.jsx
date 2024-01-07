import { useMutation, useReactiveVar } from "@apollo/client";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ArrowLeftOnRectangleIcon,
  MapIcon,
  MapPinIcon,
  PencilIcon,
  PencilSquareIcon,
  PlusIcon,
} from "react-native-heroicons/outline";

import { cartVar, userVar } from "../App";
import Button from "../components/buttons/Button";
import Panel from "../components/actions/Panel";
import { ScreenHeader } from "../components/actions/ScreenHeader";
import { useState } from "react";
import { CREATE_CART } from "../graphql/mutations";
import MyModal from "../components/Modal/MyModal";
import AddressForm from "../components/AddressForm";

const ProfileScreen = () => {
  const user = useReactiveVar(userVar);
  const cart = useReactiveVar(cartVar);

  const [createCart, { data, loading, error }] = useMutation(CREATE_CART);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("my-key");
      await AsyncStorage.removeItem("cart-id");
      userVar(null);
      cartVar(null);
    } catch (e) {
      console.log("log out failed!");
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="bg-neutral-100">
        <View className="flex-1 bg-neutral-100 ">
          <ScreenHeader title="Personal Information" />
          <View className="w-full p-8 items-center bg-white mt-32 ">
            <View className=" border-4 border-[#fff] absolute -top-10 rounded-full">
              <View className="w-20 h-20 rounded-full bg-neutral-200"></View>
            </View>
            <Text className="text-xl text-balck font-normal mt-4">
              {user?.firstName} {user?.lastName}
            </Text>
            <Text className="text-sm text-black font-light">{user?.email}</Text>
            <Button style={{ marginTop: 12 }} label="Edit" type="action" />
          </View>

          <InformationContainer />

          <Panel
            onPress={handleLogout}
            style={{ marginTop: 12 }}
            alignment="center"
          >
            <View className="flex-row items-center">
              <ArrowLeftOnRectangleIcon size={28} color="black" />
              <Text className="text-lg font-normal ml-1">Log out</Text>
            </View>
          </Panel>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const InformationContainer = () => {
  const [activeTab, setActiveTab] = useState("add");
  const [ addressModalVisible, setAddressModalVisible ] = useState(false)
  const [ modalAddress, setModalAddress ] = useState('')
  const user = useReactiveVar(userVar);

  const handleEditButton = (item) => {
    setAddressModalVisible(true)
    setModalAddress(item)
  }

  const handleCreateButton = () => {
    setAddressModalVisible(true)
    setModalAddress("new")
  }

  const userAddresses = user?.addresses?.edges;

  const filteredUserAddresses = userAddresses.map((item) => ({ ...item.node }));

  filteredUserAddresses.sort((a, b) => {
    const isDefaultAddressA = a.id === user?.defaultAddress?.id;
    const isDefaultAddressB = b.id === user?.defaultAddress?.id;
  
    if (isDefaultAddressA === isDefaultAddressB) {
      return 0;
    }
  
    return isDefaultAddressA ? -1 : 1;
  });


  console.log('FILTERD AND SORTED ARRAY: ', filteredUserAddresses)

  return (
    <View className="mt-3">
      <View className="w-full flex-row">
        <Pressable
          onPress={() => setActiveTab("add")}
          className={`flex-1 items-center py-4`}
        >
          <Text
            className={`${
              activeTab === "add" ? "text-black" : "text-neutral-500"
            }`}
          >
            My Addresses
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab("card")}
          className={`flex-1 items-center py-4`}
        >
          <Text
            className={`${
              activeTab === "card" ? "text-black" : "text-neutral-500"
            }`}
          >
            My Cards
          </Text>
        </Pressable>
      </View>

      <View className="">
        {activeTab === "add" && (
          <View className="bg-white">
            {filteredUserAddresses.length === 0 && (
              <View className="p-5">
                <Text className="text-sm text-neutral-500 font-normal">
                  There is no saved address
                </Text>
              </View>
            )}

            {filteredUserAddresses.length > 0 && filteredUserAddresses.map((item) => {
              console.log(item?.address1)
              return(
              <View key={item?.id} className="flex-row items-center py-3">
                <View className="p-3 bg-neutral-200 mx-2">
                  <MapPinIcon size={28} color="black" strokeWidth={1} />
                </View>
                <View className="flex-1">
                  <Text className="text-[16px] text-black font-normal ml-2">
                    {item?.firstName + " " + item?.lastName}
                  </Text>
                  <Text className="text-[16px] text-black font-normal ml-2">
                    {item?.phone}
                  </Text>
                  <Text className="text-[16px] text-black font-normal ml-2 w-[250px]">
                    {item?.address1 +
                      ", " +
                      item?.address2 +
                      ", " +
                      item?.city +
                      ", " +
                      item?.country +
                      (item?.zip ? ", " + item?.zip : "")}
                  </Text>
                  {user.defaultAddress.id === item?.id && (
                    <View className="self-start border border-neutral-300 px-2 rounded-md mt-1">
                      <Text className="text-sm text-black font-medium ">
                        Default address
                      </Text>
                    </View>
                  )}
                </View>
                <View className="p-4">
                  {/* <PencilIcon size={20} color="black" /> */}
                  <Button onPress={() => handleEditButton(item)} label="edit" type="action" />
                </View>
              </View>
            )})}

            <MyModal visible={addressModalVisible} slide="toUp">
              <AddressForm formData={modalAddress} onClose={() => setAddressModalVisible(false)} />
            </MyModal>

            <Panel
              onPress={handleCreateButton}
              style={{ borderTopWidth: 0.5, borderColor: "#ddd" }}
              alignment="left"
              rightIcon={<PlusIcon size={22} color="black" />}
            >
              <View className="flex-row items-center">
                <Text className="text-sm font-normal px-5">
                  Add new address
                </Text>
              </View>
            </Panel>
          </View>
        )}
        {activeTab === "card" && (
          <Panel alignment="center" label="No Card Information" />
        )}
      </View>
    </View>
  );
};
