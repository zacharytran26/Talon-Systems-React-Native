import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  Layout,
  Text,
  Button,
  Spinner,
  Card,
  Icon,
  Toggle,
} from "@ui-kitten/components";
import { useAuth } from "./ThemeContext";
import { Swipeable } from "react-native-gesture-handler";

const Approve = ({ navigation, route }) => {
  const { request } = route.params;
  const [approved, setApproved] = useState("");
  const [comment, setComment] = useState("");
  const [pin, setPin] = useState("");
  const [submitToScheduling, setSubmitToScheduling] = useState(false);

  const handleToggleChange = (isChecked) => {
    setSubmitToScheduling(isChecked);
  };

  const handleApprove = async () => {
    const response = await fetch(
      `${authUser.host}content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=replymessage&etamobilepro=1&nocache=n&persid=${authUser.currpersid}&approval=${approved}&pinnum=${pin}`,
      {
        method: "POST",
        headers: {
          Accept: "application/txt",
          "Content-Type": "application/txt",
        },
      }
    );
  };

  const handleDeny = async () => {
    const response = await fetch(
      `${authUser.host}content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=replymessage&etamobilepro=1&nocache=n&persid=${authUser.currpersid}&approval=${approved}&pinnum=${pin}`,
      {
        method: "POST",
        headers: {
          Accept: "application/txt",
          "Content-Type": "application/txt",
        },
      }
    );
  };

  return (
    <Layout style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <Text category="h5" style={styles.title}>
            Approve or Deny
          </Text>
        </View>
        <View style={styles.content}>
          <Text category="h6" style={styles.requestTitle}>
            {request.title}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Total Approved"
            value={approved}
            onChangeText={setApproved}
          />
          <TextInput
            style={styles.input}
            placeholder="Authorization Comment"
            value={comment}
            onChangeText={setComment}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your PIN"
            secureTextEntry
            value={pin}
            onChangeText={setPin}
          />
          <View style={styles.toggleContainer}>
            <Text>Submit to Scheduling?</Text>
            <Toggle
              checked={submitToScheduling}
              onChange={handleToggleChange}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              style={styles.button}
              status="success"
              onPress={handleApprove}
            >
              Approve
            </Button>
            <Button style={styles.button} status="danger" onPress={handleDeny}>
              Deny
            </Button>
            <Button
              style={styles.button}
              appearance="outline"
              onPress={() => navigation.goBack()}
            >
              Cancel
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    marginRight: 8,
  },
  title: {
    flex: 1,
    textAlign: "center",
  },
  content: {
    paddingHorizontal: 16,
  },
  requestTitle: {
    textAlign: "center",
    marginVertical: 16,
    fontWeight: "bold",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
  },
  icon: {
    width: 50,
    height: 50,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    paddingLeft: 8,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  button: {
    marginHorizontal: 8,
  },
});

export default Approve;
