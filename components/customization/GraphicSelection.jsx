import {
  FlatList,
  Pressable,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useState } from "react";
import { PlusCircleIcon, XMarkIcon } from "react-native-heroicons/outline";
import * as DocumentPicker from "expo-document-picker";

import LoadingFullScreen from "../Sidebar/LoadingFullScreen";

const blurhash = "LEHV6nWB2yk8pyo0adR*.7kCMdnj";

const GraphicSelection = ({ logoCollection, handleChange, value, activeFile, setActiveFile, loading }) => {
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
              uri: item.url
            },
          ],
          canceled: false,
        };

    console.log("item", uploadFile);

    setActiveFile(item);
    handleChange(uploadFile.assets[0].uri)

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
        <Pressable
          onPress={() => setActiveTab({ id: "05", title: "Your Uploads" })}
          className="flex-1 items-center py-4"
        >
          <Text
            className={`text-[14px] ${
              activeTab.id === "05" ? "text-[#89c157]" : "text-black"
            } font-normal`}
          >
            File upload
          </Text>
        </Pressable>
        {logoCollection.map((item, index) => (
          <Pressable
            key={index.toString()}
            onPress={() => setActiveTab(item)}
            className="flex-1 items-center py-4"
          >
            <Text
              className={`text-[14px] ${
                item.id === activeTab.id ? "text-[#89c157]" : "text-black"
              } font-normal`}
            >
              {item.title}
            </Text>
          </Pressable>
        ))}
      </View>

      <View className="mt-3">
        {activeTab.id === "05" && (
          <View className="flex-row">
            {selfUploadedFile.length > 0 &&
              selfUploadedFile.map((item, index) => (
                <View
                  key={index.toString()}
                  className="border-2 border-neutral-500 mr-3"
                >
                  <View className="border-2 border-transparent items-center justify-center">
                    <TouchableOpacity
                      onPress={() => handleLogoPress(item)}
                      key={index.toString()}
                      className="w-[120] h-[120] bg-gray-200 items-center justify-center"
                    >
                      <Image
                        style={{
                          flex: 1,
                          width: "100%",
                          backgroundColor: "gray",
                        }}
                        // className="flex-1 w-full bg-neutral-200"
                        source={item.assets[0].uri}
                        placeholder={blurhash}
                        contentFit="cover"
                        transition={100}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            <TouchableOpacity
              onPress={handleFileUpload}
              className="w-[120] h-[120] bg-gray-200 mr-2 items-center justify-center"
            >
              <View>
                <PlusCircleIcon size={50} color="gray" strokeWidth={1} />
              </View>
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          key={activeTab.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={activeTab.images}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleLogoPress(item)}
              className="w-[120] h-[120] bg-gray-200 mr-2"
            >
              <Image
                style={{ flex: 1, width: "100%", backgroundColor: "gray" }}
                // className="flex-1 w-full bg-neutral-200"
                source={item.url}
                placeholder={blurhash}
                contentFit="cover"
                transition={100}
              />
            </Pressable>
          )}
        />
      </View>

      {/* {initialValue && (
        <View className="w-full border border-dashed items-center py-10 mt-10 mb-6">
          <View className="flex-row">
            <View className="w-40 h-40 bg-gray-100">
              <Image className="w-full h-full" src={initialValue} />
            </View>
            <Pressable
              onPress={handleImageClose}
              className="absolute right-[-30]"
            >
              <XMarkIcon size={24} color="black" />
            </Pressable>
          </View>
        </View>
      )} */}

      <Text className="text-[13px] text-black font-light text-center mt-2 ">
        We will set to the width we view as most suitable. However, in case you
        would prefer a specific width kindley mention it in uploaded graphic
        file
      </Text>

      {/* <ImageSelection title="Select Position" style={{marginTop: 24}} onChange={() => {}}/> */}
    </View>
  );
};

export default GraphicSelection;
