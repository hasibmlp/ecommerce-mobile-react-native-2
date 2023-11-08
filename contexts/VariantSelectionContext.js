import { useReactiveVar } from "@apollo/client";
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { selctedProductForBottomModalVar } from "../App";

const VariantSelectionContext = createContext();

function VariantSelectionProvider({children}) {
  const slectedProudct = useReactiveVar(selctedProductForBottomModalVar);

  console.log(slectedProudct);

  const [color, setColor] = useState(null);
  const [size, setSize] = useState(null);
  const [type, setType] = useState(null);

  useEffect(() => {
    setColor(null);
    setSize(null);
    setType(null);
  }, [slectedProudct]);

  return (
    <VariantSelectionContext.Provider
      value={{
        color,
        setColor,
        size,
        setSize,
        type,
        setType,
      }}
    >{children}</VariantSelectionContext.Provider>
  );
}

export { VariantSelectionContext, VariantSelectionProvider };
