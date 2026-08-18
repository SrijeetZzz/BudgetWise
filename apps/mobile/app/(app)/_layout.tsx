
import { Tabs } from "expo-router";

import FloatingTabBar from "../../features/app/components/FloatingTabBar";

export default function AppLayout() {
  return (
    <Tabs
      tabBar={(props) => (
        <FloatingTabBar {...props} />
      )}
      screenOptions={{
        headerShown: false,

        sceneStyle: {
          backgroundColor: "#F7F7F7",
        },
      }}
    >
      {/* =================================================
          MAIN APP TABS
      ================================================= */}

      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />

      <Tabs.Screen
        name="transactions"
        options={{
          title: "Transactions",
        }}
      />

      <Tabs.Screen
        name="categories"
        options={{
          title: "Categories",
        }}
      />

      <Tabs.Screen
        name="budgets"
        options={{
          title: "Budgets",
        }}
      />

      <Tabs.Screen
        name="reports"
        options={{
          title: "Reports",
        }}
      />
    </Tabs>
  );
}