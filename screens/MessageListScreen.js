import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, View, TextInput, SafeAreaView, TouchableOpacity, StatusBar} from 'react-native';
import { Layout, Text, Button, Icon, Spinner, Toggle } from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './ThemeContext';
import { Swipeable } from 'react-native-gesture-handler';

const EditIcon = (props) => (
  <Icon {...props} name='edit-outline' />
);

const MailIcon = (props) => (
  <Icon {...props} name='email-outline' />
);

const TrashIcon = (props) => (
  <Icon {...props} name='trash-2-outline' />
);

const ReplyIcon = (props) => (
  <Icon {...props} name='corner-up-left-outline' />
);
const NewMessageIcon = (props) => (
  <Icon {...props} name='inbox-outline' />
);
const MessagesScreen = ({ navigation }) => {
  const [filter, setFilter] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [deletedItems, setDeletedItems] = useState([]);
  const { authUser } = useAuth();

  useEffect(() => {
    fetchEmails();
  }, []);

  const sanitizeJSONString = (str) => {
    return str.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
  };

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const url = `${authUser.host}content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=getmessage&etamobilepro=1&nocache=n&persid=${authUser.currpersid}`;
      console.log(url);
      const response = await fetch(url);
      const text = await response.text();
      const sanitizedText = sanitizeJSONString(text);
      const data = JSON.parse(sanitizedText);
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

  const archiveEmails = async (id) => {
    const querystring = `${authUser.host}content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=archivemessage&etamobilepro=1&nocache=n&persid=${authUser.currpersid}&msgid=${id}`;
    try {
      const response = await fetch(querystring);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error archiving email:', error);
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

  const toggleNewMessages = () => {
    setShowNewOnly(!showNewOnly);
  };

  const CreateNewMessage = (message) => {
    navigation.navigate('NewMessage', { email: message }); // Adjust the parameters as needed
    console.log("pressed");
  };

  const filteredMessages = messages.filter(message =>
    message.message.toLowerCase().includes(filter.toLowerCase()) &&
    (!showNewOnly || message.isNew)
  );

  const renderRightActions = (progress, dragX, item) => (
    <View style={styles.rightAction}>
      <Button style={styles.actionButton} appearance='ghost' accessoryLeft={TrashIcon} onPress={() => { removeItem(item.id); archiveEmails(item.id); }} />
      <Button style={styles.actionButton} appearance='ghost' accessoryLeft={ReplyIcon} onPress={() => navigation.navigate('ReplyScreen', { email: item })} />
    </View>
  );

  const renderItem = ({ item }) => (
    <Swipeable renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item)}>
      <TouchableOpacity style={styles.button} onPress={() => {
        markAsRead(item.id);
        handlePress(item);
      }}>
        <Layout style={styles.messageContainer}>
          <View style={styles.messageHeader}>
          <Text category='s2' style={styles.from}>From: {item.from}</Text>
            <Icon
              name={item.isRead ? 'email-outline' : 'email'}
              width={24}
              height={24}
              fill={item.isRead ? '#8F9BB3' : '#3366FF'}
            />
        
          </View>
          <Text category='s1' style={styles.date}>{item.date}</Text>
          <Text category='s2' style={styles.message}>{item.message}</Text>
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
      <StatusBar/>
      <SafeAreaView >
      <TextInput
          style={styles.input}
          placeholder="Search"
          value={filter}
          onChangeText={setFilter}
        />
        <View style={styles.header}>
          <TouchableOpacity onPress={()=>CreateNewMessage({ from: messages.topersid, topersid: "" })}>
            <Icon name='edit-outline' width={32} height={32} fill={'#3366FF'}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleNewMessages}>
            <Icon name='inbox-outline' width={32} height={32} fill={showNewOnly ? '#3366FF' : '#8F9BB3'} />
          </TouchableOpacity>
        </View>

        
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
  leftAction: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'blue',
    paddingHorizontal: 10,
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
    paddingBottom: 200,
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  rightAction: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MessagesScreen;
