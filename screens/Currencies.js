import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import {
  Layout,
  Text,
  Button,
  Icon,
  Spinner,
  Card,
} from "@ui-kitten/components";
import { useAuth } from "./ThemeContext";
import { Swipeable } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";

const AddIcon = (props) => <Icon {...props} name="plus-circle" />;

const AlertIcon = (props) => (
  <Icon
    {...props}
    name="alert-circle-outline"
    width={32}
    height={32}
    fill={"#c90616"}
  />
);

const CurrencyScreen = ({ navigation }) => {
  const [currencies, setCurrencies] = useState([]);
  const [expcurrencies, setExpcurrencies] = useState([]);
  const [expCount, setExpCount] = useState(0);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showExpired, setShowExpired] = useState(false);
  const [image, setImage] = useState(null);
  const { authUser } = useAuth();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchCurrencies = async () => {
    setLoading(true);
    const response = await fetch(
      `${authUser.host}content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=getcurrency&etamobilepro=1&nocache=n&persid=${authUser.currpersid}`
    );
    try {
      const data = await response.json();
      setCurrencies(data.currencies);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchExpCurr = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${authUser.host}content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=getcurrency&etamobilepro=1&nocache=n&persid=${authUser.currpersid}&showexp=1`
      );
      const data = await response.json();
      setExpcurrencies(data.currencies);
      setExpCount(data.currencies.length); // Set the count of expired currencies
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCurrencies();
    if (showExpired) {
      await fetchExpCurr();
    }
  };

  const handleAlertPress = async () => {
    if (!showExpired) {
      await fetchExpCurr();
    }
    setShowExpired(!showExpired);
  };

  const renderRightActions = (progress, dragX, item) => (
    <View style={styles.rightActionContainer}>
      <Button
        style={styles.actionButton}
        appearance="ghost"
        accessoryLeft={AddIcon}
        onPress={pickImage}
      />
    </View>
  );

  const renderCurrency = ({ item }) => {
    let backgroundColor = "#f20a0a"; // Expiring Soon by default

    if (item.expiration === "1") {
      backgroundColor = "#1755e6"; // Active
    } else if (item.expiration === "0") {
      backgroundColor = "#08a818"; // Expired
    }

    return (
      <Swipeable
        renderRightActions={(progress, dragX) =>
          renderRightActions(progress, dragX, item)
        }
      >
        <Card
          style={styles.card}
          header={() => (
            <View style={[styles.cardHeader, { backgroundColor }]}>
              <Text style={styles.cardHeaderText}>{item.title}</Text>
            </View>
          )}
        >
          <Text category="s1" style={styles.date}>
            Expiration Date: {item.expire}
          </Text>
          <Text category="s2" style={styles.from}>
            Award Date: {item.award}
          </Text>
          <Text category="p1" style={styles.message}>
            Duration: {item.duration} {item.DUR_UNITS}
          </Text>
          <Text category="p1" style={styles.message}>
            Description: {item.descrip}
          </Text>
          <Text category="s1" style={styles.date}>
            By: {item.by}
          </Text>
        </Card>
      </Swipeable>
    );
  };

  const displayedCurrencies = showExpired
    ? expcurrencies
    : currencies.filter((currency) =>
        currency.title.toLowerCase().includes(filter.toLowerCase())
      );

  if (loading && !refreshing) {
    return (
      <Layout style={styles.container}>
        <Spinner />
      </Layout>
    );
  }

  return (
    <Layout style={styles.container}>
      <StatusBar />
      <SafeAreaView>
        <View style={styles.header}>
          <TextInput
            style={styles.input}
            placeholder="Search"
            value={filter}
            onChangeText={setFilter}
          />
          <TouchableOpacity onPress={handleAlertPress}>
            <AlertIcon />
          </TouchableOpacity>
        </View>
        {showExpired && <Text>Expired Currencies: {expCount}</Text>}
        <FlatList
          data={displayedCurrencies}
          renderItem={renderCurrency}
          keyExtractor={(item) => item.id.toString()} // Ensure the key is unique
          refreshing={refreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={styles.list}
        />
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  cardHeader: {
    padding: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardHeaderText: {
    color: "#170101", // Text color
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    paddingLeft: 8,
    flex: 1,
  },
  toggleText: {
    marginLeft: 16,
    color: "blue",
  },
  rightActionContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  actionButton: {
    marginHorizontal: 5,
  },
  list: {
    paddingBottom: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    justifyContent: "space-between",
  },
});

export default CurrencyScreen;

// import React, { useState, useEffect } from "react";
// import {
//   StyleSheet,
//   SafeAreaView,
//   View,
//   TextInput,
//   FlatList,
//   TouchableOpacity,
// } from "react-native";
// import {
//   Layout,
//   Text,
//   Button,
//   Spinner,
//   Card,
//   Icon,
// } from "@ui-kitten/components";
// import { useAuth } from "./ThemeContext";
// import { Swipeable } from "react-native-gesture-handler";
// import * as ImagePicker from "expo-image-picker";

// const AddIcon = (props) => <Icon {...props} name="plus-circle" />;

// const AlertIcon = (props) => (
//   <Icon
//     {...props}
//     name="alert-circle-outline"
//     width={32}
//     height={32}
//     fill={"#c90616"}
//   />
// );

// const CurrencyScreen = ({ navigation }) => {
//   const [currencies, setCurrencies] = useState([]);
//   const [expcurrencies, setExpcurrencies]  = useState([]);
//   const [filter, setFilter] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [image, setImage] = useState(null);
//   const [showOnlyExpired, setShowOnlyExpired] = useState(false);
//   const { authUser } = useAuth();

//   const pickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });
//     if (!result.canceled) {
//       setImage(result.assets[0].uri);
//     }
//   };

//   const SwitchCurrColor = (expiration) => {
//     switch (expiration) {
//       case "1":
//         return "#1755e6"; // Active
//       case "0":
//         return "#08a818"; // Expired
//       default:
//         return "#f20a0a"; // Expiring Soon
//     }
//   };

//   useEffect(() => {
//     fetchCurrencies();
//   }, []);

//   const fetchCurrencies = async () => {
//     setLoading(true);
//     const response = await fetch(
//       `${authUser.host}content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=getcurrency&etamobilepro=1&nocache=n&persid=${authUser.currpersid}`
//     );
//     try {
//       const data = await response.json();
//       console.log(data);
//       setCurrencies(data.currencies);
//       console.log(currencies);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const fetchExpCurr = async() =>{
//     setLoading(true);
//     try{
//       const response = await fetch(`${authUser.host}content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=getcurrency&etamobilepro=1&nocache=n&persid=${authUser.currpersid}&showexp=1`)
//       const data = await response.json();
//       setExpcurrencies(data);

//     }catch{
//       console.log(error)
//     }finally {
//       setLoading(false);
//       setRefreshing(false);
//     }

//     };

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchCurrencies();
//   };

//   const handleExpCurr = async () =>{
//     setRefreshing(true);
//     await fetchExpCurr();
//   };

//   const renderRightActions = (progress, dragX, item) => (
//     <View style={styles.rightActionContainer}>
//       <Button
//         style={styles.actionButton}
//         appearance="ghost"
//         accessoryLeft={AddIcon}
//         onPress={pickImage}
//       />
//     </View>
//   );

//   const renderCurrency = ({ item }) => (
//     <Swipeable
//       renderRightActions={(progress, dragX) =>
//         renderRightActions(progress, dragX, item)
//       }
//     >
//       <Card
//         style={styles.card}
//         header={() => (
//           <View
//             style={[
//               styles.cardHeader,
//               { backgroundColor: SwitchCurrColor(item.expiration) },
//             ]}
//           >
//             <Text style={styles.cardHeaderText}>{item.title}</Text>
//           </View>
//         )}
//       >
//         <Text category="s1" style={styles.date}>
//           Expiration Date: {item.expire}
//         </Text>
//         <Text category="s2" style={styles.from}>
//           Award Date: {item.award}
//         </Text>
//         <Text category="p1" style={styles.message}>
//           Duration: {item.duration} {item.DUR_UNITS}
//         </Text>
//         <Text category="p1" style={styles.message}>
//           Description: {item.descrip}
//         </Text>
//         <Text category="s1" style={styles.date}>
//           By: {item.by}
//         </Text>
//       </Card>
//     </Swipeable>
//   );

//   const filteredCurrencies = currencies.filter(
//     (currency) =>
//       currency.title.toLowerCase().includes(filter.toLowerCase()) &&
//       (!showOnlyExpired || currency.expiration === "0")
//   );

//   if (loading && !refreshing) {
//     return (
//       <Layout style={styles.container}>
//         <Spinner />
//       </Layout>
//     );
//   }

//   return (
//     <Layout style={styles.container}>
//       <SafeAreaView>
//         <View style={styles.header}>
//           <TextInput
//             style={styles.input}
//             placeholder="Search"
//             value={filter}
//             onChangeText={setFilter}
//           />
//           <TouchableOpacity
//             onPress={() => setShowOnlyExpired(!showOnlyExpired)}
//           >
//             <AlertIcon />
//           </TouchableOpacity>
//         </View>
//         <FlatList
//           data={filteredCurrencies}
//           renderItem={renderCurrency}
//           keyExtractor={(item) => item.id.toString()} // Ensure the key is unique
//           refreshing={refreshing}
//           onRefresh={handleRefresh}
//           contentContainerStyle={styles.list}
//         />
//       </SafeAreaView>
//     </Layout>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   cardHeader: {
//     padding: 8,
//     borderTopLeftRadius: 8,
//     borderTopRightRadius: 8,
//   },
//   cardHeaderText: {
//     color: "#170101", // Text color
//     fontWeight: "bold",
//   },
//   input: {
//     height: 40,
//     borderColor: "gray",
//     borderWidth: 1,
//     borderRadius: 5,
//     marginBottom: 16,
//     paddingLeft: 8,
//     flex: 1,
//   },
//   toggleText: {
//     marginLeft: 16,
//     color: "blue",
//   },
//   rightActionContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 8,
//   },
//   actionButton: {
//     marginHorizontal: 5,
//   },
//   list: {
//     paddingBottom: 1,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 16,
//   },
// });

// export default CurrencyScreen;
