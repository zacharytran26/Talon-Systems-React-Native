import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
} from "react-native";
import { Layout, Text, Avatar, Card } from "@ui-kitten/components";
import { useRoute } from "@react-navigation/native";
import { useAuth } from "./ThemeContext";

const InstructorActivity = ({ navigation }) => {
  const route = useRoute();
  const { detail } = route.params;
  const { authUser } = useAuth();
  const [imageUri, setImageUri] = useState(null);
  const [instDetail, setInstDetail] = useState({});
  const [imageError, setImageError] = useState(false); // Track image loading error

  useEffect(() => {
    FetchInstructorDetail();
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

      setImageUri(uri);
    }
  }, [instDetail]);

  const FetchInstructorDetail = async () => {
    try {
      const response = await fetch(
        `${authUser.host}content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=getinstructordetail&etamobilepro=1&nocache=n&persid=${authUser.currpersid}&persinstid=${detail.ID}`
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
              style={styles.profileSection}
              onPress={() => console.log("add pickImage function")}
            >
              <Avatar
                source={
                  imageError || !imageUri
                    ? require("../assets/person-icon.png") // Fallback image
                    : { uri: imageUri }
                }
                style={styles.profileAvatar}
                onError={() => setImageError(true)} // Handle image load error
              />
            </TouchableOpacity>
            <Text category="h1" style={styles.profileName}>
              {instDetail.DISNAME}
            </Text>
          </View>
          <View style={styles.contactInfo}>
            <Card style={styles.contactInfoCard}>
              <Text style={styles.contactInfoLabel}>Email</Text>
              <Text style={styles.contactInfoValue}>{instDetail.EMAIL}</Text>
            </Card>
            <Card style={styles.contactInfoCard}>
              <Text style={styles.contactInfoLabel}>Phone</Text>
              <Text style={styles.contactInfoValue}>{instDetail.PHONE}</Text>
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
    backgroundColor: "white",
    padding: 16,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "white",
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
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
  },
  contactInfo: {
    marginBottom: 24,
  },
  contactInfoCard: {
    marginBottom: 16,
    padding: 16,
  },
  contactInfoLabel: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  contactInfoValue: {
    fontSize: 16,
  },
  editButton: {
    alignItems: "center",
  },
});

export default InstructorActivity;
