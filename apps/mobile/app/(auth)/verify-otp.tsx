import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  RefreshCw,
} from "lucide-react-native";

import { router } from "expo-router";

import { useTheme } from "../../providers/ThemeProvider";

import { useRegistrationStore } from "../../store/auth-registration.store";

import { authApi } from "../../features/auth/api/auth.api";

/* =========================================================
   SCREEN
========================================================= */

export default function VerifyOtpScreen() {
  const { theme } = useTheme();

  const registration = useRegistrationStore(
    (state) => state.registration,
  );

  const clearRegistration = useRegistrationStore(
    (state) => state.clearRegistration,
  );

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [isLoading, setIsLoading] =
    useState(false);

  const [isResending, setIsResending] =
    useState(false);

  const inputRefs =
    useRef<Array<TextInput | null>>([]);

  /* =======================================================
     GUARD
  ======================================================= */

  useEffect(() => {
    if (!registration) {
      router.replace("/(auth)/register");
    }
  }, [registration]);

  if (!registration) {
    return null;
  }

  const otpValue = otp.join("");

  /* =======================================================
     OTP INPUT
  ======================================================= */

  const handleOtpChange = (
    value: string,
    index: number,
  ) => {
    const digits =
      value.replace(/\D/g, "");

    if (!digits) {
      const updatedOtp = [...otp];

      updatedOtp[index] = "";

      setOtp(updatedOtp);

      return;
    }

    /*
     * Handle pasted OTP.
     */
    if (digits.length > 1) {
      const pastedDigits =
        digits
          .slice(0, 6 - index)
          .split("");

      const updatedOtp = [...otp];

      pastedDigits.forEach(
        (digit, digitIndex) => {
          updatedOtp[
            index + digitIndex
          ] = digit;
        },
      );

      setOtp(updatedOtp);

      const nextIndex =
        Math.min(
          index + pastedDigits.length,
          5,
        );

      inputRefs.current[
        nextIndex
      ]?.focus();

      return;
    }

    const updatedOtp = [...otp];

    updatedOtp[index] = digits;

    setOtp(updatedOtp);

    if (index < 5) {
      inputRefs.current[
        index + 1
      ]?.focus();
    }
  };

  const handleKeyPress = (
    key: string,
    index: number,
  ) => {
    if (
      key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[
        index - 1
      ]?.focus();
    }
  };

  /* =======================================================
     VERIFY OTP + REGISTER
  ======================================================= */

  const handleVerifyOtp =
    async () => {
      if (otpValue.length !== 6) {
        Alert.alert(
          "Invalid OTP",
          "Please enter the complete 6-digit verification code.",
        );

        return;
      }

      try {
        setIsLoading(true);

        console.log(
          "REGISTER → SUBMITTING OTP",
          {
            email: registration.email,
          },
        );

        /*
         * IMPORTANT:
         *
         * The backend register endpoint already
         * verifies the OTP internally.
         *
         * Therefore we DO NOT call verifyOtp().
         */

        const response =
          await authApi.register({
            displayName:
              registration.displayName,

            email:
              registration.email,

            phone:
              registration.phone,

            password:
              registration.password,

            otp:
              otpValue,

            deviceId:
              registration.deviceId,
          });

        console.log(
          "REGISTER → SUCCESS",
          response,
        );

        clearRegistration();

        Alert.alert(
          "Registration successful",
          "Your BudgetWise account has been created.",
          [
            {
              text: "Continue",
              onPress: () => {
                router.replace(
                  "/(auth)/login",
                );
              },
            },
          ],
        );
      } catch (error: any) {
        console.error(
          "REGISTER → FAILED:",
          error?.response?.data ??
            error?.message ??
            error,
        );

        Alert.alert(
          "Registration failed",
          error?.response?.data
            ?.message ??
            "Unable to create your account. Please check the OTP and try again.",
        );

        setOtp([
          "",
          "",
          "",
          "",
          "",
          "",
        ]);

        inputRefs.current[0]?.focus();
      } finally {
        setIsLoading(false);
      }
    };

  /* =======================================================
     RESEND OTP
  ======================================================= */

  const handleResendOtp =
    async () => {
      if (
        isResending ||
        isLoading
      ) {
        return;
      }

      try {
        setIsResending(true);

        console.log(
          "REGISTER OTP → RESENDING",
          {
            email:
              registration.email,
          },
        );

        await authApi.sendOtp({
          email:
            registration.email,

          purpose:
            "REGISTER",
        });

        setOtp([
          "",
          "",
          "",
          "",
          "",
          "",
        ]);

        Alert.alert(
          "OTP sent",
          "A new verification code has been sent.",
        );

        inputRefs.current[0]?.focus();
      } catch (error: any) {
        console.error(
          "REGISTER OTP → RESEND FAILED:",
          error?.response?.data ??
            error?.message ??
            error,
        );

        Alert.alert(
          "Unable to resend OTP",
          error?.response?.data
            ?.message ??
            "Please try again.",
        );
      } finally {
        setIsResending(false);
      }
    };

  /* =======================================================
     GO BACK
  ======================================================= */

  const handleBack = () => {
    router.back();
  };

  /* =======================================================
     RENDER
  ======================================================= */

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
      <View style={styles.container}>
        {/* BACK BUTTON */}

        <Pressable
          onPress={handleBack}
          disabled={isLoading}
          style={({ pressed }) => [
            styles.backButton,
            {
              backgroundColor:
                theme.surface,

              borderColor:
                theme.border,
            },
            pressed &&
              styles.pressed,
          ]}
        >
          <ArrowLeft
            size={20}
            color={theme.text}
          />
        </Pressable>

        {/* ICON */}

        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor:
                theme.primary,
            },
          ]}
        >
          <Mail
            size={30}
            color={
              theme.primaryText
            }
          />
        </View>

        {/* TITLE */}

        <Text
          style={[
            styles.title,
            {
              color:
                theme.text,
            },
          ]}
        >
          Verify your email
        </Text>

        <Text
          style={[
            styles.description,
            {
              color:
                theme.textSecondary,
            },
          ]}
        >
          We've sent a 6-digit
          verification code to
        </Text>

        <Text
          style={[
            styles.email,
            {
              color:
                theme.text,
            },
          ]}
        >
          {registration.email}
        </Text>

        {/* OTP INPUTS */}

        <View
          style={styles.otpContainer}
        >
          {otp.map(
            (digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[
                    index
                  ] = ref;
                }}
                value={digit}
                onChangeText={(value) =>
                  handleOtpChange(
                    value,
                    index,
                  )
                }
                onKeyPress={({
                  nativeEvent,
                }) =>
                  handleKeyPress(
                    nativeEvent.key,
                    index,
                  )
                }
                keyboardType="number-pad"
                maxLength={6}
                editable={!isLoading}
                textAlign="center"
                selectTextOnFocus
                style={[
                  styles.otpInput,
                  {
                    color:
                      theme.text,

                    backgroundColor:
                      theme.surface,

                    borderColor:
                      digit
                        ? theme.primary
                        : theme.border,
                  },
                ]}
              />
            ),
          )}
        </View>

        {/* VERIFY BUTTON */}

        <Pressable
          onPress={
            handleVerifyOtp
          }
          disabled={
            isLoading ||
            otpValue.length !== 6
          }
          style={({ pressed }) => [
            styles.verifyButton,
            {
              backgroundColor:
                theme.primary,
            },

            (
              isLoading ||
              otpValue.length !== 6
            ) &&
              styles.disabled,

            pressed &&
              styles.pressed,
          ]}
        >
          {isLoading ? (
            <ActivityIndicator
              size="small"
              color={
                theme.primaryText
              }
            />
          ) : (
            <>
              <CheckCircle2
                size={19}
                color={
                  theme.primaryText
                }
              />

              <Text
                style={[
                  styles.verifyText,
                  {
                    color:
                      theme.primaryText,
                  },
                ]}
              >
                Verify Email
              </Text>
            </>
          )}
        </Pressable>

        {/* RESEND */}

        <View
          style={styles.resendContainer}
        >
          <Text
            style={[
              styles.resendText,
              {
                color:
                  theme.textSecondary,
              },
            ]}
          >
            Didn't receive the code?
          </Text>

          <Pressable
            onPress={
              handleResendOtp
            }
            disabled={
              isResending ||
              isLoading
            }
            style={({ pressed }) => [
              styles.resendButton,

              pressed &&
                styles.pressed,
            ]}
          >
            {isResending ? (
              <ActivityIndicator
                size="small"
                color={
                  theme.primary
                }
              />
            ) : (
              <>
                <RefreshCw
                  size={15}
                  color={
                    theme.primary
                  }
                />

                <Text
                  style={[
                    styles.resendButtonText,
                    {
                      color:
                        theme.primary,
                    },
                  ]}
                >
                  Resend
                </Text>
              </>
            )}
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  container: {
    flex: 1,

    paddingHorizontal: 24,

    justifyContent:
      "center",

    alignItems:
      "center",
  },

  backButton: {
    position: "absolute",

    top: 60,
    left: 20,

    width: 42,
    height: 42,

    borderRadius: 12,

    alignItems:
      "center",

    justifyContent:
      "center",

    borderWidth: 1,
  },

  iconContainer: {
    width: 76,
    height: 76,

    borderRadius: 38,

    alignItems:
      "center",

    justifyContent:
      "center",

    marginBottom: 26,
  },

  title: {
    fontSize: 26,

    fontWeight: "800",

    letterSpacing: -0.6,
  },

  description: {
    marginTop: 12,

    fontSize: 14,

    textAlign: "center",

    lineHeight: 21,
  },

  email: {
    marginTop: 4,

    fontSize: 14,

    fontWeight: "700",
  },

  otpContainer: {
    flexDirection: "row",

    justifyContent:
      "center",

    gap: 8,

    marginTop: 38,
  },

  otpInput: {
    width: 46,
    height: 54,

    borderRadius: 12,

    borderWidth: 1.5,

    fontSize: 22,

    fontWeight: "800",
  },

  verifyButton: {
    width: "100%",

    minHeight: 52,

    marginTop: 32,

    borderRadius: 14,

    flexDirection: "row",

    alignItems:
      "center",

    justifyContent:
      "center",

    gap: 8,
  },

  verifyText: {
    fontSize: 15,

    fontWeight: "800",
  },

  resendContainer: {
    flexDirection: "row",

    alignItems:
      "center",

    justifyContent:
      "center",

    marginTop: 24,

    gap: 6,
  },

  resendText: {
    fontSize: 13,
  },

  resendButton: {
    flexDirection: "row",

    alignItems:
      "center",

    gap: 5,
  },

  resendButtonText: {
    fontSize: 13,

    fontWeight: "800",
  },

  pressed: {
    opacity: 0.7,

    transform: [
      {
        scale: 0.98,
      },
    ],
  },

  disabled: {
    opacity: 0.45,
  },
});