import { Formik, useFormikContext } from "formik"
import { ScrollView, Text, TextInput, View } from "react-native"
import * as Yup from 'yup'

import Selection from "./Selection"
import ColorSelection from "./ColorSelection"
import GraphicSelection from "./GraphicSelection"
import Button from "../buttons/Button"
import ImageSelection from "./ImageSelection"
import { Fragment, useEffect, useRef } from "react"

const validationSchemaTextOnly = Yup.object({
    position: Yup.string().required(),
    language: Yup.string().required(),
    fontStyle: Yup.string().required(),
    color: Yup.string().required(),
    firstLine: Yup.string().required().max(16, 'maximum character allowed 16'),
    secondLine: Yup.string().max(16, 'maximum character allowed 16'),
})
const validationSchemaTextWithGraphics = Yup.object({
    position: Yup.string().required(),
    language: Yup.string().required(),
    fontStyle: Yup.string().required(),
    color: Yup.string().required(),
    firstLine: Yup.string().required().max(16, 'maximum character allowed 16'),
    secondLine: Yup.string().max(16, 'maximum character allowed 16'),
    imageUrl: Yup.string().required("Please selecte an image"),
})
const validationSchemaGraphicsOnly = Yup.object({
    position: Yup.string().required(),
    imageUrl: Yup.string().required("Please selecte an image"),
})

