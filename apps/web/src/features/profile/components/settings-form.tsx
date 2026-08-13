"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Loader2,
  Save,
  Sliders,
  Bell,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import type { UpdateSettingsRequest } from "@/types/profile.types";
import { useSettings } from "../hooks/use-settings";
import { useUpdateSettings } from "../hooks/use-update-settings";

const currencyLabels: Record<string, string> = {
  INR: "INR — Indian Rupee",
  USD: "USD — US Dollar",
  EUR: "EUR — Euro",
  GBP: "GBP — British Pound",
  JPY: "JPY — Japanese Yen",
  AUD: "AUD — Australian Dollar",
  CAD: "CAD — Canadian Dollar",
};

const themeLabels: Record<string, string> = {
  LIGHT: "Light",
  DARK: "Dark",
  SYSTEM: "System",
};

const languageLabels: Record<string, string> = {
  ENGLISH: "English",
  HINDI: "Hindi",
};

const dateFormatLabels: Record<string, string> = {
  "DD/MM/YYYY": "DD/MM/YYYY",
  "MM/DD/YYYY": "MM/DD/YYYY",
  "YYYY-MM-DD": "YYYY-MM-DD",
};

const timeFormatLabels: Record<string, string> = {
  "12_HOUR": "12 Hour (AM/PM)",
  "24_HOUR": "24 Hour",
};

