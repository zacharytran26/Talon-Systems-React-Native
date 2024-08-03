import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, View, FlatList } from "react-native";
import { Layout, Text, Button, Card, Icon } from "@ui-kitten/components";
import { SelectList } from "react-native-dropdown-select-list";
import { Swipeable } from "react-native-gesture-handler";
import { useAuth } from "./ThemeContext";

const TimeIcon = (props) => <Icon {...props} name="clock-outline" />;

const ApproveIcon = (props) => (
  <Icon {...props} name="checkmark-circle-outline" />
);

const PendingAuth = ({ navigation }) => {
  const [requests, setRequests] = useState([]);
  const [filterByTeam, setFilterByTeam] = useState("");
  const { authUser } = useAuth();

  const fetchAuths = async () => {
    try {
      //const response = fetch(`${authUser.host}` + `content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=getpendingauthorization&etamobilepro=1&nocache=n&persid=${authUser.currpersid}`);
      const response = await Promise.resolve({
        AdminReq: [
          {
            id: 1,
            title: "Admin Request 1.0 hours ",
            description: "Admin Test request type needs authorization",
            reqdate: "18 May 2024",
            times: [
              {
                eventstart: "20:00",
                brief: "0",
                activitystart: "20:00",
                duration: "1.0",
                activitystop: "21:00",
                debrief: "0",
                eventstop: "21:00",
              },
            ],
            reason: "IP Proficiency",
            Status: "Pend Auth",
            submission: "17 May 2024",
            by: "Darumple, E",
            resource: "C172SP",
            team: "Flight A ",
            type: "AdminReq",
          },
        ],
        CourseReq: [
          {
            id: 2,
            title: "Course Request 1.0 hours ",
            description: "Course Test request type needs authorization",
            reqdate: "19 May 2024",
            times: [
              {
                eventstart: "20:00",
                brief: "0",
                activitystart: "20:00",
                duration: "1.0",
                activitystop: "21:00",
                debrief: "0",
                eventstop: "21:00",
              },
            ],
            reason: "IP Proficiency",
            Status: "Pend Auth",
            submission: "12 May 2024",
            by: "Darumple, E",
            resource: "C172SPY",
            team: "Flight B ",
            type: "CourseReq",
          },
        ],
      });
      const combinedRequests = [...response.AdminReq, ...response.CourseReq];
      setRequests(combinedRequests);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAuths();
  }, []);

  const handlePress = (times) => {
    navigation.navigate("Times", { times });
  };

  const handlePressAuth = (request) => {
    navigation.navigate("Auth", { request });
  };

  const RightActions = ({ item }) => (
    <View style={styles.rightActionContainer}>
      <Button
        style={styles.actionButton}
        appearance="ghost"
        accessoryLeft={TimeIcon}
        onPress={() => handlePress(item.times)}
      />
      <Button
        style={styles.actionButton}
        appearance="ghost"
        accessoryLeft={ApproveIcon}
        onPress={() => handlePressAuth(item)}
      />
    </View>
  );

  const RenderAuth = ({ item }) => (
    <Swipeable renderRightActions={() => RightActions({ item })}>
      <Card
        style={styles.card}
        header={() => (
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>{item.title}</Text>
          </View>
        )}
      >
        <Text>Description: {item.description}</Text>
        <Text>Status: {item.Status}</Text>
        <Text>Submission: {item.submission}</Text>
        <Text>By: {item.by}</Text>
        <Text>Resource: {item.resource}</Text>
        <Text>Type: {item.type}</Text>
      </Card>
    </Swipeable>
  );

  const filteredRequests = filterByTeam
    ? requests.filter((request) => request.team === filterByTeam)
    : requests;

  return (
    <Layout style={styles.container}>
      <SafeAreaView>
        <SelectList
          data={[
            { key: "", value: "All Teams" },
            ...Array.from(new Set(requests.map((request) => request.team))).map(
              (team) => ({ key: team, value: team })
            ),
          ]}
          setSelected={setFilterByTeam}
          placeholder="Select a team"
          boxStyles={styles.selectListBox}
          value={filterByTeam}
        />
        <FlatList
          data={filteredRequests}
          renderItem={RenderAuth}
          keyExtractor={(item) => item.id.toString()}
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
  selectListBox: {
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  rightActionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    marginHorizontal: 5,
  },
  card: {
    marginVertical: 8,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
});

export default PendingAuth;
