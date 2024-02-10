import {
    Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../components/buttons/Button";
import { FONT_FAMILY } from "../theme";
import PriceContainer from "../components/PriceContainer";
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ORDER_DETAILS } from "../graphql/queries";
import ScreenHeaderV3 from "../components/actions/ScreenHeaderV3";
import { QuestionMarkCircleIcon } from "react-native-heroicons/outline";
import Skeleton from "../components/skeletons/Skeleton";

const ProfileOrdersDetailsScreen = ({ route }) => {
  const { orderId } = route.params;

  const { data, loading, error } = useQuery(GET_ORDER_DETAILS, {
    variables: {
      orderId,
    },
    fetchPolicy: "no-cache",
  });

  dateString = data?.node?.canceledAt
    ? data?.node?.canceledAt
    : data?.node?.processedAt;
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  console.log(data?.node?.successfulFulfillments[0]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScreenHeaderV3
        label="Order Details"
        right={
          <TouchableOpacity className=" w-full h-full items-center justify-center">
            <QuestionMarkCircleIcon size={30} color="black" />
          </TouchableOpacity>
        }
      />
      <ScrollView>
        {loading && (
          <View
            className="
          "
          >
            <View className="bg-white flex-row item-center justify-between mt-3 p-4">
              <Skeleton width={150} height={20} />
            </View>
            <View className="bg-white mt-3">
              <View className="flex-row justify-between items-center p-4 border-b border-neutral-300">
                <Skeleton width={150} height={24} />
              </View>

              <View>
                <View className="p-4">
                  <Skeleton width={150} height={20} />
                  <Skeleton width={150} height={20} style={{ marginTop: 8 }} />
                </View>
              </View>
            </View>

            <View className="p-4 mt-5">
              <Skeleton width={150} height={20} />
            </View>

            <View className="flex-row items-center p-4 bg-white">
              <Skeleton width={100} height={150} />
              <View className="p-3">
                <Skeleton width={100} height={18} />
                <Skeleton width={250} height={18} style={{ marginTop: 8 }} />
                <Skeleton width={180} height={18} style={{ marginTop: 8 }} />
                <View className="flex-row items-center ">
                  <Skeleton width={80} height={18} style={{ marginTop: 8 }} />
                  <Skeleton
                    width={80}
                    height={18}
                    style={{ marginTop: 8, marginLeft: 16 }}
                  />
                </View>
                <Skeleton width={180} height={18} style={{ marginTop: 8 }} />
              </View>
            </View>
            <View className="flex-row items-center p-4 bg-white mt">
              <Skeleton width={100} height={150} />
              <View className="p-3">
                <Skeleton width={100} height={18} />
                <Skeleton width={250} height={18} style={{ marginTop: 8 }} />
                <Skeleton width={180} height={18} style={{ marginTop: 8 }} />
                <View className="flex-row items-center ">
                  <Skeleton width={80} height={18} style={{ marginTop: 8 }} />
                  <Skeleton
                    width={80}
                    height={18}
                    style={{ marginTop: 8, marginLeft: 16 }}
                  />
                </View>
                <Skeleton width={180} height={18} style={{ marginTop: 8 }} />
              </View>
            </View>
            <View className="flex-row items-center p-4 bg-white">
              <Skeleton width={100} height={150} />
              <View className="p-3">
                <Skeleton width={100} height={18} />
                <Skeleton width={250} height={18} style={{ marginTop: 8 }} />
                <Skeleton width={180} height={18} style={{ marginTop: 8 }} />
                <View className="flex-row items-center ">
                  <Skeleton width={80} height={18} style={{ marginTop: 8 }} />
                  <Skeleton
                    width={80}
                    height={18}
                    style={{ marginTop: 8, marginLeft: 16 }}
                  />
                </View>
                <Skeleton width={180} height={18} style={{ marginTop: 8 }} />
              </View>
            </View>
          </View>
        )}

        <View className="bg-neutral-100 flex-1">
          <View className="bg-white flex-row item-center justify-between mt-3 p-4">
            <Text>Order ID: {data?.node?.orderNumber}</Text>
            <Button type="action" label="Copy order id" />
          </View>

          <View className="bg-white mt-3">
            <View className="flex-row justify-between items-center p-4 border-b border-neutral-300">
              <View>
                <Text
                  style={FONT_FAMILY.secondary}
                  className="text-base text-black uppercase"
                >
                  Shipment Details
                </Text>
              </View>
              <StatusBar
                type={
                  data?.node?.canceledAt !== null
                    ? "cancelled"
                    : data?.node?.fulfillmentStatus === "FULFILLED"
                    ? "fullfilled"
                    : "processing"
                }
              />
            </View>

            <View className="p-4">
              <Text
                style={FONT_FAMILY.secondary}
                className="text-xl text-black uppercase"
              >
                {data?.node?.canceledAt !== null ? "canceled on" : "ordered on"}
              </Text>
              <Text
                style={FONT_FAMILY.secondary}
                className="text-xl text-black mt-2"
              >
                {formattedDate}
              </Text>
            </View>

            {data?.node?.canceledAt === null &&
              data?.node?.fulfillmentStatus === "FULFILLED" && (
                <TouchableOpacity
                  onPress={() => {}}
                  className="flex-row justify-between border-t border-neutral-300 py-2 px-4 "
                >
                  <Text style={FONT_FAMILY.secondary} className="text-base">
                    Courier : {data?.node?.successfulFulfillments[0].trackingCompany}
                  </Text>
                  <Button label="track" type="action" onPress={() => {}} />
                </TouchableOpacity>
              )}
          </View>

          <View className=" p-4">
            <Text style={FONT_FAMILY.secondary} className="text-lg text-black">
              Order Summary
            </Text>
          </View>

          {data?.node &&
            data.node.lineItems.edges.map((item) => {
              if (item.node.title === "Cash on Delivery fee") return null;
              return (
                <View
                  key={item.node.id}
                  className="flex-row items-center p-3 bg-white"
                >
                  <View className="w-[100] h-[150] bg-neutral-300">
                    <Image className="w-full h-full" source={{uri: item.node.variant?.image?.url}}/>
                  </View>
                  <View className="p-3">
                    <Text
                      style={FONT_FAMILY.secondary}
                      className="text-lg text-black"
                    >
                      {item.node.variant?.product?.vendor}
                    </Text>
                    <Text
                      style={FONT_FAMILY.secondary}
                      className="text-base text-black capitalize"
                    >
                      {item.node.title}
                    </Text>
                    <PriceContainer
                      amount={{
                        price: item.node?.variant?.price?.amount,
                        comparePrice: item.node?.variant?.comparePrice?.amount,
                        currencyCode: item.node?.variant?.price?.currencyCode,
                      }}
                      position="left"
                      size="lg"
                    />
                    <View className="flex-row items-center ">
                      {item.node.variant?.selectedOptions?.map((item) => (
                        <Text
                          key={item.value}
                          style={FONT_FAMILY.secondary}
                          className="text-base text-black capitalize mr-6"
                        >
                          {item.name}: {item.value}
                        </Text>
                      ))}
                    </View>
                    <Text
                      style={FONT_FAMILY.secondary}
                      className="text-base text-black capitalize"
                    >
                      Quanitiy: {item.node.quantity}
                    </Text>
                    <Text
                      style={FONT_FAMILY.secondary}
                      className="text-base text-black capitalize"
                    >
                      Customization included
                    </Text>
                  </View>
                </View>
              );
            })}

          <View className=" p-4">
            <Text style={FONT_FAMILY.secondary} className="text-lg text-black">
              Delevery Address
            </Text>
          </View>

          <View className="p-4 bg-white">
            <Text
              style={FONT_FAMILY.secondary}
              className="text-base text-black capitalize"
            >
              Name: {data?.node.billingAddress.firstName}{" "}
              {data?.node.billingAddress.lastName}
            </Text>
            <Text
              style={FONT_FAMILY.secondary}
              className="text-base text-black capitalize"
            >
              Email: {data?.node.billingAddress.email}
            </Text>
            <Text
              style={FONT_FAMILY.secondary}
              className="text-base text-black capitalize"
            >
              Phone: {data?.node.billingAddress.phone}
            </Text>
            <Text
              style={FONT_FAMILY.secondary}
              className="text-base text-black capitalize"
            >
              Address: {data?.node.billingAddress.address1},{" "}
              {data?.node.billingAddress.address2},{" "}
              {data?.node.billingAddress.formattedArea}
            </Text>
          </View>

          {data?.node?.financialStatus !== "VOIDED" && (
            <View className="bg-white p-4">
              <View className=" p-4">
                <Text
                  style={FONT_FAMILY.secondary}
                  className="text-lg text-black"
                >
                  Payment Method
                </Text>
              </View>

              <Text
                style={FONT_FAMILY.secondary}
                className="text-base text-black"
              >
                {data?.node?.financialStatus === "PENDING" &&
                  "paid with cash on delevery"}
                {data?.node?.financialStatus === "PAID" && "paid with card"}
              </Text>
            </View>
          )}

          <View className=" p-4">
            <Text style={FONT_FAMILY.secondary} className="text-lg text-black">
              Payment Summary
            </Text>
          </View>

          <View className="bg-white p-4">
            <View className="flex-row justify-between items-center">
              <Text
                style={FONT_FAMILY.secondary}
                className="text-base text-black"
              >
                Subtotal
              </Text>
              <Text
                style={FONT_FAMILY.secondary}
                className="text-base text-black"
              >
                {data?.node?.subtotalPrice?.amount}{" "}
                {data?.node?.subtotalPrice?.currencyCode}
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text
                style={FONT_FAMILY.secondary}
                className="text-base text-black"
              >
                Shipping
              </Text>
              <Text
                style={FONT_FAMILY.secondary}
                className="text-base text-black"
              >
                {data?.node?.totalShippingPrice?.amount}{" "}
                {data?.node?.totalShippingPrice?.currencyCode}
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text
                style={FONT_FAMILY.secondary}
                className="text-base text-black"
              >
                Vat
              </Text>
              <Text
                style={FONT_FAMILY.secondary}
                className="text-base text-black"
              >
                {data?.node?.totalTax?.amount}{" "}
                {data?.node?.totalTax?.currencyCode}
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text
                style={FONT_FAMILY.secondary}
                className="text-lg text-black"
              >
                Grand Total
              </Text>
              <Text
                style={FONT_FAMILY.secondary}
                className="text-lg text-black"
              >
                {data?.node?.totalPrice?.amount}{" "}
                {data?.node?.totalPrice?.currencyCode}
              </Text>
            </View>
          </View>
        </View>
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

export default ProfileOrdersDetailsScreen;
