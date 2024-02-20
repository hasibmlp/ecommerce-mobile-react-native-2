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
} from "react-native";
import {
  ChevronDownIcon,
  QuestionMarkCircleIcon,
  InformationCircleIcon,
  ChevronRightIcon,
  PhoneIcon,
  XMarkIcon,
  TrashIcon,
  PlusIcon,
} from "react-native-heroicons/outline";

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
import EmailIcon from "../components/icons/EmailIcon";
import WhatsappIcon from "../components/icons/WhatsappIcon";
import MyModal from "../components/Modal/MyModal";
import Animated, {
  Easing,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import ShareButton from "../components/buttons/ShareButton";
import Panel from "../components/actions/Panel";
import ColorSwatchImage from "../components/buttons/ColorSwatchImage";
import PriceContainer from "../components/PriceContainer";
import { userVar } from "../makeVars/MakeVars";
import { useQuery, useReactiveVar } from "@apollo/client";
import { ExclamationTriangleIcon } from "react-native-heroicons/solid";
import ScreenHeaderV3 from "../components/actions/ScreenHeaderV3";
import CustomSelection from "../components/Modal/CustomSelection";
import { GET_CUSTOMIZATIN_COLLECTION } from "../graphql/queries";
import Skeleton from "../components/skeletons/Skeleton";
import { FONT_FAMILY } from "../theme";
import ApplePayIcon from "../components/icons/ApplePayIcon";
import WebView from "react-native-webview";
import RichText from "../components/RichText";
import RecommedationCardSlider from "../components/RecommedationCardSlider";
import YouMayLikeCardSlider from "../components/YouMayLikeCardSlider";
import SupportModal from "../components/Modal/SupportModal";

const screen_width = Dimensions.get("screen").width;
const ITEM_WIDTH = screen_width;

export default function ProductDetailScreen({ route }) {
  const user = useReactiveVar(userVar);
  const scrollY = useSharedValue(0);

  const navigation = useNavigation();
  const { productId, colorValue } = route.params;

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

          <Body scrollHandler={scrollHandler} productId={productId} />

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
      animated={true}
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
        <Text style={FONT_FAMILY.secondary} className="text-2xl text-black">
          {data?.product?.vendor}
        </Text>
        <Text
          style={FONT_FAMILY.secondary}
          className="text-[13px] text-neutral-800 "
        >
          {title}
        </Text>
      </View>
    </ScreenHeaderV3>
  );
};

const Body = ({ scrollHandler, productId }) => {
  const { loading } = useContext(VariantSelectionContext);
  return (
    <Animated.ScrollView
      bounces={false}
      scrollEnabled={!loading}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
    >
      <ImageCarousel />
      <ProductContent productId={productId} />
      <RecommendedCollection productId={productId} />
    </Animated.ScrollView>
  );
};

const Footer = () => {
  const [visible, setVisible] = useState(false);
  const { isProductSuccessfullyAdded, setProductSuccessfullyAdded } =
    useContext(VariantSelectionContext);

  useEffect(() => {
    if (isProductSuccessfullyAdded === true) {
      setVisible(true);
    }

    setTimeout(() => {
      setVisible(false);
      setProductSuccessfullyAdded(false);
    }, 5000);
  }, [isProductSuccessfullyAdded]);

  return (
    <>
      <BottomPopup visible={visible} />
    </>
  );
};

const BottomPopup = ({ visible }) => {
  const navigation = useNavigation();
  const offset = useSharedValue(100);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));

  useEffect(() => {
    offset.value = withTiming(visible ? 0 : 300);
  }, [visible]);

  return (
    <Animated.View
      style={animatedStyle}
      className="absolute bottom-14 h-12 w-full bg-green-200 flex-row items-center justify-center"
    >
      <Text style={FONT_FAMILY.secondary} className="text-base text-black">
        Product has been added,{" "}
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("CartScreen")}
        className="self-stretch justify-center px-2"
      >
        <Text
          style={FONT_FAMILY.secondary}
          className="text-base text-black underline"
        >
          Click to View Cart
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

