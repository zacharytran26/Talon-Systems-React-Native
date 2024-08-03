import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Text, Button, Menu, MenuGroup, MenuItem } from "@ui-kitten/components";
import { useAuth } from "./ThemeContext";
import { useRoute } from "@react-navigation/native";

const StudentMap = ({ navigation }) => {
  const route = useRoute();
  const { course } = route.params;
  const [stages, setStages] = useState([]);
  const { authUser } = useAuth();

  useEffect(() => {
    fetchMap();
  }, []);

  const fetchMap = async () => {
    try {
      const response = await fetch(
        `${authUser.host}` +
          `content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=getcoursemap&etamobilepro=1&nocache=n&persid=${authUser.currpersid}&persregid=${course.persregid}`
      );
      const data = await response.json();
      console.log(data);

      // const stagesInfo = data.stages.map((stage) => {
      //   return {
      //     stage: stage.stage,
      //     lessons: stage.lessons.map((lesson) => {
      //       return {
      //         lesson: lesson.lesson,
      //         units: lesson.units,
      //       };
      //     }),
      //   };
      // });

      // // Log the structured stages, lessons, and units info
      // console.log("Stages Info:", JSON.stringify(stagesInfo, null, 2));

      setStages(data.stages);
    } catch (error) {
      console.error("Error fetching map data:", error);
    }
  };

  const handlePress = (units, lesson) => {
    navigation.navigate("StudentMapDetails", { units, lesson });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Menu>
        {stages.map((stage, stageIndex) => (
          <MenuGroup key={stageIndex} title={stage.stage}>
            {stage.lessons.map((lesson) => (
              <MenuItem
                key={lesson.id}
                title={lesson.lesson}
                onPress={() => handlePress(lesson.units, lesson)}
              />
            ))}
          </MenuGroup>
        ))}
      </Menu>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    marginRight: 8,
    paddingHorizontal: 0,
    paddingVertical: 0,
    height: 24,
    fontSize: 12,
  },
});

export default StudentMap;

// import React, { useState, useEffect } from "react";
// import { SafeAreaView, StyleSheet, View } from "react-native";
// import { Text, Button, Menu, MenuGroup, MenuItem } from "@ui-kitten/components";
// import { useAuth } from "./ThemeContext";
// import { useRoute } from "@react-navigation/native";

// const StudentMap = ({ navigation }) => {
//   const route = useRoute();
//   const { course } = route.params;
//   const [stages, setStages] = useState([]);
//   // const [firstStage, setFirstStage] = useState([]);
//   // const [secondStage, setSecondStage] = useState([]);
//   // const [thirdStage, setThirdStage] = useState([]);
//   const { authUser } = useAuth();

//   useEffect(() => {
//     fetchMap();
//   }, []);

//   const fetchMap = async () => {
//     try {
//       const response = await fetch(
//         `${authUser.host}` +
//           `content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=getcoursemap&etamobilepro=1&nocache=n&persid=${authUser.currpersid}&persregid=${course.persregid}`
//       );
//       const data = await response.json();
//       console.log(data);

//       const stagesInfo = data.stages.map((stage) => {
//         return {
//           stage: stage.stage,
//           lessons: stage.lessons.map((lesson) => {
//             return {
//               lesson: lesson.lesson,
//               units: lesson.units,
//             };
//           }),
//         };
//       });
//       console.log("Stages Info:", JSON.stringify(stagesInfo, null, 2));

//       // If you want to set the stages to state
//       setStages(data.stages);
//     } catch (error) {
//       console.error("Error fetching map data:", error);
//     }
//   };

//   // Example call to the fetchMap function
//   fetchMap();

//   const handlePress = (units, details) => {
//     navigation.navigate("StudentMapDetails", { units, details });
//   };

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <Menu>
//         {stages.map((stage, stageIndex) => (
//           <MenuGroup key={stageIndex} title={stage.stage}>
//             {stage.lessons.map((lesson) => (
//               <MenuItem
//                 key={lesson.id}
//                 title={lesson.lesson}
//                 onPress={() => handlePress(lesson.unit, lesson)}
//               />
//             ))}
//           </MenuGroup>
//         ))}
//       </Menu>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   backButton: {
//     marginRight: 8,
//     paddingHorizontal: 0,
//     paddingVertical: 0,
//     height: 24,
//     fontSize: 12,
//   },
// });

// export default StudentMap;

// const StudentMap = ({ navigation }) => {
//   const route = useRoute();
//   const { course } = route.params;
//   const [stages, setStages] = useState([]);
//   const [firstStage, setFirstStage] = useState([]);
//   const [secondStage, setSecondStage] = useState([]);
//   const [thirdStage, setThirdStage] = useState([]);
//   const { authUser } = useAuth();

//   useEffect(() => {
//     fetchMap();
//   }, []);

