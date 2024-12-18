import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import { Button } from "@rneui/themed";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { translateText } from "../../services/translateService";
import { addWord, searchWord } from "../../services/wordService";
import WordDetailModal from "../../components/WordDetailModal";
import GlishModal from "../../components/GlishModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function WebsiteWebView({ route }) {
  const { url } = route.params;
  const [selectedWord, setSelectedWord] = useState("");
  const [translatedWord, setTranslatedWord] = useState("");
  const [loading, setLoading] = useState(true);
  const [isWordExist, setIsWordExist] = useState(false);
  const [isWordExistAlertVisible, setIsWordExistAlertVisible] = useState(false);
  const [loadingAddWord, setLoadingAddWord] = useState(false);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalGlishVisible, setModalGlishVisible] = useState(false);
  const [langCode, setLangCode] = useState("");
  const webViewRef = useRef(null);

  const injectScript = `
  var materialIconsLink = document.createElement('link');
  materialIconsLink.rel = 'stylesheet';
  materialIconsLink.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
  document.head.appendChild(materialIconsLink);
  
  let currentMenu = null;

  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    var selectedText = window.getSelection().toString();
    if (selectedText) {
      if (currentMenu) {
        document.body.removeChild(currentMenu);
        currentMenu = null;
      }
      var menu = document.createElement('div');
      menu.style.position = 'fixed';
      menu.style.top = (e.clientY - 75) + 'px';
      menu.style.left = (e.clientX + 10) + 'px';
      menu.style.backgroundColor = '#ffffffff';
      menu.style.borderRadius = '10px';
      menu.style.boxShadow = '0px 2px 10px rgba(0, 0, 0, 0.4)';
      menu.style.padding = '10px';
      menu.style.zIndex = 1000;
      menu.style.border = '1px solid rgba(173, 173, 173, 1) ';
      var button1 = document.createElement('button');
      button1.innerHTML = '<i class="material-icons">translate</i>';
      button1.style.display = 'block';
      button1.style.color = '#000000';
      button1.style.background = 'transparent';
      button1.style.border = 'none'; 
      button1.onclick = function() {
        window.ReactNativeWebView.postMessage(selectedText);
        document.body.removeChild(menu);
        currentMenu = null;
      };

      menu.appendChild(button1);
      document.body.appendChild(menu);
      currentMenu = menu;
    }
  });
  document.addEventListener('click', function(e) {
    if (currentMenu) {
      document.body.removeChild(currentMenu);
      currentMenu = null;
    }
  });
  const removeAdsAndPopups = () => {
    if (currentMenu) return;
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      iframe.style.display = 'none';
    });
    const divs = document.querySelectorAll('div');
    divs.forEach(div => {
      if (div.style.position === 'fixed' || div.style.position === 'absolute') {
        div.style.display = 'none';
      }
    });
  };
  document.addEventListener('DOMContentLoaded', removeAdsAndPopups);
  setInterval(removeAdsAndPopups, 1000);
  true; 
`;
  async function onMessage(event) {
    setIsWordExist(false);
    setIsWordExistAlertVisible(false);
    setLoading(true);
    const langCodeTwo = await AsyncStorage.getItem("langCodeTwo");
    const langCodeThree = await AsyncStorage.getItem("langCodeThree");
    setLangCode(langCodeThree);
    if (!langCodeTwo) {
      alert("Please select a language in settings first");
      return;
    }
    const word = event.nativeEvent.data;
    setSelectedWord(word);
    const translated = await translateText({
      text: word,
      setError,
      translateTo: langCodeTwo,
    });
    setTranslatedWord(translated);
    setLoading(false);
  }
  async function addWordToDb() {
    setLoadingAddWord(true);
    const result = await searchWord({ searchWord: selectedWord });
    if (result.length === 0) {
      await addWord({
        newWord: selectedWord,
        newWordTranslation: translatedWord,
      });
      setIsWordExist(true);
    } else {
      setIsWordExist(true);
      setIsWordExistAlertVisible(true);
    }
    setLoadingAddWord(false);
  }
  function handleBack() {
    webViewRef.current.goBack();
  }
  function handleOnRefresh() {
    webViewRef.current.reload();
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        <Button
          onPress={handleBack}
          icon={{
            name: "chevron-back-circle",
            type: "ionicon",
            size: 40,
            color: "white",
          }}
          buttonStyle={{
            backgroundColor: "transparent",
          }}
        />
        <Button
          onPress={handleOnRefresh}
          icon={{
            name: "refresh-circle",
            type: "ionicon",
            size: 40,
            color: "white",
          }}
          buttonStyle={{
            backgroundColor: "transparent",
          }}
        />
      </View>
      <WebView
        ref={webViewRef}
        originWhitelist={["*"]}
        source={{
          uri: url,
        }}
        onMessage={onMessage}
        containerStyle={styles.webviewContainer}
        injectedJavaScript={injectScript}
      />
      {modalVisible && selectedWord && translatedWord && (
        <WordDetailModal
          visible={modalVisible}
          setVisible={setModalVisible}
          word={selectedWord}
          translateTo={langCode}
        />
      )}
      {modalGlishVisible && selectedWord && (
        <GlishModal
          visible={modalGlishVisible}
          setVisible={setModalGlishVisible}
          word={selectedWord}
        />
      )}
      {selectedWord ? (
        <View style={styles.wordContainer}>
          {loading ? (
            <ActivityIndicator style={styles.activityIndicator} />
          ) : (
            <>
              {loadingAddWord ? (
                <ActivityIndicator style={styles.activityIndicator} />
              ) : (
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={addWordToDb}
                >
                  {isWordExist ? (
                    <>
                      <AntDesign name="check" size={30} color="green" />
                      {isWordExistAlertVisible && (
                        <Text style={styles.existAlert}>
                          Word already exist
                        </Text>
                      )}
                    </>
                  ) : (
                    <MaterialIcons name="add" size={30} color="green" />
                  )}
                </TouchableOpacity>
              )}
              <View style={styles.selectedWordContainer}>
                <Text style={styles.selectedWordText}>{selectedWord}</Text>
                <Text style={styles.translatedText}>{translatedWord}</Text>
                <Text style={styles.errorText}>{error}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Button
                  icon={{
                    name: "youtube",
                    type: "feather",
                    size: 35,
                  }}
                  buttonStyle={{
                    backgroundColor: "#ffffff00",
                  }}
                  onPress={() => {
                    setModalGlishVisible(true);
                  }}
                />
                <Button
                  icon={{
                    name: "info",
                    color: "green",
                    size: 30,
                  }}
                  buttonStyle={{
                    backgroundColor: "#ffffff00",
                  }}
                  onPress={() => {
                    setModalVisible(true);
                  }}
                />
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setSelectedWord("");
                    setTranslatedWord("");
                    setIsWordExist(false);
                    setIsWordExistAlertVisible(false);
                  }}
                >
                  <MaterialIcons name="cancel" size={30} color="black" />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  wordContainer: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    bottom: 20,
    left: 10,
    right: 10,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 10,
    maxHeight: 150,
    borderWidth: 1,
    borderColor: "#cccccc",
  },
  selectedWordContainer: {
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",
  },
  selectedWordText: {
    fontSize: 16,
    color: "#000",
    textAlignVertical: "center",
    fontWeight: "500",
  },
  translatedText: {
    fontSize: 14,
    color: "#000",
    textAlignVertical: "center",
    fontWeight: "300",
  },
  closeButton: {
    justifyContent: "center",
    marginRight: 10,
  },
  wordButtonsContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  existAlert: {
    color: "green",
    fontSize: 14,
    fontWeight: "200",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    fontWeight: "200",
  },
});
