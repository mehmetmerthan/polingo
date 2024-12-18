/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      email
      words {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        email
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getWord = /* GraphQL */ `
  query GetWord($id: ID!) {
    getWord(id: $id) {
      id
      word
      translation
      isLearned
      type
      createdAt
      updatedAt
      userWordsId
      __typename
    }
  }
`;
export const listWords = /* GraphQL */ `
  query ListWords(
    $filter: ModelWordFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listWords(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        word
        translation
        isLearned
        type
        createdAt
        updatedAt
        userWordsId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getAIScenario = /* GraphQL */ `
  query GetAIScenario($id: ID!) {
    getAIScenario(id: $id) {
      id
      title
      description
      firstMessage
      role
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listAIScenarios = /* GraphQL */ `
  query ListAIScenarios(
    $filter: ModelAIScenarioFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAIScenarios(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        description
        firstMessage
        role
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getWebsite = /* GraphQL */ `
  query GetWebsite($id: ID!) {
    getWebsite(id: $id) {
      id
      title
      url
      description
      image
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listWebsites = /* GraphQL */ `
  query ListWebsites(
    $filter: ModelWebsiteFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listWebsites(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        url
        description
        image
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getYoutube = /* GraphQL */ `
  query GetYoutube($id: ID!) {
    getYoutube(id: $id) {
      id
      title
      url
      description
      image
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listYoutubes = /* GraphQL */ `
  query ListYoutubes(
    $filter: ModelYoutubeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listYoutubes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        url
        description
        image
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const wordByDate = /* GraphQL */ `
  query WordByDate(
    $type: String!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelWordFilterInput
    $limit: Int
    $nextToken: String
  ) {
    wordByDate(
      type: $type
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        word
        translation
        isLearned
        type
        createdAt
        updatedAt
        userWordsId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
