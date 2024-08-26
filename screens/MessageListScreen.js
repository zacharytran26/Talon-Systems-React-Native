import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { Layout, Text, Button, Icon, Spinner } from "@ui-kitten/components";
import { useAuth } from "./ThemeContext";
import { Swipeable } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const TrashIcon = (props) => <Icon {...props} name="trash-2-outline" />;
const ReplyIcon = (props) => <Icon {...props} name="corner-up-left-outline" />;

const MessagesScreen = () => {
  const [filter, setFilter] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewOnly, setShowNewOnly] = useState(1); // 1 = Unread, 0 = All
  const [refreshing, setRefreshing] = useState(false);
  const [deletedItems, setDeletedItems] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const { authUser } = useAuth();
  const navigation = useNavigation();
  const viewRef = useRef(null);

  useEffect(() => {
    fetchEmails();
  }, []);

  const sanitizeJSONString = (str) => {
    return str.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
  };
  // reason why whenever i press on the button and nothing shows up is because it is doing another fetch and nothing is being populated from that fetch
  const fetchEmails = async () => {
    setLoading(true);
    let status = "all";

    if (showNewOnly === true) {
      status = "unread";
    }
    try {
      const url = `${authUser.host}content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=getmessage&etamobilepro=1&nocache=n&persid=${authUser.currpersid}&status=${status}`;
      const response = await fetch(url);
      const text = await response.text();
      const sanitizedText = sanitizeJSONString(text);
      const data = JSON.parse(sanitizedText);
      setMessages(data);
    } catch (error) {
      console.error("Error fetching emails:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const archiveEmails = async (id) => {
    const querystring = `${authUser.host}content?module=home&page=m&reactnative=1&session_id=${authUser.sessionid}&customer=eta0000&mode=archivemessage&etamobilepro=1&nocache=n&persid=${authUser.currpersid}&msgid=${id}`;
    try {
      const response = await fetch(querystring);
      const data = await response.json();
    } catch (error) {
      Alert.alert("Error archiving email:", error);
    }
  };

  const handlePress = (message) => {
    navigation.navigate("Emails", { email: message });
  };

  const handleLongPress = (message) => {
    setSelectedMessage(message);
    setPreviewVisible(true);
  };

  const removeItem = (id) => {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message.id !== id)
    );
    setDeletedItems((prevDeletedItems) => [...prevDeletedItems, id]);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchEmails();
    setMessages((prevMessages) =>
      prevMessages.filter((message) => !deletedItems.includes(message.id))
    );
  };

  const markAsRead = async (id) => {
    // Update local state
    const updatedMessages = messages.map((message) =>
      message.id === id ? { ...message, isread: "1" } : message
    );
    setMessages(updatedMessages);
    // Update the server
    try {
      const url = `${authUser.host}content?module=home&page=m&reactnative=1&session_id=${authUser.sessionid}&mode=updatemessage&etamobilepro=1&nocache=n&persid=${authUser.currpersid}&msgid=${id}`;
      const response = await fetch(url);
      const data = await response.text();
      if (!response.ok) {
        Alert.alert("Failed to update message status on server.");
      }
    } catch (error) {
      Alert.alert("Error updating message status on server:", error);
    }
  };

  const toggleNewMessages = () => {
    if (showNewOnly === 1) {
      // If currently showing unread (1), switch to showing all (0)
      setShowNewOnly(0);
    } else {
      // If currently showing all (0), switch to showing only unread (1)
      setShowNewOnly(1);
    }
  };

  const CreateNewMessage = (message) => {
    navigation.navigate("NewMessage", { email: message });
  };

  const filteredMessages = messages.filter(
    (message) =>
      message.message.toLowerCase().includes(filter.toLowerCase()) &&
      (showNewOnly === 0 || message.isread === "0")
  );
  const renderRightActions = (progress, dragX, item) => (
    <View style={styles.rightAction}>
      <Button
        style={styles.actionButton}
        appearance="ghost"
        accessoryLeft={TrashIcon}
        onPress={() => {
          removeItem(item.id);
          archiveEmails(item.id);
        }}
      />
      <Button
        style={styles.actionButton}
        appearance="ghost"
        accessoryLeft={ReplyIcon}
        onPress={() => navigation.navigate("ReplyScreen", { email: item })}
      />
    </View>
  );

  const renderItem = ({ item }) => {
    let EmailIcon = "email";
    let fillColor = "#3366FF";

    if (item.isread === "1") {
      EmailIcon = "email-outline";
      fillColor = "#b6daf2";
    }

    return (
      <Swipeable
        renderRightActions={(progress, dragX) =>
          renderRightActions(progress, dragX, item)
        }
      >
        <TouchableOpacity
          style={styles.button}
          ref={viewRef}
          onPress={() => {
            markAsRead(item.id);
            handlePress(item);
          }}
          onLongPress={() => handleLongPress(item)}
        >
          <Layout style={styles.messageContainer}>
            <View style={styles.messageHeader}>
              <Text category="s2" style={styles.from}>
                From: {item.from}
              </Text>
              <Icon name={EmailIcon} width={24} height={24} fill={fillColor} />
            </View>
            <Text category="s1" style={styles.date}>
              {item.date}
            </Text>
            <Text category="s2" style={styles.message}>
              {item.message}
            </Text>
          </Layout>
        </TouchableOpacity>
      </Swipeable>
    );
  };

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
      <SafeAreaView style={{ flex: 1 }}>
        <TextInput
          style={styles.input}
          placeholder="Search"
          value={filter}
          onChangeText={setFilter}
        />
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() =>
              CreateNewMessage({ from: messages.topersid, topersid: "" })
            }
          >
            <Icon name="edit-outline" width={32} height={32} fill={"#b6daf2"} />
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleNewMessages}>
            <Icon
              name="inbox-outline"
              width={32}
              height={32}
              fill={showNewOnly ? "#b6daf2" : "#8F9BB3"}
            />
          </TouchableOpacity>
        </View>

        <FlashList
          data={filteredMessages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={styles.list}
          estimatedItemSize={100} // Adjust this value based on your item's average height
        />
        {selectedMessage && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={previewVisible}
            onRequestClose={() => {
              setPreviewVisible(!previewVisible);
            }}
          >
            <TouchableWithoutFeedback onPress={() => setPreviewVisible(false)}>
              <View style={styles.modalOverlay}>
                <TouchableOpacity
                  style={styles.modalView}
                  onPress={() => {
                    setPreviewVisible(false);
                    handlePress(selectedMessage);
                  }}
                >
                  <Text style={styles.modalText}>
                    From: {selectedMessage.from}
                  </Text>
                  <Text style={styles.modalText}>
                    Date: {selectedMessage.date}
                  </Text>
                  <Text style={styles.modalText}>
                    {selectedMessage.message}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f7f9fc",
  },
  leftAction: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "blue",
    paddingHorizontal: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    paddingLeft: 8,
    borderColor: "#E4E9F2",
    backgroundColor: "#ffffff",
  },
  toggle: {
    marginBottom: 16,
  },
  messageContainer: {
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#e4e9f2",
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontWeight: "bold",
  },
  from: {
    marginBottom: 8,
  },
  message: {
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 16,
    justifyContent: "space-between",
  },
  title: {
    flex: 1,
    textAlign: "center",
  },
  rightAction: {
    flexDirection: "row",
  },
  actionButton: {
    width: 75,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default MessagesScreen;
