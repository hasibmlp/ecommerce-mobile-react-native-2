import {
    Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FONT_FAMILY } from "../theme";
import {
  ChevronRightIcon,
  QuestionMarkCircleIcon,
} from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import { useLazyQuery, useQuery, useReactiveVar } from "@apollo/client";
import { userVar } from "../makeVars/MakeVars";
import { GET_CUSTOMER_ORDERS } from "../graphql/queries";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import Skeleton from "../components/skeletons/Skeleton";
import ScreenHeaderV3 from "../components/actions/ScreenHeaderV3";

const OrdersScreen = () => {
  const [orders, setOrders] = useState();
  const navigation = useNavigation();

  const [getUserOrders, { loading }] = useLazyQuery(GET_CUSTOMER_ORDERS, {
    fetchPolicy: "no-cache",
  });

  async function run() {
    const token = await AsyncStorage.getItem("my-key");
    if (token) {
      const { data } = await getUserOrders({
        variables: {
          customerAccessToken: token,
        },
      });
      return data.customer.orders.edges;
    }
  }

  useEffect(() => {
    async function initialization() {
      setOrders(await run());
    }
    initialization();
  }, []);

  const orderedItems = orders?.filter(
    (item) => item?.fulfillmentStatus === null
  );

  return (
    <SafeAreaView className="bg-white">
      <ScreenHeaderV3
        label="My Orders"
        right={
          <TouchableOpacity className=" w-full h-full items-center justify-center">
            <QuestionMarkCircleIcon size={30} color="black" />
          </TouchableOpacity>
        }
      />
      <ScrollView className="bg-neutral-100">
        {loading && (
          <View className="">
            <Skeleton
              width={150}
              height={18}
              style={{ margin: 16, marginTop: 40 }}
            />

            <View className="bg-white mt-5">
              <View className="p-4 ">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Skeleton width={150} height={20} />
                    <Skeleton
                      width={150}
                      height={20}
                      style={{ marginTop: 16 }}
                    />
                  </View>
                  <Skeleton width={100} height={20} />
                </View>
              </View>
              <View className="mt-3 px-4 flex-row">
                <Skeleton width={80} height={140} style={{ marginRight: 8 }} />
                <Skeleton width={80} height={140} />
              </View>
              <View className="flex-row justify-between border-t border-neutral-300 py-2 px-4 mt-3">
                <Skeleton width={150} height={20} />
                <Skeleton width={30} height={20} />
              </View>
            </View>
            <View className="bg-white mt-3">
              <View className="p-4 ">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Skeleton width={150} height={20} />
                    <Skeleton
                      width={150}
                      height={20}
                      style={{ marginTop: 16 }}
                    />
                  </View>
                  <Skeleton width={100} height={20} />
                </View>
              </View>
              <View className="mt-3 px-4 flex-row">
                <Skeleton width={80} height={140} style={{ marginRight: 8 }} />
                <Skeleton width={80} height={140} />
              </View>
              <View className="flex-row justify-between border-t border-neutral-300 py-2 px-4 mt-3">
                <Skeleton width={150} height={20} />
                <Skeleton width={30} height={20} />
              </View>
            </View>
            <View className="bg-white mt-3">
              <View className="p-4 ">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Skeleton width={150} height={20} />
                    <Skeleton
                      width={150}
                      height={20}
                      style={{ marginTop: 16 }}
                    />
                  </View>
                  <Skeleton width={100} height={20} />
                </View>
              </View>
              <View className="mt-3 px-4 flex-row">
                <Skeleton width={80} height={140} style={{ marginRight: 8 }} />
                <Skeleton width={80} height={140} />
              </View>
              <View className="flex-row justify-between border-t border-neutral-300 py-2 px-4 mt-3">
                <Skeleton width={150} height={20} />
                <Skeleton width={30} height={20} />
              </View>
            </View>
          </View>
        )}

        <Text style={FONT_FAMILY.secondary} className="text-lg p-4 mt-5">
          Open orders({orders?.length})
        </Text>

        {orders &&
          orders.map((item) => {
            dateString = item.node.canceledAt
              ? item.node.canceledAt
              : item.node.processedAt;
            const date = new Date(dateString);
            const formattedDate = date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });
            console.log(item.node.canceledAt);
            return (
              <View key={item.node.id} className="bg-white mt-3">
                <View className="flex-row justify-between items-center p-4">
                  <View>
                    <Text
                      style={FONT_FAMILY.secondary}
                      className="text-xl text-black uppercase"
                    >
                      {item.node.canceledAt !== null
                        ? "closed on"
                        : "ordered on"}
                    </Text>
                    <Text
                      style={FONT_FAMILY.secondary}
                      className="text-lg text-black mt-2"
                    >
                      {item.canceledAt !== null ? formattedDate : "ordered on"}
                    </Text>
                  </View>
                  <StatusBar
                    type={
                      item.node.canceledAt !== null
                        ? "cancelled"
                        : item.node.fulfillmentStatus === "FULFILLED"
                        ? "fullfilled"
                        : "processing"
                    }
                  />
                </View>

                <View className="flex-row px-4 mt-3">
                  {item?.node?.lineItems?.edges?.map((i) => {
                    console.log(i?.node?.variant?.image?.url)
                    if(i?.node?.title === '') return null
                    return(
                    <View
                      key={i.node.variant?.id}
                      className="h-[130] w-[80] bg-neutral-300 mr-2"
                    >
                        <Image className="w-full h-full" source={{uri: i?.node?.variant?.image?.url}} />
                    </View>
                  )})}
                </View>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("ProfileOrdersDetailsScreen", {
                      orderId: item.node.id,
                    })
                  }
                  className="flex-row justify-between border-t border-neutral-300 py-2 px-4 mt-3"
                >
                  <Text style={FONT_FAMILY.secondary} className="text-base">
                    View Order Details
                  </Text>
                  <ChevronRightIcon size={20} color="black" />
                </TouchableOpacity>
              </View>
            );
          })}
      </ScrollView>
    </SafeAreaView>
  );
};

const StatusBar = ({ type = "processing" }) => {
  if (type === "processing")
    return (
      <View className="border border-black px-1 rounded-sm">
        <Text
          style={FONT_FAMILY.secondary}
          className="text-xs text-black uppercase"
        >
          processing
        </Text>
      </View>
    );
  if (type === "cancelled")
    return (
      <View className="border border-red-500 px-1 rounded-sm">
        <Text
          style={FONT_FAMILY.secondary}
          className="text-xs text-red-500 uppercase"
        >
          cancelled
        </Text>
      </View>
    );
  else
    return (
      <View className="border border-green-500 px-1 rounded-sm">
        <Text
          style={FONT_FAMILY.secondary}
          className="text-xs text-green-500 uppercase"
        >
          fullfilled
        </Text>
      </View>
    );
};

export default OrdersScreen;
