import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { Layout, Text, Icon, Spinner } from '@ui-kitten/components';
import { useAuth } from './ThemeContext';
import { AlphabetList } from 'react-native-section-alphabet-list';
import LottieView from 'lottie-react-native';

const InstructorsScreen = ({ navigation }) => {
  const [filter, setFilter] = useState('');
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { authUser } = useAuth();

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${authUser.host}` + `content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=getinstructors&etamobilepro=1&nocache=n&persid=${authUser.currpersid}`);
      const text = await response.text();
      console.log(response);
      console.log('Response Text:', text);

      // Attempt to parse the JSON
      try {
        const data = JSON.parse(text);
        const formattedData = data.map(instructor => ({
          value: instructor.name,
          key: instructor.persid,
          ...instructor
        }));
        setInstructors(formattedData);
      } catch (jsonError) {
        console.error('JSON Parse Error:', jsonError);
      }
    } catch (error) {
      console.error('Error fetching instructors:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handlePress = (instructor) => {
    navigation.navigate('InstructorDetailScreen', { detail: instructor });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchInstructors();
  };

  const filteredInstructors = instructors.filter(instructor =>
    instructor.name.toLowerCase().includes(filter.toLowerCase())
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
      <SafeAreaView style={styles.safeArea}>
        <TextInput
          style={styles.input}
          placeholder="Search"
          value={filter}
          onChangeText={setFilter}
        />
        <View style={styles.alphabetContainer}>
          <AlphabetList
            data={filteredInstructors}
            indexLetterStyle={styles.indexLetterStyle}
            renderCustomItem={(item) => (
              <TouchableOpacity onPress={() => handlePress(item)}>
                <View style={styles.listItemContainer}>
                  <Text style={styles.listItemLabel}>{item.value}</Text>
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
            style={styles.alphabetList} // Apply styles to the AlphabetList
            showsVerticalScrollIndicator={false} // Hide the scroll indicator
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
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 8,
    marginHorizontal: 16,
    marginTop: 10,
    zIndex: 1, // Ensure it's above the alphabet list
    backgroundColor: 'white',
  },
  alphabetContainer: {
    flex: 1,
    marginTop: 20, // Adjust this value to position the alphabet list below the search bar
  },
  messageContainer: {
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#e4e9f2',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontWeight: 'bold',
  },
  from: {
    marginBottom: 8,
    fontSize: 15,
  },
  message: {
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    marginRight: 8,
  },
  backButton: {
    marginRight: 8,
    paddingHorizontal: 0,
    paddingVertical: 0,
    height: 24,
    fontSize: 12,
  },
  list: {
    paddingBottom: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  listItemContainer: {
    padding: 16,
  },
  listItemLabel: {
    fontSize: 16,
  },
  sectionHeaderContainer: {
    backgroundColor: '#f0f0f0',
    padding: 8,
  },
  sectionHeaderLabel: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  indexLetterStyle: {
    color: 'blue',
    fontSize: 10,
    position: 'absolute',
  },
  lottie: {
    width: 100,
    height: 100,
  },
});

export default InstructorsScreen;

// import React, { useState, useEffect } from 'react';
// import { StyleSheet, TextInput, SafeAreaView, TouchableOpacity, View, RefreshControl } from 'react-native';
// import { Layout, Text } from '@ui-kitten/components';
// import { useAuth } from './ThemeContext';
// import { AlphabetList } from 'react-native-section-alphabet-list';
// import LottieView from 'lottie-react-native';

// const InstructorsScreen = ({ navigation }) => {
//   const [filter, setFilter] = useState('');
//   const [instructors, setInstructors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [playingAnimation, setPlayingAnimation] = useState(false); // State to control animation
//   const { authUser } = useAuth();

//   useEffect(() => {
//     fetchInstructors();
//   }, []);

//   const fetchInstructors = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${authUser.host}content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=getinstructors&etamobilepro=1&nocache=n&persid=${authUser.currpersid}`);
//       const text = await response.text();
//       console.log(response);
//       console.log('Response Text:', text);

