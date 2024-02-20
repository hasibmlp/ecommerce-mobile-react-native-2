
import BottomModal from "./BottomModal";
import { Linking, Pressable, Text, TouchableOpacity, View } from "react-native";
import { ChevronRightIcon, PhoneIcon } from "react-native-heroicons/outline";
import WhatsappIcon from "../icons/WhatsappIcon";
import EmailIcon from "../icons/EmailIcon";
import Panel from "../actions/Panel";
import { FONT_FAMILY } from "../../theme";

const SupportModal = ({ isModalVisible, onClose }) => {
  return (
    <BottomModal title="Need Help?" visible={isModalVisible} onClose={onClose}>
      <View className="pb-14">
        <View className="pb-8">
          <View className=" w-[90%] mx-auto pb-3">
            <Text
              style={FONT_FAMILY.secondary}
              className="text-[14px] text-gray-800 font-light leading-5"
            >
              If you need to speak with one of our customer case representative
              you can react us here, We are avilable between 10am - 10pm
            </Text>
          </View>
          <View className="flex-row justify-between items-center w-[90%] mx-auto">
            <InformationIconTile
              label="Phone"
              icon={<PhoneIcon size={24} color="black" strokeWidth={1} />}
              onClick={() => Linking.openURL("tel:+97124913000")}
            />
            <InformationIconTile
              label="Whatsapp"
              icon={<WhatsappIcon />}
              onClick={() =>
                Linking.openURL("whatsapp://send?phone=+971504713945")
              }
            />
            <InformationIconTile
              label="Mail"
              icon={<EmailIcon />}
              onClick={() => Linking.openURL("mailto:helloscrubsandclogs.com")}
            />
          </View>
        </View>

        <Panel
          label="Shipping Returns & Refunds"
          style={{ borderBottomWidth: 1, borderBottomColor: "#D3D3D3" }}
          rightIcon={<ChevronRightIcon size={24} color="black" />}
        />
      </View>
    </BottomModal>
  );
};

function InformationIconTile({ label, icon, onClick }) {
  return (
    <TouchableOpacity
      onPress={onClick}
      className="w-28 h-20 border border-gray-500 rounded-[5px] items-center justify-center"
    >
      {icon}
      <Text
        style={FONT_FAMILY.secondary}
        className="text-[12px] text-black font-normal uppercase mt-2"
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default SupportModal;
