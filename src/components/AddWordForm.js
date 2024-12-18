import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { addWord } from "../services/wordService";
import { Button, Input } from "@rneui/themed";
import { translateText } from "../services/translateService";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const AddWordForm = ({
  setIsAddFormVisible,
  setLoadingState,
  fetchData,
  allWords,
}) => {
  const [newWord, setNewWord] = useState("");
  const [newWordTranslation, setNewWordTranslation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingButton, setLoadingButton] = useState(false);
  const [loadingTranslate, setLoadingTranslate] = useState(false);
  const handleAddWord = async () => {
    if (!newWord.trim() || !newWordTranslation.trim()) {
      alert("Both fields are required.");
      return;
    }
    if (
      allWords.some(
        (word) =>
          word.word.trim().toLowerCase() === newWord.trim().toLowerCase()
      )
    ) {
      alert("Word already exists.");
      setLoadingState(false);
      setLoadingButton(false);
      return;
    }
    setLoadingState(true);
    setLoadingButton(true);
    const result = await addWord({
      newWord,
      newWordTranslation,
      setErrorMessage,
    });
    if (result) {
      await fetchData();
      setIsAddFormVisible(false);
      setLoadingState(false);
      setLoadingButton(false);
    }
  };
  async function handleTranslate() {
    setErrorMessage("");
    const langCode = await AsyncStorage.getItem("langCodeTwo");
    if (!langCode) {
      alert("Please select a training language in settings.");
      return;
    }
    if (!newWord.trim()) {
      alert("Please enter a word to translate.");
      return;
    }
    setLoadingTranslate(true);
    const result = await translateText({
      text: newWord,
      setError: setErrorMessage,
      translateTo: langCode,
    });
    if (result) {
      setNewWordTranslation(result);
    }
    setLoadingTranslate(false);
  }
  const rightIcon = (
    <Button
      onPress={handleTranslate}
      icon={{ name: "translate", color: "white" }}
      color={"transparent"}
      loading={loadingTranslate}
      size="md"
      loadingStyle={{
        backgroundColor: "white",
        borderRadius: 50,
        width: 25,
        height: 25,
      }}
    />
  );

  return (
    <View style={styles.inputContainer}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setIsAddFormVisible(false)}
      >
        <AntDesign name="closecircle" size={28} color="white" />
      </TouchableOpacity>
      <Input
        style={styles.input}
        placeholder="Word"
        value={newWord}
        onChangeText={setNewWord}
        multiline
        clearButtonMode="always"
      />
      <Input
        style={styles.input}
        placeholder="Meaning"
        value={newWordTranslation}
        onChangeText={setNewWordTranslation}
        clearButtonMode="always"
        rightIcon={rightIcon}
        multiline
      />
      {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
      <Button
        type="clear"
        title={"Add Word"}
        onPress={handleAddWord}
        containerStyle={styles.addButton}
        titleStyle={{ color: "white" }}
        color={"#4CAF50"}
        loading={loadingButton}
        rightIcon={rightIcon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#393e42",
    borderRadius: 8,
    elevation: 5,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingLeft: 10,
    backgroundColor: "#393e42",
    color: "rgb(229, 229, 231)",
  },
  errorMessage: {
    color: "rgb(255, 69, 58)",
    fontSize: 18,
  },
  closeButton: {
    position: "absolute",
    top: -40,
    right: 0,
    borderRadius: 50,
    padding: 5,
    backgroundColor: "black",
  },
  addButton: {
    borderRadius: 8,
    marginTop: 10,
    borderColor: "#646cff",
    borderWidth: 1,
    backgroundColor: "#000000",
  },
});
