import { Text, View } from "react-native";

import HomeHeader from "../components/HomeHeader";
import GenderSelector from "../components/GenderSelector";
import { useState } from "react";

export default function HomeHeaderMain() {

    const [toggleGenderMenu, setToggleGenderMenu] = useState(false)

    const handleToggleMenu = (value) => { 
        setToggleGenderMenu(value) }
    
  return (
    <>
      <HomeHeader handleToggleMenu={handleToggleMenu} value={toggleGenderMenu} />
      <GenderSelector />
    </>
  );
}
