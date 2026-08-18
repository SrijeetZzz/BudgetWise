

import {
  ChevronDown,
  ChevronRight,
  Pencil,
  Trash2,
} from "lucide-react-native";

import { useMemo, useState } from "react";

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useCategories } from "../hooks/use-categories";

import type { Category } from "../../../types/category.types";

import { CategoryIcon } from "./category-icon";

import DeleteCategorySheet from "./DeleteCategorySheet";
import DeleteSubcategorySheet from "./DeleteSubcategorySheet";
import EditCategorySheet from "./EditCategorySheet";
import EditSubcategorySheet from "./EditSubcategorySheet";
import { useTheme } from "../../../providers/ThemeProvider";


export default function CategoryList() {
  const { theme } = useTheme();

  const {
    data,
    isLoading,
    isError,
  } = useCategories();

  /*
   * =========================================================
   * STATE
   * =========================================================
   */

  const [expanded, setExpanded] =
    useState<Record<string, boolean>>({});

  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  const [editingSubcategory, setEditingSubcategory] =
    useState<Category | null>(null);

  const [deletingCategory, setDeletingCategory] =
    useState<Category | null>(null);

  const [deletingSubcategory, setDeletingSubcategory] =
    useState<Category | null>(null);

  /*
   * =========================================================
   * DATA
   * =========================================================
   */

  const categories = data?.data ?? [];

  /*
   * =========================================================
   * PARENT CATEGORIES
   * =========================================================
   */

  const parentCategories = useMemo(
    () =>
      categories.filter(
        (category) =>
          category.level === 0,
      ),
    [categories],
  );

  /*
   * =========================================================
   * CHILDREN
   * =========================================================
   */

  const getChildren = (
    parentId: string,
  ): Category[] =>
    categories.filter(
      (category) =>
        category.level === 1 &&
        category.parentCategoryId ===
          parentId,
    );

  /*
   * =========================================================
   * TOGGLE
   * =========================================================
   */

  const toggleCategory = (
    categoryId: string,
  ) => {
    setExpanded((previous) => ({
      ...previous,
      [categoryId]:
        !previous[categoryId],
    }));
  };

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (isLoading) {
    return (
      <View
        style={[
          styles.loading,
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
          Loading categories...
        </Text>
      </View>
    );
  }

  /*
   * =========================================================
   * ERROR
   * =========================================================
   */

  if (isError) {
    return (
      <View
        style={[
          styles.error,
          {
            borderColor:
              theme.border,
            backgroundColor:
              theme.surfaceSecondary,
          },
        ]}
      >
        <Text
          style={[
            styles.errorTitle,
            {
              color:
                theme.destructive,
            },
          ]}
        >
          Unable to load categories
        </Text>

        <Text
          style={[
            styles.errorText,
            {
              color:
                theme.textSecondary,
            },
          ]}
        >
          Please try again later.
        </Text>
      </View>
    );
  }

  /*
   * =========================================================
   * EMPTY
   * =========================================================
   */

  if (!categories.length) {
    return (
      <View
        style={[
          styles.empty,
          {
            borderColor:
              theme.border,
            backgroundColor:
              theme.surface,
          },
        ]}
      >
        <View
          style={[
            styles.emptyIcon,
            {
              backgroundColor:
                theme.muted,
            },
          ]}
        >
          <CategoryIcon
            name="folder-plus"
            size={24}
            color={theme.textSecondary}
          />
        </View>

        <Text
          style={[
            styles.emptyTitle,
            {
              color: theme.text,
            },
          ]}
        >
          No categories found
        </Text>

        <Text
          style={[
            styles.emptyText,
            {
              color:
                theme.textSecondary,
            },
          ]}
        >
          Get started by creating your first
          category.
        </Text>
      </View>
    );
  }

  /*
   * =========================================================
   * FILTER
   * =========================================================
   */

  const expenseCategories =
    parentCategories.filter(
      (category) =>
        category.type === "EXPENSE",
    );

  const incomeCategories =
    parentCategories.filter(
      (category) =>
        category.type === "INCOME",
    );

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            theme.background,
        },
      ]}
    >
      {/* =================================================
          EXPENSE
      ================================================= */}

      <CategorySection
        title="Expense Categories"
        description="Categories used to organize your spending."
        type="EXPENSE"
        categories={expenseCategories}
        getChildren={getChildren}
        expanded={expanded}
        onToggle={toggleCategory}
        onEditCategory={setEditingCategory}
        onDeleteCategory={setDeletingCategory}
        onEditSubcategory={
          setEditingSubcategory
        }
        onDeleteSubcategory={
          setDeletingSubcategory
        }
      />

      {/* =================================================
          INCOME
      ================================================= */}

      <CategorySection
        title="Income Categories"
        description="Categories used to organize your income."
        type="INCOME"
        categories={incomeCategories}
        getChildren={getChildren}
        expanded={expanded}
        onToggle={toggleCategory}
        onEditCategory={setEditingCategory}
        onDeleteCategory={setDeletingCategory}
        onEditSubcategory={
          setEditingSubcategory
        }
        onDeleteSubcategory={
          setDeletingSubcategory
        }
      />

      {/* =================================================
          EDIT CATEGORY SHEET
      ================================================= */}

      {editingCategory && (
        <EditCategorySheet
          visible={true}
          category={editingCategory}
          onClose={() =>
            setEditingCategory(null)
          }
        />
      )}

      {/* =================================================
          EDIT SUBCATEGORY SHEET
      ================================================= */}

      {editingSubcategory && (
        <EditSubcategorySheet
          visible={true}
          subcategory={
            editingSubcategory
          }
          onClose={() =>
            setEditingSubcategory(null)
          }
        />
      )}

      {/* =================================================
          DELETE CATEGORY SHEET
      ================================================= */}

      {deletingCategory && (
        <DeleteCategorySheet
          visible={true}
          category={deletingCategory}
          onClose={() =>
            setDeletingCategory(null)
          }
        />
      )}

      {/* =================================================
          DELETE SUBCATEGORY SHEET
      ================================================= */}

      {deletingSubcategory && (
        <DeleteSubcategorySheet
          visible={true}
          subcategory={
            deletingSubcategory
          }
          onClose={() =>
            setDeletingSubcategory(null)
          }
        />
      )}
    </View>
  );
}

