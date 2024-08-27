import React from "react";
import { StyleSheet, SafeAreaView, View } from "react-native";
import { Layout, Text, Card } from "@ui-kitten/components";
import { useRoute } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";

const Times = () => {
  const route = useRoute();
  const { times } = route.params;

  const renderTimeItem = ({ item }) => (
    <View style={styles.timeItemContainer}>
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Event Start</Text>
        <Text style={styles.cardContent}>{item.eventStart}</Text>
      </Card>
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Brief Duration</Text>
        <Text style={styles.cardContent}>{item.briefDur}</Text>
      </Card>
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Activity Start</Text>
        <Text style={styles.cardContent}>{item.actStart}</Text>
      </Card>
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Duration</Text>
        <Text style={styles.cardContent}>{item.actDur}</Text>
      </Card>
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Activity Stop</Text>
        <Text style={styles.cardContent}>{item.actStop}</Text>
      </Card>
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Debrief Duration</Text>
        <Text style={styles.cardContent}>{item.debriefDur}</Text>
      </Card>
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Event Stop</Text>
        <Text style={styles.cardContent}>{item.eventStop}</Text>
      </Card>
    </View>
  );

  return (
    <Layout style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Event Times</Text>
        </View>
        <FlashList
          data={[times]}
          renderItem={renderTimeItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.list}
          estimatedItemSize={200}
        />
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
  header: {
    marginBottom: 16,
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#2E3A59",
  },
  list: {
    paddingBottom: 16,
  },
  timeItemContainer: {
    marginBottom: 16,
  },
  card: {
    marginVertical: 8,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontWeight: "600",
    fontSize: 16,
    color: "#8F9BB3",
    marginBottom: 4,
  },
  cardContent: {
    fontSize: 16,
    color: "#2E3A59",
  },
});

export default Times;
