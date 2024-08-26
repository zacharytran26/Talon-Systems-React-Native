import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  SafeAreaView,
  View,
  Alert,
  StatusBar,
} from "react-native";
import { Layout, Text, Spinner, Card } from "@ui-kitten/components";
import { useAuth } from "./ThemeContext";
import { FlashList } from "@shopify/flash-list";

const MyIssues = () => {
  const [myissues, setMyIssues] = useState([]);
  const [issuecount, setIssueCount] = useState(0);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { authUser } = useAuth();

  useEffect(() => {
    FetchIssues();
  }, []);

  const FetchIssues = async () => {
    setLoading(true);
    const url = `${authUser.host}content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=getissues&etamobilepro=1&nocache=n&persid=${authUser.currpersid}`;
    try {
      const response = await fetch(url);
      const text = await response.text();
      const data = JSON.parse(text);
      setMyIssues(data.issues);
      setIssueCount(data.issues.length);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await FetchIssues();
  };

  const RenderIssue = ({ item }) => (
    <Card
      style={styles.card}
      header={() => (
        <View style={[styles.cardHeader]}>
          <Text style={styles.cardHeaderText}>Issue {item.id}</Text>
        </View>
      )}
    >
      <Text category="p1" style={styles.message}>
        {item.issue}
      </Text>
    </Card>
  );

  if (loading && !refreshing) {
    return (
      <Layout style={styles.loadingContainer}>
        <Spinner size="giant" />
      </Layout>
    );
  }

  const filteredIssues = myissues.filter((issue) =>
    issue.issue.toLowerCase().includes(filter.toLowerCase())
  );

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
        </View>
        <Text category="h5" style={styles.counterText}>
          Issues: {issuecount}
        </Text>

        <View style={{ flex: 1 }}>
          <FlashList
            data={filteredIssues}
            renderItem={RenderIssue}
            keyExtractor={(item) => item.id.toString()} // Ensure unique key
            refreshing={refreshing}
            onRefresh={handleRefresh}
            contentContainerStyle={styles.list}
            estimatedItemSize={129}
          />
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
  list: {
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    justifyContent: "space-between",
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
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
  },
});

export default MyIssues;
