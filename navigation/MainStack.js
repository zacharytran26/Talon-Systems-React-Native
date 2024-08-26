import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

// Import your screens
import EmailList from "../screens/EmailDetailsScreen";
import MessagesScreen from "../screens/MessageListScreen";
import { ReplyScreen } from "../screens/ReplyScreen";
import CurrencyScreen from "../screens/Currencies";
import StudentsScreen from "../screens/StudentScreen";
import InstructorsScreen from "../screens/InstructorScreen";
import InstructorList from "../screens/InstructorDetailScreen";
import StudentList from "../screens/StudentDetailScreen";
import HomeScreen from "../screens/HomeScreen";
import LogoutScreen from "../screens/Logout";
import NewMessage from "../screens/NewMessageScreen";
import StudentCourse from "../screens/StudentCourseScreen";
import StudentMap from "../screens/StudentMap";
import StudentMapDetails from "../screens/StudentMapsDetail";
import LineItem from "../screens/LineItems";
import Approve from "../screens/ApprovalScreen";
import Times from "../screens/TimesScreen";
import DisplayImage from "../screens/ImageScreen";
import Activity from "../screens/ActivityScreen";
import InstructorActivity from "../screens/InstructorActivity";
import ApproveActivity from "../screens/ActivityApproval";
import ConfirmFIF from "../screens/ConfirmationFIF";
import MainDrawer from "./MainDrawer";

const Stack = createNativeStackNavigator();

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

export default function StackScreens() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerTitle: () => <LogoTitle navigation={navigation} />,
        headerStyle: { height: 100 },
        headerBackTitleVisible: false,
      })}
    >
      <Stack.Screen
        name="Drawer"
        component={MainDrawer}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="sHome" component={HomeScreen} />
      <Stack.Screen name="Message" component={MessagesScreen} />
      <Stack.Screen name="InstructorScreen" component={InstructorsScreen} />
      <Stack.Screen name="CurrencyScreen" component={CurrencyScreen} />
      <Stack.Screen name="StudentScreen" component={StudentsScreen} />
      <Stack.Screen name="InstructorDetailScreen" component={InstructorList} />
      <Stack.Screen name="ReplyScreen" component={ReplyScreen} />
      <Stack.Screen name="StudentDetailScreen" component={StudentList} />
      <Stack.Screen name="Emails" component={EmailList} />
      <Stack.Screen name="Logout" component={LogoutScreen} />
      <Stack.Screen name="NewMessage" component={NewMessage} />
      <Stack.Screen name="StudentCourse" component={StudentCourse} />
      <Stack.Screen name="StudentMap" component={StudentMap} />
      <Stack.Screen name="StudentMapDetails" component={StudentMapDetails} />
      <Stack.Screen name="LineItem" component={LineItem} />
      <Stack.Screen name="Auth" component={Approve} />
      <Stack.Screen name="Times" component={Times} />
      <Stack.Screen name="Image" component={DisplayImage} />
      <Stack.Screen name="Activity" component={Activity} />
      <Stack.Screen name="ActivityApproval" component={ApproveActivity} />
      <Stack.Screen name="Confirm" component={ConfirmFIF} />
      <Stack.Screen name="InstructorActivity" component={InstructorActivity} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  // Add any styles you need for the stack screen components
});
