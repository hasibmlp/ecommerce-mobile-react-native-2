import { SafeAreaView, ScrollView, Text, View } from "react-native";
import AddressList from "../components/AddressList";

const ProfileAddressScreen = () => {
  return (
    <View className="flex-1">
      <SafeAreaView className="bg-white">
        <ScrollView>
          <AddressList />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
export default ProfileAddressScreen;
