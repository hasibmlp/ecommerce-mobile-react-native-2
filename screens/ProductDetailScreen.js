import { useContext, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  SafeAreaView,
  Text,
  View,
  ScrollView,
  Dimensions,
  Pressable,
  TouchableOpacity,
} from "react-native";
import {
  ClockIcon,
  TruckIcon,
  ChevronLeftIcon,
  ChevronDownIcon,
  QuestionMarkCircleIcon,
  InformationCircleIcon,
} from "react-native-heroicons/outline";

import ShowAndHide from "../components/ShowAndHide";
import CardSlider from "../components/CardSlider";
import HeartButton from "../components/HeartButton";
import Skeleton from "../components/Skeleton";
import { VariantSelectionContext, VariantSelectionProvider } from "../contexts/VariantSelectionContext";
import Button from "../components/buttons/Button";
import CollectionContentSkeleton from "../components/skeletons/CollectionContentSkeleton";
import ImageCarousel from "../components/Images/ImageCarousel";
import VariantSelectionModal from "../components/Modal/VariantSelectionModal";

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
      <VariantSelectionButton onPress={() => setModalVisible(true)}/>
      <VariantSelectionModal context={VariantSelectionContext} visible={isModalVisisble} productId={productId} onClose={() => setModalVisible(false)} />
      </>
      
      )}
      
      <ShippingDetails/>
      {data && (<AddToCartContainer />)}
      <ToggleContainer/>
      <ActionButton />
    </View>
  )
}

function VariantSelectionButton ({onPress}) {
  const {options, activeColor, activeSize, activeType} = useContext(VariantSelectionContext)
  return (
    <Pressable
      onPress={onPress}
      className={`border-t border-gray-300 py-2 bg-white px-14 ${options.length === 1 && 'items-center'}`}
    >
      <View className="flex-row justify-between items-center">
        {options && options.map((option, index) => (
            <SelectionButton key={index.toString()} label={option.name} selectedoption={option.name === 'Color' ? activeColor?.value : option.name === 'Size' ? activeSize : activeType} />
          ))}

        {options.length > 1 && (<View className="vertical-divider absolute left-[50%]  h-7 w-[1px] bg-gray-300"></View>)}
      </View>
    </Pressable>
  )
}

function SelectionButton ({label, selectedoption}) {
  return (
    <View className="items-center justify-center">
        <Text className="text-[11px] text-black font-medium uppercase text-center ">
          {label}
        </Text>
        <View className="flex-row items-center justify-center gap-x-1 mt-3">
          <Text className="text-[15px] text-black font-light uppercase">
            {selectedoption ? selectedoption : 'Select'}
          </Text>
          <ChevronDownIcon size={14} color="black" />
        </View>
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
  return (
    <Pressable className="flex-row gap-x-1 items-center justify-between bg-white p-4 mt-4">
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
  )
}

function ProductInfo({data}) {
  return (
    <View className="items-center">
      <TagContainer label={data.product.vendor}/>
      <Text className="text-[19px] font-medium text-black text-center mb-3">
        {data.product.title}
      </Text>
      <PriceContainer amount={data.product.priceRange.minVariantPrice.amount}/>
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
  return(
    <View>
      <Text className="text-[20px] font-normal text-red-800 mb-[2px]">
          {amount} AED
      </Text>
      <Text className="text-[14px] text-gray-500 font-normal mb-3">
        Including VAT
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