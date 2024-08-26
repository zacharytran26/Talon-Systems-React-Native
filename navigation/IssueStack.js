import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MyIssues from "../screens/MyIssues";

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

export default function IssueStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen name="Issues" component={MyIssues} />
      <Stack.Screen
        name="IssueInstructorScreen"
        component={InstructorsScreen}
      />
      <Stack.Screen name="IssueStudentScreen" component={StudentsScreen} />
      <Stack.Screen
        name="IssueInstructorDetailScreen"
        component={InstructorList}
      />
      <Stack.Screen name="IssueStudentDetailScreen" component={StudentList} />
      <Stack.Screen name="IssueLogout" component={LogoutScreen} />
      <Stack.Screen name="IssueStudentCourse" component={StudentCourse} />
      <Stack.Screen name="IssueStudentMap" component={StudentMap} />
      <Stack.Screen
        name="IssueStudentMapDetails"
        component={StudentMapDetails}
      />
      <Stack.Screen name="IssueLineItem" component={LineItem} />
      <Stack.Screen name="IssueAuth" component={Approve} />
      <Stack.Screen name="IssueTimes" component={Times} />
      <Stack.Screen name="IssueImage" component={DisplayImage} />
      <Stack.Screen name="IssueActivity" component={Activity} />
      <Stack.Screen
        name="IssueInstructorActivity"
        component={InstructorActivity}
      />
      <Stack.Screen name="IssueActivityApproval" component={ApproveActivity} />
      <Stack.Screen name="IssueConfirm" component={ConfirmFIF} />
      <Stack.Screen name="IssueLog" component={LogScreen} />
      <Stack.Screen name="IssueSettings" component={SettingsScreen} />
      <Stack.Screen name="IssuePendingAuth" component={PendingAuths} />
      <Stack.Screen name="IssueFIF" component={FIFScreen} />
    </Stack.Navigator>
  );
}
