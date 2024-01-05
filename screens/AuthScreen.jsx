import { useNavigation } from "@react-navigation/native"
import { useEffect, useLayoutEffect, useState } from "react"
import { Alert, Pressable, SafeAreaView, Text, TextInput, View } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from "formik"
import { useLazyQuery, useMutation, useReactiveVar } from "@apollo/client"

import { ScreenHeader } from "../components/actions/ScreenHeader"
import Button from "../components/buttons/Button"
import { CREATE_CUSTOMER, CREATE_CUSTOMER_TOKEN } from "../graphql/mutations"
import { GET_CUSTOMER } from "../graphql/queries";
import { userVar } from "../App";
import LoadingFullScreen from "../components/Sidebar/LoadingFullScreen";
import RadioButton from "../components/RadioButton";

const AuthScreen = () => {
    const navigation = useNavigation()
    const [ activeTab, setActiveTab ] = useState("log")
    const [createUserToken, {data, loading, error}] = useMutation(CREATE_CUSTOMER_TOKEN)
    const [createCustomer, {data: customerCreationData, loading: customerCreationLoading, error: customerCreationError}] = useMutation(CREATE_CUSTOMER)

    const [getUser, { data: customrDetailsData, loading: customerDetailsLoading, error: customerDetailsError }] = useLazyQuery(GET_CUSTOMER)

    // console.log("USER ACCESS TOKEN CREATED: ", data?.customerAccessTokenCreate?.customerAccessToken?.accessToken)
    
    const handleLogin = async (values) => {
      try {
        await createUserToken({
          variables: {
            input: {
              email: values.email,
              password: values.password,
            },
          },
          onCompleted: () => {
          }
        });
      } catch (error) {
        console.error("Error submitting form:", error.message);
      }
    };

    const handleRegister = (values) => {
      const loginValues = {email: values?.email, password: values?.password}

      createCustomer({
        variables: {
          input: values
        },
        onCompleted: () => {
          handleLogin(loginValues)
        }
      })
    }
    
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
            if(token){
              getUser({
                variables: {
                  customerAccessToken: token
                }
              })
            }
            try {
              if (token !== null) await AsyncStorage.setItem("my-key", token);
            } catch (e) {
            }
          }
        };
    
        handleTokenStorage()

      }, [data?.customerAccessTokenCreate?.customerAccessToken]);

      useEffect(() => {
        if(customrDetailsData?.customer) {
          userVar(customrDetailsData?.customer)

          navigation.navigate("MainScreen")
        }
      }, [customrDetailsData])
    
    return (
        <SafeAreaView className="flex-1 bg-white">
          {loading && (<LoadingFullScreen />)}
          {customerDetailsLoading && (<LoadingFullScreen />)}
          {customerCreationLoading && (<LoadingFullScreen />)}
            <View className="flex-1 items-center bg-neutral-100">
                <ScreenHeader />

                <TabHeader activeTab={activeTab} setActiveTab={setActiveTab}/>
                
                {activeTab === 'log' && (<View className="w-full px-10 mt-10">
                    <Formik
                    initialValues={{
                        email: '',
                        password: ''
                    }}
                    onSubmit={handleLogin}  
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
                </View>)}
                {activeTab === 'reg' && (<View className="w-full px-10 mt-10">
                    <Formik
                    initialValues={{
                        firstName: '',
                        lastName: '',
                        email: '',
                        password: '',
                        phone: '',
                        acceptsMarketing: false,
                    }}
                    onSubmit={handleRegister}  
                    >
                    {({handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched}) => (
                        <>
                        <Text className="text-4xl text-black font-light mb-10">Register</Text>
                        <TextInput 
                        placeholderTextColor="black"
                        placeholder="First name*"
                        onChangeText={handleChange('firstName')}
                        onBlur={handleBlur('firstName')}
                        value={values.firstName}
                        className="w-full text-[16px] text-black font-normal h-14 border-b border-neutral-300 mb-3" 
                        />
                        <TextInput 
                        placeholderTextColor="black"
                        placeholder="Last name*"
                        onChangeText={handleChange('lastName')}
                        onBlur={handleBlur('lastName')}
                        value={values.lastName}
                        className="w-full text-[16px] text-black font-normal h-14 border-b border-neutral-300 mb-3" 
                        />
                        <TextInput 
                        placeholderTextColor="black"
                        placeholder="Email*"
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        value={values.email}
                        className="w-full text-[16px] text-black font-normal h-14 border-b border-neutral-300 mb-3" 
                        />
                        <TextInput 
                        placeholderTextColor="black"
                        placeholder="Password*"
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        value={values.password}
                        className="w-full text-[16px] text-black font-normal h-14 border-b border-neutral-300 mb-3" 
                        />

                        <TextInput 
                        placeholderTextColor="black"
                        placeholder="Phone*"
                        onChangeText={handleChange('phone')}
                        onBlur={handleBlur('phone')}
                        value={values.phone}
                        className="w-full text-[16px] text-black font-normal h-14 border-b border-neutral-300 mb-8" 
                        />
                        
                        <Pressable onPress={() => setFieldValue('acceptsMarketing', !values.acceptsMarketing)} className="flex-row items-center mb-8">
                          <RadioButton checked={values.acceptsMarketing} />
                          <Text className="ml-2">Newsletter subsciption</Text>
                        </Pressable >

                        <Button onPress={handleSubmit} label="create account" textColors={['#000']} style={{marginBottom: 12}}/>
                        </>
                    )}
                    </Formik>
                </View>)}
            </View>
        </SafeAreaView>
    )
}

export default AuthScreen

const TabHeader = ({activeTab, setActiveTab}) => {
  return (
    <View className="w-full flex-row bg-white shadow-sm justify-between mt-10">
      <Pressable onPress={() => setActiveTab('log')} className="flex-1 items-center justify-center">
        <Text className={`text-lg py-4 ${activeTab === 'log' ? 'text-black' : 'text-neutral-500'}`}>Log in</Text>
      </Pressable>
      <Pressable onPress={() => setActiveTab('reg')} className="flex-1 items-center justify-center">
        <Text className={`text-lg py-4 ${activeTab === 'reg' ? 'text-black' : 'text-neutral-500'}`}>Register</Text>
      </Pressable>
    </View>
  )
}
