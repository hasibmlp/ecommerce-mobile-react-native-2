import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { ChevronDownIcon, XMarkIcon } from "react-native-heroicons/outline";
import * as Yup from "yup";
import CustomSelectionInterface from "../customization/CustomSelectionInterface";
import { SafeAreaView } from "react-native-safe-area-context";
import RadioButton from "../buttons/RadioButton";
import Panel from "../actions/Panel";
import CustomSelection from "../customization/CustomSelection";
import { Fragment, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Formik } from "formik";
import Selection from "../customization/Selection";
import Button from "../buttons/Button";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import GraphicSelection from "../customization/GraphicSelection";

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

const logoCollection = [
  {
    id: "0",
    title: "hospital",
    images: [
      {
        name: "",
        url: "https://cdn.shopify.com/s/files/1/2610/4676/files/AL_DHAFRA_HOSPITAL.png?v=1641294087",
      },
      {
        name: "",
        url: "https://cdn.shopify.com/s/files/1/2610/4676/files/new-homepage-5.jpg?v=1622576814",
      },
      {
        name: "",
        url: "https://cdn.shopify.com/s/files/1/2610/4676/files/Palestinesurgicalhat3.jpg?v=1702905282",
      },
      {
        name: "",
        url: "https://cdn.shopify.com/s/files/1/2610/4676/products/HOPE-HEART-EDITED.jpg?v=1618900022",
      },
      {
        name: "",
        url: "https://cdn.shopify.com/s/files/1/2610/4676/products/HORSE_KOI.jpg?v=1571709410",
      },
    ],
  },
  {
    id: "1",
    title: "university",
    images: [
      {
        name: "",
        url: "https://cdn.shopify.com/s/files/1/2610/4676/files/Sharjah_University.jpg?v=1704898858",
      },
      {
        name: "",
        url: "https://cdn.shopify.com/s/files/1/2610/4676/files/UNIVERSITY_OF_FUJAIRAH.png?v=1642422731",
      },
      {
        name: "",
        url: "https://cdn.shopify.com/s/files/1/2610/4676/files/University_of_Sharjah_Logo.png?v=1642422731",
      },
      {
        name: "",
        url: "https://cdn.shopify.com/s/files/1/2610/4676/files/KHALIFA_UNIVERSITY.jpg?v=1642422731",
      },
      {
        name: "",
        url: "https://cdn.shopify.com/s/files/1/2610/4676/files/GULF_MEDICAL_UNIVERSITY_LOGO.png?v=1642422731",
      },
      {
        name: "",
        url: "https://cdn.shopify.com/s/files/1/2610/4676/files/ABU_DHABI_UNIVERSITY.png?v=1642422731",
      },
      {
        name: "",
        url: "https://cdn.shopify.com/s/files/1/2610/4676/files/UAE_UNIVERSITY.png?v=1641295609",
      },
      {
        name: "",
        url: "https://cdn.shopify.com/s/files/1/2610/4676/files/AJMAN_UNIVERSITY_LOGO.jpg?v=1642422731",
      },
    ],
  },
  {
    id: "2",
    title: "icons",
    images: [
      {
        name: "",
        url: "https://cdn.shopify.com/s/files/1/2610/4676/files/Stethoscope_icon_7eec126b-73c5-4851-b6b4-38aeee49724b.jpg?v=1705471845",
      },
      {
        name: "",
        url: "https://cdn.shopify.com/s/files/1/2610/4676/files/Icon_only_borderless.png?v=1688203573",
      },
      {
        name: "",
        url: "https://cdn.shopify.com/s/files/1/2610/4676/files/icon__store.png?v=1613552271",
      },
    ],
  },
];

const languageOptions = [
  { name: "en", value: "English" },
  { name: "ar", value: "العربي" },
];
const fontOptions = [
  {
    name: "op1",
    value: "Roboto Mono",
    fontFamily: "Robo-Mono",
  },
  { name: "op2", value: "Kalnia", fontFamily: "Kalnia" },
  { name: "op3", value: "Ubuntu", fontFamily: "Ubuntu" },
];
const colorValues = [
  {
    name: "navy",
    value: "Navy",
    colorCode: "#000080",
  },
  {
    name: "black",
    value: "Black",
    colorCode: "#000",
  },
  {
    name: "orange",
    value: "Orange",
    colorCode: "#FFA500",
  },
];

