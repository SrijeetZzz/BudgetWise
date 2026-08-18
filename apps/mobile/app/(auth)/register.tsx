
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";

import { router } from "expo-router";



import { useTheme } from "../../providers/ThemeProvider";
import RegisterForm, { RegistrationData } from "../../features/auth/components/RegisterForm";

export default function RegisterScreen() {
  const { theme } = useTheme();

  /* =======================================================
     GOOGLE REGISTER
  ======================================================= */

  const handleGoogleRegister = () => {
    console.log(
      "GOOGLE REGISTER → INITIATED",
    );

    // Google OAuth flow will be implemented here.
  };

  /* =======================================================
     EMAIL REGISTER CONTINUE
  ======================================================= */

  const handleContinue = (
    data: RegistrationData,
  ) => {
    router.push({
      pathname:
        "/(auth)/register-otp",

      params: {
        displayName:
          data.displayName,

        email:
          data.email,

        phone:
          data.phone,

        password:
          data.password,

        confirmPassword:
          data.confirmPassword,
      },
    });
  };

  /* =======================================================
     LOGIN
  ======================================================= */

  const handleLogin = () => {
    router.replace(
      "/(auth)/login",
    );
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.screen,
        {
          backgroundColor:
            theme.background,
        },
      ]}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={
          styles.scrollContent
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={
          false
        }
      >
        <RegisterForm
          onGoogleRegister={
            handleGoogleRegister
          }
          onContinue={
            handleContinue
          }
          onLogin={
            handleLogin
          }
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles =
  StyleSheet.create({
    screen: {
      flex: 1,
    },

    scrollContent: {
      flexGrow: 1,

      justifyContent: "center",

      paddingHorizontal: 20,

      paddingVertical: 36,
    },
  });