//   const fetchMap = async () => {
//     try {
//       const response = await fetch(
//         `${authUser.host}` +
//           `content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=getcoursemap&etamobilepro=1&nocache=n&persid=${authUser.currpersid}&persregid=${course.persregid}`
//       );
//       const data = await response.json();
//       console.log(data);
//       setStages(data.stages);
//     } catch (error) {
//       console.error("Error fetching map data:", error);
//     }
//   };

//   const handlePress = (stage, details) => {
//     navigation.navigate("StudentMapDetails", { stage, details });
//   };

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <Drawer>
//         {stages.map((stage, stageIndex) => (
//           <DrawerGroup key={stageIndex} title={stage.STAGE}>
//             {stage.LESSONS.map((lesson, lessonIndex) => (
//               <DrawerItem
//                 key={lessonIndex}
//                 title={lesson.lesson}
//                 onPress={() => handlePress(stage.STAGE, lesson)}
//               />
//             ))}
//           </DrawerGroup>
//         ))}
//       </Drawer>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   backButton: {
//     marginRight: 8,
//     paddingHorizontal: 0,
//     paddingVertical: 0,
//     height: 24,
//     fontSize: 12,
//   },
// });

// export default StudentMap;

//   firstStage: [
//     {
//       lesson: "lesson 1",
//       item: [
//         {
//           title: "Pvt U1 Oral #1 - 2.0",
//           description: "Oral #1: Intro to Four...",
//         },
//       ],
//       lineitems: [
//         { title: "introduce CPT" },
//         { title: "PVT Pilot Man" },
//         { title: "St/ Lvl Flight" },
//         { title: "Level Turns" },
//         { title: "Taxiing" },
//         { title: "Weight and Balance" },
//       ],
//     },
//     // Other lessons in firstStage...
//   ],
//   secondStage: [
//     {
//       lesson: "lesson 5",
//       item: [
//         {
//           title: "Pvt U1 Oral #5 - 2.0",
//           description: "Oral #5: Intro to Four...5",
//         },
//       ],
//       lineitems: [
//         { title: "introduce CPT" },
//         { title: "PVT Pilot Man" },
//         { title: "St/ Lvl Flight" },
//         { title: "Level Turns" },
//         { title: "Taxiing" },
//         { title: "Weight and Balance" },
//       ],
//     },
//     // Other lessons in secondStage...
//   ],
//   thirdStage: [
//     {
//       lesson: "lesson 9",
//       item: [
//         {
//           title: "Pvt U1 Oral #9 - 2.0",
//           description: "Oral #9: Intro to Four...9",
//         },
//       ],
//       lineitems: [
//         { title: "introduce CPT" },
//         { title: "PVT Pilot Man" },
//         { title: "St/ Lvl Flight" },
//         { title: "Level Turns" },
//         { title: "Taxiing" },
//         { title: "Weight and Balance" },
//       ],
//     },
//     // Other lessons in thirdStage...
//   ],
// });
// setFirstStage(response.firstStage);
// setSecondStage(response.secondStage);
// setThirdStage(response.thirdStage);
//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <Drawer>
//         <DrawerGroup title="Stage 1">
//           {firstStage.map((lesson, index) => (
//             <DrawerItem
//               key={index}
//               title={lesson.lesson}
//               onPress={() => handlePress("firstStage", lesson)}
//             />
//           ))}
//         </DrawerGroup>
//         <DrawerGroup title="Stage 2">
//           {secondStage.map((lesson, index) => (
//             <DrawerItem
//               key={index}
//               title={lesson.lesson}
//               onPress={() => handlePress("secondStage", lesson)}
//             />
//           ))}
//         </DrawerGroup>
//         <DrawerGroup title="Stage 3">
//           {thirdStage.map((lesson, index) => (
//             <DrawerItem
//               key={index}
//               title={lesson.lesson}
//               onPress={() => handlePress("thirdStage", lesson)}
//             />
//           ))}
//         </DrawerGroup>
//       </Drawer>
//     </SafeAreaView>
//   );
// };

// const response = await Promise.resolve({
//   stages: [
//     {
//       stage: "stage 1",
//       lessons: [
//         { id: 1, lesson: "lesson 1" },
//         { id: 2, lesson: "lesson 2" },
//       ],
//     },
//     {
//       stage: "stage 2",
//       lessons: [
//         { id: 5, lesson: "lesson 5" },
//         { id: 6, lesson: "lesson 6" },
//       ],
//     },
//   ],
// });

// const response = {"stages": [{"id":1, "stage":"stage 1","lessons": [ { "id": 1, "lesson": "lesson 1" }, { "id": 2, "lesson": "lesson 2" } ] },{"id":2, "stage":"stage 2","lessons": [ { "id": 5, "lesson": "lesson 5" }, { "id": 6, "lesson": "lesson 6" } ] }]};
