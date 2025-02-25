import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
const wordsList = [
  { word: "Apple", meaning: "A round fruit with red or green skin." },
  { word: "Table", meaning: "A piece of furniture with a flat top and legs." },
  { word: "Run", meaning: "To move quickly on foot." },
  { word: "Book", meaning: "A set of written pages bound together." },
  { word: "Chair", meaning: "A seat with a back, typically for one person." },
];
const levels = ["A1 Level", "A2 Level", "B1 Level", "B2 Level", "C1 Level"];

const Words = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [levelIndex, setLevelIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;

  const handleNextWord = () => {
    setWordIndex((prevIndex) => (prevIndex + 1) % wordsList.length);
    position.setValue({ x: 0, y: 0 });
  };

  const handlePrevWord = () => {
    setWordIndex(
      (prevIndex) => (prevIndex - 1 + wordsList.length) % wordsList.length
    );
    position.setValue({ x: 0, y: 0 });
  };

  const handleLevelIncrease = () => {
    setLevelIndex((prevIndex) => Math.min(prevIndex + 1, levels.length - 1));
  };

  const handleLevelDecrease = () => {
    setLevelIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (Math.abs(gesture.dx) > 80) {
          Animated.timing(position, {
            toValue: { x: gesture.dx > 0 ? 500 : -500, y: 0 },
            duration: 100,
            useNativeDriver: false,
          }).start(() => {
            handleNextWord();
          });
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 4,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const rotate = position.x.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: ["-10deg", "0deg", "10deg"],
  });

  const animatedCardStyle = {
    transform: [
      { translateX: position.x },
      { translateY: position.y },
      { rotate },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>oxford 5000 words</Text>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLevelDecrease}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <View style={styles.levelContainer}>
          <Text style={styles.levelText}>{levels[levelIndex]}</Text>
          <Text style={styles.levelSubText}>1054 left</Text>
        </View>
        <TouchableOpacity onPress={handleLevelIncrease}>
          <Ionicons name="chevron-forward" size={28} color="#333" />
        </TouchableOpacity>
      </View>
      <View style={styles.cardContainer}>
        <Animated.View
          style={[styles.card, animatedCardStyle]}
          {...panResponder.panHandlers}
        >
          <Text style={styles.wordText}>{wordsList[wordIndex].word}</Text>
          <Text style={styles.meaningText}>{wordsList[wordIndex].meaning}</Text>
        </Animated.View>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={handleNextWord} style={styles.button}>
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handlePrevWord}
          style={[styles.button, { backgroundColor: "gray" }]}
        >
          <Ionicons name="refresh" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNextWord} style={styles.button}>
          <Ionicons name="checkmark" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Words;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 30,
    paddingBottom: 30,
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    width: "80%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  levelContainer: {
    alignItems: "center",
  },
  levelText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  levelSubText: {
    fontSize: 14,
    color: "#666",
  },
  title: {
    marginTop: 0,
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  cardContainer: {
    flex: 0.6,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  card: {
    width: "80%",
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  wordText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#333",
  },
  meaningText: {
    fontSize: 18,
    color: "#666",
    marginTop: 10,
    textAlign: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    width: "80%",
    justifyContent: "space-around",
    paddingBottom: 20,
  },
  button: {
    backgroundColor: "#646cff",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});
