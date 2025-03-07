import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
const levels = ["A1 Level", "A2 Level", "B1 Level", "B2 Level", "C1 Level"];
const levelsCode = ["a1", "a2", "b1", "b2", "c1"];
const Words = () => {
  const [levelIndex, setLevelIndex] = useState(0);
  const [allWords, setAllWords] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("");
  const position = useRef(new Animated.ValueXY()).current;
  useEffect(() => {
    const loadOxfordData = async () => {
      setLoading(true);
      try {
        const res = await AsyncStorage.getItem("langCodeTwo");
        if (!res) {
          alert("Please select a language from settings");
          setLoading(false);
          return;
        }
        setLang(res);
        const oxfordPath = `${FileSystem.documentDirectory}${levelsCode[levelIndex]}unsigned.json`;
        const fileInfo = await FileSystem.getInfoAsync(oxfordPath);
        if (!fileInfo.exists) {
          const response = await fetch(
            `https://raw.githubusercontent.com/mehmetmerthan/polingo-words/main/word-list/${lang}/${lang}-${levelsCode[levelIndex]}.json`
          );
          const data = await response.json();
          await FileSystem.writeAsStringAsync(oxfordPath, JSON.stringify(data));
        }
        const data = await FileSystem.readAsStringAsync(oxfordPath);
        if (data) {
          const words = JSON.parse(data);
          setAllWords(words);
        }
      } catch (error) {
        console.error("Error fetching words", error);
      } finally {
        setLoading(false);
      }
    };
    loadOxfordData();
  }, [levelIndex]);
  const handleDelete = async () => {
    await updateOxfordDataTodelete();
    position.setValue({ x: 0, y: 0 });
  };
  const handleLearn = async () => {
    await updateOxfordDataToLearn();
    await updateOxfordDataTodelete();
    position.setValue({ x: 0, y: 0 });
  };
  const updateOxfordDataToLearn = async () => {
    const oxfordPath = `${FileSystem.documentDirectory}${levelsCode[levelIndex]}learn.json`;
    try {
      const fileExists = await FileSystem.getInfoAsync(oxfordPath);
      let wordsArray = [];
      if (fileExists.exists) {
        const fileContent = await FileSystem.readAsStringAsync(oxfordPath);
        wordsArray = JSON.parse(fileContent);
      }
      wordsArray.push(currentWord);
      await FileSystem.writeAsStringAsync(
        oxfordPath,
        JSON.stringify(wordsArray)
      );
    } catch (error) {
      console.error("Error updating learn.json:", error);
    }
  };

  const updateOxfordDataTodelete = async () => {
    const updatedWords = allWords.slice(1);
    const oxfordPath = `${FileSystem.documentDirectory}${levelsCode[levelIndex]}unsigned.json`;
    await FileSystem.writeAsStringAsync(
      oxfordPath,
      JSON.stringify(updatedWords)
    );
    setAllWords(updatedWords);
  };
  useEffect(() => {
    if (allWords.length > 0) {
      setCurrentWord(allWords[0]);
      setWordCount(allWords.length);
    }
  }, [allWords]);
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
          if (gesture.dx > 0) {
            Animated.timing(position, {
              toValue: { x: 500, y: 0 },
              duration: 100,
              useNativeDriver: false,
            }).start(() => {
              handleDelete();
            });
          } else {
            Animated.timing(position, {
              toValue: { x: -500, y: 0 },
              duration: 100,
              useNativeDriver: false,
            }).start(() => {
              handleLearn();
            });
          }
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
          <Text style={styles.levelSubText}>{wordCount} left</Text>
        </View>
        <TouchableOpacity onPress={handleLevelIncrease}>
          <Ionicons name="chevron-forward" size={28} color="#333" />
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator
          color={"#646cff"}
          size={"large"}
          style={styles.activityIndicator}
        />
      ) : currentWord ? (
        <>
          <View style={styles.cardContainer}>
            <Animated.View
              style={[styles.card, animatedCardStyle]}
              {...panResponder.panHandlers}
            >
              <Text style={styles.wordText}>{currentWord?.term}</Text>
              <Text style={styles.meaningText}>{currentWord?.meaning}</Text>
            </Animated.View>
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={handleLearn} style={styles.button}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.button}>
              <Ionicons name="checkmark" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text style={styles.noticeText}>There is no word to learn</Text>
      )}
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
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noticeText: {
    fontSize: 20,
    color: "#333",
    fontWeight: "300",
  },
});
