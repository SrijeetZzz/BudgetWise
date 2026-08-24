// import { useState } from "react";

// import {
//   ActivityIndicator,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";

// import {
//   ArrowRight,
//   CheckCircle2,
//   Eye,
//   EyeOff,
//   Lock,
//   Mail,
//   Phone,
//   User,
// } from "lucide-react-native";

// import Svg, { Path } from "react-native-svg";
// import { useTheme } from "../../../providers/ThemeProvider";
// import { useSendOtp } from "../hooks/use-send-otp";

// export interface RegistrationData {
//   displayName: string;
//   email: string;
//   phone: string;
//   password: string;
//   confirmPassword: string;
// }

// interface RegisterFormProps {
//   onGoogleRegister: () => void;
//   onContinue: (
//     data: RegistrationData,
//   ) => void;
//   onLogin: () => void;
// }

// /* =========================================================
//    GOOGLE ICON
// ========================================================= */

// function GoogleIcon({
//   size = 18,
// }: {
//   size?: number;
// }) {
//   return (
//     <Svg
//       width={size}
//       height={size}
//       viewBox="0 0 24 24"
//     >
//       <Path
//         d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//         fill="#4285F4"
//       />

//       <Path
//         d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//         fill="#34A853"
//       />

//       <Path
//         d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
//         fill="#FBBC05"
//       />

//       <Path
//         d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
//         fill="#EA4335"
//       />
//     </Svg>
//   );
// }

// /* =========================================================
//    COMPONENT
// ========================================================= */

// export default function RegisterForm({
//   onGoogleRegister,
//   onContinue,
//   onLogin,
// }: RegisterFormProps) {
//   const { theme } = useTheme();

//   const sendOtp = useSendOtp();

//   /* =======================================================
//      FORM STATE
//   ======================================================= */

//   const [displayName, setDisplayName] =
//     useState("");

//   const [email, setEmail] =
//     useState("");

//   const [phone, setPhone] =
//     useState("");

//   const [password, setPassword] =
//     useState("");

//   const [confirmPassword, setConfirmPassword] =
//     useState("");

//   const [showPassword, setShowPassword] =
//     useState(false);

//   const [
//     showConfirmPassword,
//     setShowConfirmPassword,
//   ] = useState(false);

//   const [
//     focusedInput,
//     setFocusedInput,
//   ] = useState<
//     | "displayName"
//     | "email"
//     | "phone"
//     | "password"
//     | "confirmPassword"
//     | null
//   >(null);

//   const [errors, setErrors] =
//     useState<Record<string, string>>({});

//   /* =======================================================
//      VALIDATION
//   ======================================================= */

//   const validate = () => {
//     const newErrors: Record<
//       string,
//       string
//     > = {};

//     if (!displayName.trim()) {
//       newErrors.displayName =
//         "Full name is required.";
//     } else if (
//       displayName.trim().length < 3
//     ) {
//       newErrors.displayName =
//         "Full name must be at least 3 characters.";
//     }

//     if (!email.trim()) {
//       newErrors.email =
//         "Email is required.";
//     } else if (
//       !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
//         email.trim(),
//       )
//     ) {
//       newErrors.email =
//         "Please enter a valid email address.";
//     }

//     if (!phone.trim()) {
//       newErrors.phone =
//         "Phone number is required.";
//     } else if (
//       !/^[6-9]\d{9}$/.test(
//         phone.trim(),
//       )
//     ) {
//       newErrors.phone =
//         "Enter a valid 10-digit phone number.";
//     }

//     if (!password) {
//       newErrors.password =
//         "Password is required.";
//     } else if (
//       password.length < 8
//     ) {
//       newErrors.password =
//         "Password must be at least 8 characters.";
//     } else if (
//       !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#]).*$/.test(
//         password,
//       )
//     ) {
//       newErrors.password =
//         "Include uppercase, lowercase, number, and special character.";
//     }

//     if (!confirmPassword) {
//       newErrors.confirmPassword =
//         "Please confirm your password.";
//     } else if (
//       password !== confirmPassword
//     ) {
//       newErrors.confirmPassword =
//         "Passwords do not match.";
//     }

//     setErrors(newErrors);

//     return (
//       Object.keys(newErrors).length ===
//       0
//     );
//   };

//   /* =======================================================
//      CONTINUE
//   ======================================================= */

//   const handleContinue = async () => {
//     if (!validate()) {
//       return;
//     }

//     try {
//       await sendOtp.mutateAsync({
//         email: email.trim(),
//         purpose: "REGISTER",
//       });

//       onContinue({
//         displayName:
//           displayName.trim(),

//         email:
//           email.trim(),

//         phone:
//           phone.trim(),

//         password,

//         confirmPassword,
//       });
//     } catch (error) {
//       console.log(
//         "SEND REGISTER OTP ERROR:",
//         error,
//       );
//     }
//   };

