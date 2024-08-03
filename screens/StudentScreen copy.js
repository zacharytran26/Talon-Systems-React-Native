import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { Layout, Text, Icon, Spinner, Toggle } from '@ui-kitten/components';
import { useAuth } from './ThemeContext';
import { AlphabetList } from 'react-native-section-alphabet-list';
import { SelectList } from 'react-native-dropdown-select-list';

const StudentsScreen = ({ navigation }) => {
  const [filter, setFilter] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [filterByTeam, setFilterByTeam] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const { authUser } = useAuth();

  useEffect(() => {
    fetchStudents();
  }, [showActiveOnly, filterByTeam]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${authUser.host}content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=getstudents&etamobilepro=1&nocache=n&persid=${authUser.currpersid}`);
      const text = await response.text();
      const data = JSON.parse(text);
      const formattedData = data.map(student => ({
        value: student.name,
        key: student.persid,
        ...student
      }));
      setStudents(formattedData);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handlePress = (student) => {
    navigation.navigate('StudentDetailScreen', { detail: student });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStudents();
  };


  const filteredStudents = students.filter(student => {
    const matchesFilter = student.name.toLowerCase().includes(filter.toLowerCase());
    const matchesTeam = filterByTeam ? student.team.toLowerCase() === filterByTeam.toLowerCase() : true;
    const matchesStatus = showActiveOnly ? student.perstat === 'Active' : student.perstat === 'Completed';
    return matchesFilter && matchesTeam && matchesStatus;
  });

  const alphabetListData = filteredStudents.map(student => ({
    key: student.persid, // Ensure the key is unique for each student
    value: student.name,
    name: student.name,
  })).sort((a, b) => a.name.localeCompare(b.name));

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
            onChange={() => setShowActiveOnly(!showActiveOnly)}
            style={styles.toggle}>
            Active Only
          </Toggle>
          <SelectList
            data={[{ key: '', value: 'All Teams' }, ...[...new Set(students.map(student => student.team))].map(team => ({ key: team, value: team }))]}
            setSelected={(key) => {
              setFilterByTeam(key);
            }}
            placeholder={filterByTeam || "Select a team"}
            boxStyles={styles.selectListBox}
            value={filterByTeam}
          />
        </View>
        <View style={styles.listContainer}>
          <AlphabetList
            data={alphabetListData}
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
    backgroundColor: 'white',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 8,
    marginBottom: 8,
    backgroundColor: 'white',
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
});

export default StudentsScreen;

// import React, { useState, useEffect } from 'react';
// import { StyleSheet, FlatList, View, TextInput, SafeAreaView, TouchableOpacity } from 'react-native';
// import { Layout, Text, Icon, Spinner, Toggle } from '@ui-kitten/components';
// import { useAuth } from './ThemeContext';
// import { AlphabetList } from 'react-native-section-alphabet-list';
// import { SelectList } from 'react-native-dropdown-select-list';

// const StudentsScreen = ({ navigation }) => {
//   const [filter, setFilter] = useState('');
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showActiveOnly, setShowActiveOnly] = useState(true);
//   const [filterByTeam, setFilterByTeam] = useState('');
//   const [refreshing, setRefreshing] = useState(false);
//   const { authUser } = useAuth();

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   const fetchStudents = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${authUser.host}` + `content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=getstudents&etamobilepro=1&nocache=n&persid=${authUser.currpersid}`);
//       const text = await response.text();
//       const data = JSON.parse(text);
//       setStudents(data);
//     } catch (error) {
//       console.error('Error fetching students:', error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const handlePress = (student) => {
//     navigation.navigate('StudentDetailScreen', { detail: student });
//   };

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchStudents();
//   };

//   const filteredStudents = students.filter(student => {
//     const matchesFilter = student.name.toLowerCase().includes(filter.toLowerCase());
//     const matchesTeam = filterByTeam ? student.team.toLowerCase() === filterByTeam.toLowerCase() : true;
//     const matchesStatus = showActiveOnly ? student.perstat === 'Active' : student.perstat === 'Completed';
//     return matchesFilter && matchesTeam && matchesStatus;
//   });

//   const renderPerson = ({ item }) => (
//     <TouchableOpacity onPress={() => handlePress(item)}>
//       <Layout style={styles.messageContainer}>
//         <View style={styles.messageHeader}>
//           <Text category='s1' style={styles.from}>{item.name}</Text>
//           <Icon
//             name='person-outline'
//             width={24}
//             height={24}
//             fill='#8F9BB3'
//           />
//         </View>
//       </Layout>
//     </TouchableOpacity>
//   );

//   const alphabetListData = filteredStudents.map(student => ({
//     key: student.persid, // Ensure the key is unique for each student
//     value: student.name,
//     name: student.name,
//   })).sort((a, b) => a.name.localeCompare(b.name));

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
//             style={styles.toggle}>
//             Active
//           </Toggle>
//           <SelectList
//             data={[{ key: '', value: 'All Teams' }, ...[...new Set(students.map(student => student.team))].map(team => ({ key: team, value: team }))]}
//             setSelected={setFilterByTeam}
//             placeholder="Select a team"
//             boxStyles={styles.selectListBox}
//             value={filterByTeam}
//           />
//         </View>
//         <FlatList
//           data={filteredStudents}
//           renderItem={renderPerson}
//           keyExtractor={item => item.pesregid} // Assuming email is unique
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
//   },
//   safeArea: {
//     flex: 1,
//   },
//   headerContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     padding: 16,
//     backgroundColor: 'white',
//     zIndex: 1,
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     borderRadius: 5,
//     marginBottom: 8,
//     paddingLeft: 8,
//   },
//   toggle: {
//     marginBottom: 8,
//   },
//   selectListBox: {
//     marginBottom: 8,
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
//   from: {
//     marginBottom: 8,
//   },
//   message: {
//     marginBottom: 8,
//   },
//   list: {
//     paddingTop: 160, // Adjust this value to ensure the list doesn't overlap with the fixed header
//   },
// });

// export default StudentsScreen;


//  <TextInput
// style={styles.input}
// placeholder="Search"
// value={filter}
// onChangeText={setFilter}
// />
// <Toggle
// checked={showActiveOnly}
// onChange={() => setShowActiveOnly(!showActiveOnly)}
// style={styles.toggle}>
// Active
// </Toggle>
// <SelectList
// data={[{ key: '', value: 'All Teams' }, ...[...new Set(students.map(student => student.team))].map(team => ({ key: team, value: team }))]}
// setSelected={setFilterByTeam}
// placeholder="Select a team"
// boxStyles={styles.selectListBox}
// value={filterByTeam}
//> 