

import {
  AlertTriangle,
  Trash2,
  X,
} from "lucide-react-native";

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";



import { useDeleteCategory } from "../hooks/use-delete-category";

import CategoryBottomSheet from "./CategoryBottomSheet";

import type { Category } from "../../../types/category.types";
import { useTheme } from "../../../providers/ThemeProvider";

interface DeleteCategorySheetProps {
  visible: boolean;
  category: Category;
  onClose: () => void;
}

export default function DeleteCategorySheet({
  visible,
  category,
  onClose,
}: DeleteCategorySheetProps) {
  const { theme } = useTheme();

  const deleteCategory =
    useDeleteCategory();

  if (category.isSystem) {
    return null;
  }

  const handleDelete = async () => {
    try {
      await deleteCategory.mutateAsync(
        category._id,
      );

      onClose();
    } catch {
      // Hook handles error.
    }
  };

  return (
    <CategoryBottomSheet
      visible={visible}
      onClose={() => {
        if (!deleteCategory.isPending) {
          onClose();
        }
      }}
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
              styles.warningIcon,
              {
                backgroundColor:
                  theme.destructive + "18",
              },
            ]}
          >
            <AlertTriangle
              size={21}
              color={theme.destructive}
              strokeWidth={2}
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
              Delete Category
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
              Permanently remove this category
            </Text>
          </View>
        </View>

        <Pressable
          disabled={
            deleteCategory.isPending
          }
          onPress={onClose}
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

      <View
        style={[
          styles.content,
          {
            backgroundColor:
              theme.surface,
          },
        ]}
      >
        <View
          style={[
            styles.messageCard,
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
              styles.message,
              {
                color: theme.text,
              },
            ]}
          >
            Are you sure you want to delete{" "}
            <Text
              style={[
                styles.categoryName,
                {
                  color: theme.text,
                },
              ]}
            >
              {category.name}
            </Text>
            ?
          </Text>

          <Text
            style={[
              styles.description,
              {
                color:
                  theme.textSecondary,
              },
            ]}
          >
            This action cannot be undone from
            the current interface.
          </Text>
        </View>

        {/* Warning */}

        <View
          style={[
            styles.warningCard,
            {
              borderColor:
                theme.destructive + "45",
              backgroundColor:
                theme.destructive + "12",
            },
          ]}
        >
          <View
            style={[
              styles.warningSmallIcon,
              {
                backgroundColor:
                  theme.surface,
              },
            ]}
          >
            <AlertTriangle
              size={15}
              color={theme.destructive}
              strokeWidth={2}
            />
          </View>

          <View style={styles.warningContent}>
            <Text
              style={[
                styles.warningTitle,
                {
                  color:
                    theme.destructive,
                },
              ]}
            >
              This action is permanent
            </Text>

            <Text
              style={[
                styles.warningText,
                {
                  color:
                    theme.destructive,
                },
              ]}
            >
              Make sure you want to remove
              this category before continuing.
            </Text>
          </View>
        </View>
      </View>

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
          onPress={onClose}
          disabled={
            deleteCategory.isPending
          }
          style={({ pressed }) => [
            styles.cancelButton,
            {
              borderColor:
                theme.border,
              backgroundColor:
                theme.surface,
            },
            pressed && styles.pressed,
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
          onPress={handleDelete}
          disabled={
            deleteCategory.isPending
          }
          style={({ pressed }) => [
            styles.deleteButton,
            {
              backgroundColor:
                theme.destructive,
            },
            pressed &&
              styles.deletePressed,
            deleteCategory.isPending &&
              styles.deleteDisabled,
          ]}
        >
          {deleteCategory.isPending ? (
            <>
              <ActivityIndicator
                size="small"
                color={theme.primaryText}
              />

              <Text
                style={[
                  styles.deleteText,
                  {
                    color:
                      theme.primaryText,
                  },
                ]}
              >
                Deleting...
              </Text>
            </>
          ) : (
            <>
              <Trash2
                size={16}
                color={theme.primaryText}
                strokeWidth={2.2}
              />

              <Text
                style={[
                  styles.deleteText,
                  {
                    color:
                      theme.primaryText,
                  },
                ]}
              >
                Delete Category
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

  warningIcon: {
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

    gap: 12,
  },

  messageCard: {
    padding: 14,

    borderWidth: 1,

    borderRadius: 12,
  },

  message: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "500",
  },

  categoryName: {
    fontWeight: "800",
  },

  description: {
    marginTop: 7,

    fontSize: 10,
    lineHeight: 15,
  },

  /*
   * =========================================================
   * WARNING
   * =========================================================
   */

  warningCard: {
    flexDirection: "row",
    alignItems: "flex-start",

    padding: 12,

    borderWidth: 1,

    borderRadius: 12,
  },

  warningSmallIcon: {
    width: 28,
    height: 28,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 8,
  },

  warningContent: {
    flex: 1,

    marginLeft: 9,
  },

  warningTitle: {
    fontSize: 10,
    fontWeight: "800",
  },

  warningText: {
    marginTop: 3,

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

  deleteButton: {
    flex: 1.5,

    height: 44,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 7,

    borderRadius: 11,
  },

  deletePressed: {
    opacity: 0.8,
  },

  deleteDisabled: {
    opacity: 0.45,
  },

  deleteText: {
    fontSize: 11,
    fontWeight: "800",
  },

  pressed: {
    opacity: 0.6,
  },
});