//   /* =======================================================
//      PASSWORD RULES
//   ======================================================= */

//   const hasMinLength =
//     password.length >= 8;

//   const hasUpper =
//     /[A-Z]/.test(password);

//   const hasLower =
//     /[a-z]/.test(password);

//   const hasNumber =
//     /\d/.test(password);

//   const hasSpecial =
//     /[@$!%*?&#]/.test(password);

//   /* =======================================================
//      HELPERS
//   ======================================================= */

//   const getInputStyle = (
//     field:
//       | "displayName"
//       | "email"
//       | "phone"
//       | "password"
//       | "confirmPassword",
//   ) => [
//     styles.inputWrapper,
//     {
//       borderColor:
//         theme.border,

//       backgroundColor:
//         theme.surfaceSecondary,
//     },

//     focusedInput === field && {
//       borderColor:
//         theme.primary,

//       backgroundColor:
//         theme.surface,
//     },

//     errors[field] &&
//       styles.inputWrapperError,
//   ];

//   const getInputIconColor = (
//     field:
//       | "displayName"
//       | "email"
//       | "phone"
//       | "password"
//       | "confirmPassword",
//   ) =>
//     focusedInput === field
//       ? theme.primary
//       : theme.textSecondary;

//   /* =======================================================
//      RENDER
//   ======================================================= */

//   return (
//     <View
//       style={[
//         styles.card,
//         {
//           backgroundColor:
//             theme.surface,

//           borderColor:
//             theme.border,
//         },
//       ]}
//     >
//       {/* =================================================
//           HEADER
//       ================================================= */}

//       <View style={styles.header}>
//         <Text
//           style={[
//             styles.brandTitle,
//             {
//               color:
//                 theme.textSecondary,
//             },
//           ]}
//         >
//           BUDGETWISE
//         </Text>

//         <Text
//           style={[
//             styles.title,
//             {
//               color: theme.text,
//             },
//           ]}
//         >
//           Create an account
//         </Text>

//         <Text
//           style={[
//             styles.subtitle,
//             {
//               color:
//                 theme.textSecondary,
//             },
//           ]}
//         >
//           Enter your details below
//           to get started
//         </Text>
//       </View>

//       {/* =================================================
//           GOOGLE
//       ================================================= */}

//       <TouchableOpacity
//         style={[
//           styles.googleButton,
//           {
//             borderColor:
//               theme.border,

//             backgroundColor:
//               theme.surface,
//           },
//         ]}
//         onPress={onGoogleRegister}
//         disabled={
//           sendOtp.isPending
//         }
//         activeOpacity={0.85}
//       >
//         <View
//           style={
//             styles.googleIconWrapper
//           }
//         >
//           <GoogleIcon size={18} />
//         </View>

//         <Text
//           style={[
//             styles.googleButtonText,
//             {
//               color: theme.text,
//             },
//           ]}
//         >
//           Sign up with Google
//         </Text>
//       </TouchableOpacity>

//       {/* =================================================
//           DIVIDER
//       ================================================= */}

//       <View
//         style={
//           styles.dividerContainer
//         }
//       >
//         <View
//           style={[
//             styles.dividerLine,
//             {
//               backgroundColor:
//                 theme.border,
//             },
//           ]}
//         />

//         <Text
//           style={[
//             styles.dividerText,
//             {
//               color:
//                 theme.textSecondary,
//             },
//           ]}
//         >
//           OR WITH EMAIL
//         </Text>

//         <View
//           style={[
//             styles.dividerLine,
//             {
//               backgroundColor:
//                 theme.border,
//             },
//           ]}
//         />
//       </View>

//       {/* =================================================
//           FULL NAME
//       ================================================= */}

//       <View
//         style={
//           styles.fieldContainer
//         }
//       >
//         <Text
//           style={[
//             styles.label,
//             {
//               color: theme.text,
//             },
//           ]}
//         >
//           Full Name
//         </Text>

//         <View
//           style={getInputStyle(
//             "displayName",
//           )}
//         >
//           <User
//             size={18}
//             color={getInputIconColor(
//               "displayName",
//             )}
//             style={
//               styles.inputIcon
//             }
//           />

//           <TextInput
//             style={[
//               styles.input,
//               {
//                 color: theme.text,
//               },
//             ]}
//             placeholder="John Doe"
//             placeholderTextColor={
//               theme.textSecondary
//             }
//             value={displayName}
//             onFocus={() =>
//               setFocusedInput(
//                 "displayName",
//               )
//             }
//             onBlur={() =>
//               setFocusedInput(
//                 null,
//               )
//             }
//             onChangeText={(value) => {
//               setDisplayName(value);

//               if (
//                 errors.displayName
//               ) {
//                 setErrors((prev) => ({
//                   ...prev,
//                   displayName:
//                     "",
//                 }));
//               }
//             }}
//             autoCapitalize="words"
//             autoCorrect={false}
//           />
//         </View>

