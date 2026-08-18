

import {
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Bell,
  Check,
  ChevronDown,
  Globe,
  Palette,
  Save,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react-native";

import type {
  Currency,
  DateFormat,
  ProfileLanguage,
  ProfileTheme,
  TimeFormat,
  UpdateSettingsRequest,
} from "../../../types/profile.types";

import { useSettings } from "../hooks/use-settings";
import { useUpdateSettings } from "../hooks/use-update-settings";

import { useTheme } from "../../../providers/ThemeProvider";

/* =====================================================
   LABELS
===================================================== */

const currencyLabels: Record<Currency, string> = {
  INR: "INR — Indian Rupee",
  USD: "USD — US Dollar",
  EUR: "EUR — Euro",
  GBP: "GBP — British Pound",
  JPY: "JPY — Japanese Yen",
  AUD: "AUD — Australian Dollar",
  CAD: "CAD — Canadian Dollar",
};

const themeLabels: Record<ProfileTheme, string> = {
  LIGHT: "Light",
  DARK: "Dark",
  SYSTEM: "System",
};

const languageLabels: Record<ProfileLanguage, string> = {
  ENGLISH: "English",
  HINDI: "Hindi",
};

const dateFormatLabels: Record<DateFormat, string> = {
  "DD/MM/YYYY": "DD/MM/YYYY",
  "MM/DD/YYYY": "MM/DD/YYYY",
  "YYYY-MM-DD": "YYYY-MM-DD",
};

const timeFormatLabels: Record<TimeFormat, string> = {
  "12_HOUR": "12 Hour (AM/PM)",
  "24_HOUR": "24 Hour",
};

/* =====================================================
   COMPONENT
===================================================== */

export default function SettingsForm() {
  /*
   * ===================================================
   * THEME
   * ===================================================
   *
   * theme     -> resolved application colors
   * setTheme  -> changes LIGHT / DARK / SYSTEM globally
   */

  const {
    theme,
    setTheme,
  } = useTheme();

  /*
   * ===================================================
   * SETTINGS
   * ===================================================
   */

  const {
    data,
    isLoading,
    isError,
  } = useSettings();

  const updateSettings =
    useUpdateSettings();

  /*
   * ===================================================
   * LOCAL SETTINGS STATE
   * ===================================================
   */

  const [values, setValues] =
    useState<UpdateSettingsRequest>({
      currency: "INR",

      theme: "SYSTEM",

      language: "ENGLISH",

      dateFormat: "DD/MM/YYYY",

      timeFormat: "24_HOUR",

      notificationsEnabled: true,

      emailNotifications: true,

      pushNotifications: true,

      budgetAlerts: false,

      expenseReminders: true,

      biometricEnabled: false,

      pinEnabled: false,
    });

  const [isDirty, setIsDirty] =
    useState(false);

  const [selector, setSelector] =
    useState<
      | "currency"
      | "theme"
      | "language"
      | "dateFormat"
      | "timeFormat"
      | null
    >(null);

  /*
   * ===================================================
   * LOAD SETTINGS
   * ===================================================
   */

  useEffect(() => {
    if (!data?.data) {
      return;
    }

    const settings = data.data;

    /*
     * ---------------------------------------------------
     * UPDATE GLOBAL THEME
     * ---------------------------------------------------
     *
     * This is important.
     *
     * If backend says:
     *
     * LIGHT  -> app becomes light
     * DARK   -> app becomes dark
     * SYSTEM -> app follows device
     */

    setTheme(settings.theme);

    /*
     * ---------------------------------------------------
     * UPDATE LOCAL SETTINGS
     * ---------------------------------------------------
     */

    setValues({
      currency:
        settings.currency,

      theme:
        settings.theme,

      language:
        settings.language,

      dateFormat:
        settings.dateFormat,

      timeFormat:
        settings.timeFormat,

      notificationsEnabled:
        settings.notificationsEnabled,

      emailNotifications:
        settings.emailNotifications,

      pushNotifications:
        settings.pushNotifications,

      budgetAlerts:
        settings.budgetAlerts,

      expenseReminders:
        settings.expenseReminders,

      biometricEnabled:
        settings.biometricEnabled,

      pinEnabled:
        settings.pinEnabled,
    });

    setIsDirty(false);
  }, [
    data,
    setTheme,
  ]);

  /*
   * ===================================================
   * UPDATE VALUE
   * ===================================================
   */

  const updateValue = <
    K extends keyof UpdateSettingsRequest
  >(
    key: K,
    value: UpdateSettingsRequest[K],
  ) => {
    setValues((current) => ({
      ...current,

      [key]: value,
    }));

    setIsDirty(true);
  };

  /*
   * ===================================================
   * HANDLE SELECT
   * ===================================================
   *
   * Theme is special.
   *
   * Other settings only update local state.
   *
   * Theme updates:
   *
   * 1. Local form state
   * 2. Global ThemeProvider
   *
   * The backend is updated only when Save is pressed.
   */

  const handleSelect = (
    value: string,
  ) => {
    if (!selector) {
      return;
    }

    if (selector === "theme") {
      const selectedTheme =
        value as ProfileTheme;

      /*
       * Update global application theme
       * immediately.
       */

      setTheme(selectedTheme);

      /*
       * Update local settings state
       * so Save Preferences persists it.
       */

      updateValue(
        "theme",
        selectedTheme,
      );
    } else {
      /*
       * Normal settings.
       */

      updateValue(
        selector,
        value as never,
      );
    }

    setSelector(null);
  };

  /*
   * ===================================================
   * SAVE
   * ===================================================
   */

  const handleSave = async () => {
    await updateSettings.mutateAsync(
      values,
    );

    setIsDirty(false);
  };

  /*
   * ===================================================
   * LOADING
   * ===================================================
   */

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
          Loading preferences...
        </Text>
      </View>
    );
  }

  /*
   * ===================================================
   * ERROR
   * ===================================================
   */

  if (
    isError ||
    !data?.data
  ) {
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
          Unable to load application
          settings.
        </Text>
      </View>
    );
  }

  /*
   * ===================================================
   * RENDER
   * ===================================================
   */

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor:
            theme.background,
        },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
        }
      >
        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              {
                color: theme.text,
              },
            ]}
          >
            Settings
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
            Customize your BudgetWise
            experience
          </Text>
        </View>

        {/* =================================================
            GENERAL
        ================================================= */}

        <SettingsSection
          theme={theme}
          icon={SlidersHorizontal}
          title="General Preferences"
          description="Currency, regional formats and appearance"
        >
          <SelectRow
            theme={theme}
            label="Currency"
            value={
              values.currency
                ? currencyLabels[
                    values.currency
                  ]
                : "Select currency"
            }
            icon={Globe}
            onPress={() =>
              setSelector(
                "currency",
              )
            }
          />

          <SelectRow
            theme={theme}
            label="Theme"
            value={
              values.theme
                ? themeLabels[
                    values.theme
                  ]
                : "Select theme"
            }
            icon={Palette}
            onPress={() =>
              setSelector(
                "theme",
              )
            }
          />

          <SelectRow
            theme={theme}
            label="Language"
            value={
              values.language
                ? languageLabels[
                    values.language
                  ]
                : "Select language"
            }
            icon={Globe}
            onPress={() =>
              setSelector(
                "language",
              )
            }
          />

          <SelectRow
            theme={theme}
            label="Date Format"
            value={
              values.dateFormat
                ? dateFormatLabels[
                    values.dateFormat
                  ]
                : "Select date format"
            }
            icon={SlidersHorizontal}
            onPress={() =>
              setSelector(
                "dateFormat",
              )
            }
          />

          <SelectRow
            theme={theme}
            label="Time Format"
            value={
              values.timeFormat
                ? timeFormatLabels[
                    values.timeFormat
                  ]
                : "Select time format"
            }
            icon={SlidersHorizontal}
            onPress={() =>
              setSelector(
                "timeFormat",
              )
            }
          />
        </SettingsSection>

        {/* =================================================
            NOTIFICATIONS
        ================================================= */}

        <SettingsSection
          theme={theme}
          icon={Bell}
          title="Notifications"
          description="Manage how BudgetWise notifies you"
        >
          <SettingSwitch
            theme={theme}
            label="Allow Notifications"
            description="Master toggle for all app alerts."
            checked={
              values.notificationsEnabled ??
              false
            }
            onChange={(checked) =>
              updateValue(
                "notificationsEnabled",
                checked,
              )
            }
          />

          <SettingSwitch
            theme={theme}
            label="Email Notifications"
            description="Receive summaries and system notices."
            checked={
              values.emailNotifications ??
              false
            }
            disabled={
              !values.notificationsEnabled
            }
            onChange={(checked) =>
              updateValue(
                "emailNotifications",
                checked,
              )
            }
          />

          <SettingSwitch
            theme={theme}
            label="Push Notifications"
            description="Get instant alerts on your device."
            checked={
              values.pushNotifications ??
              false
            }
            disabled={
              !values.notificationsEnabled
            }
            onChange={(checked) =>
              updateValue(
                "pushNotifications",
                checked,
              )
            }
          />

          <SettingSwitch
            theme={theme}
            label="Budget Alerts"
            description="Warn when approaching budget limits."
            checked={
              values.budgetAlerts ??
              false
            }
            disabled={
              !values.notificationsEnabled
            }
            onChange={(checked) =>
              updateValue(
                "budgetAlerts",
                checked,
              )
            }
          />

          <SettingSwitch
            theme={theme}
            label="Expense Reminders"
            description="Reminders to record your expenses."
            checked={
              values.expenseReminders ??
              false
            }
            disabled={
              !values.notificationsEnabled
            }
            onChange={(checked) =>
              updateValue(
                "expenseReminders",
                checked,
              )
            }
          />
        </SettingsSection>

        {/* =================================================
            SECURITY
        ================================================= */}

        <SettingsSection
          theme={theme}
          icon={ShieldCheck}
          title="Security & Access"
          description="Protect your financial information"
        >
          <SettingSwitch
            theme={theme}
            label="Biometric Authentication"
            description="Use Face ID or fingerprint when available."
            checked={
              values.biometricEnabled ??
              false
            }
            onChange={(checked) =>
              updateValue(
                "biometricEnabled",
                checked,
              )
            }
          />

          <SettingSwitch
            theme={theme}
            label="PIN Authentication"
            description="Require a PIN when opening BudgetWise."
            checked={
              values.pinEnabled ??
              false
            }
            onChange={(checked) =>
              updateValue(
                "pinEnabled",
                checked,
              )
            }
          />
        </SettingsSection>

        {/* =================================================
            SAVE
        ================================================= */}

        {isDirty && (
          <Pressable
            onPress={handleSave}
            disabled={
              updateSettings.isPending
            }
            style={({ pressed }) => [
              styles.saveButton,
              {
                backgroundColor:
                  theme.primary,
              },
              pressed &&
                styles.pressed,
            ]}
          >
            {updateSettings.isPending ? (
              <ActivityIndicator
                size="small"
                color={
                  theme.primaryText
                }
              />
            ) : (
              <Save
                size={18}
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
              {updateSettings.isPending
                ? "Saving..."
                : "Save Preferences"}
            </Text>
          </Pressable>
        )}
      </ScrollView>

      {/* =================================================
          SELECT MODAL
      ================================================= */}

      <SelectorModal
        theme={theme}
        type={selector}
        value={values}
        visible={
          selector !== null
        }
        onClose={() =>
          setSelector(null)
        }
        onSelect={handleSelect}
      />
    </View>
  );
}

