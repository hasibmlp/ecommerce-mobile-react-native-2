import { useQuery } from "@apollo/client";
import { useContext, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Skeleton from "./skeletons/Skeleton";
import {
  ChevronRightIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  XMarkIcon,
} from "react-native-heroicons/outline";
import MyModal from "./Modal/MyModal";
import { VariantSelectionContext } from "../contexts/VariantSelectionContext";
import { GET_CUSTOMIZATIN_COLLECTION } from "../graphql/queries";
import { FONT_FAMILY } from "../theme";
import CustomSelection from "./Modal/CustomSelection";

const PersonalizeSetting = ({ intention = "short" }) => {
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

      {intention === "short" && customProductId && (
        <TouchableOpacity className="border border-neutral-300 rounded-md px-2">
          <View className="flex-row items-center justify-between h-10 ">
            <Text style={FONT_FAMILY.secondary}>Added Personalization</Text>
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
        </TouchableOpacity>
      )}

      {customProductId && intention === "long" && (
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

          {intention === "long" && (
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
          )}
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

export default PersonalizeSetting;
