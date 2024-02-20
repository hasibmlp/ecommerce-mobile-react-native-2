import { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MyModal from "./Modal/MyModal";
import { MapIcon } from "react-native-heroicons/outline";
import { FONT_FAMILY } from "../theme";

const PhoneTextInput = ({
  touched,
  errors,
  values,
  handleChange,
  handleBlur,
  countries,
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentContry, setCurrentCountry] = useState(countries[0]);
  const [phone, setPhone] = useState(null);

  const handlePhone = (value) => {
    // value = value.length === currentContry.dial_code.length-1 ? currentContry.dial_code + value : value
    const updatedPhone =
      value.length === 1 ? currentContry.dial_code + value : value;
    handleChange("phone")(updatedPhone);
  };

  const alphabets = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  const handleSelectCountry = () => {
    setCurrentCountry(item);
    setModalVisible(false);
  };

  const handlePhoneBlur = () => {
    handleBlur("phone");
    if (!errors.phone) {
      console.log(phone);
    }
  };

  // const withoutCodePhoneNumber = values.phone.split(currentContry.dial_code);
  console.log("WITHOUT CODE", values.phone);
  return (
    <View
      className={`${
        errors.phone && touched.phone ? "h-16" : "h-14"
      } mb-4 justify-between `}
    >
      <View
        className={`flex-row h-full items-center border-b ${
          errors.phone && touched.phone
            ? "border-red-200 text-red-600"
            : "border-neutral-300 text-black"
        }`}
      >
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="max-w-min h-full justify-center pl-3"
        >
          <Text>
            {currentContry.emoji} {currentContry.dial_code}
          </Text>
        </TouchableOpacity>
        <View className="h-6 w-[1px] bg-neutral-400 mx-4"></View>
        <TextInput
          placeholder="phone*"
          placeholderTextColor={
            errors.phone && touched.phone ? "#D10000" : "black"
          }
          onChangeText={(value) => {
            setPhone(value);
          }}
          onBlur={handlePhoneBlur}
          value={values.phone}
          keyboardType="phone-pad"
          secureTextEntry={false}
          className={`flex-1 text-[16px] font-normal `}
        />
      </View>
      {errors.phone && touched.phone && (
        <Text className={`text-xs text-red-600 text-normal mt-2`}>
          {errors.phone}
        </Text>
      )}

      <MyModal visible={isModalVisible} slide="toUp">
        <View className="bg-white h-12 items-center flex-row border-b border-neutral-200">
          <View className="flex-1 flex-row">
            <View className="p-3">
              <MapIcon size={24} color="black" />
            </View>
            <TextInput placeholder="Search Country" />
          </View>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            className="px-3 h-full items-center justify-center border-l border-neutral-300"
          >
            <Text className="text-base text-black font-normal">Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* <FlatList
          data={countries}
          keyExtractor={(item) => item.code}
          renderItem={({ item }) => (
            <View className="w-full h-14 px-4 border-b border-neutral-300 ">
              <TouchableOpacity
                onPress={handleSelectCountry}
                className="w-full h-full flex-row items-center"
              >
                <Text style={FONT_FAMILY.secondary} className="text-base mr-10">
                  {item.emoji}
                </Text>
                <Text style={FONT_FAMILY.secondary} className="text-base mr-10">
                  {item.dial_code}
                </Text>
                <Text
                  style={FONT_FAMILY.secondary}
                  className="text-base text-wrap flex-1 "
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        /> */}
        <View className="flex-1  flex-row">
          <View className="flex-1 ">
            <ScrollView className="flex-1">
              {countries.map((item) => (
                <View className="w-full h-14 px-4 border-b border-neutral-200 ">
                  <TouchableOpacity
                    onPress={handleSelectCountry}
                    className="w-full h-full flex-row items-center"
                  >
                    <Text
                      style={FONT_FAMILY.secondary}
                      className="text-base mr-10"
                    >
                      {item.emoji}
                    </Text>
                    <Text
                      style={FONT_FAMILY.secondary}
                      className="text-base mr-10"
                    >
                      {item.dial_code}
                    </Text>
                    <Text
                      style={FONT_FAMILY.secondary}
                      className="text-base text-wrap flex-1 "
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
          <View className="w-4 h-full  mr-1 items-center justify-center absolute right-1">
            {alphabets.map((item) => (
              <Pressable key={item} className="mb-1">
                <Text>{item}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </MyModal>
    </View>
  );
};

export default PhoneTextInput;
