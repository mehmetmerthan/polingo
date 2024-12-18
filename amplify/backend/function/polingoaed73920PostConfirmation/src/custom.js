const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event, context) => {
  const userAttributes = event.request.userAttributes;
  const userId = userAttributes.sub;
  if (!userId) {
    console.log("No user id found in event", event);
    return event;
  }
  const params = {
    TableName: "User-mfv4ibgaoffpxohe65f4e4cfia-staging",
    Item: {
      id: userId,
      email: userAttributes.email,
      createdAt: new Date().toISOString(),
    },
  };
  try {
    await dynamoDB.put(params).promise();
  } catch (error) {
    console.log("Error adding user to DynamoDB", error);
  }
  return event;
};