/* =====================================================
   SECTION
===================================================== */

function SettingsSection({
  theme,
  icon: Icon,
  title,
  description,
  children,
}: {
  theme: any;
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <View
      style={[
        styles.section,
        {
          backgroundColor:
            theme.surface,
          borderColor:
            theme.border,
        },
      ]}
    >
      <View
        style={[
          styles.sectionHeader,
          {
            borderBottomColor:
              theme.border,
          },
        ]}
      >
        <View
          style={[
            styles.sectionIcon,
            {
              backgroundColor:
                theme.surfaceSecondary,
            },
          ]}
        >
          <Icon
            size={19}
            color={theme.text}
          />
        </View>

        <View
          style={styles.sectionHeading}
        >
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.text,
              },
            ]}
          >
            {title}
          </Text>

          <Text
            style={[
              styles.sectionDescription,
              {
                color:
                  theme.textSecondary,
              },
            ]}
          >
            {description}
          </Text>
        </View>
      </View>

      <View style={styles.sectionBody}>
        {children}
      </View>
    </View>
  );
}

/* =====================================================
   SELECT ROW
===================================================== */

function SelectRow({
  theme,
  label,
  value,
  icon: Icon,
  onPress,
}: {
  theme: any;
  label: string;
  value: string;
  icon: React.ComponentType<any>;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.selectRow,
        {
          borderBottomColor:
            theme.border,
        },
        pressed &&
          styles.rowPressed,
      ]}
    >
      <View style={styles.rowLeft}>
        <Icon
          size={18}
          color={theme.textSecondary}
        />

        <Text
          style={[
            styles.rowLabel,
            {
              color: theme.text,
            },
          ]}
        >
          {label}
        </Text>
      </View>

      <View style={styles.selectValue}>
        <Text
          numberOfLines={1}
          style={[
            styles.valueText,
            {
              color:
                theme.textSecondary,
            },
          ]}
        >
          {value}
        </Text>

        <ChevronDown
          size={17}
          color={
            theme.textSecondary
          }
        />
      </View>
    </Pressable>
  );
}

