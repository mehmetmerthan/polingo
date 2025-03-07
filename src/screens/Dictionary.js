import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  RefreshControl,
} from "react-native";
import { SearchBar } from "@rneui/themed";
import WordListRender from "../components/WordListRender";
import DropDownPicker from "react-native-dropdown-picker";
import * as FileSystem from "expo-file-system";
export default function Dictionary() {
  const pageSize = 20;
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("learn");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [wordList, setWordList] = useState([]);
  const [words, setWords] = useState([]);
  const [allWords, setAllWords] = useState([]);
  const [wordCount, setWordCount] = useState(0);
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([
    { label: "Learning", value: "learn" },
    { label: "Learned", value: "known" },
  ]);
  const [openCefr, setOpenCefr] = useState(false);
  const [valueCefr, setValueCefr] = useState("a1");
  const [refreshing, setRefreshing] = useState(false);
  const [cefr, setCefr] = useState([
    { label: "A1 Level", value: "a1" },
    { label: "A2 Level", value: "a2" },
    { label: "B1 Level", value: "b1" },
    { label: "B2 Level", value: "b2" },
    { label: "C1 Level", value: "c1" },
  ]);
  const updateSearch = (search) => {
    setSearch(search);
    if (search === "") {
      setWords(wordList.slice(0, pageSize));
      return;
    }
    const filteredWords = allWords.filter((word) => {
      return (
        word.term.toLowerCase().includes(search.toLowerCase()) ||
        word.meaning.toLowerCase().includes(search.toLowerCase())
      );
    });
    setWords(filteredWords);
  };

  const listEmptyComponent = () => {
    return (
      <View>
        <Text style={styles.listEmptyText}>No words added yet</Text>
      </View>
    );
  };

  const fetchWordsData = async () => {
    setLoading(true);
    try {
      const oxfordPath = `${FileSystem.documentDirectory}${valueCefr}${value}.json`;
      const fileInfo = await FileSystem.getInfoAsync(oxfordPath);
      if (!fileInfo.exists) {
        setAllWords([]);
        setWordList([]);
        setWords([]);
        setWordCount(0);
        setLoading(false);
        return;
      }
      const data = await FileSystem.readAsStringAsync(oxfordPath);
      const parsedData = JSON.parse(data);
      setAllWords(parsedData);
      const initialWords = parsedData.slice(0, pageSize);
      setWordList(parsedData);
      setWordCount(parsedData.length);
      setWords(initialWords);
    } catch (error) {
      console.error("Error reading data from file:", error);
    }
    setLoading(false);
  };

  const loadMoreWords = () => {
    if (loading || search !== "") {
      return;
    }
    setLoading(true);
    const nextPage = page + 1;
    const newWords = wordList.slice(0, nextPage * pageSize);
    setWords(newWords);
    setPage(nextPage);
    setLoading(false);
  };

  useEffect(() => {
    fetchWordsData();
  }, [valueCefr, value]);

  const onRefresh = async () => {
    if (refreshing || loading) return;
    setRefreshing(true);
    await fetchWordsData();
    setRefreshing(false);
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SearchBar
          placeholder="Search"
          inputStyle={styles.text}
          onChangeText={updateSearch}
          value={search}
          lightTheme
          platform="android"
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 10,
          }}
        >
          {wordCount > 0 && (
            <Text style={styles.textCount}>{wordCount} words</Text>
          )}
          {loading && <ActivityIndicator size="large" color="#646cff" />}
          <DropDownPicker
            open={openCefr}
            value={valueCefr}
            items={cefr}
            setOpen={setOpenCefr}
            setValue={setValueCefr}
            setItems={setCefr}
            containerStyle={styles.dropDownContainerStyle}
            style={{ borderWidth: 0.2 }}
          />
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            containerStyle={styles.dropDownContainerStyle}
            style={{ borderWidth: 0.2 }}
          />
        </View>
      </View>
      <FlatList
        data={words}
        keyExtractor={(item) => item.term}
        renderItem={({ item }) => (
          <WordListRender
            item={item}
            fetchData={fetchWordsData}
            setLoading={setLoading}
            loading={loading}
            status={value}
            level={valueCefr}
          />
        )}
        onEndReached={loadMoreWords}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={listEmptyComponent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
  },
  header: {
    flexDirection: "column",
    zIndex: 999,
  },
  searchBarContainer: {},
  dropDownContainerStyle: {
    width: 120,
    height: 40,
    marginRight: 10,
    marginBottom: 10,
    borderColor: "#646cff",
  },
  text: {
    color: "rgb(229, 229, 231)",
  },
  textCount: {
    color: "rgb(39, 39, 41)",
    fontSize: 17,
    textAlign: "center",
    borderColor: "rgb(200, 200, 200)",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    alignSelf: "center",
  },
  floatingButtonText: {
    color: "white",
    fontSize: 30,
  },
  listEmptyText: {
    color: "rgb(39, 39, 41)",
    fontSize: 20,
    textAlign: "center",
  },
});
