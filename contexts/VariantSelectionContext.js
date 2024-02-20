import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { ADD_CART_ITEM_V2 } from "../graphql/mutations";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { uid } from "uid";

import { GET_CART_DETAILS_V2, GET_PRODUCT } from "../graphql/queries";
import { cartVar, checkoutVisitedVar, isLoggedinFrstTimeVar } from "../makeVars/MakeVars";
import { getVariantForOptions } from "../components/utils/UtilsFunctions";
import { useShopifyCheckoutSheet } from "@shopify/checkout-sheet-kit";

const VariantSelectionContext = createContext();

function VariantSelectionProvider({
  children,
  productId,
  variantId,
  colorValue,
}) {
  const [selectedVariant, setSelectedVariant] = useState({});
  const [activeOptions, setActiveOptions] = useState([]);
  const [customProductId, setCustomProductId] = useState("");
  const [isProductSuccessfullyAdded, setProductSuccessfullyAdded] =
    useState(false);

  const cart = useReactiveVar(cartVar);
  const checkoutVisited = useReactiveVar(checkoutVisitedVar);
  const isLoggedinId = useReactiveVar(isLoggedinFrstTimeVar);

  const shopifyCheckout = useShopifyCheckoutSheet();

  const { data, loading, error } = useQuery(GET_PRODUCT, {
    variables: {
      productId,
      metaIdentifiers: [
        {
          key: "washing_instruction",
          namespace: "mobile",
        },
        {
          key: "youmaylike_proudcts",
          namespace: "mobile",
        },
        {
          key: "return_and_shipping_policy",
          namespace: "mobile",
        },
        {
          key: "size_and_fit_image_url",
          namespace: "mobile",
        },
      ],
    },
    fetchPolicy: "no-cache",
  });

  const [
    addCartV2Item,
    {
      loading: addCartV2ItemLoading,
      error: addCartV2ItemError,
      data: addCartV2ItemData,
    },
  ] = useMutation(ADD_CART_ITEM_V2);

  const images = data?.product?.images?.edges.map((edge) => {
    return {
      id: edge?.node?.id,
      url: edge?.node?.url,
      alt: edge?.node?.altText,
    };
  });

  const variants = data?.product?.variants.edges.map((edge) => {
    return edge.node;
  });

  const options = data?.product?.options.map((item) => {
    return {
      id: item?.id,
      name: item?.name,
      values: item?.values,
    };
  });

  const sortedOptions = options?.sort((a, b) => {
    if (a.name === "Color" && b.name !== "Color") {
      return -1;
    } else if (a.name !== "Color" && b.name === "Color") {
      return 1;
    } else if (a.name === "Size" && b.name !== "Size") {
      return 1;
    } else if (a.name !== "Size" && b.name === "Size") {
      return -1;
    } else {
      return 0;
    }
  });

  const handleAddCartBtn = async (onClose) => {
    const uniqueId = uid();
    const customSelections = customProductId?.id
      ? JSON.stringify(customProductId?.selections[0])
      : " ";

    if (cart?.id) {
      const input = customProductId?.id
        ? {
            cartId: cart?.id,
            lines: [
              customProductId.id && {
                merchandiseId: customProductId.id,
                quantity: 1,
                attributes: [
                  {
                    key: "custom-selection-uid",
                    value: uniqueId,
                  },
                  {
                    key: "custom-product-uid",
                    value: uniqueId,
                  },
                  {
                    key: "custom-selection",
                    value: customSelections,
                  },
                ],
              },
              {
                merchandiseId: selectedVariant.id,
                quantity: 1,
                attributes: [
                  {
                    key: "custom-selection-uid",
                    value: uniqueId,
                  },
                ],
              },
            ],
          }
        : {
            cartId: cart?.id,
            lines: [
              {
                merchandiseId: selectedVariant.id,
                quantity: 1,
              },
            ],
          };

      const { data } = await addCartV2Item({
        variables: input,
        refetchQueries: [
          {
            query: GET_CART_DETAILS_V2,
            variables: {
              cartId: cart?.id,
            },
          },
        ],
      });

      if (data?.cartLinesAdd?.cart?.id) {
        typeof onClose === "function" && onClose();
        setProductSuccessfullyAdded(true);
        cartVar(data?.cartLinesAdd?.cart);

        const modifiedUrl = data?.cartLinesAdd?.cart?.checkoutUrl.replace(
          /\/cart\/c\//,
          "/checkouts/cn/"
        );
        const withoutParams = modifiedUrl.split("?")[0];

        shopifyCheckout.preload(
          checkoutVisited
            ? withoutParams
            : isLoggedinId
            ? data?.cartLinesAdd?.cart?.checkoutUrl
            : withoutParams
        );
      }
    }
  };

  useEffect(() => {
    if (variants && variants.length === 1) {
      setSelectedVariant(variants[0]);
    }

    if (!selectedVariant.id && variantId && variants.length > 0) {
      const preSelectedVarinat = variants?.find(
        (variant) => variant.id === variantId
      );
      if (preSelectedVarinat) setSelectedVariant(preSelectedVarinat);
    }
  }, [variants?.length, variantId]);

  useEffect(() => {
    if (!productId.id && activeOptions.length === 0 && colorValue?.value) {
      setActiveOptions([colorValue]);
    }
  }, [colorValue]);

  useEffect(() => {
    if (options?.length === activeOptions?.length) {
      let filteredVariants = variants;

      for (let i = 0; i < activeOptions.length; i++) {
        const optionName = activeOptions[i].name;
        const optionValue = activeOptions[i].value;

        if (optionName && optionValue) {
          filteredVariants = filteredVariants.filter(
            (variant) =>
              variant.selectedOptions.find(
                (option) => option.name === optionName
              )?.value === optionValue
          );
        }
      }

      // const variant = getVariantForOptions(variants, activeOptions);
      const variant =
        filteredVariants.length === 1 ? filteredVariants[0] : null;

      if (variant) {
        setSelectedVariant(variant);
      } else {
        setSelectedVariant({});
      }
    }
  }, [activeOptions]);

  useEffect(() => {
    if (selectedVariant.id && activeOptions.length === 0) {
      const preSelectedOptions = [];
      selectedVariant.selectedOptions.map((op) => {
        if (op.name === "Color") {
          preSelectedOptions.push({
            id: "",
            name: op.name,
            value: op.value,
            image: {
              id: selectedVariant?.image?.id,
              url: selectedVariant?.image?.url,
            },
          });
        } else {
          preSelectedOptions.push({
            id: "",
            name: op.name,
            value: op.value,
          });
        }
      });
      setActiveOptions(preSelectedOptions);
    }
  }, [selectedVariant]);

  return (
    <VariantSelectionContext.Provider
      value={{
        data,
        options: sortedOptions,
        variants,
        images,
        handleAddCartBtn,
        setActiveOptions,
        activeOptions,
        selectedVariant,
        customProductId,
        setCustomProductId,
        isProductSuccessfullyAdded,
        setProductSuccessfullyAdded,
        loading: addCartV2ItemLoading,
      }}
    >
      {children}
    </VariantSelectionContext.Provider>
  );
}

export { VariantSelectionContext, VariantSelectionProvider };