//       try {
//         const data = JSON.parse(text);
//         const formattedData = data.map(instructor => ({
//           value: instructor.name,
//           key: instructor.persid,
//           ...instructor
//         }));
//         setInstructors(formattedData);
//       } catch (jsonError) {
//         console.error('JSON Parse Error:', jsonError);
//       }
//     } catch (error) {
//       console.error('Error fetching instructors:', error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const handlePress = (instructor) => {
//     navigation.navigate('InstructorDetailScreen', { detail: instructor });
//   };

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     setPlayingAnimation(true); // Start animation
//     await fetchInstructors();

//     // Stop animation after 5 seconds
//     setTimeout(() => {
//       setRefreshing(false);
//       setPlayingAnimation(false); // Stop animation
//     }, 5000);
//   };

//   const filteredInstructors = instructors.filter(instructor =>
//     instructor.name.toLowerCase().includes(filter.toLowerCase())
//   );

//   if (loading && !refreshing) {
//     return (
//       <Layout style={styles.container}>
//         <LottieView
//           source={require('../assets/Animation - 1722056738183.json')} // Ensure you have a Lottie file for the plane animation
//           autoPlay
//           loop
//           style={styles.lottie}
//         />
//       </Layout>
//     );
//   }

//   return (
//     <Layout style={styles.container}>
//       <SafeAreaView style={styles.safeArea}>
//         <TextInput
//           style={styles.input}
//           placeholder="Search"
//           value={filter}
//           onChangeText={setFilter}
//         />
//         <View style={styles.alphabetContainer}>
//           <AlphabetList
//             data={filteredInstructors}
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
//             refreshControl={
//               <RefreshControl
//                 refreshing={refreshing}
//                 onRefresh={handleRefresh}
//                 tintColor="transparent"
//                 colors={[]}
//                 style={styles.refreshControl}
//               >
//                 <View style={styles.lottieContainer}>
//                   {playingAnimation && (
//                     <LottieView
//                       source={require('../assets/Animation - 1722056738183.json')} // Ensure you have a Lottie file for the plane animation
//                       autoPlay
//                       loop
//                       style={styles.lottie}
//                     />
//                   )}
//                 </View>
//               </RefreshControl>
//             }
//             style={styles.alphabetList} // Apply styles to the AlphabetList
//             showsVerticalScrollIndicator={false} // Hide the scroll indicator
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
//   input: {
//     height: 40,
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingLeft: 8,
//     marginHorizontal: 16,
//     marginTop: 10,
//     zIndex: 1, // Ensure it's above the alphabet list
//     backgroundColor: 'white',
//   },
//   alphabetContainer: {
//     flex: 1,
//     marginTop: 20, // Adjust this value to position the alphabet list below the search bar
//   },
//   messageContainer: {
//     padding: 16,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderRadius: 8,
//     borderColor: '#e4e9f2',
//   },
//   messageHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   date: {
//     fontWeight: 'bold',
//   },
//   from: {
//     marginBottom: 8,
//     fontSize: 15,
//   },
//   message: {
//     marginBottom: 8,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   button: {
//     marginRight: 8,
//   },
//   backButton: {
//     marginRight: 8,
//     paddingHorizontal: 0,
//     paddingVertical: 0,
//     height: 24,
//     fontSize: 12,
//   },
//   list: {
//     paddingBottom: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   title: {
//     flex: 1,
//     textAlign: 'center',
//   },
//   listItemContainer: {
//     padding: 16,
//   },
//   listItemLabel: {
//     fontSize: 16,
//   },
//   sectionHeaderContainer: {
//     backgroundColor: '#f0f0f0',
//     padding: 8,
//   },
//   sectionHeaderLabel: {
//     fontWeight: 'bold',
//     fontSize: 18,
//   },
//   indexLetterStyle: {
//     color: 'blue',
//     fontSize: 10,
//     position: 'absolute',
//   },
//   lottie: {
//     width: 50,
//     height: 50,
//   },
//   lottieContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   refreshControl: {
//     backgroundColor: 'transparent',
//   },
// });

// export default InstructorsScreen;
