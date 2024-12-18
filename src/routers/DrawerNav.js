import { createDrawerNavigator } from "@react-navigation/drawer";
import Dictionary from "../screens/Dictionary";
import Settings from "../screens/Settings";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import WebStack from "./WebStack";

const Drawer = createDrawerNavigator();

export default function DrawerNav() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="Dictionary"
        component={Dictionary}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="book" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="WebStack"
        component={WebStack}
        options={{
          title: "Web Sources",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="web" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
