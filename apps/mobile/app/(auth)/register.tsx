
// import {
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
// } from "react-native";

// import { router } from "expo-router";



// import { useTheme } from "../../providers/ThemeProvider";
// import RegisterForm, { RegistrationData } from "../../features/auth/components/RegisterForm";

// export default function RegisterScreen() {
//   const { theme } = useTheme();

//   /* =======================================================
//      GOOGLE REGISTER
//   ======================================================= */

//   const handleGoogleRegister = () => {
//     console.log(
//       "GOOGLE REGISTER → INITIATED",
//     );

//     // Google OAuth flow will be implemented here.
//   };

//   /* =======================================================
//      EMAIL REGISTER CONTINUE
//   ======================================================= */

//   const handleContinue = (
//     data: RegistrationData,
//   ) => {
//     router.push({
//       pathname:
//         "/(auth)/register-otp",

//       params: {
//         displayName:
//           data.displayName,

//         email:
//           data.email,

//         phone:
//           data.phone,

//         password:
//           data.password,

//         confirmPassword:
//           data.confirmPassword,
//       },
//     });
//   };

//   /* =======================================================
//      LOGIN
//   ======================================================= */

//   const handleLogin = () => {
//     router.replace(
//       "/(auth)/login",
//     );
//   };

//   return (
//     <KeyboardAvoidingView
//       style={[
//         styles.screen,
//         {
//           backgroundColor:
//             theme.background,
//         },
//       ]}
//       behavior={
//         Platform.OS === "ios"
//           ? "padding"
//           : undefined
//       }
//     >
//       <ScrollView
//         contentContainerStyle={
//           styles.scrollContent
//         }
//         keyboardShouldPersistTaps="handled"
//         showsVerticalScrollIndicator={
//           false
//         }
//       >
//         <RegisterForm
//           onGoogleRegister={
//             handleGoogleRegister
//           }
//           onContinue={
//             handleContinue
//           }
//           onLogin={
//             handleLogin
//           }
//         />
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles =
//   StyleSheet.create({
//     screen: {
//       flex: 1,
//     },

//     scrollContent: {
//       flexGrow: 1,

//       justifyContent: "center",

//       paddingHorizontal: 20,

//       paddingVertical: 36,
//     },
//   });
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";

import { router } from "expo-router";

import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

import { useState } from "react";

import { useTheme } from "../../providers/ThemeProvider";

import RegisterForm, {
  RegistrationData,
} from "../../features/auth/components/RegisterForm";

import { useGoogleRegistrationStore } from "../../store/google-registration.store";

import { authApi } from "../../features/auth/api/auth.api";

import { getDeviceId } from "../../lib/device";

import { authToken } from "../../lib/auth";

import { useAuthStore } from "../../store/auth.store";

import { useThemeStore } from "../../store/theme.store";

import { useRegistrationStore } from "../../store/auth-registration.store";

/* =========================================================
   SCREEN
========================================================= */

