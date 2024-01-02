import { useNavigation } from "@react-navigation/native"
import { useEffect, useLayoutEffect } from "react"
import { Alert, SafeAreaView, Text, TextInput, View } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from "formik"
import { useMutation, useReactiveVar } from "@apollo/client"

import { ScreenHeader } from "../components/actions/ScreenHeader"
import Button from "../components/buttons/Button"
import { CREATE_CUSTOMER_TOKEN } from "../graphql/mutations"
import { accessTokenVar } from "../App";

const AuthScreen = () => {
    const navigation = useNavigation()
    const accessToken = useReactiveVar(accessTokenVar)
    const [createUserToken, {data, loading, error}] = useMutation(CREATE_CUSTOMER_TOKEN)

    // console.log("USER ACCESS TOKEN CREATED: ", data?.customerAccessTokenCreate?.customerAccessToken?.accessToken)
    
    
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false
        })
    }, [])

    useEffect(() => {
        const handleTokenStorage = async () => {
          if (data?.customerAccessTokenCreate?.customerAccessToken === null) {
            Alert.alert(
              data?.customerAccessTokenCreate?.customerUserErrors[0].message
            );
          } else {
            const token = data?.customerAccessTokenCreate?.customerAccessToken?.accessToken;
              
            try {
              if (token !== null) await AsyncStorage.setItem("my-key", token);
            } catch (e) {
            }
          }
        };
    
        handleTokenStorage();
      }, [data?.customerAccessTokenCreate?.customerAccessToken]);
    
      const handleSubmit = async (values) => {
        try {
          await createUserToken({
            variables: {
              input: {
                email: values.email,
                password: values.password,
              },
            },
          });
        } catch (error) {
          console.error("Error submitting form:", error.message);
        }
      };

    
    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 items-center bg-neutral-100">
                <ScreenHeader />
                <View className="w-full px-10 mt-40">
                    <Formik
                    initialValues={{
                        email: '',
                        password: ''
                    }}
                    onSubmit={handleSubmit}  
                    >
                    {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
                        <>
                        <Text className="text-4xl text-black font-light mb-10">LogIn</Text>
                        <TextInput 
                        placeholderTextColor="black"
                        placeholder="Email*"
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        value={values.email}
                        className="w-full text-[16px] text-black font-normal h-14 border-b border-neutral-300" 
                        />
                        <TextInput 
                        placeholderTextColor="black"
                        placeholder="Password*"
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        value={values.password}
                        className="w-full text-[16px] text-black font-normal h-14 border-b border-neutral-300 mb-10" 
                        />
                        <Button onPress={handleSubmit} label="Log In" style={{marginBottom: 12}}/>
                        <Button size="sm" label="forgot password" type="action"/>
                        </>
                    )}
                    </Formik>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default AuthScreen