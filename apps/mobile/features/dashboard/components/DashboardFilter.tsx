
import { useMemo, useState } from "react";

import {
  CalendarDays,
  Check,
  ChevronDown,
} from "lucide-react-native";

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { DashboardFilterType } from "../../../types/dashboard.types";

import { useTheme } from "../../../providers/ThemeProvider";

/* =========================================================
   TYPES
========================================================= */

interface DashboardFilterProps {
  value: DashboardFilterType;

  onChange: (
    value: DashboardFilterType,
  ) => void;
}

/* =========================================================
   FILTER OPTIONS
========================================================= */

const FILTER_OPTIONS: {
  value: DashboardFilterType;
  label: string;
}[] = [
  {
    value: "TODAY",
    label: "Today",
  },
  {
    value: "THIS_WEEK",
    label: "This Week",
  },
  {
    value: "THIS_MONTH",
    label: "This Month",
  },
  {
    value: "LAST_3_MONTHS",
    label: "Last 3 Months",
  },
  {
    value: "LAST_6_MONTHS",
    label: "Last 6 Months",
  },
  {
    value: "THIS_YEAR",
    label: "This Year",
  },
];

/* =========================================================
   COMPONENT
========================================================= */

export default function DashboardFilter({
  value,
  onChange,
}: DashboardFilterProps) {
  const [isOpen, setIsOpen] =
    useState(false);

  const { theme } = useTheme();

  const selectedOption = useMemo(
    () =>
      FILTER_OPTIONS.find(
        (option) =>
          option.value === value,
      ),
    [value],
  );

  /* =======================================================
     SELECT
  ======================================================= */

  const handleSelect = (
    nextValue: DashboardFilterType,
  ) => {
    onChange(nextValue);

    setIsOpen(false);
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <View style={styles.wrapper}>
      {/* =================================================
          TRIGGER
      ================================================= */}

      <Pressable
        onPress={() =>
          setIsOpen(
            (previous) => !previous,
          )
        }
        style={({ pressed }) => [
          styles.trigger,

          {
            backgroundColor:
              theme.surface,

            borderColor:
              theme.border,
          },

          pressed && {
            backgroundColor:
              theme.textSecondary,
          },
        ]}
      >
        {/* Calendar */}

        <CalendarDays
          size={17}
          color={theme.textSecondary}
          strokeWidth={1.9}
        />

        {/* Selected value */}

        <Text
          style={[
            styles.triggerText,
            {
              color: theme.text,
            },
          ]}
        >
          {selectedOption?.label ??
            "Select period"}
        </Text>

        {/* Chevron */}

        <ChevronDown
          size={16}
          color={theme.textSecondary}
          strokeWidth={2}
        />
      </Pressable>

      {/* =================================================
          DROPDOWN
      ================================================= */}

      {isOpen && (
        <View
          style={[
            styles.dropdown,

            {
              backgroundColor:
                theme.surface,

              borderColor:
                theme.border,
            },
          ]}
        >
          {FILTER_OPTIONS.map(
            (option) => {
              const selected =
                option.value === value;

              return (
                <Pressable
                  key={option.value}
                  onPress={() =>
                    handleSelect(
                      option.value,
                    )
                  }
                  style={({ pressed }) => [
                    styles.option,

                    selected && {
                      backgroundColor:
                        theme.textSecondary,
                    },

                    pressed && {
                      backgroundColor:
                        theme.textSecondary,
                    },
                  ]}
                >
                  {/* OPTION TEXT */}

                  <Text
                    style={[
                      styles.optionText,

                      {
                        color:
                          theme.text,
                      },

                      selected &&
                        styles.selectedOptionText,
                    ]}
                  >
                    {option.label}
                  </Text>

                  {/* CHECK */}

                  {selected && (
                    <Check
                      size={17}
                      color={
                        theme.text
                      }
                      strokeWidth={2.3}
                    />
                  )}
                </Pressable>
              );
            },
          )}
        </View>
      )}
    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  /* =======================================================
     WRAPPER
  ======================================================= */

  wrapper: {
    position: "relative",

    zIndex: 20,

    width: "100%",
  },

  /* =======================================================
     TRIGGER
  ======================================================= */

  trigger: {
    height: 42,

    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 14,

    borderWidth: 1,

    borderRadius: 20,

    shadowColor: "#000000",

    shadowOffset: {
      width: 0,
      height: 1,
    },

    shadowOpacity: 0.04,

    shadowRadius: 3,

    elevation: 2,
  },

  triggerText: {
    flex: 1,

    marginLeft: 9,

    fontSize: 14,

    fontWeight: "600",
  },

  /* =======================================================
     DROPDOWN
  ======================================================= */

  dropdown: {
    position: "absolute",

    top: 48,

    left: 0,

    right: 0,

    paddingVertical: 5,

    borderWidth: 1,

    borderRadius: 16,

    shadowColor: "#000000",

    shadowOffset: {
      width: 0,

      height: 7,
    },

    shadowOpacity: 0.14,

    shadowRadius: 15,

    elevation: 10,
  },

  /* =======================================================
     OPTION
  ======================================================= */

  option: {
    minHeight: 36,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    paddingHorizontal: 10,

    borderRadius: 9,
  },

  /* =======================================================
     OPTION TEXT
  ======================================================= */

  optionText: {
    fontSize: 14,

    fontWeight: "500",
  },

  selectedOptionText: {
    fontWeight: "700",
  },
});