import { useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { FlatList, Image, ScrollView, Text, View } from "react-native";

import { GET_COLLECTION_BY_ID } from "../graphql/queries";
import LoadingScreen from "./LoadingScreen";
import { CollectionCard } from "./CollectionCard";
import { useEffect, useState } from "react";

const data = ["123", "123"];

export default function Collection({ route }) {
  const navigation = useNavigation();
  const { collectionId } = route.params;

  const [result, setResult] = useState([]);

  const {
    loading: collLoading,
    error: collError,
    data: collData,
    fetchMore,
    refetch,
  } = useQuery(GET_COLLECTION_BY_ID, {
    variables: {
      collectionId,
      first: 20,
      after: null,
    },
  });

  function handlePagingation() {
    console.log("END OF SCROLL");
    if (collData?.collection?.products?.pageInfo?.hasNextPage) {
      console.log("IT HAS NEXT PAGE");
      fetchMore({
        variables: {
          after: collData?.collection?.products?.pageInfo.endCursor,
        },
      }).then((res) => {
        console.log("RESULT AFTER REFETCH",res)
        setResult({ res });
      });
    }
  }

  console.log("COLLECTION PAGE");

  // console.log("COLLECTION DETAILS: ", collData?.collection);

  if (collLoading) {
    return <LoadingScreen />;
  }

  if (collError) {
    <Text>Error occured: {collError.message}</Text>;
  }

  return (
    <View className="p-1">
      {/* <View className="flex-1 flex-row flex-wrap p-1"> */}
      <FlatList
        data={collData?.collection?.products?.edges}
        keyExtractor={(item) => item.node.id}
        horizontal={false}
        numColumns={2}
        onEndReached={() => handlePagingation()}
        onEndReachedThreshold={0.7}
        renderItem={({ item }) => (
          <View className="w-[50%] p-1">
            <CollectionCard key={item.node.id} product={item.node} />
          </View>
        )}
      />
      {/* {collData?.collection?.products?.edges.map((product) => (
        // <View className=" w-[50%] h-[50%] p-2">
        //   <View className="w-full h-full bg-green-200"></View>
        // </View>
        <View className="w-[50%] p-1">
          <CollectionCard key={product.id} product={product.node} />
        </View>
      ))} */}
      {/* </View> */}
    </View>
  );
}
