import { Text, View } from "react-native";
import Button from "../buttons/Button";
import InputListItem from "./InputListItem";
import { Formik } from "formik";
import { useContext } from "react";
import { SideBarContext } from "../../App";
import * as yup from 'yup'

const validationSchema = yup.object({
    min: yup.number().integer(),
    max: yup.number().required().positive().integer(),
})

export default function PriceRangeForm({option}) {
    const {setActiveFilterInput} = useContext(SideBarContext)
    const input = JSON.parse(option.input)
    console.log("PRICE INPUT OPTION",input)
    return (
        <View className="p-3">
            <Formik
                initialValues={{}}
                validationSchema={validationSchema}
                onSubmit={values => {
                    console.log("values are enabled")
                    const priceRange = {'price': {max: parseInt(values.max), min: parseInt(values.min)}}
                    console.log(priceRange)

                    setActiveFilterInput(prevState => {
                        const prevFilterInputs = [...prevState]
                        const inputIndex = prevFilterInputs.findIndex(prevInput => Object.keys(prevInput)[0] === 'price')
                        console.log(inputIndex)
                        if(inputIndex > -1)  prevFilterInputs.splice(inputIndex, 1)
                        return [...prevFilterInputs, priceRange]
                    })
                }}
            >
                {({handleBlur, handleChange,handleSubmit, values, errors}) => (
                    <>
                        <InputListItem style={{marginBottom: 12}} priceType="min" values={values} handleBlur={handleBlur} handleChange={handleChange}/>
                        <InputListItem style={{marginBottom: 12}} priceType="max" values={values} handleBlur={handleBlur} handleChange={handleChange}/>
                        <Button onPress={handleSubmit} label="apply"/>
                        <Text>{errors.message}</Text>
                    </>
                )}
            </Formik>
        </View>
    )
}