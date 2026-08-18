import {
  GoogleSignin,
} from "@react-native-google-signin/google-signin";

import {
  GOOGLE_WEB_CLIENT_ID,
} from "../../../lib/env";

let configured = false;

export function configureGoogleSignIn() {
  if (configured) {
    return;
  }

  GoogleSignin.configure({
    webClientId:
      GOOGLE_WEB_CLIENT_ID,

    offlineAccess: false,
  });

  configured = true;

  console.log(
    "GOOGLE SIGN-IN → CONFIGURED",
  );
}

export async function signInWithGoogle() {
  configureGoogleSignIn();

  console.log(
    "GOOGLE SIGN-IN → CHECKING PLAY SERVICES",
  );

  await GoogleSignin.hasPlayServices();

  /*
   * Clear the currently selected Google account
   * so Google shows the account picker.
   */
  try {
    await GoogleSignin.signOut();

    console.log(
      "GOOGLE SIGN-IN → PREVIOUS GOOGLE SESSION CLEARED",
    );
  } catch (error) {
    console.log(
      "GOOGLE SIGN-IN → NO PREVIOUS GOOGLE SESSION",
    );
  }

  console.log(
    "GOOGLE SIGN-IN → OPENING GOOGLE ACCOUNT PICKER",
  );

  const response =
    await GoogleSignin.signIn();

  console.log(
    "GOOGLE SIGN-IN → RESPONSE:",
    response,
  );

  return response;
}