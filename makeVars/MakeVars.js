import { makeVar } from "@apollo/client";
import { View } from "react-native";

export const cartIdVar = makeVar("");
export const cartVar = makeVar(null);
export const checkoutIdVar = makeVar("");
export const userVar = makeVar(null);
export const bottomModaVar = makeVar(false);
export const selctedProductForBottomModalVar = makeVar(null);
export const checkoutVisitedVar = makeVar(false);
export const isLoggedinFrstTimeVar = makeVar(false);

const MakeVarsContext = ({ children }) => {
  <View>{children}</View>;
};

export default MakeVarsContext;
