import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
} from "react-native";
import {
  Layout,
  Text,
  Avatar,
  Card,
  Button,
  Icon,
} from "@ui-kitten/components";
import { useRoute } from "@react-navigation/native";
import { useAuth } from "./ThemeContext";
import * as Contacts from "expo-contacts";
import * as ImagePicker from "expo-image-picker";

const InstructorActivity = ({ navigation }) => {
  const route = useRoute();
  const { activity } = route.params;
  const { authUser } = useAuth();
  const [image, setImage] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [instDetail, setInstDetail] = useState({});
  const [imageError, setImageError] = useState(false);
  useEffect(() => {
    FetchInstructorDetail();
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

  useEffect(() => {
    if (instDetail.SYSDOCID) {
      const uri = `${authUser.host.replace(
        "servlet/",
        ""
      )}/php/upload/view.php?imgRes=10&viewPers=${
        authUser.currpersid
      }&rorwwelrw=rw&curuserid=${authUser.currpersid}&id=${
        instDetail.SYSDOCID
      }&svr=TS5P&s=${authUser.sessionid}&c=eta0000`;

      setImage(uri);
    }
  }, [instDetail]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageError(false); // Reset image error when a new image is picked
    }
  };

  const addContact = async () => {
    const contact = {
      [Contacts.Fields.FirstName]: instDetail.DISNAME || "Unknown",
      [Contacts.Fields.PhoneNumbers]: instDetail.PHONE
        ? [{ label: "mobile", number: instDetail.PHONE }]
        : [],
      [Contacts.Fields.Emails]: instDetail.EMAIL1
        ? [{ label: "work", email: instDetail.EMAIL1 }]
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

  useEffect(() => {
    FetchInstructorDetail();
  }, []);

  const FetchInstructorDetail = async () => {
    try {
      const response = await fetch(
        `${authUser.host}content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=getinstructordetail&etamobilepro=1&nocache=n&persid=${authUser.currpersid}&persinstid=${activity.picid}`
      );
      const data = await response.json();
      setInstDetail(data);
    } catch (error) {
      console.error("Error fetching instructor details:", error);
    }
  };

  return (
    <Layout style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.profileSection}>
            <TouchableOpacity
              appearance="ghost"
              style={styles.editButton}
              onPress={pickImage}
            >
              <Avatar
                source={
                  image
                    ? { uri: image }
                    : imageError || !instDetail.SYSDOCID
                    ? require("../assets/person-icon.png") // Fallback image
                    : { uri: image }
                }
                style={styles.profileAvatar}
                onError={() => setImageError(true)} // Handle image load error
              />
            </TouchableOpacity>
            <Text category="h1" style={styles.profileName}>
              {instDetail.DISNAME}
            </Text>
            <Button
              onPress={addContact}
              style={styles.contactButton}
              accessoryLeft={(props) => (
                <Icon {...props} name="person-add-outline" />
              )}
            >
              Add to Contacts
            </Button>
          </View>
          <View style={styles.contactInfo}>
            <View style={styles.sectionContainer}>
              <Text category="h5" style={styles.sectionHeader}>
                Instructor Information
              </Text>
            </View>
            <Card style={styles.card}>
              <Text category="s1" style={styles.cardText}>
                Email: {instDetail.EMAIL}
              </Text>
            </Card>
            <Card style={styles.card}>
              <Text category="s1" style={styles.cardText}>
                Phone: {instDetail.PHONE}
              </Text>
            </Card>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
    padding: 16,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  profileAvatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E3A59",
    marginTop: 8,
    textAlign: "center",
  },
  contactButton: {
    marginTop: 16,
    width: "80%",
  },
  contactInfo: {
    marginBottom: 24,
  },
  contactInfoCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    fontWeight: "bold",
    color: "#2E3A59",
    fontSize: 20,
  },
  contactInfoLabel: {
    fontWeight: "bold",
    marginBottom: 4,
    color: "#8F9BB3",
  },
  contactInfoValue: {
    fontSize: 16,
    color: "#2E3A59",
  },
  editButton: {
    alignItems: "center",
    justifyContent: "center",
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
});

export default InstructorActivity;
