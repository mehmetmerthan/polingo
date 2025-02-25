import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Dictionary from "../screens/Dictionary";
import Settings from "../screens/Settings";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Words from "../screens/Words";
import Practice from "../screens/Practice";
import Feather from "@expo/vector-icons/Feather";
const Tab = createBottomTabNavigator();

export default function BottomTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#646cff",
      }}
    >
      <Tab.Screen
        name="Words"
        component={Words}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Dictionary"
        component={Dictionary}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="bars" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Practice"
        component={Practice}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="message1" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
