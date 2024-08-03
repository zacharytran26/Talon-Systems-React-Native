import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import { Layout, Text, Spinner, Toggle } from "@ui-kitten/components";
import { useAuth } from "./ThemeContext";
import { AlphabetList } from "react-native-section-alphabet-list";
import { SelectList } from "react-native-dropdown-select-list";

const StudentsScreen = ({ navigation }) => {
  const [filter, setFilter] = useState("");
  const [students, setStudents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [filterByTeam, setFilterByTeam] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const { authUser } = useAuth();

  useEffect(() => {
    fetchStudents();
  }, [showActiveOnly]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const statusParam = showActiveOnly ? "" : "&status=completed";
      const response = await fetch(
        `${authUser.host}content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=getstudents&etamobilepro=1&nocache=n&persid=${authUser.currpersid}${statusParam}`
      );
      const text = await response.text();
      const data = JSON.parse(text);
      console.log(data);
      const studentData = data.studentdata.reduce(
        (acc, item) => {
          if (item.students) {
            acc.students = acc.students.concat(
              item.students.map((student) => ({
                key: student.id,
                value: student.disname,
                teamId: item.team_id, // Ensure to extract and store the team ID
                ...student,
              }))
            );
          }
          if (item.teams) {
            acc.teams = acc.teams.concat(
              item.teams.map((team) => ({
                key: team.id,
                value: team.disname,
              }))
            );
          }
          return acc;
        },
        { students: [], teams: [] }
      );

      setStudents(studentData.students);
      setTeams(studentData.teams);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchTeam = async (teamId) => {
    try {
      const response = await fetch(
        `${authUser.host}content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=getstudents&etamobilepro=1&nocache=n&persid=${authUser.currpersid}&teamid=${teamId}`
      );
      const data = await response.json();
      console.log("Fetched team data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching team data:", error);
      return null;
    }
  };

  const handleToggle = async () => {
    setShowActiveOnly(!showActiveOnly);
  };

  const handlePress = (student) => {
    navigation.navigate("StudentDetailScreen", { student });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStudents();
  };

  const handleTeamSelect = async (teamId) => {
    setFilterByTeam(teamId);
    if (teamId) {
      const teamData = await fetchTeam(teamId);
      if (teamData) {
        const teamStudents = teamData.studentdata.reduce((acc, item) => {
          if (item.students) {
            acc = acc.concat(
              item.students.map((student) => ({
                key: student.id,
                value: student.disname,
                teamId: item.team_id,
                ...student,
              }))
            );
          }
          return acc;
        }, []);
        setStudents(teamStudents);
      }
    } else {
      await fetchStudents(); // Fetch all students if no team is selected
    }
  };

  const filteredStudents = students
    .filter((student) =>
      student.disname.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => a.disname.localeCompare(b.disname))
    .map((student) => ({
      key: student.id,
      value: student.disname,
      course: student.course,
      ...student,
    }));

  if (loading && !refreshing) {
    return (
      <Layout style={styles.container}>
        <Spinner />
      </Layout>
    );
  }

  return (
    <Layout style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search"
            value={filter}
            onChangeText={setFilter}
          />
          <Toggle
            checked={showActiveOnly}
            onChange={handleToggle}
            style={styles.toggle}
          >
            {showActiveOnly ? "Active" : "Completed"}
          </Toggle>
          <SelectList
            data={[{ key: "", value: "All Teams" }, ...teams]}
            setSelected={handleTeamSelect}
            placeholder={filterByTeam || "Select a team"}
            boxStyles={styles.selectListBox}
            value={filterByTeam}
          />
        </View>
        <View style={styles.listContainer}>
          <AlphabetList
            data={filteredStudents}
            indexLetterStyle={styles.indexLetterStyle}
            renderCustomItem={(item) => (
              <TouchableOpacity onPress={() => handlePress(item)}>
                <View style={styles.listItemContainer}>
                  <Text style={styles.listItemLabel}>{item.value}</Text>
                  <Text style={styles.courseLabel}>Course: {item.course}</Text>
                </View>
              </TouchableOpacity>
            )}
            renderCustomSectionHeader={(section) => (
              <View style={styles.sectionHeaderContainer}>
                <Text style={styles.sectionHeaderLabel}>{section.title}</Text>
              </View>
            )}
            onRefresh={handleRefresh}
            refreshing={refreshing}
            style={styles.alphabetList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    padding: 16,
    backgroundColor: "white",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 8,
    marginBottom: 8,
    backgroundColor: "white",
  },
  toggle: {
    marginBottom: 8,
  },
  selectListBox: {
    marginBottom: 8,
  },
  listContainer: {
    flex: 1,
    marginTop: 10,
  },
  listItemContainer: {
    padding: 16,
  },
  listItemLabel: {
    fontSize: 16,
  },
  sectionHeaderContainer: {
    backgroundColor: "#f0f0f0",
    padding: 8,
  },
  sectionHeaderLabel: {
    fontWeight: "bold",
    fontSize: 18,
  },
  indexLetterStyle: {
    color: "blue",
    fontSize: 10,
    position: "absolute",
  },
  courseLabel: {
    fontSize: 14,
    color: "#888",
  },
});

export default StudentsScreen;

// import React, { useState, useEffect } from "react";
// import {
//   StyleSheet,
//   TextInput,
//   SafeAreaView,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { Layout, Text, Icon, Spinner, Toggle } from "@ui-kitten/components";
// import { useAuth } from "./ThemeContext";
// import { AlphabetList } from "react-native-section-alphabet-list";
// import { SelectList } from "react-native-dropdown-select-list";

// const StudentsScreen = ({ navigation }) => {
//   const [filter, setFilter] = useState("");
//   const [students, setStudents] = useState([]);
//   const [teams, setTeams] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showActiveOnly, setShowActiveOnly] = useState(true);
//   const [filterByTeam, setFilterByTeam] = useState("");
//   const [showCompleted, setshowCompleted] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const { authUser } = useAuth();

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   const fetchStudents = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         `${authUser.host}content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=getstudents&etamobilepro=1&nocache=n&persid=${authUser.currpersid}`
//       );
//       const text = await response.text();
//       const data = JSON.parse(text);
//       console.log(data);
//       const studentData = data.studentdata.reduce(
//         (acc, item) => {
//           if (item.students) {
//             acc.students = item.students.map((student) => ({
//               key: student.id,
//               value: student.disname,
//               ...student,
//             }));
//           }
//           if (item.teams) {
//             acc.teams = item.teams.map((team) => ({
//               key: team.id,
//               value: team.disname,
//             }));
//           }
//           return acc;
//         },
//         { students: [], teams: [] }
//       );

//       setStudents(studentData.students);
//       setTeams(studentData.teams);
//     } catch (error) {
//       console.error("Error fetching students:", error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const fetchCompletedStudents = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         `${authUser.host}content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=getstudents&etamobilepro=1&nocache=n&persid=${authUser.currpersid}&status=complete`
//       );
//       const text = await response.text();
//       const data = JSON.parse(text);
//       console.log(data);
//       const studentData = data.studentdata.reduce(
//         (acc, item) => {
//           if (item.students) {
//             acc.students = item.students.map((student) => ({
//               key: student.id,
//               value: student.disname,
//               ...student,
//             }));
//           }
//           if (item.teams) {
//             acc.teams = item.teams.map((team) => ({
//               key: team.id,
//               value: team.disname,
//             }));
//           }
//           return acc;
//         },
//         { students: [], teams: [] }
//       );

//       setStudents(studentData.students);
//       setTeams(studentData.teams);
//     } catch (error) {
//       console.error("Error fetching students:", error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }

//   };

//   const handleCompleteStudent = async () => {
//     if (!showCompleted) {
//       await fetchCompletedStudents();
//     }
//     setshowCompleted(!showCompleted);

//   };

//   const handlePress = (student) => {
//     navigation.navigate("StudentDetailScreen", { student });
//   };

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchStudents();
//   };

//   const filteredStudents = students
//     .filter(
//       (student) =>
//         student.disname.toLowerCase().includes(filter.toLowerCase()) &&
//         (!filterByTeam ||
//           student.team.toLowerCase() === filterByTeam.toLowerCase()) &&
//         (!showActiveOnly || student.active === "1")
//     )
//     .sort((a, b) => a.disname.localeCompare(b.disname))
//     .map((student) => ({
//       key: student.id,
//       value: student.disname,
//       course: student.course,
//       ...student,
//     }));

//   if (loading && !refreshing) {
//     return (
//       <Layout style={styles.container}>
//         <Spinner />
//       </Layout>
//     );
//   }

//   return (
//     <Layout style={styles.container}>
//       <SafeAreaView style={styles.safeArea}>
//         <View style={styles.headerContainer}>
//           <TextInput
//             style={styles.input}
//             placeholder="Search"
//             value={filter}
//             onChangeText={setFilter}
//           />
//           <Toggle
//             checked={showActiveOnly}
//             onChange={() => setShowActiveOnly(!showActiveOnly)}
//             style={styles.toggle}
//           >
//             Active
//           </Toggle>
//           <SelectList
//             data={[{ key: "", value: "All Teams" }, ...teams]}
//             setSelected={setFilterByTeam}
//             placeholder={filterByTeam || "Select a team"}
//             boxStyles={styles.selectListBox}
//             value={filterByTeam}
//           />
//         </View>
//         <View style={styles.listContainer}>
//           <AlphabetList
//             data={filteredStudents}
//             indexLetterStyle={styles.indexLetterStyle}
//             renderCustomItem={(item) => (
//               <TouchableOpacity onPress={() => handlePress(item)}>
//                 <View style={styles.listItemContainer}>
//                   <Text style={styles.listItemLabel}>{item.value}</Text>
//                   <Text style={styles.courseLabel}>Course: {item.course}</Text>
//                 </View>
//               </TouchableOpacity>
//             )}
//             renderCustomSectionHeader={(section) => (
//               <View style={styles.sectionHeaderContainer}>
//                 <Text style={styles.sectionHeaderLabel}>{section.title}</Text>
//               </View>
//             )}
//             onRefresh={handleRefresh}
//             refreshing={refreshing}
//             style={styles.alphabetList}
//             showsVerticalScrollIndicator={false}
//           />
//         </View>
//       </SafeAreaView>
//     </Layout>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   safeArea: {
//     flex: 1,
//   },
//   headerContainer: {
//     padding: 16,
//     backgroundColor: "white",
//   },
//   input: {
//     height: 40,
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingLeft: 8,
//     marginBottom: 8,
//     backgroundColor: "white",
//   },
//   toggle: {
//     marginBottom: 8,
//   },
//   selectListBox: {
//     marginBottom: 8,
//   },
//   listContainer: {
//     flex: 1,
//     marginTop: 10,
//   },
//   listItemContainer: {
//     padding: 16,
//   },
//   listItemLabel: {
//     fontSize: 16,
//   },
//   sectionHeaderContainer: {
//     backgroundColor: "#f0f0f0",
//     padding: 8,
//   },
//   sectionHeaderLabel: {
//     fontWeight: "bold",
//     fontSize: 18,
//   },
//   indexLetterStyle: {
//     color: "blue",
//     fontSize: 10,
//     position: "absolute",
//   },
//   courseLabel: {
//     fontSize: 14,
//     color: "#888",
//   },
// });

// export default StudentsScreen;

// import React, { useState, useEffect } from "react";
// import {
//   StyleSheet,
//   TextInput,
//   SafeAreaView,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { Layout, Text, Icon, Spinner, Toggle } from "@ui-kitten/components";
// import { useAuth } from "./ThemeContext";
// import { AlphabetList } from "react-native-section-alphabet-list";
// import { SelectList } from "react-native-dropdown-select-list";

// const StudentsScreen = ({ navigation }) => {
//   const [filter, setFilter] = useState("");
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [teams,setTeams] = useState([]);
//   const [showActiveOnly, setShowActiveOnly] = useState(true);
//   const [filterByTeam, setFilterByTeam] = useState("");
//   const [refreshing, setRefreshing] = useState(false);
//   const { authUser } = useAuth();

//   //req: students will refer to alphabet list
//   // teams: affect the dropdown menu
//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   const fetchStudents = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         `${authUser.host}content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=getstudents&etamobilepro=1&nocache=n&persid=${authUser.currpersid}`
//       );
//       const text = await response.text();
//       const data = JSON.parse(text);
//       console.log(data);
//       // const studentInfo = data.studentdata.map((item) => {
//       //   if (item.students) {
//       //     return {
//       //       students: item.students,
//       //       teams: [],
//       //     };
//       //   } else if (item.teams) {
//       //     return {
//       //       students: [],
//       //       teams: item.teams.map((team) => {
//       //         return {
//       //           id: team.id,
//       //           name: team.dis,
//       //         };
//       //       }),
//       //     };
//       //   }
//       // });

//       // // Log the structured student info
//       // console.log("Student Info:", JSON.stringify(studentInfo, null, 2));
//       setStudents(data.students);
//       setTeams(data.teams);

//     } catch (error) {
//       console.error("Error fetching students:", error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const handlePress = (student) => {
//     navigation.navigate("StudentDetailScreen");
//   };

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchStudents();
//   };

//   const filteredStudents = students
//     .filter(
//       (student) =>
//         student.disname.toLowerCase().includes(filter.toLowerCase()) &&
//         (!filterByTeam ||
//           teams.disname.toLowerCase() === filterByTeam.toLowerCase()) &&
//         (!showActiveOnly || student.active === "1")
//     )
//     .sort((a, b) => a.disname.localeCompare(b.disname))
//     .map((student) => ({
//       key: student.id,
//       value: student.disname,
//       ...student,
//     }));

//   if (loading && !refreshing) {
//     return (
//       <Layout style={styles.container}>
//         <Spinner />
//       </Layout>
//     );
//   }

//   return (
//     <Layout style={styles.container}>
//       <SafeAreaView style={styles.safeArea}>
//         <View style={styles.headerContainer}>
//           <TextInput
//             style={styles.input}
//             placeholder="Search"
//             value={filter}
//             onChangeText={setFilter}
//           />
//           <Toggle
//             checked={showActiveOnly}
//             onChange={() => setShowActiveOnly(!showActiveOnly)}
//             style={styles.toggle}
//           >
//             Active
//           </Toggle>
//           <SelectList
//             data={[
//               { key: "", value: "All Teams" },
//               ...[...new Set(students.map((team) => team.disname))].map(
//                 (team) => ({ key: team, value: team })
//               ),
//             ]}
//             setSelected={setFilterByTeam}
//             placeholder={filterByTeam || "Select a team"}
//             boxStyles={styles.selectListBox}
//             value={filterByTeam}
//           />
//         </View>
//         <View style={styles.listContainer}>
//           <AlphabetList
//             data={filteredStudents}
//             indexLetterStyle={styles.indexLetterStyle}
//             renderCustomItem={(item) => (
//               <TouchableOpacity onPress={() => handlePress(item)}>
//                 <View style={styles.listItemContainer}>
//                   <Text style={styles.listItemLabel}>{item.value}</Text>
//                 </View>
//               </TouchableOpacity>
//             )}
//             renderCustomSectionHeader={(section) => (
//               <View style={styles.sectionHeaderContainer}>
//                 <Text style={styles.sectionHeaderLabel}>{section.title}</Text>
//               </View>
//             )}
//             onRefresh={handleRefresh}
//             refreshing={refreshing}
//             style={styles.alphabetList}
//             showsVerticalScrollIndicator={false}
//           />
//         </View>
//       </SafeAreaView>
//     </Layout>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   safeArea: {
//     flex: 1,
//   },
//   headerContainer: {
//     padding: 16,
//     backgroundColor: "white",
//   },
//   input: {
//     height: 40,
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingLeft: 8,
//     marginBottom: 8,
//     backgroundColor: "white",
//   },
//   toggle: {
//     marginBottom: 8,
//   },
//   selectListBox: {
//     marginBottom: 8,
//   },
//   listContainer: {
//     flex: 1,
//     marginTop: 10,
//   },
//   listItemContainer: {
//     padding: 16,
//   },
//   listItemLabel: {
//     fontSize: 16,
//   },
//   sectionHeaderContainer: {
//     backgroundColor: "#f0f0f0",
//     padding: 8,
//   },
//   sectionHeaderLabel: {
//     fontWeight: "bold",
//     fontSize: 18,
//   },
//   indexLetterStyle: {
//     color: "blue",
//     fontSize: 10,
//     position: "absolute",
//   },
// });

// export default StudentsScreen;

// // Student Info: [
// //   {
// //     "students": [
// //       {
// //         "course": "ETA InstrumentV2",
// //         "id": "7499",
// //         "disname": "Garrison,L.",
// //         "GROUNDED": "1",
// //         "active": "1"
// //       },
// //       {
// //         "course": "All Sim Course",
// //         "id": "3027",
// //         "disname": "Jackson,D.",
// //         "GROUNDED": "0",
// //         "active": "1"
// //       }
// //     ],
// //     "teams": []
// //   },
// //   {
// //     "students": [],
// //     "teams": [
// //       {
// //         "id": "158",
// //         "disname": "Flight A"
// //       },
// //       {
// //         "id": "159",
// //         "disname": "Flight B"
// //       }
// //     ]
// //   }
// // ]
