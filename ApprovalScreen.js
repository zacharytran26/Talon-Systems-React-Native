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
import { useRoute } from "@react-navigation/native";

const useInputState = (initialValue = "") => {
  const [value, setValue] = useState(initialValue);
  return { value, onChangeText: setValue, reset: () => setValue(initialValue) };
};

const Approve = ({ navigation }) => {
  const route = useRoute();
  const { ids } = route.params;
  const hoursInputState = useInputState("");
  const [activityType, setActivityType] = useState(ids.acttype);
  const [submit, setSubmit] = useState(false); // Control toggle visibility
  const commentInputState = useInputState("");
  const pinInputState = useInputState("");
  const { authUser } = useAuth();
  const [submitToScheduling, setSubmitToScheduling] = useState(false);
  const [etaresponse, setEtaresponse] = useState(null);

  const handleToggleChange = (isChecked) => {
    setSubmitToScheduling(isChecked);
  };

  const ToggleCondition = () => {
    // Check if activity type requires "Submit to Scheduling" option
    if (
      activityType === "admin" ||
      activityType === "rental" ||
      activityType === "curr" ||
      activityType === "refresher"
    ) {
      setSubmit(true); // Show the toggle
    } else {
      setSubmit(false); // Hide the toggle
    }
  };

  const HandleAuthorization = async (approved) => {
    const hours = hoursInputState.value;
    const comment = commentInputState.value;
    const pin = pinInputState.value;
    try {
      const response = await fetch(
        `${authUser.host}content?module=home&page=m&reactnative=1&uname=${
          authUser.uname
        }&password=${authUser.upwd}&customer=eta${authUser.schema}&session_id=${
          authUser.sessionid
        }&mode=authrequest&etamobilepro=1&nocache=${
          Math.random().toString().split(".")[1]
        }&schactid=${ids.scheduleid}&requestid=${
          ids.requestid
        }&approval=${approved}&pinnum=${pin}&comment=${comment}&submittoscheduling=${submitToScheduling}&persid=${
          authUser.currpersid
        }`,
        {
          method: "POST",
          headers: {
            Accept: "application/txt",
            "Content-Type": "application/txt",
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setEtaresponse({ ...data, action: approved });
        Alert.alert(
          "Success",
          `${approved === "approve" ? "Approved" : "Denied"} successfully!`
        );
        navigation.navigate("PendingAuth", { refreshList: true }); // Navigate back and refresh
      } else {
        Alert.alert("Error", data.message || "Failed to process request.");
      }
    } catch (error) {
      console.error("Authorization Error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    // Check toggle visibility based on the activity type
    ToggleCondition();
  }, [activityType]); // Run only when the activityType changes

  useEffect(() => {
    if (etaresponse) {
      handleConfirm(etaresponse);
    }
  }, [etaresponse]);

  const handleConfirm = () => {
    if (pinInputState.value === ids.CONFIRM_CODE) {
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
          <Text>
            {ids.value}-{ids.duration}
          </Text>
          <Input
            multiline={false}
            textStyle={styles.textArea}
            placeholder="Hours Approved"
            returnKeyType={Platform.OS === "ios" ? "done" : "next"}
            {...hoursInputState}
            style={styles.input}
          />
          <Input
            multiline={false}
            textStyle={styles.textArea}
            placeholder="Comment"
            returnKeyType={Platform.OS === "ios" ? "done" : "next"}
            {...commentInputState}
            style={styles.input}
          />
          <Input
            multiline={false}
            textStyle={styles.textArea}
            placeholder="Pin"
            returnKeyType={Platform.OS === "ios" ? "done" : "next"}
            {...pinInputState}
            style={styles.input}
            secureTextEntry={true}
            accessoryRight={(props) => <Icon {...props} name="lock-outline" />}
          />

          {submit && (
            <View style={styles.toggleContainer}>
              <Text style={styles.toggleText}>Submit to Scheduling?</Text>
              <Toggle
                checked={submitToScheduling}
                onChange={handleToggleChange}
              />
            </View>
          )}

          <View style={styles.buttonContainer}>
            <Button
              style={styles.approveButton}
              status="success"
              onPress={() => {
                HandleAuthorization("approve");
              }}
            >
              Approve
            </Button>
            <Button
              style={styles.denyButton}
              status="danger"
              onPress={() => {
                HandleAuthorization("deny");
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

export default Approve;
