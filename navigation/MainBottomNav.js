import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  BottomNavigation,
  BottomNavigationTab,
  Icon,
} from "@ui-kitten/components";
import HomeDrawerNavigator from "./HomeDrawer";
import IssueDrawerNavigator from "./IssueDrawer";
import CurrencyDrawerNavigator from "./CurrencyDrawer";
import MessagesDrawerNavigator from "./MessagesDrawer";
import QualiDrawerNavigator from "./QualiDrawer"; // Assuming this exists

const { Navigator, Screen } = createBottomTabNavigator();

const BottomTabBar = ({ navigation, state }) => {
  const handleSelect = (index) => {
    const selectedTab = state.routeNames[index];
    console.log(`Selected tab: ${selectedTab}`);
    navigation.navigate(selectedTab, {
      logMessage: `Selected tab: ${selectedTab}`,
    });
  };

  return (
    <BottomNavigation selectedIndex={state.index} onSelect={handleSelect}>
      <BottomNavigationTab
        icon={(props) => <Icon {...props} name="home-outline" />}
      />
      <BottomNavigationTab
        icon={(props) => <Icon {...props} name="alert-triangle-outline" />}
      />
      <BottomNavigationTab
        icon={(props) => <Icon {...props} name="file-text-outline" />}
      />
      <BottomNavigationTab
        icon={(props) => <Icon {...props} name="checkmark-circle-2-outline" />}
      />
      <BottomNavigationTab
        icon={(props) => <Icon {...props} name="message-circle-outline" />}
      />
    </BottomNavigation>
  );
};

export default function MainBottomNav() {
  return (
    <Navigator
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Screen name="mHome" component={HomeDrawerNavigator} />
      <Screen name="mIssue" component={IssueDrawerNavigator} />
      <Screen name="mQualifications" component={QualiDrawerNavigator} />
      <Screen name="mCurrency" component={CurrencyDrawerNavigator} />
      <Screen name="mMessages" component={MessagesDrawerNavigator} />
    </Navigator>
  );
}
