
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { ADD_CART_ITEM, ADD_CART_ITEM_V2, ADD_CART_ITEM_WITH_CUSTOM_ID, ADD_CUSTOM_VARIANT_ID, CREATE_CART, CREATE_CART_V2, CREATE_CART_WITH_CUSTOM_ID } from "../graphql/mutations";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { cartIdVar } from "../App";
import { useNavigation } from "@react-navigation/native";
import { GET_CART_DETAILS, GET_CART_DETAILS_V2, GET_PRODUCT, GET_PRODUCT_V2 } from "../graphql/queries";
import { getVariantForOptions, getVariantForSingleOption } from "../components/utils/UtilsFunctions";

const VariantSelectionContext = createContext();

function VariantSelectionProvider({children, productId, variantId, colorValue}) {

  const [selectedVariant, setSelectedVariant] = useState({})
  const [activeOptions, setActiveOptions] = useState([])
  const [ customProductId, setCustomProductId ] = useState('')


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
    createCartV2,
    { loading: cartV2Loading, error: cartV2Error, data: cartV2Data },
  ] = useMutation(CREATE_CART_V2);

  const [
    addCartItem,
    {
      loading: addCartItemLoading,
      error: addCartItemError,
      data: addCartItemData,
    },
  ] = useMutation(ADD_CART_ITEM);
  
  const [
    addCartV2Item,
    {
      loading: addCartV2ItemLoading,
      error: addCartV2ItemError,
      data: addCartV2ItemData,
    },
  ] = useMutation(ADD_CART_ITEM_V2);

  const [
    addCustomId,
    {
      loading: addCustomItemLoading,
      error: addCustomItemError,
      data: addCustomItemData,
    },
  ] = useMutation(ADD_CUSTOM_VARIANT_ID);

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

const handleAddCartBtn = (onClose) => {
  if (cartId) {
    addCartV2Item({
      variables: {
        cartId,
        lines: [{
          merchandiseId: selectedVariant.id,
          quantity: 1
        }]
      },
      refetchQueries: [
        {
          query: GET_CART_DETAILS_V2,
          variables: {
            cartId,
          },
        },
      ],
      onCompleted: () => {
        typeof(onClose) === 'function' && onClose()
      }
    })

      // addCartItem({
      //   variables: {
      //     checkoutId: cartId,
      //     variantId: selectedVariant.id,
      //     customAttributes: [
      //       {
      //         "key": "customId",
      //         "value": JSON.stringify(customProductId)
      //       }
      //     ]
      //   },
      //   refetchQueries: [
      //     {
      //       query: GET_CART_DETAILS,
      //       variables: {
      //         checkoutId: cartId,
      //       },
      //     },
      //   ],
      //   onCompleted: () => {
      //     if(customProductId){
      //       console.log("YANI CUSTOM PRODUCT ID ULUR 3",customProductId.id)
      //       addCartItem({
      //         variables: {
      //           checkoutId: cartId,
      //           variantId: "gid://shopify/ProductVariant/12528927080565",
      //           customAttributes: [
      //             {
      //               "key": "customId",
      //               "value": JSON.stringify(customProductId)
      //             }
      //           ]
      //         },
      //         refetchQueries: [
      //           {
      //             query: GET_CART_DETAILS,
      //             variables: {
      //               checkoutId: cartId,
      //             },
      //           },
      //         ]
      //       });
      //     }
      //     typeof(onClose) === 'function' && onClose()
      //   },
      // });

  } else {

    createCartV2({
      variables: {
        lines: [{
          merchandiseId: selectedVariant.id,
          quantity: 1
        }]
      },
      onCompleted: () => {
        typeof(onClose) === 'function' && onClose()
      }
    })

    // createCart({
    //   variables: {
    //     productQuantity: 1,
    //     productId: selectedVariant.id,
    //     customAttributes: [
    //       {
    //         "key": "customId",
    //         "value": JSON.stringify(customProductId)
    //       }
    //     ],
    //   },
    //   onCompleted: () => {
    //     if(customProductId){
    //       console.log("YANI CUSTOM PRODUCT ID ULUR 3",customProductId.id)
    //       addCartItem({
    //         variables: {
    //           checkoutId: cartId,
    //           variantId: "gid://shopify/ProductVariant/12528927080565",
    //           customAttributes: [
    //             {
    //               "key": "customId",
    //               "value": JSON.stringify(customProductId)
    //             }
    //           ]
    //         },
    //         refetchQueries: [
    //           {
    //             query: GET_CART_DETAILS,
    //             variables: {
    //               checkoutId: cartId,
    //             },
    //           },
    //         ]
    //       });
    //     }
    //     typeof(onClose) === 'function' && onClose()
    //   },
    // });

  }

}

useEffect(() => {
  if (cartV2Data) {
    cartIdVar(cartV2Data?.cartCreate?.cart?.id);
  }
}, [cartV2Data]);

useEffect(() => {
  if(variants && variants.length === 1) {
    setSelectedVariant(variants[0])
  }
},[variants])

useEffect(() => {
  if(!selectedVariant.id && variantId && variants) {
    const preSelectedVarinat = variants?.find(variant => variant.id === variantId)
    if(preSelectedVarinat) setSelectedVariant(preSelectedVarinat)
  }
},[variantId, variants])

useEffect(() => {
  if(!productId.id && activeOptions.length === 0 && colorValue?.value) {
    setActiveOptions([colorValue])
  }
},[colorValue])
  
useEffect(() => {
  if(options?.length === activeOptions?.length) {
    const variant = getVariantForOptions(variants, activeOptions)
    if(variant) {
      setSelectedVariant(variant)
    }else {
      setSelectedVariant({})
    }
  }
},[activeOptions])

useEffect(() => {
  if(selectedVariant.id && activeOptions.length === 0) {
    const preSelectedOptions = []
    selectedVariant.selectedOptions.map(op => {
      if(op.name === 'Color') {
        preSelectedOptions.push({
          id: '',
          name: op.name,
          value: op.value,
          image: {
              id: selectedVariant?.image?.id,
              url: selectedVariant?.image?.url,
          },
        })
      }else {
        preSelectedOptions.push({
          id: '',
          name: op.name,
          value: op.value,
        })
      }
    })
    setActiveOptions(preSelectedOptions)
  }
},[selectedVariant])

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
        setCustomProductId
      }}
    >{children}</VariantSelectionContext.Provider>
  );
}

export { VariantSelectionContext, VariantSelectionProvider };