/* =====================================================
   SWITCH
===================================================== */

function SettingSwitch({
  theme,
  label,
  description,
  checked,
  disabled = false,
  onChange,
}: {
  theme: any;
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (
    checked: boolean,
  ) => void;
}) {
  return (
    <View
      style={[
        styles.switchRow,
        {
          borderBottomColor:
            theme.border,
        },
        disabled &&
          styles.disabledRow,
      ]}
    >
      <View
        style={styles.switchText}
      >
        <Text
          style={[
            styles.switchLabel,
            {
              color: theme.text,
            },
            disabled &&
              styles.disabledText,
          ]}
        >
          {label}
        </Text>

        <Text
          style={[
            styles.switchDescription,
            {
              color:
                theme.textSecondary,
            },
            disabled &&
              styles.disabledText,
          ]}
        >
          {description}
        </Text>
      </View>

      <Pressable
        onPress={() =>
          !disabled &&
          onChange(!checked)
        }
        style={[
          styles.switch,
          {
            backgroundColor: checked
              ? theme.primary
              : theme.muted,
          },
          disabled &&
            styles.switchDisabled,
        ]}
      >
        <View
          style={[
            styles.switchThumb,
            {
              backgroundColor:
                checked
                  ? theme.primaryText
                  : theme.textSecondary,
            },
            checked &&
              styles.switchThumbActive,
          ]}
        />
      </Pressable>
    </View>
  );
}

