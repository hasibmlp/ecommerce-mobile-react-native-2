import { useEffect, useState } from "react";
import { Dimensions, Text, TextInput, View } from "react-native";
import * as Yup from "yup";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Panel from "./actions/Panel";
import RadioButton from "./buttons/RadioButton";
import { ChevronDownIcon } from "react-native-heroicons/outline";
import { Formik } from "formik";
import Selection from "./customization/Selection";
import Button from "./buttons/Button";
import FormErrorBlock from "./FormErrorBlock";
import GraphicSelection from "./customization/GraphicSelection";
import Skeleton from "./skeletons/Skeleton";

const SCREEN_WIDTH = Dimensions.get('screen').width

const validationSchemaTextOnly = Yup.object({
  position: Yup.string().required(),
  language: Yup.string().required(),
  fontStyle: Yup.string().required(),
  color: Yup.string().required(),
  firstLine: Yup.string().required().max(16, "maximum character allowed 16"),
  secondLine: Yup.string().max(16, "maximum character allowed 16"),
});
const validationSchemaTextWithGraphics = Yup.object({
  position: Yup.string().required(),
  language: Yup.string().required(),
  fontStyle: Yup.string().required(),
  color: Yup.string().required(),
  firstLine: Yup.string().required().max(16, "maximum character allowed 16"),
  secondLine: Yup.string().max(16, "maximum character allowed 16"),
  imageUrl: Yup.string().required("Please selecte an image"),
});
const validationSchemaGraphicsOnly = Yup.object({
  position: Yup.string().required(),
  imageUrl: Yup.string().required("Please selecte an image"),
});
const validationSchemaLaserOnly = Yup.object({
  laserFontStyle: Yup.string().required(),
  laserFirstLine: Yup.string()
    .required()
    .max(16, "maximum character allowed 16"),
  laserSecondLine: Yup.string().max(16, "maximum character allowed 16"),
});

const validationSchemaStethoscopeBoth = Yup.object({
  laserFontStyle: Yup.string().required(),
  laserFirstLine: Yup.string()
    .required()
    .max(16, "maximum character allowed 16"),
  laserSecondLine: Yup.string().max(16, "maximum character allowed 16"),
  position: Yup.string().required(),
  language: Yup.string().required(),
  fontStyle: Yup.string().required(),
  color: Yup.string().required(),
  firstLine: Yup.string().required().max(16, "maximum character allowed 16"),
  secondLine: Yup.string().max(16, "maximum character allowed 16"),
});

// const logoCollection = [
//   {
//     id: "0",
//     title: "hospital",
//     images: [
//       {
//         name: "",
//         url: "https://cdn.shopify.com/s/files/1/2610/4676/files/AL_DHAFRA_HOSPITAL.png?v=1641294087",
//       },
//       {
//         name: "",
//         url: "https://cdn.shopify.com/s/files/1/2610/4676/files/new-homepage-5.jpg?v=1622576814",
//       },
//       {
//         name: "",
//         url: "https://cdn.shopify.com/s/files/1/2610/4676/files/Palestinesurgicalhat3.jpg?v=1702905282",
//       },
//       {
//         name: "",
//         url: "https://cdn.shopify.com/s/files/1/2610/4676/products/HOPE-HEART-EDITED.jpg?v=1618900022",
//       },
//       {
//         name: "",
//         url: "https://cdn.shopify.com/s/files/1/2610/4676/products/HORSE_KOI.jpg?v=1571709410",
//       },
//     ],
//   },
//   {
//     id: "1",
//     title: "university",
//     images: [
//       {
//         name: "",
//         url: "https://cdn.shopify.com/s/files/1/2610/4676/files/Sharjah_University.jpg?v=1704898858",
//       },
//       {
//         name: "",
//         url: "https://cdn.shopify.com/s/files/1/2610/4676/files/UNIVERSITY_OF_FUJAIRAH.png?v=1642422731",
//       },
//       {
//         name: "",
//         url: "https://cdn.shopify.com/s/files/1/2610/4676/files/University_of_Sharjah_Logo.png?v=1642422731",
//       },
//       {
//         name: "",
//         url: "https://cdn.shopify.com/s/files/1/2610/4676/files/KHALIFA_UNIVERSITY.jpg?v=1642422731",
//       },
//       {
//         name: "",
//         url: "https://cdn.shopify.com/s/files/1/2610/4676/files/GULF_MEDICAL_UNIVERSITY_LOGO.png?v=1642422731",
//       },
//       {
//         name: "",
//         url: "https://cdn.shopify.com/s/files/1/2610/4676/files/ABU_DHABI_UNIVERSITY.png?v=1642422731",
//       },
//       {
//         name: "",
//         url: "https://cdn.shopify.com/s/files/1/2610/4676/files/UAE_UNIVERSITY.png?v=1641295609",
//       },
//       {
//         name: "",
//         url: "https://cdn.shopify.com/s/files/1/2610/4676/files/AJMAN_UNIVERSITY_LOGO.jpg?v=1642422731",
//       },
//     ],
//   },
//   {
//     id: "2",
//     title: "icons",
//     images: [
//       {
//         name: "",
//         url: "https://cdn.shopify.com/s/files/1/2610/4676/files/Stethoscope_icon_7eec126b-73c5-4851-b6b4-38aeee49724b.jpg?v=1705471845",
//       },
//       {
//         name: "",
//         url: "https://cdn.shopify.com/s/files/1/2610/4676/files/Icon_only_borderless.png?v=1688203573",
//       },
//       {
//         name: "",
//         url: "https://cdn.shopify.com/s/files/1/2610/4676/files/icon__store.png?v=1613552271",
//       },
//     ],
//   },
// ];

