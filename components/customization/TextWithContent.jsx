import { Formik } from "formik"
import { ScrollView, Text, TextInput, View } from "react-native"

import Selection from "./Selection"
import ColorSelection from "./ColorSelection"
import GraphicSelection from "./GraphicSelection"
import Button from "../buttons/Button"
import ImageSelection from "./ImageSelection"

const TextWithContent = ({activeSelections, 
    handleSelections, 
    initialCustomTextData, 
    setTotalCustom, 
    totalCustom, 
    onClose, 
    price, 
    activeColorCode ,
    activeFont,
    logoCollection,
    colorValues,
    fontsLoaded
    }) => {
    return (
        <ScrollView className="pt-8 px-4">

            <ImageSelection title="Select Position" style={{marginBottom: 12}} onChange={(item) => handleSelections(item)} defaultValue={activeSelections.postion}/>

            <View className="text-form pt-3">
            <Formik
                initialValues={{
                language: initialCustomTextData ? initialCustomTextData.language : '',
                fontStyle: initialCustomTextData ? initialCustomTextData.fontStyle : '',
                color: initialCustomTextData ? initialCustomTextData.color : '',
                firstLine: initialCustomTextData ? initialCustomTextData.firstLine : '',
                secondLine: initialCustomTextData ? initialCustomTextData.secondLine : '',
                }}
                onSubmit={(values) => {
                if(values.firstLine.length > 0 || values.secondLine.length > 0){
                    setTotalCustom(prevState => {
                    const prevTotalCustom = [...prevState.selections]
                    const indexFound = prevTotalCustom.findIndex(item => item.type === 'text-upload')
                    if(indexFound > -1) prevTotalCustom.splice(indexFound, 1)
                    prevTotalCustom.push({type: 'text-upload', data: values})
                    return {type: prevState.type, position: prevState.position, selections: prevTotalCustom}
                    })
                }else {
                    setTotalCustom(prevState => {
                    const prevTotalCustom = [...prevState.selections]
                    const filterdArray = prevTotalCustom.filter(item => item.type !== 'text-upload')
                    return {type: prevState.type, position: prevState.position, selections: filterdArray}
                    })
                }
                }}
            >
                {({handleBlur, handleChange, handleSubmit, errors, touched, values}) => (
                <>
                    <View className="mb-6">
                    <Selection
                        name="language-selection"
                        field="language"
                        onChange={(item) => handleSelections(item)}
                        label={"Language"}
                        style={{marginBottom: 12}}
                        options={[{name: 'en', value: 'English'}, {name: 'ar', value: 'العربي'}]}
                        handleChange={handleChange('language')}
                        errors={errors}
                        touched={touched}
                        value={values.language}
                        fontsLoaded={fontsLoaded}
                    />

                    <Selection
                        name="font-selection"
                        field="fontStyle"
                        label={"Font"}
                        onChange={(item) => handleSelections(item)}
                        options={[
                        {name: 'op1', value: 'Roboto Mono', fontFamily: 'Robo-Mono'},
                        {name: 'op2', value: 'Kalnia', fontFamily: 'Kalnia'},
                        {name: 'op3', value: 'Ubuntu', fontFamily: 'Ubuntu'},
                        ]}
                        handleChange={handleChange('fontStyle')}
                        errors={errors}
                        touched={touched}
                        value={values.fontStyle}
                        fontsLoaded={fontsLoaded}
                    />
                    </View>

                    <ColorSelection
                    onChange={(item) => handleSelections(item)}
                    handleChange={handleChange('color')}
                    handleBlur={handleBlur('color')}
                    errors={errors}
                    touched={touched}
                    value={values.color}
                    colorValues={colorValues}
                    />
                        
                    <View className="mb-6">
                    <Text className='text-[14px] text-black font-normal mb-1'>First Line</Text>
                    <TextInput
                        style={{color: activeColorCode, fontFamily: activeFont}}maxLength={16} 
                        className={`h-12 text-[18px] items-cetner bg-gray-100 px-2 rounded-[5px]`} 
                        onChangeText={handleChange('firstLine')}
                        handleBlur={handleBlur('firstLine')}
                        onEndEditing={handleSubmit}
                        value={values.firstLine}
                    />
                    </View>

                    <View className="mb-6">
                    <Text className='text-[14px] text-black font-normal mb-1'>Second Line</Text>
                    <TextInput 
                        style={{color: activeColorCode, fontFamily: activeFont}} maxLength={16} 
                        className={`h-12 text-[18px] items-cetner bg-gray-100 px-2 rounded-[5px]`} 
                        onChangeText={handleChange('secondLine')}
                        handleBlur={handleBlur('secondLine')}
                        onEndEditing={handleSubmit}
                        value={values.secondLine}
                        />
                    </View>


                </>
                )}
                
            </Formik>
            </View>

            <View className="graphics-form items-center">
            <Text className="mb-4 px-4">You can upload your own graphic or logo or you can choose from our university, hospital logo & icon we have</Text>

                <GraphicSelection logoCollection={logoCollection} totalCustom={totalCustom} setTotalCustom={setTotalCustom} />

            </View>

            <View className="w-full justify-center pb-20">
            <View className="flex-row justify-between py-4 mb-2 ">
                <Text className="text-[16px] text-black font-normal">Total Customization Price</Text>
                <Text className="text-[17px] text-[#89c157] font-medium">{price}</Text>
            </View>
                <Button label="done" onPress={onClose}/>
            </View>
            
        </ScrollView>
    )
}

export default TextWithContent