//         {errors.displayName && (
//           <Text
//             style={[
//               styles.errorText,
//               {
//                 color:
//                   theme.destructive,
//               },
//             ]}
//           >
//             {errors.displayName}
//           </Text>
//         )}
//       </View>

//       {/* =================================================
//           EMAIL
//       ================================================= */}

//       <View
//         style={
//           styles.fieldContainer
//         }
//       >
//         <Text
//           style={[
//             styles.label,
//             {
//               color: theme.text,
//             },
//           ]}
//         >
//           Email Address
//         </Text>

//         <View
//           style={getInputStyle(
//             "email",
//           )}
//         >
//           <Mail
//             size={18}
//             color={getInputIconColor(
//               "email",
//             )}
//             style={
//               styles.inputIcon
//             }
//           />

//           <TextInput
//             style={[
//               styles.input,
//               {
//                 color: theme.text,
//               },
//             ]}
//             placeholder="name@company.com"
//             placeholderTextColor={
//               theme.textSecondary
//             }
//             value={email}
//             onFocus={() =>
//               setFocusedInput(
//                 "email",
//               )
//             }
//             onBlur={() =>
//               setFocusedInput(
//                 null,
//               )
//             }
//             onChangeText={(value) => {
//               setEmail(value);

//               if (errors.email) {
//                 setErrors((prev) => ({
//                   ...prev,
//                   email: "",
//                 }));
//               }
//             }}
//             autoCapitalize="none"
//             autoCorrect={false}
//             keyboardType="email-address"
//             autoComplete="email"
//           />
//         </View>

//         {errors.email && (
//           <Text
//             style={[
//               styles.errorText,
//               {
//                 color:
//                   theme.destructive,
//               },
//             ]}
//           >
//             {errors.email}
//           </Text>
//         )}
//       </View>

//       {/* =================================================
//           PHONE
//       ================================================= */}

//       <View
//         style={
//           styles.fieldContainer
//         }
//       >
//         <Text
//           style={[
//             styles.label,
//             {
//               color: theme.text,
//             },
//           ]}
//         >
//           Phone Number
//         </Text>

//         <View
//           style={getInputStyle(
//             "phone",
//           )}
//         >
//           <Phone
//             size={18}
//             color={getInputIconColor(
//               "phone",
//             )}
//             style={
//               styles.inputIcon
//             }
//           />

//           <TextInput
//             style={[
//               styles.input,
//               {
//                 color: theme.text,
//               },
//             ]}
//             placeholder="9876543210"
//             placeholderTextColor={
//               theme.textSecondary
//             }
//             value={phone}
//             onFocus={() =>
//               setFocusedInput(
//                 "phone",
//               )
//             }
//             onBlur={() =>
//               setFocusedInput(
//                 null,
//               )
//             }
//             onChangeText={(value) => {
//               setPhone(value);

//               if (errors.phone) {
//                 setErrors((prev) => ({
//                   ...prev,
//                   phone: "",
//                 }));
//               }
//             }}
//             keyboardType="phone-pad"
//             autoComplete="tel"
//             maxLength={10}
//           />
//         </View>

//         {errors.phone && (
//           <Text
//             style={[
//               styles.errorText,
//               {
//                 color:
//                   theme.destructive,
//               },
//             ]}
//           >
//             {errors.phone}
//           </Text>
//         )}
//       </View>

//       {/* =================================================
//           PASSWORD
//       ================================================= */}

//       <View
//         style={
//           styles.fieldContainer
//         }
//       >
//         <Text
//           style={[
//             styles.label,
//             {
//               color: theme.text,
//             },
//           ]}
//         >
//           Password
//         </Text>

//         <View
//           style={getInputStyle(
//             "password",
//           )}
//         >
//           <Lock
//             size={18}
//             color={getInputIconColor(
//               "password",
//             )}
//             style={
//               styles.inputIcon
//             }
//           />

//           <TextInput
//             style={[
//               styles.input,
//               {
//                 color: theme.text,
//               },
//             ]}
//             placeholder="••••••••"
//             placeholderTextColor={
//               theme.textSecondary
//             }
//             value={password}
//             onFocus={() =>
//               setFocusedInput(
//                 "password",
//               )
//             }
//             onBlur={() =>
//               setFocusedInput(
//                 null,
//               )
//             }
//             onChangeText={(value) => {
//               setPassword(value);

//               if (errors.password) {
//                 setErrors((prev) => ({
//                   ...prev,
//                   password: "",
//                 }));
//               }
//             }}
//             secureTextEntry={
//               !showPassword
//             }
//             autoCapitalize="none"
//             autoComplete="new-password"
//           />

