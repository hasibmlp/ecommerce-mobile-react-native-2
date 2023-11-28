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
  Share,
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
  XMarkIcon,
  ArrowUpOnSquareIcon,
  ArrowUpTrayIcon,
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
import MyModal from "../components/Modal/MyModal";
import HeaderActions from "../components/actions/HeaderActions";
import { ScreenHeader } from "../components/actions/ScreenHeader";
import Animated, { interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import SmileIcon from "../components/icons/SmileIcon";


const screen_width = Dimensions.get("screen").width;
const ITEM_WIDTH = screen_width;
const ITEM_HEIGHT = ITEM_WIDTH / 0.7;

const themeColor = 'bg-[#4baaca]'
const textColor = 'text-[#4baaca]'

export default function ProductDetailScreen({ route }) {
  const navigation = useNavigation();
  const { productId } = route.params;
  const scrollRef = useSharedValue(0)

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollRef.value = e.contentOffset.y;
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
        <VariantSelectionProvider productId={productId}>
          <View>
            <Header scrollRef={scrollRef}/>
            <Animated.ScrollView bounces={false} onScroll={scrollHandler}  scrollEventThrottle={1}>
                <ImageCarousel/>
                <ProductContent productId={productId}/>
              <RecommendedCollection />
            </Animated.ScrollView>
          </View>
        </VariantSelectionProvider>
    </View>
  );
}

function Header({scrollRef}) {
  const {data} = useContext(VariantSelectionContext)
  return (
    <ScreenHeaderV2
        left={(<HeaderLeft/>)}
        right={(
          <HeaderRight/>
        )}
        titleContainer={<TitleConainer/>}
        scrollRef={scrollRef}
      />
  )
}

function TitleConainer() {
  const {data} = useContext(VariantSelectionContext)
  return (
    <View className="w-[70%] h-full items-center justify-end p-2">
      <Text className="text-[20px] font-noraml text-black">{data?.product?.vendor}</Text>
      <Text className="text-[12px] font-noraml text-gray-500 mt-[2px] whitespace-nowrap">{data?.product?.title?.length > 36 ? data?.product?.title.slice(0, 36) + '...' : data?.product?.title}</Text>
    </View>
  )
}

function HeaderLeft() {
  const navigation = useNavigation()
  return (
    <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="p-1 items-center justify-center"
      >
        <ChevronLeftIcon size={28} color="black" strokeWidth={1}/>
      </TouchableOpacity>
  )
}

function HeaderRight() {
  const {data} = useContext(VariantSelectionContext)
  console.log(data?.product.onlineStoreUrl)
  const onShare = async () => {
    console.log("PRESSED")
    const result = await Share.share({
      title: data.product.onlineStoreUrl,
      message: data.product.title,
      url: data.product.onlineStoreUrl
    })
    console.log("ON SHARE", result)
  }
  return (
    <TouchableOpacity onPress={onShare} className="p-1 items-center justify-center absolute right-4 " >
      <ArrowUpTrayIcon size={24} color="black" strokeWidth={1}/>
    </TouchableOpacity>
  )
}

function ProductContent ({productId}) {
  const {data, options} = useContext(VariantSelectionContext)
  const [isModalVisisble, setModalVisible] = useState(false)
  

  return (
    <View className="">
      {!data && (<CollectionContentSkeleton/>)}
        <View className="w-full bg-white items-center py-3">
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

      {data && (<AddToCartContainer/>)}
      <ToggleContainer/>
       <OfferAnnouncement text={data?.product.metafield?.value}/>
       <InformationPanel style={{marginVertical: 12}} alignment="center">
          <View className="flex-row">
            <SmileIcon />
            <Text className="text-[14px] font-light text-gray-800 ml-2 mr-1">
              We reward with Smile.
            </Text>
            <Text className={`text-[14px] font-normal ${textColor} underline`}>Learn how.</Text>
          </View>
       </InformationPanel>
      <InstallmentContainer/> 
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
      className={`w-full bg-white py-2 justify-center border-y border-gray-300`}
    >
      <View className="w-full flex-row justify-between items-center px-5">
        {options && options.map((option, index) => (
            <SelectionButton style={index !== options.length-1 ? {marginRight: 40} : {}} key={index.toString()} option={option} activeColorSwatchImageUrl={activeColorSwatchImageUrl} />
          ))}

      </View>
        {options.length === 2 && (<View className="vertical-divider absolute left-[50%]  h-7 w-[1px] bg-gray-300"></View>)}
    </Pressable>
  )
}

