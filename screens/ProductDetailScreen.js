import { useContext, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import * as Linking from 'expo-linking';
import {
  SafeAreaView,
  Text,
  View,
  ScrollView,
  Dimensions,
  Pressable,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  ClockIcon,
  TruckIcon,
  ChevronLeftIcon,
  ChevronDownIcon,
  QuestionMarkCircleIcon,
  InformationCircleIcon,
  ChevronRightIcon,
  PhoneIcon,
  ArrowRightIcon,
} from "react-native-heroicons/outline";

import ShowAndHide from "../components/ShowAndHide";
import CardSlider from "../components/CardSlider";
import HeartButton from "../components/HeartButton";
import Skeleton from "../components/Skeleton";
import { VariantSelectionContext, VariantSelectionProvider } from "../contexts/VariantSelectionContext";
import Button from "../components/buttons/Button";
import CollectionContentSkeleton from "../components/skeletons/CollectionContentSkeleton";
import ImageCarousel from "../components/Images/ImageCarousel";
import BottomModal from "../components/Modal/BottomModal";
import { useQuery } from "@apollo/client";
import { COLOR_SWATCH_IMAGES, GET_COLOR_SWATCH_IMAGES } from "../graphql/queries";
import VariantSelection from "../components/Modal/VariantSelection";
import { LinearGradient } from "expo-linear-gradient";
import WhatsappIcon from "../components/icons/WhatsappIcon";
import EmailIcon from "../components/icons/EmailIcon";

const screen_width = Dimensions.get("screen").width;
const ITEM_WIDTH = screen_width;
const ITEM_HEIGHT = ITEM_WIDTH / 0.7;

export default function ProductDetailScreen({ route }) {
  const navigation = useNavigation();
  const { productId } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <View className="flex-1">
      <SafeAreaView className="bg-white" />
        <VariantSelectionProvider productId={productId}>
          <ProductPageHeader/>
          <ScrollView bounces={false}>
              <ImageCarousel/>
              <ProductContent productId={productId}/>
            <RecommendedCollection />
          </ScrollView>
        </VariantSelectionProvider>
    </View>
  );
}

function ProductContent ({productId}) {
  const {data, options} = useContext(VariantSelectionContext)
  const [isModalVisisble, setModalVisible] = useState(false)
  

  return (
    <View className="mb-4">
      {!data && (<CollectionContentSkeleton/>)}

      <View className="items-center gap-[8px] py-[10px] bg-white px-2">
        <HeartButton />
        {data && (<ProductInfo data={data}/>)}
      </View>

      {options && options[0].values[0] !== "Default Title" && (
        <>
        <VariantSelectionButton onPress={() => setModalVisible(!isModalVisisble)}/>
        <BottomModal title={"Select Color/ Size"} visible={isModalVisisble} productId={productId} onClose={() => setModalVisible(false)}>
          <VariantSelection productId={productId} context={VariantSelectionContext} handleClose={() => setModalVisible(false)}/>
        </BottomModal>
        </>
      )}
      <ShippingDetails/>
      {data && (<AddToCartContainer />)}
      <ToggleContainer/>
      <ActionButton />
      <InstagramContainer/>
    </View>
  )
}

function VariantSelectionButton ({onPress}) {
  const {options, activeColor} = useContext(VariantSelectionContext)

  const {data, loading, error} = useQuery(GET_COLOR_SWATCH_IMAGES)
  const COLOR_SWATCH_IMAGES = data && JSON.parse(data?.collection?.metafield?.value)
  const activeColorSwatchImageUrl = COLOR_SWATCH_IMAGES?.find(item => item?.value === activeColor?.value.toLowerCase().replace(/\s+/g, '_'))?.url

  return (
    <Pressable
      onPress={onPress}
      className={`border-t border-gray-300 py-2 bg-white px-14 ${options.length === 1 && 'items-center'}`}
    >
      <View className="flex-row justify-between items-center">
        {options && options.map((option, index) => (
            <SelectionButton key={index.toString()} option={option} activeColorSwatchImageUrl={activeColorSwatchImageUrl} />
          ))}

        {options.length > 1 && (<View className="vertical-divider absolute left-[50%]  h-7 w-[1px] bg-gray-300"></View>)}
      </View>
    </Pressable>
  )
}

function SelectionButton ({option, activeColorSwatchImageUrl}) {
  const {activeColor, activeSize, activeType} = useContext(VariantSelectionContext)
  const label = option.name
  const selectedOption = option.name === 'Color' ? activeColor?.value : option.name === 'Size' ? activeSize : activeType


  return (
      <View className="items-center justify-center">
        <Text className="text-[11px] text-black font-medium uppercase text-center ">
          {label}
        </Text>
        <View className="flex-row items-center justify-center gap-x-1 mt-3">
          {option.name === 'Color' && activeColorSwatchImageUrl && (<ColorSwatch activeColor={activeColorSwatchImageUrl}/>)}
          <Text className="text-[15px] text-black font-light uppercase">
            {selectedOption ? selectedOption : 'Select'}
          </Text>
          <ChevronDownIcon size={14} color="black" />
        </View>
      </View>
  )
}

