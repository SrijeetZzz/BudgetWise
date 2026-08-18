
import {
  Plus,
} from "lucide-react-native";

import { useState } from "react";

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";



import AppHeader from "../../features/app/components/AppHeader";

import CategoryList from "../../features/categories/components/CategoryList";
import CreateCategorySheet from "../../features/categories/components/CreateCategorySheet";
import CreateSubcategorySheet from "../../features/categories/components/CreateSubcategorySheet";
import { useTheme } from "../../providers/ThemeProvider";

export default function CategoriesPage() {
  const { theme } = useTheme();

  const [
    createCategoryOpen,
    setCreateCategoryOpen,
  ] = useState(false);

  const [
    createSubcategoryOpen,
    setCreateSubcategoryOpen,
  ] = useState(false);

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
      <AppHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <View style={styles.header}>
          <View style={styles.heading}>
            <Text
              style={[
                styles.title,
                {
                  color: theme.text,
                },
              ]}
            >
              Categories
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
              Organize your income and
              expenses with categories and
              subcategories.
            </Text>
          </View>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <View style={styles.actions}>
            {/* CREATE CATEGORY */}

            <Pressable
              onPress={() =>
                setCreateCategoryOpen(
                  true,
                )
              }
              style={({ pressed }) => [
                styles.actionButton,
                {
                  backgroundColor:
                    theme.primary,
                },
                pressed &&
                  styles.actionPressed,
              ]}
            >
              <Plus
                size={16}
                color={theme.primaryText}
                strokeWidth={2.5}
              />

              <Text
                style={[
                  styles.actionText,
                  {
                    color:
                      theme.primaryText,
                  },
                ]}
              >
                Category
              </Text>
            </Pressable>

            {/* CREATE SUBCATEGORY */}

            <Pressable
              onPress={() =>
                setCreateSubcategoryOpen(
                  true,
                )
              }
              style={({ pressed }) => [
                styles.actionButton,
                styles.secondaryButton,
                {
                  backgroundColor:
                    theme.surface,
                  borderColor:
                    theme.border,
                },
                pressed &&
                  styles.secondaryPressed,
              ]}
            >
              <Plus
                size={16}
                color={theme.text}
                strokeWidth={2.5}
              />

              <Text
                style={[
                  styles.secondaryText,
                  {
                    color: theme.text,
                  },
                ]}
              >
                Subcategory
              </Text>
            </Pressable>
          </View>
        </View>

        {/* =================================================
            CATEGORY LIST
        ================================================= */}

        <CategoryList />
      </ScrollView>

      {/* =================================================
          CREATE CATEGORY
      ================================================= */}

      <CreateCategorySheet
        visible={createCategoryOpen}
        onClose={() =>
          setCreateCategoryOpen(
            false,
          )
        }
      />

      {/* =================================================
          CREATE SUBCATEGORY
      ================================================= */}

      <CreateSubcategorySheet
        visible={
          createSubcategoryOpen
        }
        onClose={() =>
          setCreateSubcategoryOpen(
            false,
          )
        }
      />
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
    flex: 1,
  },

  /*
   * =========================================================
   * CONTENT
   * =========================================================
   */

  content: {
    paddingHorizontal: 16,
    paddingTop: 16,

    paddingBottom: 110,
  },

  /*
   * =========================================================
   * HEADER
   * =========================================================
   */

  header: {
    marginBottom: 20,
  },

  heading: {
    marginBottom: 14,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
  },

  subtitle: {
    marginTop: 4,

    fontSize: 12,
    lineHeight: 18,

    fontWeight: "500",
  },

  /*
   * =========================================================
   * ACTIONS
   * =========================================================
   */

  actions: {
    flexDirection: "row",

    gap: 8,
  },

  actionButton: {
    height: 40,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 6,

    paddingHorizontal: 13,

    borderRadius: 10,
  },

  actionPressed: {
    opacity: 0.75,
  },

  /*
   * =========================================================
   * SECONDARY ACTION
   * =========================================================
   */

  secondaryButton: {
    borderWidth: 1,
  },

  secondaryPressed: {
    opacity: 0.7,
  },

  /*
   * =========================================================
   * TEXT
   * =========================================================
   */

  actionText: {
    fontSize: 10,
    fontWeight: "800",
  },

  secondaryText: {
    fontSize: 10,
    fontWeight: "800",
  },
});