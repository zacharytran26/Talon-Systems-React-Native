import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, View, TextInput, SafeAreaView } from 'react-native';
import { Layout, Text, Button, Icon, Spinner, Toggle } from '@ui-kitten/components';

const StudentsScreen = ({ navigation }) => {
  const [filter, setFilter] = useState('');
  const [student, setStudent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [refreshing, setRefreshing] = useState(false);


//   useEffect(() => {
//     fetchEmails();
//   }, []);
  const fetchEmails = async () => {
    setLoading(true);
    try {
      const data = [{"firstname": "james", "lastname": "brawn", "phone": "214-232-1234", "email":"test_test@yahoo.com"}]
      //const response = await fetch('https://apps2.talonsystems.com/tseta/servlet/content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=606327&customer=eta0000&mode=getmessage&etamobilepro=1&nocache=n&persid=970'); // Replace with your API endpoint
      //const data = await response.json();
      setStudent(data);
    } catch (error) {
      console.error('Error fetching emails:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handlePress = (details) => {
    navigation.navigate('Emails', { student: details, removeItem});
  };


  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchEmails();
    setMessages((prevStudents) => prevStudents.filter(details => !deletedItems.includes(details.id)));
  };


  const filteredStudents = student.filter(student =>
    student.lastname.toLowerCase().includes(filter.toLowerCase()) &&
    (!showNewOnly || message.isNew)
  );

  const renderPerson = ({ person }) => (
    <Button size='small' style={styles.button} onPress={() => {
        handlePress(person);
      }}>
        <Layout style={styles.messageContainer}>
      <View style={styles.messageHeader}>
        <Text category='s1' style={styles.date}>{person.lastname}</Text>
        <Icon
          name='person-outline'
          width={24}
          height={24}
          fill={item.isRead ? '#8F9BB3' : '#3366FF'}
        />
      </View>
      <Text category='s2' style={styles.from}>From: {person.firstname}</Text>
      <Text category='p1' style={styles.message}>{person.phone}</Text>
      <View style={styles.buttonContainer}>
      </View>
    </Layout>
    </Button>
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
        <View style={styles.header}>
          <Button size='small' appearance='ghost' style={styles.backButton} onPress={() => navigation.goBack()}>Back</Button>
          <Text category='h5' style={styles.title}>Students</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Search"
          value={filter}
          onChangeText={setFilter}
        />
        <Toggle
          checked={showNewOnly}
          style={styles.toggle}
        >
          New Messages
        </Toggle>
        <FlatList
          data={filteredStudents}
          renderItem={renderPerson}
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
    borderColor: 'gray',
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

export default StudentsScreen;