//           <TouchableOpacity
//             onPress={() =>
//               setShowPassword(
//                 (prev) => !prev,
//               )
//             }
//             hitSlop={{
//               top: 10,
//               bottom: 10,
//               left: 10,
//               right: 10,
//             }}
//           >
//             {showPassword ? (
//               <EyeOff
//                 size={18}
//                 color={
//                   theme.textSecondary
//                 }
//               />
//             ) : (
//               <Eye
//                 size={18}
//                 color={
//                   theme.textSecondary
//                 }
//               />
//             )}
//           </TouchableOpacity>
//         </View>

//         {password.length > 0 && (
//           <View
//             style={
//               styles.criteriaContainer
//             }
//           >
//             <CriteriaItem
//               label="8+ chars"
//               active={hasMinLength}
//               theme={theme}
//             />

//             <CriteriaItem
//               label="Uppercase"
//               active={hasUpper}
//               theme={theme}
//             />

//             <CriteriaItem
//               label="Lowercase"
//               active={hasLower}
//               theme={theme}
//             />

//             <CriteriaItem
//               label="Number"
//               active={hasNumber}
//               theme={theme}
//             />

//             <CriteriaItem
//               label="Symbol"
//               active={hasSpecial}
//               theme={theme}
//             />
//           </View>
//         )}

//         {errors.password && (
//           <Text
//             style={[
//               styles.errorText,
//               {
//                 color:
//                   theme.destructive,
//               },
//             ]}
//           >
//             {errors.password}
//           </Text>
//         )}
//       </View>

//       {/* =================================================
//           CONFIRM PASSWORD
//       ================================================= */}

//       <View
//         style={
//           styles.fieldContainer
//         }
//       >
//         <Text
//           style={[
//             styles.label,
//             {
//               color: theme.text,
//             },
//           ]}
//         >
//           Confirm Password
//         </Text>

//         <View
//           style={getInputStyle(
//             "confirmPassword",
//           )}
//         >
//           <Lock
//             size={18}
//             color={getInputIconColor(
//               "confirmPassword",
//             )}
//             style={
//               styles.inputIcon
//             }
//           />

//           <TextInput
//             style={[
//               styles.input,
//               {
//                 color: theme.text,
//               },
//             ]}
//             placeholder="••••••••"
//             placeholderTextColor={
//               theme.textSecondary
//             }
//             value={confirmPassword}
//             onFocus={() =>
//               setFocusedInput(
//                 "confirmPassword",
//               )
//             }
//             onBlur={() =>
//               setFocusedInput(
//                 null,
//               )
//             }
//             onChangeText={(value) => {
//               setConfirmPassword(
//                 value,
//               );

//               if (
//                 errors.confirmPassword
//               ) {
//                 setErrors((prev) => ({
//                   ...prev,
//                   confirmPassword:
//                     "",
//                 }));
//               }
//             }}
//             secureTextEntry={
//               !showConfirmPassword
//             }
//             autoCapitalize="none"
//             autoComplete="new-password"
//           />

//           <TouchableOpacity
//             onPress={() =>
//               setShowConfirmPassword(
//                 (prev) => !prev,
//               )
//             }
//             hitSlop={{
//               top: 10,
//               bottom: 10,
//               left: 10,
//               right: 10,
//             }}
//           >
//             {showConfirmPassword ? (
//               <EyeOff
//                 size={18}
//                 color={
//                   theme.textSecondary
//                 }
//               />
//             ) : (
//               <Eye
//                 size={18}
//                 color={
//                   theme.textSecondary
//                 }
//               />
//             )}
//           </TouchableOpacity>
//         </View>

//         {errors.confirmPassword && (
//           <Text
//             style={[
//               styles.errorText,
//               {
//                 color:
//                   theme.destructive,
//               },
//             ]}
//           >
//             {
//               errors.confirmPassword
//             }
//           </Text>
//         )}
//       </View>

//       {/* =================================================
//           SUBMIT
//       ================================================= */}

//       <TouchableOpacity
//         style={[
//           styles.primaryButton,
//           {
//             backgroundColor:
//               theme.primary,
//           },

//           sendOtp.isPending &&
//             styles.disabledButton,
//         ]}
//         onPress={handleContinue}
//         disabled={
//           sendOtp.isPending
//         }
//         activeOpacity={0.9}
//       >
//         {sendOtp.isPending ? (
//           <ActivityIndicator
//             color={
//               theme.primaryText
//             }
//             size="small"
//           />
//         ) : (
//           <View
//             style={
//               styles.buttonContent
//             }
//           >
//             <Text
//               style={[
//                 styles.primaryButtonText,
//                 {
//                   color:
//                     theme.primaryText,
//                 },
//               ]}
//             >
//               Continue with Email
//             </Text>

//             <ArrowRight
//               size={16}
//               color={
//                 theme.primaryText
//               }
//               style={{
//                 marginLeft: 6,
//               }}
//             />
//           </View>
//         )}
//       </TouchableOpacity>

//       {/* =================================================
//           LOGIN LINK
//       ================================================= */}

