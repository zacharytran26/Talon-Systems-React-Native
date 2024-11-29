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
import { AgendaList } from "react-native-calendars";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const LeftIcon = (evaProps) => <Icon {...evaProps} name="arrow-left" />;
const RightIcon = (evaProps) => <Icon {...evaProps} name="arrow-right" />;

const TimelineCalendarScreen = () => {
  const navigation = useNavigation();
  const [filter, setFilter] = useState("");
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [schedDate, setSchedDate] = useState(new Date());
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
        }&persid=${authUser.currpersid}&scheddate=${schedDate}`
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

      // const fetchedActivities = (jsonData.activities || []).map((item) => ({
      //   id: item.id || Math.random().toString(36).slice(2, 10),
      //   title: item.title || "Untitled Activity",
      //   status: item.status || "Unknown Status",
      //   acttype: item.activitytype || "Unknown Type",
      //   actsubtype: item.subtype || "Unknown Subtype",
      //   label:
      //     item.activitytype === "Flight"
      //       ? "Aircraft"
      //       : item.activitytype === "Sim"
      //       ? "Sim"
      //       : "Resource",
      //   resource: item.resource || item.resourcetype || "Unknown Resource",
      //   pic: item.pic || "No PIC",
      //   s1: item.s1 || "No Student",
      //   s2: item.s2 || "No Second Student",
      // }));

      console.log(jsonData);
      setActivities(jsonData.activities);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [authUser, schedDate]);

  useFocusEffect(
    useCallback(() => {
      fetchCalData();
    }, [fetchCalData])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCalData().then(() => setRefreshing(false));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSchedDate(selectedDate);
    }
    handleRefresh();
  };

  const incrementDate = () => {
    setSchedDate(
      (prevDate) => new Date(prevDate.setDate(prevDate.getDate() + 1))
    );
    handleRefresh();
  };

  const decrementDate = () => {
    setSchedDate(
      (prevDate) => new Date(prevDate.setDate(prevDate.getDate() - 1))
    );
    handleRefresh();
  };

  const openActivityDetails = (activity) => {
    navigation.navigate("HomeStack", {
      screen: "Activity",
      params: { activity },
    });
  };
  const openStudentDetails = (detail) => {
    navigation.navigate("HomeStack", {
      screen: "StudentDetailScreen",
      params: { detail },
    });
  };
  const openInstructorDetails = (detail) => {
    navigation.navigate("HomeStack", {
      screen: "InstructorDetailScreen",
      params: { detail },
    });
  };

  const RenderActivity = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => openActivityDetails(item)}
        onLongPress={() => {
          setSelectedActivity(item);
          setPreviewVisible(true);
        }}
        activeOpacity={0.8}
        style={styles.cardContainer}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardHeaderText}>{item.title}</Text>
        </View>
        <View style={styles.cardBody}>
          {item.actsubtype === "Rental" || item.actsubtype === "Admin" ? (
            <TouchableOpacity onPress={() => openInstructorDetails(item)}>
              <Text style={styles.cardTextNav}>
                <Text style={styles.label}>PIC:</Text> {item.pic}
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity onPress={() => openStudentDetails(item.id)}>
                <Text style={styles.cardTextNav}>
                  <Text style={styles.label}>Student:</Text> {item.s1}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => openInstructorDetails(item.picid)}
              >
                <Text style={styles.cardTextNav}>
                  <Text style={styles.label}>Instructor:</Text> {item.pic}
                </Text>
              </TouchableOpacity>
            </>
          )}
          <Text style={styles.cardText}>
            <Text style={styles.label}>Type:</Text> {item.activitytype}(
            {item.subtype})
          </Text>
          <Text style={styles.cardText}>
            <Text style={styles.label}>Status:</Text> {item.status}
          </Text>
          <Text style={styles.cardText}>
            {/* <Text style={styles.label}>{item.label}:</Text> {item.resource} */}
          </Text>
        </View>
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
            <Text style={styles.datepickerText}>
              {schedDate.toDateString()}
            </Text>
          </TouchableOpacity>
          <Button
            onPress={incrementDate}
            accessoryRight={RightIcon}
            appearance="ghost"
            style={styles.button}
          />
        </View>
        {showDatePicker && (
          <View style={styles.datePickerWrapper}>
            <DateTimePicker
              value={schedDate}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={handleDateChange}
            />
          </View>
        )}
        <View style={styles.flashListContainer}>
          <FlashList
            data={activities}
            renderItem={({ item }) => (
              <RenderActivity item={item} navigation={navigation} />
            )}
            keyExtractor={(item) =>
              item.id ? item.id.toString() : Math.random().toString()
            }
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
                    Title: {selectedActivity?.title || "No Title"}
                  </Text>
                  <Text style={styles.modalText}>
                    Description:{" "}
                    {selectedActivity?.description || "No Description"}
                  </Text>
                  <Text style={styles.modalText}>
                    Time: {selectedActivity?.time || "No Time"}
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
  datePickerWrapper: {
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
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
  },
  button: {
    paddingHorizontal: 8,
  },
  flashListContainer: {
    flex: 1,
  },
  cardContainer: {
    margin: 10,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cardHeader: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 10,
  },
  cardHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  cardBody: {
    flexDirection: "column",
  },
  cardText: {
    marginVertical: 5,
    fontSize: 14,
    color: "#555",
  },
  cardTextNav: {
    marginVertical: 5,
    fontSize: 14,
    color: "#3366FF",
  },
  label: {
    fontWeight: "bold",
    color: "#333",
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
