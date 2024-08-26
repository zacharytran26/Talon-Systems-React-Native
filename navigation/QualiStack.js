import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import QualificationScreen from "../screens/QualificationScreen"; // Assuming you have a MessagesScreen
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

export default function MessagesStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen name="Quali" component={QualificationScreen} />
      <Stack.Screen
        name="QualiInstructorScreen"
        component={InstructorsScreen}
      />
      <Stack.Screen name="QualiStudentScreen" component={StudentsScreen} />
      <Stack.Screen
        name="QualiInstructorDetailScreen"
        component={InstructorList}
      />
      <Stack.Screen name="QualiStudentDetailScreen" component={StudentList} />
      <Stack.Screen name="QualiLogout" component={LogoutScreen} />
      <Stack.Screen name="QualiStudentCourse" component={StudentCourse} />
      <Stack.Screen name="QualiStudentMap" component={StudentMap} />
      <Stack.Screen
        name="QualiStudentMapDetails"
        component={StudentMapDetails}
      />
      <Stack.Screen name="QualiLineItem" component={LineItem} />
      <Stack.Screen name="QualiAuth" component={Approve} />
      <Stack.Screen name="QualiTimes" component={Times} />
      <Stack.Screen name="QualiImage" component={DisplayImage} />
      <Stack.Screen name="QualiActivity" component={Activity} />
      <Stack.Screen name="QualiActivityApproval" component={ApproveActivity} />
      <Stack.Screen name="QualiConfirm" component={ConfirmFIF} />
      <Stack.Screen
        name="QualiInstructorActivity"
        component={InstructorActivity}
      />
      <Stack.Screen name="QualiLog" component={LogScreen} />
      <Stack.Screen name="QualiSettings" component={SettingsScreen} />
      <Stack.Screen name="QualiPendingAuth" component={PendingAuths} />
      <Stack.Screen name="QualiFIF" component={FIFScreen} />
    </Stack.Navigator>
  );
}
