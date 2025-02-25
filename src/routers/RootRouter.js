import React from "react";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import {
  Authenticator,
  defaultDarkModeOverride,
  ThemeProvider,
} from "@aws-amplify/ui-react-native";
import { Amplify } from "aws-amplify";
import config from "../amplifyconfiguration.json";
import BottomTab from "./BottomTab";
Amplify.configure(config);
const theme = {
  overrides: [defaultDarkModeOverride],
};
export default function RootRouter() {
  return (
    <ThemeProvider theme={theme}>
      <Authenticator.Provider>
        <Authenticator>
          <NavigationContainer>
            <BottomTab />
          </NavigationContainer>
        </Authenticator>
      </Authenticator.Provider>
    </ThemeProvider>
  );
}