function RecommendedCollection({ productId }) {
  const { data } = useContext(VariantSelectionContext);
  const youMayLikeData = data?.product?.metafields.find(
    (item) => item?.key === "youmaylike_proudcts"
  )?.value;
  let youMayLikeProudcts;
  if (youMayLikeData) {
    youMayLikeProudcts = JSON.parse(youMayLikeData);
  }

  console.log(youMayLikeProudcts);
  return (
    <View className="pb-12">
      {youMayLikeProudcts && <YouMayLikeCardSlider ids={youMayLikeProudcts} />}
      <RecommedationCardSlider id={productId} />
    </View>
  );
}

function ProductContent({ productId }) {
  const { data } = useContext(VariantSelectionContext);

  return (
    <View className="">
      {!data && <CollectionContentSkeleton />}
      <View className="w-full bg-white items-center py-3">
        {data && <ProductInfo data={data} />}
      </View>

      <PurchaseOption productId={productId} data={data} />
      <OfferAnnouncement text={data?.product.metafield?.value} />
      <PersonalizeSetting />
      <InstallmentContainer />
      <ToggleContainer data={data} />
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
      <View className="py-1 w-[90%]">
        <Text
          style={FONT_FAMILY.secondary}
          className="text-base font-normal text-black text-center pb-2"
        >
          {data.product.title}
        </Text>
        <PriceContainer amount={amount} size="xl" withOfferTag />
      </View>
    </View>
  );
}

