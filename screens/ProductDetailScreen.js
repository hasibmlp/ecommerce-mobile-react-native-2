import { useContext, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import * as Linking from 'expo-linking';
import {
  SafeAreaView,
  Text,
  View,
  Dimensions,
  Pressable,
  Image,
} from "react-native";
import {
  ChevronDownIcon,
  QuestionMarkCircleIcon,
  InformationCircleIcon,
  ChevronRightIcon,
  PhoneIcon,
  XMarkIcon,
} from "react-native-heroicons/outline";

import ShowAndHide from "../components/ShowAndHide";
import CardSlider from "../components/CardSlider";
import HeartButton from "../components/HeartButton";
import { VariantSelectionContext, VariantSelectionProvider } from "../contexts/VariantSelectionContext";
import Button from "../components/buttons/Button";
import CollectionContentSkeleton from "../components/skeletons/CollectionContentSkeleton";
import ImageCarousel from "../components/Images/ImageCarousel";
import BottomModal from "../components/Modal/BottomModal";
import VariantSelection from "../components/Modal/VariantSelection";
import { LinearGradient } from "expo-linear-gradient";
import WhatsappIcon from "../components/icons/WhatsappIcon";
import EmailIcon from "../components/icons/EmailIcon";
import MyModal from "../components/Modal/MyModal";
import Animated, { useAnimatedScrollHandler,useSharedValue } from "react-native-reanimated";
import SmileIcon from "../components/icons/SmileIcon";
import BackIconButton from "../components/buttons/BackIconButton";
import ScreenHeaderV2 from "../components/actions/ScreenHeaderV2";
import ShareButton from "../components/buttons/ShareButton";
import Panel from "../components/actions/Panel";
import ColorSwatchImage from "../components/buttons/ColorSwatchImage";

const screen_width = Dimensions.get("screen").width;
const ITEM_WIDTH = screen_width;

const themeColor = 'bg-[#4baaca]'
const textColor = 'text-[#4baaca]'

export default function ProductDetailScreen({ route }) {
  const navigation = useNavigation();
  const { productId, colorValue } = route.params;
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
        <VariantSelectionProvider productId={productId} colorValue={colorValue} >
          <View>
            <HeaderActions scrollRef={scrollRef}/>
            <Animated.ScrollView bounces={false} onScroll={scrollHandler}  scrollEventThrottle={1}>

                <ImageCarousel/>
                <ProductContent productId={productId} />
                <RecommendedCollection />

            </Animated.ScrollView>
          </View>
        </VariantSelectionProvider>
    </View>
  );
}

