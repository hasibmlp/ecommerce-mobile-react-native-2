import { useLazyQuery, useReactiveVar } from "@apollo/client";
import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { userVar } from "../makeVars/MakeVars";
import {
  ArrowUpLeftIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "react-native-heroicons/outline";
import { useEffect, useRef, useState } from "react";

import Button from "../components/buttons/Button";
import { GET_PREDITIVE_RESULTS } from "../graphql/queries";
import PriceContainer from "../components/PriceContainer";
import { useNavigation } from "@react-navigation/native";
import ProductCard from "../components/cms/ProductCard";
import LoadingFullScreen from "../components/Sidebar/LoadingFullScreen";
import { debounce } from "../components/utils/UtilsFunctions";

export default function SearchScreen() {
  const navigation = useNavigation();
  const user = useReactiveVar(userVar);
  const searchInputRef = useRef();
  const [queryValue, setQueryValue] = useState("");

  const [getPrediction, { data, loading, error }] = useLazyQuery(
    GET_PREDITIVE_RESULTS,
    {
      variables: {
        query: queryValue,
      },
      fetchPolicy: "no-cache",
    }
  );

  const handleSearch = (value) => {
    setQueryValue(value);

    debounce(
      getPrediction({
        variables: {
          query: value,
        },
      }),
      300
    );
  };

  const handleSearchSubmit = () => {
    console.log("query value length: ", queryValue.length);

    navigation.navigate("SearchResultsScreen", { query: queryValue });
  };

  const handlePredictionQueryPress = (value) => {
    setQueryValue(value);
    getPrediction({
      variables: {
        query: value,
      },
    });
    // navigation.navigate("SearchResultsScreen", { query: value });
  };

  const handleSearchInputClear = () => {
    // searchInputRef.current.clear()
    setQueryValue("");
    getPrediction({
      variables: {
        query: "",
      },
    });
  };

  useEffect(() => {
    getPrediction();
  }, []);

  // rest of your component code
  console.log("PREDICTION RESULT: ", data);
  console.log("PREDICTION RESULT LOADING : ", loading);
  console.log("PREDICTION RESULT ERROR: ", error);

  console.log("USER LOGGED IN SEARCH SCREEN : ", user?.email);
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 bg-neutral-50 ">
        {loading && <LoadingFullScreen />}

        <View className="w-full h-14 flex-row items-center bg-white shadow-sm z-10">
          <View className="absolute h-full left-3">
            {/* <TouchableOpacity
              onPress={() => console.log("dslfjlsjdflks")}
              className="bg-blue-300 w-8 justify-center items-center"
            > */}
            <TouchableOpacity
              onpress={() => console.log("loglogloglogloglog")}
              className=" h-full items-center justify-center"
            >
              <MagnifyingGlassIcon size={24} color="black" />
            </TouchableOpacity>
            {/* </TouchableOpacity> */}
          </View>
          <View className="flex-1 px-11 justify-center">
            <TextInput
              onChangeText={handleSearch}
              ref={searchInputRef}
              className="flex-1"
              placeholder="Search"
              autoFocus={true}
              value={queryValue}
            />
            <View className="absolute right-0  h-full justify-center">
              {loading && (
                <View className="">
                  <ActivityIndicator size="small" />
                </View>
              )}
              {!loading && (
                <TouchableOpacity
                  className=" h-full justify-center px-4"
                  onPress={handleSearchInputClear}
                >
                  <XMarkIcon size={18} color="black" />
                </TouchableOpacity>
              )}
            </View>
          </View>
          {/* <TouchableOpacity
            onPress={() => searchInputRef.current.blur()}
            className="items-center justify-center  self-stretch"
          >
            <View className="border-l border-neutral-200 px-3 py-1">
              <Text className="text-sm text-black font-normal">Cancel</Text>
            </View>
          </TouchableOpacity> */}
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          onMomentumScrollBegin={() => searchInputRef.current.blur()}
        >
          <View className="bg-white mb-3">
            {data?.predictiveSearch.queries.map((item, index) => (
              <TouchableOpacity
                key={index.toString()}
                onPress={() => handlePredictionQueryPress(item.text)}
                className="w-full bg-white p-4 flex-row items-center justify-between border-b border-neutral-200"
              >
                <Text className="text-base text-balck ">{item.text}</Text>
                <ArrowUpLeftIcon size={16} color="black" />
              </TouchableOpacity>
            ))}
            {queryValue.length > 0 &&
              data?.predictiveSearch?.products.length > 0 &&
              data?.predictiveSearch?.queries.length > 0 && (
                <View className="flex-row justify-end p-4">
                  <Button
                    onPress={() => handleSearchSubmit(queryValue)}
                    label="View More"
                    type="action"
                  />
                  {/* <TouchableOpacity className="p-3">
                <Text className="text-base text-black font-medium uppea">
                  View More
                </Text>
              </TouchableOpacity> */}
                </View>
              )}
          </View>

          {data?.predictiveSearch?.products.length === 0 && (
            <View className="flex-row w-full p-3 items-center justify-center">
              <ExclamationCircleIcon size={24} color="black" />
              <Text className="text-sm text-black font-normal ml-1">
                NO RESULT FOUND
              </Text>
            </View>
          )}
          {data?.predictiveSearch?.products.length > 0 && (
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              <View className="flex-row px-3 items-start">
                {data?.predictiveSearch?.products.map((item, index) => (
                  <ProductCard
                    key={item.id}
                    product={item}
                    onpress={() =>
                      navigation.navigate("ProductDetailScreenInSearch", {
                        productId: item.id,
                      })
                    }
                  />
                ))}
              </View>
            </ScrollView>
          )}
          {queryValue.length > 0 &&
            data?.predictiveSearch?.products.length > 0 && (
              <View className="bg-white p-5 flex-row justify-end border-b border-neutral-200">
                <Button
                  onPress={handleSearchSubmit}
                  label="Show all results"
                  size="sm"
                  type="action"
                  flex={false}
                />
              </View>
            )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const SearchProductCart = ({ product }) => {
  const amount = {
    price: product?.priceRange.minVariantPrice.amount,
    comparePrice: product?.compareAtPriceRange?.minVariantPrice.amount,
    currencyCode: product?.priceRange.minVariantPrice.currencyCode,
  };
  return (
    <TouchableOpacity className="bg-white w-[200px] border-b border-neutral-200">
      <View className="w-full h-[250px] bg-neutral-200">
        <Image
          className="w-full h-full"
          src={product.featuredImage?.url}
          alt={product.featuredImage?.altText}
        />
      </View>
      <View className="justify-center px-3 flex-1">
        <Text className="text-base text-black font-normal mb-1">
          {product.vendor}
        </Text>
        <Text className="text-lg text-black font-normal leading-5 mb-4">
          {product.title}
        </Text>
        <PriceContainer amount={amount} position="left" size="lg" />
      </View>
    </TouchableOpacity>
  );
};
