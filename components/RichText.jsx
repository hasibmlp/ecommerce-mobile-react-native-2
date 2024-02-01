import { Linking, Text, View } from "react-native";
import { FONT_FAMILY } from "../theme";

const RichText = ({ content }) => {
  const renderNode = (node, index) => {
    switch (node.type) {
      case "heading":
        return (
          <Text
            key={index}
            style={[
              FONT_FAMILY.secondary,
              {
                fontSize: 30 - node.level * 2,
                fontWeight: node.children[0].bold ? "bold" : "normal",
                marginBottom: 16,
              },
            ]}
          >
            {`${node.children[0].value}`}
          </Text>
        );
      case "paragraph":
        return (
          <Text
            key={index}
            style={[
              FONT_FAMILY.secondary,
              {
                fontWeight: node.children[0].bold ? "bold" : "normal",
                fontStyle: node.children[0].italic ? "italic" : "normal",
                marginBottom: 8,
              },
            ]}
          >
            {node.children[0].value}
          </Text>
        );
      case "list":
        return (
          <View key={index} style={{ marginLeft: 10 }}>
            {node.children.map((item, idx) => (
              <Text style={FONT_FAMILY.secondary} key={idx}>
                {`\u2022 ${item.children[0].value}`}{" "}
                {/* Use a bullet point for unordered lists */}
              </Text>
            ))}
          </View>
        );
      case "link":
        return (
          <Text
            key={index}
            onPress={() => Linking.openURL(node.url)}
            style={{
              fontWeight: node.children[0].bold ? "bold" : "normal",
              fontStyle: node.children[0].italic ? "italic" : "normal",
            }}
          >
            {node.children[0].value}
          </Text>
        );
      default:
        return null;
    }
  };

  return (
    <View className="bg-white ">
      {content &&
        content.children.map((node, index) => renderNode(node, index))}
    </View>
  );
};

export default RichText;