const PersonalizeSetting = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const { customProductId, setCustomProductId, data } = useContext(
    VariantSelectionContext
  );
  const {
    data: customizationCollectionData,
    loading: customizationCollectionLoading,
    error: customizationCollectionError,
  } = useQuery(GET_CUSTOMIZATIN_COLLECTION, {
    variables: {
      collectionId: "gid://shopify/Collection/469659812119",
      metaIdentifiers: [
        {
          key: "embroidery_graphics",
          namespace: "mobile",
        },
      ],
    },
    fetchPolicy: "no-cache",
  });

  const title =
    data?.product?.productType === "STETHOSCOPES"
      ? "Personalize"
      : "Add Embroidery";

  const fromPrice =
    data?.product?.productType === "STETHOSCOPES"
      ? customizationCollectionData?.collection?.products?.edges.find(
          (productEdge) =>
            productEdge.node.handle === "stethoscope-customization-mobile-app"
        ).node?.priceRange?.minVariantPrice?.amount
      : customizationCollectionData?.collection?.products?.edges.filter(
          (productEdge) =>
            productEdge.node.handle !== "stethoscope-customization-mobile-app"
        )[0]?.node?.priceRange?.minVariantPrice?.amount;

  return (
    <View className="bg-white px-5 pb-3">
      {!customProductId && (
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="flex-row items-center justify-between h-12 px-3 border border-neutral-300 rounded-md"
        >
          <Text style={FONT_FAMILY.secondary} className="text-sm text-black ">
            {title}
          </Text>
          <View className="flex-row items-center">
            {!customizationCollectionLoading && (
              <Text
                style={FONT_FAMILY.secondary}
                className="text-sm text-black mr-1"
              >
                from {fromPrice} AED{" "}
              </Text>
            )}
            {customizationCollectionLoading && (
              <Skeleton
                width={80}
                height={18}
                style={{ marginRight: 4 }}
                rounded
              />
            )}
            <ChevronRightIcon size={20} color="black" />
          </View>
        </TouchableOpacity>
      )}

      {customProductId && (
        <View className="border-t border-neutral-200">
          <View className="flex-row items-center justify-between h-10 ">
            <Text style={FONT_FAMILY.secondary}>{title}</Text>
            <View className="flex-row items-center self-stretch">
              <Text
                style={FONT_FAMILY.secondary}
                className="text-sm text-black px-2"
              >
                AED {customProductId.price}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                className=" self-stretch justify-center px-2"
              >
                <Text
                  style={FONT_FAMILY.secondary}
                  className="text-sm text-black"
                >
                  Edit
                </Text>
              </TouchableOpacity>
              <View className="h-6 w-[1px] bg-neutral-500 mx-2"></View>
              <TouchableOpacity
                onPress={() => {
                  setCustomProductId(null);
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
                      <Text
                        style={FONT_FAMILY.secondary}
                        className="text-xs text-balck font-normal"
                      >
                        {customProductId.selections[0]?.firstLine}
                      </Text>
                    )}
                    {customProductId.selections[0]?.secondLine && (
                      <Text
                        style={FONT_FAMILY.secondary}
                        className="text-xs text-balck font-normal"
                      >
                        {customProductId.selections[0]?.secondLine}
                      </Text>
                    )}
                  </View>
                )}
              </View>

              <View className="flex-1">
                <Text
                  style={FONT_FAMILY.secondary}
                  className="text-sm text-balck font-medium"
                >
                  Text
                </Text>

                {customProductId.selections[0]?.firstLine && (
                  <View className="flex-row">
                    <Text
                      style={FONT_FAMILY.secondary}
                      className="text-sm text-black "
                    >
                      First Line:{" "}
                    </Text>
                    <View className=" flex-1">
                      <Text
                        style={FONT_FAMILY.secondary}
                        className="text-sm text-black "
                      >
                        {customProductId.selections[0]?.firstLine}
                      </Text>
                    </View>
                  </View>
                )}

                {customProductId.selections[0]?.secondLine && (
                  <View className="flex-row">
                    <Text
                      style={FONT_FAMILY.secondary}
                      className="text-sm text-black "
                    >
                      Second Line:{" "}
                    </Text>
                    <View className=" flex-1">
                      <Text
                        style={FONT_FAMILY.secondary}
                        className="text-sm text-black "
                      >
                        {customProductId.selections[0]?.secondLine}
                      </Text>
                    </View>
                  </View>
                )}

                {customProductId.selections[0]?.color && (
                  <View className="flex-row">
                    <Text
                      style={FONT_FAMILY.secondary}
                      className="text-sm text-black "
                    >
                      Color:{" "}
                    </Text>
                    <View className=" flex-1">
                      <Text
                        style={FONT_FAMILY.secondary}
                        className="text-sm text-black "
                      >
                        {customProductId.selections[0]?.color}
                      </Text>
                    </View>
                  </View>
                )}

                {customProductId.selections[0]?.fontStyle && (
                  <View className="flex-row">
                    <Text
                      style={FONT_FAMILY.secondary}
                      className="text-sm text-black "
                    >
                      Font:{" "}
                    </Text>
                    <View className=" flex-1">
                      <Text
                        style={FONT_FAMILY.secondary}
                        className="text-sm text-black "
                      >
                        {customProductId.selections[0]?.fontStyle}
                      </Text>
                    </View>
                  </View>
                )}

                {customProductId.selections[0]?.position && (
                  <View className="flex-row">
                    <Text
                      style={FONT_FAMILY.secondary}
                      className="text-sm text-black "
                    >
                      Placement:{" "}
                    </Text>
                    <View className=" flex-1">
                      <Text
                        style={FONT_FAMILY.secondary}
                        className="text-sm text-black "
                      >
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
                <Text
                  style={FONT_FAMILY.secondary}
                  className="text-sm text-balck font-medium"
                >
                  Icon
                </Text>

                {customProductId.selections[0]?.position && (
                  <View className="flex-row">
                    <Text
                      style={FONT_FAMILY.secondary}
                      className="text-sm text-black "
                    >
                      Placement:{" "}
                    </Text>
                    <View className=" flex-1">
                      <Text
                        style={FONT_FAMILY.secondary}
                        className="text-sm text-black "
                      >
                        {customProductId.selections[0]?.position}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}

          {(customProductId.type === "laser-printing" ||
            customProductId.type === "laser-with-tube-printing") && (
            <View className="flex-row mb-3 items-center">
              <View className="flex-1">
                <Text className="text-sm text-balck font-medium">
                  {customProductId.type === "laser-with-tube-printing"
                    ? "Laser Engraving"
                    : customProductId.title}
                </Text>

                {customProductId.selections[0]?.laserFirstLine && (
                  <View className="flex-row">
                    <Text className="text-sm text-black ">First Line: </Text>
                    <View className=" flex-1">
                      <Text className="text-sm text-black ">
                        {customProductId.selections[0]?.laserFirstLine}
                      </Text>
                    </View>
                  </View>
                )}

                {customProductId.selections[0]?.laserSecondLine && (
                  <View className="flex-row">
                    <Text className="text-sm text-black ">Second Line: </Text>
                    <View className=" flex-1">
                      <Text className="text-sm text-black ">
                        {customProductId.selections[0]?.laserSecondLine}
                      </Text>
                    </View>
                  </View>
                )}

                {customProductId.selections[0]?.laserFontStyle && (
                  <View className="flex-row">
                    <Text className="text-sm text-black ">Font: </Text>
                    <View className=" flex-1">
                      <Text className="text-sm text-black ">
                        {customProductId.selections[0]?.laserFontStyle}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}

          {(customProductId.type === "tube-printing" ||
            customProductId.type === "laser-with-tube-printing") && (
            <View className="flex-row mb-3 items-center">
              <View className="flex-1">
                <Text className="text-sm text-balck font-medium">
                  {customProductId.type === "laser-with-tube-printing"
                    ? "Tube Printing"
                    : customProductId.title}
                </Text>

                {customProductId.selections[0]?.firstLine && (
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
        <View>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            className="absolute top-3 right-3 z-30 w-10 h-10 items-center justify-center"
          >
            <XMarkIcon size={28} color="black" />
          </TouchableOpacity>
          <CustomSelection
            context={
              data?.product?.productType === "STETHOSCOPES"
                ? "stethoscope"
                : "embroidery"
            }
            onClose={() => setModalVisible(false)}
            customizationCollectionData={customizationCollectionData}
            customizationCollectionLoading={customizationCollectionLoading}
            customProductId={customProductId}
            setCustomProductId={setCustomProductId}
          />
        </View>
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
    console.log("button pressed!!");
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

function ToggleContainer({ data }) {
  const r2 = {
    type: "root",
    children: [
      {
        type: "heading",
        children: [
          { type: "text", value: "t", bold: true },
          { type: "text", value: "heading 1" },
        ],
        level: 1,
      },
      {
        type: "heading",
        level: 2,
        children: [{ type: "text", value: "heading 2", bold: true }],
      },
      {
        type: "heading",
        level: 3,
        children: [{ type: "text", value: "heading 3", bold: true }],
      },
      {
        type: "heading",
        level: 4,
        children: [{ type: "text", value: "heading 4", bold: true }],
      },
      {
        type: "heading",
        level: 5,
        children: [{ type: "text", value: "heading 5", bold: true }],
      },
      {
        type: "heading",
        level: 6,
        children: [{ type: "text", value: "heading 6", bold: true }],
      },
      {
        type: "paragraph",
        children: [{ type: "text", value: "this is paragraph without bold" }],
      },
      {
        type: "paragraph",
        children: [
          { type: "text", value: "this is paragraph with bold", bold: true },
        ],
      },
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value: "this is paragraph without bold and italic",
            italic: true,
          },
        ],
      },
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value: "this is paragragh with bold and italic",
            bold: true,
            italic: true,
          },
        ],
      },
      {
        type: "paragraph",
        children: [
          { type: "text", value: "" },
          {
            url: "link.to",
            title: "link title",
            type: "link",
            children: [
              { type: "text", value: "this is link", bold: true, italic: true },
            ],
          },
          { type: "text", value: "" },
        ],
      },
      {
        listType: "unordered",
        type: "list",
        children: [
          {
            type: "list-item",
            children: [{ type: "text", value: "this is unordered list-1" }],
          },
          {
            type: "list-item",
            children: [{ type: "text", value: "this is unordered list -2" }],
          },
        ],
      },
      {
        listType: "ordered",
        type: "list",
        children: [
          {
            type: "list-item",
            children: [{ type: "text", value: "this orderderd list -1" }],
          },
          {
            type: "list-item",
            children: [{ type: "text", value: "this is orderdered list -2" }],
          },
        ],
      },
      { type: "paragraph", children: [{ type: "text", value: "" }] },
      {
        type: "heading",
        children: [{ type: "text", value: "the end" }],
        level: 1,
      },
    ],
  };

  const richTextJson = data?.product?.metafields.find(
    (item) => item?.key === "washing_instruction"
  )?.value;
  let parsedJson;
  if (richTextJson) parsedJson = JSON.parse(richTextJson);

  const shippingPolicy = data?.product?.metafields.find(
    (item) => item?.key === "return_and_shipping_policy"
  )?.value;
  let shippingPolicyParsed;
  if (shippingPolicy) shippingPolicyParsed = JSON.parse(shippingPolicy);

  const sizeAndFitUrl = data?.product?.metafields.find(
    (item) => item?.key === "size_and_fit_image_url"
  )?.value;

  console.log(sizeAndFitUrl);

  return (
    <View className="mb-3">
      {data?.product?.description && (
        <ToggleItem label="description">
          <Text style={FONT_FAMILY.secondary} className="text-sm text-black">
            {data?.product?.description}
          </Text>
        </ToggleItem>
      )}
      {sizeAndFitUrl && (
        <ToggleItem label="Size & Fit">
          <View className="w-[400] h-[400] bg-neutral-200 mx-auto">
            <Image className="w-full h-full" source={{ uri: sizeAndFitUrl }} />
          </View>
        </ToggleItem>
      )}
      {shippingPolicyParsed && (
        <ToggleItem label="Shipping &  Return policy">
          <RichText content={shippingPolicyParsed} />
        </ToggleItem>
      )}
      {parsedJson && (
        <ToggleItem label="Washing instruction">
          <RichText content={parsedJson} />
        </ToggleItem>
      )}
    </View>
  );
}

function ToggleItem({ label, children }) {
  const heightOffset = useSharedValue(0);
  const [viewHeight, setViewHieght] = useState(0);

  const animatedStyle = useAnimatedStyle(() => ({
    height: interpolate(heightOffset.value, [0, 1], [0, viewHeight]),
  }));

  const handlePress = () => {
    heightOffset.value = withTiming(heightOffset.value === 0 ? 1 : 0, {
      duration: 400,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
    });
  };

  return (
    <>
      <Panel
        onPress={handlePress}
        rightIcon={<PlusIcon size={20} color="black" />}
      >
        <View className={`flex-1 w-full justify-center px-4`}>
          <Text style={FONT_FAMILY.secondary} className="text-sm capitalize">
            {label}
          </Text>
        </View>
      </Panel>
      <Animated.View style={animatedStyle} className="overflow-hidden">
        <View
          onLayout={(e) => setViewHieght(e.nativeEvent.layout.height)}
          className="absolute w-full bottom-0 left-0 p-4 bg-white"
        >
          {children}
        </View>
      </Animated.View>
    </>
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
            <Text
              style={FONT_FAMILY.secondary}
              className="text-[13px] text-black font-medium "
            >
              Need help?
            </Text>
            <Text
              style={FONT_FAMILY.secondary}
              className="text-[13px] text-black font-light "
            >
              Call, Whatsapp , or email us
            </Text>
          </View>
        </View>
      </Panel>

       <SupportModal isModalVisible={isModalVisible} onClose={() => setModalVisible(false)}/>

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
          <Text
            style={FONT_FAMILY.secondary}
            className="text-[14px] font-normal text-black "
          >
            Available payment options
          </Text>
        </View>
        <View className="w-[60%] flex-row justify-between">
          <Pressable
            onPress={() => setModalVisible(true)}
            className="flex-row items-center justify-center"
          >
            <Text className="text-[16px] font-bold text-black mr-1">tabby</Text>
            <InformationCircleIcon size={14} color="black" />
          </Pressable>
          <Pressable
            onPress={() => setModalVisible(true)}
            className="flex-row items-center justify-center"
          >
            <ApplePayIcon size={36} />
          </Pressable>
        </View>
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
        <Text
          style={FONT_FAMILY.secondary}
          className="text-[15px] w-[250] text-white font-bold ml-2"
        >
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
    <View className="items-center">
      <Text
        style={FONT_FAMILY.primary}
        className="text-2xl text-black capitalize"
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
      <Text
        style={FONT_FAMILY.secondary}
        className="text-[12px] text-black font-normal uppercase mt-2"
      >
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
    <View style={style} className={` w-5 flex-1`}>
      <Text
        style={FONT_FAMILY.secondary}
        className="text-[12px] text-black font-normal uppercase text-center "
      >
        {label}
      </Text>
      <View className="flex-row items-center justify-center mt-2">
        {option.name === "Color" && (
          <ColorSwatchImage
            value={activeOptions.find((i) => i.name === "Color")?.value}
          />
        )}
        <Text
          style={FONT_FAMILY.secondary}
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