//       <View
//         style={
//           styles.loginContainer
//         }
//       >
//         <Text
//           style={[
//             styles.loginText,
//             {
//               color:
//                 theme.textSecondary,
//             },
//           ]}
//         >
//           Already have an account?
//         </Text>

//         <TouchableOpacity
//           onPress={onLogin}
//           disabled={
//             sendOtp.isPending
//           }
//           activeOpacity={0.7}
//         >
//           <Text
//             style={[
//               styles.loginLink,
//               {
//                 color:
//                   theme.primary,
//               },
//             ]}
//           >
//             Sign in
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// /* =========================================================
//    PASSWORD CRITERIA
// ========================================================= */

// function CriteriaItem({
//   label,
//   active,
//   theme,
// }: {
//   label: string;
//   active: boolean;
//   theme: any;
// }) {
//   return (
//     <View
//       style={
//         styles.criteriaItem
//       }
//     >
//       <CheckCircle2
//         size={12}
//         color={
//           active
//             ? theme.success
//             : theme.border
//         }
//       />

//       <Text
//         style={[
//           styles.criteriaText,
//           {
//             color: active
//               ? theme.success
//               : theme.textSecondary,
//           },
//         ]}
//       >
//         {label}
//       </Text>
//     </View>
//   );
// }

// /* =========================================================
//    STYLES
// ========================================================= */

// const styles =
//   StyleSheet.create({
//     card: {
//       width: "100%",

//       maxWidth: 440,

//       alignSelf: "center",

//       borderRadius: 16,

//       borderWidth: 1,

//       paddingHorizontal: 24,

//       paddingVertical: 28,

//       shadowColor: "#000000",

//       shadowOffset: {
//         width: 0,
//         height: 8,
//       },

//       shadowOpacity: 0.04,

//       shadowRadius: 16,

//       elevation: 2,
//     },

//     /* =====================================================
//        HEADER
//     ===================================================== */

//     header: {
//       alignItems: "center",

//       marginBottom: 24,
//     },

//     brandTitle: {
//       fontSize: 12,

//       fontWeight: "800",

//       letterSpacing: 3,

//       textTransform: "uppercase",

//       marginBottom: 10,
//     },

//     title: {
//       fontSize: 24,

//       fontWeight: "700",

//       textAlign: "center",

//       letterSpacing: -0.5,
//     },

//     subtitle: {
//       marginTop: 6,

//       fontSize: 14,

//       lineHeight: 20,

//       textAlign: "center",
//     },

//     /* =====================================================
//        GOOGLE
//     ===================================================== */

//     googleButton: {
//       height: 48,

//       borderRadius: 10,

//       borderWidth: 1,

//       flexDirection: "row",

//       alignItems: "center",

//       justifyContent: "center",
//     },

//     googleIconWrapper: {
//       marginRight: 10,
//     },

//     googleButtonText: {
//       fontSize: 14,

//       fontWeight: "600",
//     },

//     /* =====================================================
//        DIVIDER
//     ===================================================== */

//     dividerContainer: {
//       flexDirection: "row",

//       alignItems: "center",

//       marginVertical: 22,
//     },

//     dividerLine: {
//       flex: 1,

//       height: 1,
//     },

//     dividerText: {
//       marginHorizontal: 12,

//       fontSize: 11,

//       fontWeight: "600",

//       letterSpacing: 0.8,
//     },

//     /* =====================================================
//        FORM
//     ===================================================== */

//     fieldContainer: {
//       marginBottom: 16,
//     },

//     label: {
//       marginBottom: 6,

//       fontSize: 13,

//       fontWeight: "600",
//     },

//     inputWrapper: {
//       height: 48,

//       borderWidth: 1,

//       borderRadius: 10,

//       flexDirection: "row",

//       alignItems: "center",

//       paddingHorizontal: 14,
//     },

//     inputWrapperError: {
//       borderColor: "#EF4444",
//     },

//     inputIcon: {
//       marginRight: 10,
//     },

//     input: {
//       flex: 1,

//       height: "100%",

//       fontSize: 14,
//     },

//     /* =====================================================
//        PASSWORD CRITERIA
//     ===================================================== */

//     criteriaContainer: {
//       flexDirection: "row",

//       flexWrap: "wrap",

//       gap: 8,

//       marginTop: 8,
//     },

//     criteriaItem: {
//       flexDirection: "row",

//       alignItems: "center",
//     },

//     criteriaText: {
//       fontSize: 11,

//       marginLeft: 3,
//     },

//     /* =====================================================
//        ERROR
//     ===================================================== */

//     errorText: {
//       marginTop: 5,

//       fontSize: 12,
//     },

//     /* =====================================================
//        BUTTON
//     ===================================================== */

//     primaryButton: {
//       height: 48,

//       borderRadius: 10,

//       alignItems: "center",

//       justifyContent: "center",

//       marginTop: 8,
//     },

//     buttonContent: {
//       flexDirection: "row",