export default function RegisterScreen() {
  const { theme } = useTheme();

  /* =======================================================
     REGISTRATION STORE
  ======================================================= */

  const setRegistration =
    useRegistrationStore(
      (state) =>
        state.setRegistration,
    );

  /* =======================================================
     GOOGLE REGISTRATION STORE
  ======================================================= */

  const setGoogleRegistration =
    useGoogleRegistrationStore(
      (state) =>
        state.setGoogleRegistration,
    );

  /* =======================================================
     AUTH
  ======================================================= */

  const login = useAuthStore(
    (state) => state.login,
  );

  const setTheme =
    useThemeStore(
      (state) => state.setTheme,
    );

  /* =======================================================
     GOOGLE LOADING
  ======================================================= */

  const [
    isGoogleLoading,
    setIsGoogleLoading,
  ] = useState(false);

  /* =======================================================
     GOOGLE REGISTER
  ======================================================= */

  const handleGoogleRegister =
    async () => {
      if (isGoogleLoading) {
        return;
      }

      try {
        setIsGoogleLoading(true);

        console.log(
          "GOOGLE REGISTER → STARTING",
        );

        /* =================================================
           GOOGLE PLAY SERVICES
        ================================================= */

        await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog:
            true,
        });

        /* =================================================
           GOOGLE SIGN-IN
        ================================================= */

        const result =
          await GoogleSignin.signIn();

        console.log(
          "GOOGLE REGISTER → SIGN-IN SUCCESS",
        );

        /* =================================================
           ID TOKEN
        ================================================= */

        const idToken =
          result.data?.idToken;

        if (!idToken) {
          throw new Error(
            "Google ID token was not returned.",
          );
        }

        console.log(
          "GOOGLE REGISTER → ID TOKEN RECEIVED",
        );

        /* =================================================
           DEVICE ID
        ================================================= */

        const deviceId =
          await getDeviceId();

        console.log(
          "GOOGLE REGISTER → DEVICE ID EXISTS:",
          !!deviceId,
        );

        /* =================================================
           BACKEND
           
           POST /auth/google
        ================================================= */

        const response =
          await authApi.googleLogin({
            idToken,
            deviceId,
          });

        console.log(
          "GOOGLE REGISTER → BACKEND RESPONSE:",
          response,
        );

        const data =
          response.data;

        /* =================================================
           NEW GOOGLE USER
           
           IMPORTANT:
           
           GoogleLoginResponse is a union:
           
           AuthData
             OR
           GoogleRegistrationRequired
           
           Therefore we MUST narrow the union
           before accessing response-specific fields.
        ================================================= */

        if (
          "requiresPhoneVerification" in
          data
        ) {
          console.log(
            "GOOGLE REGISTER → NEW USER",
          );

          console.log(
            "GOOGLE REGISTER → PHONE VERIFICATION REQUIRED:",
            data.requiresPhoneVerification,
          );

          console.log(
            "GOOGLE REGISTER → EMAIL:",
            data.email,
          );

          console.log(
            "GOOGLE REGISTER → DISPLAY NAME:",
            data.displayName,
          );

          /*
           * Backend has already sent
           * GOOGLE_REGISTER OTP.
           *
           * Store temporary Google registration
           * data.
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

          /*
           * Navigate to:
           *
           * /google-complete
           *
           * The completion screen will ask
           * for phone + OTP.
           */

          router.push(
            "/(auth)/google-complete",
          );

          return;
        }

        /* =================================================
           EXISTING GOOGLE USER
           
           At this point TypeScript knows that
           `data` is AuthData.
        ================================================= */

        console.log(
          "GOOGLE REGISTER → EXISTING USER",
        );

        const accessToken =
          data.accessToken;

        const user =
          data.user;

        if (
          !accessToken ||
          !user
        ) {
          throw new Error(
            "Invalid authentication response from server.",
          );
        }

        console.log(
          "GOOGLE REGISTER → ACCESS TOKEN RECEIVED",
        );

        console.log(
          "GOOGLE REGISTER → USER:",
          user,
        );

        /* =================================================
           STORE ACCESS TOKEN
        ================================================= */

        await authToken.set(
          accessToken,
        );

        console.log(
          "GOOGLE REGISTER → TOKEN STORED",
        );

        /* =================================================
           GET CURRENT USER
           
           /me remains the canonical
           authenticated-user endpoint.
        ================================================= */

        console.log(
          "GOOGLE REGISTER → CALLING /ME",
        );

        const currentUser =
          await authApi.me();

        console.log(
          "GOOGLE REGISTER → /ME SUCCESS:",
          currentUser,
        );

        /* =================================================
           STORE AUTH STATE
        ================================================= */

        login(
          currentUser,
          accessToken,
        );

        console.log(
          "GOOGLE REGISTER → USER STORED",
        );

        /* =================================================
           APPLY THEME
        ================================================= */

        if (
          currentUser.theme ===
            "LIGHT" ||
          currentUser.theme ===
            "DARK" ||
          currentUser.theme ===
            "SYSTEM"
        ) {
          setTheme(
            currentUser.theme,
          );

          console.log(
            "GOOGLE REGISTER → THEME APPLIED:",
            currentUser.theme,
          );
        } else {
          setTheme("SYSTEM");

          console.log(
            "GOOGLE REGISTER → INVALID/MISSING THEME → SYSTEM",
          );
        }

        /* =================================================
           NAVIGATE TO APP
        ================================================= */

        console.log(
          "GOOGLE REGISTER → NAVIGATING TO DASHBOARD",
        );

        router.replace(
          "/(app)",
        );
      } catch (error: any) {
        console.log(
          "GOOGLE REGISTER → FAILED:",
          error,
        );

        console.log(
          "GOOGLE REGISTER → STATUS:",
          error?.response?.status,
        );

        console.log(
          "GOOGLE REGISTER → RESPONSE:",
          error?.response?.data,
        );

        /* =================================================
           GOOGLE CANCELLED
        ================================================= */

        if (
          error?.code ===
          statusCodes.SIGN_IN_CANCELLED
        ) {
          console.log(
            "GOOGLE REGISTER → USER CANCELLED",
          );

          return;
        }

        /* =================================================
           GOOGLE SIGN-IN ALREADY IN PROGRESS
        ================================================= */

        if (
          error?.code ===
          statusCodes.IN_PROGRESS
        ) {
          console.log(
            "GOOGLE REGISTER → SIGN-IN ALREADY IN PROGRESS",
          );

          return;
        }

        /* =================================================
           PLAY SERVICES UNAVAILABLE
        ================================================= */

        if (
          error?.code ===
          statusCodes.PLAY_SERVICES_NOT_AVAILABLE
        ) {
          console.log(
            "GOOGLE REGISTER → PLAY SERVICES UNAVAILABLE",
          );

          return;
        }

        /* =================================================
           GENERAL ERROR
        ================================================= */

        console.error(
          "GOOGLE REGISTER ERROR:",
          error?.response?.data ??
            error?.message ??
            error,
        );
      } finally {
        setIsGoogleLoading(false);
      }
    };

  /* =======================================================
     EMAIL REGISTER CONTINUE
  ======================================================= */

  const handleContinue = (
    data: RegistrationData,
  ) => {
    /*
     * Store registration data
     * temporarily.
     *
     * IMPORTANT:
     *
     * Password does NOT go into
     * Expo Router params.
     */

    setRegistration({
      displayName: data.displayName,

      email: data.email,

      phone: data.phone,

      password: data.password,
      deviceId: "",
    });

    /*
     * Navigate to OTP screen.
     */

    router.push(
      "/(auth)/verify-otp",
    );
  };

  /* =======================================================
     LOGIN
  ======================================================= */

  const handleLogin = () => {
    router.replace(
      "/(auth)/login",
    );
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

      justifyContent:
        "center",

      paddingHorizontal: 20,

      paddingVertical: 36,
    },
  });