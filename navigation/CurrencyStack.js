// import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CurrencyScreen from "../screens/Currencies";
import InstructorsScreen from "../screens/InstructorScreen";
import StudentsScreen from "../screens/StudentScreen";
import InstructorList from "../screens/InstructorDetailScreen";
import StudentList from "../screens/StudentDetailScreen";
import LogoutScreen from "../screens/Logout";
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
import SettingsScreen from "../screens/SettingScreen";
import PendingAuths from "../screens/PendingAuths";
import FIFScreen from "../screens/FIFScreen";
import LogScreen from "../screens/LogScreen";

const Stack = createNativeStackNavigator();

export default function CurrencyStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen name="Currency" component={CurrencyScreen} />
      <Stack.Screen
        name="CInstructorScreen"
        component={InstructorsScreen}
        initialParams={{ context: "Currency" }} // Pass context-specific params
      />
      <Stack.Screen name="CStudentScreen" component={StudentsScreen} />
      <Stack.Screen name="CInstructorDetailScreen" component={InstructorList} />
      <Stack.Screen name="CStudentDetailScreen" component={StudentList} />
      <Stack.Screen name="CLogout" component={LogoutScreen} />
      <Stack.Screen name="CStudentCourse" component={StudentCourse} />
      <Stack.Screen name="CStudentMap" component={StudentMap} />
      <Stack.Screen name="CStudentMapDetails" component={StudentMapDetails} />
      <Stack.Screen name="CLineItem" component={LineItem} />
      <Stack.Screen name="CAuth" component={Approve} />
      <Stack.Screen name="CTimes" component={Times} />
      <Stack.Screen name="CImage" component={DisplayImage} />
      <Stack.Screen name="CActivity" component={Activity} />
      <Stack.Screen name="CActivityApproval" component={ApproveActivity} />
      <Stack.Screen name="CConfirm" component={ConfirmFIF} />
      <Stack.Screen name="CInstructorActivity" component={InstructorActivity} />
      <Stack.Screen name="CLog" component={LogScreen} />
      <Stack.Screen name="CSettings" component={SettingsScreen} />
      <Stack.Screen name="CPendingAuth" component={PendingAuths} />
      <Stack.Screen name="CFIF" component={FIFScreen} />
    </Stack.Navigator>
  );
}
