import { Text } from "react-native";

export default function ErrorMessage ({errors, touched}) {

    if((errors.min && touched.min) && !(errors.max && touched.max)) return (
        <Text className="text-[14px] text-red-500 font-normal mb-3">{errors.min}</Text>
    )
    if((errors.max && touched.max) && !(errors.min && touched.min)) return (
        <Text className="text-[14px] text-red-500 font-normal mb-3">{errors.max}</Text>
    )
    if((errors.max && touched.max) && (errors.min && touched.min)){
        if(errors.min === 'min is a required field' && errors.max === 'max is a required field') {
            return <Text className="text-[14px] text-red-500 font-normal mb-3">Minimum and Maximum are required fields</Text>
        }else return (
            <Text className="text-[14px] text-red-500 font-normal mb-3">{errors.min + ' and ' + errors.max}</Text>
        )
        
    } 
}