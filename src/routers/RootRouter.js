import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import BottomTab from "./BottomTab";
export default function RootRouter() {
  return (
    <NavigationContainer>
      <BottomTab />
    </NavigationContainer>
  );
}
