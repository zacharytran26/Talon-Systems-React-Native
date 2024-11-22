import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Modal,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import {
  Layout,
  Text,
  Card,
  Spinner,
  Button,
  Icon,
} from "@ui-kitten/components";
import { FlashList } from "@shopify/flash-list";
import { useAuth } from "./ThemeContext";
import DateTimePicker from "@react-native-community/datetimepicker";

const LeftIcon = (evaProps) => <Icon {...evaProps} name="arrow-left" />;
const RightIcon = (evaProps) => <Icon {...evaProps} name="arrow-right" />;

const TimelineCalendarScreen = () => {
  const [filter, setFilter] = useState("");
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);

  const { authUser } = useAuth();

  // Fetch calendar data
  const fetchCalData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${authUser.host}content?module=home&page=m&reactnative=1&uname=${
          authUser.uname
        }&password=${authUser.upwd}&customer=eta${authUser.schema}&session_id=${
          authUser.sessionid
        }&mode=getactivities&etamobilepro=1&nocache=${
          Math.random().toString().split(".")[1]
        }&persid=${authUser.currpersid}`
      );

      const textData = await response.text();
      let jsonData;

      try {
        jsonData = JSON.parse(textData);
      } catch (parseError) {
        const jsonStart = textData.indexOf("{");
        const jsonEnd = textData.lastIndexOf("}") + 1;
        const jsonString = textData.substring(jsonStart, jsonEnd);
        jsonData = JSON.parse(jsonString);
      }

      const fetchedActivities = jsonData.activities.map((item) => ({
        id: item.id || Math.random().toString(36).slice(2, 10),
        title: item.summary || "No Title",
        description: item.details || "No Details",
        time: item.time || "Unknown Time",
      }));

      setActivities(fetchedActivities);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [authUser]);

  useEffect(() => {
    fetchCalData();
  }, [fetchCalData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCalData().then(() => setRefreshing(false));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const incrementDate = () => {
    setDate((prevDate) => new Date(prevDate.setDate(prevDate.getDate() + 1)));
  };

  const decrementDate = () => {
    setDate((prevDate) => new Date(prevDate.setDate(prevDate.getDate() - 1)));
  };

  const RenderActivity = ({ item }) => {
    return (
      <TouchableOpacity
        onLongPress={() => {
          setSelectedActivity(item);
          setPreviewVisible(true);
        }}
        activeOpacity={0.8}
      >
        <Card style={styles.card}>
          <Text style={styles.cardHeaderText}>{item.title}</Text>
          <Text style={styles.cardText}>{item.description}</Text>
          <Text style={styles.label}>Time: {item.time}</Text>
        </Card>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <Layout style={styles.container}>
        <Spinner />
      </Layout>
    );
  }

  return (
    <Layout style={styles.container}>
      <StatusBar />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.rowContainer}>
          <Button
            onPress={decrementDate}
            accessoryLeft={LeftIcon}
            appearance="ghost"
            style={styles.button}
          />
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.datepickerButton}
          >
            <Text style={styles.datepickerText}>{date.toDateString()}</Text>
          </TouchableOpacity>
          <Button
            onPress={incrementDate}
            accessoryRight={RightIcon}
            appearance="ghost"
            style={styles.button}
          />
        </View>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "inline" : "default"}
            onChange={handleDateChange}
          />
        )}
        <View style={styles.flashListContainer}>
          <FlashList
            data={activities.filter((activity) =>
              activity.title.toLowerCase().includes(filter.toLowerCase())
            )}
            renderItem={({ item }) => <RenderActivity item={item} />}
            keyExtractor={(item) => item.id.toString()}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            contentContainerStyle={styles.list}
            estimatedItemSize={100}
          />
        </View>

        {selectedActivity && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={previewVisible}
            onRequestClose={() => setPreviewVisible(false)}
          >
            <TouchableWithoutFeedback onPress={() => setPreviewVisible(false)}>
              <View style={styles.modalOverlay}>
                <TouchableOpacity style={styles.modalView}>
                  <Text style={styles.modalText}>
                    Title: {selectedActivity.title}
                  </Text>
                  <Text style={styles.modalText}>
                    Description: {selectedActivity.description}
                  </Text>
                  <Text style={styles.modalText}>
                    Time: {selectedActivity.time}
                  </Text>
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
    backgroundColor: "#f7f9fc",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#E4E9F2",
  },
  datepickerButton: {
    flex: 1,
    alignItems: "center",
  },
  datepickerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E3A59",
  },
  button: {
    paddingHorizontal: 8,
  },
  flashListContainer: {
    flex: 1,
  },
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeaderText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#2E3A59",
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: "#2E3A59",
  },
  label: {
    fontWeight: "600",
    color: "#8F9BB3",
  },
  list: {
    paddingBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
    color: "#2E3A59",
  },
});

export default TimelineCalendarScreen;
