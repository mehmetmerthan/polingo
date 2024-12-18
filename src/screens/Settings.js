import { View, Text, StyleSheet } from "react-native";
import { React, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "@rneui/themed";
import { signOut } from "aws-amplify/auth";
import { languages } from "../data/languages";
import DropDownPicker from "react-native-dropdown-picker";
import { langCodeMapTwo, langCodeMapThree } from "../data/langCode";
export default function Settings() {
  const [loadingStorage, setLoadingStorage] = useState(false);
  //const [loadingTrainingStorage, setLoadingTrainingStorage] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState();
  // const [openTraining, setOpenTraining] = useState(false);
  // const [valueTraining, setValueTraining] = useState();
  const [items, setItems] = useState(languages);
  useEffect(() => {
    const loadStorage = async () => {
      try {
        const res = await AsyncStorage.getItem("lang");
        if (res) {
          setValue(res);
        }
        // const resTraining = await AsyncStorage.getItem("langTraining");
        // if (resTraining) {
        //   setValueTraining(resTraining);
        // }
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
  // const saveTrainingLang = async () => {
  //   try {
  //     if (!valueTraining) {
  //       alert("Please select a training language");
  //       return;
  //     }
  //     setLoadingTrainingStorage(true);
  //     await AsyncStorage.setItem("langTraining", valueTraining);
  //     const langCodeTwo = langCodeMapTwo[valueTraining];
  //     const langCodeThree = langCodeMapThree[valueTraining];
  //     await AsyncStorage.setItem("langCodeTwoTraining", langCodeTwo);
  //     await AsyncStorage.setItem("langCodeThreeTraining", langCodeThree);
  //     setLoadingTrainingStorage(false);
  //     alert("Training language updated successfully");
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
  const clearCache = async () => {
    try {
      await AsyncStorage.removeItem("lang");
      await AsyncStorage.removeItem("langCodeTwo");
      await AsyncStorage.removeItem("langCodeThree");
    } catch (e) {
      console.log(e);
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
            style={styles.dropDownStyle}
            dropDownContainerStyle={styles.dropDownStyle}
            theme="DARK"
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
        {/* <View style={{ marginTop: 40 }}>
          <Text style={styles.title}>Select your training language</Text>
          <DropDownPicker
            open={openTraining}
            value={valueTraining}
            items={items}
            setOpen={setOpenTraining}
            setValue={setValueTraining}
            setItems={setItems}
            containerStyle={styles.dropDownContainerStyle}
            style={styles.dropDownStyle}
            dropDownContainerStyle={styles.dropDownStyle}
            theme="DARK"
            searchable={true}
            searchPlaceholder="Search"
            translation={{ NOTHING_TO_SHOW: "No item" }}
          />
          <Button
            type="clear"
            onPress={saveTrainingLang}
            disabled={loadingTrainingStorage}
            loading={loadingTrainingStorage}
            title={"Save"}
            containerStyle={styles.button}
            titleStyle={styles.text}
          />
        </View> */}
      </View>

      {/* <Button title={"x"} onPress={clearCache}/> */}
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
  },
  button: {
    backgroundColor: "#000000",
    color: "rgb(229, 229, 231)",
    borderRadius: 8,
    padding: 5,
    borderColor: "#646cff",
    borderWidth: 1,
    alignSelf: "flex-end",
  },
  card: {
    flex: 1,
    padding: 24,
    backgroundColor: "rgb(18, 18, 18)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgb(39, 39, 41)",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    color: "rgb(229, 229, 231)",
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
    borderWidth: 1,
    marginTop: 10,
    alignSelf: "center",
  },
  dropDownStyle: {
    backgroundColor: "#393e42",
  },
  dropDownContainerStyle: {
    marginVertical: 20,
  },
});
