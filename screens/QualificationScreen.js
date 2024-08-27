import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import {
  Button,
  Layout,
  Text,
  Icon,
  Spinner,
  Card,
} from "@ui-kitten/components";
import { useAuth } from "./ThemeContext";
import { Swipeable } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";

const AddIcon = (props) => <Icon {...props} name="plus-circle" />;

const QualiScreen = ({ navigation }) => {
  const [quali, setQuali] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qualicount, setQualiCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [image, setImage] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const { authUser } = useAuth();

  useEffect(() => {
    fetchQuali();
  }, []);

  const fetchQuali = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${authUser.host}content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=getqualification&etamobilepro=1&nocache=n&persid=${authUser.currpersid}`
      );
      const data = await response.json();
      setQuali(data.qualifications);
      setQualiCount(data.qualifications.length);
    } catch (error) {
      console.error("Error fetching or parsing data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

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
      setImage(imageUri);

      const formData = new FormData();
      formData.append("photo", {
        uri: imageUri,
        type: result.assets[0].type,
        name: result.assets[0].fileName,
      });
      formData.append("pers_id", `${authUser.currpersid}`);
      formData.append("pers_type", "instructor");
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

  const getURi = (qualification) =>
    quali.length > 0
      ? `${authUser.host.replace(
          "servlet/",
          ""
        )}php/upload/view.php?imgRes=10&viewPers=${
          authUser.currpersid
        }&rorwwelrw=rw&curuserid=${authUser.currpersid}&id=${
          authUser.sysdocid
        }&svr=TS5P&s=${authUser.sessionid}&c=eta0000`
      : "";

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchQuali();
  };

  const handleLongPress = (item) => {
    const uri = getURi(item);
    setImage(uri);
    setPreviewVisible(true);
  };

  const renderRightActions = (progress, dragX, item) => (
    <View style={styles.rightActionContainer}>
      <Button
        style={styles.actionButton}
        appearance="ghost"
        accessoryLeft={AddIcon}
        onPress={openImagePickerExpo}
      />
    </View>
  );

  const renderQuali = ({ item }) => (
    <Swipeable
      renderRightActions={(progress, dragX) =>
        renderRightActions(progress, dragX, item)
      }
    >
      <Card
        style={styles.card}
        header={() => (
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>{item.QUAL}</Text>
            <TouchableOpacity
              style={styles.cardHeaderIcon}
              onPress={() => navigation.navigate("Image", { imageUri: image })}
              onLongPress={() => handleLongPress(item)}
            >
              <Icon
                name={"external-link-outline"}
                width={18}
                height={18}
                fill={"#3366FF"}
              />
            </TouchableOpacity>
          </View>
        )}
      >
        <Text style={styles.cardText}>
          <Text style={styles.label}>Award Date:</Text> {item.AWARD_DATE}
        </Text>
        <Text style={styles.cardText}>
          <Text style={styles.label}>Description:</Text> {item.DESCRP}
        </Text>
        <Text style={styles.cardText}>
          <Text style={styles.label}>By:</Text> {item.BY}
        </Text>
      </Card>
    </Swipeable>
  );

  if (loading && !refreshing) {
    return (
      <Layout style={styles.loadingContainer}>
        <Spinner />
      </Layout>
    );
  }

  return (
    <Layout style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text category="h5" style={styles.headerText}>
            Qualifications: {qualicount}
          </Text>
        </View>
        <FlatList
          data={quali}
          renderItem={renderQuali}
          keyExtractor={(item, index) => index.toString()}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={styles.list}
        />
        {image && (
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
                    navigation.navigate("Image", { imageUri: image });
                  }}
                >
                  <Image source={{ uri: image }} style={styles.imagePreview} />
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
    backgroundColor: "#F7F9FC",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginBottom: 16,
  },
  headerText: {
    fontWeight: "bold",
    color: "#2E3A59",
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardHeaderText: {
    fontWeight: "bold",
    color: "#2E3A59",
    fontSize: 16,
  },
  cardHeaderIcon: {
    alignItems: "flex-end",
    marginLeft: "auto",
  },
  from: {
    marginBottom: 8,
    color: "#8F9BB3",
  },
  message: {
    marginBottom: 8,
    color: "#2E3A59",
  },
  date: {
    fontWeight: "bold",
    color: "#2E3A59",
  },
  list: {
    paddingBottom: 16,
  },
  rightActionContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  actionButton: {
    marginHorizontal: 5,
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
  imagePreview: {
    width: 200,
    height: 200,
  },
  cardBody: {
    padding: 12,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 4,
    color: "#2E3A59",
  },
  label: {
    fontWeight: "600",
    color: "#8F9BB3",
  },
});

export default QualiScreen;
