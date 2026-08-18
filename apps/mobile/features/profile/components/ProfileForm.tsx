
import { useEffect } from "react";

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  useForm,
  Controller,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  Briefcase,
  Check,
  Clock,
  DollarSign,
  Globe,
  Mail,
  Phone,
  User,
  X,
} from "lucide-react-native";

import { useProfile } from "../hooks/use-profile";
import { useUpdateProfile } from "../hooks/use-update-profile";

import ProfileAvatar from "./ProfileAvatar";

import {
  updateProfileSchema,
  type UpdateProfileSchema,
} from "../schema/update-profile.schema";

import { useTheme } from "../../../providers/ThemeProvider";

const BOTTOM_NAV_HEIGHT = 72;
const BOTTOM_CONTENT_SPACING = 40;

export default function ProfileForm() {
  const {
    data,
    isLoading,
    isError,
  } = useProfile();

  const updateProfile =
    useUpdateProfile();

  const profile = data?.data;

  const { theme } = useTheme();

  const {
    control,
    handleSubmit,
    reset,
    formState: {
      errors,
      isDirty,
    },
  } = useForm<UpdateProfileSchema>({
    resolver: zodResolver(
      updateProfileSchema,
    ),

    defaultValues: {
      displayName: "",
      monthlyIncome: undefined,
      occupation: "",
      country: "",
      timezone: "",
    },
  });

  /* =====================================================
     LOAD PROFILE
  ===================================================== */

  useEffect(() => {
    if (!profile) {
      return;
    }

    reset({
      displayName:
        profile.displayName ?? "",

      monthlyIncome:
        profile.monthlyIncome ??
        undefined,

      occupation:
        profile.occupation ?? "",

      country:
        profile.country ?? "",

      timezone:
        profile.timezone ?? "",
    });
  }, [profile, reset]);

  /* =====================================================
     CANCEL
  ===================================================== */

  const handleCancel = () => {
    if (!profile) {
      return;
    }

    reset({
      displayName:
        profile.displayName ?? "",

      monthlyIncome:
        profile.monthlyIncome ??
        undefined,

      occupation:
        profile.occupation ?? "",

      country:
        profile.country ?? "",

      timezone:
        profile.timezone ?? "",
    });
  };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const onSubmit = async (
    values: UpdateProfileSchema,
  ) => {
    await updateProfile.mutateAsync(
      values,
    );
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (isLoading) {
    return (
      <View
        style={[
          styles.center,
          {
            backgroundColor:
              theme.background,
          },
        ]}
      >
        <ActivityIndicator
          size="small"
          color={theme.primary}
        />

        <Text
          style={[
            styles.loadingText,
            {
              color:
                theme.textSecondary,
            },
          ]}
        >
          Loading profile...
        </Text>
      </View>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (isError || !profile) {
    return (
      <View
        style={[
          styles.errorCard,
          {
            backgroundColor:
              theme.surface,
            borderColor:
              theme.destructive,
          },
        ]}
      >
        <Text
          style={[
            styles.errorText,
            {
              color:
                theme.destructive,
            },
          ]}
        >
          Unable to load profile data.
        </Text>
      </View>
    );
  }

  /* =====================================================
     MAIN
  ===================================================== */

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
        showsVerticalScrollIndicator={
          false
        }
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom:
              BOTTOM_NAV_HEIGHT +
              BOTTOM_CONTENT_SPACING,
          },
        ]}
      >
        {/* =================================================
            PROFILE HEADER
        ================================================= */}

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <ProfileAvatar
              profile={profile}
            />

            <View style={styles.heading}>
              <Text
                style={[
                  styles.title,
                  {
                    color: theme.text,
                  },
                ]}
              >
                {profile.displayName ||
                  "Profile"}
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
                Manage your account
                information
              </Text>
            </View>
          </View>
        </View>

        {/* =================================================
            PERSONAL INFORMATION
        ================================================= */}

        <SectionTitle
          title="Personal Information"
          color={theme.text}
        />

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
          {/* Display Name */}

          <Controller
            control={control}
            name="displayName"
            render={({
              field: {
                onChange,
                onBlur,
                value,
              },
            }) => (
              <FormField
                label="Display Name"
                icon={User}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                editable
                placeholder="Enter your name"
                error={
                  errors.displayName
                    ?.message
                }
                theme={theme}
              />
            )}
          />

          {/* Email */}

          <FormField
            label="Email Address"
            icon={Mail}
            value={profile.email}
            editable={false}
            helper="Email cannot be changed directly"
            theme={theme}
          />

          {/* Phone */}

          <FormField
            label="Phone Number"
            icon={Phone}
            value={
              profile.phone ||
              "Not provided"
            }
            editable={false}
            helper="Requires OTP verification to modify"
            theme={theme}
          />
        </View>

        {/* =================================================
            ADDITIONAL INFORMATION
        ================================================= */}

        <SectionTitle
          title="Additional Information"
          color={theme.text}
        />

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
          {/* Monthly Income */}

          <Controller
            control={control}
            name="monthlyIncome"
            render={({
              field: {
                onChange,
                onBlur,
                value,
              },
            }) => (
              <FormField
                label="Monthly Income"
                icon={DollarSign}
                value={
                  value !== undefined &&
                  value !== null
                    ? String(value)
                    : ""
                }
                onChangeText={(text) => {
                  if (text === "") {
                    onChange(undefined);
                    return;
                  }

                  const number =
                    Number(text);

                  onChange(
                    Number.isNaN(number)
                      ? undefined
                      : number,
                  );
                }}
                onBlur={onBlur}
                editable
                keyboardType="numeric"
                placeholder="0.00"
                error={
                  errors.monthlyIncome
                    ?.message
                }
                theme={theme}
              />
            )}
          />

          {/* Occupation */}

          <Controller
            control={control}
            name="occupation"
            render={({
              field: {
                onChange,
                onBlur,
                value,
              },
            }) => (
              <FormField
                label="Occupation"
                icon={Briefcase}
                value={value ?? ""}
                onChangeText={onChange}
                onBlur={onBlur}
                editable
                placeholder="Software Engineer"
                error={
                  errors.occupation
                    ?.message
                }
                theme={theme}
              />
            )}
          />

          {/* Country */}

          <Controller
            control={control}
            name="country"
            render={({
              field: {
                onChange,
                onBlur,
                value,
              },
            }) => (
              <FormField
                label="Country"
                icon={Globe}
                value={value ?? ""}
                onChangeText={onChange}
                onBlur={onBlur}
                editable
                placeholder="India"
                error={
                  errors.country
                    ?.message
                }
                theme={theme}
              />
            )}
          />

          {/* Timezone */}

          <Controller
            control={control}
            name="timezone"
            render={({
              field: {
                onChange,
                onBlur,
                value,
              },
            }) => (
              <FormField
                label="Timezone"
                icon={Clock}
                value={value ?? ""}
                onChangeText={onChange}
                onBlur={onBlur}
                editable
                placeholder="Asia/Kolkata"
                error={
                  errors.timezone
                    ?.message
                }
                theme={theme}
              />
            )}
          />
        </View>

        {/* =================================================
            ACTIONS
        ================================================= */}

        {isDirty && (
          <View style={styles.actions}>
            {/* Cancel */}

            <Pressable
              onPress={handleCancel}
              disabled={
                updateProfile.isPending
              }
              style={({ pressed }) => [
                styles.action,

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
              <X
                size={17}
                color={theme.text}
              />

              <Text
                style={[
                  styles.cancelText,
                  {
                    color: theme.text,
                  },
                ]}
              >
                Cancel
              </Text>
            </Pressable>

            {/* Save */}

            <Pressable
              onPress={handleSubmit(
                onSubmit,
              )}
              disabled={
                updateProfile.isPending
              }
              style={({ pressed }) => [
                styles.action,

                {
                  backgroundColor:
                    theme.primary,
                },

                pressed &&
                  styles.pressed,
              ]}
            >
              {updateProfile.isPending ? (
                <ActivityIndicator
                  size="small"
                  color={
                    theme.primaryText
                  }
                />
              ) : (
                <Check
                  size={17}
                  color={
                    theme.primaryText
                  }
                />
              )}

              <Text
                style={[
                  styles.saveText,
                  {
                    color:
                      theme.primaryText,
                  },
                ]}
              >
                {updateProfile.isPending
                  ? "Saving..."
                  : "Save Changes"}
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* =====================================================
   SECTION TITLE
===================================================== */

function SectionTitle({
  title,
  color,
}: {
  title: string;
  color: string;
}) {
  return (
    <Text
      style={[
        styles.sectionTitle,
        {
          color,
        },
      ]}
    >
      {title}
    </Text>
  );
}

/* =====================================================
   FORM FIELD
===================================================== */

interface FormFieldProps {
  label: string;

  icon: React.ComponentType<{
    size?: number;
    color?: string;
    strokeWidth?: number;
  }>;

  value: string;

  editable?: boolean;

  placeholder?: string;

  helper?: string;

  error?: string;

  keyboardType?:
    | "default"
    | "numeric"
    | "email-address"
    | "phone-pad";

  onChangeText?: (
    text: string,
  ) => void;

  onBlur?: () => void;

  theme: {
    background: string;
    surface: string;
    surfaceSecondary: string;
    text: string;
    textSecondary: string;
    border: string;
    primary: string;
    primaryText: string;
    muted: string;
    destructive: string;
  };
}

function FormField({
  label,
  icon: Icon,
  value,
  editable = true,
  placeholder,
  helper,
  error,
  keyboardType = "default",
  onChangeText,
  onBlur,
  theme,
}: FormFieldProps) {
  return (
    <View style={styles.field}>
      {/* Label */}

      <Text
        style={[
          styles.label,
          {
            color: theme.text,
          },
        ]}
      >
        {label}
      </Text>

      {/* Input */}

      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor:
              editable
                ? theme.surface
                : theme.surfaceSecondary,

            borderColor: error
              ? theme.destructive
              : theme.border,
          },
        ]}
      >
        <Icon
          size={18}
          color={
            editable
              ? theme.textSecondary
              : theme.textSecondary
          }
        />

        <TextInput
          value={value}
          editable={editable}
          onChangeText={
            onChangeText
          }
          onBlur={onBlur}
          placeholder={
            placeholder
          }
          placeholderTextColor={
            theme.textSecondary
          }
          keyboardType={
            keyboardType
          }
          style={[
            styles.input,
            {
              color: theme.text,
            },
          ]}
        />
      </View>

      {/* Error / Helper */}

      {error ? (
        <Text
          style={[
            styles.error,
            {
              color:
                theme.destructive,
            },
          ]}
        >
          {error}
        </Text>
      ) : helper ? (
        <Text
          style={[
            styles.helper,
            {
              color:
                theme.textSecondary,
            },
          ]}
        >
          {helper}
        </Text>
      ) : null}
    </View>
  );
}

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  content: {
    padding: 16,
  },

  center: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    gap: 10,
  },

  loadingText: {
    fontSize: 13,
  },

  errorCard: {
    margin: 16,
    padding: 16,

    borderRadius: 14,

    borderWidth: 1,

    alignItems: "center",
  },

  errorText: {
    fontSize: 13,
    fontWeight: "600",
  },

  header: {
    marginBottom: 24,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",

    gap: 14,
  },

  heading: {
    flex: 1,
  },

  title: {
    fontSize: 22,

    fontWeight: "800",

    letterSpacing: -0.5,
  },

  subtitle: {
    marginTop: 4,

    fontSize: 12,
  },

  sectionTitle: {
    marginBottom: 10,

    fontSize: 14,

    fontWeight: "800",
  },

  card: {
    marginBottom: 24,

    padding: 16,

    borderRadius: 16,

    borderWidth: 1,
  },

  field: {
    marginBottom: 17,
  },

  label: {
    marginBottom: 7,

    fontSize: 12,

    fontWeight: "700",
  },

  inputWrapper: {
    minHeight: 48,

    flexDirection: "row",

    alignItems: "center",

    gap: 10,

    paddingHorizontal: 13,

    borderRadius: 11,

    borderWidth: 1,
  },

  input: {
    flex: 1,

    paddingVertical: 0,

    fontSize: 14,
  },

  helper: {
    marginTop: 5,

    fontSize: 10.5,
  },

  error: {
    marginTop: 5,

    fontSize: 11,

    fontWeight: "600",
  },

  actions: {
    flexDirection: "row",

    gap: 10,

    marginTop: -4,
  },

  action: {
    flex: 1,

    minHeight: 48,

    borderRadius: 12,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 7,

    borderWidth: 1,
  },

  cancelText: {
    fontSize: 13,

    fontWeight: "700",
  },

  saveText: {
    fontSize: 13,

    fontWeight: "700",
  },

  pressed: {
    opacity: 0.7,

    transform: [
      {
        scale: 0.98,
      },
    ],
  },
});