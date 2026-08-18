import { Stack } from "expo-router";
import QuizScreen from "../components/QuizScreen";

const HomePage = () => {
  return (
    <>
      {/* Remove o cabeçalho padrão do Expo Router */}
      <Stack.Screen options={{ headerShown: false }} />
      <QuizScreen />
    </>
  );
};

export default HomePage;
