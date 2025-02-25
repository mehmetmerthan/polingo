import { React, useState } from "react";
import { CheckBox, Button, Icon } from "@rneui/themed";
import { View, Text, StyleSheet } from "react-native";
import { changeWord, removeWord } from "../services/wordService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Speech from "expo-speech";
import GlishModal from "./GlishModal";
import WordDetailModal from "./WordDetailModal";
export default function WordListRender({
  item,
  fetchData,
  setLoading,
  loading,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalGlishVisible, setModalGlishVisible] = useState(false);
  const [langCodeThree, setLangCodeThree] = useState("");
  async function handleStatusChange() {
    setLoading(true);
    const result = await changeWord({
      wordId: item.id,
      isLearned: !item.isLearned,
    });
    if (result) {
      await fetchData();
    }
    setLoading(false);
  }
  const handleDelete = async () => {
    setLoading(true);
    const result = await removeWord(item.id);
    if (result) {
      await fetchData();
    }
    setLoading(false);
  };
  async function playSound(text) {
    if (text === "" || loading) {
      setLoading(false);
      return;
    }
    setLoading(true);
    Speech.speak(text);
    setLoading(false);
  }
  const openGlish = () => {
    setModalGlishVisible(true);
  };
  const openInfo = async () => {
    const langCodeThree = await AsyncStorage.getItem("langCodeThree");
    if (!langCodeThree) {
      alert("Please select a language from settings.");
      return;
    }
    setLangCodeThree(langCodeThree);
    setModalVisible(true);
  };
  return (
    <View style={styles.listItem}>
      <View style={styles.wordContainer}>
        <CheckBox
          containerStyle={{ backgroundColor: "transparent" }}
          checked={item.isLearned}
          onPress={handleStatusChange}
          disabled={loading}
        />
        <Text style={styles.word}>{item.word}</Text>
      </View>
      <Text style={styles.meaning}>{item.translation}</Text>
      <View style={styles.listButtonGroup}>
        <Button
          type="clear"
          icon={
            <Icon
              name="play-circle"
              type="font-awesome"
              size={28}
              color={"#646cff"}
            />
          }
          onPress={() => playSound(item.word)}
          disabled={loading}
        />
        <Button
          type="clear"
          icon={
            <Icon
              name="info-circle"
              type="font-awesome"
              size={28}
              color={"#646cff"}
            />
          }
          onPress={openInfo}
        />
        <Button
          type="clear"
          icon={
            <Icon
              name="youtube-play"
              type="font-awesome"
              color={"#646cff"}
              size={28}
            />
          }
          onPress={openGlish}
        />
        <Button
          type="clear"
          icon={
            <Icon
              name="delete"
              type="material-comunity-icons"
              color={"#646cff"}
              size={28}
            />
          }
          onPress={handleDelete}
          disabled={loading}
        />
      </View>
      {modalVisible && (
        <WordDetailModal
          visible={modalVisible}
          setVisible={setModalVisible}
          word={item.word}
          translateTo={langCodeThree}
        />
      )}
      {modalGlishVisible && (
        <GlishModal
          visible={modalGlishVisible}
          setVisible={setModalGlishVisible}
          word={item.word}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd", 
    borderRadius: 8,
    padding: 8,
    marginVertical: 8,
    backgroundColor: "#ffffff",
  },
  listButtonGroup: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    borderColor: "#ddd", 
    borderWidth: 1,
    marginTop: 8,
    alignSelf: "center",
  },
  wordContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    justifyContent: "center",
  },
  word: {
    color: "rgb(39, 39, 41)",
    fontSize: 28,
  },
  meaning: {
    color: "rgb(39, 39, 41)",
    fontSize: 22,
    fontWeight: "300",
  },
});
