import { StyleSheet, View } from "react-native";

import AppHeader from "../../features/app/components/AppHeader";
import SettingsForm from "../../features/profile/components/SettingsForm";
import { useTheme } from "../../providers/ThemeProvider";



export default function SettingsPage() {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
        },
      ]}
    >
      <AppHeader />

      <View style={styles.content}>
        <SettingsForm />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
  },
});