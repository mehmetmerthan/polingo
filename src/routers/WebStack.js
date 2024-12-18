import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import WebsiteList from "../screens/Web/WebsiteList";
import WebsiteWebView from "../screens/Web/WebsiteWebView";

const Stack = createNativeStackNavigator();

export default function WebStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="WebsiteList"
        component={WebsiteList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WebsiteWebView"
        component={WebsiteWebView}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
