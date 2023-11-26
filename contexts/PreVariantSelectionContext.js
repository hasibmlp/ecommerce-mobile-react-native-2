import { createContext, useEffect, useState } from "react";
import { GET_CART_DETAILS, GET_PRODUCT_VARIANTS_AND_IMAGES_AND_OPTIONS } from "../graphql/queries";
import { ADD_CART_ITEM, CREATE_CART } from "../graphql/mutations";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { cartIdVar } from "../App";
import { getVariantForOptions, getVariantForSingleOption } from "../components/utils/UtilsFunctions";

const PreVariantSelectionContext = createContext()

function PreVariantSelectionProvider({children, productId, handleClose}) {
    const [activeColor, setActiveColor] = useState(null)
    const [activeSize, setActiveSize] = useState(null)
    const [activeType, setActiveType] = useState(null)

    const navigation = useNavigation()
    const cartId = useReactiveVar(cartIdVar);
  
    const { data, loading, error } = useQuery(GET_PRODUCT_VARIANTS_AND_IMAGES_AND_OPTIONS, {
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
        name: item.name,
        values: item.values,
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
      console.log('color', activeColor)
      console.log('size', activeSize)
      console.log('type', activeType)
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
          handleClose()
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
          handleClose()
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

    
    return (
        <PreVariantSelectionContext.Provider
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
                handleAddCartBtn
            }}
        >
            {children}
        </PreVariantSelectionContext.Provider>
    )
}

export {PreVariantSelectionContext, PreVariantSelectionProvider}