function ColorSwatch({activeColor}) {
  return (
    <View className="w-4 h-4 rounded-full overflow-hidden mr-2">
      {activeColor && (<Image src={activeColor} className="w-full h-full"/>)}
      {!activeColor && (<Image source={require('../assets/grid-placeholder-image.png')} className="w-full h-full"/>)}
    </View>
  )
}

function ShippingDetails () {
  return (
    <Pressable className=" border-y py-4 border-gray-300 bg-white">
        <View className="flex-row gap-x-2 justify-center items-center">
          <TruckIcon size={26} strokeWidth={1} color="black" />
          <Text className="text-[14px] font-normal text-black uppercase">
            shipping from uae
          </Text>
        </View>
        <View className="flex-row justify-center items-center gap-x-2 mt-3">
          <Text className="text-[14px] font-normal text-black">
            Next day delevery to
          </Text>
          <Text className="text-[14px] font-normal text-red-800 underline">
            Abudhabi
          </Text>
        </View>
    </Pressable>
  )
}

function ToggleContainer() {
  return (
    <View>
        <ShowAndHide title="Editor's advice" />
        <ShowAndHide title="Size & Fit" />
        <ShowAndHide title="Delivery % Free Returns" />
      </View>
  )
}

function ActionButton () {
  const [isModalVisible, setModalVisible] = useState(false)
  return (
    <View>
      <Pressable onPress={() => setModalVisible(true)} className="flex-row gap-x-1 items-center justify-between bg-white p-4 mt-4">
          <View className="flex-row gap-x-1 items-center">
            <QuestionMarkCircleIcon size={22} color="black" strokeWidth={1} />
            <View className="flex-row gap-x-1">
              <Text className="text-[13px] text-black font-medium ">
                Need help?
              </Text>
              <Text className="text-[13px] text-black font-light ">
                Call, Whatsapp , or email us
              </Text>
            </View>
          </View>
          <ChevronDownIcon size={24} color="black" strokeWidth={1} />
        </Pressable>
        <BottomModal title="Need Help?" visible={isModalVisible} onClose={() => setModalVisible(false)}>
          <View className="pb-14">
            <View className="pb-8">
              <View className=" w-[90%] mx-auto pb-3">
                <Text className="text-[14px] text-gray-800 font-light leading-5">If you need to speak with one of our customer case representative you can react us here, We are avilable between 10am - 10pm</Text>
              </View>
              <View className="flex-row justify-between items-center w-[90%] mx-auto">
                <InformationContainerIcon  label="Phone" icon={<PhoneIcon size={24} color="black" strokeWidth={1} />} onClick={() => Linking.openURL('tel:+97124913000')}/>
                <InformationContainerIcon label="Whatsapp" icon={<WhatsappIcon/>} onClick={() => Linking.openURL('whatsapp://send?phone=+971504713945')} />
                <InformationContainerIcon  label="Mail" icon={<EmailIcon/>} onClick={() => Linking.openURL("mailto:helloscrubsandclogs.com")}/>
              </View>
            </View>
            <InformationPanel label="Shipping Policy" style={{borderBottomWidth: 1, borderBottomColor: '#D3D3D3'}} rightIcon={<ChevronRightIcon size={24} color="black"/>}/>
            <InformationPanel label="Returns & Refunds" style={{borderBottomWidth: 1, borderBottomColor: '#D3D3D3'}} rightIcon={<ChevronRightIcon size={24} color="black"/>}/>
          </View>
        </BottomModal>
    </View>
  )
}

function InformationContainerIcon({label, icon, onClick}) {
  return (
    <Pressable onPress={onClick} className="w-28 h-20 border border-gray-500 rounded-[5px] items-center justify-center">
      {icon}
      <Text className="text-[12px] text-black font-normal uppercase mt-2">{label}</Text>
    </Pressable>
  )
}

function InformationPanel({children, label, rightIcon, style}) {
  return(
    <Pressable style={style} onPress={() => {}} className="flex-row gap-x-1 items-center justify-between bg-white p-4">
      {children && (<View>{children}</View>)}
      {label && !children && (<Text className="text-[16px] text-black font-normal">{label}</Text>)}
      <View className="right-auto">
        {rightIcon}
      </View>
    </Pressable>
  )
}

function ProductInfo({data}) {
  const amount = {
    price: data?.product?.priceRange.minVariantPrice.amount,
    comparePrice: data?.product?.compareAtPriceRange?.minVariantPrice.amount,
    currencyCode: data?.product?.priceRange.minVariantPrice.currencyCode
  }

  return (
    <View className="items-center">
      <TagContainer label={data.product.vendor}/>
      <Text className="text-[19px] font-medium text-black text-center mb-3">
        {data.product.title}
      </Text>
      <PriceContainer amount={amount}/>
      <InstallmentContainer/>
      <SmilePointsContainer/>
    </View>
  )
}

