

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from "lucide-react-native";

import Svg, {
  Path,
} from "react-native-svg";

import { router } from "expo-router";

import { useTheme } from "../../../providers/ThemeProvider";

import { useAuthStore } from "../../../store/auth.store";

import { useThemeStore } from "../../../store/theme.store";

import {
  useGoogleRegistrationStore,
} from "../../../store/google-registration.store";

import { useLogin } from "../hooks/use-login";

import { useGoogleLogin } from "../hooks/use-google-login";

import { signInWithGoogle } from "../hooks/google-signin";

/* =========================================================
   GOOGLE ICON
========================================================= */

function GoogleIcon({
  size = 20,
}: {
  size?: number;
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
    >
      <Path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />

      <Path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />

      <Path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />

      <Path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </Svg>
  );
}

/* =========================================================
   PROPS
========================================================= */

interface LoginFormProps {
  onForgotPassword: () => void;

  onRegister: () => void;

  /*
   * Called after email/password OR existing Google
   * authentication has completed successfully.
   */
  onLoginSuccess: () => void;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function LoginForm({
  onForgotPassword,
  onRegister,
  onLoginSuccess,
}: LoginFormProps) {
  const { theme } = useTheme();

  /*
   * =======================================================
   * AUTH USER
   * =======================================================
   */

  const user = useAuthStore(
    (state) => state.user,
  );

  /*
   * =======================================================
   * THEME STORE
   * =======================================================
   */

  const setTheme = useThemeStore(
    (state) => state.setTheme,
  );

  /*
   * =======================================================
   * GOOGLE REGISTRATION STORE
   * =======================================================
   */

  const setGoogleRegistration =
    useGoogleRegistrationStore(
      (state) =>
        state.setGoogleRegistration,
    );

  /*
   * =======================================================
   * FORM STATE
   * =======================================================
   */

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    focusedInput,
    setFocusedInput,
  ] = useState<
    "email" | "password" | null
  >(null);

  /*
   * =======================================================
   * MUTATIONS
   * =======================================================
   */

  const loginMutation =
    useLogin();

  const googleLoginMutation =
    useGoogleLogin();

  /*
   * =======================================================
   * LOGIN NAVIGATION GUARD
   * =======================================================
   *
   * Prevent duplicate navigation caused by
   * React re-renders / effects.
   */

  const hasNavigatedRef =
    useRef(false);

  /*
   * =======================================================
   * EMAIL LOGIN SUCCESS
   * =======================================================
   */

  useEffect(() => {
    if (!loginMutation.isSuccess) {
      return;
    }

    if (hasNavigatedRef.current) {
      return;
    }

    console.log(
      "LOGIN FORM → LOGIN MUTATION SUCCESS",
    );

    /*
     * Apply backend theme.
     */

    if (
      user?.theme === "LIGHT" ||
      user?.theme === "DARK" ||
      user?.theme === "SYSTEM"
    ) {
      setTheme(user.theme);

      console.log(
        "LOGIN FORM → THEME APPLIED:",
        user.theme,
      );
    } else {
      setTheme("SYSTEM");

      console.log(
        "LOGIN FORM → INVALID/MISSING THEME → SYSTEM",
      );
    }

    /*
     * Prevent duplicate navigation.
     */

    hasNavigatedRef.current = true;

    console.log(
      "LOGIN FORM → NAVIGATING AFTER EMAIL LOGIN",
    );

    onLoginSuccess();
  }, [
    loginMutation.isSuccess,
    user,
    setTheme,
    onLoginSuccess,
  ]);

  /*
   * =======================================================
   * EMAIL LOGIN
   * =======================================================
   */

  const handleLogin = () => {
    if (
      !email.trim() ||
      !password
    ) {
      return;
    }

    /*
     * New login attempt.
     */

    hasNavigatedRef.current = false;

    console.log(
      "LOGIN FORM → SUBMITTING LOGIN",
    );

    loginMutation.mutate({
      email: email.trim(),
      password,
    });
  };

  /*
   * =======================================================
   * GOOGLE LOGIN
   * =======================================================
   *
   * Flow:
   *
   * Google Sign-In
   *      ↓
   * Google ID token
   *      ↓
   * POST /auth/google
   *      ↓
   * ┌────────────────────────────────────┐
   * │                                    │
   * │ Existing Google user               │
   * │        ↓                           │
   * │ token + user                       │
   * │        ↓                           │
   * │ dashboard                          │
   * │                                    │
   * └────────────────────────────────────┘
   *
   * OR
   *
   * ┌────────────────────────────────────┐
   * │ New Google user                    │
   * │        ↓                           │
   * │ requiresPhoneVerification          │
   * │        ↓                           │
   * │ Store temporary registration data  │
   * │        ↓                           │
   * │ Google Complete screen             │
   * └────────────────────────────────────┘
   */

