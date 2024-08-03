import React from "react";
import { StyleSheet, SafeAreaView, View, FlatList } from "react-native";
import { Layout, Text, Button, Card } from "@ui-kitten/components";

const Times = ({ route, navigation }) => {
  const { times } = route.params;

  const renderTimeItem = ({ item }) => (
    <Card style={styles.card}>
      <View style={styles.timeItem}>
        <Text category="h6">Event Start: {item.eventstart}</Text>
        <Text category="s1">Brief: {item.brief}</Text>
        <Text category="s1">Activity Start: {item.activitystart}</Text>
        <Text category="s1">Duration: {item.duration}</Text>
        <Text category="s1">Activity Stop: {item.activitystop}</Text>
        <Text category="s1">Debrief: {item.debrief}</Text>
        <Text category="s1">Event Stop: {item.eventstop}</Text>
      </View>
    </Card>
  );

  return (
    <Layout style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text category="h5" style={styles.title}>
            Event Times
          </Text>
        </View>
        <FlatList
          data={times}
          renderItem={renderTimeItem}
          keyExtractor={(item, index) => index.toString()}
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
    backgroundColor: "#f7f9fc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    marginRight: 8,
  },
  title: {
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    marginVertical: 8,
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  timeItem: {
    padding: 16,
  },
});

export default Times;
