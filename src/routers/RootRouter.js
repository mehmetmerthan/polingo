import React from "react";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import {
  Authenticator,
  defaultDarkModeOverride,
  ThemeProvider,
} from "@aws-amplify/ui-react-native";
import { Amplify } from "aws-amplify";
import config from "../amplifyconfiguration.json";
import DrawerNav from "./DrawerNav";
Amplify.configure(config);
const theme = {
  overrides: [defaultDarkModeOverride],
};
export default function RootRouter() {
  return (
    <ThemeProvider theme={theme} colorMode={"dark"}>
      <Authenticator.Provider>
        <Authenticator>
          <NavigationContainer theme={DarkTheme}>
            <DrawerNav />
          </NavigationContainer>
        </Authenticator>
      </Authenticator.Provider>
    </ThemeProvider>
  );
}
