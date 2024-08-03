import React from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import {
  ApplicationProvider,
  IconRegistry,
  useTheme,
} from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { Image } from "expo-image";

// Import your screens
import EmailList from "../screens/EmailDetailsScreen";
import MessagesScreen from "../screens/MessageListScreen";
import { useAuth } from "../screens/ThemeContext";
import { ReplyScreen } from "../screens/ReplyScreen";
import CurrencyScreen from "../screens/Currencies";
import StudentsScreen from "../screens/StudentScreen";
import InstructorsScreen from "../screens/InstructorScreen";
import InstructorList from "../screens/InstructorDetailScreen";
import StudentList from "../screens/StudentDetailScreen";
import HomeScreen from "../screens/HomeScreen";
import LogoutScreen from "../screens/Logout";
import NewMessage from "../screens/NewMessageScreen";
import SettingsScreen from "../screens/SettingScreen";
import StudentCourse from "../screens/StudentCourseScreen";
import StudentMap from "../screens/StudentMap";
import StudentMapDetails from "../screens/StudentMapsDetail";
import LineItem from "../screens/LineItems";
import PendingAuths from "../screens/PendingAuths";
import Approve from "../screens/ApprovalScreen";
import Times from "../screens/TimesScreen";
import FIFScreen from "../screens/FIFScreen";
import QualiScreen from "../screens/QualificationScreen";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function CustomDrawerContent(props) {
  const theme = useTheme();
  const profileImage = require("../assets/person-icon.png");
  return (
    <DrawerContentScrollView
      {...props}
      style={{ backgroundColor: theme["color-basic-500"] }}
    >
      <SafeAreaView>
        <Image source={profileImage} style={styles.profileImage} />
        <DrawerItem
          label="Instructors"
          onPress={() => props.navigation.navigate("InstructorScreen")}
        />
        <DrawerItem
          label="Student"
          onPress={() => props.navigation.navigate("StudentScreen")}
        />
        <DrawerItem
          label="Pending Auth"
          onPress={() => props.navigation.navigate("PendingAuth")}
        />
        <DrawerItem
          label="FIF"
          onPress={() => props.navigation.navigate("FIF")}
        />
        <DrawerItem
          label="Logout"
          onPress={() => props.navigation.navigate("Logout")}
        />
      </SafeAreaView>
    </DrawerContentScrollView>
  );
}

function MainDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerTitle: (props) => <LogoTitle {...props} />,
        headerStyle: { height: 120 },
        headerBackTitleVisible: false,
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="InstructorScreen" component={InstructorsScreen} />
      <Drawer.Screen name="StudentScreen" component={StudentsScreen} />
      <Drawer.Screen name="PendingAuth" component={PendingAuths} />
      <Drawer.Screen name="FIF" component={FIFScreen} />
      <Drawer.Screen name="Logout" component={LogoutScreen} />
    </Drawer.Navigator>
  );
}

function LogoTitle() {
  return (
    <Image
      style={{ width: 150, height: 60 }}
      source={require("../assets/logo.png")}
    />
  );
}

export default function AppContent() {
  const theme = useTheme();

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <StatusBar />
        <Stack.Navigator
          screenOptions={() => ({
            headerTitle: (props) => <LogoTitle {...props} />,
            headerStyle: { height: 120 },
            headerBackTitleVisible: false,
          })}
        >
          <Stack.Screen
            name="Drawer"
            component={MainDrawer}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "My home" }}
          />
          <Stack.Screen name="Message" component={MessagesScreen} />
          <Stack.Screen name="InstructorScreen" component={InstructorsScreen} />
          <Stack.Screen name="CurrencyScreen" component={CurrencyScreen} />
          <Stack.Screen name="StudentScreen" component={StudentsScreen} />
          <Stack.Screen
            name="InstructorDetailScreen"
            component={InstructorList}
          />
          <Stack.Screen name="ReplyScreen" component={ReplyScreen} />
          <Stack.Screen name="StudentDetailScreen" component={StudentList} />
          <Stack.Screen name="Emails" component={EmailList} />
          <Stack.Screen name="Logout" component={LogoutScreen} />
          <Stack.Screen name="NewMessage" component={NewMessage} />
          <Stack.Screen name="StudentCourse" component={StudentCourse} />
          <Stack.Screen name="StudentMap" component={StudentMap} />
          <Stack.Screen
            name="StudentMapDetails"
            component={StudentMapDetails}
          />
          <Stack.Screen name="LineItem" component={LineItem} />
          <Stack.Screen name="Auth" component={Approve} />
          <Stack.Screen name="Times" component={Times} />
        </Stack.Navigator>
      </ApplicationProvider>
    </>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  imagecontainer: {
    flex: 1,
    justifyContent: "center",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  backgroundContainer: {
    flex: 1,
  },
  headerImage: {
    width: "80%",
    height: "100%",
    resizeMode: "contain",
  },
  headerContainer: {
    width: "100%",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
});
