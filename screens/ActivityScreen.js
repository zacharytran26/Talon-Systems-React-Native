import React from "react";
import { StyleSheet, SafeAreaView, View, TouchableOpacity } from "react-native";
import { Layout, Text, Card } from "@ui-kitten/components";
import { useRoute } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { useNavigation } from "@react-navigation/native";

const Activity = () => {
  const route = useRoute();
  const { activity } = route.params; // Ensure the parameter name is 'activity'
  const navigation = useNavigation();

  const handleInstructorPress = () => {
    navigation.navigate("InstructorScreen", { instructorId });
  };

  const RenderActivity = ({ item }) => (
    <View>
      <Card style={styles.card}>
        <Text category="h2">Activity Details</Text>
        <View style={styles.timeItem}>
          <TouchableOpacity onPress={handleInstructorPress}>
            <Text category="h6">Instructor: {item.instructor}</Text>
          </TouchableOpacity>
        </View>
      </Card>
      <Card style={styles.card}>
        <Text category="h2">Times</Text>
        <View style={styles.timeItem}>
          <Text category="h6">Event Start: {item.start.toLocaleString()}</Text>
          <Text category="s1">Brief Duration: {item.briefDur}</Text>
          <Text category="s1">
            Activity Start: {item.start.toLocaleString()}
          </Text>
          <Text category="s1">Duration: {item.actDur}</Text>
          <Text category="s1">Activity Stop: {item.end.toLocaleString()}</Text>
          <Text category="s1">Debrief Duration: {item.debriefDur}</Text>
          <Text category="s1">Event Stop: {item.end.toLocaleString()}</Text>
        </View>
      </Card>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlashList
        data={[activity]} // Pass the activity data as an array
        renderItem={RenderActivity}
        keyExtractor={(item) => item.id}
        estimatedItemSize={100}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  card: { margin: 10 },
  timeItem: { padding: 10 },
});

export default Activity;