const EmbroiderySelection = ({
  onClose,
  customProductId,
  setCustomProductId,
}) => {
  const [activeScreen, setActiveScreen] = useState(
    customProductId?.type ?? null
  );

  const [activeSelectionsForTextDisplay, setActiveSelectionsForTextDisplay] =
    useState({ postion: "", selections: [] });
  const [activeFile, setActiveFile] = useState(false);
  const [currentActiveFileImageUrl, setCurrentActiveFileImageurl] =
    useState(null);
  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    "Robo-Mono": require("../../assets/fonts/RobotoMono-SemiBold.ttf"),
    Kalnia: require("../../assets/fonts/Kalnia-SemiBold.ttf"),
    Ubuntu: require("../../assets/fonts/Ubuntu-Bold.ttf"),
  });
  const cusotmSelections = customProductId || null;
  const activeColorCode = activeSelectionsForTextDisplay.selections.find(
    (i) => i?.type === "color-selection"
  )?.colorCode;
  const activeFont = activeSelectionsForTextDisplay.selections.find(
    (i) => i?.type === "font-selection"
  )?.fontFamily;

  const handleTextStyle = (item) => {
    setActiveSelectionsForTextDisplay((prevState) => {
      if (item?.type === "position") {
        const prevSelections = prevState.selections;
        return { postion: item.postion, selections: prevSelections };
      } else {
        const prevSelection = [...prevState.selections];
        const itemIndex = prevSelection.findIndex(
          (i) => i?.type === item?.type
        );
        if (itemIndex > -1) {
          prevSelection.splice(itemIndex, 1);
        }
        prevSelection.push(item);
        return { selections: prevSelection };
      }
    });
  };

  const handleSelection = (type) => {
    setTotalCustom((prevState) => {
      return { type: type, active: false, selections: prevState.selections };
    });
    // setActiveScreen(true);
  };
  const handleReset = () => {
    setTotalCustom({ type: "", position: "", selections: [] });
    setCustomProductId("");
  };

  const handleUploadFile = async () => {
    try {
      console.log("ACTIVE FILE", activeFile);
      const result = activeFile;
      const url = "https://api.cloudinary.com/v1_1/dujrllgbs/image/upload";

      console.log("RESULT", result.assets[0].uri);

      if (!result.canceled) {
        setLoading(true);
        const data = new FormData();
        data.append("file", {
          name: result.assets[0].name,
          type: result.assets[0].mimeType,
          uri:
            Platform.OS === "ios"
              ? result.assets[0].uri.replace("file://", "")
              : result.assets[0].uri,
        });
        data.append("upload_preset", "uq0ipq46");

        const res = await fetch(url, {
          method: "POST",
          body: data,
        });

        const cloudData = await res.json();

        if (cloudData) {
          setCurrentActiveFileImageurl(cloudData.url);
        } else {
          setCurrentActiveFileImageurl("");
        }
      }
    } catch (error) {
      console.error("Error picking document:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {}, [fontsLoaded]);

  if (!fontsLoaded) return null;

  console.log(customProductId);

  return (
    <ScrollView className="h-full" automaticallyAdjustKeyboardInsets>
      <View className="bg-neutral-300 w-full h-[200]"></View>

      <View className="pb-20">
        <AccordianItem
          context="text-only"
          active={activeScreen === "text-only"}
          customProductId={customProductId}
          setCustomProductId={setCustomProductId}
          languageOptions={languageOptions}
          fontOptions={fontOptions}
          colorValues={colorValues}
          activeFile={activeFile}
          handleUploadFile={handleUploadFile}
          setActiveFile={setActiveFile}
          onClose={onClose}
          activeColorCode={activeColorCode}
          activeFont={activeFont}
          handleTextStyle={handleTextStyle}
          fontsLoaded={fontsLoaded}
          setActiveScreen={setActiveScreen}
        />

        <AccordianItem
          context="graphics-only"
          active={activeScreen === "graphics-only"}
          customProductId={customProductId}
          setCustomProductId={setCustomProductId}
          languageOptions={languageOptions}
          fontOptions={fontOptions}
          colorValues={colorValues}
          activeFile={activeFile}
          handleUploadFile={handleUploadFile}
          setActiveFile={setActiveFile}
          onClose={onClose}
          fontsLoaded={fontsLoaded}
          setActiveScreen={setActiveScreen}
        />

        <AccordianItem
          context="text-with-graphics"
          active={activeScreen === "text-with-graphics"}
          customProductId={customProductId}
          setCustomProductId={setCustomProductId}
          languageOptions={languageOptions}
          fontOptions={fontOptions}
          colorValues={colorValues}
          activeFile={activeFile}
          handleUploadFile={handleUploadFile}
          setActiveFile={setActiveFile}
          onClose={onClose}
          activeColorCode={activeColorCode}
          activeFont={activeFont}
          handleTextStyle={handleTextStyle}
          fontsLoaded={fontsLoaded}
          setActiveScreen={setActiveScreen}
        />
      </View>
    </ScrollView>
  );

  return (
    <View className="flex-1">
      <View className="h-10 flex-row items-center justify-end px-3">
        <Pressable className="p-1" onPress={onClose}>
          <XMarkIcon size={24} color="black" />
        </Pressable>
      </View>

      <View className="flex-1 overflow-hidden">
        <CustomSelectionInterface
          totalCustom={totalCustom}
          setTotalCustom={setTotalCustom}
          onClose={onClose}
          customProductId={customProductId}
          setCustomProductId={setCustomProductId}
        />

        {/* <View>
                    <Text className="text-[20px] text-[#89c157] font-medium uppercase mx-auto mb-5 tracking-[2px]">Embroidery</Text>
                    <View className="border-y border-gray-200 flex-row justify-between px-3">
                      <TabHeader 
                        title="Text" 
                        onPress={() => setActiveTab('tab-a')}
                        selected={totalCustom.selections.find(item => (item.type === 'text-upload')?.data?.firstLine?.length > 0 || totalCustom.selections.find(item => item.type === 'text-upload')?.data?.secondLine?.length > 0)}
                        active={activeTab === 'tab-a'}
                      />
  
                      <TabHeader 
                        title="Logo & Graphics" 
                        onPress={() => setActiveTab('tab-b')}
                        selected={totalCustom.selections.find(item => (item.type === 'text-upload')?.data?.firstLine?.length > 0 || totalCustom.selections.find(item => item.type === 'text-upload')?.data?.secondLine?.length > 0)}
                        active={activeTab === 'tab-b'}
                      />
  
                    </View>
                  </View> */}
      </View>

      <SafeAreaView />
    </View>
  );
};

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
}) => {
  const heightOffset = useSharedValue(active ? 1 : 0);
  const [activeScreenHeight, setActiveScreenHeight] = useState(0);

  const animateStyle = useAnimatedStyle(() => ({
    height: interpolate(heightOffset.value, [0, 1], [0, activeScreenHeight]),
  }));

  const handleToggle = (value) => {
    setActiveScreen(prev => prev === value ? null : value);
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

  if (context === "text-only")
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
                console.log(values);
                if (values) {
                  setCustomProductId({
                    id: "gid://shopify/ProductVariant/12528927080565",
                    type: "graphics-only",
                    title: "Graphics",
                    price: "100",
                    selections: [{ ...values }],
                  });

                  handleUploadFile();

                  console.log("VALUES: ", values);
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
              validationSchema={validationSchemaGraphicsOnly}
              onSubmit={(values) => {
                console.log(values);
                if (values) {
                  setCustomProductId({
                    id: "gid://shopify/ProductVariant/12528927080565",
                    type: "text-with-graphics",
                    title: "Graphics",
                    price: "100",
                    selections: [{ ...values }],
                  });

                  handleUploadFile();

                  console.log("VALUES: ", values);
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

                  <View className="graphics-form items-center pt-3">
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
                </View>
              )}
            </Formik>
          </View>
        </Animated.View>
      </View>
    );
};

const FormErrorBlock = ({ errors, touched }) => {
  const errorFields = [
    "position",
    "language",
    "color",
    "fontStyle",
    "firstLine",
    "secondLine",
    "imageUrl",
  ];

  const hasErrors = errorFields.some(
    (field) => touched[field] && errors[field]
  );

  //   useEffect(() => {
  //     if (errors) {
  //       scrollY.current.scrollTo({
  //         options: { x: 0, y: 0 },
  //       });
  //     }
  //   }, [errors]);

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

export default EmbroiderySelection;
