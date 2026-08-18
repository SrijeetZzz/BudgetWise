

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";

import { router } from "expo-router";

import { useTheme } from "../../providers/ThemeProvider";
import LoginForm from "../../features/auth/components/LoginForm";

export default function LoginScreen() {
  const { theme } = useTheme();

  /*
   * =======================================================
   * FORGOT PASSWORD
   * =======================================================
   */

  const handleForgotPassword = () => {
    router.push(
      "/(auth)/forgot-password",
    );
  };

  /*
   * =======================================================
   * REGISTER
   * =======================================================
   */

  const handleRegister = () => {
    router.push(
      "/(auth)/register",
    );
  };

  /*
   * =======================================================
   * LOGIN SUCCESS
   * =======================================================
   *
   * Used by both:
   *
   * - Email/password login
   * - Google login
   *
   * Authentication state has already been
   * updated before this callback is called.
   */

  const handleLoginSuccess = () => {
    console.log(
      "LOGIN SCREEN → LOGIN SUCCESS",
    );

    console.log(
      "LOGIN SCREEN → NAVIGATING TO DASHBOARD",
    );

    router.replace(
      "/(app)",
    );
  };

  /*
   * =======================================================
   * UI
   * =======================================================
   */

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
        <LoginForm
          onForgotPassword={
            handleForgotPassword
          }
          onRegister={
            handleRegister
          }
          onLoginSuccess={
            handleLoginSuccess
          }
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles =
  StyleSheet.create({
    screen: {
      flex: 1,
    },

    scrollContent: {
      flexGrow: 1,

      justifyContent: "center",

      paddingHorizontal: 20,

      paddingVertical: 40,
    },
  });