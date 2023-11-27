
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { ADD_CART_ITEM, CREATE_CART } from "../graphql/mutations";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { cartIdVar } from "../App";
import { useNavigation } from "@react-navigation/native";
import { GET_CART_DETAILS, GET_PRODUCT, GET_PRODUCT_V2 } from "../graphql/queries";
import { getVariantForOptions, getVariantForSingleOption } from "../components/utils/UtilsFunctions";

const VariantSelectionContext = createContext();

function VariantSelectionProvider({children, productId}) {
  const [activeColor, setActiveColor] = useState(null)
  const [activeSize, setActiveSize] = useState(null)
  const [activeType, setActiveType] = useState(null)
  const [currentlyNotInStock, setCurrentlyNotInStock] = useState(false)
  const [isButtonActive, setButtonActive] = useState(false)

  const navigation = useNavigation()
  const cartId = useReactiveVar(cartIdVar);

  const { data, loading, error } = useQuery(GET_PRODUCT, {
    variables: { productId },
    fetchPolicy: "network-only",
  });

  const [
    createCart,
    { loading: cartLoading, error: cartError, data: cartData },
  ] = useMutation(CREATE_CART);

  const [
    addCartItem,
    {
      loading: addCartItemLoading,
      error: addCartItemError,
      data: addCartItemData,
    },
  ] = useMutation(ADD_CART_ITEM);

  const images = data?.product?.images?.edges.map((edge) => {
    return {
      id: edge?.node?.id,
      url: edge?.node?.url,
      alt: edge?.node?.altText
    };
  });

  const variants = data?.product?.variants.edges.map((edge) => {
    return edge.node;
  });

  const options = data?.product?.options.map((item) => {
    return {
      name: item?.name,
      values: item?.values,
    };
  });

  const firstSelectedColor = options?.find(option => option.name === 'Color')?.values[0]
  let initialColorOption
    if(firstSelectedColor){
      const variant = getVariantForSingleOption(variants, 'Color', firstSelectedColor)
       initialColorOption = {id: variant?.image?.id, value: firstSelectedColor}
    }

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

  const isCurrentlyInStock = () => {

    isVariantAviable = true
    const option = [{name: 'Color', value: activeColor?.value}, {name: 'Size', value: activeSize}, {name: 'TYPE', value: activeType}]
    const variant = getVariantForOptions(variants, option)
    console.log(variant)
    if(variant && variant?.quantityAvailable > 0) isVariantAviable = true
    else isVariantAviable = false

    return isVariantAviable 
}

const handleAddCartBtn = () => {

  const option = [{name: 'Color', value: activeColor.value}, {name: 'Size', value: activeSize}]
  const variant = getVariantForOptions(variants, option)
  console.log(variant.id)

  if (cartId) {
    console.log("CART ID IS SET");
    addCartItem({
      variables: {
        checkoutId: cartId,
        variantId: variant.id,
      },
      refetchQueries: [
        {
          query: GET_CART_DETAILS,
          variables: {
            checkoutId: cartId,
          },
        },
      ],
      onCompleted: () => {
        navigation.navigate("CartScreen");
      },
    });
  } else {
    console.log("NO CART ID IS SET");
    createCart({
      variables: {
        productQuantity: 1,
        productId: variant.id,
      },
      onCompleted: () => {
        navigation.navigate("CartScreen"); 
      },
    });
  }
}

  useEffect(() => {
    if (cartData) {
      cartIdVar(cartData?.checkoutCreate?.checkout?.id);
    }
  }, [cartData]);

  useEffect(() => {
    if(variants) {
      const option = [{name: 'Color', value: activeColor?.value}, {name: 'Size', value: activeSize}, {name: 'TYPE', value: activeType}]
      const variant = getVariantForOptions(variants, option)
      console.log(variant)
      if(variant) {
        if(variant?.currentlyNotInStock)setCurrentlyNotInStock(true)
        else setCurrentlyNotInStock(false)
      } 

      // set add to cart activation
      if(variant && variant.availableForSale) setButtonActive(true)
      else setButtonActive(false)

    }
  
},[activeColor, activeSize, activeType])

console.log(isButtonActive)

  return (
    <VariantSelectionContext.Provider
      value={{
        data,
        options: sortedOptions,
        variants,
        images,
        activeColor,
        setActiveColor,
        activeSize,
        setActiveSize,
        activeType,
        setActiveType,
        isCurrentlyInStock,
        handleAddCartBtn,
        currentlyNotInStock,
        isButtonActive,
      }}
    >{children}</VariantSelectionContext.Provider>
  );
}

export { VariantSelectionContext, VariantSelectionProvider };