function HeaderActions({scrollRef}) {
  const {data} = useContext(VariantSelectionContext)
  const title = data?.product?.title?.length > 36 ? data?.product?.title.slice(0, 36) + '...' : data?.product?.title
  return (
    <ScreenHeaderV2
      left={(<BackIconButton/>)}
      right={(<ShareButton message={data?.product?.title} url={data?.product?.onlineStoreUrl} title={data?.product?.onlineStoreUrl}/>)}
      scrollRef={scrollRef}>
        <View className="w-[70%] h-full items-center justify-end p-2">
          <Text className="text-[20px] font-noraml text-black">{data?.product?.vendor}</Text>
          <Text className="text-[12px] font-noraml text-gray-500 mt-[2px] whitespace-nowrap">{title}</Text>
        </View>
      </ScreenHeaderV2>
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

function ProductContent ({productId}) {
  const {data} = useContext(VariantSelectionContext)

  return (
    <View className="">
      {!data && (<CollectionContentSkeleton/>)}
        <View className="w-full bg-white items-center py-3">
          <HeartButton />
          {data && (<ProductInfo data={data}/>)}
        </View>

      <PurchaseOption productId={productId}/>
      <OfferAnnouncement text={data?.product.metafield?.value}/>
      <ToggleContainer/>
      <SmilePointsContainer/>
      <InstallmentContainer/> 
      <SupportContainer/>
      <InstagramContainer/>
    </View>
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

function PurchaseOption({productId}) {
  const {options, selectedVariant, handleAddCartBtn, activeOptions} = useContext(VariantSelectionContext)
  const [isModalVisisble, setModalVisible] = useState(false)
  let label
  if(selectedVariant.id) {
    if(selectedVariant.availableForSale) label = 'add to cart'
    else label = 'notify me when available'
  }else {
    label = activeOptions.length === options?.length ? 'unavilable' : 'add to cart' 
  }

  const handlePress = () => {
    if(selectedVariant.id) {
      selectedVariant.currentlyNotInStock ? () => console.log("PROUCT NOT IN STOCK") : handleAddCartBtn(onClose=() => console.log("I'AM CLOSING......"))
    }else {
      setModalVisible(true)
    }
  }

  return (
    <View>
       {options && options[0].values[0] !== "Default Title" && (
          <>
            <VariantSelectionButton onPress={() => setModalVisible(!isModalVisisble)}/>
            <BottomModal title={"Select Color/ Size"} visible={isModalVisisble} productId={productId} onClose={() => setModalVisible(false)}>
              <VariantSelection productId={productId} variantId="gid://shopify/ProductVariant/47492252631319" context={VariantSelectionContext} handleClose={() => setModalVisible(false)}/>
            </BottomModal>
          </>
        )}
      <View className="bg-white">
        <Button 
          label={label}
          size="md"
          active={activeOptions.length === options?.length ? selectedVariant.id ? true : false : true}
          onPress={handlePress}  
          style={{marginVertical: 12, marginHorizontal: 20,}}/>
      </View>
    </View>
  )
}

function ToggleContainer() {
  return (
    <View className="mb-3">
        <ShowAndHide title="Product Details" />
        <ShowAndHide title="Size & Fit" />
        <ShowAndHide title="Shipping &  Return policy" />
        <ShowAndHide title="Washing instruction" />
      </View>
  )
}

function SupportContainer () {
  const [isModalVisible, setModalVisible] = useState(false)
  return (
    <View>
      <Panel style={{marginBottom: 12}} 
       onPress={() => setModalVisible(true)}
       alignment="start"
       leftIcon={(<QuestionMarkCircleIcon size={22} color="black" strokeWidth={1} />)}
       rightIcon={(<ChevronDownIcon size={20} color="black" strokeWidth={1} />)}
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

      <BottomModal title="Need Help?" visible={isModalVisible} onClose={() => setModalVisible(false)}>
        <View className="pb-14">
          <View className="pb-8">
            <View className=" w-[90%] mx-auto pb-3">
              <Text className="text-[14px] text-gray-800 font-light leading-5">If you need to speak with one of our customer case representative you can react us here, We are avilable between 10am - 10pm</Text>
            </View>
            <View className="flex-row justify-between items-center w-[90%] mx-auto">
              <InformationIconTile  label="Phone" icon={<PhoneIcon size={24} color="black" strokeWidth={1} />} onClick={() => Linking.openURL('tel:+97124913000')}/>
              <InformationIconTile label="Whatsapp" icon={<WhatsappIcon/>} onClick={() => Linking.openURL('whatsapp://send?phone=+971504713945')} />
              <InformationIconTile  label="Mail" icon={<EmailIcon/>} onClick={() => Linking.openURL("mailto:helloscrubsandclogs.com")}/>
            </View>
          </View>
          <Panel label="Shipping Policy" style={{borderBottomWidth: 1, borderBottomColor: '#D3D3D3'}} rightIcon={<ChevronRightIcon size={24} color="black"/>}/>
          <Panel label="Returns & Refunds" style={{borderBottomWidth: 1, borderBottomColor: '#D3D3D3'}} rightIcon={<ChevronRightIcon size={24} color="black"/>}/>
        </View>
      </BottomModal>
    </View>
  )
}

function OfferAnnouncement({text, style}) {
  if(!text) return null
  return (
    <View style={style} className="w-full bg-white p-3 bg-gray-100">
        <Text className="w-[80%] mx-auto text-[12px] text-gray-800 text-center font-normal leading-4">text={text}</Text>
    </View>
  )
}

function InstallmentContainer () {
  const [isModalVisible, setModalVisible] = useState(false)
  return (
    <View className="w-full bg-white py-3 mb-3">
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
    <View>
      <Panel onPress={() => setModalVisible(true)} style={{marginBottom: 12}} alignment="center">
        <View className="flex-row">
          <SmileIcon />
          <Text className="text-[14px] font-light text-gray-800 ml-2 mr-1">
            We reward with Smile.
          </Text>
          <Text className={`text-[14px] font-normal ${textColor} underline`}>Learn how.</Text>
        </View>
      </Panel>

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

function InstagramContainer() {
  return (
    <Pressable onPress={() => Linking.openURL("https://www.instagram.com/scrubs_n_clogs")} className="h-20 flex-row items-center justify-between px-4 bg-white mb-3 overflow-hidden">
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

function TagContainer({label}) {
  return (
    <View className="p-1 bg-gray-200 rounded-[2px] items-center">
      <Text className="text-[10px] text-black uppercase">
        {label}
      </Text>
    </View>
  )
}

function InformationIconTile({label, icon, onClick}) {
  return (
    <Pressable onPress={onClick} className="w-28 h-20 border border-gray-500 rounded-[5px] items-center justify-center">
      {icon}
      <Text className="text-[12px] text-black font-normal uppercase mt-2">{label}</Text>
    </Pressable>
  )
}

function VariantSelectionButton ({onPress}) {
  const {options} = useContext(VariantSelectionContext)

  return (
    <Pressable
      onPress={onPress}
      className={`w-full bg-white py-2 justify-center border-y border-gray-300`}
    >
      <View className="w-full flex-row justify-between items-center px-5">
        {options && options.map((option, index) => (
          <SelectionButton style={index !== options.length-1 ? {marginRight: 40} : {}} key={index.toString()} option={option} />
        ))}
      </View>
        {options.length === 2 && (<View className="vertical-divider absolute left-[50%]  h-7 w-[1px] bg-gray-300"></View>)}
    </Pressable>
  )
}

function SelectionButton ({option, style}) {
  const {activeOptions} = useContext(VariantSelectionContext)
  const label = option.name
  const optionValue = activeOptions.find(i => i.name === option.name)?.value

  return (
      <View style={style} className={` w-5 h-10 flex-1`}>
        <Text className="text-[12px] text-black font-medium uppercase text-center ">
          {label}
        </Text>
        <View className="flex-row items-center justify-center mt-3">
          {option.name === 'Color' && (<ColorSwatchImage value={activeOptions.find(i => i.name === 'Color')?.value}/>)}
          <Text className="text-[14px] text-black font-light uppercase mr-[2px]">
            {optionValue ? optionValue.length > 10 ? optionValue.slice(0, 10) + '...' : optionValue : 'Select'}
          </Text>
          <ChevronDownIcon size={11} color="black" />
        </View>
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