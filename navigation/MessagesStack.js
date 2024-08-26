import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MessagesScreen from "../screens/MessageListScreen"; // Assuming you have a MessagesScreen
import InstructorsScreen from "../screens/InstructorScreen";
import EmailList from "../screens/EmailDetailsScreen";
import { ReplyScreen } from "../screens/ReplyScreen";
import StudentsScreen from "../screens/StudentScreen";
import InstructorList from "../screens/InstructorDetailScreen";
import StudentList from "../screens/StudentDetailScreen";
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
import SettingsScreen from "../screens/SettingScreen";
import PendingAuths from "../screens/PendingAuths";
import FIFScreen from "../screens/FIFScreen";
import LogScreen from "../screens/LogScreen";
const Stack = createNativeStackNavigator();

export default function MessagesStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen name="Messages" component={MessagesScreen} />
      <Stack.Screen name="MessageReplyScreen" component={ReplyScreen} />
      <Stack.Screen name="MessageEmails" component={EmailList} />
      <Stack.Screen name="MessageNewMessage" component={NewMessage} />
      <Stack.Screen
        name="MessageInstructorScreen"
        component={InstructorsScreen}
      />
      <Stack.Screen name="MessageStudentScreen" component={StudentsScreen} />
      <Stack.Screen
        name="MessageInstructorDetailScreen"
        component={InstructorList}
      />
      <Stack.Screen name="MessageStudentDetailScreen" component={StudentList} />
      <Stack.Screen name="MessageLogout" component={LogoutScreen} />
      <Stack.Screen name="MessageStudentCourse" component={StudentCourse} />
      <Stack.Screen name="MessageStudentMap" component={StudentMap} />
      <Stack.Screen
        name="MessageStudentMapDetails"
        component={StudentMapDetails}
      />
      <Stack.Screen name="MessageLineItem" component={LineItem} />
      <Stack.Screen name="MessageAuth" component={Approve} />
      <Stack.Screen name="MessageTimes" component={Times} />
      <Stack.Screen name="MessageImage" component={DisplayImage} />
      <Stack.Screen name="MessageActivity" component={Activity} />
      <Stack.Screen
        name="MessageActivityApproval"
        component={ApproveActivity}
      />
      <Stack.Screen name="MessageConfirm" component={ConfirmFIF} />
      <Stack.Screen
        name="MessageInstructorActivity"
        component={InstructorActivity}
      />
      <Stack.Screen name="MessageLog" component={LogScreen} />
      <Stack.Screen name="MessageSettings" component={SettingsScreen} />
      <Stack.Screen name="MessagePendingAuth" component={PendingAuths} />
      <Stack.Screen name="MessageFIF" component={FIFScreen} />
    </Stack.Navigator>
  );
}
