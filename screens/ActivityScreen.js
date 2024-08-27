import React, { useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { Layout, Text, Card, Icon } from "@ui-kitten/components"; // Import Icon
import { useRoute, useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import * as Calendar from "expo-calendar";

const Activity = () => {
  const route = useRoute();
  const { activity } = route.params;

  useEffect(() => {
    requestCalendarPermissions();
  }, []);

  const requestCalendarPermissions = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Calendar permission is required to add events. Please enable it in the settings."
      );
      return false;
    }
    return true;
  };

  const getDefaultCalendarSource = async () => {
    if (Platform.OS === "ios") {
      const defaultCalendar = await Calendar.getDefaultCalendarAsync();
      return defaultCalendar.source;
    } else {
      return { isLocalAccount: true, name: "Expo Calendar" };
    }
  };

  const createCalendarEvent = async (title, startDate, endDate, notes) => {
    const calendarGranted = await requestCalendarPermissions();
    if (!calendarGranted) return;

    let calendarId;

    if (Platform.OS === "ios") {
      const defaultCalendarSource = await getDefaultCalendarSource();
      calendarId = await Calendar.createCalendarAsync({
        title: "My New Calendar",
        color: "blue",
        entityType: Calendar.EntityTypes.EVENT,
        sourceId: defaultCalendarSource.id,
        source: defaultCalendarSource,
        name: "My Internal Calendar",
        ownerAccount: "personal",
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
      });
    } else {
      const calendars = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
      );
      calendarId = calendars.find(
        (cal) => cal.accessLevel === Calendar.CalendarAccessLevel.OWNER
      )?.id;

      if (!calendarId) {
        Alert.alert("Error", "No suitable calendar found.");
        return;
      }
    }

    const eventId = await Calendar.createEventAsync(calendarId, {
      title: title,
      startDate: startDate,
      endDate: endDate,
      timeZone: "GMT", // Adjust this according to your needs
      notes: notes,
    });

    Alert.alert(
      "Event Created",
      `Event with ID ${eventId} created successfully!`
    );
  };

  const handleAddEvent = async () => {
    const startDate = new Date(activity.start);
    const endDate = new Date(activity.end);
    const title = activity.activitytype + "(" + activity.subtype + ")";
    const notes = activity.start + activity.end;
    await createCalendarEvent(title, startDate, endDate, notes);
  };

  const handleAuthEvent = async () => {
    navigation.navigate("ActivityApproval", {
      activity: { schactid, requestid },
    });
  };

  // Deserialize the Date objects
  const startDate = new Date(activity.start);
  const endDate = new Date(activity.end);
  const navigation = useNavigation();

  const handleInstructorPress = (instructorId, picid) => {
    navigation.navigate("InstructorActivity", {
      activity: { instructorId, picid },
    });
  };

  const RenderActivity = ({ item }) => (
    <View>
      <View style={styles.sectionContainer}>
        <Text category="h5" style={styles.sectionHeader}>
          Activity Details
        </Text>
      </View>
      <Card style={styles.card}>
        <TouchableOpacity onPress={handleAddEvent} style={styles.touchable}>
          <Icon name="calendar-outline" style={styles.icon} fill="#2E3A59" />
          <Text category="s1" style={styles.cardText}>
            Add to Calendar
          </Text>
        </TouchableOpacity>
      </Card>

      <Card style={styles.card}>
        <TouchableOpacity onPress={handleAuthEvent} style={styles.touchable}>
          <Icon name="unlock-outline" style={styles.icon} fill="#2E3A59" />
          <Text category="s1" style={styles.cardText}>
            Authorize
          </Text>
        </TouchableOpacity>
      </Card>

      <Card style={styles.card}>
        <TouchableOpacity
          onPress={() => handleInstructorPress(item.instructor, item.picid)}
          style={styles.touchable}
        >
          <Icon name="person-outline" style={styles.icon} fill="#2E3A59" />
          <Text category="s1" style={styles.cardText}>
            PIC: {item.pic}
          </Text>
        </TouchableOpacity>
      </Card>

      <Card style={styles.card}>
        <Text category="s1" style={styles.cardText}>
          Status: {item.status}
        </Text>
      </Card>

      <Card style={styles.card}>
        <Text category="s1" style={styles.cardText}>
          Activity Type: {item.activitytype}
        </Text>
      </Card>

      <Card style={styles.card}>
        <Text category="s1" style={styles.cardText}>
          Resource Type: {item.resourcetype}
        </Text>
      </Card>

      <View style={styles.sectionContainer}>
        <Text category="h5" style={styles.sectionHeader}>
          Times
        </Text>
      </View>

      <Card style={styles.card}>
        <Text category="s1" style={styles.cardText}>
          Event Start: {startDate.toLocaleString()}
        </Text>
      </Card>

      <Card style={styles.card}>
        <Text category="s1" style={styles.cardText}>
          Activity Start: {startDate.toLocaleString()}
        </Text>
      </Card>

      <Card style={styles.card}>
        <Text category="s1" style={styles.cardText}>
          Activity Stop: {endDate.toLocaleString()}
        </Text>
      </Card>

      <Card style={styles.card}>
        <Text category="s1" style={styles.cardText}>
          Event Stop: {endDate.toLocaleString()}
        </Text>
      </Card>

      <Card style={styles.card}>
        <Text category="s1" style={styles.cardText}>
          Activity Duration: {activity.DURATION}
        </Text>
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
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  sectionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#E5E9F2",
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    fontWeight: "bold",
    color: "#2E3A59",
    fontSize: 20,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  cardText: {
    color: "#2E3A59",
    fontSize: 16,
  },
  touchable: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
});

export default Activity;
