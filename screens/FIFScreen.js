import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  StatusBar,
  Linking,
  Alert,
} from "react-native";
import { Layout, Text, Button, Icon, Card } from "@ui-kitten/components";
import { useAuth } from "./ThemeContext";
import { FlashList } from "@shopify/flash-list";

const FIFScreen = ({ navigation }) => {
  const [fif, setFif] = useState([]);
  const [confirm, setConfirm] = useState(false);
  const [fifcount, setFifCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const { authUser } = useAuth();

  useEffect(() => {
    fetchFif();
    setConfirm(true);
  }, []);

  const fetchFif = async () => {
    const url = `${authUser.host}content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=getfif&etamobilepro=1&nocache=n&persid=${authUser.currpersid}`;
    const response = await fetch(url);
    const data = await response.json();
    setFif(data.fifs);
    setFifCount(data.fifs.length);
  };

  const handleConfirm = (item) => {
    if (confirm === false) {
      Alert.alert("Please press View to confirm FIF");
    } else {
      navigation.navigate("Confirm", { fifdata: fif });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchFif();
    setRefreshing(false);
  };

  const openInBrowser = (url) => {
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.warn("Don't know how to open URI: " + url);
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  const renderFif = ({ item }) => {
    return (
      <Card
        style={styles.card}
        status="basic"
        header={() => (
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>{item.DIS}</Text>
          </View>
        )}
      >
        <Text style={styles.descriptionText}>{item.DESCRIP}</Text>
        <View style={styles.buttonRow}>
          <Button
            style={styles.viewButton}
            status="primary"
            appearance="ghost"
            accessoryLeft={(props) => <Icon {...props} name="eye-outline" />}
            onPress={() => {
              setConfirm(true);
              openInBrowser(item.LINK);
            }}
          >
            View
          </Button>
          <Button
            style={styles.confirmButton}
            status="success"
            accessoryLeft={(props) => (
              <Icon {...props} name="checkmark-outline" />
            )}
            onPress={() => handleConfirm(confirm)}
          >
            Confirm
          </Button>
        </View>
      </Card>
    );
  };

  return (
    <Layout style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7f9fc" />
      <SafeAreaView style={{ flex: 1 }}>
        <Text category="h5" style={styles.headerText}>
          FIF Count: {fifcount}
        </Text>
        <FlashList
          data={fif}
          renderItem={renderFif}
          keyExtractor={(item) => item.ID.toString()}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={styles.list}
          estimatedItemSize={150}
        />
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#f7f9fc",
  },
  headerText: {
    fontWeight: "bold",
    color: "#2E3A59",
    marginTop: 8,
  },
  card: {
    marginVertical: 8,
    borderRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    padding: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: "#b6daf2",
  },
  cardHeaderText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  descriptionText: {
    marginVertical: 12,
    fontSize: 14,
    color: "#2E3A59",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  viewButton: {
    flex: 0.48,
  },
  confirmButton: {
    flex: 0.48,
  },
  list: {
    paddingBottom: 20,
  },
});

export default FIFScreen;
