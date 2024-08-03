import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, View, TextInput, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { Layout, Text, Button, Icon, Spinner, Toggle } from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './ThemeContext';
import { Swipeable } from 'react-native-gesture-handler';

const EditIcon = (props) => (
  <Icon {...props} name='edit-outline'/>
);

const NewMessage = (props) => (
  <Icon {...props} name='menu-outline'/>
);
const TrashIcon = (props) => (
  <Icon {...props} name='trash-2-outline' />
);


const ReplyIcon = (props) => (
  <Icon {...props} name='corner-up-left-outline' />
);

const MessagesScreen = ({ navigation }) => {
  const [filter, setFilter] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [deletedItems, setDeletedItems] = useState([]);
  
  const {authUser} = useAuth();


  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://apps2.talonsystems.com/tseta/servlet/content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=getmessage&etamobilepro=1&nocache=n&persid=${authUser.currpersid}`);
      const data = await response.json();
      const readMessages = JSON.parse(await AsyncStorage.getItem('readMessages')) || [];

      const processedData = data.map(email => ({
        ...email,
        isRead: readMessages.includes(email.id),
        isNew: !readMessages.includes(email.id),
      }));
      console.log(processedData);
      setMessages(processedData);
    } catch (error) {
      console.error('Error fetching emails:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handlePress = (message) => {
    navigation.navigate('Emails', { email: message, removeItem });
  };

  const removeItem = (id) => {
    setMessages((prevMessages) => prevMessages.filter((message) => message.id !== id));
    setDeletedItems((prevDeletedItems) => [...prevDeletedItems, id]);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchEmails();
    setMessages((prevMessages) => prevMessages.filter(message => !deletedItems.includes(message.id)));
  };

  const markAsRead = async (id) => {
    const updatedMessages = messages.map(message =>
      message.id === id ? { ...message, isRead: true, isNew: false } : message
    );
    setMessages(updatedMessages);

    // Update local storage with read message IDs
    const readMessages = JSON.parse(await AsyncStorage.getItem('readMessages')) || [];
    if (!readMessages.includes(id)) {
      readMessages.push(id);
      await AsyncStorage.setItem('readMessages', JSON.stringify(readMessages));
    }
  };

  const onToggleChange = (isChecked) => {
    setShowNewOnly(isChecked);
  };

  const CreateNewMessage = (message) => {
    navigation.navigate('NewMessage', { email: message }); // Adjust the parameters as needed
    console.log("pressed");
  };

  const filteredMessages = messages.filter(message =>
    message.message.toLowerCase().includes(filter.toLowerCase()) &&
    (!showNewOnly || message.isNew)
  );
  
  const rightButtons = [
    <Button accessoryLeft={TrashIcon}/>,
    <Button accessoryLeft={ReplyIcon}/>
  ];

  const renderItem = ({ item }) => (
    <Swipeable renderRightActions={rightButtons}>
    <TouchableOpacity style={styles.button} onPress={() => {
      markAsRead(item.id);
      handlePress(item);
    }}>
      <Layout style={styles.messageContainer}>
        <View style={styles.messageHeader}>
          <Text category='s1' style={styles.date}>{item.date}</Text>
          <Icon
            name={item.isRead ? 'email-outline' : 'email'}
            width={24}
            height={24}
            fill={item.isRead ? '#8F9BB3' : '#3366FF'}
          />
        </View>
        <Text category='s2' style={styles.from}>From: {item.from}</Text>
        <Text category = 'h5' style={styles.title}>{item.message}</Text>
        <View style={styles.buttonContainer}>
        </View>
      </Layout>
    </TouchableOpacity>
    </Swipeable>
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
          <Text category='h5' style={styles.title}>Inbox</Text>
          <Button
            style={styles.button}
            appearance='ghost'
            accessoryLeft={EditIcon}
            onPress={() => CreateNewMessage({ from: messages.topersid, topersid: "" })}
          />
        </View>
        
        <TextInput
          style={styles.input}
          placeholder="Search"
          value={filter}
          onChangeText={setFilter}
        />
        <Toggle
          checked={showNewOnly}
          onChange={onToggleChange}
          style={styles.toggle}
        >
          New Messages
        </Toggle>
        <FlatList
          data={filteredMessages}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
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

export default MessagesScreen;
