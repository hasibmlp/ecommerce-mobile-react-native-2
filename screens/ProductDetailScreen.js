import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import * as Linking from "expo-linking";
import {
  SafeAreaView,
  Text,
  View,
  Dimensions,
  Pressable,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import {
  ChevronDownIcon,
  QuestionMarkCircleIcon,
  InformationCircleIcon,
  ChevronRightIcon,
  PhoneIcon,
  XMarkIcon,
  CheckCircleIcon,
  PlusCircleIcon,
  TrashIcon,
} from "react-native-heroicons/outline";
import * as Yup from "yup";
import { useFonts } from "expo-font";

import ShowAndHide from "../components/ShowAndHide";
import CardSlider from "../components/CardSlider";
import HeartButton from "../components/buttons/HeartButton";
import {
  VariantSelectionContext,
  VariantSelectionProvider,
} from "../contexts/VariantSelectionContext";
import Button from "../components/buttons/Button";
import CollectionContentSkeleton from "../components/skeletons/CollectionContentSkeleton";
import ImageCarousel from "../components/Images/ImageCarousel";
import BottomModal from "../components/Modal/BottomModal";
import VariantSelection from "../components/Modal/VariantSelection";
import { LinearGradient } from "expo-linear-gradient";
import WhatsappIcon from "../components/icons/WhatsappIcon";
import EmailIcon from "../components/icons/EmailIcon";
import MyModal from "../components/Modal/MyModal";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import SmileIcon from "../components/icons/SmileIcon";
import BackIconButton from "../components/buttons/BackIconButton";
import ScreenHeaderV2 from "../components/actions/ScreenHeaderV2";
import ShareButton from "../components/buttons/ShareButton";
import Panel from "../components/actions/Panel";
import ColorSwatchImage from "../components/buttons/ColorSwatchImage";
import PriceContainer from "../components/PriceContainer";
import { Formik } from "formik";
import ImageSelection from "../components/customization/ImageSelection";
import Selection from "../components/customization/Selection";
import ColorSelection from "../components/customization/ColorSelection";
import { userVar } from "../makeVars/MakeVars";
import { useReactiveVar } from "@apollo/client";
import EmbroiderySelection from "../components/Modal/EmbroiderySelection";
import { ExclamationTriangleIcon } from "react-native-heroicons/solid";
import ScreenHeaderV3 from "../components/actions/ScreenHeaderV3";

const screen_width = Dimensions.get("screen").width;
const ITEM_WIDTH = screen_width;

const themeColor = "bg-[#4baaca]";
const textColor = "text-[#4baaca]";

export default function ProductDetailScreen({ route }) {
  const user = useReactiveVar(userVar);
  const scrollY = useSharedValue(0);

  console.log("USER LOGGED IN PRODUCT SCREEN : ", user?.email);
  const navigation = useNavigation();
  const { productId, colorValue } = route.params;
  const scrollRef = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <View className="flex-1">
      <SafeAreaView className="bg-white" />
      <VariantSelectionProvider productId={productId} colorValue={colorValue}>
        <View>
          <Header scrollY={scrollY} />

          <Animated.ScrollView
            bounces={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
          >
            <ImageCarousel />
            <ProductContent productId={productId} />
            <RecommendedCollection />
          </Animated.ScrollView>

          <Footer />
        </View>
        <SafeAreaView className="bg-white" />
      </VariantSelectionProvider>
    </View>
  );
}

const Header = ({ scrollY }) => {
  const { data } = useContext(VariantSelectionContext);
  const title =
    data?.product?.title?.length > 36
      ? data?.product?.title.slice(0, 36) + "..."
      : data?.product?.title;

  return (
    <ScreenHeaderV3
      scrollY={scrollY}
      right={
        <ShareButton
          message={data?.product?.title}
          url={data?.product?.onlineStoreUrl}
          title={data?.product?.onlineStoreUrl}
        />
      }
    >
      <View className="flex-1 w-full items-center justify-center">
        <Text
          style={{ fontFamily: "Nexa-Regular" }}
          className="text-lg text-black"
        >
          {data?.product?.vendor}
        </Text>
        <Text
          style={{ fontFamily: "Nexa-Regular" }}
          className="text-sm text-neutral-800 "
        >
          {title}
        </Text>
      </View>
    </ScreenHeaderV3>
  );
};

const Footer = () => {
  const [ visible, setVisible ] = useState(false)
  const { isProductSuccessfullyAdded, setProductSuccessfullyAdded,  } = useContext(VariantSelectionContext)

  useEffect(() => {
    if(isProductSuccessfullyAdded === true) {
      setVisible(true)
    }
    
    setTimeout(() => {
      setVisible(false)
      setProductSuccessfullyAdded(false)
    }, 4000);
  },[isProductSuccessfullyAdded])
  
  return (
    <>
      <BottomPopup visible={visible} />
    </>
  );
};

const BottomPopup = ({ visible }) => {
  const offset = useSharedValue(50);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));

  useEffect(() => {
    offset.value = withTiming(visible ? 0 : 50);
  }, [visible]);

  return (
    <Animated.View
      style={animatedStyle}
      className="absolute bottom-14 h-12 w-full bg-green-200 flex-row items-center justify-center"
    >
      <Text
        style={{ fontFamily: "Nexa-Regular" }}
        className="text-base text-black"
      >
        Product has been added,{" "}
      </Text>
      <TouchableOpacity className="self-stretch justify-center px-2">
        <Text
          style={{ fontFamily: "Nexa-Regular" }}
          className="text-base text-black underline"
        >
          Click to View Cart
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

function HeaderActions({ scrollRef }) {
  const { data } = useContext(VariantSelectionContext);
  const title =
    data?.product?.title?.length > 36
      ? data?.product?.title.slice(0, 36) + "..."
      : data?.product?.title;
  return (
    <ScreenHeaderV2
      left={<BackIconButton />}
      right={
        <ShareButton
          message={data?.product?.title}
          url={data?.product?.onlineStoreUrl}
          title={data?.product?.onlineStoreUrl}
        />
      }
      scrollRef={scrollRef}
    >
      <View className="w-[70%] h-full items-center justify-end p-2">
        <Text className="text-[20px] font-noraml text-black">
          {data?.product?.vendor}
        </Text>
        <Text className="text-[12px] font-noraml text-gray-500 mt-[2px] whitespace-nowrap">
          {title}
        </Text>
      </View>
    </ScreenHeaderV2>
  );
}

function RecommendedCollection() {
  return (
    <View>
      <CardSlider id={"gid://shopify/Collection/139270488173"} />
      <CardSlider id={"gid://shopify/Collection/139270488173"} />
    </View>
  );
}

function ProductContent({ productId }) {
  const { data } = useContext(VariantSelectionContext);

  return (
    <View className="">
      {!data && <CollectionContentSkeleton />}
      <View className="w-full bg-white items-center py-3">
        <HeartButton />
        {data && <ProductInfo data={data} />}
      </View>

      <PurchaseOption productId={productId} data={data} />
      <PersonalizeSetting />
      <OfferAnnouncement text={data?.product.metafield?.value} />
      <ToggleContainer />
      <SmilePointsContainer />
      <InstallmentContainer />
      <SupportContainer />
      <InstagramContainer />
    </View>
  );
}

function ProductInfo({ data }) {
  const amount = {
    price: data?.product?.priceRange.minVariantPrice.amount,
    comparePrice: data?.product?.compareAtPriceRange?.minVariantPrice.amount,
    currencyCode: data?.product?.priceRange.minVariantPrice.currencyCode,
  };

  return (
    <View className="w-full items-center">
      <TagContainer label={data.product.vendor} />
      <View className="py-3 w-[90%]">
        <Text
          style={{ fontFamily: "Nexa-Regular" }}
          className="text-[20px] font-normal text-black text-center pb-2"
        >
          {data.product.title}
        </Text>
        <PriceContainer amount={amount} />
      </View>
    </View>
  );
}

const PersonalizeSetting = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [totalCustom, setTotalCustom] = useState({
    type: "",
    active: false,
    selections: [],
  });
  const { customProductId, setCustomProductId } = useContext(
    VariantSelectionContext
  );

  console.log("CUSTOM SELECTIONS:");

  return (
    <View className="bg-white px-5 pb-3">
      {!customProductId && (
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="flex-row items-center justify-between h-12 px-3 border border-neutral-300 rounded-md"
        >
          <Text className="text-sm text-black ">Add Embroidery</Text>
          <View className="flex-row items-center">
            <Text className="text-sm text-black mr-1">from AED 58</Text>
            <ChevronRightIcon size={20} color="black" />
          </View>
        </TouchableOpacity>
      )}

      {customProductId && (
        <View className="border-t border-neutral-200">
          <View className="flex-row items-center justify-between h-10 ">
            <Text>Add Embroidery</Text>
            <View className="flex-row items-center self-stretch">
              <Text className="text-sm text-black px-2">
                AED {customProductId.price}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                className=" self-stretch justify-center px-2"
              >
                <Text className="text-sm text-black">Edit</Text>
              </TouchableOpacity>
              <View className="h-6 w-[1px] bg-neutral-500 mx-2"></View>
              <TouchableOpacity
                onPress={() => {
                  setCustomProductId(null);
                  setTotalCustom(null);
                }}
                className=" self-stretch justify-center px-2"
              >
                <TrashIcon size={20} color="black" />
              </TouchableOpacity>
            </View>
          </View>

          {(customProductId.type === "text-only" ||
            customProductId.type === "text-with-graphics") && (
            <View className="flex-row mb-3 items-center">
              <View className="bg-gray-300 w-24 h-24 mr-5 items-center justify-center">
                {(customProductId.selections[0]?.firstLine ||
                  customProductId.selections[0]?.secondLine) && (
                  <View>
                    {customProductId.selections[0]?.firstLine && (
                      <Text className="text-xs text-balck font-normal">
                        {customProductId.selections[0]?.firstLine}
                      </Text>
                    )}
                    {customProductId.selections[0]?.secondLine && (
                      <Text className="text-xs text-balck font-normal">
                        {customProductId.selections[0]?.secondLine}
                      </Text>
                    )}
                  </View>
                )}
              </View>

              <View className="flex-1">
                <Text className="text-sm text-balck font-medium">Text</Text>

                {customProductId.selections[0]?.secondLine && (
                  <View className="flex-row">
                    <Text className="text-sm text-black ">First Line: </Text>
                    <View className=" flex-1">
                      <Text className="text-sm text-black ">
                        {customProductId.selections[0]?.firstLine}
                      </Text>
                    </View>
                  </View>
                )}

                {customProductId.selections[0]?.secondLine && (
                  <View className="flex-row">
                    <Text className="text-sm text-black ">Second Line: </Text>
                    <View className=" flex-1">
                      <Text className="text-sm text-black ">
                        {customProductId.selections[0]?.secondLine}
                      </Text>
                    </View>
                  </View>
                )}

                {customProductId.selections[0]?.color && (
                  <View className="flex-row">
                    <Text className="text-sm text-black ">Color: </Text>
                    <View className=" flex-1">
                      <Text className="text-sm text-black ">
                        {customProductId.selections[0]?.color}
                      </Text>
                    </View>
                  </View>
                )}

                {customProductId.selections[0]?.fontStyle && (
                  <View className="flex-row">
                    <Text className="text-sm text-black ">Font: </Text>
                    <View className=" flex-1">
                      <Text className="text-sm text-black ">
                        {customProductId.selections[0]?.fontStyle}
                      </Text>
                    </View>
                  </View>
                )}

                {customProductId.selections[0]?.position && (
                  <View className="flex-row">
                    <Text className="text-sm text-black ">Placement: </Text>
                    <View className=" flex-1">
                      <Text className="text-sm text-black ">
                        {customProductId.selections[0]?.position}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}

          {(customProductId.type === "graphics-only" ||
            customProductId.type === "text-with-graphics") && (
            <View className="flex-row mb-3">
              <View className="bg-gray-300 w-24 h-24 mr-5 items-center justify-center">
                {customProductId.selections[0]?.imageUrl && (
                  <Image
                    className="w-full h-full"
                    src={customProductId.selections[0]?.imageUrl}
                  />
                )}
              </View>

              <View className="flex-1">
                <Text className="text-sm text-balck font-medium">Icon</Text>

                {customProductId.selections[0]?.position && (
                  <View className="flex-row">
                    <Text className="text-sm text-black ">Placement: </Text>
                    <View className=" flex-1">
                      <Text className="text-sm text-black ">
                        {customProductId.selections[0]?.position}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}

          <View className="flex-row bg-neutral-100 p-3 rounded-md">
            <View className="items-center justify-center mr-3">
              <View className="h-4 w-2 bg-black absolute"></View>
              <ExclamationTriangleIcon size={28} color="#eed202" />
            </View>
            <View className="flex-1 mb-2">
              <Text className="text-xs text-neutral-500 font-light">
                Embroidery items are FINAL SALE. Order with embroidered items
                will take up to 2 additional weeks to ship
              </Text>
            </View>
          </View>
        </View>
      )}

      <MyModal visible={isModalVisible} slide="toUp">
        <EmbroiderySelection
          onClose={() => setModalVisible(false)}
          totalCustom={totalCustom}
          setTotalCustom={setTotalCustom}
          customProductId={customProductId}
          setCustomProductId={setCustomProductId}
        />
      </MyModal>
    </View>
  );
};

function PurchaseOption({ productId, data }) {
  const { options, selectedVariant, handleAddCartBtn, activeOptions, loading } =
    useContext(VariantSelectionContext);
  const [isModalVisisble, setModalVisible] = useState(false);
  const [isFullModalVisible, setFullModalVisible] = useState(false);
  let label;
  if (selectedVariant.id) {
    if (selectedVariant.availableForSale) label = "add to cart";
    else label = "notify me when available";
  } else {
    label =
      activeOptions.length === options?.length ? "unavilable" : "add to cart";
  }

  const handlePress = () => {
    if (selectedVariant.id) {
      selectedVariant.currentlyNotInStock
        ? () => console.log("PROUCT NOT IN STOCK")
        : handleAddCartBtn((onClose = () => console.log("I'AM CLOSING......")));
    } else {
      setModalVisible(true);
    }
  };

  return (
    <View>
      {data?.product?.vendor === "LITTMANN" && (
        <View className="bg-white px-2">
          <Text className="text-[12px] font-normal text-black uppercase mx-4 pb-3">
            Customization:
          </Text>
          <View className="flex flex-row justify-between ">
            <TouchableOpacity
              onPress={() => setFullModalVisible(true)}
              className="flex-row items-center justify-center self-start mx-3"
            >
              {false && <CheckCircleIcon size={18} color="#000" />}
              {true && <PlusCircleIcon size={18} color="#89c157" />}
              <Text
                className={`text-[15px] ${
                  false ? "text-black" : "text-[#89c157]"
                } font-normal uppercase ml-1`}
              >
                {false ? "Customization Added" : "Tube printing"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFullModalVisible(true)}
              className="flex-row items-center justify-center self-start mx-3"
            >
              {false && <CheckCircleIcon size={18} color="#000" />}
              {true && <PlusCircleIcon size={18} color="#89c157" />}
              <Text
                className={`text-[15px] ${
                  false ? "text-black" : "text-[#89c157]"
                } font-normal uppercase ml-1`}
              >
                {false ? "Customization Added" : "laser customization"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* <MyModal visible={isFullModalVisible} slide="toUp">
            <CustomizationSelection2
              onClose={() => setFullModalVisible(false)}
            />
          </MyModal> */}
        </View>
      )}

      {options && options[0].values[0] !== "Default Title" && (
        <>
          <VariantSelectionButton
            onPress={() => setModalVisible(!isModalVisisble)}
          />
          <BottomModal
            title={"Select Color/ Size"}
            visible={isModalVisisble}
            productId={productId}
            onClose={() => setModalVisible(false)}
          >
            <VariantSelection
              productId={productId}
              variantId="gid://shopify/ProductVariant/47492252631319"
              context={VariantSelectionContext}
              handleClose={() => setModalVisible(false)}
            />
          </BottomModal>
        </>
      )}

      <View className="bg-white">
        <Button
          label={label}
          size="md"
          active={
            activeOptions.length === options?.length
              ? selectedVariant.id
                ? true
                : false
              : true
          }
          loading={loading}
          onPress={handlePress}
          style={{ marginVertical: 12, marginHorizontal: 20 }}
        />
      </View>
    </View>
  );
}

function ToggleContainer() {
  return (
    <View className="mb-3">
      <ShowAndHide title="Product Details" />
      <ShowAndHide title="Size & Fit" />
      <ShowAndHide title="Shipping &  Return policy" />
      <ShowAndHide title="Washing instruction" />
    </View>
  );
}

function SupportContainer() {
  const [isModalVisible, setModalVisible] = useState(false);
  return (
    <View>
      <Panel
        style={{ marginBottom: 12 }}
        onPress={() => setModalVisible(true)}
        alignment="start"
        leftIcon={
          <QuestionMarkCircleIcon size={22} color="black" strokeWidth={1} />
        }
        rightIcon={<ChevronDownIcon size={20} color="black" strokeWidth={1} />}
      >
        <View className="flex-row gap-x-1 items-center">
          <View className="flex-row gap-x-1">
            <Text className="text-[13px] text-black font-medium ">
              Need help?
            </Text>
            <Text className="text-[13px] text-black font-light ">
              Call, Whatsapp , or email us
            </Text>
          </View>
        </View>
      </Panel>

      <BottomModal
        title="Need Help?"
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
      >
        <View className="pb-14">
          <View className="pb-8">
            <View className=" w-[90%] mx-auto pb-3">
              <Text className="text-[14px] text-gray-800 font-light leading-5">
                If you need to speak with one of our customer case
                representative you can react us here, We are avilable between
                10am - 10pm
              </Text>
            </View>
            <View className="flex-row justify-between items-center w-[90%] mx-auto">
              <InformationIconTile
                label="Phone"
                icon={<PhoneIcon size={24} color="black" strokeWidth={1} />}
                onClick={() => Linking.openURL("tel:+97124913000")}
              />
              {/* <InformationIconTile label="Whatsapp" icon={<WhatsappIcon/>} onClick={() => Linking.openURL('whatsapp://send?phone=+971504713945')} /> */}
              <InformationIconTile
                label="Mail"
                icon={<EmailIcon />}
                onClick={() =>
                  Linking.openURL("mailto:helloscrubsandclogs.com")
                }
              />
            </View>
          </View>
          <Panel
            label="Shipping Policy"
            style={{ borderBottomWidth: 1, borderBottomColor: "#D3D3D3" }}
            rightIcon={<ChevronRightIcon size={24} color="black" />}
          />
          <Panel
            label="Returns & Refunds"
            style={{ borderBottomWidth: 1, borderBottomColor: "#D3D3D3" }}
            rightIcon={<ChevronRightIcon size={24} color="black" />}
          />
        </View>
      </BottomModal>
    </View>
  );
}

function OfferAnnouncement({ text, style }) {
  if (!text) return null;
  return (
    <View style={style} className="w-full bg-white p-3 bg-gray-100">
      <Text className="w-[80%] mx-auto text-[12px] text-gray-800 text-center font-normal leading-4">
        text={text}
      </Text>
    </View>
  );
}

function InstallmentContainer() {
  const [isModalVisible, setModalVisible] = useState(false);
  return (
    <View className="w-full bg-white py-3 mb-3">
      <View className="w-[60%] mx-auto items-center justify-center border rounded-[5px] border-gray-300 self-stretch">
        <View className="bg-gray-100 self-stretch py-1 items-center border-b border-gray-300">
          <Text className="text-[14px] font-normal text-black ">
            Want to pay in instalments?
          </Text>
        </View>
        <Pressable
          onPress={() => setModalVisible(true)}
          className="flex-row items-center justify-center py-2"
        >
          <Text className="text-[16px] font-bold text-black mr-1">tabby</Text>
          <InformationCircleIcon size={14} color="black" />
        </Pressable>

        <MyModal visible={isModalVisible} slide="toUp">
          <View>
            <View className="h-10 flex-row items-center justify-end px-3">
              <Pressable
                className="p-1 "
                onPress={() => setModalVisible(false)}
              >
                <XMarkIcon size={24} color="black" />
              </Pressable>
            </View>
          </View>
        </MyModal>
      </View>
    </View>
  );
}

function SmilePointsContainer() {
  const [isModalVisisble, setModalVisible] = useState(false);
  return (
    <View>
      <Panel
        onPress={() => setModalVisible(true)}
        style={{ marginBottom: 12 }}
        alignment="center"
      >
        <View className="flex-row">
          <SmileIcon />
          <Text className="text-[14px] font-light text-gray-800 ml-2 mr-1">
            We reward with Smile.
          </Text>
          <Text className={`text-[14px] font-normal ${textColor} underline`}>
            Learn how.
          </Text>
        </View>
      </Panel>

      <MyModal visible={isModalVisisble} slide="toUp">
        <View>
          <View className="h-10 flex-row items-center justify-end px-3">
            <Pressable className="p-1 " onPress={() => setModalVisible(false)}>
              <XMarkIcon size={24} color="black" />
            </Pressable>
          </View>
        </View>
      </MyModal>
    </View>
  );
}

function InstagramContainer() {
  return (
    <Pressable
      onPress={() =>
        Linking.openURL("https://www.instagram.com/scrubs_n_clogs")
      }
      className="h-20 flex-row items-center justify-between px-4 bg-white mb-3 overflow-hidden"
    >
      <LinearGradient
        style={{ width: ITEM_WIDTH }}
        className=" h-full absolute right-0 z-[-1]"
        colors={["rgba(0, 0, 0, 0.13)", "rgba(0, 0, 0, 0.24)"]}
        start={{ x: 0, y: 1 }}
      />
      <View className="flex-row items-center ">
        <View className="w-8 h-8">
          <Image
            className="w-full h-full"
            source={require("../assets/instalogo.png")}
          />
        </View>
        <Text className="text-[15px] w-[250] text-white font-bold ml-2">
          Follow us on instagram for excited offers
        </Text>
      </View>
      <ChevronRightIcon size={24} color="black" strokeWidth={1} />
      <View className="absolute right-0 z-[-2] w-[210px] flex-row flex-wrap rotate-[20deg]">
        <InstagramImageCard />
        <InstagramImageCard />
        <InstagramImageCard />
        <InstagramImageCard />
      </View>
    </Pressable>
  );
}

function InstagramImageCard() {
  return (
    <View
      className={`w-24 h-28 bg-blue-300 rounded-[10px] m-1 overflow-hidden`}
    >
      <Image className="w-full h-full" source={require("../assets/baby.jpg")} />
    </View>
  );
}

function TagContainer({ label }) {
  return (
    <View className="p-1 bg-gray-200 rounded-[2px] items-center">
      <Text
        style={{ fontFamily: "Nexa-Regular" }}
        className="text-[10px] text-black uppercase"
      >
        {label}
      </Text>
    </View>
  );
}

function InformationIconTile({ label, icon, onClick }) {
  return (
    <Pressable
      onPress={onClick}
      className="w-28 h-20 border border-gray-500 rounded-[5px] items-center justify-center"
    >
      {icon}
      <Text className="text-[12px] text-black font-normal uppercase mt-2">
        {label}
      </Text>
    </Pressable>
  );
}

function VariantSelectionButton({ onPress }) {
  const { options } = useContext(VariantSelectionContext);

  return (
    <Pressable
      onPress={onPress}
      className={`w-full bg-white py-2 justify-center border-y border-gray-300`}
    >
      <View className="w-full flex-row justify-between items-center px-5">
        {options &&
          options.map((option, index) => (
            <SelectionButton
              style={index !== options.length - 1 ? { marginRight: 40 } : {}}
              key={index.toString()}
              option={option}
            />
          ))}
      </View>
      {options.length === 2 && (
        <View className="vertical-divider absolute left-[50%]  h-7 w-[1px] bg-gray-300"></View>
      )}
    </Pressable>
  );
}

function SelectionButton({ option, style }) {
  const { activeOptions } = useContext(VariantSelectionContext);
  const label = option.name;
  const optionValue = activeOptions.find((i) => i.name === option.name)?.value;

  return (
    <View style={style} className={` w-5 h-10 flex-1`}>
      <Text
        style={{ fontFamily: "Nexa-Regular" }}
        className="text-[12px] text-black font-medium uppercase text-center "
      >
        {label}
      </Text>
      <View className="flex-row items-center justify-center mt-3">
        {option.name === "Color" && (
          <ColorSwatchImage
            value={activeOptions.find((i) => i.name === "Color")?.value}
          />
        )}
        <Text
          style={{ fontFamily: "Nexa-Regular" }}
          className="text-[14px] text-black font-light uppercase mr-[2px] ml-2"
        >
          {optionValue
            ? optionValue.length > 10
              ? optionValue.slice(0, 10) + "..."
              : optionValue
            : "Select"}
        </Text>
        <ChevronDownIcon size={11} color="black" />
      </View>
    </View>
  );
}

const validationSchemaTextOnly = Yup.object({
  position: Yup.string().required(),
  language: Yup.string().required(),
  fontStyle: Yup.string().required(),
  color: Yup.string().required(),
  firstLine: Yup.string().required().max(16, "maximum character allowed 16"),
  secondLine: Yup.string().max(16, "maximum character allowed 16"),
});

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

const CustomizationSelection2 = ({ onClose }) => {
  const [totalCustom, setTotalCustom] = useState({
    type: "",
    active: false,
    selections: [],
  });

  const [activeSelectionsForTextDisplay, setActiveSelectionsForTextDisplay] =
    useState({ postion: "", selections: [] });
  const [price, setPrice] = useState(0);
  const [fontsLoaded] = useFonts({
    "Robo-Mono": require("../assets/fonts/RobotoMono-SemiBold.ttf"),
    Kalnia: require("../assets/fonts/Kalnia-SemiBold.ttf"),
    Ubuntu: require("../assets/fonts/Ubuntu-Bold.ttf"),
  });
  const activeColorCode = activeSelectionsForTextDisplay.selections.find(
    (i) => i.type === "color-selection"
  )?.colorCode;
  const activeFont = activeSelectionsForTextDisplay.selections.find(
    (i) => i.type === "font-selection"
  )?.fontFamily;

  const handleTextStyle = (item) => {
    setActiveSelectionsForTextDisplay((prevState) => {
      if (item.type === "position") {
        const prevSelections = prevState.selections;
        return { postion: item.postion, selections: prevSelections };
      } else {
        const prevSelection = [...prevState.selections];
        const itemIndex = prevSelection.findIndex((i) => i.type === item.type);
        if (itemIndex > -1) {
          prevSelection.splice(itemIndex, 1);
        }
        prevSelection.push(item);
        return { selections: prevSelection };
      }
    });
  };

  useEffect(() => {
    let newPrice = 0;
    if (totalCustom.type === "text-only") newPrice = 50;
    else if (totalCustom.type === "graphics-only") newPrice = 100;
    else newPrice = 150;

    setPrice(newPrice);
  }, [totalCustom]);

  useEffect(() => {}, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <View className="flex-1">
      <View className="h-10 flex-row items-center justify-end px-3">
        <Pressable className="p-1" onPress={onClose}>
          <XMarkIcon size={24} color="black" />
        </Pressable>
      </View>

      <ScrollView className="pt-8 px-4">
        {/* <HeaderTitle title="Customization"/> */}
        <View className="text-form pt-3">
          <Formik
            initialValues={{
              position:
                totalCustom.selections.length > 0
                  ? totalCustom.selections[0].position
                  : "",
              language:
                totalCustom.selections.length > 0
                  ? totalCustom.selections[0].language
                  : "",
              fontStyle:
                totalCustom.selections.length > 0
                  ? totalCustom.selections[0].fontStyle
                  : "",
              color:
                totalCustom.selections.length > 0
                  ? totalCustom.selections[0].color
                  : "",
              firstLine:
                totalCustom.selections.length > 0
                  ? totalCustom.selections[0].firstLine
                  : "",
              secondLine:
                totalCustom.selections.length > 0
                  ? totalCustom.selections[0].secondLine
                  : "",
            }}
            validationSchema={validationSchemaTextOnly}
            onSubmit={(values) => {
              if (values) {
                setTotalCustom((prevState) => {
                  return {
                    type: "text-only",
                    active: true,
                    selections: [{ ...values }],
                  };
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
                <View className="mb-6">
                  {/* <FormErrorBlock errors={errors} touched={touched} scrollY={textOnlyRef} /> */}
                  <ImageSelection
                    title="Position: Curved Tube (Doctor Side)"
                    images={[
                      {
                        url: "https://www.shopscrubsandclogs.com/cdn/shop/files/MAZ-12142.jpg?v=1687173547",
                      },
                      {
                        url: "https://www.shopscrubsandclogs.com/cdn/shop/files/MAZ-12142.jpg?v=1687173547",
                      },
                    ]}
                    style={{ marginBottom: 12 }}
                    defaultValue={values.position}
                    handleChange={handleChange("position")}
                  />
                  <Selection
                    name="language-selection"
                    field="language"
                    onChange={(item) => handleTextStyle(item)}
                    label={"Language"}
                    style={{ marginBottom: 12 }}
                    options={[
                      { name: "en", value: "English" },
                      { name: "ar", value: "العربي" },
                    ]}
                    handleChange={handleChange("language")}
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
                      {
                        name: "op1",
                        value: "Roboto Mono",
                        fontFamily: "Robo-Mono",
                      },
                      { name: "op2", value: "Kalnia", fontFamily: "Kalnia" },
                      { name: "op3", value: "Ubuntu", fontFamily: "Ubuntu" },
                    ]}
                    handleChange={handleChange("fontStyle")}
                    errors={errors}
                    touched={touched}
                    value={values.fontStyle}
                    fontsLoaded={fontsLoaded}
                  />
                </View>

                <ColorSelection
                  onChange={(item) => handleTextStyle(item)}
                  handleChange={handleChange("color")}
                  handleBlur={handleBlur("color")}
                  errors={errors}
                  touched={touched}
                  value={values.color}
                  colorValues={colorValues}
                />

                <Text className="text-[14px] text-black font-normal mb-1">
                  Enter Text here
                </Text>
                <TextInput
                  style={{ color: activeColorCode, fontFamily: activeFont }}
                  maxLength={16}
                  className={`h-12 text-[18px] items-cetner bg-gray-100 px-2 rounded-[5px] mb-10`}
                  onChangeText={handleChange("firstLine")}
                  handleBlur={handleBlur("firstLine")}
                  value={values.firstLine}
                />

                <View className="self-start mb-10">
                  <Button
                    label="Trems and condition"
                    type="action"
                    size="sm"
                    textColors={["#000000"]}
                  />
                </View>

                <View className="footer w-full justify-center pb-20">
                  <View className="flex-row justify-between pb-4 mb-2 ">
                    <Text className="text-[16px] text-black font-normal">
                      Total Customization Price
                    </Text>
                    <Text className="text-[17px] text-[#89c157] font-medium">
                      {price}
                    </Text>
                  </View>
                  <Button label="Applay" onPress={handleSubmit} />
                </View>
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </View>
  );
};
