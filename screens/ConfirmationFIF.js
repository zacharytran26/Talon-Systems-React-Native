import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, View, Platform, Alert } from "react-native";
import {
  Layout,
  Text,
  Button,
  Input,
  Toggle,
  Icon,
} from "@ui-kitten/components";
import { useAuth } from "./ThemeContext";

const useInputState = (initialValue = "") => {
  const [value, setValue] = useState(initialValue);
  return { value, onChangeText: setValue, reset: () => setValue(initialValue) };
};

const ConfirmFIF = ({ navigation, route }) => {
  const { fifdata } = route.params;
  const hoursInputState = useInputState("");
  const confirmInputState = useInputState("");
  const pinInputState = useInputState("");
  const { authUser } = useAuth();
  const [submitToScheduling, setSubmitToScheduling] = useState(false);
  const [etaresponse, setEtaresponse] = useState(null);

  const handleToggleChange = (isChecked) => {
    setSubmitToScheduling(isChecked);
  };

  const HandleAuthorization = async (approved) => {
    const hours = hoursInputState.value;
    const confirmcode = confirmInputState.value;
    const pin = pinInputState.value;

    const response = await fetch(
      `${authUser.host}content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=confirmfif&etamobilepro=1&nocache=n&ccode=${confirmcode}&approval=${approved}&pinnum=${pin}&persid=${authUser.currpersid}`,
      {
        method: "POST",
        headers: {
          Accept: "application/txt",
          "Content-Type": "application/txt",
        },
      }
    );
    const data = await response.json();
    setEtaresponse(data);
  };

  useEffect(() => {
    if (etaresponse) {
      AlertMessage(etaresponse);
    }
  }, [etaresponse]);

  const AlertMessage = (item) => {
    Alert.alert(item.msg);
  };

  const handleConfirm = () => {
    if (confirmInputState.value === fifdata.CONFIRM_CODE) {
      Alert.alert("Success", "Confirmation code is correct.");
      // Proceed with the confirmation logic here
    } else {
      Alert.alert("Error", "Confirmation code is incorrect.");
    }
  };

  return (
    <Layout style={styles.container}>
      <SafeAreaView>
        <View style={styles.content}>
          <Input
            multiline={true}
            textStyle={styles.textArea}
            placeholder="Confirmation Code"
            returnKeyType={Platform.OS === "ios" ? "done" : "next"}
            blurOnSubmit={true}
            {...confirmInputState}
            style={styles.input}
          />
          <Input
            multiline={true}
            textStyle={styles.textArea}
            placeholder="Pin"
            returnKeyType={Platform.OS === "ios" ? "done" : "next"}
            blurOnSubmit={true}
            {...pinInputState}
            style={styles.input}
            accessoryRight={(props) => <Icon {...props} name="lock-outline" />}
          />
          <View style={styles.buttonContainer}>
            <Button
              style={styles.approveButton}
              status="success"
              onPress={() => {
                handleConfirm();
                HandleAuthorization("approve");
                navigation.goBack();
              }}
            >
              Approve
            </Button>
            <Button
              style={styles.denyButton}
              status="danger"
              onPress={() => {
                HandleAuthorization("deny");
                navigation.goBack();
              }}
            >
              Deny
            </Button>
            <Button
              style={styles.cancelButton}
              appearance="outline"
              onPress={() => {
                navigation.goBack();
              }}
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
    backgroundColor: "#f7f9fc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#2E3A59",
  },
  content: {
    paddingHorizontal: 16,
  },
  textArea: {
    minHeight: 64,
  },
  input: {
    borderColor: "#E4E9F2",
    marginBottom: 16,
    borderRadius: 8,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  toggleText: {
    fontWeight: "bold",
    color: "#8F9BB3",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  approveButton: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
    borderRadius: 8,
  },
  denyButton: {
    backgroundColor: "#f44336",
    borderColor: "#f44336",
    borderRadius: 8,
  },
  cancelButton: {
    borderColor: "#3366FF",
    borderRadius: 8,
  },
});

export default ConfirmFIF;
