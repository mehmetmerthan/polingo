// import { wordByDate, listWords } from "../graphql/queries";
// import { deleteWord, createWord, updateWord } from "../graphql/mutations";
// import { generateClient } from "aws-amplify/api";
// import { getUserId } from "./userService";
// const client = generateClient();
// let userId;
// const initializeUserId = async () => {
//   if (!userId) {
//     userId = await getUserId();
//   }
// };
// export const fetchWords = async () => {
//   await initializeUserId();
//   try {
//     const variables = {
//       type: "word",
//       sortDirection: "DESC",
//       filter: {
//         userWordsId: { eq: userId },
//       },
//     };
//     const { data } = await client.graphql({ query: wordByDate, variables });
//     const allWords = data.wordByDate.items;
//     const learningWords = allWords.filter((word) => word.status === "TO_LEARN");
//     const learnedWords = allWords.filter(
//       (word) => word.status === "IN_PROGRESS"
//     );
//     return {
//       allWords,
//       learningWords,
//       learnedWords,
//     };
//   } catch (error) {
//     console.error("Error fetching words", error);
//   }
// };

// export const addWord = async (params) => {
//   await initializeUserId();
//   const { newTerm, newMeaning, newCefr, newStatus, setErrorMessage } = params;
//   const term = newTerm.toLowerCase();
//   const meaning = newMeaning.toLowerCase();
//   const wordDetails = {
//     userWordsId: userId,
//     term: term,
//     meaning: meaning,
//     type: "word",
//     cefr: newCefr,
//     status: newStatus,
//   };
//   const checkWord = await searchWord({ searchWord: term });
//   if (checkWord.length > 0) {
//     setErrorMessage("The word already exists");
//     return;
//   }
//   try {
//     const { data } = await client.graphql({
//       query: createWord,
//       variables: { input: wordDetails },
//     });
//   } catch (error) {
//     setErrorMessage("Error adding the word.");
//     console.error("Error adding the word", error);
//   }
// };

// export const removeWord = async (wordId) => {
//   try {
//     const { data } = await client.graphql({
//       query: deleteWord,
//       variables: { input: { id: wordId } },
//     });
//     const result = data.deleteWord;
//     return result;
//   } catch (error) {
//     console.error("Error deleting the word", error);
//   }
// };

// export const changeWordStatus = async (params) => {
//   const { wordId, status } = params;
//   try {
//     await client.graphql({
//       query: updateWord,
//       variables: { input: { id: wordId, status: status } },
//     });
//   } catch (error) {
//     console.error("Error changing the word", error);
//   }
// };

// export const searchWord = async (params) => {
//   await initializeUserId();
//   const { searchWord } = params;
//   const term = searchWord.toLowerCase();
//   try {
//     const variables = {
//       filter: {
//         userWordsId: { eq: userId },
//         term: { eq: term },
//       },
//     };
//     console.log("variables", variables);
//     const { data } = await client.graphql({ query: listWords, variables });
//     const allWords = data.listWords.items;
//     console.log("allWords", allWords);
//     return allWords;
//   } catch (error) {
//     console.error("Error searching the word", error);
//   }
// };
