import {
  FlatList,
  Pressable,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// import { Image } from "expo-image";
import { useState } from "react";
import { PlusCircleIcon, XMarkIcon } from "react-native-heroicons/outline";
import * as DocumentPicker from "expo-document-picker";

import LoadingFullScreen from "../Sidebar/LoadingFullScreen";
import { FONT_FAMILY } from "../../theme";

const blurhash = "LEHV6nWB2yk8pyo0adR*.7kCMdnj";

const GraphicSelection = ({
  logoCollection,
  handleChange,
  value,
  activeFile,
  setActiveFile,
  loading,
  setCustomProductId,
}) => {
  const initialValue = value;
  const [activeTab, setActiveTab] = useState(logoCollection[0]);

  const [selfUploadedFile, setSeflUploadedFile] = useState([]);

  const handleFileUpload = async () => {
    result = await DocumentPicker.getDocumentAsync();

    if (!result.canceled) {
      setSeflUploadedFile([...selfUploadedFile, result]);
    }
  };

  const handleLogoPress = (item) => {
    const uploadFile = item.assets
      ? item
      : {
          assets: [
            {
              mimeType: "image/jpeg",
              name: "pexels-pixabay-60597.jpg",
              size: 322014,
              uri: item.imageUrl,
            },
          ],
          canceled: false,
        };

    console.log("item", uploadFile);

    setActiveFile(uploadFile);
    handleChange(uploadFile.assets[0].uri);
  };

  const handleImageClose = () => {
    handleChange("");
  };

  return (
    <View className="w-full">
      {loading && <LoadingFullScreen />}

      {/* {!initialValue && (
        <UploadFile
          selectedImage={initialValue}
          type="manual"
          handleUploadFile={handleUploadFile}
        />
      )} */}

      <View className="w-full flex-row justify-between px-5 border-b border-gray-200 shadow-md">
        {logoCollection.map((item, index) => (
          <Pressable
            key={index.toString()}
            onPress={() => setActiveTab(item)}
            className="flex-1 items-center py-4"
          >
            <Text
            style={FONT_FAMILY.primary}
              className={`text-[14px] ${
                item?.id === activeTab?.id ? "text-[#89c157]" : "text-black"
              } font-normal`}
            >
              {item.name}
            </Text>
          </Pressable>
        ))}
      </View>

      <View className="mt-3">
        { (
          <FlatList
            key={activeTab?.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={activeTab?.values}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View
                className={`w-[120] h-[120] border-2 ${
                  value === item.imageUrl
                    ? "border-black"
                    : "border-transparent"
                } mr-2`}
              >
                <Pressable
                  onPress={() => handleLogoPress(item)}
                  className="h-full w-full border-4 border-transparent"
                >
                  {/* <Image
                    style={{ flex: 1, width: "100%", backgroundColor: "gray" }}
                    // className="flex-1 w-full bg-neutral-200"
                    source={item.imageUrl}
                    placeholder={blurhash}
                    contentFit="cover"
                    transition={100}
                  /> */}
                </Pressable>
              </View>
            )}
          />
        )}
      </View>

      <Text
      style={FONT_FAMILY.primary}
        className="text-[13px] text-neutral-500 font-light text-center mt-4 "
      >
        If you want to add your own file please contact us +971055050505
      </Text>

      {/* <Text className="text-[13px] text-black font-light text-center mt-2 ">
        We will set to the width we view as most suitable. However, in case you
        would prefer a specific width kindley mention it in uploaded graphic
        file
      </Text> */}

      {/* <ImageSelection title="Select Position" style={{marginTop: 24}} onChange={() => {}}/> */}
    </View>
  );
};

export default GraphicSelection;
