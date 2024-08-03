import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  FlatList,
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

const AddIcon = (props) => <Icon {...props} name="plus-circle" />;

const QualiScreen = () => {
  const [quali, setQuali] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { authUser } = useAuth();

  useEffect(() => {
    fetchQuali();
  }, []);

  const fetchQuali = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${authUser.host}` +
          `content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=getqualification&etamobilepro=1&nocache=n&persid=${authUser.currpersid}`
      );
      const data = await response.json();
      console.log("Parsed Data:", data);
      setQuali(data.qualifications);
      console.log(quali);
    } catch (error) {
      console.error("Error fetching or parsing data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchQuali();
  };

  const renderRightActions = (progress, dragX, item) => (
    <View style={styles.rightActionContainer}>
      <Button
        style={styles.actionButton}
        appearance="ghost"
        accessoryLeft={AddIcon}
        onPress={() => console.log("Add icon pressed")}
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
          </View>
        )}
      >
        <Text category="s2" style={styles.from}>
          Award Date: {item.AWARD_DATE}
        </Text>
        <Text category="p1" style={styles.message}>
          Description: {item.DESCRP}
        </Text>
        <Text category="s1" style={styles.date}>
          By: {item.BY}
        </Text>
      </Card>
    </Swipeable>
  );

  if (loading && !refreshing) {
    return (
      <Layout style={styles.container}>
        <Spinner />
      </Layout>
    );
  }

  return (
    <Layout style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}></View>
        <FlatList
          data={quali}
          renderItem={renderQuali}
          keyExtractor={(item, index) => index.toString()} // Ensure the key is unique
          refreshing={refreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={styles.list}
        />
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  cardHeader: {
    padding: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardHeaderText: {
    color: "#170101", // Text color
    fontWeight: "bold",
  },
  from: {
    marginBottom: 8,
  },
  message: {
    marginBottom: 8,
  },
  date: {
    fontWeight: "bold",
  },
  list: {
    paddingBottom: 1,
  },
  rightActionContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  actionButton: {
    marginHorizontal: 5,
  },
});

export default QualiScreen;
