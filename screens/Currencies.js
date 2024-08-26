import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Modal,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import {
  Layout,
  Text,
  Button,
  Icon,
  Spinner,
  Card,
} from "@ui-kitten/components";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "./ThemeContext";
import { Swipeable } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const AddIcon = (props) => <Icon {...props} name="plus-circle-outline" />;
const AlertIcon = (props) => (
  <Icon {...props} name="alert-circle-outline" width={24} height={24} />
);

const CurrencyScreen = () => {
  const [currencies, setCurrencies] = useState([]);
  const [expcurrencies, setExpcurrencies] = useState([]);
  const [expCount, setExpCount] = useState(0);
  const [actCount, setActCount] = useState(0);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showExpired, setShowExpired] = useState(false);
  const [uploadedImageUri, setUploadedImageUri] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const { authUser } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchCurrencies = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${authUser.host}content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=getcurrency&etamobilepro=1&nocache=n&persid=${authUser.currpersid}`
      );
      const data = await response.json();
      setCurrencies(data.currencies);
      setActCount(data.currencies.length);
    } catch (error) {
      console.error(error);
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
      formData.append("any_id", currencies[0].id);

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

  const getURi = (currency) =>
    currencies.length > 0
      ? `${authUser.host.replace(
          "servlet/",
          ""
        )}php/upload/view.php?imgRes=10&viewPers=${
          authUser.currpersid
        }&rorwwelrw=rw&curuserid=${authUser.currpersid}&id=${
          authUser.sysdocid
        }&svr=TS5P&s=${authUser.sessionid}&c=eta0000`
      : "";

  const fetchExpCurr = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${authUser.host}content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=getcurrency&etamobilepro=1&nocache=n&persid=${authUser.currpersid}&showexp=1`
      );
      const data = await response.json();
      setExpcurrencies(data.currencies);
      setExpCount(data.currencies.length);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCurrencies();
    if (showExpired) {
      await fetchExpCurr();
    }
  };

  const handleAlertPress = async () => {
    if (!showExpired) {
      await fetchExpCurr();
    }
    setShowExpired(!showExpired);
  };

  const handleLongPress = (item) => {
    const urinew = getURi(item) || uploadedImageUri;
    setUploadedImageUri(urinew);
    setPreviewImage(urinew);
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

  const renderCurrency = ({ item }) => {
    let backgroundColor = "#FF3D71"; // Expiring Soon by default

    if (item.expiration === "1") {
      backgroundColor = "#e61717"; // Active
    } else if (item.expiration === "0") {
      backgroundColor = "#08a818"; // Expired
    }

    return (
      <Swipeable
        renderRightActions={(progress, dragX) =>
          renderRightActions(progress, dragX, item)
        }
      >
        <Card
          style={styles.card}
          header={() => (
            <View style={[styles.cardHeader, { backgroundColor }]}>
              <Text style={styles.cardHeaderText}>{item.title}</Text>
              <View style={styles.cardHeaderIcon}>
                <TouchableOpacity
                  style={styles.actionButton}
                  appearance="ghost"
                  onPress={() =>
                    navigation.navigate("Image", { imageUri: uploadedImageUri })
                  }
                  onLongPress={() => handleLongPress(item)}
                >
                  <Icon
                    name={"external-link-outline"}
                    width={20}
                    height={20}
                    fill={"#ffffff"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        >
          <Text category="s1" style={styles.date}>
            Expiration Date: {item.expire}
          </Text>
          <Text category="s2" style={styles.from}>
            Award Date: {item.award}
          </Text>
          <Text category="p1" style={styles.message}>
            Duration: {item.duration} {item.DUR_UNITS}
          </Text>
          <Text category="p1" style={styles.message}>
            Description: {item.descrip}
          </Text>
          <Text category="s1" style={styles.date}>
            By: {item.by}
          </Text>
        </Card>
      </Swipeable>
    );
  };

  const displayedCurrencies = (showExpired ? expcurrencies : currencies).filter(
    (currency) => currency.title.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading && !refreshing) {
    return (
      <Layout style={styles.loadingContainer}>
        <Spinner size="giant" />
      </Layout>
    );
  }

  return (
    <Layout style={styles.container}>
      <StatusBar />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TextInput
            style={styles.input}
            placeholder="Search"
            value={filter}
            onChangeText={setFilter}
            placeholderTextColor="#8F9BB3"
          />
          <TouchableOpacity onPress={handleAlertPress}>
            <AlertIcon fill={showExpired ? "#FF3D71" : "#8F9BB3"} />
          </TouchableOpacity>
        </View>
        <Text category="h5" style={styles.counterText}>
          Active Currencies: {actCount}
        </Text>
        {showExpired && (
          <Text category="h5" style={styles.counterText}>
            Expired Currencies: {expCount}
          </Text>
        )}
        <View style={{ flex: 1 }}>
          <FlashList
            data={displayedCurrencies}
            renderItem={renderCurrency}
            keyExtractor={(item) => item.id.toString()}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            contentContainerStyle={styles.list}
            estimatedItemSize={129}
          />
        </View>
        {previewImage && (
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
                    navigation.navigate("Image", { imageUri: previewImage });
                  }}
                >
                  <Image
                    source={{ uri: previewImage }}
                    style={styles.imagePreview}
                  />
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
    backgroundColor: "#f7f9fc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f9fc",
  },
  cardHeader: {
    padding: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardHeaderText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: "#E4E9F2",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingLeft: 12,
    flex: 1,
    backgroundColor: "#ffffff",
  },
  toggleText: {
    marginLeft: 16,
    color: "#3366FF",
  },
  rightActionContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  actionButton: {
    marginHorizontal: 5,
  },
  list: {
    paddingBottom: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    justifyContent: "space-between",
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
    padding: 20,
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
    width: 250,
    height: 250,
    borderRadius: 8,
  },
  cardHeaderIcon: {
    alignItems: "flex-end",
  },
  date: {
    marginVertical: 4,
    fontSize: 14,
    color: "#8F9BB3",
  },
  from: {
    marginVertical: 4,
    fontSize: 14,
    color: "#8F9BB3",
  },
  message: {
    marginVertical: 4,
    fontSize: 14,
    color: "#2E3A59",
  },
  counterText: {
    fontWeight: "bold",
    color: "#2E3A59",
  },
});

export default CurrencyScreen;
