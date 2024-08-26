import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, View, SafeAreaView } from "react-native";
import {
  Layout,
  Text,
  Input,
  Toggle,
  Avatar,
  Icon,
  Button,
  IconRegistry,
  ApplicationProvider,
} from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import * as eva from "@eva-design/eva";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./ThemeContext";

const SettingsScreen = ({ navigation }) => {
  const { theme, toggleTheme, authUser } = useAuth();
  const [uploadedImageUri, setUploadedImageUri] = useState(null);
  const [form, setForm] = useState({
    emailNotifications: true,
    pushNotifications: false,
    accessCode: "",
    username: "",
  });
  const [image, setImage] = useState(null);
  const openImagePickerExpo = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setUploadedImageUri(imageUri);

      const formData = new FormData();
      formData.append("photo", {
        uri: imageUri,
        type: result.assets[0].type,
        name: result.assets[0].fileName,
      });
      formData.append("pers_id", `${authUser.currpersid}`);
      formData.append("pers_type", `${authUser.perstype}`);
      formData.append("any_type", "crncy_id");
      formData.append("doc_type", "instCrncy");
      formData.append("file_type", result.assets[0].type);
      formData.append("etaaction", "new");

      const myurl = `${authUser.host}uploadBlobETAAll`;

      fetch(myurl, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data;",
        },
      })
        .then((response) => console.log(response))
        .catch((error) => {
          console.log("error", error);
        });
    }
  };

  const uric = `https://apps5.talonsystems.com/tseta/php/upload/view.php?imgRes=10&viewPers=${authUser.currpersid}&rorwwelrw=rw&curuserid=${authUser.currpersid}&id=${authUser.sysdocid}&svr=TS5P&s=${authUser.sessionid}&c=eta0000`;

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const emailNotifications = await AsyncStorage.getItem(
        "emailNotifications"
      );
      const accessCode = await AsyncStorage.getItem("accesscode");
      const username = await AsyncStorage.getItem("username");

      setForm((prevForm) => ({
        ...prevForm,
        emailNotifications: emailNotifications === "true",
        accessCode: accessCode || "",
        username: username || "",
      }));
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const saveSettings = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value.toString());
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const handleEmailNotificationsToggle = (isChecked) => {
    setForm({ ...form, emailNotifications: isChecked });
    saveSettings("emailNotifications", isChecked);
  };

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva[theme]}>
        <SafeAreaView style={styles.safeArea}>
          <Layout style={styles.container}>
            <Layout style={styles.profile}>
              <Button
                appearance="ghost"
                style={styles.editButton}
                onPress={openImagePickerExpo}
              >
                <Avatar
                  source={{
                    uri: image || uric,
                  }}
                  style={styles.profileAvatar}
                />
                <Icon
                  style={styles.profileAction}
                  fill="#fff"
                  name="edit-outline"
                />
              </Button>
            </Layout>

            <ScrollView style={styles.scrollView}>
              <Layout style={styles.section}>
                <Text category="label" style={styles.sectionTitle}>
                  Account Settings
                </Text>

                <View style={styles.row}>
                  <Text style={styles.label}>Version</Text>
                  <Text style={styles.value}>1.0.0</Text>
                </View>

                <View style={styles.row}>
                  <Input
                    label="Accesscode"
                    value={form.accessCode}
                    style={styles.input}
                    placeholder="Enter your access code"
                    editable={false}
                  />
                </View>

                <View style={styles.row}>
                  <Input
                    label="Username"
                    value={form.username}
                    style={styles.input}
                    placeholder="Enter your username"
                    editable={false}
                  />
                </View>
              </Layout>

              <Layout style={styles.section}>
                <Text category="label" style={styles.sectionTitle}>
                  Preferences
                </Text>

                <View style={styles.row}>
                  <Layout
                    style={[styles.rowIcon, { backgroundColor: "#FFAA00" }]}
                  >
                    <Icon style={styles.icon} fill="#fff" name="bell-outline" />
                  </Layout>
                  <Text style={styles.rowLabel}>Push Notifications</Text>

                  <View style={styles.rowSpacer} />
                  <Toggle
                    checked={form.pushNotifications}
                    onChange={(pushNotifications) =>
                      setForm({ ...form, pushNotifications })
                    }
                  />
                </View>
              </Layout>
            </ScrollView>
          </Layout>
        </SafeAreaView>
      </ApplicationProvider>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f9fc",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f7f9fc",
  },
  profile: {
    paddingVertical: 24,
    backgroundColor: "#fff",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginBottom: 16,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileAction: {
    position: "absolute",
    right: -4,
    bottom: -10,
    width: 28,
    height: 28,
    borderRadius: 9999,
    backgroundColor: "#007bff",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
  },
  sectionTitle: {
    paddingBottom: 12,
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "#9e9e9e",
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  rowIcon: {
    width: 30,
    height: 30,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0c0c0c",
    flex: 1,
    marginLeft: 10,
  },
  rowSpacer: {
    flexShrink: 2,
    flexBasis: 1,
  },
  icon: {
    width: 24,
    height: 24,
    alignSelf: "flex-end",
  },
  editButton: {
    position: "relative",
  },
  input: {
    flex: 1,
    marginVertical: 8,
    width: "100%",
  },
});

export default SettingsScreen;
