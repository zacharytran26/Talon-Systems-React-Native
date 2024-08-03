// import * as React from "react";
// import { SafeAreaView, TouchableOpacity } from "react-native";
// import { createDrawerNavigator } from "@react-navigation/drawer";
// import LoginScreen from "../screens/LoginScreen";
// import LoginSSOScreen from "../screens/LoginSSO";
// //import {useAuth} from '../contexts/Auth';

// //const Drawer = createDrawerNavigator();
// const { Navigator, Screen } = createDrawerNavigator();

// export function AuthStack() {
//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <Navigator initialRouteName="Login">
//         <Screen name="Login" component={LoginScreen} options={{ title: "" }} />
//         <Screen
//           name="LoginSSO"
//           component={LoginSSOScreen}
//           options={{ title: "" }}
//         />
//       </Navigator>
//     </SafeAreaView>
//   );
// }

import * as React from "react";
import { SafeAreaView, TouchableOpacity, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import LoginSSOScreen from "../screens/LoginSSO";

const Stack = createStackNavigator();

export function AuthStack() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "" }}
        />
        <Stack.Screen
          name="LoginSSO"
          component={LoginSSOScreen}
          options={({ navigation }) => ({
            title: "",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={{ marginLeft: 20, color: "#0000ff" }}>Back</Text>
              </TouchableOpacity>
            ),
          })}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
}
