
import { useState } from "react";

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  KeyRound,
  Mail,
} from "lucide-react-native";

import { useForgotPassword } from "../../features/auth/hooks/use-forgot-password";
import { useTheme } from "../../providers/ThemeProvider";


export default function ForgotPasswordScreen() {
  const { theme } = useTheme();

  const [email, setEmail] =
    useState("");

  const [focusedInput, setFocusedInput] =
    useState<"email" | null>(
      null,
    );

  const [clientError, setClientError] =
    useState("");

  const forgotPasswordMutation =
    useForgotPassword();

  // =========================================================
  // VALIDATION
  // =========================================================

  const validate = () => {
    const trimmed =
      email.trim();

    if (!trimmed) {
      setClientError(
        "Email address is required.",
      );

      return false;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        trimmed,
      )
    ) {
      setClientError(
        "Please enter a valid email address.",
      );

      return false;
    }

    setClientError("");

    return true;
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    const trimmedEmail =
      email.trim();

    forgotPasswordMutation.mutate(
      {
        email: trimmedEmail,
      },
      {
        onSuccess: () => {
          router.push({
            pathname:
              "/(auth)/reset-password",

            params: {
              email: trimmedEmail,
            },
          });
        },
      },
    );
  };

  // =========================================================
  // HELPERS
  // =========================================================

  const hasError =
    forgotPasswordMutation.isError ||
    !!clientError;

  const inputWrapperStyle = [
    styles.inputWrapper,

    {
      borderColor:
        theme.border,

      backgroundColor:
        theme.surfaceSecondary,
    },

    focusedInput ===
      "email" && {
      borderColor:
        theme.primary,

      backgroundColor:
        theme.surface,
    },

    hasError && {
      borderColor:
        theme.destructive,

      backgroundColor:
        theme.surface,
    },
  ];

  // =========================================================
  // UI
  // =========================================================

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
        <View
          style={[
            styles.card,
            {
              backgroundColor:
                theme.surface,

              borderColor:
                theme.border,
            },
          ]}
        >
          {/* =================================================
              BACK
          ================================================= */}

          <TouchableOpacity
            style={
              styles.backButton
            }
            onPress={() =>
              router.replace(
                "/(auth)/login",
              )
            }
            disabled={
              forgotPasswordMutation.isPending
            }
            activeOpacity={0.7}
          >
            <ArrowLeft
              size={16}
              color={
                theme.textSecondary
              }
            />

            <Text
              style={[
                styles.backText,
                {
                  color:
                    theme.textSecondary,
                },
              ]}
            >
              Back to login
            </Text>
          </TouchableOpacity>

          {/* =================================================
              HEADER
          ================================================= */}

          <View
            style={styles.header}
          >
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor:
                    theme.surfaceSecondary,

                  borderColor:
                    theme.border,
                },
              ]}
            >
              <KeyRound
                size={22}
                color={
                  theme.text
                }
              />
            </View>

            <Text
              style={[
                styles.brandTitle,
                {
                  color:
                    theme.textSecondary,
                },
              ]}
            >
              BUDGETWISE
            </Text>

            <Text
              style={[
                styles.title,
                {
                  color:
                    theme.text,
                },
              ]}
            >
              Forgot password?
            </Text>

            <Text
              style={[
                styles.subtitle,
                {
                  color:
                    theme.textSecondary,
                },
              ]}
            >
              No worries! Enter your
              registered email address
              and we'll send you a
              verification code to reset
              it.
            </Text>
          </View>

          {/* =================================================
              EMAIL
          ================================================= */}

          <View
            style={
              styles.fieldContainer
            }
          >
            <Text
              style={[
                styles.label,
                {
                  color:
                    theme.text,
                },
              ]}
            >
              Email Address
            </Text>

            <View
              style={inputWrapperStyle}
            >
              <Mail
                size={18}
                color={
                  focusedInput ===
                  "email"
                    ? theme.primary
                    : theme.textSecondary
                }
                style={
                  styles.inputIcon
                }
              />

              <TextInput
                style={[
                  styles.input,
                  {
                    color:
                      theme.text,
                  },
                ]}
                placeholder="name@company.com"
                placeholderTextColor={
                  theme.textSecondary
                }
                value={email}
                onChangeText={(value) => {
                  setEmail(value);

                  if (
                    clientError
                  ) {
                    setClientError(
                      "",
                    );
                  }
                }}
                onFocus={() =>
                  setFocusedInput(
                    "email",
                  )
                }
                onBlur={() =>
                  setFocusedInput(
                    null,
                  )
                }
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                autoComplete="email"
                editable={
                  !forgotPasswordMutation.isPending
                }
              />
            </View>

            {clientError ? (
              <Text
                style={[
                  styles.fieldErrorText,
                  {
                    color:
                      theme.destructive,
                  },
                ]}
              >
                {clientError}
              </Text>
            ) : null}
          </View>

          {/* =================================================
              API ERROR
          ================================================= */}

          {forgotPasswordMutation.isError && (
            <View
              style={[
                styles.errorContainer,
                {
                  backgroundColor:
                    theme.surface,
                },
              ]}
            >
              <AlertCircle
                size={16}
                color={
                  theme.destructive
                }
              />

              <Text
                style={[
                  styles.errorText,
                  {
                    color:
                      theme.destructive,
                  },
                ]}
              >
                Unable to send
                verification code. Please
                check your email and try
                again.
              </Text>
            </View>
          )}

          {/* =================================================
              SUBMIT
          ================================================= */}

          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  theme.primary,
              },

              forgotPasswordMutation.isPending &&
                styles.disabledButton,
            ]}
            onPress={
              handleSubmit
            }
            disabled={
              forgotPasswordMutation.isPending
            }
            activeOpacity={0.9}
          >
            {forgotPasswordMutation.isPending ? (
              <ActivityIndicator
                color={
                  theme.primaryText
                }
                size="small"
              />
            ) : (
              <View
                style={
                  styles.buttonContent
                }
              >
                <Text
                  style={[
                    styles.buttonText,
                    {
                      color:
                        theme.primaryText,
                    },
                  ]}
                >
                  Send Code
                </Text>

                <ArrowRight
                  size={16}
                  color={
                    theme.primaryText
                  }
                  style={{
                    marginLeft: 6,
                  }}
                />
              </View>
            )}
          </TouchableOpacity>

          {/* =================================================
              FOOTER
          ================================================= */}

          <View
            style={
              styles.loginContainer
            }
          >
            <Text
              style={[
                styles.loginText,
                {
                  color:
                    theme.textSecondary,
                },
              ]}
            >
              Remember your password?
            </Text>

            <TouchableOpacity
              onPress={() =>
                router.replace(
                  "/(auth)/login",
                )
              }
              disabled={
                forgotPasswordMutation.isPending
              }
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.loginLink,
                  {
                    color:
                      theme.primary,
                  },
                ]}
              >
                Sign in
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// =========================================================
// STYLES
// =========================================================

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

    card: {
      width: "100%",

      maxWidth: 440,

      alignSelf: "center",

      borderRadius: 16,

      borderWidth: 1,

      paddingHorizontal: 24,
      paddingVertical: 32,

      shadowColor: "#000000",

      shadowOffset: {
        width: 0,
        height: 8,
      },

      shadowOpacity: 0.04,

      shadowRadius: 16,

      elevation: 2,
    },

    backButton: {
      flexDirection: "row",

      alignItems: "center",

      alignSelf: "flex-start",

      marginBottom: 20,
    },

    backText: {
      marginLeft: 6,

      fontSize: 13,

      fontWeight: "500",
    },

    header: {
      alignItems: "center",

      marginBottom: 28,
    },

    iconContainer: {
      width: 48,
      height: 48,

      borderRadius: 24,

      borderWidth: 1,

      alignItems: "center",

      justifyContent: "center",

      marginBottom: 16,
    },

    brandTitle: {
      fontSize: 12,

      fontWeight: "800",

      letterSpacing: 3,

      textTransform: "uppercase",

      marginBottom: 8,
    },

    title: {
      fontSize: 24,

      fontWeight: "700",

      textAlign: "center",

      letterSpacing: -0.5,
    },

    subtitle: {
      marginTop: 8,

      fontSize: 14,

      lineHeight: 20,

      textAlign: "center",
    },

    fieldContainer: {
      marginBottom: 18,
    },

    label: {
      marginBottom: 6,

      fontSize: 13,

      fontWeight: "600",
    },

    inputWrapper: {
      height: 48,

      borderWidth: 1,

      borderRadius: 10,

      flexDirection: "row",

      alignItems: "center",

      paddingHorizontal: 14,
    },

    inputIcon: {
      marginRight: 10,
    },

    input: {
      flex: 1,

      height: "100%",

      fontSize: 14,
    },

    fieldErrorText: {
      marginTop: 5,

      fontSize: 12,
    },

    errorContainer: {
      flexDirection: "row",

      alignItems: "center",

      borderRadius: 8,

      paddingVertical: 10,

      paddingHorizontal: 12,

      marginBottom: 18,
    },

    errorText: {
      marginLeft: 8,

      fontSize: 13,

      fontWeight: "500",

      flex: 1,
    },

    button: {
      height: 48,

      borderRadius: 10,

      alignItems: "center",

      justifyContent: "center",
    },

    buttonContent: {
      flexDirection: "row",

      alignItems: "center",
    },

    disabledButton: {
      opacity: 0.7,
    },

    buttonText: {
      fontSize: 14,

      fontWeight: "600",
    },

    loginContainer: {
      flexDirection: "row",

      justifyContent: "center",

      alignItems: "center",

      marginTop: 24,
    },

    loginText: {
      fontSize: 14,
    },

    loginLink: {
      fontSize: 14,

      fontWeight: "600",

      marginLeft: 4,
    },
  });