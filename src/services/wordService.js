import { wordByDate, listWords } from "../graphql/queries";
import { deleteWord, createWord, updateWord } from "../graphql/mutations";
import { generateClient } from "aws-amplify/api";
import { getUserId } from "./userService";
const client = generateClient();
let userId;
const initializeUserId = async () => {
  if (!userId) {
    userId = await getUserId();
  }
};
export const fetchWords = async () => {
  await initializeUserId();
  try {
    const variables = {
      type: "word",
      sortDirection: "DESC",
      filter: {
        userWordsId: { eq: userId },
      },
    };
    const { data } = await client.graphql({ query: wordByDate, variables });
    const allWords = data.wordByDate.items;
    const learningWords = allWords.filter((word) => word.isLearned === false);
    const learnedWords = allWords.filter((word) => word.isLearned === true);
    return {
      allWords,
      learningWords,
      learnedWords,
    };
  } catch (error) {
    console.error("Error fetching words", error);
  }
};

export const addWord = async (params) => {
  await initializeUserId();
  const { newWord, newWordTranslation, setErrorMessage } = params;
  const word = newWord.toLowerCase();
  const translation = newWordTranslation.toLowerCase();
  const wordDetails = {
    userWordsId: userId,
    isLearned: false,
    word: word,
    translation: translation,
    type: "word",
  };
  const checkWord = await searchWord({ searchWord: word });
  if (checkWord.length > 0) {
    return;
  }
  try {
    const { data } = await client.graphql({
      query: createWord,
      variables: { input: wordDetails },
    });
    const result = data.createWord;
    return result;
  } catch (error) {
    setErrorMessage("Error adding the word.");
    console.error("Error adding the word", error);
  }
};

export const removeWord = async (wordId) => {
  try {
    const { data } = await client.graphql({
      query: deleteWord,
      variables: { input: { id: wordId } },
    });
    const result = data.deleteWord;
    return result;
  } catch (error) {
    console.error("Error deleting the word", error);
  }
};

export const changeWord = async (params) => {
  const { wordId, isLearned } = params;
  try {
    const { data } = await client.graphql({
      query: updateWord,
      variables: { input: { id: wordId, isLearned: isLearned } },
    });
    const result = data.updateWord;
    return result;
  } catch (error) {
    console.error("Error changing the word", error);
  }
};

export const searchWord = async (params) => {
  await initializeUserId();
  const { searchWord } = params;
  const word = searchWord.toLowerCase();
  try {
    const variables = {
      filter: {
        userWordsId: { eq: userId },
        word: { eq: word },
      },
    };
    const { data } = await client.graphql({ query: listWords, variables });
    const allWords = data.listWords.items;
    return allWords;
  } catch (error) {
    console.error("Error searching the word", error);
  }
};
