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
import { fetchWords } from "../services/wordService";
import { FloatingAction } from "react-native-floating-action";
import { AddWordForm } from "../components/AddWordForm";
export default function Dictionary() {
  const pageSize = 20;
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("learning");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [wordList, setWordList] = useState([]);
  const [words, setWords] = useState([]);
  const [allWords, setAllWords] = useState([]);
  const [wordCount, setWordCount] = useState(0);
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([
    { label: "Learning", value: "learning" },
    { label: "Learned", value: "learned" },
  ]);
  const [refreshing, setRefreshing] = useState(false);
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const updateSearch = (search) => {
    setSearch(search);
    if (search === "") {
      setWords(wordList.slice(0, pageSize));
      return;
    }
    const filteredWords = allWords.filter((word) => {
      return (
        word.word.toLowerCase().includes(search.toLowerCase()) ||
        word.translation.toLowerCase().includes(search.toLowerCase())
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
    if (value === "learning") {
      const { learningWords, allWords } = await fetchWords();
      setAllWords(allWords);
      setWordList(learningWords);
      const newWords = learningWords.slice(0, pageSize);
      const newWordCount = learningWords.length;
      setWordCount(newWordCount);
      setWords(newWords);
    } else if (value === "learned") {
      const { learnedWords, allWords } = await fetchWords();
      setAllWords(allWords);
      setWordList(learnedWords);
      console.log("learnedWords", learnedWords);
      const newWords = learnedWords.slice(0, pageSize);
      const newWordCount = learnedWords.length;
      setWordCount(newWordCount);
      setWords(newWords);
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
  }, [value]);
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
          containerStyle={styles.searchBarContainer}
          onChangeText={updateSearch}
          value={search}
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
          />
        </View>
      </View>
      <FlatList
        data={words}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <WordListRender
            item={item}
            fetchData={fetchWordsData}
            setLoading={setLoading}
            loading={loading}
          />
        )}
        style={styles.listItemContainer}
        onEndReached={loadMoreWords}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={listEmptyComponent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      {isAddFormVisible ? (
        <AddWordForm
          setIsAddFormVisible={setIsAddFormVisible}
          allWords={allWords}
          setLoadingState={setLoading}
          fetchData={fetchWordsData}
        />
      ) : (
        <FloatingAction
          position="right"
          onPressMain={() => setIsAddFormVisible(true)}
          floatingIcon={<Text style={styles.floatingButtonText}>+</Text>}
          color="#4CAF50"
          buttonSize={70}
        />
      )}
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
  searchBarContainer: {
    borderRadius: 8,
  },
  listItemContainer: {
    borderColor: "rgb(39, 39, 41)",
    borderWidth: 1,
    padding: 18,
    borderRadius: 8,
    backgroundColor: "#393e42",
  },
  dropDownStyle: {
    backgroundColor: "#393e42",
  },
  dropDownContainerStyle: {
    width: 120,
    height: 40,
    marginRight: 10,
    marginBottom: 10,
  },
  text: {
    color: "rgb(229, 229, 231)",
  },
  textCount: {
    color: "rgb(229, 229, 231)",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    borderColor: "rgb(39, 39, 41)",
    backgroundColor: "#393e42",
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
    color: "rgb(229, 229, 231)",
    fontSize: 20,
    textAlign: "center",
  },
});
