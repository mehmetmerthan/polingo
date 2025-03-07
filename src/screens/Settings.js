import { View, Text, StyleSheet } from "react-native";
import { React, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "@rneui/themed";
import { signOut } from "aws-amplify/auth";
import { languages } from "../data/languages";
import DropDownPicker from "react-native-dropdown-picker";
import { langCodeMapTwo, langCodeMapThree } from "../data/langCode";
import * as FileSystem from "expo-file-system";
export default function Settings() {
  const [loadingStorage, setLoadingStorage] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState();
  const [items, setItems] = useState(languages);
  useEffect(() => {
    const loadStorage = async () => {
      try {
        const res = await AsyncStorage.getItem("lang");
        if (res) {
          setValue(res);
        }
      } catch (e) {
        console.error(e);
      }
    };

    loadStorage();
  }, []);
  const saveLang = async () => {
    try {
      if (!value) {
        alert("Please select a language");
        return;
      }
      setLoadingStorage(true);
      await AsyncStorage.setItem("lang", value);
      const langCodeTwo = langCodeMapTwo[value];
      const langCodeThree = langCodeMapThree[value];
      await AsyncStorage.setItem("langCodeTwo", langCodeTwo);
      await AsyncStorage.setItem("langCodeThree", langCodeThree);
      setLoadingStorage(false);
      alert("Language updated successfully");
    } catch (e) {
      console.log(e);
    }
  };
  const clearCache = async () => {
    try {
      // await AsyncStorage.removeItem("lang");
      // await AsyncStorage.removeItem("langCodeTwo");
      // await AsyncStorage.removeItem("langCodeThree");
      await FileSystem.deleteAsync(
        `${FileSystem.documentDirectory}a1unsigned.json`
      );
      console.log("Cache cleared");
    } catch (e) {
      console.log(e);
    }
  };
  const showUserProp = async () => {
    try {
      const res = await AsyncStorage.getItem("lang");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View>
          <Text style={styles.title}>Select your language</Text>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            containerStyle={styles.dropDownContainerStyle}
            dropDownContainerStyle={styles.dropDownStyle}
            searchable={true}
            searchPlaceholder="Search"
            translation={{ NOTHING_TO_SHOW: "No item" }}
          />
          <Button
            type="clear"
            onPress={saveLang}
            disabled={loadingStorage}
            loading={loadingStorage}
            title={"Save"}
            containerStyle={styles.button}
            titleStyle={styles.text}
          />
        </View>
      </View>
      <Button title={"x"} onPress={clearCache} />
      <Button
        type="clear"
        title={"Sign Out"}
        onPress={signOut}
        containerStyle={styles.buttonSignOut}
        titleStyle={styles.textSignOut}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  button: {
    backgroundColor: "#646cff",
    borderRadius: 8,
    padding: 5,
    alignSelf: "flex-end",
  },
  card: {
    height: "90%",
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
  title: {
    color: "#333",
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
  textSignOut: {
    color: "rgb(229, 229, 231)",
  },
  text: {
    color: "rgb(229, 229, 231)",
  },
  buttonSignOut: {
    backgroundColor: "rgb(255, 69, 58)",
    color: "rgb(229, 229, 231)",
    borderRadius: 8,
    padding: 5,
    marginTop: 10,
    alignSelf: "center",
  },
  dropDownContainerStyle: {
    marginVertical: 20,
  },
});