function SelectionButton ({option, activeColorSwatchImageUrl, style}) {
  const {activeColor, activeSize, activeType} = useContext(VariantSelectionContext)
  const label = option.name
  const selectedOption = option.name === 'Color' ? activeColor?.value : option.name === 'Size' ? activeSize : activeType


  return (
      <View style={style} className={` w-5 h-10 flex-1`}>
        <Text className="text-[12px] text-black font-medium uppercase text-center ">
          {label}
        </Text>
        <View className="flex-row items-center justify-center mt-3">
          {option.name === 'Color' && activeColorSwatchImageUrl && (<ColorSwatch activeColor={activeColorSwatchImageUrl}/>)}
          <Text className="text-[14px] text-black font-light uppercase mr-[2px]">
            {selectedOption ? selectedOption.length > 10 ? selectedOption.slice(0, 10) + '...' : selectedOption : 'Select'}
          </Text>
          <ChevronDownIcon size={11} color="black" />
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
        <ShowAndHide title="Product Details" />
        <ShowAndHide title="Size & Fit" />
        <ShowAndHide title="Shipping &  Return policy" />
        <ShowAndHide title="Washing instruction" />
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
          <ChevronDownIcon size={20} color="black" strokeWidth={1} />
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

function InformationPanel({children, label, rightIcon, style, alignment="left"}) {
  let alignmentStyle
   if(alignment === 'center') alignmentStyle = 'justify-center'
   else if (alignment === 'end') alignmentStyle = 'justify-end'
   else alignmentStyle = 'justify-start'
  return(
    <Pressable style={style} onPress={() => {}} className={`flex-row gap-x-1 items-center ${alignmentStyle} bg-white p-4`}>
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
    <View className="w-full items-center">
      <TagContainer label={data.product.vendor}/>
      <View className="py-3 w-[90%]">
        <Text className="text-[20px] font-normal text-black text-center pb-2">
          {data.product.title}
        </Text>
      <PriceContainer amount={amount}/>
      </View>
    </View>
  )
}

function TagContainer({label}) {
  return (
    <View className="p-1 bg-gray-200 rounded-[2px] items-center">
      <Text className="text-[10px] text-black uppercase">
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
        <Text className={`text-[18px] font-normal ${textColor}`}>
            {price} {currencyCode}
        </Text>
        {isDiscountApplyed && (
          <>
            <Text className="text-[14px] font-normal text-black ml-2">
              {comparePrice} {currencyCode}
            </Text>
          < Text className="text-[14px] font-normal text-black ml-1">
              {discountPercentage}% offer
            </Text>
          </>
        )}
      </View>
      <Text className="text-[14px] text-gray-500 font-normal mt-1">
        excluding VAT
      </Text>
    </View>
  )
}

function OfferAnnouncement({text}) {
  if(!text) return null
  return (
    <View className="w-full bg-white p-3 bg-gray-100 mb-3">
          <Text className="w-[80%] mx-auto text-[12px] text-gray-800 text-center font-normal leading-4">text={text}</Text>
      </View>
  )
}

function InstallmentContainer () {
  const [isModalVisible, setModalVisible] = useState(false)
  return (
    <View className="w-full bg-white py-3">
      <View className="w-[60%] mx-auto items-center justify-center border rounded-[5px] border-gray-300 self-stretch">
          <View className="bg-gray-100 self-stretch py-1 items-center border-b border-gray-300">
            <Text className="text-[14px] font-normal text-black ">
              Want to pay in instalments?
            </Text>
          </View>
          <Pressable onPress={() => setModalVisible(true)} className="flex-row items-center justify-center py-2">
            <Text className="text-[16px] font-bold text-black mr-1">
              tabby
            </Text>
            <InformationCircleIcon size={14} color="black" />
          </Pressable>

          <MyModal visible={isModalVisible} slide="toUp">
          <View>
            <View className="h-10 flex-row items-center justify-end px-3">
              <Pressable className="p-1 " onPress={() => setModalVisible(false)}>
                <XMarkIcon size={24} color="black"/>
              </Pressable>
            </View>
          </View>
        </MyModal>
        </View>
    </View>
  )
}

function SmilePointsContainer () {
  const [isModalVisisble, setModalVisible] = useState(false)
  return(
    <View onPress={() => setModalVisible(true)} className="flex-row items-center justify-center bg-blue-300 border-t border-gray-300 pt-3 pb-3">

        <SmileIcon />
        <Text className="text-[14px] font-normal text-gray-700">
          We reward with Smile,
        </Text>
        

      <MyModal visible={isModalVisisble} slide="toUp">
        <View>
          <View className="h-10 flex-row items-center justify-end px-3">
            <Pressable className="p-1 " onPress={() => setModalVisible(false)}>
              <XMarkIcon size={24} color="black"/>
            </Pressable>
          </View>
        </View>
      </MyModal>
    </View>
  )
}

function AddToCartContainer() {
  const handleAddCartBtn = () => {}
  return (
    <View className="flex py-4 px-4 bg-white">
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

function ScreenHeaderV2({scrollRef, layout, title, left, right, titleContainer}) {

  const beginToAnimate =  200

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollRef.value,
      [0,100],
      [0, 1]
    );
    return {
      opacity: opacity,
    };
  });



  return (
    <View className="w-full h-10 absolute top-0 z-50">

    <View className="items-center justify-center h-12 relativ flex-row justify-between px-4">
        <View className="flex-row items-center">{left}</View>
          
        <View className="flex-row items-center">{right}</View>
    </View>

    <Animated.View style={headerAnimatedStyle} className="h-12 w-full items-center bg-white justify-center absolute top-0">
        <View className="h-full absolute left-4 flex-row items-center">{left}</View>
        {!titleContainer && (<Text className="text-[16px] font-normal text-black">
          {title?.length > 20 ? title.slice(0, 20) + '...' : title}
        </Text>)}
        {titleContainer && titleContainer}
        <View className="h-full absolute right-4 flex-row items-center">{right}</View>
    </Animated.View>

      {/* <ProductPageHeader/> */}
    </View>
  )
}

function ProductPageHeader() {
  const {data} = useContext(VariantSelectionContext)
  const navigation = useNavigation()

  const onShare = async () => {
    console.log("PRESSED")
    const result = await Share.share({
      title: data.product.onlineStoreUrl,
      url: data.product.onlineStoreUrl
    })
    console.log("ON SHARE", result)
  }

  return (
    <View className="items-center justify-center bg-white h-[50px] relative">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-1 items-center justify-center absolute left-4 "
        >
          <ChevronLeftIcon size={20} color="black" />
        </TouchableOpacity>
        {data && (
          <Text className="text-[14px] font-medium text-black">
            {data.product.title.length > 20 ? data.product.title.slice(0, 20) + '...' : data.product.title}
          </Text>
        )}

        {!data && <Skeleton width={150} height={15} style={{borderRadius: 100}}/>}

        <TouchableOpacity onPress={onShare} className="p-1 items-center justify-center absolute right-4 " >
          <ArrowUpOnSquareIcon size={20} color="black" />
        </TouchableOpacity>
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
    <View className={`w-24 h-28 bg-blue-300 rounded-[10px] m-1 overflow-hidden`}>
      <Image className="w-full h-full" source={require("../assets/baby.jpg")}/>
    </View>
  )
}