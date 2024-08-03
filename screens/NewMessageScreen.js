import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import { Button, Input, Layout, Text, Icon } from "@ui-kitten/components";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useAuth } from "./ThemeContext";
import { SelectList } from "react-native-dropdown-select-list";

const SendIcon = (props) => <Icon {...props} name="paper-plane-outline" />;

const DeleteIcon = (props) => <Icon {...props} name="trash-2-outline" />;

const useInputState = (initialValue = "") => {
  const [value, setValue] = useState(initialValue);
  return { value, onChangeText: setValue, reset: () => setValue(initialValue) };
};

const NewMessage = () => {
  const multilineInputState = useInputState("");
  const route = useRoute();
  const navigation = useNavigation();
  const { email } = route.params;
  const [selected, setSelected] = useState("");
  const [dropdown, setDropDown] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { authUser } = useAuth();

  const message = multilineInputState.value;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch students
      const getStudentsResponse = await fetch(
        `${authUser.host}` +
          `content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=getstudents&etamobilepro=1&nocache=n&persid=${authUser.currpersid}`
      );
      const studentText = await getStudentsResponse.text();
      const studentData = JSON.parse(studentText);

      // Fetch instructors
      const getInstructorsResponse = await fetch(
        `${authUser.host}` +
          `content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=getinstructors&etamobilepro=1&nocache=n&persid=${authUser.currpersid}`
      );
      const instructorText = await getInstructorsResponse.text();
      const instructorData = JSON.parse(instructorText);

      // Combine student and instructor data
      const combinedData = [
        ...studentData.map((student) => ({
          key: student.persid,
          value: student.name,
        })),
        ...instructorData.map((instructor) => ({
          key: instructor.persid,
          value: instructor.name,
        })),
      ];

      setDropDown(combinedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    multilineInputState.reset();
    setSelected(null); // Reset selected recipient to default
  };

  const SendNewMessages = async () => {
    try {
      const response = await fetch(
        `${authUser.host}` +
          `content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=newmessage&etamobilepro=1&nocache=n&persid=${authUser.currpersid}&topersid=${selected}&string=${message}`,
        {
          method: "POST",
          headers: {
            Accept: "application/txt",
            "Content-Type": "application/txt",
          },
        }
      );

      const responseText = await response;
      console.log("Raw response:", responseText);
    } catch (error) {
      console.error("Error sending message:", error);
    }
    console.log("The pers id is:", selected);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Layout style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <Text category="s1" style={styles.label}>
            To:
          </Text>
          <SelectList
            data={dropdown}
            setSelected={setSelected}
            placeholder="Select a contact"
            boxStyles={styles.selectListBox}
            value={selected}
            dropdownStyles={styles.dropdownStyles}
          />
          <Input
            multiline={true}
            textStyle={{ minHeight: 200 }} // Extended input height
            placeholder="Type your message"
            returnKeyType={Platform.OS === "ios" ? "done" : "next"} // Add this line to change return key to "Done" on iOS
            blurOnSubmit={true} // Add this line to dismiss keyboard on submit
            {...multilineInputState}
            style={styles.input}
          />
          <View style={styles.buttonContainer}>
            <Button
              style={styles.sendButton}
              status="primary"
              accessoryLeft={SendIcon}
              onPress={() => {
                SendNewMessages();
                Alert.alert("Message Sent");
                navigation.navigate("Message");
              }}
            >
              Send
            </Button>
            <Button
              style={styles.deleteButton}
              status="danger"
              appearance="outline"
              accessoryLeft={DeleteIcon}
              onPress={handleRefresh}
            >
              Delete Draft
            </Button>
          </View>
        </SafeAreaView>
      </Layout>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    padding: 16,
  },
  label: {
    marginVertical: 10,
  },
  selectListBox: {
    marginBottom: 16,
  },
  input: {
    flex: 1, // Allow the input to expand
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16, // Moved buttons to the bottom
  },
  sendButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  deleteButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  dropdownStyles: {
    maxHeight: 150, // Shortened dropdown menu
  },
});

export default NewMessage;
