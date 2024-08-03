import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View, TouchableOpacity } from "react-native";
import { Text, Layout, Icon, Divider, Card } from "@ui-kitten/components";
import { useAuth } from "./ThemeContext";
import { useRoute } from "@react-navigation/native";

const StudentMapDetails = ({ navigation }) => {
  const route = useRoute();
  const { units, lesson } = route.params;
  const [lineItem, setLineItem] = useState([]);
  const { authUser } = useAuth();

  useEffect(() => {
    if (units && units.length > 0) {
      fetchLineItem(units[0].id); // Fetch line item for the first unit as an example
    }
  }, [units]);

  const fetchLineItem = async (unitId) => {
    console.log("Fetching line items for unitId:", unitId); // Debugging log
    try {
      const response = await fetch(
        `${authUser.host}` +
          `content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=getcoursemapli&etamobilepro=1&nocache=n&persid=${authUser.currpersid}&currlvl4id=${unitId}`
      );
      console.log(response);
      const data = await response.json();
      console.log(data);
      setLineItem(data);
    } catch (error) {
      console.log("Error fetching line item:", error);
    }
  };

  const handlePress = async (unitId) => {
    await fetchLineItem(unitId); // Fetch the line items
    navigation.navigate("LineItem", { data: lineItem }); // Pass the fetched data to the LineItem screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <Layout style={styles.header} level="1">
        <Text category="h5" style={styles.title}>
          {lesson.lesson}
        </Text>
      </Layout>
      <Divider />
      <Layout style={styles.content} level="1">
        {units.map((unit, index) => (
          <View key={index}>
            <Card style={styles.unitCard}>
              <Text category="s1">{unit.unit}</Text>
              <TouchableOpacity
                onPress={() => {
                  handlePress(unit.id);
                }}
                style={styles.button}
              >
                <Text status="primary" style={styles.buttonText}>
                  View Line Items
                </Text>
              </TouchableOpacity>
            </Card>
          </View>
        ))}
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
  },
  backButton: {
    marginRight: 16,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  unitCard: {
    marginBottom: 16,
  },
  button: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#3366FF",
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
  },
});

export default StudentMapDetails;

// import React, { useEffect, useState } from "react";
// import { SafeAreaView, StyleSheet, View, TouchableOpacity } from "react-native";
// import { Text, Layout, Icon, Divider, Card } from "@ui-kitten/components";
// import { useAuth } from "./ThemeContext";
// import { useRoute } from "@react-navigation/native";

// const StudentMapDetails = ({ navigation }) => {
//   const route = useRoute();
//   const { units, lesson } = route.params;
//   const [Lineitem, setLineitem] = useState([]);
//   const { authUser } = useAuth();

//   useEffect(() => {
//     fetchLineItem();
//   }, []);

//   const fetchLineItem = async () => {
//     try {
//       const response = await fetch(
//         `${authUser.host}` +
//           //currlvl4id = unit
//           //mode = getcoursemapli
//           `content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=getcoursemapli&etamobilepro=1&nocache=n&persid=${authUser.currpersid}&currlvl4id=${units.id}`
//       );
//       console.log(response);
//       const data = await response.json();
//       setLineitem(data);
//     } catch {
//       console.log("Error fetching line item:", error);
//     }
//   };

//   const handlePress = (lineitem) => {
//     navigation.navigate("LineItem", { unit: lineitem });
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Layout style={styles.header} level="1">
//         <Text category="h5" style={styles.title}>
//           {lesson.lesson}
//         </Text>
//       </Layout>
//       <Divider />
//       <Layout style={styles.content} level="1">
//         {units.map((unit, index) => (
//           <View key={index}>
//             <Card style={styles.unitCard}>
//               <Text category="s1">{unit.unit}</Text>
//               <Text>ID:{unit.id}</Text>
//               <TouchableOpacity onPress={handlePress} style={styles.button}>
//                 <Text status="primary" style={styles.buttonText}>
//                   View Line Items
//                 </Text>
//               </TouchableOpacity>
//             </Card>
//           </View>
//         ))}
//       </Layout>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F7F9FC",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 16,
//     backgroundColor: "#ffffff",
//   },
//   backButton: {
//     marginRight: 16,
//   },
//   backIcon: {
//     width: 24,
//     height: 24,
//   },
//   title: {
//     flex: 1,
//     textAlign: "center",
//     fontWeight: "bold",
//   },
//   content: {
//     flex: 1,
//     padding: 16,
//   },
//   unitCard: {
//     marginBottom: 16,
//   },
//   button: {
//     marginTop: 24,
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     backgroundColor: "#3366FF",
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#ffffff",
//     fontSize: 16,
//   },
// });

// export default StudentMapDetails;

// // import React from "react";
// // import { SafeAreaView, StyleSheet, View, TouchableOpacity } from "react-native";
// // import { Text, Layout, Icon, Divider, Card } from "@ui-kitten/components";

// // const ArrowBackIcon = (props) => <Icon {...props} name="arrow-back-outline" />;

// // const StudentMapDetails = ({ route, navigation }) => {
// //   const { units, lesson } = route.params;

// //   const handlePress = (unit) => {
// //     console.log("Pressed unit:", unit);
// //     //navigation.navigate("LineItem", { lineitems: unit.lineitems });
// //   };

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <Layout style={styles.header} level="1">
// //         <Text category="h5" style={styles.title}>
// //           {lesson.lesson}
// //         </Text>
// //       </Layout>
// //       <Divider />
// //       <Layout style={styles.content} level="1">
// //         {units.map((unit, index) => (
// //           <TouchableOpacity key={index} onPress={() => handlePress(unit)}>
// //             <Card style={styles.unitCard}>
// //               <Text category="s1">{unit.unit}</Text>
// //             </Card>
// //           </TouchableOpacity>
// //         ))}
// //       </Layout>
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: "#F7F9FC",
// //   },
// //   header: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     padding: 16,
// //     backgroundColor: "#ffffff",
// //   },
// //   backButton: {
// //     marginRight: 16,
// //   },
// //   backIcon: {
// //     width: 24,
// //     height: 24,
// //   },
// //   title: {
// //     flex: 1,
// //     textAlign: "center",
// //     fontWeight: "bold",
// //   },
// //   content: {
// //     flex: 1,
// //     padding: 16,
// //   },
// //   unitCard: {
// //     marginBottom: 16,
// //   },
// //   button: {
// //     marginTop: 24,
// //     paddingVertical: 12,
// //     paddingHorizontal: 16,
// //     borderRadius: 8,
// //     backgroundColor: "#3366FF",
// //     alignItems: "center",
// //   },
// //   buttonText: {
// //     color: "#ffffff",
// //     fontSize: 16,
// //   },
// // });

// // export default StudentMapDetails;
