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

const coupenCodeValidationSchema = yup.object({
  coupenCode: yup.string().required("Please enter a promo code"),
});

export default function CoupenToggleContainer() {
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
          Add a Coupen Code
        </Text>
        <View>
          {open && <MinusIcon size={20} color="black" />}
          {!open && <PlusIcon size={20} color="black" />}
        </View>
      </Pressable>
      {open && (
        <Formik
          initialValues={{ coupenCode: "" }}
          onSubmit={(values) => console.log(values)}
          validationSchema={coupenCodeValidationSchema}
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
                <TextInput
                  placeholder="Enter coupen code"
                  onChangeText={handleChange("coupenCode")}
                  onBlur={handleBlur("coupenCode")}
                  value={values.coupenCode}
                  className={`h-12 border ${
                    errors.coupenCode ? "border-red-500" : "border-gray-400"
                  } rounded-[5px] px-2`}
                />
                <TouchableOpacity
                  onPress={handleSubmit}
                  className="border border-gray-500 absolute right-8 rounded-[5px] py-2 px-3 self-end"
                >
                  <Text className="text-[14px] text-black font-normal uppercase">
                    Apply
                  </Text>
                </TouchableOpacity>
              </Animated.View>
              {errors.coupenCode && <Text className="text-[14px] text-red-500 font-normal px-4 pt-1">{errors.coupenCode}</Text>}
            </View>
          )}
        </Formik>
      )}
    </Animated.View>
  );
}
