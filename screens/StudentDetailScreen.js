import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import {
  Layout,
  Text,
  Avatar,
  Card,
  Button,
  ButtonGroup,
  Icon,
} from "@ui-kitten/components";
import { useRoute } from "@react-navigation/native";
import { useAuth } from "./ThemeContext";
import * as Contacts from "expo-contacts";
import * as ImagePicker from "expo-image-picker";

const StudentDetailScreen = ({ navigation }) => {
  const route = useRoute();
  const { detail } = route.params;
  const [image, setImage] = useState(null);
  const [studDetail, setStudDetail] = useState({});
  const { authUser } = useAuth();

  const uric = `${authUser.host.replace(
    "servlet/",
    ""
  )}/php/upload/view.php?imgRes=10&viewPers=${
    authUser.currpersid
  }&rorwwelrw=rw&curuserid=${authUser.currpersid}&id=${
    studDetail.SYSDOCID
  }&svr=TS5P&s=${authUser.sessionid}&c=eta0000`;

  useEffect(() => {
    fetchStudentDetails();
    (async () => {
      try {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission denied", "Unable to access contacts.");
        }
      } catch (error) {
        console.error("Error requesting permissions:", error);
        Alert.alert("Error", "An error occurred while requesting permissions.");
      }
    })();
  }, []);

  const fetchStudentDetails = async () => {
    try {
      const response = await fetch(
        `${authUser.host}content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=getstudentdetail&etamobilepro=1&nocache=n&persid=${authUser.currpersid}&persregid=${detail.id}`
      );
      const data = await response.json();
      setStudDetail(data);
    } catch (error) {
      Alert.alert("Error", error.message || "An error occurred");
    }
  };

  const addContact = async () => {
    const contact = {
      [Contacts.Fields.FirstName]: studDetail.DISNAME || "Unknown",
      [Contacts.Fields.PhoneNumbers]: studDetail.PHONE
        ? [{ label: "mobile", number: studDetail.PHONE }]
        : [],
      [Contacts.Fields.Emails]: studDetail.EMAIL1
        ? [{ label: "work", email: studDetail.EMAIL1 }]
        : [],
    };

    try {
      const contactId = await Contacts.addContactAsync(contact);
      if (contactId) {
        Alert.alert("Success", "Contact added successfully!");
      } else {
        Alert.alert("Failed", "Failed to add contact.");
      }
    } catch (error) {
      console.error("Error adding contact:", error);
      Alert.alert("Error", "An error occurred while adding the contact.");
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <Layout style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={pickImage}>
              <Avatar
                source={image ? { uri: image } : { uri: uric }}
                style={styles.profileAvatar}
              />
            </TouchableOpacity>
            {studDetail && studDetail.isgrounded === "1" && (
              <Text style={styles.groundedText}>
                {studDetail.DISNAME} is GROUNDED
              </Text>
            )}

            <Text category="h1" style={styles.profileName}>
              {studDetail ? studDetail.DISNAME : ""}
            </Text>
            <ButtonGroup
              style={styles.buttonGroup}
              appearance="outline"
              size="small"
            >
              <Button
                onPress={() =>
                  navigation.navigate("StudentCourse", { course: studDetail })
                }
                accessoryLeft={(props) => (
                  <Icon {...props} name="book-outline" />
                )}
              >
                Course
              </Button>
              <Button
                onPress={() =>
                  navigation.navigate("StudentMap", { course: studDetail })
                }
                accessoryLeft={(props) => (
                  <Icon {...props} name="map-outline" />
                )}
              >
                Course Map
              </Button>
              <Button
                onPress={addContact}
                status="success"
                accessoryLeft={(props) => (
                  <Icon {...props} name="person-add-outline" />
                )}
              >
                Add to Contacts
              </Button>
            </ButtonGroup>
          </View>

          <View style={styles.sectionContainer}>
            <Text category="h5" style={styles.sectionHeader}>
              Student Information
            </Text>
          </View>

          <Card style={styles.card}>
            <Text category="s1" style={styles.cardText}>
              Course: {studDetail.COURSE}
            </Text>
          </Card>

          <Card style={styles.card}>
            <Text category="s1" style={styles.cardText}>
              Flight Block: {studDetail.FLT_BLK}
            </Text>
          </Card>

          <Card style={styles.card}>
            <Text category="s1" style={styles.cardText}>
              Team: {studDetail.TEAM}
            </Text>
          </Card>

          <Card style={styles.card}>
            <Text category="s1" style={styles.cardText}>
              Instructor: {studDetail.INST}
            </Text>
          </Card>

          <Card style={styles.card}>
            <Text category="s1" style={styles.cardText}>
              Email: {studDetail.EMAIL1}
            </Text>
          </Card>

          <Card style={styles.card}>
            <Text category="s1" style={styles.cardText}>
              Phone: {studDetail.PHONE}
            </Text>
          </Card>

          <View style={styles.sectionContainer}>
            <Text category="h5" style={styles.sectionHeader}>
              Additional Information
            </Text>
          </View>

          <Card style={styles.card}>
            <Text category="s1" style={styles.cardText}>
              Registration ID: {studDetail.ID}
            </Text>
          </Card>

          <Card style={styles.card}>
            <Text category="s1" style={styles.cardText}>
              Last Flown: {studDetail.LAST_FLY}
            </Text>
          </Card>

          <Card style={styles.card}>
            <Text category="s1" style={styles.cardText}>
              Training Calendar: {studDetail.TRAINCAL}
            </Text>
          </Card>

          <Card style={styles.card}>
            <Text category="s1" style={styles.cardText}>
              Next Checkride: {studDetail.NEXT_CHK}
            </Text>
          </Card>

          <View style={styles.sectionContainer}>
            <Text category="h5" style={styles.sectionHeader}>
              Unit Performance
            </Text>
          </View>

          <Card style={styles.card}>
            <Text category="s1" style={styles.cardText}>
              Completed Units: {studDetail.completed}
            </Text>
          </Card>

          <Card style={styles.card}>
            <Text category="s1" style={styles.cardText}>
              Attempted Units: {studDetail.attempt}
            </Text>
          </Card>

          <Card style={styles.card}>
            <Text category="s1" style={styles.cardText}>
              Incomplete Units: {studDetail.incomplete}
            </Text>
          </Card>

          <Card style={styles.card}>
            <Text category="s1" style={styles.cardText}>
              Remaining Units: {studDetail.remaining}
            </Text>
          </Card>

          <Card style={styles.card}>
            <Text category="s1" style={styles.cardText}>
              Failed Units: {studDetail.failures}
            </Text>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  profileAvatar: {
    width: 100,
    height: 100,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
  },
  buttonGroup: {
    marginTop: 16,
  },
  sectionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#E5E9F2",
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    fontWeight: "bold",
    color: "#2E3A59",
    fontSize: 20,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  cardText: {
    color: "#2E3A59",
    fontSize: 16,
  },
  groundedText: {
    color: "#fc0303",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 8,
  },
});

export default StudentDetailScreen;
