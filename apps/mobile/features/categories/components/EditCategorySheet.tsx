
import {
  Check,
  ChevronDown,
  ChevronUp,
  Pencil,
  X,
} from "lucide-react-native";

import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";



import { useUpdateCategory } from "../hooks/use-update-category";

import CategoryBottomSheet from "./CategoryBottomSheet";
import { CategoryIcon } from "./category-icon";

import type { Category } from "../../../types/category.types";
import { useTheme } from "../../../providers/ThemeProvider";

const PRESET_COLORS = [
  "#F97316",
  "#EF4444",
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#EAB308",
  "#64748B",
];

const ICON_OPTIONS = [
  "shopping-bag",
  "shopping-cart",
  "utensils",
  "coffee",
  "car",
  "home",
  "briefcase",
  "heart-pulse",
  "heart",
  "film",
  "plane",
  "gift",
  "wallet",
  "graduation-cap",
  "wrench",
  "laptop",
  "smartphone",
  "music",
  "dumbbell",
  "credit-card",
  "cash",
  "hand-coins",
  "piggy-bank",
  "folder",
];

function formatIconName(value: string) {
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

interface EditCategorySheetProps {
  visible: boolean;
  category: Category;
  onClose: () => void;
}

export default function EditCategorySheet({
  visible,
  category,
  onClose,
}: EditCategorySheetProps) {
  const { theme } = useTheme();

  const updateCategory =
    useUpdateCategory();

  const [name, setName] =
    useState(category.name);

  const [icon, setIcon] =
    useState(category.icon);

  const [color, setColor] =
    useState(category.color);

  const [showIcons, setShowIcons] =
    useState(false);

  /*
   * =========================================================
   * SYNC FORM
   * =========================================================
   */

  useEffect(() => {
    if (!visible) {
      return;
    }

    setName(category.name);
    setIcon(category.icon);
    setColor(category.color);
    setShowIcons(false);
  }, [category, visible]);

  /*
   * =========================================================
   * RESET
   * =========================================================
   */

  const resetForm = () => {
    setName(category.name);
    setIcon(category.icon);
    setColor(category.color);
    setShowIcons(false);
  };

  /*
   * =========================================================
   * CLOSE
   * =========================================================
   */

  const handleClose = () => {
    if (updateCategory.isPending) {
      return;
    }

    resetForm();
    onClose();
  };

  /*
   * =========================================================
   * SUBMIT
   * =========================================================
   */

  const handleSubmit = async () => {
    if (
      !name.trim() ||
      !icon.trim()
    ) {
      return;
    }

    try {
      await updateCategory.mutateAsync({
        categoryId: category._id,

        payload: {
          name: name.trim(),
          icon: icon.trim(),
          color,
        },
      });

      onClose();
    } catch {
      // Hook handles the error.
    }
  };

  /*
   * =========================================================
   * SYSTEM CATEGORY
   * =========================================================
   */

  if (category.isSystem) {
    return null;
  }

  return (
    <CategoryBottomSheet
      visible={visible}
      onClose={handleClose}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <View
        style={[
          styles.header,
          {
            backgroundColor:
              theme.surface,
            borderBottomColor:
              theme.border,
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.headerIcon,
              {
                backgroundColor:
                  `${color}18`,
              },
            ]}
          >
            <CategoryIcon
              name={icon || "folder"}
              size={21}
              color={color}
            />
          </View>

          <View style={styles.headerText}>
            <Text
              style={[
                styles.title,
                {
                  color: theme.text,
                },
              ]}
            >
              Edit Category
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
              Update category details and
              preferences
            </Text>
          </View>
        </View>

        <Pressable
          onPress={handleClose}
          disabled={
            updateCategory.isPending
          }
          style={[
            styles.closeButton,
            {
              backgroundColor:
                theme.muted,
            },
          ]}
        >
          <X
            size={19}
            color={
              theme.textSecondary
            }
          />
        </Pressable>
      </View>

      {/* =================================================
          CONTENT
      ================================================= */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.content,
          {
            backgroundColor:
              theme.surface,
          },
        ]}
      >
        {/* =================================================
            CATEGORY NAME
        ================================================= */}

        <View style={styles.field}>
          <Text
            style={[
              styles.label,
              {
                color: theme.text,
              },
            ]}
          >
            Category Name
          </Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Groceries & Supplies"
            placeholderTextColor={
              theme.muted
            }
            maxLength={50}
            style={[
              styles.input,
              {
                color: theme.text,
                borderColor:
                  theme.border,
                backgroundColor:
                  theme.background,
              },
            ]}
          />
        </View>

        {/* =================================================
            ICON
        ================================================= */}

        <View style={styles.field}>
          <Text
            style={[
              styles.label,
              {
                color: theme.text,
              },
            ]}
          >
            Icon
          </Text>

          <Pressable
            onPress={() =>
              setShowIcons(
                (previous) =>
                  !previous,
              )
            }
            style={[
              styles.selector,
              {
                borderColor:
                  theme.border,
                backgroundColor:
                  theme.background,
              },
            ]}
          >
            <View
              style={
                styles.selectorLeft
              }
            >
              <View
                style={[
                  styles.iconPreview,
                  {
                    backgroundColor:
                      `${color}18`,
                  },
                ]}
              >
                <CategoryIcon
                  name={icon || "folder"}
                  size={18}
                  color={color}
                />
              </View>

              <Text
                style={[
                  styles.selectorText,
                  {
                    color: theme.text,
                  },
                ]}
              >
                {formatIconName(
                  icon || "folder",
                )}
              </Text>
            </View>

            {showIcons ? (
              <ChevronUp
                size={18}
                color={
                  theme.textSecondary
                }
              />
            ) : (
              <ChevronDown
                size={18}
                color={
                  theme.textSecondary
                }
              />
            )}
          </Pressable>

          {/* Icon Picker */}

          {showIcons && (
            <View
              style={[
                styles.iconPicker,
                {
                  borderColor:
                    theme.border,
                  backgroundColor:
                    theme.background,
                },
              ]}
            >
              <View
                style={styles.iconGrid}
              >
                {ICON_OPTIONS.map(
                  (iconName) => {
                    const selected =
                      icon ===
                      iconName;

                    return (
                      <Pressable
                        key={iconName}
                        onPress={() => {
                          setIcon(
                            iconName,
                          );

                          setShowIcons(
                            false,
                          );
                        }}
                        style={[
                          styles.iconOption,
                          {
                            borderColor:
                              theme.border,
                            backgroundColor:
                              theme.surface,
                          },
                          selected && {
                            borderColor:
                              theme.text,
                            backgroundColor:
                              theme.muted,
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.iconOptionIcon,
                            selected && {
                              backgroundColor:
                                `${color}15`,
                            },
                          ]}
                        >
                          <CategoryIcon
                            name={
                              iconName
                            }
                            size={19}
                            color={
                              selected
                                ? color
                                : theme.textSecondary
                            }
                          />
                        </View>

                        <Text
                          numberOfLines={1}
                          style={[
                            styles.iconName,
                            {
                              color:
                                theme.textSecondary,
                            },
                            selected && {
                              color:
                                theme.text,
                              fontWeight:
                                "700",
                            },
                          ]}
                        >
                          {formatIconName(
                            iconName,
                          )}
                        </Text>
                      </Pressable>
                    );
                  },
                )}
              </View>
            </View>
          )}
        </View>

        {/* =================================================
            ACCENT COLOR
        ================================================= */}

        <View style={styles.field}>
          <Text
            style={[
              styles.label,
              {
                color: theme.text,
              },
            ]}
          >
            Accent Color
          </Text>

          <View
            style={[
              styles.colorContainer,
              {
                borderColor:
                  theme.border,
                backgroundColor:
                  theme.background,
              },
            ]}
          >
            {PRESET_COLORS.map(
              (preset) => {
                const selected =
                  color.toUpperCase() ===
                  preset.toUpperCase();

                return (
                  <Pressable
                    key={preset}
                    onPress={() =>
                      setColor(preset)
                    }
                    style={[
                      styles.colorOption,
                      {
                        backgroundColor:
                          preset,
                      },
                      selected &&
                        styles.colorSelected,
                    ]}
                  >
                    {selected && (
                      <Check
                        size={14}
                        color="#FFFFFF"
                        strokeWidth={3}
                      />
                    )}
                  </Pressable>
                );
              },
            )}
          </View>
        </View>

        {/* =================================================
            INFORMATION
        ================================================= */}

        <View
          style={[
            styles.infoCard,
            {
              borderColor:
                theme.border,
              backgroundColor:
                theme.background,
            },
          ]}
        >
          <View
            style={[
              styles.infoIcon,
              {
                backgroundColor:
                  theme.muted,
              },
            ]}
          >
            <Pencil
              size={15}
              color={
                theme.textSecondary
              }
            />
          </View>

          <View
            style={styles.infoContent}
          >
            <Text
              style={[
                styles.infoTitle,
                {
                  color: theme.text,
                },
              ]}
            >
              Editing category
            </Text>

            <Text
              style={[
                styles.infoText,
                {
                  color:
                    theme.textSecondary,
                },
              ]}
            >
              Changes will be applied to
              this category immediately.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* =================================================
          ACTIONS
      ================================================= */}

      <View
        style={[
          styles.actions,
          {
            borderTopColor:
              theme.border,
            backgroundColor:
              theme.surface,
          },
        ]}
      >
        <Pressable
          onPress={handleClose}
          disabled={
            updateCategory.isPending
          }
          style={[
            styles.cancelButton,
            {
              borderColor:
                theme.border,
                backgroundColor:
                  theme.surface,
            },
          ]}
        >
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

        <Pressable
          onPress={handleSubmit}
          disabled={
            !name.trim() ||
            !icon.trim() ||
            updateCategory.isPending
          }
          style={[
            styles.saveButton,
            {
              backgroundColor:
                theme.primary,
            },
            (!name.trim() ||
              !icon.trim() ||
              updateCategory.isPending) &&
              styles.saveDisabled,
          ]}
        >
          {updateCategory.isPending ? (
            <ActivityIndicator
              size="small"
              color={theme.primaryText}
            />
          ) : (
            <>
              <Check
                size={16}
                color={theme.primaryText}
                strokeWidth={2.5}
              />

              <Text
                style={[
                  styles.saveText,
                  {
                    color:
                      theme.primaryText,
                  },
                ]}
              >
                Save Changes
              </Text>
            </>
          )}
        </Pressable>
      </View>
    </CategoryBottomSheet>
  );
}

const styles = StyleSheet.create({
  /*
   * =========================================================
   * HEADER
   * =========================================================
   */

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 14,

    borderBottomWidth: 1,
  },

  headerLeft: {
    flex: 1,

    flexDirection: "row",
    alignItems: "center",
  },

  headerIcon: {
    width: 42,
    height: 42,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 12,
  },

  headerText: {
    flex: 1,

    marginLeft: 11,
  },

  title: {
    fontSize: 16,
    fontWeight: "800",
  },

  subtitle: {
    marginTop: 3,

    fontSize: 10,
  },

  closeButton: {
    width: 34,
    height: 34,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 10,
  },

  /*
   * =========================================================
   * CONTENT
   * =========================================================
   */

  content: {
    padding: 18,

    gap: 18,
  },

  field: {
    width: "100%",
  },

  label: {
    marginBottom: 7,

    fontSize: 12,
    fontWeight: "700",
  },

  /*
   * =========================================================
   * INPUT
   * =========================================================
   */

  input: {
    height: 44,

    paddingHorizontal: 13,

    borderWidth: 1,

    borderRadius: 11,

    fontSize: 13,
  },

  /*
   * =========================================================
   * ICON SELECTOR
   * =========================================================
   */

  selector: {
    minHeight: 44,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 12,

    borderWidth: 1,

    borderRadius: 11,
  },

  selectorLeft: {
    flex: 1,

    flexDirection: "row",
    alignItems: "center",
  },

  selectorText: {
    marginLeft: 9,

    fontSize: 12,
    fontWeight: "600",
  },

  iconPreview: {
    width: 30,
    height: 30,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 8,
  },

  /*
   * =========================================================
   * ICON PICKER
   * =========================================================
   */

  iconPicker: {
    marginTop: 8,

    padding: 10,

    borderWidth: 1,

    borderRadius: 12,
  },

  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",

    gap: 7,
  },

  iconOption: {
    width: "22%",

    minHeight: 61,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,

    borderRadius: 10,
  },

  iconOptionSelected: {
    borderColor: "#111111",

    backgroundColor: "#F5F5F5",
  },

  iconOptionIcon: {
    width: 30,
    height: 30,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 8,
  },

  iconName: {
    maxWidth: "90%",

    marginTop: 4,

    fontSize: 7,

    textAlign: "center",
  },

  /*
   * =========================================================
   * COLORS
   * =========================================================
   */

  colorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",

    padding: 9,

    borderWidth: 1,

    borderRadius: 11,
  },

  colorOption: {
    width: 27,
    height: 27,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 14,
  },

  colorSelected: {
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  /*
   * =========================================================
   * INFO
   * =========================================================
   */

  infoCard: {
    flexDirection: "row",
    alignItems: "center",

    padding: 12,

    borderWidth: 1,

    borderRadius: 12,
  },

  infoIcon: {
    width: 30,
    height: 30,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 8,
  },

  infoContent: {
    flex: 1,

    marginLeft: 9,
  },

  infoTitle: {
    fontSize: 10,
    fontWeight: "700",
  },

  infoText: {
    marginTop: 2,

    fontSize: 9,
    lineHeight: 13,
  },

  /*
   * =========================================================
   * ACTIONS
   * =========================================================
   */

  actions: {
    flexDirection: "row",

    gap: 10,

    padding: 18,

    borderTopWidth: 1,
  },

  cancelButton: {
    flex: 1,

    height: 44,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,

    borderRadius: 11,
  },

  cancelText: {
    fontSize: 11,
    fontWeight: "700",
  },

  saveButton: {
    flex: 1.5,

    height: 44,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 7,

    borderRadius: 11,
  },

  saveDisabled: {
    opacity: 0.4,
  },

  saveText: {
    fontSize: 11,
    fontWeight: "800",
  },
});