  const handleGoogleLogin =
    async () => {
      try {
        /*
         * Reset navigation guard.
         */

        hasNavigatedRef.current =
          false;

        console.log(
          "LOGIN FORM → GOOGLE LOGIN STARTED",
        );

        /*
         * ===============================================
         * OPEN GOOGLE SIGN-IN
         * ===============================================
         */

        const googleResponse =
          await signInWithGoogle();

        console.log(
          "LOGIN FORM → GOOGLE RESPONSE:",
          googleResponse,
        );

        /*
         * ===============================================
         * EXTRACT ID TOKEN
         * ===============================================
         */

        const idToken =
          googleResponse.data?.idToken;

        if (!idToken) {
          throw new Error(
            "Google ID token was not returned",
          );
        }

        console.log(
          "LOGIN FORM → GOOGLE ID TOKEN EXISTS:",
          true,
        );

        /*
         * ===============================================
         * SEND TOKEN TO BACKEND
         * ===============================================
         */

        const response =
          await googleLoginMutation.mutateAsync(
            idToken,
          );

        console.log(
          "LOGIN FORM → BACKEND GOOGLE RESPONSE:",
          response,
        );

        const data =
          response.data;

        /*
         * ===============================================
         * NEW GOOGLE USER
         * ===============================================
         *
         * Backend returns:
         *
         * {
         *   requiresPhoneVerification: true,
         *   email,
         *   displayName,
         *   picture
         * }
         */

        if (
          "requiresPhoneVerification" in
          data
        ) {
          console.log(
            "LOGIN FORM → PHONE VERIFICATION REQUIRED",
          );

          /*
           * Store the information required by
           * Google Complete.
           *
           * The ID token stays in memory only.
           * We do NOT put it into route params.
           */

          setGoogleRegistration({
            idToken,

            email:
              data.email,

            displayName:
              data.displayName,

            picture:
              data.picture,
          });

          console.log(
            "LOGIN FORM → GOOGLE REGISTRATION DATA STORED",
          );

          /*
           * Navigate to Google completion screen.
           */

          console.log(
            "LOGIN FORM → NAVIGATING TO GOOGLE COMPLETE",
          );

          router.push(
            "/(auth)/google-complete",
          );

          return;
        }

        /*
         * ===============================================
         * EXISTING GOOGLE USER
         * ===============================================
         *
         * useGoogleLogin already:
         *
         * 1. Stores access token
         * 2. Calls /me if your hook does so
         * 3. Stores user
         * 4. Applies theme
         */

        console.log(
          "LOGIN FORM → EXISTING GOOGLE USER",
        );

        console.log(
          "LOGIN FORM → GOOGLE LOGIN COMPLETE",
        );

        /*
         * Prevent duplicate navigation.
         */

        hasNavigatedRef.current = true;

        onLoginSuccess();
      } catch (error) {
        console.log(
          "LOGIN FORM → GOOGLE LOGIN FAILED:",
          error,
        );
      }
    };

  /*
   * =======================================================
   * LOADING STATE
   * =======================================================
   */

  const isAuthenticating =
    loginMutation.isPending ||
    googleLoginMutation.isPending;

  /*
   * =======================================================
   * RENDER
   * =======================================================
   */

  return (
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
          HEADER
      ================================================= */}

      <View style={styles.header}>
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
          Welcome back
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
          Enter your credentials to
          access your portal
        </Text>
      </View>

      {/* =================================================
          GOOGLE LOGIN
      ================================================= */}

      <TouchableOpacity
        style={[
          styles.googleButton,
          {
            borderColor:
              theme.border,

            backgroundColor:
              theme.surface,
          },

          isAuthenticating &&
            styles.disabledButton,
        ]}
        onPress={
          handleGoogleLogin
        }
        disabled={
          isAuthenticating
        }
        activeOpacity={0.85}
      >
        {googleLoginMutation.isPending ? (
          <ActivityIndicator
            size="small"
            color={theme.text}
          />
        ) : (
          <>
            <View
              style={
                styles.googleIconWrapper
              }
            >
              <GoogleIcon size={18} />
            </View>

            <Text
              style={[
                styles.googleButtonText,
                {
                  color:
                    theme.text,
                },
              ]}
            >
              Continue with Google
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* =================================================
          DIVIDER
      ================================================= */}

      <View
        style={
          styles.dividerContainer
        }
      >
        <View
          style={[
            styles.dividerLine,
            {
              backgroundColor:
                theme.border,
            },
          ]}
        />

        <Text
          style={[
            styles.dividerText,
            {
              color:
                theme.textSecondary,
            },
          ]}
        >
          OR WITH EMAIL
        </Text>

        <View
          style={[
            styles.dividerLine,
            {
              backgroundColor:
                theme.border,
            },
          ]}
        />
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
          style={[
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
          ]}
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
            onChangeText={
              setEmail
            }
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
              !isAuthenticating
            }
          />
        </View>
      </View>

