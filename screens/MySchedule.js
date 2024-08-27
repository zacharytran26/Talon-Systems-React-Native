import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { TimelineCalendar } from "@howljs/calendar-kit";
import { useAuth } from "./ThemeContext";
import { useNavigation } from "@react-navigation/native";

const TimelineCalendarScreen = () => {
  const { authUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigation = useNavigation();

  const fetchCalData = useCallback(
    async (fromDate, toDate) => {
      try {
        const response = await fetch(
          `${authUser.host}content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=getactivities&etamobilepro=1&nocache=n&persid=${authUser.currpersid}&calstart=${fromDate}&calend=${toDate}`
        );

        const textData = await response.text();
        console.log(textData);
        let jsonData;

        try {
          jsonData = JSON.parse(textData);
        } catch (parseError) {
          const jsonStart = textData.indexOf("{");
          const jsonEnd = textData.lastIndexOf("}") + 1;
          const jsonString = textData.substring(jsonStart, jsonEnd);
          jsonData = JSON.parse(jsonString);
        }

        const fetchedEvents = jsonData.activities.map((item) => ({
          id: Math.random().toString(36).slice(2, 10),
          start: new Date(item.start),
          end: new Date(item.end),
          //title: `${item.subtype} with ${item.s1} (Unit: ${item.u1})\nInstructor: ${item.pic}\nStatus: ${item.status}`,
          title: "123",
          summary: item.summary,
          color: item.color,
          ...item,
        }));

        return fetchedEvents;
      } catch (error) {
        console.error("Fetching or parsing error:", error);
        return [];
      }
    },
    [authUser]
  );

  const loadEventsForDateRange = useCallback(
    async (fromDate, toDate) => {
      setIsLoading(true);
      const events = await fetchCalData(
        fromDate.toISOString().split("T")[0],
        toDate.toISOString().split("T")[0]
      );
      setEvents(events);
      setIsLoading(false);
    },
    [fetchCalData]
  );

  useEffect(() => {
    const numOfDays = 7;
    const fromDate = new Date();
    const toDate = new Date();
    toDate.setDate(fromDate.getDate() + numOfDays);

    loadEventsForDateRange(fromDate, toDate);
  }, [authUser, loadEventsForDateRange]);

  const handlePress = useCallback(
    (event) => {
      navigation.navigate("Activity", {
        activity: {
          ...event,
          start: event.start,
          end: event.end,
        },
      });
    },
    [navigation]
  );

  const handleLongPress = useCallback((event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  }, []);

  const handlePressModal = useCallback(() => {
    if (selectedEvent) {
      navigation.navigate("Activity", {
        activity: {
          ...selectedEvent,
          start: selectedEvent.start,
          end: selectedEvent.end,
        },
      });
      closeModal(); // Close the modal after navigating
    }
  }, [navigation, selectedEvent]);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setSelectedEvent(null);
  }, []);

  const handleDateChanged = useCallback(
    (date) => {
      const fromDate = new Date(date);
      const toDate = new Date(date);
      toDate.setDate(toDate.getDate() + 6); // Fetch events for the next 6 days (including the selected date)

      loadEventsForDateRange(fromDate, toDate);
    },
    [loadEventsForDateRange]
  );

  const modalContent = useMemo(
    () => (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={styles.modalView}
              onPress={handlePressModal}
            >
              {selectedEvent && (
                <>
                  <Text style={styles.modalTitle}>{selectedEvent.subtype}</Text>
                  {selectedEvent.subtype === "Admin" ||
                  selectedEvent.subtype === "Rental" ? (
                    <Text style={styles.modalText}>
                      PIC: {selectedEvent.pic}
                    </Text>
                  ) : selectedEvent.subtype === "Refresher" ? (
                    <Text style={styles.modalText}>
                      Student: {selectedEvent.s1}
                    </Text>
                  ) : (
                    <>
                      <Text style={styles.modalText}>
                        Student 1: {selectedEvent.s1}
                      </Text>
                      <Text style={styles.modalText}>
                        Student 2: {selectedEvent.s2}
                      </Text>
                    </>
                  )}
                  <Text style={styles.modalText}>
                    Status: {selectedEvent.status}
                  </Text>
                  <Text style={styles.modalText}>{selectedEvent.summary}</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    ),
    [modalVisible, selectedEvent, closeModal, handlePressModal]
  );

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <TimelineCalendar
        viewMode="threeDays" //week //day
        events={events}
        isLoading={isLoading}
        onPressEvent={handlePress}
        onLongPressEvent={handleLongPress}
        onDateChanged={handleDateChanged}
        theme={{ loadingBarColor: "#D61C4E" }}
      />

      {modalContent}
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
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
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalText: {
    marginBottom: 10,
    textAlign: "center",
  },
});

export default TimelineCalendarScreen;
