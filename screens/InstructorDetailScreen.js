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
import * as ImagePicker from "expo-image-picker";

const InstructorList = ({ navigation }) => {
  const route = useRoute();
  const { detail } = route.params;
  const [image, setImage] = useState(null);
  const profileImage = require("../assets/person-icon.png");

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.profileSection}>
            <TouchableOpacity
              appearance="ghost"
              style={styles.profileSection}
              onPress={pickImage}
            >
              <Avatar
                source={image ? { uri: image } : profileImage}
                style={styles.profileAvatar}
              />
            </TouchableOpacity>
            <Text category="h1" style={styles.profileName}>
              {detail.name}
            </Text>
          </View>
          <View style={styles.contactInfo}>
            <Card style={styles.contactInfoCard}>
              <Text style={styles.contactInfoLabel}>Email</Text>
              <Text style={styles.contactInfoValue}>{detail.email}</Text>
            </Card>
            <Card style={styles.contactInfoCard}>
              <Text style={styles.contactInfoLabel}>Phone</Text>
              <Text style={styles.contactInfoValue}>{detail.phone}</Text>
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
    width: 100,
    height: 100,
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

export default InstructorList;
