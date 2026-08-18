import { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function ExercicioContador() {
  const [contador, setContador] = useState(0);

  const handleIncrementar = () => {
    setContador(contador + 1);
  };

  const handleDecrementar = () => {
    setContador(contador - 1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.counterText}>Contador: {contador}</Text>
      <Button title="Incrementar" onPress={handleIncrementar} />
      <Button title="Decrementar" onPress={handleDecrementar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  counterText: {
    fontSize: 24,
    marginBottom: 10,
  },
});
