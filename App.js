import RootRouter from "./src/routers/RootRouter";
import { GestureHandlerRootView } from "react-native-gesture-handler";
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootRouter />
    </GestureHandlerRootView>
  );
}