const AccordianItem = ({
  context,
  active,
  customProductId,
  setCustomProductId,
  languageOptions,
  fontOptions,
  colorValues,
  activeFile,
  handleUploadFile,
  setActiveFile,
  onClose,
  activeColorCode,
  activeFont,
  handleTextStyle,
  fontsLoaded,
  setActiveScreen,
  logoGraphics,
  graphicsCollection,
  loading
}) => {
  const heightOffset = useSharedValue(active ? 1 : 0);
  const [activeScreenHeight, setActiveScreenHeight] = useState(0);

  let logoCollection = [];
  if (
    (context === "graphics-only" || context === "text-with-graphics") &&
    graphicsCollection?.length > 0
  ) {
    logoCollection = JSON.parse(graphicsCollection);
  }

  console.log("LOGOG COLLECTIN FINAILIZED 2: ", graphicsCollection);

  const animateStyle = useAnimatedStyle(() => ({
    height: interpolate(heightOffset.value, [0, 1], [0, activeScreenHeight]),
  }));

  const handleToggle = (value) => {
    setActiveScreen((prev) => (prev === value ? null : value));
    // if (heightOffset.value === 0) {
    //   heightOffset.value = withTiming(1, {
    //     duration: 400,
    //     easing: Easing.bezier(0.4, 0.0, 0.2, 1),
    //   });
    // } else {
    //   heightOffset.value = withTiming(0, {
    //     duration: 400,
    //     easing: Easing.bezier(0.4, 0.0, 0.2, 1),
    //   });
    // }
  };

  useEffect(() => {
    if (active) {
      heightOffset.value = withTiming(1, {
        duration: 400,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      });
    } else {
      heightOffset.value = withTiming(0, {
        duration: 400,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      });
    }
  }, [active]);

  if(loading) return (
    <View>
      <Skeleton width={SCREEN_WIDTH} height={60} style={{marginBottom: 8}} />
    </View>
  )

  if (context === "text-only") {
    return (
      <View className="">
        <Panel
          onPress={() => handleToggle("text-only")}
          leftIcon={<RadioButton checked={active} />}
          rightIcon={<ChevronDownIcon size={20} color="black" />}
        >
          <View className="flex-1 w-full flex-row justify-between items-center ">
            <Text
              style={{ fontFamily: "Nexa-Regular" }}
              className="text-base text-black uppercase"
            >
              Add my name
            </Text>
            <Text
              style={{ fontFamily: "Nexa-Regular" }}
              className="text-base text-black font-normal"
            >
              +35 AED{" "}
            </Text>
          </View>
        </Panel>

        <Animated.View style={animateStyle} className="overflow-hidden">
          <View
            className="absolute w-full bottom-0 left-0 px-4"
            onLayout={(event) => {
              setActiveScreenHeight(event.nativeEvent.layout.height);
            }}
          >
            <Formik
              initialValues={{
                position: customProductId
                  ? customProductId.type === "text-only"
                    ? customProductId.selections[0].position
                    : ""
                  : "left",
                language: customProductId
                  ? customProductId.type === "text-only"
                    ? customProductId.selections[0].language
                    : ""
                  : languageOptions[0].value,
                fontStyle: customProductId
                  ? customProductId.type === "text-only"
                    ? customProductId.selections[0].fontStyle
                    : ""
                  : fontOptions[0].value,
                color: customProductId
                  ? customProductId.type === "text-only"
                    ? customProductId.selections[0].color
                    : ""
                  : colorValues[0].name,
                firstLine: customProductId
                  ? customProductId.type === "text-only"
                    ? customProductId.selections[0].firstLine
                    : ""
                  : "",
                secondLine: customProductId
                  ? customProductId.type === "text-only"
                    ? customProductId.selections[0].secondLine
                    : ""
                  : "",
              }}
              validationSchema={validationSchemaTextOnly}
              onSubmit={(values) => {
                if (values) {
                  setCustomProductId({
                    id: "gid://shopify/ProductVariant/12528927047797",
                    type: "text-only",
                    title: "Text",
                    price: "50",
                    selections: [{ ...values }],
                  });
                } else {
                  // setTotalCustom(prevState => {
                  // const prevTotalCustom = [...prevState.selections]
                  // return {type: 'text-only', selections: filterdArray}
                  // })
                }
                onClose();
              }}
            >
              {({
                handleBlur,
                handleChange,
                handleSubmit,
                errors,
                touched,
                values,
              }) => (
                <>
                  <FormErrorBlock errors={errors} touched={touched} />
                  {/* <ImageSelection
                    title="Select Position"
                    style={{ marginBottom: 12 }}
                    defaultValue={values.position}
                    handleChange={handleChange("position")}
                    images={[
                      {
                        url: "https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg",
                        title: "Left",
                      },
                      {
                        url: "https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg",
                        title: "Right",
                      },
                    ]}
                  /> */}

                  <Selection
                    context="box"
                    name="position-selection"
                    field="position"
                    label={"Position"}
                    options={[
                      { name: "left", value: "left" },
                      { name: "right", value: "right" },
                    ]}
                    handleChange={handleChange("position")}
                    errors={errors}
                    touched={touched}
                    value={values.position}
                    fontsLoaded={fontsLoaded}
                  />

                  <Selection
                    name="language-selection"
                    field="language"
                    onChange={(item) => handleTextStyle(item)}
                    label={"Language"}
                    options={languageOptions}
                    handleChange={handleChange("language")}
                    errors={errors}
                    touched={touched}
                    value={values.language}
                    fontsLoaded={fontsLoaded}
                  />

                  <Selection
                    context="box"
                    name="font-selection"
                    field="fontStyle"
                    label={"Font"}
                    onChange={(item) => handleTextStyle(item)}
                    options={fontOptions}
                    handleChange={handleChange("fontStyle")}
                    errors={errors}
                    touched={touched}
                    value={values.fontStyle}
                    fontsLoaded={fontsLoaded}
                  />

                  <Selection
                    context="color"
                    name="color-selection"
                    field="color"
                    onChange={(item) => handleTextStyle(item)}
                    label={"Color"}
                    handleChange={handleChange("color")}
                    handleBlur={handleBlur("color")}
                    errors={errors}
                    touched={touched}
                    value={values.color}
                    colorValues={colorValues}
                    fontsLoaded={fontsLoaded}
                  />

                  <View className="mb-3">
                    <Text className="text-base text-black font-medium mb-3">
                      First Line
                    </Text>
                    <TextInput
                      style={{
                        color: activeColorCode,
                        fontFamily: activeFont,
                      }}
                      maxLength={16}
                      className={`h-12 text-[18px] items-cetner border border-neutral-300 px-2 rounded-md`}
                      onChangeText={handleChange("firstLine")}
                      handleBlur={handleBlur("firstLine")}
                      value={values.firstLine}
                    />
                  </View>

                  <View className="mb-3">
                    <Text className="text-base text-black font-medium mb-3">
                      Second Line
                    </Text>
                    <TextInput
                      style={{
                        color: activeColorCode,
                        fontFamily: activeFont,
                      }}
                      maxLength={16}
                      className={`h-12 text-[18px] items-cetner border border-neutral-300 px-2 rounded-md`}
                      onChangeText={handleChange("secondLine")}
                      handleBlur={handleBlur("secondLine")}
                      value={values.secondLine}
                    />
                  </View>

                  <View className="footer w-full justify-center pb-5">
                    <View className="flex-row w-full ">
                      <View className="flex-1">
                        <Button
                          style={{ marginRight: 12 }}
                          type="secondary"
                          label="reset"
                          flex={true}
                          onPress={handleSubmit}
                        />
                      </View>
                      <View className="flex-1">
                        <Button
                          label="Apply"
                          flex={true}
                          onPress={handleSubmit}
                        />
                      </View>
                    </View>
                  </View>
                </>
              )}
            </Formik>
          </View>
        </Animated.View>
      </View>
    );
  }
  if (context === "graphics-only")
    return (
      <View className="">
        <Panel
          onPress={() => handleToggle("graphics-only")}
          leftIcon={<RadioButton checked={active} />}
          rightIcon={<ChevronDownIcon size={20} color="black" />}
        >
          <View className="flex-1 w-full flex-row justify-between items-center ">
            <Text
              style={{ fontFamily: "Nexa-Regular" }}
              className="text-base text-black uppercase"
            >
              Add icon
            </Text>
            <Text
              style={{ fontFamily: "Nexa-Regular" }}
              className="text-base text-black font-normal"
            >
              +35 AED{" "}
            </Text>
          </View>
        </Panel>

        <Animated.View style={animateStyle} className="overflow-hidden">
          <View
            className="absolute w-full bottom-0 left-0 px-4"
            onLayout={(event) => {
              setActiveScreenHeight(event.nativeEvent.layout.height);
            }}
          >
            <Formik
              initialValues={{
                position: customProductId
                  ? customProductId.type === "graphics-only"
                    ? customProductId.selections[0].position
                    : ""
                  : "left",
                imageUrl: customProductId
                  ? customProductId.type === "graphics-only"
                    ? customProductId.selections[0].imageUrl
                    : ""
                  : "",
              }}
              validationSchema={validationSchemaGraphicsOnly}
              onSubmit={(values) => {
                if (values) {
                  setCustomProductId({
                    id: "gid://shopify/ProductVariant/12528927080565",
                    type: "graphics-only",
                    title: "Graphics",
                    price: "100",
                    selections: [{ ...values }],
                  });

                  handleUploadFile();
                } else {
                  // setTotalCustom(prevState => {
                  // const prevTotalCustom = [...prevState.selections]
                  // return {type: 'text-only', selections: filterdArray}
                  // })
                }
                onClose();
              }}
            >
              {({
                handleBlur,
                handleChange,
                handleSubmit,
                errors,
                touched,
                values,
              }) => (
                <>
                  <FormErrorBlock errors={errors} touched={touched} />

                  <Selection
                    context="box"
                    name="position-selection"
                    field="position"
                    label={"Position"}
                    options={[
                      { name: "left", value: "left" },
                      { name: "right", value: "right" },
                    ]}
                    handleChange={handleChange("position")}
                    errors={errors}
                    touched={touched}
                    value={values.position}
                    fontsLoaded={fontsLoaded}
                  />

                  <View className="graphics-form items-center">
                    <Text
                      style={{ fontFamily: "Nexa-Regular" }}
                      className="mb-4 text-center text-neutral-500"
                    >
                      You can upload your own graphic or logo or you can choose
                      from our university, hospital logo & icon we have
                    </Text>
                    <GraphicSelection
                      logoCollection={logoCollection}
                      value={values.imageUrl}
                      handleChange={handleChange("imageUrl")}
                      activeFile={activeFile}
                      setActiveFile={setActiveFile}
                    />
                  </View>

                  <View className="footer w-full justify-center pb-5 pt-4">
                    <View className="flex-row w-full ">
                      <View className="flex-1">
                        <Button
                          style={{ marginRight: 12 }}
                          type="secondary"
                          label="reset"
                          flex={true}
                          onPress={handleSubmit}
                        />
                      </View>
                      <View className="flex-1">
                        <Button
                          label="Apply"
                          flex={true}
                          onPress={handleSubmit}
                        />
                      </View>
                    </View>
                  </View>
                </>
              )}
            </Formik>
          </View>
        </Animated.View>
      </View>
    );

  if (context === "text-with-graphics")
    return (
      <View className="">
        <Panel
          onPress={() => handleToggle("text-with-graphics")}
          leftIcon={<RadioButton checked={active} />}
          rightIcon={<ChevronDownIcon size={20} color="black" />}
        >
          <View className="flex-1 w-full flex-row justify-between items-center ">
            <Text
              style={{ fontFamily: "Nexa-Regular" }}
              className="text-base text-black uppercase"
            >
              Add Both
            </Text>
            <Text
              style={{ fontFamily: "Nexa-Regular" }}
              className="text-base text-black font-normal"
            >
              +100 AED{" "}
            </Text>
          </View>
        </Panel>

        <Animated.View style={animateStyle} className="overflow-hidden">
          <View
            className="absolute w-full bottom-0 left-0 px-4"
            onLayout={(event) => {
              setActiveScreenHeight(event.nativeEvent.layout.height);
            }}
          >
            <Formik
              initialValues={{
                position: customProductId
                  ? customProductId.type === "text-with-graphics"
                    ? customProductId.selections[0].position
                    : ""
                  : "left",
                language: customProductId
                  ? customProductId.type === "text-with-graphics"
                    ? customProductId.selections[0].language
                    : ""
                  : languageOptions[0].value,
                fontStyle: customProductId
                  ? customProductId.type === "text-with-graphics"
                    ? customProductId.selections[0].fontStyle
                    : ""
                  : fontOptions[0].value,
                color: customProductId
                  ? customProductId.type === "text-with-graphics"
                    ? customProductId.selections[0].color
                    : ""
                  : colorValues[0].value,
                firstLine: customProductId
                  ? customProductId.type === "text-with-graphics"
                    ? customProductId.selections[0].firstLine
                    : ""
                  : "",
                secondLine: customProductId
                  ? customProductId.type === "text-with-graphics"
                    ? customProductId.selections[0].secondLine
                    : ""
                  : "",
                imageUrl: customProductId
                  ? customProductId.type === "text-with-graphics"
                    ? customProductId.selections[0].imageUrl
                    : ""
                  : "",
              }}
              validationSchema={validationSchemaTextWithGraphics}
              onSubmit={(values) => {
                if (values) {
                  setCustomProductId({
                    id: "gid://shopify/ProductVariant/12528927080565",
                    type: "text-with-graphics",
                    title: "Graphics",
                    price: "100",
                    selections: [{ ...values }],
                  });

                  handleUploadFile();
                } else {
                  // setTotalCustom(prevState => {
                  // const prevTotalCustom = [...prevState.selections]
                  // return {type: 'text-only', selections: filterdArray}
                  // })
                }
                onClose();
              }}
            >
              {({
                handleBlur,
                handleChange,
                handleSubmit,
                errors,
                touched,
                values,
              }) => (
                <View
                  onLayout={(event) =>
                    setActiveScreenHeight(event.nativeEvent.layout.height)
                  }
                >
                  <FormErrorBlock errors={errors} touched={touched} />

                  <Text className="text-lg text-black font-medium mb-3">
                    Add My Name
                  </Text>

                  <Selection
                    context="box"
                    name="position-selection"
                    field="position"
                    label={"Position"}
                    options={[
                      { name: "left", value: "left" },
                      { name: "right", value: "right" },
                    ]}
                    handleChange={handleChange("position")}
                    errors={errors}
                    touched={touched}
                    value={values.position}
                    fontsLoaded={fontsLoaded}
                  />

                  <Selection
                    name="language-selection"
                    field="language"
                    onChange={(item) => handleTextStyle(item)}
                    label={"Language"}
                    options={languageOptions}
                    handleChange={handleChange("language")}
                    errors={errors}
                    touched={touched}
                    value={values.language}
                    fontsLoaded={fontsLoaded}
                  />

                  <Selection
                    context="box"
                    name="font-selection"
                    field="fontStyle"
                    label={"Font"}
                    onChange={(item) => handleTextStyle(item)}
                    options={fontOptions}
                    handleChange={handleChange("fontStyle")}
                    errors={errors}
                    touched={touched}
                    value={values.fontStyle}
                    fontsLoaded={fontsLoaded}
                  />

                  <Selection
                    context="color"
                    name="color-selection"
                    field="color"
                    onChange={(item) => handleTextStyle(item)}
                    label={"Color"}
                    handleChange={handleChange("color")}
                    handleBlur={handleBlur("color")}
                    errors={errors}
                    touched={touched}
                    value={values.color}
                    colorValues={colorValues}
                    fontsLoaded={fontsLoaded}
                  />

                  <View className="mb-3">
                    <Text className="text-[14px] text-black font-normal mb-1">
                      First Line
                    </Text>
                    <TextInput
                      style={{
                        color: activeColorCode,
                        fontFamily: activeFont,
                      }}
                      maxLength={16}
                      className={`h-12 text-[18px] items-cetner border border-neutral-300 px-2 rounded-md`}
                      onChangeText={handleChange("firstLine")}
                      handleBlur={handleBlur("firstLine")}
                      value={values.firstLine}
                    />
                  </View>

                  <View className="mb-3">
                    <Text className="text-[14px] text-black font-normal mb-1">
                      Second Line
                    </Text>
                    <TextInput
                      style={{
                        color: activeColorCode,
                        fontFamily: activeFont,
                      }}
                      maxLength={16}
                      className={`h-12 text-[18px] items-cetner border border-neutral-300 px-2 rounded-md`}
                      onChangeText={handleChange("secondLine")}
                      handleBlur={handleBlur("secondLine")}
                      value={values.secondLine}
                    />
                  </View>

                  <View className="w-full h-[1px] border-b border-neutral-500 my-4"></View>

                  <Text className="text-lg text-black font-medium mb-3">
                    Laser Engraving
                  </Text>

                  <View className="graphics-form items-center pt-3">
                    <Text
                      style={{ fontFamily: "Nexa-Regular" }}
                      className="mb-4 text-center text-neutral-500"
                    >
                      You can upload your own graphic or logo or you can choose
                      from our university, hospital logo & icon we have
                    </Text>
                    {/* <GraphicSelection
                      logoCollection={logoCollection ?? []}
                      value={values.imageUrl}
                      handleChange={handleChange("imageUrl")}
                      activeFile={activeFile}
                      setActiveFile={setActiveFile}
                    /> */}
                  </View>

                  <View className="footer w-full justify-center pb-5 pt-4">
                    <View className="flex-row w-full ">
                      <View className="flex-1">
                        <Button
                          style={{ marginRight: 12 }}
                          type="secondary"
                          label="reset"
                          flex={true}
                          onPress={handleSubmit}
                        />
                      </View>
                      <View className="flex-1">
                        <Button
                          label="Apply"
                          flex={true}
                          onPress={handleSubmit}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </Animated.View>
      </View>
    );

  if (context === "laser-printing")
    return (
      <View className="">
        <Panel
          onPress={() => handleToggle("laser-printing")}
          leftIcon={<RadioButton checked={active} />}
          rightIcon={<ChevronDownIcon size={20} color="black" />}
        >
          <View className="flex-1 w-full flex-row justify-between items-center ">
            <Text
              style={{ fontFamily: "Nexa-Regular" }}
              className="text-base text-black uppercase"
            >
              laser engraving
            </Text>
            <Text
              style={{ fontFamily: "Nexa-Regular" }}
              className="text-base text-black font-normal"
            >
              +35 AED{" "}
            </Text>
          </View>
        </Panel>

        <Animated.View style={animateStyle} className="overflow-hidden">
          <View
            className="absolute w-full bottom-0 left-0 px-4"
            onLayout={(event) => {
              setActiveScreenHeight(event.nativeEvent.layout.height);
            }}
          >
            <Formik
              initialValues={{
                laserFontStyle: customProductId
                  ? customProductId.type === "laser-printing"
                    ? customProductId.selections[0].fontStyle
                    : ""
                  : fontOptions[0].value,

                laserFirstLine: customProductId
                  ? customProductId.type === "laser-printing"
                    ? customProductId.selections[0].firstLine
                    : ""
                  : "",
                laserSecondLine: customProductId
                  ? customProductId.type === "laser-printing"
                    ? customProductId.selections[0].secondLine
                    : ""
                  : "",
              }}
              validationSchema={validationSchemaLaserOnly}
              onSubmit={(values) => {
                if (values) {
                  setCustomProductId({
                    id: "gid://shopify/ProductVariant/12528927047797",
                    type: "laser-printing",
                    title: "Laser engraving",
                    price: "50",
                    selections: [{ ...values }],
                  });
                } else {
                  // setTotalCustom(prevState => {
                  // const prevTotalCustom = [...prevState.selections]
                  // return {type: 'text-only', selections: filterdArray}
                  // })
                }
                onClose();
              }}
            >
              {({
                handleBlur,
                handleChange,
                handleSubmit,
                errors,
                touched,
                values,
              }) => (
                <>
                  <FormErrorBlock errors={errors} touched={touched} />
                  {/* <ImageSelection
                  title="Select Position"
                  style={{ marginBottom: 12 }}
                  defaultValue={values.position}
                  handleChange={handleChange("position")}
                  images={[
                    {
                      url: "https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg",
                      title: "Left",
                    },
                    {
                      url: "https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg",
                      title: "Right",
                    },
                  ]}
                /> */}

                  <Selection
                    context="box"
                    name="font-selection"
                    field="fontStyle"
                    label={"Font"}
                    onChange={(item) => handleTextStyle(item)}
                    options={fontOptions}
                    handleChange={handleChange("laserFontStyle")}
                    errors={errors}
                    touched={touched}
                    value={values.laserFontStyle}
                    fontsLoaded={fontsLoaded}
                  />

                  <View className="mb-3">
                    <Text className="text-base text-black font-medium mb-3">
                      First Line
                    </Text>
                    <TextInput
                      style={{
                        fontFamily: activeFont,
                      }}
                      maxLength={16}
                      className={`h-12 text-[18px] items-cetner border border-neutral-300 px-2 rounded-md`}
                      onChangeText={handleChange("laserFirstLine")}
                      handleBlur={handleBlur("laserFirstLine")}
                      value={values.laserFirstLine}
                    />
                  </View>

                  <View className="mb-3">
                    <Text className="text-base text-black font-medium mb-3">
                      Second Line
                    </Text>
                    <TextInput
                      style={{
                        fontFamily: activeFont,
                      }}
                      maxLength={16}
                      className={`h-12 text-[18px] items-cetner border border-neutral-300 px-2 rounded-md`}
                      onChangeText={handleChange("laserSecondLine")}
                      handleBlur={handleBlur("laserSecondLine")}
                      value={values.laserSecondLine}
                    />
                  </View>

                  <View className="footer w-full justify-center pb-5">
                    <View className="flex-row w-full ">
                      <View className="flex-1">
                        <Button
                          style={{ marginRight: 12 }}
                          type="secondary"
                          label="reset"
                          flex={true}
                          onPress={handleSubmit}
                        />
                      </View>
                      <View className="flex-1">
                        <Button
                          label="Apply"
                          flex={true}
                          onPress={handleSubmit}
                        />
                      </View>
                    </View>
                  </View>
                </>
              )}
            </Formik>
          </View>
        </Animated.View>
      </View>
    );

  if (context === "tube-printing")
    return (
      <View className="">
        <Panel
          onPress={() => handleToggle("tube-printing")}
          leftIcon={<RadioButton checked={active} />}
          rightIcon={<ChevronDownIcon size={20} color="black" />}
        >
          <View className="flex-1 w-full flex-row justify-between items-center ">
            <Text
              style={{ fontFamily: "Nexa-Regular" }}
              className="text-base text-black uppercase"
            >
              tube printing
            </Text>
            <Text
              style={{ fontFamily: "Nexa-Regular" }}
              className="text-base text-black font-normal"
            >
              +35 AED{" "}
            </Text>
          </View>
        </Panel>

        <Animated.View style={animateStyle} className="overflow-hidden">
          <View
            className="absolute w-full bottom-0 left-0 px-4"
            onLayout={(event) => {
              setActiveScreenHeight(event.nativeEvent.layout.height);
            }}
          >
            <Formik
              initialValues={{
                position: customProductId
                  ? customProductId.type === "tube-printing"
                    ? customProductId.selections[0].position
                    : ""
                  : "left",
                language: customProductId
                  ? customProductId.type === "tube-printing"
                    ? customProductId.selections[0].language
                    : ""
                  : languageOptions[0].value,
                fontStyle: customProductId
                  ? customProductId.type === "tube-printing"
                    ? customProductId.selections[0].fontStyle
                    : ""
                  : fontOptions[0].value,
                color: customProductId
                  ? customProductId.type === "tube-printing"
                    ? customProductId.selections[0].color
                    : ""
                  : colorValues[0].name,
                firstLine: customProductId
                  ? customProductId.type === "tube-printing"
                    ? customProductId.selections[0].firstLine
                    : ""
                  : "",
                secondLine: customProductId
                  ? customProductId.type === "tube-printing"
                    ? customProductId.selections[0].secondLine
                    : ""
                  : "",
              }}
              validationSchema={validationSchemaTextOnly}
              onSubmit={(values) => {
                if (values) {
                  setCustomProductId({
                    id: "gid://shopify/ProductVariant/12528927047797",
                    type: "tube-printing",
                    title: "Tube printing",
                    price: "50",
                    selections: [{ ...values }],
                  });
                } else {
                  // setTotalCustom(prevState => {
                  // const prevTotalCustom = [...prevState.selections]
                  // return {type: 'text-only', selections: filterdArray}
                  // })
                }
                onClose();
              }}
            >
              {({
                handleBlur,
                handleChange,
                handleSubmit,
                errors,
                touched,
                values,
              }) => (
                <>
                  <FormErrorBlock errors={errors} touched={touched} />
                  {/* <ImageSelection
                    title="Select Position"
                    style={{ marginBottom: 12 }}
                    defaultValue={values.position}
                    handleChange={handleChange("position")}
                    images={[
                      {
                        url: "https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg",
                        title: "Left",
                      },
                      {
                        url: "https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg",
                        title: "Right",
                      },
                    ]}
                  /> */}

                  <Selection
                    context="box"
                    name="position-selection"
                    field="position"
                    label={"Position"}
                    options={[
                      { name: "left", value: "left" },
                      { name: "right", value: "right" },
                    ]}
                    handleChange={handleChange("position")}
                    errors={errors}
                    touched={touched}
                    value={values.position}
                    fontsLoaded={fontsLoaded}
                  />

                  <Selection
                    name="language-selection"
                    field="language"
                    onChange={(item) => handleTextStyle(item)}
                    label={"Language"}
                    options={languageOptions}
                    handleChange={handleChange("language")}
                    errors={errors}
                    touched={touched}
                    value={values.language}
                    fontsLoaded={fontsLoaded}
                  />

                  <Selection
                    context="box"
                    name="font-selection"
                    field="fontStyle"
                    label={"Font"}
                    onChange={(item) => handleTextStyle(item)}
                    options={fontOptions}
                    handleChange={handleChange("fontStyle")}
                    errors={errors}
                    touched={touched}
                    value={values.fontStyle}
                    fontsLoaded={fontsLoaded}
                  />

                  <Selection
                    context="color"
                    name="color-selection"
                    field="color"
                    onChange={(item) => handleTextStyle(item)}
                    label={"Color"}
                    handleChange={handleChange("color")}
                    handleBlur={handleBlur("color")}
                    errors={errors}
                    touched={touched}
                    value={values.color}
                    colorValues={colorValues}
                    fontsLoaded={fontsLoaded}
                  />

                  <View className="mb-3">
                    <Text className="text-base text-black font-medium mb-3">
                      First Line
                    </Text>
                    <TextInput
                      style={{
                        color: activeColorCode,
                        fontFamily: activeFont,
                      }}
                      maxLength={16}
                      className={`h-12 text-[18px] items-cetner border border-neutral-300 px-2 rounded-md`}
                      onChangeText={handleChange("firstLine")}
                      handleBlur={handleBlur("firstLine")}
                      value={values.firstLine}
                    />
                  </View>

                  <View className="mb-3">
                    <Text className="text-base text-black font-medium mb-3">
                      Second Line
                    </Text>
                    <TextInput
                      style={{
                        color: activeColorCode,
                        fontFamily: activeFont,
                      }}
                      maxLength={16}
                      className={`h-12 text-[18px] items-cetner border border-neutral-300 px-2 rounded-md`}
                      onChangeText={handleChange("secondLine")}
                      handleBlur={handleBlur("secondLine")}
                      value={values.secondLine}
                    />
                  </View>

                  <View className="footer w-full justify-center pb-5">
                    <View className="flex-row w-full ">
                      <View className="flex-1">
                        <Button
                          style={{ marginRight: 12 }}
                          type="secondary"
                          label="reset"
                          flex={true}
                          onPress={handleSubmit}
                        />
                      </View>
                      <View className="flex-1">
                        <Button
                          label="Apply"
                          flex={true}
                          onPress={handleSubmit}
                        />
                      </View>
                    </View>
                  </View>
                </>
              )}
            </Formik>
          </View>
        </Animated.View>
      </View>
    );

  if (context === "laser-with-tube-printing")
    return (
      <View className="">
        <Panel
          onPress={() => handleToggle("laser-with-tube-printing")}
          leftIcon={<RadioButton checked={active} />}
          rightIcon={<ChevronDownIcon size={20} color="black" />}
        >
          <View className="flex-1 w-full flex-row justify-between items-center ">
            <View className="flex-1">
              <Text
                style={{ fontFamily: "Nexa-Regular" }}
                className="text-base text-black uppercase"
              >
                add both
              </Text>
            </View>
            <Text
              style={{ fontFamily: "Nexa-Regular" }}
              className="text-base text-black font-normal"
            >
              +35 AED{" "}
            </Text>
          </View>
        </Panel>

        <Animated.View style={animateStyle} className="overflow-hidden">
          <View
            className="absolute w-full bottom-0 left-0 px-4"
            onLayout={(event) => {
              setActiveScreenHeight(event.nativeEvent.layout.height);
            }}
          >
            <Formik
              initialValues={{
                laserFontStyle: customProductId
                  ? customProductId.type === "laser-with-tube-printing"
                    ? customProductId.selections[0].laserFontStyle
                    : ""
                  : fontOptions[0].value,
                laserFirstLine: customProductId
                  ? customProductId.type === "laser-with-tube-printing"
                    ? customProductId.selections[0].laserFirstLine
                    : ""
                  : "",
                laserSecondLine: customProductId
                  ? customProductId.type === "laser-with-tube-printing"
                    ? customProductId.selections[0].laserSecondLine
                    : ""
                  : "",
                position: customProductId
                  ? customProductId.type === "laser-with-tube-printing"
                    ? customProductId.selections[0].position
                    : ""
                  : "left",
                language: customProductId
                  ? customProductId.type === "laser-with-tube-printing"
                    ? customProductId.selections[0].language
                    : ""
                  : languageOptions[0].value,
                fontStyle: customProductId
                  ? customProductId.type === "laser-with-tube-printing"
                    ? customProductId.selections[0].fontStyle
                    : ""
                  : fontOptions[0].value,
                color: customProductId
                  ? customProductId.type === "laser-with-tube-printing"
                    ? customProductId.selections[0].color
                    : ""
                  : colorValues[0].name,
                firstLine: customProductId
                  ? customProductId.type === "laser-with-tube-printing"
                    ? customProductId.selections[0].firstLine
                    : ""
                  : "",
                secondLine: customProductId
                  ? customProductId.type === "laser-with-tube-printing"
                    ? customProductId.selections[0].secondLine
                    : ""
                  : "",
              }}
              validationSchema={validationSchemaStethoscopeBoth}
              onSubmit={(values) => {
                if (values) {
                  setCustomProductId({
                    id: "gid://shopify/ProductVariant/12528927047797",
                    type: "laser-with-tube-printing",
                    title: "Tube printing",
                    price: "50",
                    selections: [{ ...values }],
                  });
                } else {
                  // setTotalCustom(prevState => {
                  // const prevTotalCustom = [...prevState.selections]
                  // return {type: 'text-only', selections: filterdArray}
                  // })
                }
                onClose();
              }}
            >
              {({
                handleBlur,
                handleChange,
                handleSubmit,
                errors,
                touched,
                values,
              }) => (
                <>
                  <FormErrorBlock errors={errors} touched={touched} />
                  {/* <ImageSelection
                    title="Select Position"
                    style={{ marginBottom: 12 }}
                    defaultValue={values.position}
                    handleChange={handleChange("position")}
                    images={[
                      {
                        url: "https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg",
                        title: "Left",
                      },
                      {
                        url: "https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg",
                        title: "Right",
                      },
                    ]}
                  /> */}

                  <Text className="text-lg text-black font-medium mb-3">
                    Laser Engraving
                  </Text>

                  <Selection
                    context="box"
                    name="font-selection"
                    field="fontStyle"
                    label={"Font"}
                    onChange={(item) => handleTextStyle(item)}
                    options={fontOptions}
                    handleChange={handleChange("laserFontStyle")}
                    errors={errors.laserFontStyle}
                    touched={touched.laserFontStyle}
                    value={values.fontStyle}
                    fontsLoaded={fontsLoaded}
                  />

                  <View className="mb-3">
                    <Text className="text-base text-black font-medium mb-3">
                      First Line
                    </Text>
                    <TextInput
                      style={{
                        fontFamily: activeFont,
                      }}
                      maxLength={16}
                      className={`h-12 text-[18px] items-cetner border border-neutral-300 px-2 rounded-md`}
                      onChangeText={handleChange("laserFirstLine")}
                      handleBlur={handleBlur("laserFirstLine")}
                      value={values.laserFirstLine}
                    />
                  </View>

                  <View className="mb-3">
                    <Text className="text-base text-black font-medium mb-3">
                      Second Line
                    </Text>
                    <TextInput
                      style={{
                        fontFamily: activeFont,
                      }}
                      maxLength={16}
                      className={`h-12 text-[18px] items-cetner border border-neutral-300 px-2 rounded-md`}
                      onChangeText={handleChange("laserSecondLine")}
                      handleBlur={handleBlur("laserSecondLine")}
                      value={values.laserSecondLine}
                    />
                  </View>

                  <View className="w-full h-[1px] border-b border-neutral-500 my-4"></View>

                  <Text className="text-lg text-black font-medium mb-3">
                    Tube Printing
                  </Text>

                  <Selection
                    context="box"
                    name="position-selection"
                    field="position"
                    label={"Position"}
                    options={[
                      { name: "left", value: "left" },
                      { name: "right", value: "right" },
                    ]}
                    handleChange={handleChange("position")}
                    errors={errors}
                    touched={touched}
                    value={values.position}
                    fontsLoaded={fontsLoaded}
                  />

                  <Selection
                    name="language-selection"
                    field="language"
                    onChange={(item) => handleTextStyle(item)}
                    label={"Language"}
                    options={languageOptions}
                    handleChange={handleChange("language")}
                    errors={errors}
                    touched={touched}
                    value={values.language}
                    fontsLoaded={fontsLoaded}
                  />

                  <Selection
                    context="box"
                    name="font-selection"
                    field="fontStyle"
                    label={"Font"}
                    onChange={(item) => handleTextStyle(item)}
                    options={fontOptions}
                    handleChange={handleChange("fontStyle")}
                    errors={errors}
                    touched={touched}
                    value={values.fontStyle}
                    fontsLoaded={fontsLoaded}
                  />

                  <Selection
                    context="color"
                    name="color-selection"
                    field="color"
                    onChange={(item) => handleTextStyle(item)}
                    label={"Color"}
                    handleChange={handleChange("color")}
                    handleBlur={handleBlur("color")}
                    errors={errors}
                    touched={touched}
                    value={values.color}
                    colorValues={colorValues}
                    fontsLoaded={fontsLoaded}
                  />

                  <View className="mb-3">
                    <Text className="text-base text-black font-medium mb-3">
                      First Line
                    </Text>
                    <TextInput
                      style={{
                        color: activeColorCode,
                        fontFamily: activeFont,
                      }}
                      maxLength={16}
                      className={`h-12 text-[18px] items-cetner border border-neutral-300 px-2 rounded-md`}
                      onChangeText={handleChange("firstLine")}
                      handleBlur={handleBlur("firstLine")}
                      value={values.firstLine}
                    />
                  </View>

                  <View className="mb-3">
                    <Text className="text-base text-black font-medium mb-3">
                      Second Line
                    </Text>
                    <TextInput
                      style={{
                        color: activeColorCode,
                        fontFamily: activeFont,
                      }}
                      maxLength={16}
                      className={`h-12 text-[18px] items-cetner border border-neutral-300 px-2 rounded-md`}
                      onChangeText={handleChange("secondLine")}
                      handleBlur={handleBlur("secondLine")}
                      value={values.secondLine}
                    />
                  </View>

                  <View className="footer w-full justify-center pb-5">
                    <View className="flex-row w-full ">
                      <View className="flex-1">
                        <Button
                          style={{ marginRight: 12 }}
                          type="secondary"
                          label="reset"
                          flex={true}
                          onPress={handleSubmit}
                        />
                      </View>
                      <View className="flex-1">
                        <Button
                          label="Apply"
                          flex={true}
                          onPress={handleSubmit}
                        />
                      </View>
                    </View>
                  </View>
                </>
              )}
            </Formik>
          </View>
        </Animated.View>
      </View>
    );
};

export default AccordianItem;
