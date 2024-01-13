import { Pressable, Text, View } from "react-native";
import { MapPinIcon, PlusIcon } from "react-native-heroicons/outline";
import { useReactiveVar } from "@apollo/client";

import { userVar } from "../App";
import MyModal from "./Modal/MyModal";
import AddressForm from "./AddressForm";
import Panel from "./actions/Panel";
import { useState } from "react";
import Button from "./buttons/Button";
import CheckBox from "./Sidebar/Buttons/Checkbox";
import RadioButton from "./buttons/RadioButton";

const AddressList = ({
  intention = "default",
  onItemPress,
  selectedAddress,
}) => {
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [modalAddress, setModalAddress] = useState("");
  const user = useReactiveVar(userVar);

  const handleEditButton = (item) => {
    setAddressModalVisible(true);
    setModalAddress(item);
  };

  const handleCreateButton = () => {
    setAddressModalVisible(true);
    setModalAddress("new");
  };

  const handleItemPress = (item) => {
    onItemPress(item);
  };

  const userAddresses = user?.addresses?.edges;

  const filteredUserAddresses = userAddresses?.map((item) => ({
    ...item.node,
  }));

  filteredUserAddresses?.sort((a, b) => {
    const isDefaultAddressA = a?.id === user?.defaultAddress?.id;
    const isDefaultAddressB = b?.id === user?.defaultAddress?.id;

    if (isDefaultAddressA === isDefaultAddressB) {
      return 0;
    }

    return isDefaultAddressA ? -1 : 1;
  });

  return (
    <View className="bg-white">
      {filteredUserAddresses?.length === 0 && (
        <View className="p-5">
          <Text className="text-sm text-neutral-500 font-normal">
            There is no saved address
          </Text>
        </View>
      )}
      {filteredUserAddresses?.length > 0 &&
        filteredUserAddresses?.map((item) => {
          let checked = false;
          if (selectedAddress) {
            const customerAddressToCheck = {
              address1: item?.address1?.length > 0 ? item?.address1 : undefined,
              address2: item?.address2?.length > 0 ? item?.address2 : undefined,
              country: item?.country?.length > 0 ? item?.country : undefined,
              province: item?.province?.length > 0 ? item?.province : undefined,
              city: item?.city?.length > 0 ? item?.city : undefined,
              zip: item?.zip?.length > 5 ? item?.zip : undefined,
              firstName:
                item?.firstName?.length > 0 ? item?.firstName : undefined,
              lastName: item?.lastName?.length > 0 ? item?.lastName : undefined,
              phone: item?.phone?.length > 0 ? item?.phone : undefined,
            };
            const checkoutAddressToCheck = {
              address1:
                selectedAddress?.address1?.length > 0
                  ? selectedAddress?.address1
                  : undefined,
              address2:
                selectedAddress?.address2?.length > 0
                  ? selectedAddress?.address2
                  : undefined,
              country:
                selectedAddress?.country?.length > 0
                  ? selectedAddress?.country
                  : undefined,
              province:
                selectedAddress?.province?.length > 0
                  ? selectedAddress?.province
                  : undefined,
              city:
                selectedAddress?.city?.length > 0
                  ? selectedAddress?.city
                  : undefined,
              zip:
                selectedAddress?.zip?.length > 5
                  ? selectedAddress?.zip
                  : undefined,
              firstName:
                selectedAddress?.firstName?.length > 0
                  ? selectedAddress?.firstName
                  : undefined,
              lastName:
                selectedAddress?.lastName?.length > 0
                  ? selectedAddress?.lastName
                  : undefined,
              phone:
                selectedAddress?.phone?.length > 0
                  ? selectedAddress?.phone
                  : undefined,
            };
            // console.log("customer address : ",customerAddressToCheck)
            // console.log("checkout address : ",checkoutAddressToCheck)
            checked =
              JSON.stringify(customerAddressToCheck) ===
              JSON.stringify(checkoutAddressToCheck);
          }

          return (
            <Pressable
              onPress={() => handleItemPress(item)}
              key={item?.id}
              className="flex-row items-center py-3"
            >
              {intention === "default" && (
                <View className="p-3 bg-neutral-200 mx-2">
                  <MapPinIcon size={28} color="black" strokeWidth={1} />
                </View>
              )}
              {intention === "selection" && (
                <View className="p-3">
                  <RadioButton checked={checked} />
                </View>
              )}
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
                <Button
                  onPress={() => handleEditButton(item)}
                  label="edit"
                  type="action"
                />
              </View>
            </Pressable>
          );
        })}

      <MyModal visible={addressModalVisible} slide="toUp">
        <AddressForm
          formData={modalAddress}
          onClose={() => setAddressModalVisible(false)}
        />
      </MyModal>

      <Panel
        onPress={handleCreateButton}
        style={{ borderTopWidth: 0.5, borderColor: "#ddd" }}
        alignment="left"
        rightIcon={<PlusIcon size={22} color="black" />}
      >
        <View className="flex-row items-center">
          <Text className="text-sm font-normal px-5">Add new address</Text>
        </View>
      </Panel>
    </View>
  );
};

export default AddressList;