//       alignItems: "center",
//     },

//     disabledButton: {
//       opacity: 0.7,
//     },

//     primaryButtonText: {
//       fontSize: 14,

//       fontWeight: "600",
//     },

//     /* =====================================================
//        LOGIN
//     ===================================================== */

//     loginContainer: {
//       flexDirection: "row",

//       justifyContent: "center",

//       alignItems: "center",

//       marginTop: 22,
//     },

//     loginText: {
//       fontSize: 14,
//     },

//     loginLink: {
//       fontSize: 14,

//       fontWeight: "600",

//       marginLeft: 4,
//     },
//   });

import { useState } from "react";

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react-native";

import Svg, { Path } from "react-native-svg";

import { useTheme } from "../../../providers/ThemeProvider";

import { useSendOtp } from "../hooks/use-send-otp";
import { getDeviceId } from "../../../lib/device";

/* =========================================================
   REGISTRATION DATA
========================================================= */

export interface RegistrationData {
  displayName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  deviceId: string;
}

/* =========================================================
   PROPS
========================================================= */

interface RegisterFormProps {
  onGoogleRegister: () => void;

  onContinue: (data: RegistrationData) => void;

  onLogin: () => void;
}

/* =========================================================
   GOOGLE ICON
========================================================= */

function GoogleIcon({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
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
   COMPONENT
========================================================= */

export default function RegisterForm({
  onGoogleRegister,
  onContinue,
  onLogin,
}: RegisterFormProps) {
  const { theme } = useTheme();

  const sendOtp = useSendOtp();

  /* =======================================================
     FORM STATE
  ======================================================= */

  const [displayName, setDisplayName] = useState("");

  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [focusedInput, setFocusedInput] = useState<
    "displayName" | "email" | "phone" | "password" | "confirmPassword" | null
  >(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validate = () => {
    const newErrors: Record<string, string> = {};

    /* NAME */

    if (!displayName.trim()) {
      newErrors.displayName = "Full name is required.";
    } else if (displayName.trim().length < 3) {
      newErrors.displayName = "Full name must be at least 3 characters.";
    }

    /* EMAIL */

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    /* PHONE */

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      newErrors.phone = "Enter a valid 10-digit phone number.";
    }

    /* PASSWORD */

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    } else if (
      !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#]).*$/.test(password)
    ) {
      newErrors.password =
        "Include uppercase, lowercase, number, and special character.";
    }

    /* CONFIRM PASSWORD */

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* =======================================================
     CONTINUE
  ======================================================= */

  const handleContinue = async () => {
    if (!validate()) {
      return;
    }

    try {
      const normalizedEmail = email.trim().toLowerCase();

      const deviceId = await getDeviceId();
      

      await sendOtp.mutateAsync({
        email: email.trim().toLowerCase(),
        purpose: "REGISTER",
      });

      /*
       * OTP successfully sent.
       *
       * Pass registration data to the screen.
       */

      onContinue({
        displayName: displayName.trim(),

        email: email.trim().toLowerCase(),

        phone: phone.trim(),

        password,

        confirmPassword,
        deviceId,
      });
    } catch (error: any) {
      console.log("SEND REGISTER OTP ERROR:", error);

      console.log("SEND REGISTER OTP RESPONSE:", error?.response?.data);

      /*
       * Show backend error.
       */

      setErrors((previous) => ({
        ...previous,

        email:
          error?.response?.data?.message ?? "Unable to send verification code.",
      }));
    }
  };

  /* =======================================================
     PASSWORD RULES
  ======================================================= */

  const hasMinLength = password.length >= 8;

  const hasUpper = /[A-Z]/.test(password);

  const hasLower = /[a-z]/.test(password);

  const hasNumber = /\d/.test(password);

  const hasSpecial = /[@$!%*?&#]/.test(password);

  /* =======================================================
     INPUT HELPERS
  ======================================================= */

  const getInputStyle = (
    field: "displayName" | "email" | "phone" | "password" | "confirmPassword",
  ) => [
    styles.inputWrapper,
    {
      borderColor: theme.border,

      backgroundColor: theme.surfaceSecondary,
    },

    focusedInput === field && {
      borderColor: theme.primary,

      backgroundColor: theme.surface,
    },

    errors[field] && styles.inputWrapperError,
  ];

  const getInputIconColor = (
    field: "displayName" | "email" | "phone" | "password" | "confirmPassword",
  ) => (focusedInput === field ? theme.primary : theme.textSecondary);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.surface,

          borderColor: theme.border,
        },
      ]}
    >
      {/* HEADER */}

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
          Create an account
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              color: theme.textSecondary,
            },
          ]}
        >
          Enter your details below to get started
        </Text>
      </View>

      {/* GOOGLE */}

      <TouchableOpacity
        style={[
          styles.googleButton,
          {
            borderColor: theme.border,

            backgroundColor: theme.surface,
          },
        ]}
        onPress={onGoogleRegister}
        disabled={sendOtp.isPending}
        activeOpacity={0.85}
      >
        <View style={styles.googleIconWrapper}>
          <GoogleIcon size={18} />
        </View>

        <Text
          style={[
            styles.googleButtonText,
            {
              color: theme.text,
            },
          ]}
        >
          Sign up with Google
        </Text>
      </TouchableOpacity>

      {/* DIVIDER */}

      <View style={styles.dividerContainer}>
        <View
          style={[
            styles.dividerLine,
            {
              backgroundColor: theme.border,
            },
          ]}
        />

        <Text
          style={[
            styles.dividerText,
            {
              color: theme.textSecondary,
            },
          ]}
        >
          OR WITH EMAIL
        </Text>

        <View
          style={[
            styles.dividerLine,
            {
              backgroundColor: theme.border,
            },
          ]}
        />
      </View>

      {/* FULL NAME */}

      <View style={styles.fieldContainer}>
        <Text
          style={[
            styles.label,
            {
              color: theme.text,
            },
          ]}
        >
          Full Name
        </Text>

        <View style={getInputStyle("displayName")}>
          <User
            size={18}
            color={getInputIconColor("displayName")}
            style={styles.inputIcon}
          />

          <TextInput
            style={[
              styles.input,
              {
                color: theme.text,
              },
            ]}
            placeholder="John Doe"
            placeholderTextColor={theme.textSecondary}
            value={displayName}
            onFocus={() => setFocusedInput("displayName")}
            onBlur={() => setFocusedInput(null)}
            onChangeText={(value) => {
              setDisplayName(value);

              if (errors.displayName) {
                setErrors((prev) => ({
                  ...prev,
                  displayName: "",
                }));
              }
            }}
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>

        {errors.displayName && (
          <Text
            style={[
              styles.errorText,
              {
                color: theme.destructive,
              },
            ]}
          >
            {errors.displayName}
          </Text>
        )}
      </View>

      {/* EMAIL */}

      <View style={styles.fieldContainer}>
        <Text
          style={[
            styles.label,
            {
              color: theme.text,
            },
          ]}
        >
          Email Address
        </Text>

        <View style={getInputStyle("email")}>
          <Mail
            size={18}
            color={getInputIconColor("email")}
            style={styles.inputIcon}
          />

          <TextInput
            style={[
              styles.input,
              {
                color: theme.text,
              },
            ]}
            placeholder="name@company.com"
            placeholderTextColor={theme.textSecondary}
            value={email}
            onFocus={() => setFocusedInput("email")}
            onBlur={() => setFocusedInput(null)}
            onChangeText={(value) => {
              setEmail(value);

              if (errors.email) {
                setErrors((prev) => ({
                  ...prev,
                  email: "",
                }));
              }
            }}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            autoComplete="email"
          />
        </View>

        {errors.email && (
          <Text
            style={[
              styles.errorText,
              {
                color: theme.destructive,
              },
            ]}
          >
            {errors.email}
          </Text>
        )}
      </View>

      {/* PHONE */}

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

        <View style={getInputStyle("phone")}>
          <Phone
            size={18}
            color={getInputIconColor("phone")}
            style={styles.inputIcon}
          />

          <TextInput
            style={[
              styles.input,
              {
                color: theme.text,
              },
            ]}
            placeholder="9876543210"
            placeholderTextColor={theme.textSecondary}
            value={phone}
            onFocus={() => setFocusedInput("phone")}
            onBlur={() => setFocusedInput(null)}
            onChangeText={(value) => {
              const cleaned = value.replace(/\D/g, "").slice(0, 10);

              setPhone(cleaned);

              if (errors.phone) {
                setErrors((prev) => ({
                  ...prev,
                  phone: "",
                }));
              }
            }}
            keyboardType="phone-pad"
            autoComplete="tel"
            maxLength={10}
          />
        </View>

        {errors.phone && (
          <Text
            style={[
              styles.errorText,
              {
                color: theme.destructive,
              },
            ]}
          >
            {errors.phone}
          </Text>
        )}
      </View>

      {/* PASSWORD */}

      <View style={styles.fieldContainer}>
        <Text
          style={[
            styles.label,
            {
              color: theme.text,
            },
          ]}
        >
          Password
        </Text>

        <View style={getInputStyle("password")}>
          <Lock
            size={18}
            color={getInputIconColor("password")}
            style={styles.inputIcon}
          />

          <TextInput
            style={[
              styles.input,
              {
                color: theme.text,
              },
            ]}
            placeholder="••••••••"
            placeholderTextColor={theme.textSecondary}
            value={password}
            onFocus={() => setFocusedInput("password")}
            onBlur={() => setFocusedInput(null)}
            onChangeText={(value) => {
              setPassword(value);

              if (errors.password) {
                setErrors((prev) => ({
                  ...prev,
                  password: "",
                }));
              }
            }}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoComplete="new-password"
          />

          <TouchableOpacity
            onPress={() => setShowPassword((prev) => !prev)}
            hitSlop={10}
          >
            {showPassword ? (
              <EyeOff size={18} color={theme.textSecondary} />
            ) : (
              <Eye size={18} color={theme.textSecondary} />
            )}
          </TouchableOpacity>
        </View>

        {password.length > 0 && (
          <View style={styles.criteriaContainer}>
            <CriteriaItem
              label="8+ chars"
              active={hasMinLength}
              theme={theme}
            />

            <CriteriaItem label="Uppercase" active={hasUpper} theme={theme} />

            <CriteriaItem label="Lowercase" active={hasLower} theme={theme} />

            <CriteriaItem label="Number" active={hasNumber} theme={theme} />

            <CriteriaItem label="Symbol" active={hasSpecial} theme={theme} />
          </View>
        )}

        {errors.password && (
          <Text
            style={[
              styles.errorText,
              {
                color: theme.destructive,
              },
            ]}
          >
            {errors.password}
          </Text>
        )}
      </View>

      {/* CONFIRM PASSWORD */}

      <View style={styles.fieldContainer}>
        <Text
          style={[
            styles.label,
            {
              color: theme.text,
            },
          ]}
        >
          Confirm Password
        </Text>

        <View style={getInputStyle("confirmPassword")}>
          <Lock
            size={18}
            color={getInputIconColor("confirmPassword")}
            style={styles.inputIcon}
          />

          <TextInput
            style={[
              styles.input,
              {
                color: theme.text,
              },
            ]}
            placeholder="••••••••"
            placeholderTextColor={theme.textSecondary}
            value={confirmPassword}
            onFocus={() => setFocusedInput("confirmPassword")}
            onBlur={() => setFocusedInput(null)}
            onChangeText={(value) => {
              setConfirmPassword(value);

              if (errors.confirmPassword) {
                setErrors((prev) => ({
                  ...prev,
                  confirmPassword: "",
                }));
              }
            }}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            autoComplete="new-password"
          />

          <TouchableOpacity
            onPress={() => setShowConfirmPassword((prev) => !prev)}
            hitSlop={10}
          >
            {showConfirmPassword ? (
              <EyeOff size={18} color={theme.textSecondary} />
            ) : (
              <Eye size={18} color={theme.textSecondary} />
            )}
          </TouchableOpacity>
        </View>

        {errors.confirmPassword && (
          <Text
            style={[
              styles.errorText,
              {
                color: theme.destructive,
              },
            ]}
          >
            {errors.confirmPassword}
          </Text>
        )}
      </View>

      {/* SUBMIT */}

      <TouchableOpacity
        style={[
          styles.primaryButton,
          {
            backgroundColor: theme.primary,
          },

          sendOtp.isPending && styles.disabledButton,
        ]}
        onPress={handleContinue}
        disabled={sendOtp.isPending}
        activeOpacity={0.9}
      >
        {sendOtp.isPending ? (
          <ActivityIndicator color={theme.primaryText} size="small" />
        ) : (
          <View style={styles.buttonContent}>
            <Text
              style={[
                styles.primaryButtonText,
                {
                  color: theme.primaryText,
                },
              ]}
            >
              Continue with Email
            </Text>

            <ArrowRight
              size={16}
              color={theme.primaryText}
              style={{
                marginLeft: 6,
              }}
            />
          </View>
        )}
      </TouchableOpacity>

      {/* LOGIN */}

      <View style={styles.loginContainer}>
        <Text
          style={[
            styles.loginText,
            {
              color: theme.textSecondary,
            },
          ]}
        >
          Already have an account?
        </Text>

        <TouchableOpacity
          onPress={onLogin}
          disabled={sendOtp.isPending}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.loginLink,
              {
                color: theme.primary,
              },
            ]}
          >
            Sign in
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* =========================================================
   PASSWORD CRITERIA
========================================================= */

function CriteriaItem({
  label,
  active,
  theme,
}: {
  label: string;
  active: boolean;
  theme: any;
}) {
  return (
    <View style={styles.criteriaItem}>
      <CheckCircle2 size={12} color={active ? theme.success : theme.border} />

      <Text
        style={[
          styles.criteriaText,
          {
            color: active ? theme.success : theme.textSecondary,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
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

  header: {
    alignItems: "center",
    marginBottom: 24,
  },

  brandTitle: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 10,
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

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 22,
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

  inputWrapperError: {
    borderColor: "#EF4444",
  },

  inputIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    height: "100%",
    fontSize: 14,
  },

  criteriaContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },

  criteriaItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  criteriaText: {
    fontSize: 11,
    marginLeft: 3,
  },

  errorText: {
    marginTop: 5,
    fontSize: 12,
  },

  primaryButton: {
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

  disabledButton: {
    opacity: 0.7,
  },

  primaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
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
