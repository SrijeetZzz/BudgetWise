
import {
  Check,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
} from "lucide-react-native";

import { useState } from "react";

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useCreateCategory } from "../hooks/use-create-category";

import CategoryBottomSheet from "./CategoryBottomSheet";
import { CategoryIcon } from "./category-icon";
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
  "home",
  "car",
  "briefcase",
  "laptop",
  "smartphone",
  "plane",
  "music",
  "gift",
  "heart",
  "dumbbell",
  "education",
  "wallet",
  "credit-card",
  "cash",
  "hand-coins",
  "piggy-bank",
  "wrench",
  "folder",
];

function formatIconName(value: string) {
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

interface CreateCategorySheetProps {
  visible: boolean;
  onClose: () => void;
}

export default function CreateCategorySheet({
  visible,
  onClose,
}: CreateCategorySheetProps) {
  const { theme } = useTheme();

  const createCategory =
    useCreateCategory();

  const [name, setName] = useState("");

  const [type, setType] =
    useState<"EXPENSE" | "INCOME">(
      "EXPENSE",
    );

  const [icon, setIcon] =
    useState("shopping-bag");

  const [color, setColor] =
    useState("#F97316");

  const [showIcons, setShowIcons] =
    useState(false);

  const resetForm = () => {
    setName("");
    setType("EXPENSE");
    setIcon("shopping-bag");
    setColor("#F97316");
    setShowIcons(false);
  };

  const handleClose = () => {
    if (createCategory.isPending) {
      return;
    }

    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    const trimmedName =
      name.trim();

    if (!trimmedName) {
      return;
    }

    try {
      await createCategory.mutateAsync({
        name: trimmedName,
        type,
        icon,
        color,
      });

      resetForm();
      onClose();
    } catch {
      // Hook handles the error.
    }
  };

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
            borderBottomColor:
              theme.border,
            backgroundColor:
              theme.surface,
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
              name={icon}
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
              Create Category
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
              Add a primary income or
              expense category
            </Text>
          </View>
        </View>

        <Pressable
          onPress={handleClose}
          disabled={
            createCategory.isPending
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
            color={theme.textSecondary}
          />
        </Pressable>
      </View>

      {/* =================================================
          FORM
      ================================================= */}

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={
          styles.content
        }
        style={{
          backgroundColor:
            theme.surface,
        }}
      >
        {/* NAME */}

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
              theme.textSecondary
            }
            maxLength={50}
            style={[
              styles.input,
              {
                borderColor:
                  theme.border,
                backgroundColor:
                  theme.surface,
                color: theme.text,
              },
            ]}
            editable={
              !createCategory.isPending
            }
          />

          <Text
            style={[
              styles.characterCount,
              {
                color:
                  theme.textSecondary,
              },
            ]}
          >
            {name.length}/50
          </Text>
        </View>

        {/* TYPE */}

        <View style={styles.field}>
          <Text
            style={[
              styles.label,
              {
                color: theme.text,
              },
            ]}
          >
            Category Type
          </Text>

          <View
            style={[
              styles.typeSelector,
              {
                borderColor:
                  theme.border,
                backgroundColor:
                  theme.surfaceSecondary,
              },
            ]}
          >
            <Pressable
              onPress={() =>
                setType("EXPENSE")
              }
              style={[
                styles.typeButton,
                type === "EXPENSE" && {
                  backgroundColor:
                    theme.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.typeText,
                  {
                    color:
                      theme.textSecondary,
                  },
                  type === "EXPENSE" && {
                    color:
                      theme.primaryText,
                  },
                ]}
              >
                Expense
              </Text>
            </Pressable>

            <Pressable
              onPress={() =>
                setType("INCOME")
              }
              style={[
                styles.typeButton,
                type === "INCOME" && {
                  backgroundColor:
                    theme.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.typeText,
                  {
                    color:
                      theme.textSecondary,
                  },
                  type === "INCOME" && {
                    color:
                      theme.primaryText,
                  },
                ]}
              >
                Income
              </Text>
            </Pressable>
          </View>
        </View>

        {/* ICON */}

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
              styles.iconSelector,
              {
                borderColor:
                  theme.border,
                backgroundColor:
                  theme.surface,
              },
            ]}
          >
            <View
              style={
                styles.selectedIconLeft
              }
            >
              <View
                style={[
                  styles.selectedIcon,
                  {
                    backgroundColor:
                      `${color}18`,
                  },
                ]}
              >
                <CategoryIcon
                  name={icon}
                  size={17}
                  color={color}
                />
              </View>

              <Text
                style={[
                  styles.selectedIconText,
                  {
                    color: theme.text,
                  },
                ]}
              >
                {formatIconName(icon)}
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

          {showIcons && (
            <View
              style={[
                styles.iconPicker,
                {
                  borderColor:
                    theme.border,
                  backgroundColor:
                    theme.surfaceSecondary,
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
                              theme.primary,
                            backgroundColor:
                              theme.muted,
                          },
                        ]}
                      >
                        <CategoryIcon
                          name={iconName}
                          size={21}
                          color={
                            selected
                              ? color
                              : theme.textSecondary
                          }
                        />

                        <Text
                          numberOfLines={1}
                          style={[
                            styles.iconName,
                            {
                              color:
                                theme.textSecondary,
                            },
                            selected && {
                              fontWeight:
                                "800",
                              color:
                                theme.text,
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

        {/* COLOR */}

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
                  theme.surfaceSecondary,
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
                        color={
                          theme.primaryText
                        }
                        strokeWidth={3}
                      />
                    )}
                  </Pressable>
                );
              },
            )}
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
            createCategory.isPending
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
            createCategory.isPending
          }
          style={[
            styles.createButton,
            {
              backgroundColor:
                theme.primary,
            },
            (!name.trim() ||
              createCategory.isPending) &&
              styles.createDisabled,
          ]}
        >
          {createCategory.isPending ? (
            <ActivityIndicator
              size="small"
              color={theme.primaryText}
            />
          ) : (
            <>
              <Plus
                size={16}
                color={
                  theme.primaryText
                }
                strokeWidth={2.5}
              />

              <Text
                style={[
                  styles.createText,
                  {
                    color:
                      theme.primaryText,
                  },
                ]}
              >
                Create Category
              </Text>
            </>
          )}
        </Pressable>
      </View>
    </CategoryBottomSheet>
  );
}