const CustomSelection = ({
    context,
    activeSelectionsForTextDisplay,
    handleTextStyle, 
    initialCustomTextData, 
    setTotalCustom, 
    totalCustom, 
    onClose, 
    price, 
    activeColorCode ,
    activeFont,
    logoCollection,
    colorValues,
    fontsLoaded,
    image,
    setImage,
    setCustomProductId
    }) => {
    
    const textOnlyRef = useRef()
    const graphicOnlyRef = useRef()
    const textGraphicRef = useRef()
    const formRef = useRef()

    const handleClose = () => {
        onClose()
    }


    if(context === 'text-only') 
    return (
        <ScrollView ref={textOnlyRef} className="pt-8 px-4">

            <HeaderTitle title="Customization"/>


            <View className="text-form pt-3">
                <Formik
                    innerRef={formRef}
                    initialValues={{
                    position: totalCustom.selections.length > 0 ? totalCustom.selections[0].position : '',
                    language: totalCustom.selections.length > 0  ? totalCustom.selections[0].language : '',
                    fontStyle: totalCustom.selections.length > 0  ? totalCustom.selections[0].fontStyle : '',
                    color: totalCustom.selections.length > 0  ? totalCustom.selections[0].color : '',
                    firstLine: totalCustom.selections.length > 0  ? totalCustom.selections[0].firstLine : '',
                    secondLine: totalCustom.selections.length > 0  ? totalCustom.selections[0].secondLine : '',
                    }}
                    validationSchema={validationSchemaTextOnly}
                    onSubmit={(values) => {
                    if(values){
                        setTotalCustom(prevState => {
                        return {type: 'text-only', active: true,  selections: [{...values}]}
                        })
                        setCustomProductId({id: 'gid://shopify/Product/8344541593879', type: 'text-only', title: 'Text', price: '50', selections: [{...values}]})
                    }else {
                        // setTotalCustom(prevState => {
                        // const prevTotalCustom = [...prevState.selections]
                        // return {type: 'text-only', selections: filterdArray}
                        // })
                    }
                        onClose()
                    }}
                >
                    {({handleBlur, handleChange, handleSubmit, errors, touched, values}) => (
                    <>
                        <View className="mb-6">
                            <FormErrorBlock errors={errors} touched={touched} scrollY={textOnlyRef} />
                            <ImageSelection 
                                title="Select Position" 
                                style={{marginBottom: 12}}
                                defaultValue={values.position}
                                handleChange={handleChange('position')}
                                images={[
                                    {
                                        url: 'https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg', title: 'Left'
                                    },
                                    {
                                        url: 'https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg', title: 'Right'
                                    }
                                ]}
                            />
                            <Selection
                                name="language-selection"
                                field="language"
                                onChange={(item) => handleTextStyle(item)}
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
                                onChange={(item) => handleTextStyle(item)}
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
                        onChange={(item) => handleTextStyle(item)}
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
                                value={values.secondLine}
                                />
                        </View>

                        <View className="footer w-full justify-center pb-20">
                            <View className="flex-row justify-between py-4 mb-2 ">
                                <Text className="text-[16px] text-black font-normal">Total Customization Price</Text>
                                <Text className="text-[17px] text-[#89c157] font-medium">{price}</Text>
                            </View>
                            <Button label="Applay" onPress={handleSubmit}/>
                        </View>

                    </>
                    )}
                    
                </Formik>
            </View>
            
        </ScrollView>
    )

    if(context === 'graphics-only')
    return (
        <ScrollView ref={graphicOnlyRef} className="pt-8 px-4">

            <HeaderTitle title="Customization"/>

            <View className="text-form pt-3">
                <Formik
                    initialValues={{
                    position: totalCustom.selections.length > 0 ? totalCustom.selections[0].position : '',
                    imageUrl: totalCustom.selections.length > 0  ? totalCustom.selections[0].imageUrl : ''
                    }}
                    validationSchema={validationSchemaGraphicsOnly}
                    onSubmit={(values) => {
                    if(values){
                        setTotalCustom(prevState => {
                        return {type: 'graphics-only', active: true,  selections: [{...values}]}
                        })
                        setCustomProductId({id: 'gid://shopify/Product/8344541593879', type: 'graphics-only', title: 'Graphics', price: '100', selections: [{...values}]})
                    }else {
                        // setTotalCustom(prevState => {
                        // const prevTotalCustom = [...prevState.selections]
                        // return {type: 'text-only', selections: filterdArray}
                        // })
                    }
                        onClose()
                    }}
                >
                    {({handleBlur, handleChange, handleSubmit, errors, touched, values}) => (
                    <>
                        
                        <FormErrorBlock errors={errors} touched={touched} scrollY={graphicOnlyRef} />
                        <ImageSelection 
                            title="Select Position" 
                            style={{marginBottom: 12}}
                            defaultValue={values.position}
                            handleChange={handleChange('position')}
                            images={[
                                {
                                    url: 'https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg', title: 'Left'
                                },
                                {
                                    url: 'https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg', title: 'Right'
                                }
                            ]}
                        />
                            
                        <View className="graphics-form items-center">
                            <Text className="mb-4 text-center">You can upload your own graphic or logo or you can choose from our university, hospital logo & icon we have</Text>
                            <GraphicSelection logoCollection={logoCollection} value={values.imageUrl} handleChange={handleChange('imageUrl')} />
                        </View>

                        <View className="footer w-full justify-center pb-20">
                            <View className="flex-row justify-between py-4 mb-2 ">
                                <Text className="text-[16px] text-black font-normal">Total Customization Price</Text>
                                <Text className="text-[17px] text-[#89c157] font-medium">{price}</Text>
                            </View>
                            <Button label="Applay" onPress={handleSubmit}/>
                        </View>

                    </>
                    )}
                    
                </Formik>
            </View>
            
        </ScrollView>
    )
    else 
    return (
        <ScrollView ref={textGraphicRef} className="pt-8 px-4">

            <HeaderTitle title="Customization"/>

            <View className="text-form pt-3">
                <Formik
                    innerRef={formRef}
                    initialValues={{
                    position: totalCustom.selections.length > 0 ? totalCustom.selections[0].position : '',
                    language: totalCustom.selections.length > 0  ? totalCustom.selections[0].language : '',
                    fontStyle: totalCustom.selections.length > 0  ? totalCustom.selections[0].fontStyle : '',
                    color: totalCustom.selections.length > 0  ? totalCustom.selections[0].color : '',
                    firstLine: totalCustom.selections.length > 0  ? totalCustom.selections[0].firstLine : '',
                    secondLine: totalCustom.selections.length > 0  ? totalCustom.selections[0].secondLine : '',
                    imageUrl: totalCustom.selections.length > 0  ? totalCustom.selections[0].imageUrl : ''
                    }}
                    validationSchema={validationSchemaTextWithGraphics}
                    onSubmit={(values) => {
                    if(values){
                        setTotalCustom(prevState => {
                        return {type: 'text-with-graphics', active: true, selections: [{...values}]}
                        })
                        setCustomProductId({id: 'gid://shopify/Product/8344546115863', type: 'text-with-graphics', title: 'Text-Graphics', price: '150', selections: [{...values}]})
                    }else {
                        // setTotalCustom(prevState => {
                        // const prevTotalCustom = [...prevState.selections]
                        // return {type: 'text-only', selections: filterdArray}
                        // })
                    }
                        onClose()
                    }}
                >
                    {({handleBlur, handleChange, handleSubmit, errors, touched, values}) => (
                    <>
                        <View className="mb-6">
                            <FormErrorBlock errors={errors} touched={touched} scrollY={textGraphicRef} />
                            <ImageSelection 
                                title="Select Position" 
                                style={{marginBottom: 12}}
                                defaultValue={values.position}
                                handleChange={handleChange('position')}
                                images={[
                                    {
                                        url: 'https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg', title: 'Left'
                                    },
                                    {
                                        url: 'https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg', title: 'Right'
                                    }
                                ]}
                            />
                            <Selection
                                name="language-selection"
                                field="language"
                                onChange={(item) => handleTextStyle(item)}
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
                                onChange={(item) => handleTextStyle(item)}
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
                        onChange={(item) => handleTextStyle(item)}
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
                                value={values.secondLine}
                                />
                        </View>

                        <View className="graphics-form items-center">
                            <Text className="mb-4 text-center">You can upload your own graphic or logo or you can choose from our university, hospital logo & icon we have</Text>
                            <GraphicSelection logoCollection={logoCollection} value={values.imageUrl} handleChange={handleChange('imageUrl')} />
                        </View>

                        <View className="footer w-full justify-center pb-20">
                            <View className="flex-row justify-between py-4 mb-2 ">
                                <Text className="text-[16px] text-black font-normal">Total Customization Price</Text>
                                <Text className="text-[17px] text-[#89c157] font-medium">{price}</Text>
                            </View>
                            <Button label="Applay" onPress={handleSubmit}/>
                        </View>

                    </>
                    )}
                    
                </Formik>
            </View>
            
        </ScrollView>
    )
}

const FormErrorBlock = ({ errors, touched, scrollY }) => {
    const errorFields = [
      'position',
      'language',
      'color',
      'fontStyle',
      'firstLine',
      'secondLine',
      'imageUrl',
    ];
  
    const hasErrors = errorFields.some((field) => touched[field] && errors[field]);

    useEffect(() => {
        if(errors) {
            scrollY.current.scrollTo({
                options: {x: 0, y: 0},
            })
        }
    },[errors])
  
    if (!hasErrors) return null;
  
    return (
      <View className="items-center bg-red-500 py-2">
        {errorFields.map((field) => (
          <Fragment key={field}>
            {touched[field] && errors[field] && (
              <Text className="text-[14px] text-white font-medium">
                {errors[field]}
              </Text>
            )}
          </Fragment>
        ))}
      </View>
    );
  };


const HeaderTitle = ({title}) => {
    return (<Text className="text-[20px] text-green-500 font-normal uppercase text-center">{title}</Text>)
}

export default CustomSelection