function TagContainer({label}) {
  return (
    <View className="py-[5px] w-full max-w-[100px] bg-[#ddd] rounded-[2px] items-center mb-3">
      <Text className="text-[11px] text-black uppercase">
        {label}
      </Text>
    </View>
  )
}

function PriceContainer({amount}) {
  const {price, comparePrice, currencyCode} = amount
  const discountPercentage = Math.round(((comparePrice - price) / comparePrice) * 100)
  const isDiscountApplyed = price < comparePrice
  return(
    <View className="items-center">
      <View className="flex-row items-center">
        <Text className="text-[18px] font-normal text-blue-800 mb-[2px]">
            {price} {currencyCode}
        </Text>
        {isDiscountApplyed && (
          <>
            <Text className="text-[14px] font-normal text-black mb-[2px] ml-2 line-through">
              {comparePrice} {currencyCode}
            </Text>
          < Text className="text-[14px] font-normal text-black mb-[2px] ml-1">
              {discountPercentage}% offer
            </Text>
          </>
        )}
      </View>
      <Text className="text-[14px] text-gray-500 font-normal mb-3">
        excluding VAT
      </Text>
    </View>
  )
}

function InstallmentContainer () {
  return (
    <View className=" items-center justify-center border rounded-[5px] border-gray-300 self-stretch mb-3">
        <View className="bg-gray-100 self-stretch py-1 items-center border-b border-gray-300">
          <Text className="text-[14px] font-normal text-black ">
            Want to pay in instalments?
          </Text>
        </View>
        <View className="flex-row items-center justify-center py-2">
          <Text className="text-[16px] font-bold text-black mr-1">
            tabby
          </Text>
          <InformationCircleIcon size={14} color="black" />
        </View>
      </View>
  )
}

function SmilePointsContainer () {
  return(
    <View className="flex-row items-center justify-center bg-white mb-1">
      <Text className="text-[14px] font-normal text-black">
        Earn 905 Smile Points.
      </Text>
      <Text className="text-[14px] text-red-800 font-normal underline ml-2">
        Learn Now
      </Text>
    </View>
  )
}

function AddToCartContainer() {
  const handleAddCartBtn = () => {}
  return (
    <View className="flex py-4 px-4 bg-white">
        <View className="flex-row gap-x-1 items-center justify-center mb-5">
          <ClockIcon size={20} color="red" />
          <Text className="text-[13px] text-red-500 font-normal">
            Low in stock: only 1 left
          </Text>
        </View>
        <Button label="Add to cart" size="md" onPress={handleAddCartBtn}/>
      </View>
  )
}

function RecommendedCollection() {
  return (
    <View>
      <CardSlider id={"gid://shopify/Collection/139270488173"} />
      <CardSlider id={"gid://shopify/Collection/139270488173"} />
    </View>
  )
}

function ProductPageHeader() {
  const {data} = useContext(VariantSelectionContext)
  const navigation = useNavigation()

  return (
    <View className="items-center justify-center bg-white h-[50px] relative">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="h-[40px] w-[40px] items-center justify-center absolute left-4 "
        >
          <ChevronLeftIcon size={20} color="black" />
        </TouchableOpacity>
        {data && (
          <Text className="text-[20px] font-medium text-black">
            {data.product.vendor}
          </Text>
        )}

        {!data && <Skeleton width={150} height={20} />}
      </View>
  )
}

function InstagramContainer() {
  return (
    <Pressable onPress={() => Linking.openURL("https://www.instagram.com/scrubs_n_clogs")} className="h-20 flex-row items-center justify-between px-4 bg-white mt-4 overflow-hidden">
      <LinearGradient
        style={{width: ITEM_WIDTH}}
        className=" h-full absolute right-0 z-[-1]"
        colors={['rgba(0, 0, 0, 0.13)', 'rgba(0, 0, 0, 0.24)']}
        start={{x: 0, y: 1}}
      />
      <View className="flex-row items-center ">
        <View className="w-8 h-8">
          <Image className="w-full h-full" source={require("../assets/instalogo.png")}/>
        </View>
        <Text className="text-[15px] w-[250] text-white font-bold ml-2">Follow us on instagram for excited offers</Text>
      </View>
      <ChevronRightIcon size={24} color="black" strokeWidth={1} />
      <View className="absolute right-0 z-[-2] w-[210px] flex-row flex-wrap rotate-[20deg]">
            <InstagramImageCard/>
            <InstagramImageCard/>
            <InstagramImageCard/>
            <InstagramImageCard/>
      </View>
    </Pressable>
  )
}

function InstagramImageCard() {
  return (
    <View className="w-24 h-28 bg-blue-300 rounded-[10px] m-1 overflow-hidden">
      <Image className="w-full h-full" source={require("../assets/baby.jpg")}/>
    </View>
  )
}