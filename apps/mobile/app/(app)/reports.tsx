import {
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function ReportsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Reports
      </Text>

      <Text style={styles.subtitle}>
        Reports will be added later
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F7F7",
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111111",
  },

  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: "#737373",
  },
});