import { Dimensions, ScrollView, View } from "react-native";
import { useEffect, useState } from "react";
import AccordianItem from "../AccordianItem";
import { useFonts } from "expo-font";
import {
  GET_CUSTOMIZATIN_COLLECTION,
  GET_PRODUCT,
} from "../../graphql/queries";
import Skeleton from "../skeletons/Skeleton";

const SCREEN_WIDTH = Dimensions.get("screen").width;

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

const CustomSelection = ({
  context = "embroidery",
  onClose,
  customProductId,
  setCustomProductId,
  customizationCollectionData,
  customizationCollectionLoading,
}) => {
  const [activeScreen, setActiveScreen] = useState(
    customProductId ?? null
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

  const activeColorCode = activeSelectionsForTextDisplay.selections.find(
    (i) => i?.type === "color-selection"
  )?.colorCode;
  const activeFont = activeSelectionsForTextDisplay.selections.find(
    (i) => i?.type === "font-selection"
  )?.fontFamily;

  const handleTextStyle = (item) => {
    setActiveSelectionsForTextDisplay((prevState) => {
      if (item?.type === "position") {
        return { postion: item.postion, selections: prevState.selections };
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

  const handleUploadFile = async () => {
    try {
      const result = activeFile;
      const url = "https://api.cloudinary.com/v1_1/dujrllgbs/image/upload";

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {}, [fontsLoaded]);

  const servicesProducts =
    customizationCollectionData?.collection?.products.edges;

  if (!fontsLoaded) return null;


  return (
    <ScrollView className="h-full" automaticallyAdjustKeyboardInsets>
      <View className="bg-neutral-300 w-full h-[200] mb-2">
        {customizationCollectionLoading && (
          <View>
            <Skeleton
              width={SCREEN_WIDTH}
              height={200}
              style={{ marginBottom: 8 }}
            />
          </View>
        )}
      </View>

      <View className="pb-20">
        {servicesProducts?.map((serviceProduct) => {
          if (
            serviceProduct?.node?.handle === "embroidery-service-mobile-app" &&
            context === "embroidery"
          )
            return (
              <View key={serviceProduct.node.id}>
                {serviceProduct.node.variants?.edges.map((item) => {
                  
                  if (item.node.selectedOptions[0].value === "Text")
                    return (
                      <AccordianItem
                        key={item.node.id}
                        context="text-only"
                        data={item.node}
                        active={activeScreen?.id === item.node.id}
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
                        loading={customizationCollectionLoading}
                        activeSelect={customProductId?.type === "text-only" ? customProductId.selections[0] : ''}
                        graphicsCollection={
                          customizationCollectionData?.collection
                            ? customizationCollectionData.collection?.metafields.find(
                                (item) => item.key === "embroidery_graphics"
                              )?.value
                            : []
                        }
                      />
                    );
                  else if (
                    item.node.selectedOptions[0].value === "Graphic Only"
                  )
                    return (
                      <AccordianItem
                        key={item.node.id}
                        context="graphics-only"
                        data={item.node}
                        active={activeScreen?.id === item.node.id}
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
                        loading={customizationCollectionLoading}
                        graphicsCollection={
                          customizationCollectionData?.collection
                            ? customizationCollectionData.collection?.metafields.find(
                                (item) => item.key === "embroidery_graphics"
                              )?.value
                            : []
                        }
                      />
                    );
                  else if (
                    item.node.selectedOptions[0].value === "Text & Graphic"
                  )
                    return (
                      <AccordianItem
                        key={item.node.id}
                        context="text-with-graphics"
                        data={item.node}
                        active={activeScreen?.id === item.node.id}
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
                        loading={customizationCollectionLoading}
                        graphicsCollection={
                          customizationCollectionData?.collection
                            ? customizationCollectionData.collection?.metafields.find(
                                (item) => item.key === "embroidery_graphics"
                              )?.value
                            : []
                        }
                      />
                    );
                  else return null;
                })}
              </View>
            );
          else if (
            serviceProduct?.node?.handle ===
              "stethoscope-customization-mobile-app" &&
            context === "stethoscope"
          )
            return (
              <View key={serviceProduct.node.id}>
                {serviceProduct.node.variants?.edges.map((item) => {
                  if (item.node.selectedOptions[0].value === "Laser Engraving")
                    return (
                      <AccordianItem
                        key={item.node.id}
                        context="laser-printing"
                        data={item.node}
                        active={activeScreen?.id === item.node.id}
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
                        loading={customizationCollectionLoading}
                        graphicsCollection={
                          customizationCollectionData?.collection
                            ? customizationCollectionData.collection?.metafields.find(
                                (item) => item.key === "embroidery_graphics"
                              )?.value
                            : []
                        }
                      />
                    );
                  else if (
                    item.node.selectedOptions[0].value === "Tube Printing"
                  )
                    return (
                      <AccordianItem
                        key={item.node.id}
                        context="tube-printing"
                        data={item.node}
                        active={activeScreen?.id === item.node.id}
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
                        loading={customizationCollectionLoading}
                        graphicsCollection={
                          customizationCollectionData?.collection
                            ? customizationCollectionData.collection?.metafields.find(
                                (item) => item.key === "embroidery_graphics"
                              )?.value
                            : []
                        }
                      />
                    );
                  else if (
                    item.node.selectedOptions[0].value ===
                    "Engraving & Tube printing"
                  )
                    return (
                      <AccordianItem
                        key={item.node.id}
                        context="laser-with-tube-printing"
                        data={item.node}
                        active={activeScreen?.id === item.node.id}
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
                        loading={customizationCollectionLoading}
                        graphicsCollection={
                          customizationCollectionData?.collection
                            ? customizationCollectionData.collection?.metafields.find(
                                (item) => item.key === "embroidery_graphics"
                              )?.value
                            : []
                        }
                      />
                    );
                  else return null;
                })}
              </View>
            );
        })}
      </View>
    </ScrollView>
  );
};

export default CustomSelection;