/* =====================================================
   SELECTOR MODAL
===================================================== */

function SelectorModal({
  theme,
  type,
  value,
  visible,
  onClose,
  onSelect,
}: {
  theme: any;

  type:
    | "currency"
    | "theme"
    | "language"
    | "dateFormat"
    | "timeFormat"
    | null;

  value: UpdateSettingsRequest;

  visible: boolean;

  onClose: () => void;

  onSelect: (
    value: string,
  ) => void;
}) {
  if (!type) {
    return null;
  }

  const configs = {
    currency: {
      title: "Select Currency",

      options:
        Object.entries(
          currencyLabels,
        ),
    },

    theme: {
      title: "Select Theme",

      options:
        Object.entries(
          themeLabels,
        ),
    },

    language: {
      title: "Select Language",

      options:
        Object.entries(
          languageLabels,
        ),
    },

    dateFormat: {
      title: "Select Date Format",

      options:
        Object.entries(
          dateFormatLabels,
        ),
    },

    timeFormat: {
      title: "Select Time Format",

      options:
        Object.entries(
          timeFormatLabels,
        ),
    },
  } as const;

  const config =
    configs[type];

  const selected =
    value[type];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        style={[
          styles.modalBackdrop,
          {
            backgroundColor:
              "rgba(0,0,0,0.55)",
          },
        ]}
        onPress={onClose}
      >
        <Pressable
          style={[
            styles.modal,
            {
              backgroundColor:
                theme.surface,
            },
          ]}
          onPress={(event) =>
            event.stopPropagation()
          }
        >
          {/* HANDLE */}

          <View
            style={[
              styles.modalHandle,
              {
                backgroundColor:
                  theme.border,
              },
            ]}
          />

          {/* TITLE */}

          <Text
            style={[
              styles.modalTitle,
              {
                color:
                  theme.text,
              },
            ]}
          >
            {config.title}
          </Text>

          {/* OPTIONS */}

          <View
            style={[
              styles.options,
              {
                borderColor:
                  theme.border,
              },
            ]}
          >
            {config.options.map(
              ([key, label]) => {
                const active =
                  key === selected;

                return (
                  <Pressable
                    key={key}
                    onPress={() =>
                      onSelect(key)
                    }
                    style={[
                      styles.option,
                      {
                        borderBottomColor:
                          theme.border,
                      },
                      active && {
                        backgroundColor:
                          theme.surfaceSecondary,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color:
                            theme.text,
                        },
                        active && {
                          fontWeight:
                            "700",
                        },
                      ]}
                    >
                      {label}
                    </Text>

                    {active && (
                      <Check
                        size={18}
                        color={
                          theme.primary
                        }
                      />
                    )}
                  </Pressable>
                );
              },
            )}
          </View>

          {/* CANCEL */}

          <Pressable
            onPress={onClose}
            style={[
              styles.closeButton,
              {
                backgroundColor:
                  theme.muted,
              },
            ]}
          >
            <Text
              style={[
                styles.closeButtonText,
                {
                  color:
                    theme.text,
                },
              ]}
            >
              Cancel
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

/* =====================================================
   STATIC LAYOUT STYLES
===================================================== */

const styles =
  StyleSheet.create({
    screen: {
      flex: 1,
    },

    content: {
      padding: 16,

      paddingBottom: 130,
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
      marginBottom: 20,
    },

    title: {
      fontSize: 25,

      fontWeight: "800",

      letterSpacing: -0.6,
    },

    subtitle: {
      marginTop: 4,

      fontSize: 12,
    },

    section: {
      marginBottom: 18,

      borderRadius: 16,

      borderWidth: 1,

      overflow: "hidden",
    },

    sectionHeader: {
      flexDirection: "row",

      alignItems: "center",

      gap: 11,

      padding: 16,

      borderBottomWidth: 1,
    },

    sectionIcon: {
      width: 38,

      height: 38,

      borderRadius: 11,

      alignItems: "center",

      justifyContent: "center",
    },

    sectionHeading: {
      flex: 1,
    },

    sectionTitle: {
      fontSize: 15,

      fontWeight: "800",
    },

    sectionDescription: {
      marginTop: 3,

      fontSize: 11,
    },

    sectionBody: {
      paddingHorizontal: 16,
    },

    selectRow: {
      minHeight: 58,

      flexDirection: "row",

      alignItems: "center",

      justifyContent: "space-between",

      borderBottomWidth: 1,
    },

    rowPressed: {
      opacity: 0.6,
    },

    rowLeft: {
      flexDirection: "row",

      alignItems: "center",

      gap: 10,

      flex: 1,
    },

    rowLabel: {
      fontSize: 13,

      fontWeight: "600",
    },

    selectValue: {
      maxWidth: "55%",

      flexDirection: "row",

      alignItems: "center",

      gap: 5,
    },

    valueText: {
      fontSize: 12,
    },

    switchRow: {
      minHeight: 72,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",

      gap: 14,

      borderBottomWidth: 1,
    },

    switchText: {
      flex: 1,
    },

    switchLabel: {
      fontSize: 13,

      fontWeight: "700",
    },

    switchDescription: {
      marginTop: 3,

      fontSize: 10.5,

      lineHeight: 15,
    },

    switch: {
      width: 48,

      height: 28,

      borderRadius: 15,

      justifyContent: "center",

      paddingHorizontal: 3,
    },

    switchDisabled: {
      opacity: 0.45,
    },

    switchThumb: {
      width: 22,

      height: 22,

      borderRadius: 11,
    },

    switchThumbActive: {
      alignSelf: "flex-end",
    },

    disabledRow: {
      opacity: 0.45,
    },

    disabledText: {
      opacity: 0.65,
    },

    saveButton: {
      minHeight: 50,

      marginTop: 2,

      marginBottom: 20,

      borderRadius: 13,

      flexDirection: "row",

      alignItems: "center",

      justifyContent: "center",

      gap: 8,
    },

    saveText: {
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

    modalBackdrop: {
      flex: 1,

      justifyContent: "flex-end",
    },

    modal: {
      padding: 20,

      borderTopLeftRadius: 24,

      borderTopRightRadius: 24,

      paddingBottom: 30,
    },

    modalHandle: {
      alignSelf: "center",

      width: 40,

      height: 4,

      marginBottom: 18,

      borderRadius: 3,
    },

    modalTitle: {
      marginBottom: 14,

      fontSize: 18,

      fontWeight: "800",
    },

    options: {
      borderRadius: 14,

      overflow: "hidden",

      borderWidth: 1,
    },

    option: {
      minHeight: 50,

      paddingHorizontal: 14,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",

      borderBottomWidth: 1,
    },

    optionText: {
      fontSize: 13,
    },

    closeButton: {
      height: 48,

      marginTop: 14,

      borderRadius: 12,

      alignItems: "center",

      justifyContent: "center",
    },

    closeButtonText: {
      fontSize: 13,

      fontWeight: "700",
    },
  });