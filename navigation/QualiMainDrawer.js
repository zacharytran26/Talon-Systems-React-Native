import React from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";

import { useTheme, Avatar } from "@ui-kitten/components";
import { useAuth } from "../screens/ThemeContext";

import StudentsScreen from "../screens/StudentScreen";
import InstructorsScreen from "../screens/InstructorScreen";
import HomeScreen from "../screens/HomeScreen";
import LogoutScreen from "../screens/Logout";
import SettingsScreen from "../screens/SettingScreen";
import PendingAuths from "../screens/PendingAuths";
import FIFScreen from "../screens/FIFScreen";
import LogScreen from "../screens/LogScreen";
import QualiScreen from "../screens/QualificationScreen";

const Drawer = createDrawerNavigator();

export function CustomDrawerContentQuali(props) {
  const theme = useTheme();
  const { authUser } = useAuth();
  const uric = `https://apps5.talonsystems.com/tseta/php/upload/view.php?imgRes=10&viewPers=${authUser.currpersid}&rorwwelrw=rw&curuserid=${authUser.currpersid}&id=${authUser.sysdocid}&svr=TS5P&s=${authUser.sessionid}&c=eta0000`;

  return (
    <DrawerContentScrollView
      {...props}
      style={{ backgroundColor: theme["color-basic-300"] }}
    >
      <SafeAreaView>
        <TouchableOpacity
          appearance="ghost"
          style={styles.profileSection}
          onPress={() => console.log("add upload image here ")}
        >
          <Avatar source={{ uri: uric }} style={styles.profileAvatar} />
        </TouchableOpacity>
        <DrawerItem
          label="FIF"
          onPress={() => props.navigation.navigate("QualiFIF")}
        />
        <DrawerItem
          label="Instructors"
          onPress={() => props.navigation.navigate("QualiInstructorScreen")}
        />
        <DrawerItem
          label="Logbook"
          onPress={() => props.navigation.navigate("QualiLog")}
        />
        <DrawerItem
          label="Pending Authorizations"
          onPress={() => props.navigation.navigate("QualiPendingAuth")}
        />
        <DrawerItem
          label="Students"
          onPress={() => props.navigation.navigate("QualiStudentScreen")}
        />
        <DrawerItem
          label="Settings"
          onPress={() => props.navigation.navigate("QualiSettings")}
        />
        <DrawerItem
          label="Logout"
          onPress={() => props.navigation.navigate("QualiLogout")}
        />
      </SafeAreaView>
    </DrawerContentScrollView>
  );
}

function MainDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContentQuali {...props} />}
      screenOptions={({ navigation }) => ({
        headerTitle: () => <LogoTitle navigation={navigation} />,
        headerStyle: { height: 150 },
        headerBackTitleVisible: false,
      })}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="InstructorScreen" component={InstructorsScreen} />
      <Drawer.Screen name="StudentScreen" component={StudentsScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Quali" component={QualiScreen} />
      <Drawer.Screen name="PendingAuth" component={PendingAuths} />
      <Drawer.Screen name="FIF" component={FIFScreen} />
      <Drawer.Screen name="Log" component={LogScreen} />
      <Drawer.Screen name="Logout" component={LogoutScreen} />
    </Drawer.Navigator>
  );
}

function LogoTitle({ navigation }) {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.reset({
          index: 0,
          routes: [{ name: "Drawer" }],
        })
      }
    >
      <Image
        style={{ width: 150, height: 50 }}
        source={require("../assets/logo.png")}
      />
    </TouchableOpacity>
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
  profileAvatar: {
    width: 75,
    height: 75,
  },
  profileSection: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MainDrawer;
