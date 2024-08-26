import React from "react";
import { TouchableOpacity, Image } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CurrencyStackNavigator from "./CurrencyStack";
import { CustomDrawerContentCurrency } from "./CurrencyMainDrawer";

// Define your custom drawer content directly here or simplify MainDrawer
const Drawer = createDrawerNavigator();

export default function CurrencyDrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContentCurrency {...props} />}
      screenOptions={({ navigation }) => ({
        headerTitle: () => <LogoTitle navigation={navigation} />,
        headerStyle: { height: 150 },
        headerBackTitleVisible: false,
      })}
    >
      <Drawer.Screen name="CurrencyStack" component={CurrencyStackNavigator} />
    </Drawer.Navigator>
  );
}

function LogoTitle({ navigation }) {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.reset({
          index: 0,
          routes: [{ name: "CurrencyStack", params: { screen: "Currency" } }],
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