/*
 * ===========================================================
 * SECTION
 * ===========================================================
 */

interface CategorySectionProps {
  title: string;
  description: string;
  type: "INCOME" | "EXPENSE";
  categories: Category[];

  getChildren: (
    parentId: string,
  ) => Category[];

  expanded: Record<
    string,
    boolean
  >;

  onToggle: (
    categoryId: string,
  ) => void;

  onEditCategory: (
    category: Category,
  ) => void;

  onDeleteCategory: (
    category: Category,
  ) => void;

  onEditSubcategory: (
    category: Category,
  ) => void;

  onDeleteSubcategory: (
    category: Category,
  ) => void;
}

function CategorySection({
  title,
  description,
  type,
  categories,
  getChildren,
  expanded,
  onToggle,
  onEditCategory,
  onDeleteCategory,
  onEditSubcategory,
  onDeleteSubcategory,
}: CategorySectionProps) {
  const { theme } = useTheme();

  if (!categories.length) {
    return null;
  }

  return (
    <View style={styles.section}>
      {/* =================================================
          HEADER
      ================================================= */}

      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeading}>
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

        <View
          style={[
            styles.countBadge,
            {
              backgroundColor:
                theme.muted,
            },
          ]}
        >
          <Text
            style={[
              styles.countText,
              {
                color:
                  theme.textSecondary,
              },
            ]}
          >
            {categories.length}
          </Text>
        </View>
      </View>

      {/* =================================================
          LIST
      ================================================= */}

      <View
        style={[
          styles.list,
          {
            borderColor:
              theme.border,
            backgroundColor:
              theme.surface,
          },
        ]}
      >
        {categories.map((category) => {
          const children =
            getChildren(category._id);

          const isExpanded =
            expanded[category._id] ??
            false;

          return (
            <View
              key={category._id}
              style={[
                styles.categoryContainer,
                {
                  borderBottomColor:
                    theme.border,
                },
              ]}
            >
              {/* =================================================
                  PARENT ROW
              ================================================= */}

              <View
                style={styles.parentRow}
              >
                <Pressable
                  disabled={!children.length}
                  onPress={() =>
                    onToggle(
                      category._id,
                    )
                  }
                  style={({ pressed }) => [
                    styles.parentButton,

                    pressed &&
                      children.length >
                        0 && {
                        backgroundColor:
                          theme.surfaceSecondary,
                      },
                  ]}
                >
                  {/* Expand */}

                  <View
                    style={styles.expandIcon}
                  >
                    {children.length >
                    0 ? (
                      isExpanded ? (
                        <ChevronDown
                          size={17}
                          color={
                            theme.textSecondary
                          }
                          strokeWidth={2.2}
                        />
                      ) : (
                        <ChevronRight
                          size={17}
                          color={
                            theme.textSecondary
                          }
                          strokeWidth={2.2}
                        />
                      )
                    ) : null}
                  </View>

                  {/* Icon */}

                  <View
                    style={[
                      styles.categoryIcon,
                      {
                        backgroundColor:
                          `${category.color}15`,
                      },
                    ]}
                  >
                    <CategoryIcon
                      name={category.icon}
                      size={20}
                      color={
                        category.color
                      }
                    />
                  </View>

                  {/* Details */}

                  <View
                    style={
                      styles.categoryDetails
                    }
                  >
                    <View
                      style={styles.nameRow}
                    >
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.categoryName,
                          {
                            color:
                              theme.text,
                          },
                        ]}
                      >
                        {category.name}
                      </Text>

                      {category.isSystem && (
                        <View
                          style={[
                            styles.systemBadge,
                            {
                              backgroundColor:
                                theme.muted,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.systemText,
                              {
                                color:
                                  theme.textSecondary,
                              },
                            ]}
                          >
                            SYSTEM
                          </Text>
                        </View>
                      )}
                    </View>

                    <Text
                      style={[
                        styles.categoryMeta,
                        {
                          color:
                            theme.textSecondary,
                        },
                      ]}
                    >
                      {type === "EXPENSE"
                        ? "Expense"
                        : "Income"}

                      {!category.isSystem &&
                        " • Custom"}
                    </Text>
                  </View>

                  {/* Count */}

                  {children.length >
                    0 && (
                    <View
                      style={[
                        styles.subCount,
                        {
                          backgroundColor:
                            theme.muted,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.subCountText,
                          {
                            color:
                              theme.textSecondary,
                          },
                        ]}
                      >
                        {children.length}
                      </Text>
                    </View>
                  )}
                </Pressable>

                {/* =================================================
                    ACTION BUTTONS
                ================================================= */}

                {!category.isSystem && (
                  <View
                    style={
                      styles.actionButtons
                    }
                  >
                    {/* EDIT */}

                    <Pressable
                      onPress={() =>
                        onEditCategory(
                          category,
                        )
                      }
                      hitSlop={6}
                      style={({ pressed }) => [
                        styles.actionButton,
                        styles.editButton,
                        {
                          borderColor:
                            theme.border,
                          backgroundColor:
                            theme.surfaceSecondary,
                        },
                        pressed && {
                          opacity: 0.55,
                        },
                      ]}
                    >
                      <Pencil
                        size={15}
                        color={
                          theme.text
                        }
                        strokeWidth={2.2}
                      />
                    </Pressable>

                    {/* DELETE */}

                    <Pressable
                      onPress={() =>
                        onDeleteCategory(
                          category,
                        )
                      }
                      hitSlop={6}
                      style={({ pressed }) => [
                        styles.actionButton,
                        styles.deleteButton,
                        {
                          borderColor:
                            theme.destructive,
                        },
                        pressed && {
                          opacity: 0.55,
                        },
                      ]}
                    >
                      <Trash2
                        size={15}
                        color={
                          theme.destructive
                        }
                        strokeWidth={2.2}
                      />
                    </Pressable>
                  </View>
                )}
              </View>

              {/* =================================================
                  SUBCATEGORIES
              ================================================= */}

              {isExpanded &&
                children.length >
                  0 && (
                  <View
                    style={[
                      styles.childrenContainer,
                      {
                        borderTopColor:
                          theme.border,
                        backgroundColor:
                          theme.surfaceSecondary,
                      },
                    ]}
                  >
                    {children.map(
                      (child) => (
                        <View
                          key={
                            child._id
                          }
                          style={[
                            styles.childRow,
                            {
                              borderBottomColor:
                                theme.border,
                            },
                          ]}
                        >
                          {/* Icon */}

                          <View
                            style={[
                              styles.childIcon,
                              {
                                backgroundColor:
                                  `${child.color}15`,
                              },
                            ]}
                          >
                            <CategoryIcon
                              name={
                                child.icon
                              }
                              size={16}
                              color={
                                child.color
                              }
                            />
                          </View>

                          {/* Details */}

                          <View
                            style={
                              styles.childDetails
                            }
                          >
                            <View
                              style={
                                styles.nameRow
                              }
                            >
                              <Text
                                numberOfLines={
                                  1
                                }
                                style={[
                                  styles.childName,
                                  {
                                    color:
                                      theme.text,
                                  },
                                ]}
                              >
                                {
                                  child.name
                                }
                              </Text>

                              {child.isSystem && (
                                <View
                                  style={[
                                    styles.systemBadge,
                                    {
                                      backgroundColor:
                                        theme.muted,
                                    },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.systemText,
                                      {
                                        color:
                                          theme.textSecondary,
                                      },
                                    ]}
                                  >
                                    SYSTEM
                                  </Text>
                                </View>
                              )}
                            </View>

                            <Text
                              style={[
                                styles.childMeta,
                                {
                                  color:
                                    theme.textSecondary,
                                },
                              ]}
                            >
                              {type ===
                              "EXPENSE"
                                ? "Expense"
                                : "Income"}

                              {!child.isSystem &&
                                " • Custom"}
                            </Text>
                          </View>

                          {/* =================================================
                              SUBCATEGORY ACTION BUTTONS
                          ================================================= */}

                          {!child.isSystem && (
                            <View
                              style={
                                styles.actionButtons
                              }
                            >
                              {/* EDIT */}

                              <Pressable
                                onPress={() =>
                                  onEditSubcategory(
                                    child,
                                  )
                                }
                                hitSlop={6}
                                style={({ pressed }) => [
                                  styles.actionButton,
                                  styles.editButton,
                                  {
                                    borderColor:
                                      theme.border,
                                    backgroundColor:
                                      theme.surface,
                                  },
                                  pressed && {
                                    opacity: 0.55,
                                  },
                                ]}
                              >
                                <Pencil
                                  size={14}
                                  color={
                                    theme.text
                                  }
                                  strokeWidth={
                                    2.2
                                  }
                                />
                              </Pressable>

                              {/* DELETE */}

                              <Pressable
                                onPress={() =>
                                  onDeleteSubcategory(
                                    child,
                                  )
                                }
                                hitSlop={6}
                                style={({ pressed }) => [
                                  styles.actionButton,
                                  styles.deleteButton,
                                  {
                                    borderColor:
                                      theme.destructive,
                                  },
                                  pressed && {
                                    opacity: 0.55,
                                  },
                                ]}
                              >
                                <Trash2
                                  size={14}
                                  color={
                                    theme.destructive
                                  }
                                  strokeWidth={
                                    2.2
                                  }
                                />
                              </Pressable>
                            </View>
                          )}
                        </View>
                      ),
                    )}
                  </View>
                )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /*
   * =========================================================
   * CONTAINER
   * =========================================================
   */

  container: {
    width: "100%",
  },

  /*
   * =========================================================
   * SECTION
   * =========================================================
   */

  section: {
    marginBottom: 24,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",

    marginBottom: 10,
  },

  sectionHeading: {
    flex: 1,
    paddingRight: 12,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
  },

  sectionDescription: {
    marginTop: 3,

    fontSize: 11,
    lineHeight: 16,
    fontWeight: "500",
  },

  countBadge: {
    minWidth: 28,
    height: 25,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 8,

    borderRadius: 8,
  },

  countText: {
    fontSize: 11,
    fontWeight: "700",
  },

  /*
   * =========================================================
   * LIST
   * =========================================================
   */

  list: {
    overflow: "hidden",

    borderWidth: 1,

    borderRadius: 16,
  },

  categoryContainer: {
    borderBottomWidth: 1,
  },

  /*
   * =========================================================
   * PARENT
   * =========================================================
   */

  parentRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  parentButton: {
    flex: 1,

    minWidth: 0,

    flexDirection: "row",
    alignItems: "center",

    paddingVertical: 13,
    paddingLeft: 10,
  },

  expandIcon: {
    width: 24,
    height: 24,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 3,
  },

  categoryIcon: {
    width: 40,
    height: 40,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 12,
  },

  categoryDetails: {
    flex: 1,

    minWidth: 0,

    marginLeft: 10,
    marginRight: 6,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",

    minWidth: 0,

    gap: 6,
  },

  categoryName: {
    flexShrink: 1,

    fontSize: 13,
    fontWeight: "700",
  },

  categoryMeta: {
    marginTop: 3,

    fontSize: 10,
    fontWeight: "500",
  },

  /*
   * =========================================================
   * SYSTEM
   * =========================================================
   */

  systemBadge: {
    paddingHorizontal: 5,
    paddingVertical: 2,

    borderRadius: 5,
  },

  systemText: {
    fontSize: 7,
    fontWeight: "800",

    letterSpacing: 0.5,
  },

  /*
   * =========================================================
   * SUBCATEGORY COUNT
   * =========================================================
   */

  subCount: {
    width: 34,
    height: 28,

    alignItems: "center",
    justifyContent: "center",

    marginLeft: 6,
    marginRight: 8,

    borderRadius: 9,
  },

  subCountText: {
    fontSize: 10,
    fontWeight: "700",
  },

  /*
   * =========================================================
   * ACTION BUTTONS
   * =========================================================
   */

  actionButtons: {
    flexDirection: "row",
    alignItems: "center",

    gap: 4,

    marginRight: 6,
  },

  actionButton: {
    width: 34,
    height: 34,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,

    borderRadius: 9,
  },

  editButton: {},

  deleteButton: {},

  /*
   * =========================================================
   * CHILDREN
   * =========================================================
   */

  childrenContainer: {
    paddingLeft: 48,

    borderTopWidth: 1,
  },

  childRow: {
    minHeight: 52,

    flexDirection: "row",
    alignItems: "center",

    paddingRight: 0,

    borderBottomWidth: 1,
  },

  childIcon: {
    width: 32,
    height: 32,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 9,
  },

  childDetails: {
    flex: 1,

    minWidth: 0,

    marginLeft: 9,
  },

  childName: {
    flexShrink: 1,

    fontSize: 12,
    fontWeight: "600",
  },

  childMeta: {
    marginTop: 2,

    fontSize: 9,
    fontWeight: "500",
  },

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  loading: {
    minHeight: 180,

    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 8,

    fontSize: 12,
    fontWeight: "500",
  },

  /*
   * =========================================================
   * ERROR
   * =========================================================
   */

  error: {
    padding: 18,

    alignItems: "center",

    borderWidth: 1,

    borderRadius: 16,
  },

  errorTitle: {
    fontSize: 13,
    fontWeight: "700",
  },

  errorText: {
    marginTop: 4,

    fontSize: 11,
    fontWeight: "500",
  },

  /*
   * =========================================================
   * EMPTY
   * =========================================================
   */

  empty: {
    minHeight: 220,

    alignItems: "center",
    justifyContent: "center",

    padding: 24,

    borderWidth: 1,

    borderRadius: 16,
  },

  emptyIcon: {
    width: 48,
    height: 48,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 14,
  },

  emptyTitle: {
    marginTop: 12,

    fontSize: 14,
    fontWeight: "800",
  },

  emptyText: {
    marginTop: 4,

    fontSize: 11,
    fontWeight: "500",

    textAlign: "center",
  },
});