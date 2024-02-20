import { SafeAreaView, ScrollView, Text, View } from "react-native";
import AddressList from "../components/AddressList";
import ScreenHeaderV3 from "../components/actions/ScreenHeaderV3";

const ProfileAddressScreen = () => {
  return (
    <View className="flex-1">
      <SafeAreaView className="bg-white">
        <ScreenHeaderV3 label="Address" />
        <ScrollView className="w-full h-full">
          <AddressList />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
export default ProfileAddressScreen;
