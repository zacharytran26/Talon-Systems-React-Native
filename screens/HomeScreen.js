import React, { useState, useEffect } from "react";
import { StatusBar, ImageBackground, StyleSheet, View } from "react-native";
import {
  Layout,
  BottomNavigation,
  BottomNavigationTab,
  Text,
  Icon,
} from "@ui-kitten/components";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CalendarSimpleUsageShowcase from "./Calendar";
import CurrencyScreen from "./Currencies";
import QualiScreen from "./QualificationScreen";
import MessagesScreen from "./MessageListScreen";
import dayjs from "dayjs";

const Tab = createBottomTabNavigator();

const HomeIcon = (props) => <Icon {...props} name="home-outline" />;
const MessageIcon = (props) => (
  <Icon {...props} name="message-circle-outline" />
);
const CurrencyIcon = (props) => (
  <Icon {...props} name="checkmark-circle-2-outline" />
);
const QualificationIcon = (props) => (
  <Icon {...props} name="file-text-outline" />
);
//ADD OPS CONDITION
const BottomTabBar = ({ navigation, state }) => (
  <View style={styles.bottomTabContainer}>
    <BottomNavigation
      selectedIndex={state.index}
      onSelect={(index) => navigation.navigate(state.routeNames[index])}
    >
      <BottomNavigationTab icon={HomeIcon} />
      <BottomNavigationTab icon={CurrencyIcon} />
      <BottomNavigationTab icon={MessageIcon} />
      <BottomNavigationTab icon={QualificationIcon} />
    </BottomNavigation>
  </View>
);

function HomeScreen() {
  const [date, setDate] = useState(dayjs());
  useEffect(() => {
    const timer = setInterval(() => {
      setDate(dayjs());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Layout style={styles.container}>
      <StatusBar style="dark-content" />
      <ImageBackground
        style={styles.imageBackground}
        source={require("../assets/background.png")}
      >
        <View style={styles.timeContainer}>
          <Text style={styles.time}>{date.format("hh:mm:ss")}</Text>
        </View>
        <Layout style={styles.overlay}>
          <View style={styles.calendarContainer}>
            <CalendarSimpleUsageShowcase />
          </View>
        </Layout>
      </ImageBackground>
    </Layout>
  );
}

function HomeScreenTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Currency" component={CurrencyScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Qualification" component={QualiScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0)",
    justifyContent: "center",
    alignItems: "center",
  },
  calendarContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  time: {
    fontSize: 82,
    fontWeight: "bold",
    color: "#C3FFFE",
  },
  timeContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  bottomTabContainer: {
    height: 70, // Adjust this value to change the height of the bottom navigator
  },
});

export default HomeScreenTabs;