const styles = StyleSheet.create({
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

    minWidth: 0,
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

    minWidth: 0,

    marginLeft: 11,
  },

  title: {
    fontSize: 16,
    fontWeight: "800",
  },

  subtitle: {
    marginTop: 3,

    fontSize: 10,
    fontWeight: "500",
  },

  closeButton: {
    width: 34,
    height: 34,

    alignItems: "center",
    justifyContent: "center",

    marginLeft: 10,

    borderRadius: 10,
  },

  content: {
    paddingHorizontal: 18,
    paddingVertical: 18,

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

  input: {
    height: 44,

    paddingHorizontal: 13,

    borderWidth: 1,

    borderRadius: 11,

    fontSize: 13,
    fontWeight: "500",
  },

  characterCount: {
    marginTop: 4,

    fontSize: 9,

    textAlign: "right",
  },

  typeSelector: {
    flexDirection: "row",

    padding: 3,

    borderWidth: 1,

    borderRadius: 11,
  },

  typeButton: {
    flex: 1,

    height: 38,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 8,
  },

  typeText: {
    fontSize: 11,
    fontWeight: "700",
  },

  iconSelector: {
    minHeight: 44,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 12,

    borderWidth: 1,

    borderRadius: 11,
  },

  selectedIconLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  selectedIcon: {
    width: 30,
    height: 30,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 8,
  },

  selectedIconText: {
    marginLeft: 9,

    fontSize: 12,
    fontWeight: "600",
  },

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

    minHeight: 60,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,

    borderRadius: 10,
  },

  iconName: {
    marginTop: 5,

    fontSize: 7,
  },

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

    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 2,

    elevation: 2,
  },

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

  createButton: {
    flex: 1.5,

    height: 44,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 7,

    borderRadius: 11,
  },

  createDisabled: {
    opacity: 0.4,
  },

  createText: {
    fontSize: 11,
    fontWeight: "800",
  },
});