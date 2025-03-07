import React from "react";
import { TouchableOpacity, Image } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import IssueStackNavigator from "./IssueStack";
import { CustomDrawerContentIssue } from "./IssueMainDrawer";

const Drawer = createDrawerNavigator();

export default function IssueDrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContentIssue {...props} />}
      screenOptions={({ navigation }) => ({
        headerTitle: () => <LogoTitle navigation={navigation} />,
        headerStyle: { height: 150 },
        headerBackTitleVisible: false,
      })}
    >
      <Drawer.Screen name="IssueStack" component={IssueStackNavigator} />
    </Drawer.Navigator>
  );
}

function LogoTitle({ navigation }) {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.reset({
          index: 0,
          routes: [{ name: "IssueStack", params: { screen: "Issues" } }],
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
