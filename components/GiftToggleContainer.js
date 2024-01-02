import { useRef, useState } from "react";
import {
  InputAccessoryView,
  Pressable,
  ScrollView,
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
import Button from "./buttons/Button";
import { UPDATE_CART_NOTE } from "../graphql/mutations";
import { useMutation, useReactiveVar } from "@apollo/client";
import { cartIdVar } from "../App";
import { GET_CART_DETAILS_V2 } from "../graphql/queries";
import LoadingFullScreen from "./Sidebar/LoadingFullScreen";

const gitMessageValidationSchema = yup.object({
  gitMessage: yup
    .string()
    .required("Please enter a promo code")
    .max(300, "maximun 300 char"),
});

export default function GiftToggleContainer() {
  const textRef = useRef()
  const [open, setOpen] = useState(false);
  const cartId = useReactiveVar(cartIdVar)
  const [updateCartNote, { data, loading, error }] = useMutation(UPDATE_CART_NOTE)


  const handleSubmit = (values) => {
    updateCartNote({
      variables: {
        cartId,
        note: values.gitMessage
      },
      refetchQueries: [
        {
          query: GET_CART_DETAILS_V2,
          variables: {
            cartId,
          },
        },
      ],
    })
  }

  const handleRemove = () => {
    textRef.current.clear()
    updateCartNote({
      variables: {
        cartId,
        note: ''
      },
      refetchQueries: [
        {
          query: GET_CART_DETAILS_V2,
          variables: {
            cartId,
          },
        },
      ],
    })
  }





  return (
    <Animated.View className="bg-white mt-3">
      {loading && (<LoadingFullScreen />)}
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
          initialValues={{ gitMessage: data?.cartNoteUpdate?.cart?.note.length > 0 ? data?.cartNoteUpdate?.cart?.note : "" }}
          onSubmit={handleSubmit}
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
                    {data?.cartNoteUpdate?.cart?.note.length > 0 && (<Button onPress={handleRemove} label="remove" size="md" type="action" />)}
                  </View>
                  <ScrollView keyboardDismissMode="interactive">
                    <TextInput
                      ref={textRef}
                      placeholder="Add gift message"
                      multiline={true}
                      textAlignVertical="top"
                      onChangeText={handleChange("gitMessage")}
                      value={values.gitMessage}
                      inputAccessoryViewID="id-123"
                      className={`h-20 border ${
                        touched.gitMessage && errors.gitMessage ? "border-red-500" : "border-gray-400"
                      } rounded-[5px] px-2`}
                      // blurOnSubmit={true}
                      // onSubmitEditing={handleSubmit}
                      // onKeyPress={({ nativeEvent: { key: keyValue } }) => {
                      //   console.log(keyValue);
                      //   if (keyValue === "done") {
                      //     handleSubmit;
                      //     console.log("ENTER KEYWORD");
                      //   }
                      // }}
                    />
                  </ScrollView>

                </View>
                <View className="flex-row justify-end bg-white pt-5 border-t border-neutral-200">
                  <Button onPress={handleSubmit} size="sm" label="done" flex={false}  />
                </View>
                    {/* <InputAccessoryView nativeID="id-123">
                      <View className="flex-row justify-end bg-white px-5 py-3 border-t border-neutral-200">
                        <Button onPress={() => console.log('This is button press from done button')} size="sm" label="done" flex={false}  />
                      </View>
                    </InputAccessoryView> */}
              </Animated.View>
            </View>
          )}
        </Formik>
      )}
    </Animated.View>
  );
}
