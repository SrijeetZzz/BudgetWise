import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AppHeader from "../../features/app/components/AppHeader";
import ProfileForm from "../../features/profile/components/ProfileForm";
import { useTheme } from "../../providers/ThemeProvider";


export default function ProfilePage() {
  const insets = useSafeAreaInsets();

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

      <View
        style={[
          styles.content,
          {
            paddingBottom: insets.bottom + 100,
          },
        ]}
      >
        <ProfileForm />
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