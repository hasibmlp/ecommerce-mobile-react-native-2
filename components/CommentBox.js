import React from "react";
import { View, Text } from "react-native";
import { StyleSheet } from "react-native";

const CommentBox = () => {
  return (
    <View style={styles.commentBox}>
      <Text style={styles.commentText}>Your comment goes here.</Text>
      <View style={styles.triangle} />
    </View>
  );
};

const styles = StyleSheet.create({
  commentBox: {
    backgroundColor: "#003BDE",
    padding: 20,
    borderRadius: 10, // To create rounded corners
    position: "relative",
  },
  commentText: {
    color: "white",
  },
  triangle: {
    position: "absolute",
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderTopWidth: 0,
    borderRightWidth: 25, // Adjust this value for the desired size
    borderBottomWidth: 25, // Adjust this value for the desired size
    borderLeftWidth: 25, // Adjust this value for the desired size
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#003BDE", // Should match the box background color
    borderLeftColor: "transparent",
    bottom: -10, // Adjust this value to control the distance of the triangle tail
    left: "50%",
    transform: [{ translateX: -90 }, { rotate: "180deg" }], // Half the value of borderRightWidth
  },
});

export default CommentBox;