      {/* =================================================
          PASSWORD
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
          Password
        </Text>

        <View
          style={[
            styles.inputWrapper,
            {
              borderColor:
                theme.border,

              backgroundColor:
                theme.surfaceSecondary,
            },

            focusedInput ===
              "password" && {
              borderColor:
                theme.primary,

              backgroundColor:
                theme.surface,
            },
          ]}
        >
          <Lock
            size={18}
            color={
              focusedInput ===
              "password"
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
            placeholder="••••••••"
            placeholderTextColor={
              theme.textSecondary
            }
            value={password}
            onChangeText={
              setPassword
            }
            onFocus={() =>
              setFocusedInput(
                "password",
              )
            }
            onBlur={() =>
              setFocusedInput(
                null,
              )
            }
            secureTextEntry={
              !showPassword
            }
            autoCapitalize="none"
            autoComplete="password"
            editable={
              !isAuthenticating
            }
          />

          <TouchableOpacity
            onPress={() =>
              setShowPassword(
                (prev) => !prev,
              )
            }
            disabled={
              isAuthenticating
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
          FORGOT PASSWORD
      ================================================= */}

      <TouchableOpacity
        style={
          styles.forgotButton
        }
        onPress={
          onForgotPassword
        }
        disabled={
          isAuthenticating
        }
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.forgotText,
            {
              color:
                theme.primary,
            },
          ]}
        >
          Forgot password?
        </Text>
      </TouchableOpacity>

      {/* =================================================
          LOGIN BUTTON
      ================================================= */}

      <TouchableOpacity
        style={[
          styles.loginButton,
          {
            backgroundColor:
              theme.primary,
          },

          isAuthenticating &&
            styles.disabledButton,
        ]}
        onPress={handleLogin}
        disabled={
          isAuthenticating
        }
        activeOpacity={0.9}
      >
        {loginMutation.isPending ? (
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
                styles.loginButtonText,
                {
                  color:
                    theme.primaryText,
                },
              ]}
            >
              Sign In
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
          EMAIL LOGIN ERROR
      ================================================= */}

      {loginMutation.isError && (
        <View
          style={[
            styles.errorContainer,
            {
              backgroundColor:
                theme.background,

              borderColor:
                theme.border,
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
            Invalid email or
            password. Please try
            again.
          </Text>
        </View>
      )}

      {/* =================================================
          GOOGLE LOGIN ERROR
      ================================================= */}

      {googleLoginMutation.isError && (
        <View
          style={[
            styles.errorContainer,
            {
              backgroundColor:
                theme.background,

              borderColor:
                theme.border,
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
            Google sign-in failed.
            Please try again.
          </Text>
        </View>
      )}

      {/* =================================================
          REGISTER
      ================================================= */}

      <View
        style={
          styles.registerContainer
        }
      >
        <Text
          style={[
            styles.registerText,
            {
              color:
                theme.textSecondary,
            },
          ]}
        >
          Don't have an account?
        </Text>

        <TouchableOpacity
          onPress={onRegister}
          disabled={
            isAuthenticating
          }
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.registerLink,
              {
                color:
                  theme.primary,
              },
            ]}
          >
            Create account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles =
  StyleSheet.create({
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

    /* =====================================================
       HEADER
    ===================================================== */

    header: {
      alignItems: "center",

      marginBottom: 28,
    },

    brandTitle: {
      fontSize: 12,

      fontWeight: "800",

      letterSpacing: 3,

      textTransform:
        "uppercase",

      marginBottom: 12,
    },

    title: {
      fontSize: 26,

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

    /* =====================================================
       GOOGLE
    ===================================================== */

    googleButton: {
      height: 48,

      borderRadius: 10,

      borderWidth: 1,

      flexDirection: "row",

      alignItems: "center",

      justifyContent: "center",
    },

    googleIconWrapper: {
      marginRight: 10,
    },

    googleButtonText: {
      fontSize: 14,

      fontWeight: "600",
    },

    /* =====================================================
       DIVIDER
    ===================================================== */

    dividerContainer: {
      flexDirection: "row",

      alignItems: "center",

      marginVertical: 24,
    },

    dividerLine: {
      flex: 1,

      height: 1,
    },

    dividerText: {
      marginHorizontal: 12,

      fontSize: 11,

      fontWeight: "600",

      letterSpacing: 0.8,
    },

    /* =====================================================
       FORM
    ===================================================== */

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

    /* =====================================================
       FORGOT PASSWORD
    ===================================================== */

    forgotButton: {
      alignSelf: "flex-end",

      marginTop: 2,

      marginBottom: 20,
    },

    forgotText: {
      fontSize: 13,

      fontWeight: "600",
    },

    /* =====================================================
       LOGIN BUTTON
    ===================================================== */

    loginButton: {
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

    loginButtonText: {
      fontSize: 14,

      fontWeight: "600",
    },

    /* =====================================================
       ERROR
    ===================================================== */

    errorContainer: {
      flexDirection: "row",

      alignItems: "center",

      justifyContent: "center",

      borderWidth: 1,

      borderRadius: 8,

      paddingVertical: 10,

      paddingHorizontal: 12,

      marginTop: 16,
    },

    errorText: {
      flex: 1,

      marginLeft: 8,

      fontSize: 13,

      fontWeight: "500",
    },

    /* =====================================================
       REGISTER
    ===================================================== */

    registerContainer: {
      flexDirection: "row",

      justifyContent: "center",

      alignItems: "center",

      marginTop: 24,
    },

    registerText: {
      fontSize: 14,
    },

    registerLink: {
      fontSize: 14,

      fontWeight: "600",

      marginLeft: 4,
    },
  });