export function SettingsForm() {
  const { data, isLoading, isError } = useSettings();
  const updateSettings = useUpdateSettings();

  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isDirty },
  } = useForm<UpdateSettingsRequest>({
    defaultValues: {
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
    },
  });

  const currency = watch("currency");
  const theme = watch("theme");
  const language = watch("language");
  const dateFormat = watch("dateFormat");
  const timeFormat = watch("timeFormat");

  const notificationsEnabled = watch("notificationsEnabled");
  const emailNotifications = watch("emailNotifications");
  const pushNotifications = watch("pushNotifications");
  const budgetAlerts = watch("budgetAlerts");
  const expenseReminders = watch("expenseReminders");

  const biometricEnabled = watch("biometricEnabled");
  const pinEnabled = watch("pinEnabled");

  useEffect(() => {
    if (!data?.data) return;

    const settings = data.data;

    reset({
      currency: settings.currency,
      theme: settings.theme,
      language: settings.language,
      dateFormat: settings.dateFormat,
      timeFormat: settings.timeFormat,

      notificationsEnabled: settings.notificationsEnabled,
      emailNotifications: settings.emailNotifications,
      pushNotifications: settings.pushNotifications,
      budgetAlerts: settings.budgetAlerts,
      expenseReminders: settings.expenseReminders,

      biometricEnabled: settings.biometricEnabled,
      pinEnabled: settings.pinEnabled,
    });
  }, [data, reset]);

  const onSubmit = async (values: UpdateSettingsRequest) => {
    await updateSettings.mutateAsync(values);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-75 w-full items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          <span>Loading preferences...</span>
        </div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-center text-sm text-destructive">
        Unable to load application settings.
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-6 sm:px-0">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ================= GENERAL ================= */}
        <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-3 border-b border-border/60 pb-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sliders className="size-5" />
            </div>

            <div>
              <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
                General Preferences
              </h2>

              <p className="text-xs text-muted-foreground sm:text-sm">
                Customize currency, regional formats, and visuals
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            {/* Currency */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground sm:text-sm">
                Currency
              </Label>

              <Select
                value={currency ?? undefined}
                onValueChange={(value) => {
                  if (!value) return;

                  setValue("currency", value, {
                    shouldDirty: true,
                  });
                }}
              >
                <SelectTrigger className="h-11 text-sm sm:h-10">
                  <SelectValue>
                    {currency
                      ? currencyLabels[currency]
                      : "Select currency"}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="INR">
                    INR — Indian Rupee
                  </SelectItem>
                  <SelectItem value="USD">
                    USD — US Dollar
                  </SelectItem>
                  <SelectItem value="EUR">
                    EUR — Euro
                  </SelectItem>
                  <SelectItem value="GBP">
                    GBP — British Pound
                  </SelectItem>
                  <SelectItem value="JPY">
                    JPY — Japanese Yen
                  </SelectItem>
                  <SelectItem value="AUD">
                    AUD — Australian Dollar
                  </SelectItem>
                  <SelectItem value="CAD">
                    CAD — Canadian Dollar
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Theme */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground sm:text-sm">
                Theme
              </Label>

              <Select
                value={theme ?? undefined}
                onValueChange={(value) => {
                  if (!value) return;

                  setValue("theme", value, {
                    shouldDirty: true,
                  });
                }}
              >
                <SelectTrigger className="h-11 text-sm sm:h-10">
                  <SelectValue>
                    {theme
                      ? themeLabels[theme]
                      : "Select theme"}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="LIGHT">
                    Light
                  </SelectItem>
                  <SelectItem value="DARK">
                    Dark
                  </SelectItem>
                  <SelectItem value="SYSTEM">
                    System
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Language */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground sm:text-sm">
                Language
              </Label>

              <Select
                value={language ?? undefined}
                onValueChange={(value) => {
                  if (!value) return;

                  setValue("language", value, {
                    shouldDirty: true,
                  });
                }}
              >
                <SelectTrigger className="h-11 text-sm sm:h-10">
                  <SelectValue>
                    {language
                      ? languageLabels[language]
                      : "Select language"}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="ENGLISH">
                    English
                  </SelectItem>
                  <SelectItem value="HINDI">
                    Hindi
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Format */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground sm:text-sm">
                Date Format
              </Label>

              <Select
                value={dateFormat ?? undefined}
                onValueChange={(value) => {
                  if (!value) return;

                  setValue("dateFormat", value, {
                    shouldDirty: true,
                  });
                }}
              >
                <SelectTrigger className="h-11 text-sm sm:h-10">
                  <SelectValue>
                    {dateFormat
                      ? dateFormatLabels[dateFormat]
                      : "Select date format"}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">
                    DD/MM/YYYY
                  </SelectItem>
                  <SelectItem value="MM/DD/YYYY">
                    MM/DD/YYYY
                  </SelectItem>
                  <SelectItem value="YYYY-MM-DD">
                    YYYY-MM-DD
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Time Format */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-medium text-foreground sm:text-sm">
                Time Format
              </Label>

              <Select
                value={timeFormat ?? undefined}
                onValueChange={(value) => {
                  if (!value) return;

                  setValue("timeFormat", value, {
                    shouldDirty: true,
                  });
                }}
              >
                <SelectTrigger className="h-11 text-sm sm:h-10">
                  <SelectValue>
                    {timeFormat
                      ? timeFormatLabels[timeFormat]
                      : "Select time format"}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="12_HOUR">
                    12 Hour (AM/PM)
                  </SelectItem>
                  <SelectItem value="24_HOUR">
                    24 Hour
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* ================= NOTIFICATIONS ================= */}
        <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-3 border-b border-border/60 pb-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Bell className="size-5" />
            </div>

            <div>
              <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
                Notifications
              </h2>

              <p className="text-xs text-muted-foreground sm:text-sm">
                Manage how and when BudgetWise notifies you
              </p>
            </div>
          </div>

          <div className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border/60">
            <SettingSwitch
              label="Allow Notifications"
              description="Master toggle to turn all app alerts on or off."
              checked={notificationsEnabled ?? false}
              onCheckedChange={(checked) =>
                setValue("notificationsEnabled", checked, {
                  shouldDirty: true,
                })
              }
            />

            <SettingSwitch
              label="Email Notifications"
              description="Receive weekly summaries and system notices via email."
              disabled={!notificationsEnabled}
              checked={emailNotifications ?? false}
              onCheckedChange={(checked) =>
                setValue("emailNotifications", checked, {
                  shouldDirty: true,
                })
              }
            />

            <SettingSwitch
              label="Push Notifications"
              description="Get instant alert popups on your device."
              disabled={!notificationsEnabled}
              checked={pushNotifications ?? false}
              onCheckedChange={(checked) =>
                setValue("pushNotifications", checked, {
                  shouldDirty: true,
                })
              }
            />

            <SettingSwitch
              label="Budget Alerts"
              description="Get warned when nearing your monthly category limit."
              disabled={!notificationsEnabled}
              checked={budgetAlerts ?? false}
              onCheckedChange={(checked) =>
                setValue("budgetAlerts", checked, {
                  shouldDirty: true,
                })
              }
            />

            <SettingSwitch
              label="Expense Reminders"
              description="Timely reminders to log daily purchases."
              disabled={!notificationsEnabled}
              checked={expenseReminders ?? false}
              onCheckedChange={(checked) =>
                setValue("expenseReminders", checked, {
                  shouldDirty: true,
                })
              }
            />
          </div>
        </section>

        {/* ================= SECURITY ================= */}
        <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-3 border-b border-border/60 pb-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
            </div>

            <div>
              <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
                Security & Access
              </h2>

              <p className="text-xs text-muted-foreground sm:text-sm">
                Extra layer of protection for your financial data
              </p>
            </div>
          </div>

          <div className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border/60">
            <SettingSwitch
              label="Biometric Authentication"
              description="Unlock with Face ID or fingerprint scanner when available."
              checked={biometricEnabled ?? false}
              onCheckedChange={(checked) =>
                setValue("biometricEnabled", checked, {
                  shouldDirty: true,
                })
              }
            />

            <SettingSwitch
              label="PIN Authentication"
              description="Require a custom 4-digit security code on open."
              checked={pinEnabled ?? false}
              onCheckedChange={(checked) =>
                setValue("pinEnabled", checked, {
                  shouldDirty: true,
                })
              }
            />
          </div>
        </section>

        {/* ================= SAVE ACTION ================= */}
        <div className="sticky bottom-4 z-10 flex items-center justify-end rounded-xl border border-border/60 bg-card/95 p-4 shadow-lg backdrop-blur sm:static sm:border-none sm:bg-transparent sm:p-0 sm:shadow-none">
          <Button
            type="submit"
            disabled={!isDirty || updateSettings.isPending}
            loading={updateSettings.isPending}
            className="h-11 w-full gap-2 text-xs font-semibold sm:h-10 sm:w-auto sm:text-sm"
          >
            {!updateSettings.isPending && (
              <Save className="size-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

/* =====================================================
    Reusable Switch Row
===================================================== */

interface SettingSwitchProps {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function SettingSwitch({
  label,
  description,
  checked,
  disabled = false,
  onCheckedChange,
}: SettingSwitchProps) {
  return (
    <div
      className={`flex items-center justify-between gap-4 p-4 transition-colors ${
        disabled
          ? "pointer-events-none bg-muted/20 opacity-50"
          : "bg-card"
      }`}
    >
      <div className="space-y-0.5">
        <p className="text-xs font-semibold text-foreground sm:text-sm">
          {label}
        </p>

        <p className="text-[11px] text-muted-foreground sm:text-xs">
          {description}
        </p>
      </div>

      <Switch
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        className="shrink-0"
      />
    </div>
  );
}

// "use client";

// import { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import {
//   Loader2,
//   Save,
//   Sliders,
//   Bell,
//   ShieldCheck,
//   CheckCircle2,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";

// import type { UpdateSettingsRequest } from "@/types/profile.types";
// import { useSettings } from "../hooks/use-settings";
// import { useUpdateSettings } from "../hooks/use-update-settings";

// export function SettingsForm() {
//   const { data, isLoading, isError } = useSettings();
//   const updateSettings = useUpdateSettings();

//   const {
//     handleSubmit,
//     reset,
//     setValue,
//     watch,
//     formState: { isDirty },
//   } = useForm<UpdateSettingsRequest>({
//     defaultValues: {
//       currency: "INR",
//       theme: "SYSTEM",
//       language: "ENGLISH",
//       dateFormat: "DD/MM/YYYY",
//       timeFormat: "24_HOUR",

//       notificationsEnabled: true,
//       emailNotifications: true,
//       pushNotifications: true,
//       budgetAlerts: false,
//       expenseReminders: true,

//       biometricEnabled: false,
//       pinEnabled: false,
//     },
//   });

//   const currency = watch("currency");
//   const theme = watch("theme");
//   const language = watch("language");
//   const dateFormat = watch("dateFormat");
//   const timeFormat = watch("timeFormat");

//   const notificationsEnabled = watch("notificationsEnabled");
//   const emailNotifications = watch("emailNotifications");
//   const pushNotifications = watch("pushNotifications");
//   const budgetAlerts = watch("budgetAlerts");
//   const expenseReminders = watch("expenseReminders");

//   const biometricEnabled = watch("biometricEnabled");
//   const pinEnabled = watch("pinEnabled");

//   useEffect(() => {
//     if (!data?.data) return;

//     const settings = data.data;

//     reset({
//       currency: settings.currency,
//       theme: settings.theme,
//       language: settings.language,
//       dateFormat: settings.dateFormat,
//       timeFormat: settings.timeFormat,

//       notificationsEnabled: settings.notificationsEnabled,
//       emailNotifications: settings.emailNotifications,
//       pushNotifications: settings.pushNotifications,
//       budgetAlerts: settings.budgetAlerts,
//       expenseReminders: settings.expenseReminders,

//       biometricEnabled: settings.biometricEnabled,
//       pinEnabled: settings.pinEnabled,
//     });
//   }, [data, reset]);

//   const onSubmit = async (values: UpdateSettingsRequest) => {
//     await updateSettings.mutateAsync(values);
//   };

//   if (isLoading) {
//     return (
//       <div className="flex min-h-80 w-full items-center justify-center">
//         <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
//           <Loader2 className="size-5 animate-spin text-primary" />
//           <span>Loading preferences...</span>
//         </div>
//       </div>
//     );
//   }

//   if (isError || !data?.data) {
//     return (
//       <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center text-sm font-semibold text-destructive">
//         Unable to load application settings. Please refresh the page.
//       </div>
//     );
//   }

//   return (
//     <div className="w-full space-y-6">
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//         {/* ================= GENERAL PREFERENCES ================= */}
//         <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-xs sm:p-6">
//           <div className="mb-6 flex items-center gap-3 border-b border-border/60 pb-4">
//             <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
//               <Sliders className="size-5" />
//             </div>

//             <div>
//               <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
//                 General Preferences
//               </h2>
//               <p className="text-xs text-muted-foreground">
//                 Customize currency, regional formats, and visuals
//               </p>
//             </div>
//           </div>

//           <div className="grid gap-5 sm:grid-cols-2">
//             {/* Currency */}
//             <div className="space-y-1.5">
//               <Label className="text-xs font-semibold text-foreground sm:text-sm">
//                 Currency
//               </Label>
//               <Select
//                 value={currency ?? undefined}
//                 onValueChange={(value) => {
//                   if (!value) return;
//                   setValue("currency", value, { shouldDirty: true });
//                 }}
//               >
//                 <SelectTrigger className="h-10 rounded-xl border-border/60 text-xs sm:text-sm">
//                   <SelectValue placeholder="Select currency" />
//                 </SelectTrigger>
//                 <SelectContent className="rounded-xl border-border/60">
//                   <SelectItem value="INR">INR — Indian Rupee</SelectItem>
//                   <SelectItem value="USD">USD — US Dollar</SelectItem>
//                   <SelectItem value="EUR">EUR — Euro</SelectItem>
//                   <SelectItem value="GBP">GBP — British Pound</SelectItem>
//                   <SelectItem value="JPY">JPY — Japanese Yen</SelectItem>
//                   <SelectItem value="AUD">AUD — Australian Dollar</SelectItem>
//                   <SelectItem value="CAD">CAD — Canadian Dollar</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Theme */}
//             <div className="space-y-1.5">
//               <Label className="text-xs font-semibold text-foreground sm:text-sm">
//                 Theme
//               </Label>
//               <Select
//                 value={theme ?? undefined}
//                 onValueChange={(value) => {
//                   if (!value) return;
//                   setValue("theme", value, { shouldDirty: true });
//                 }}
//               >
//                 <SelectTrigger className="h-10 rounded-xl border-border/60 text-xs sm:text-sm">
//                   <SelectValue placeholder="Select theme" />
//                 </SelectTrigger>
//                 <SelectContent className="rounded-xl border-border/60">
//                   <SelectItem value="LIGHT">Light</SelectItem>
//                   <SelectItem value="DARK">Dark</SelectItem>
//                   <SelectItem value="SYSTEM">System</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Language */}
//             <div className="space-y-1.5">
//               <Label className="text-xs font-semibold text-foreground sm:text-sm">
//                 Language
//               </Label>
//               <Select
//                 value={language ?? undefined}
//                 onValueChange={(value) => {
//                   if (!value) return;
//                   setValue("language", value, { shouldDirty: true });
//                 }}
//               >
//                 <SelectTrigger className="h-10 rounded-xl border-border/60 text-xs sm:text-sm">
//                   <SelectValue placeholder="Select language" />
//                 </SelectTrigger>
//                 <SelectContent className="rounded-xl border-border/60">
//                   <SelectItem value="ENGLISH">English</SelectItem>
//                   <SelectItem value="HINDI">Hindi</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Date Format */}
//             <div className="space-y-1.5">
//               <Label className="text-xs font-semibold text-foreground sm:text-sm">
//                 Date Format
//               </Label>
//               <Select
//                 value={dateFormat ?? undefined}
//                 onValueChange={(value) => {
//                   if (!value) return;
//                   setValue("dateFormat", value, { shouldDirty: true });
//                 }}
//               >
//                 <SelectTrigger className="h-10 rounded-xl border-border/60 text-xs sm:text-sm">
//                   <SelectValue placeholder="Select date format" />
//                 </SelectTrigger>
//                 <SelectContent className="rounded-xl border-border/60">
//                   <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
//                   <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
//                   <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Time Format */}
//             <div className="space-y-1.5 sm:col-span-2">
//               <Label className="text-xs font-semibold text-foreground sm:text-sm">
//                 Time Format
//               </Label>
//               <Select
//                 value={timeFormat ?? undefined}
//                 onValueChange={(value) => {
//                   if (!value) return;
//                   setValue("timeFormat", value, { shouldDirty: true });
//                 }}
//               >
//                 <SelectTrigger className="h-10 rounded-xl border-border/60 text-xs sm:text-sm">
//                   <SelectValue placeholder="Select time format" />
//                 </SelectTrigger>
//                 <SelectContent className="rounded-xl border-border/60">
//                   <SelectItem value="12_HOUR">12 Hour (AM/PM)</SelectItem>
//                   <SelectItem value="24_HOUR">24 Hour</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </section>

//         {/* ================= NOTIFICATIONS ================= */}
//         <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-xs sm:p-6">
//           <div className="mb-6 flex items-center gap-3 border-b border-border/60 pb-4">
//             <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
//               <Bell className="size-5" />
//             </div>

//             <div>
//               <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
//                 Notifications
//               </h2>
//               <p className="text-xs text-muted-foreground">
//                 Manage how and when BudgetWise notifies you
//               </p>
//             </div>
//           </div>

//           <div className="divide-y divide-border/50 overflow-hidden rounded-2xl border border-border/60">
//             <SettingSwitch
//               label="Allow Notifications"
//               description="Master toggle to turn all app alerts on or off."
//               checked={notificationsEnabled ?? false}
//               onCheckedChange={(checked) =>
//                 setValue("notificationsEnabled", checked, { shouldDirty: true })
//               }
//             />

//             <SettingSwitch
//               label="Email Notifications"
//               description="Receive weekly summaries and system notices via email."
//               disabled={!notificationsEnabled}
//               checked={emailNotifications ?? false}
//               onCheckedChange={(checked) =>
//                 setValue("emailNotifications", checked, { shouldDirty: true })
//               }
//             />

//             <SettingSwitch
//               label="Push Notifications"
//               description="Get instant alert popups on your device."
//               disabled={!notificationsEnabled}
//               checked={pushNotifications ?? false}
//               onCheckedChange={(checked) =>
//                 setValue("pushNotifications", checked, { shouldDirty: true })
//               }
//             />

//             <SettingSwitch
//               label="Budget Alerts"
//               description="Get warned when nearing your monthly category limit."
//               disabled={!notificationsEnabled}
//               checked={budgetAlerts ?? false}
//               onCheckedChange={(checked) =>
//                 setValue("budgetAlerts", checked, { shouldDirty: true })
//               }
//             />

//             <SettingSwitch
//               label="Expense Reminders"
//               description="Timely reminders to log daily purchases."
//               disabled={!notificationsEnabled}
//               checked={expenseReminders ?? false}
//               onCheckedChange={(checked) =>
//                 setValue("expenseReminders", checked, { shouldDirty: true })
//               }
//             />
//           </div>
//         </section>

//         {/* ================= SECURITY ================= */}
//         <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-xs sm:p-6">
//           <div className="mb-6 flex items-center gap-3 border-b border-border/60 pb-4">
//             <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
//               <ShieldCheck className="size-5" />
//             </div>

//             <div>
//               <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
//                 Security & Access
//               </h2>
//               <p className="text-xs text-muted-foreground">
//                 Extra layer of protection for your financial data
//               </p>
//             </div>
//           </div>

//           <div className="divide-y divide-border/50 overflow-hidden rounded-2xl border border-border/60">
//             <SettingSwitch
//               label="Biometric Authentication"
//               description="Unlock with Face ID or fingerprint scanner when available."
//               checked={biometricEnabled ?? false}
//               onCheckedChange={(checked) =>
//                 setValue("biometricEnabled", checked, { shouldDirty: true })
//               }
//             />

//             <SettingSwitch
//               label="PIN Authentication"
//               description="Require a custom 4-digit security code on open."
//               checked={pinEnabled ?? false}
//               onCheckedChange={(checked) =>
//                 setValue("pinEnabled", checked, { shouldDirty: true })
//               }
//             />
//           </div>
//         </section>

//         {/* ================= SAVE ACTION ================= */}
//         <div className="sticky bottom-20 z-10 flex items-center justify-between rounded-2xl border border-border/60 bg-card/80 p-4 shadow-xl backdrop-blur-md sm:bottom-6 sm:static sm:border-none sm:bg-transparent sm:p-0 sm:shadow-none">
//           <div className="hidden sm:block">
//             {isDirty && (
//               <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
//                 You have unsaved preference changes
//               </span>
//             )}
//           </div>

//           <Button
//             type="submit"
//             disabled={!isDirty || updateSettings.isPending}
//             className="h-10 w-full gap-2 rounded-xl text-xs font-bold sm:w-auto sm:text-sm"
//           >
//             {updateSettings.isPending ? (
//               <Loader2 className="size-4 animate-spin" />
//             ) : (
//               <Save className="size-4" />
//             )}
//             <span>
//               {updateSettings.isPending ? "Saving..." : "Save Preferences"}
//             </span>
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// }

// /* =====================================================
//     Reusable Switch Row
// ===================================================== */

// interface SettingSwitchProps {
//   label: string;
//   description: string;
//   checked: boolean;
//   disabled?: boolean;
//   onCheckedChange: (checked: boolean) => void;
// }

// function SettingSwitch({
//   label,
//   description,
//   checked,
//   disabled = false,
//   onCheckedChange,
// }: SettingSwitchProps) {
//   return (
//     <div
//       className={`flex items-center justify-between gap-4 p-4 transition-colors ${
//         disabled
//           ? "pointer-events-none bg-muted/30 opacity-50"
//           : "bg-card hover:bg-muted/20"
//       }`}
//     >
//       <div className="space-y-0.5">
//         <p className="text-xs font-bold text-foreground sm:text-sm">{label}</p>
//         <p className="text-[11px] font-medium text-muted-foreground sm:text-xs">
//           {description}
//         </p>
//       </div>

//       <Switch
//         checked={checked}
//         disabled={disabled}
//         onCheckedChange={onCheckedChange}
//         className="shrink-0"
//       />
//     </div>
//   );
// }