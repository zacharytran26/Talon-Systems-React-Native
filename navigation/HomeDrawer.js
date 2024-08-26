import React from "react";
import { TouchableOpacity, Image } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeStackNavigator from "./HomeStack";
import { CustomDrawerContent } from "./MainDrawer";
const Drawer = createDrawerNavigator();

export default function HomeDrawerNavigator({ navigation }) {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        headerTitle: () => <LogoTitle navigation={navigation} />,
        headerStyle: { height: 150 },
        headerBackTitleVisible: false,
      })}
    >
      <Drawer.Screen name="HomeStack" component={HomeStackNavigator} />
    </Drawer.Navigator>
  );
}

function LogoTitle({ navigation }) {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.reset({
          index: 0,
          routes: [{ name: "HomeStack", params: { screen: "Home" } }],
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
