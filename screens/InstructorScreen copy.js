import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, View, TextInput, SafeAreaView, TouchableOpacity } from 'react-native';
import { Layout, Text, Button, Icon, Spinner, Toggle } from '@ui-kitten/components';
import { useAuth } from './ThemeContext';

const InstructorsScreen = ({ navigation }) => {
  const [filter, setFilter] = useState('');
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const {authUser} = useAuth();

  useEffect(() => {
    fetchInstructors();
  }, []);
  console.log(authUser.url);
  const fetchInstructors = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${authUser.host}`+`content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=getinstructors&etamobilepro=1&nocache=n&persid=${authUser.currpersid}`);
      const text = await response.text();
      console.log(response)
      console.log('Response Text:', text);

      // Attempt to parse the JSON
      try {
        const data = JSON.parse(text);
        setInstructors(data);
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

  const renderInstructor = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item)}>
      <Layout style={styles.messageContainer}>
        <View style={styles.messageHeader}>
        <Text category='s1' style={styles.from}>Name: {item.name}</Text>
          <Icon
            name='person-outline'
            width={24}
            height={24}
            fill='#8F9BB3'
          />

        </View>
      </Layout>
    </TouchableOpacity>
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
      <SafeAreaView>
        <TextInput
          style={styles.input}
          placeholder="Search"
          value={filter}
          onChangeText={setFilter}
        />
        <FlatList
          data={filteredInstructors}
          renderItem={renderInstructor}
          keyExtractor={item => item.phone.toString()} // Assuming email is unique
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
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    paddingLeft: 8,
  },
  toggle: {
    marginBottom: 16,
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
    fontSize: 15
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
});

export default InstructorsScreen;
