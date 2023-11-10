import { useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MinusIcon, PlusIcon } from "react-native-heroicons/outline";
import Animated, {
  FadeIn,
  FadeOut,
  FadingTransition,
  Layout,
} from "react-native-reanimated";
import { Formik } from "formik";
import * as yup from "yup";

const gitMessageValidationSchema = yup.object({
  gitMessage: yup
    .string()
    .required("Please enter a promo code")
    .max(300, "maximun 300 char"),
});

export default function GiftToggleContainer() {
  const [open, setOpen] = useState(false);
  return (
    <Animated.View className="bg-white mt-3">
      <Pressable
        onPress={() => {
          setOpen(!open);
        }}
        className="flex-row justify-between items-center py-5 px-4"
      >
        <Text className="text-[15px] text-black font-medium">
          Add a Gift Message
        </Text>
        <View>
          {open && <MinusIcon size={20} color="black" />}
          {!open && <PlusIcon size={20} color="black" />}
        </View>
      </Pressable>
      {open && (
        <Formik
          initialValues={{ gitMessage: "" }}
          onSubmit={(values) => console.log(values)}
          validationSchema={gitMessageValidationSchema}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View className="pb-3">
              <Animated.View
                entering={FadeIn}
                exiting={FadeOut}
                className="bg-white px-4 justify-center py-3 "
              >
                <Text className="text[14px] text-gray-800 font-normal mb-4">
                  • items will be gift wrapped together and 1 gift note
                  included.
                </Text>
                <View>
                  <View className="flex-row justify-between">
                    <Text className="text-[14px] text-black font-normal uppercase mb-3">
                      your message
                    </Text>
                    <Text className="text-[14px] text-red-800 font-normal underline uppercase">remove</Text>
                  </View>
                  <TextInput
                    placeholder="Add gift message"
                    multiline={true}
                    textAlignVertical="top"
                    onChangeText={handleChange("gitMessage")}
                    onBlur={handleBlur("gitMessage")}
                    value={values.gitMessage}
                    returnKeyType="done"
                    className={`h-20 border ${
                      errors.gitMessage ? "border-red-500" : "border-gray-400"
                    } rounded-[5px] px-2`}
                    // blurOnSubmit={true}
                    // onSubmitEditing={handleSubmit}
                    onKeyPress={({ nativeEvent: { key: keyValue } }) => {
                      console.log(keyValue);
                      if (keyValue === "done") {
                        handleSubmit;
                        console.log("ENTER KEYWORD");
                      }
                    }}
                  />
                </View>
              </Animated.View>
            </View>
          )}
        </Formik>
      )}
    </Animated.View>
  );
}
