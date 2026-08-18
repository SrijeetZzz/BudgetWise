
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

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  ShieldCheck,
  XCircle,
} from "lucide-react-native";

import { useResetPassword } from "../../features/auth/hooks/use-reset-password";
import { useTheme } from "../../providers/ThemeProvider";


export default function ResetPasswordScreen() {
  const { theme } = useTheme();

  const params =
    useLocalSearchParams<{
      email?: string;
    }>();

  const email =
    params.email ?? "";

  const [otp, setOtp] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [focusedInput, setFocusedInput] =
    useState<
      | "otp"
      | "newPassword"
      | "confirmPassword"
      | null
    >(null);

  const resetPasswordMutation =
    useResetPassword();

  // =========================================================
  // RESET PASSWORD
  // =========================================================

  const handleResetPassword = () => {
    if (
      !email ||
      !otp ||
      !newPassword
    ) {
      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      return;
    }

    resetPasswordMutation.mutate(
      {
        email,
        otp,
        newPassword,
      },
      {
        onSuccess: () => {
          router.replace(
            "/(auth)/login",
          );
        },
      },
    );
  };

  // =========================================================
  // PASSWORD VALIDATION
  // =========================================================

  const passwordMismatch =
    confirmPassword.length > 0 &&
    newPassword !==
      confirmPassword;

  const passwordMatch =
    confirmPassword.length > 0 &&
    newPassword ===
      confirmPassword;

  const isFormValid =
    otp.length === 6 &&
    newPassword.length >= 8 &&
    confirmPassword.length > 0 &&
    !passwordMismatch;

  // =========================================================
  // HELPERS
  // =========================================================

  const getInputStyle = (
    field:
      | "otp"
      | "newPassword"
      | "confirmPassword",
  ) => [
    styles.inputWrapper,

    {
      borderColor:
        theme.border,

      backgroundColor:
        theme.surfaceSecondary,
    },

    focusedInput === field && {
      borderColor:
        theme.primary,

      backgroundColor:
        theme.surface,
    },

    field ===
      "confirmPassword" &&
      passwordMismatch && {
        borderColor:
          theme.destructive,

        backgroundColor:
          theme.surface,
      },
  ];

  const getInputIconColor = (
    field:
      | "otp"
      | "newPassword"
      | "confirmPassword",
  ) =>
    focusedInput === field
      ? theme.primary
      : theme.textSecondary;

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
              BACK NAVIGATION
          ================================================= */}

          <TouchableOpacity
            style={
              styles.backButton
            }
            onPress={() =>
              router.replace(
                "/(auth)/forgot-password",
              )
            }
            disabled={
              resetPasswordMutation.isPending
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
              Back
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
                styles.iconCircle,
                {
                  backgroundColor:
                    theme.surfaceSecondary,

                  borderColor:
                    theme.border,
                },
              ]}
            >
              <ShieldCheck
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
              Reset password
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
              Enter the 6-digit
              verification code sent
              to
            </Text>

            <View
              style={[
                styles.emailBadge,
                {
                  backgroundColor:
                    theme.surfaceSecondary,

                  borderColor:
                    theme.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.emailText,
                  {
                    color:
                      theme.text,
                  },
                ]}
                numberOfLines={1}
              >
                {email ||
                  "your registered email"}
              </Text>
            </View>
          </View>

          {/* =================================================
              OTP
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
              Verification Code
            </Text>

            <View
              style={getInputStyle(
                "otp",
              )}
            >
              <KeyRound
                size={18}
                color={getInputIconColor(
                  "otp",
                )}
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
                placeholder="6-digit OTP"
                placeholderTextColor={
                  theme.textSecondary
                }
                value={otp}
                onFocus={() =>
                  setFocusedInput(
                    "otp",
                  )
                }
                onBlur={() =>
                  setFocusedInput(
                    null,
                  )
                }
                onChangeText={(value) =>
                  setOtp(
                    value
                      .replace(
                        /\D/g,
                        "",
                      )
                      .slice(0, 6),
                  )
                }
                keyboardType="number-pad"
                maxLength={6}
                autoComplete="one-time-code"
              />
            </View>
          </View>

          {/* =================================================
              NEW PASSWORD
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
              New Password
            </Text>

            <View
              style={getInputStyle(
                "newPassword",
              )}
            >
              <Lock
                size={18}
                color={getInputIconColor(
                  "newPassword",
                )}
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
                placeholder="••••••••"
                placeholderTextColor={
                  theme.textSecondary
                }
                value={newPassword}
                onFocus={() =>
                  setFocusedInput(
                    "newPassword",
                  )
                }
                onBlur={() =>
                  setFocusedInput(
                    null,
                  )
                }
                onChangeText={
                  setNewPassword
                }
                secureTextEntry={
                  !showPassword
                }
                autoCapitalize="none"
                autoComplete="new-password"
              />

              <TouchableOpacity
                onPress={() =>
                  setShowPassword(
                    (prev) => !prev,
                  )
                }
                hitSlop={{
                  top: 10,
                  bottom: 10,
                  left: 10,
                  right: 10,
                }}
              >
                {showPassword ? (
                  <EyeOff
                    size={18}
                    color={
                      theme.textSecondary
                    }
                  />
                ) : (
                  <Eye
                    size={18}
                    color={
                      theme.textSecondary
                    }
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* =================================================
              CONFIRM PASSWORD
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
              Confirm New Password
            </Text>

            <View
              style={getInputStyle(
                "confirmPassword",
              )}
            >
              <Lock
                size={18}
                color={getInputIconColor(
                  "confirmPassword",
                )}
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
                placeholder="••••••••"
                placeholderTextColor={
                  theme.textSecondary
                }
                value={confirmPassword}
                onFocus={() =>
                  setFocusedInput(
                    "confirmPassword",
                  )
                }
                onBlur={() =>
                  setFocusedInput(
                    null,
                  )
                }
                onChangeText={
                  setConfirmPassword
                }
                secureTextEntry={
                  !showConfirmPassword
                }
                autoCapitalize="none"
                autoComplete="new-password"
              />

              <TouchableOpacity
                onPress={() =>
                  setShowConfirmPassword(
                    (prev) => !prev,
                  )
                }
                hitSlop={{
                  top: 10,
                  bottom: 10,
                  left: 10,
                  right: 10,
                }}
              >
                {showConfirmPassword ? (
                  <EyeOff
                    size={18}
                    color={
                      theme.textSecondary
                    }
                  />
                ) : (
                  <Eye
                    size={18}
                    color={
                      theme.textSecondary
                    }
                  />
                )}
              </TouchableOpacity>
            </View>

            {/* VALIDATION */}

            {passwordMismatch && (
              <View
                style={
                  styles.validationRow
                }
              >
                <XCircle
                  size={14}
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
                  Passwords do not
                  match.
                </Text>
              </View>
            )}

            {passwordMatch && (
              <View
                style={
                  styles.validationRow
                }
              >
                <CheckCircle2
                  size={14}
                  color="#16A34A"
                />

                <Text
                  style={[
                    styles.successText,
                    {
                      color:
                        "#16A34A",
                    },
                  ]}
                >
                  Passwords match.
                </Text>
              </View>
            )}
          </View>

          {/* =================================================
              API ERROR
          ================================================= */}

          {resetPasswordMutation.isError && (
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
                  styles.errorBannerText,
                  {
                    color:
                      theme.destructive,
                  },
                ]}
              >
                Unable to reset password.
                Please check your
                verification code and
                try again.
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
              (resetPasswordMutation.isPending ||
                !isFormValid) &&
                styles.buttonDisabled,
            ]}
            onPress={
              handleResetPassword
            }
            disabled={
              resetPasswordMutation.isPending ||
              !isFormValid
            }
            activeOpacity={0.9}
          >
            {resetPasswordMutation.isPending ? (
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
                  Reset Password
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
                resetPasswordMutation.isPending
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

    iconCircle: {
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
      marginTop: 6,

      fontSize: 14,

      lineHeight: 20,

      textAlign: "center",
    },

    emailBadge: {
      marginTop: 8,

      paddingHorizontal: 12,
      paddingVertical: 4,

      borderRadius: 20,

      borderWidth: 1,
    },

    emailText: {
      fontSize: 13,

      fontWeight: "600",
    },

    fieldContainer: {
      marginBottom: 16,
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

    validationRow: {
      flexDirection: "row",

      alignItems: "center",

      marginTop: 6,
    },

    errorText: {
      marginLeft: 4,

      fontSize: 12,
    },

    successText: {
      marginLeft: 4,

      fontSize: 12,
    },

    errorContainer: {
      flexDirection: "row",

      alignItems: "center",

      borderRadius: 8,

      paddingVertical: 10,
      paddingHorizontal: 12,

      marginBottom: 16,
    },

    errorBannerText: {
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

      marginTop: 8,
    },

    buttonContent: {
      flexDirection: "row",

      alignItems: "center",
    },

    buttonDisabled: {
      opacity: 0.5,
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