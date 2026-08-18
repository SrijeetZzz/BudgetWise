
import { useEffect, useRef, useState } from "react";

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
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Mail,
  Phone,
} from "lucide-react-native";

import { router } from "expo-router";

import { useTheme } from "../../providers/ThemeProvider";

import { authApi } from "../../features/auth/api/auth.api";

import { getDeviceId } from "../../lib/device";

import { authToken } from "../../lib/auth";

import { useAuthStore } from "../../store/auth.store";

import { useThemeStore } from "../../store/theme.store";

import { useGoogleRegistrationStore } from "../../store/google-registration.store";

/* =========================================================
   COMPONENT
========================================================= */

export default function GoogleCompleteScreen() {
  const { theme } = useTheme();

  /*
   * =========================================================
   * GOOGLE REGISTRATION DATA
   * =========================================================
   */

  const googleRegistration = useGoogleRegistrationStore(
    (state) => state.googleRegistration,
  );

  const clearGoogleRegistration = useGoogleRegistrationStore(
    (state) => state.clearGoogleRegistration,
  );

  /*
   * =========================================================
   * AUTH
   * =========================================================
   */

  const login = useAuthStore((state) => state.login);

  const setTheme = useThemeStore((state) => state.setTheme);

  /*
   * =========================================================
   * FORM STATE
   * =========================================================
   */

  const [phone, setPhone] = useState("");

  const [otp, setOtp] = useState("");

  /*
   * =========================================================
   * OTP INPUT REF
   * =========================================================
   */

  const otpInputRef = useRef<TextInput>(null);

  /*
   * =========================================================
   * LOADING STATE
   * =========================================================
   */

  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const [isCompleting, setIsCompleting] = useState(false);

  /*
   * =========================================================
   * ERROR
   * =========================================================
   */

  const [error, setError] = useState<string | null>(null);

  /*
   * =========================================================
   * OTP REQUEST GUARD
   * =========================================================
   *
   * Prevents duplicate resend requests caused by:
   *
   * - Double taps
   * - Fast repeated presses
   * - Concurrent requests
   */

  const otpRequestInFlightRef = useRef(false);

  /*
   * =========================================================
   * COMPLETION GUARD
   * =========================================================
   *
   * This has two purposes:
   *
   * 1. Prevent duplicate googleComplete requests.
   *
   * 2. Tell the registration-data guard that the
   *    registration has successfully completed.
   *
   * IMPORTANT:
   *
   * This MUST be set to true BEFORE
   * clearGoogleRegistration().
   */

  const hasCompletedRef = useRef(false);

  /*
   * =========================================================
   * VALIDATE GOOGLE REGISTRATION
   * =========================================================
   *
   * If the user opens this screen without valid temporary
   * Google registration data, return to login.
   *
   * BUT:
   *
   * After successful registration we intentionally clear
   * googleRegistration.
   *
   * Therefore hasCompletedRef prevents this guard from
   * redirecting the newly authenticated user back to login.
   */

  useEffect(() => {
    if (!googleRegistration && !hasCompletedRef.current) {
      console.log(
        "GOOGLE COMPLETE → NO REGISTRATION DATA → RETURNING TO LOGIN",
      );

      router.replace("/(auth)/login");
    }
  }, [googleRegistration]);

  /*
   * =========================================================
   * RESEND OTP
   * =========================================================
   *
   * IMPORTANT:
   *
   * The INITIAL OTP is already sent by the backend
   * during:
   *
   * POST /auth/google
   *
   * Therefore this screen does NOT send an OTP when
   * it first opens.
   *
   * This function is ONLY called when the user explicitly
   * presses "Resend OTP".
   * =========================================================
   */

  const handleResendOtp = async () => {
    if (!googleRegistration) {
      console.log("GOOGLE COMPLETE → NO REGISTRATION DATA");

      return;
    }

    /*
     * Prevent duplicate concurrent requests.
     */

    if (otpRequestInFlightRef.current) {
      console.log("GOOGLE COMPLETE → OTP REQUEST ALREADY IN PROGRESS");

      return;
    }

    /*
     * Do not resend while registration is completing.
     */

    if (isCompleting) {
      return;
    }

    try {
      setError(null);

      /*
       * Lock immediately.
       */

      otpRequestInFlightRef.current = true;

      setIsSendingOtp(true);

      console.log("GOOGLE COMPLETE → RESENDING OTP");

      console.log("GOOGLE COMPLETE → OTP EMAIL:", googleRegistration.email);

      /*
       * Explicit resend only.
       */

      await authApi.sendOtp({
        email: googleRegistration.email,

        purpose: "GOOGLE_REGISTER",
      });

      console.log("GOOGLE COMPLETE → OTP RESENT");

      /*
       * Clear previous OTP because the backend
       * generated a new OTP.
       */

      setOtp("");

      /*
       * Focus OTP input.
       */

      setTimeout(() => {
        otpInputRef.current?.focus();
      }, 100);
    } catch (error: any) {
      console.log("GOOGLE COMPLETE → RESEND OTP FAILED:", error);

      console.log(
        "GOOGLE COMPLETE → RESEND OTP ERROR RESPONSE:",
        error?.response?.data,
      );

      setError(
        error?.response?.data?.message ??
          "Unable to resend OTP. Please try again.",
      );
    } finally {
      setIsSendingOtp(false);

      otpRequestInFlightRef.current = false;
    }
  };

  /*
   * =========================================================
   * OTP CHANGE
   * =========================================================
   */

  const handleOtpChange = (value: string) => {
    const cleanedOtp = value.replace(/\D/g, "").slice(0, 6);

    setOtp(cleanedOtp);

    setError(null);
  };

  /*
   * =========================================================
   * COMPLETE GOOGLE REGISTRATION
   * =========================================================
   *
   * Flow:
   *
   * Google ID Token
   *       +
   * Phone
   *       +
   * OTP
   *       ↓
   * POST /auth/google/complete
   *       ↓
   * Backend creates user
   *       ↓
   * accessToken + user
   *       ↓
   * Zustand authentication
   *       ↓
   * /(app)
   */

  const handleComplete = async () => {
    if (!googleRegistration) {
      console.log("GOOGLE COMPLETE → NO REGISTRATION DATA");

      return;
    }

    /*
     * Prevent duplicate completion requests.
     */

    if (hasCompletedRef.current) {
      console.log("GOOGLE COMPLETE → REQUEST ALREADY SUBMITTED");

      return;
    }

    /*
     * Do not complete while OTP resend is active.
     */

    if (isSendingOtp) {
      return;
    }

    /*
     * =====================================================
     * CLEAN INPUTS
     * =====================================================
     */

    const cleanedPhone = phone.replace(/\D/g, "");

    const cleanedOtp = otp.replace(/\D/g, "");

    /*
     * =====================================================
     * PHONE VALIDATION
     * =====================================================
     */

    if (cleanedPhone.length < 10) {
      setError("Please enter a valid phone number.");

      return;
    }

    /*
     * =====================================================
     * OTP VALIDATION
     * =====================================================
     */

    if (cleanedOtp.length !== 6) {
      setError("Please enter the 6-digit OTP.");

      return;
    }

    try {
      setError(null);

      /*
       * ===================================================
       * LOCK COMPLETION
       * ===================================================
       *
       * Lock BEFORE making the request so a double tap
       * cannot create two completion requests.
       */

      hasCompletedRef.current = true;

      setIsCompleting(true);

      console.log("GOOGLE COMPLETE → SUBMITTING");

      /*
       * ===================================================
       * DEVICE ID
       * ===================================================
       */

      const deviceId = await getDeviceId();

      console.log("GOOGLE COMPLETE → DEVICE ID EXISTS:", !!deviceId);

      /*
       * ===================================================
       * BACKEND
       * ===================================================
       */

      const response = await authApi.googleComplete({
        idToken: googleRegistration.idToken,

        phone: cleanedPhone,

        otp: cleanedOtp,

        deviceId,
      });

      console.log("GOOGLE COMPLETE → BACKEND SUCCESS");

      console.log("GOOGLE COMPLETE → RESPONSE:", response);

      /*
       * ===================================================
       * RESPONSE DATA
       * ===================================================
       */

      const { user, accessToken } = response.data;

      /*
       * ===================================================
       * STORE TOKEN
       * ===================================================
       */

      await authToken.set(accessToken);

      console.log("GOOGLE COMPLETE → TOKEN STORED");
      /*
       * =========================================================
       * GET CURRENT USER
       * =========================================================
       *
       * googleComplete returns the newly created account,
       * but /me is the canonical authenticated-user endpoint.
       *
       * This ensures we get the complete User object.
       */

      console.log("GOOGLE COMPLETE → CALLING /ME");

      const currentUser = await authApi.me();

      console.log("GOOGLE COMPLETE → /ME SUCCESS:", currentUser);

      /*
       * ===================================================
       * STORE AUTH STATE
       * ===================================================
       */

      login(currentUser, accessToken);

      console.log("GOOGLE COMPLETE → USER STORED");

      /*
       * Verify Zustand state.
       */

      const isAuthenticated = useAuthStore.getState().isAuthenticated;

      console.log("GOOGLE COMPLETE → AUTHENTICATED:", isAuthenticated);

      /*
       * ===================================================
       * APPLY THEME
       * ===================================================
       */

      if (
        user.theme === "LIGHT" ||
        user.theme === "DARK" ||
        user.theme === "SYSTEM"
      ) {
        setTheme(user.theme);

        console.log("GOOGLE COMPLETE → THEME APPLIED:", user.theme);
      } else {
        setTheme("SYSTEM");

        console.log("GOOGLE COMPLETE → INVALID/MISSING THEME → SYSTEM");
      }

      /*
       * ===================================================
       * MARK REGISTRATION AS COMPLETED
       * ===================================================
       *
       * THIS MUST HAPPEN BEFORE:
       *
       * clearGoogleRegistration()
       *
       * Otherwise the useEffect above sees:
       *
       * googleRegistration === null
       *
       * and sends the user back to login.
       */

      hasCompletedRef.current = true;

      console.log("GOOGLE COMPLETE → REGISTRATION MARKED COMPLETE");

      /*
       * ===================================================
       * CLEAR TEMPORARY GOOGLE DATA
       * ===================================================
       *
       * The Google ID token has now been consumed.
       */

      clearGoogleRegistration();

      console.log("GOOGLE COMPLETE → REGISTRATION DATA CLEARED");

      /*
       * ===================================================
       * NAVIGATE TO APP
       * ===================================================
       *
       * DO NOT navigate to login here.
       *
       * The user is already authenticated.
       */

      console.log("GOOGLE COMPLETE → NAVIGATING TO DASHBOARD");

      router.replace("/(app)");
    } catch (error: any) {
      console.log("GOOGLE COMPLETE → FAILED:", error);

      console.log("GOOGLE COMPLETE → ERROR STATUS:", error?.response?.status);

      console.log("GOOGLE COMPLETE → ERROR RESPONSE:", error?.response?.data);

      /*
       * The request failed, so allow the user to retry.
       */

      hasCompletedRef.current = false;

      setError(
        error?.response?.data?.message ??
          "Unable to complete registration. Check your phone number and OTP.",
      );
    } finally {
      setIsCompleting(false);
    }
  };

  /*
   * =========================================================
   * LOADING / GUARD
   * =========================================================
   */

  if (!googleRegistration) {
    return (
      <View
        style={[
          styles.loadingScreen,
          {
            backgroundColor: theme.background,
          },
        ]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <KeyboardAvoidingView
      style={[
        styles.screen,
        {
          backgroundColor: theme.background,
        },
      ]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.surface,

              borderColor: theme.border,
            },
          ]}
        >
          {/* =================================================
              BACK
          ================================================= */}

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (isCompleting || isSendingOtp) {
                return;
              }

              clearGoogleRegistration();

              router.replace("/(auth)/login");
            }}
            disabled={isCompleting || isSendingOtp}
            activeOpacity={0.7}
          >
            <ArrowLeft size={18} color={theme.textSecondary} />

            <Text
              style={[
                styles.backText,
                {
                  color: theme.textSecondary,
                },
              ]}
            >
              Back to login
            </Text>
          </TouchableOpacity>

          {/* =================================================
              HEADER
          ================================================= */}

          <View style={styles.header}>
            <Text
              style={[
                styles.brandTitle,
                {
                  color: theme.textSecondary,
                },
              ]}
            >
              BUDGETWISE
            </Text>

            <Text
              style={[
                styles.title,
                {
                  color: theme.text,
                },
              ]}
            >
              Complete your account
            </Text>

            <Text
              style={[
                styles.subtitle,
                {
                  color: theme.textSecondary,
                },
              ]}
            >
              One last step before you can start using BudgetWise.
            </Text>
          </View>

          {/* =================================================
              GOOGLE ACCOUNT
          ================================================= */}

          <View
            style={[
              styles.googleAccount,
              {
                backgroundColor: theme.surfaceSecondary,

                borderColor: theme.border,
              },
            ]}
          >
            <View style={styles.googleIconCircle}>
              <Text style={styles.googleG}>G</Text>
            </View>

            <View style={styles.accountInfo}>
              <Text
                style={[
                  styles.accountName,
                  {
                    color: theme.text,
                  },
                ]}
              >
                {googleRegistration.displayName}
              </Text>

              <View style={styles.emailRow}>
                <Mail size={14} color={theme.textSecondary} />

                <Text
                  style={[
                    styles.accountEmail,
                    {
                      color: theme.textSecondary,
                    },
                  ]}
                >
                  {googleRegistration.email}
                </Text>
              </View>
            </View>

            <CheckCircle2 size={20} color={theme.primary} />
          </View>

          {/* =================================================
              PHONE
          ================================================= */}

          <View style={styles.fieldContainer}>
            <Text
              style={[
                styles.label,
                {
                  color: theme.text,
                },
              ]}
            >
              Phone Number
            </Text>

            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: theme.surfaceSecondary,

                  borderColor: theme.border,
                },
              ]}
            >
              <Phone size={18} color={theme.textSecondary} />

              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.text,
                  },
                ]}
                placeholder="Enter phone number"
                placeholderTextColor={theme.textSecondary}
                value={phone}
                onChangeText={(value) => {
                  setPhone(value.replace(/\D/g, ""));

                  setError(null);
                }}
                keyboardType="phone-pad"
                maxLength={15}
                editable={!isSendingOtp && !isCompleting}
              />
            </View>
          </View>

          {/* =================================================
              OTP INFO
          ================================================= */}

          <View style={styles.otpSuccess}>
            <Mail size={16} color={theme.primary} />

            <Text
              style={[
                styles.otpSuccessText,
                {
                  color: theme.text,
                },
              ]}
            >
              A 6-digit verification code has been sent to{" "}
              {googleRegistration.email}
            </Text>
          </View>

          {/* =================================================
              OTP INPUT
          ================================================= */}

          <View style={styles.fieldContainer}>
            <Text
              style={[
                styles.label,
                {
                  color: theme.text,
                },
              ]}
            >
              Verification Code
            </Text>

            {/* ===============================================
                OTP BOXES
            =============================================== */}

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => otpInputRef.current?.focus()}
              style={styles.otpBoxesContainer}
            >
              {Array.from({
                length: 6,
              }).map((_, index) => {
                const digit = otp[index] ?? "";

                /*
                 * Highlight the box where the next
                 * digit will be entered.
                 */

                const isActive = index === otp.length && otp.length < 6;

                return (
                  <View
                    key={index}
                    style={[
                      styles.otpBox,
                      {
                        backgroundColor: theme.surfaceSecondary,

                        borderColor: isActive ? theme.primary : theme.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.otpDigit,
                        {
                          color: theme.text,
                        },
                      ]}
                    >
                      {digit || "-"}
                    </Text>
                  </View>
                );
              })}
            </TouchableOpacity>

            {/* ===============================================
                HIDDEN INPUT
            =============================================== */}

            <TextInput
              ref={otpInputRef}
              value={otp}
              onChangeText={handleOtpChange}
              keyboardType="number-pad"
              maxLength={6}
              autoComplete="sms-otp"
              textContentType="oneTimeCode"
              style={styles.hiddenOtpInput}
              editable={!isCompleting && !isSendingOtp}
              caretHidden
            />
          </View>

          {/* =================================================
              RESEND OTP
          ================================================= */}

          <TouchableOpacity
            style={styles.resendButton}
            onPress={handleResendOtp}
            disabled={isSendingOtp || isCompleting}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.resendText,
                {
                  color: theme.primary,
                },
              ]}
            >
              {isSendingOtp ? "Sending..." : "Resend OTP"}
            </Text>
          </TouchableOpacity>

          {/* =================================================
              COMPLETE
          ================================================= */}

          <TouchableOpacity
            style={[
              styles.primaryButton,
              {
                backgroundColor: theme.primary,
              },

              isCompleting && styles.disabledButton,
            ]}
            onPress={handleComplete}
            disabled={isCompleting || isSendingOtp}
            activeOpacity={0.9}
          >
            {isCompleting ? (
              <ActivityIndicator size="small" color={theme.primaryText} />
            ) : (
              <Text
                style={[
                  styles.primaryButtonText,
                  {
                    color: theme.primaryText,
                  },
                ]}
              >
                Complete Registration
              </Text>
            )}
          </TouchableOpacity>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <View
              style={[
                styles.errorContainer,
                {
                  backgroundColor: theme.background,

                  borderColor: theme.border,
                },
              ]}
            >
              <AlertCircle size={16} color={theme.destructive} />

              <Text
                style={[
                  styles.errorText,
                  {
                    color: theme.destructive,
                  },
                ]}
              >
                {error}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  /* =====================================================
       SCREEN
    ===================================================== */

  screen: {
    flex: 1,
  },

  loadingScreen: {
    flex: 1,

    alignItems: "center",

    justifyContent: "center",
  },

  scrollContent: {
    flexGrow: 1,

    justifyContent: "center",

    paddingHorizontal: 20,

    paddingVertical: 40,
  },

  card: {
    width: "100%",

    maxWidth: 440,

    alignSelf: "center",

    borderRadius: 16,

    borderWidth: 1,

    paddingHorizontal: 24,

    paddingVertical: 28,

    shadowColor: "#000000",

    shadowOffset: {
      width: 0,

      height: 8,
    },

    shadowOpacity: 0.04,

    shadowRadius: 16,

    elevation: 2,
  },

  /* =====================================================
       BACK
    ===================================================== */

  backButton: {
    flexDirection: "row",

    alignItems: "center",

    alignSelf: "flex-start",

    marginBottom: 24,
  },

  backText: {
    marginLeft: 6,

    fontSize: 13,

    fontWeight: "600",
  },

  /* =====================================================
       HEADER
    ===================================================== */

  header: {
    alignItems: "center",

    marginBottom: 24,
  },

  brandTitle: {
    fontSize: 12,

    fontWeight: "800",

    letterSpacing: 3,

    textTransform: "uppercase",

    marginBottom: 12,
  },

  title: {
    fontSize: 25,

    fontWeight: "700",

    textAlign: "center",

    letterSpacing: -0.5,
  },

  subtitle: {
    marginTop: 7,

    fontSize: 14,

    lineHeight: 20,

    textAlign: "center",
  },

  /* =====================================================
       GOOGLE ACCOUNT
    ===================================================== */

  googleAccount: {
    flexDirection: "row",

    alignItems: "center",

    borderWidth: 1,

    borderRadius: 12,

    padding: 12,

    marginBottom: 24,
  },

  googleIconCircle: {
    width: 40,

    height: 40,

    borderRadius: 20,

    alignItems: "center",

    justifyContent: "center",

    backgroundColor: "#FFFFFF",
  },

  googleG: {
    fontSize: 19,

    fontWeight: "700",

    color: "#4285F4",
  },

  accountInfo: {
    flex: 1,

    marginLeft: 11,
  },

  accountName: {
    fontSize: 13,

    fontWeight: "700",

    marginBottom: 3,
  },

  emailRow: {
    flexDirection: "row",

    alignItems: "center",
  },

  accountEmail: {
    flex: 1,

    marginLeft: 5,

    fontSize: 11,
  },

  /* =====================================================
       FORM
    ===================================================== */

  fieldContainer: {
    marginBottom: 14,
  },

  label: {
    marginBottom: 7,

    fontSize: 13,

    fontWeight: "600",
  },

  inputWrapper: {
    height: 48,

    flexDirection: "row",

    alignItems: "center",

    borderWidth: 1,

    borderRadius: 10,

    paddingHorizontal: 14,
  },

  input: {
    flex: 1,

    height: "100%",

    marginLeft: 10,

    fontSize: 14,
  },

  /* =====================================================
       OTP INFO
    ===================================================== */

  otpSuccess: {
    flexDirection: "row",

    alignItems: "center",

    marginBottom: 14,
  },

  otpSuccessText: {
    flex: 1,

    marginLeft: 7,

    fontSize: 12,

    lineHeight: 18,

    fontWeight: "500",
  },

  /* =====================================================
       OTP BOXES
    ===================================================== */

  otpBoxesContainer: {
    width: "100%",

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
  },

  otpBox: {
    width: 46,

    height: 52,

    borderWidth: 1,

    borderRadius: 10,

    alignItems: "center",

    justifyContent: "center",
  },

  otpDigit: {
    fontSize: 20,

    fontWeight: "700",

    textAlign: "center",
  },

  /*
   * Hidden TextInput.
   *
   * It receives the keyboard input while the
   * six visible boxes render the OTP.
   */

  hiddenOtpInput: {
    position: "absolute",

    width: 1,

    height: 1,

    opacity: 0,

    left: 0,

    top: 0,
  },

  /* =====================================================
       RESEND
    ===================================================== */

  resendButton: {
    alignSelf: "flex-end",

    marginBottom: 16,
  },

  resendText: {
    fontSize: 12,

    fontWeight: "700",
  },

  /* =====================================================
       BUTTON
    ===================================================== */

  primaryButton: {
    height: 48,

    borderRadius: 10,

    alignItems: "center",

    justifyContent: "center",

    marginTop: 4,
  },

  primaryButtonText: {
    fontSize: 14,

    fontWeight: "700",
  },

  disabledButton: {
    opacity: 0.65,
  },

  /* =====================================================
       ERROR
    ===================================================== */

  errorContainer: {
    flexDirection: "row",

    alignItems: "center",

    borderWidth: 1,

    borderRadius: 8,

    paddingVertical: 10,

    paddingHorizontal: 12,

    marginTop: 16,
  },

  errorText: {
    flex: 1,

    marginLeft: 8,

    fontSize: 12,

    lineHeight: 17,

    fontWeight: "500",
  },
});
