import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, SafeAreaView, View } from "react-native";
import { Layout, Text, Button, Card, Icon } from "@ui-kitten/components";
import { SelectList } from "react-native-dropdown-select-list";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { useAuth } from "./ThemeContext";
import { FlashList } from "@shopify/flash-list";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";

const TimeIcon = (props) => <Icon {...props} name="clock-outline" />;
const ApproveIcon = (props) => (
  <Icon {...props} name="checkmark-circle-outline" />
);

const RenderAuth = React.memo(({ item, onPressTime, onPressAuth }) => {
  const isAdditionalRepeats = item.REQST_TYPE === "Additional Repeats";
  const isCompTime = item.REQST_TYPE === "Comp Time";

  return (
    <Swipeable
      renderRightActions={() => (
        <View style={styles.rightActionContainer}>
          <Button
            style={styles.actionButton}
            appearance="ghost"
            accessoryLeft={TimeIcon}
            onPress={() => onPressTime(item)}
          />
          <Button
            style={styles.actionButton}
            appearance="ghost"
            accessoryLeft={ApproveIcon}
            onPress={() => onPressAuth(item)}
          />
        </View>
      )}
    >
      <Card
        style={styles.card}
        header={() => (
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>
              {item.value} - {item.HOUR}
            </Text>
          </View>
        )}
      >
        <View style={styles.cardBody}>
          {isAdditionalRepeats && (
            <>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Reason:</Text> {item.REASON_DISNAME}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Comment:</Text> {item.REQST_CMNT}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Status:</Text> {item.STATUS_DISNAME}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Date Submitted:</Text>{" "}
                {item.SUBMIT_DATE}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>By:</Text> {item.BY}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Resource:</Text> {item.RES_TYPE}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Student:</Text> {item.STUD1_DISNAME}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Course:</Text> {item.S1COURSE}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Unit:</Text> {item.S1UNIT}
              </Text>
            </>
          )}

          {isCompTime && (
            <>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Request Date:</Text>{" "}
                {item.REQST_DATE}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Comment:</Text> {item.REQST_CMNT}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Reason:</Text> {item.REASON_DISNAME}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Status:</Text> {item.STATUS_DISNAME}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>By:</Text> {item.BY}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Student:</Text> {item.STUD1_DISNAME}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Date Submitted:</Text>{" "}
                {item.SUBMIT_DATE}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Resource:</Text> {item.RES_TYPE}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Student:</Text> {item.STUD1_DISNAME}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Course:</Text> {item.S1COURSE}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Unit:</Text> {item.S1UNIT}
              </Text>
            </>
          )}

          {!isAdditionalRepeats && !isCompTime && (
            <>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Description:</Text>{" "}
                {item.AUTH_REASON}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Status:</Text> {item.STATUS_DISNAME}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Submission:</Text> {item.SUBMIT_DATE}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>By:</Text> {item.BY}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Resource:</Text> {item.RES_TYPE}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Type:</Text>{" "}
                {item.REQST_TYPE_DISNAME}
              </Text>
            </>
          )}
        </View>
      </Card>
    </Swipeable>
  );
});

const PendingAuth = () => {
  const [requests, setRequests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filterByTeam, setFilterByTeam] = useState("");
  const [teams, setTeams] = useState([]);
  const route = useRoute();
  const navigation = useNavigation();
  const { authUser } = useAuth();

  useEffect(() => {
    fetchAuths();
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Check if the refreshList parameter is true
      if (route.params?.refreshList) {
        fetchAuths(); // Refresh the list
        navigation.setParams({ refreshList: false }); // Reset the parameter
      }
    }, [route.params?.refreshList])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAuths();
  };

  const sanitizeJSON = (str) => {
    return str.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
  };

  const fetchAuths = async () => {
    try {
      const response = await fetch(
        `${authUser.host}content?module=home&page=m&reactnative=1&uname=${
          authUser.uname
        }&password=${authUser.upwd}&customer=eta${authUser.schema}&session_id=${
          authUser.sessionid
        }&mode=getpendauth&etamobilepro=1&nocache=${
          Math.random().toString().split(".")[1]
        }&persid=${authUser.currpersid}`
      );

      const responseText = await response.text();
      const sanitizedResponseText = sanitizeJSON(responseText);
      const data = JSON.parse(sanitizedResponseText);

      const pendAuthData = data.pendauthdata.reduce(
        (acc, item) => {
          if (item.pendauths) {
            acc.pendauths = acc.pendauths.concat(
              item.pendauths.map((pendauth) => ({
                key: pendauth.ID,
                value: pendauth.REQST_TYPE_DISNAME,
                requestid: pendauth.ID,
                eventStop: pendauth.EVENT_STOP,
                eventStart: pendauth.EVENT_START,
                hour: pendauth.HOUR,
                debriefDur: pendauth.DEBRIEF_DUR,
                briefDur: pendauth.BRIEF_DUR,
                actDur: pendauth.ACT_DUR,
                actStart: pendauth.ACT_START,
                actStop: pendauth.ACT_STOP,
                scheduleid: pendauth.SCH_ACT_ID,
                ...pendauth,
              }))
            );
          }
          if (item.teams) {
            acc.teams = acc.teams.concat(
              item.teams.map((team) => ({
                key: team.ID,
                value: team.DIS,
              }))
            );
          }
          return acc;
        },
        { pendauths: [], teams: [] }
      );
      setRequests(pendAuthData.pendauths);
      setTeams(pendAuthData.teams);
    } catch (error) {
      console.error("Error fetching and parsing data:", error);
    }
  };

  const handlePressTime = useCallback(
    (item) => {
      const times = {
        eventStop: item.eventStop,
        eventStart: item.eventStart,
        hour: item.hour,
        debriefDur: item.debriefDur,
        briefDur: item.briefDur,
        actDur: item.actDur,
        actStart: item.actStart,
        actStop: item.actStop,
      };
      navigation.navigate("IssueStack", {
        screen: "IssueTimes",
        params: { times },
      });
    },
    [navigation]
  );

  const handlePressAuth = useCallback(
    (item) => {
      const ids = {
        duration: item.ACT_DUR,
        acttype: item.SCH_REQST_TYPE,
        value: item.value,
      };
      navigation.navigate("Auth", { ids });
    },
    [navigation]
  );

  const handleTeamSelect = useCallback((value) => {
    setFilterByTeam(value);
  }, []);

  const filteredRequests = filterByTeam
    ? requests.filter((request) => request.teamId === filterByTeam)
    : requests;

  return (
    <Layout style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <SelectList
          data={[{ key: "", value: "All Teams" }, ...teams]}
          setSelected={handleTeamSelect}
          placeholder={filterByTeam || "Select a team"}
          boxStyles={styles.selectListBox}
          value={filterByTeam}
        />
        <FlashList
          data={filteredRequests}
          onRefresh={handleRefresh}
          renderItem={({ item }) => (
            <RenderAuth
              item={item}
              onPressTime={handlePressTime}
              onPressAuth={handlePressAuth}
            />
          )}
          keyExtractor={(item) => item.key.toString()}
          contentContainerStyle={styles.list}
          estimatedItemSize={100}
        />
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  safeArea: {
    flex: 1,
    padding: 16,
  },
  cardHeader: {
    padding: 12,
    backgroundColor: "#b6daf2",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardHeaderText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  cardBody: {
    marginRight: 20,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 4,
    color: "#2E3A59",
  },
  label: {
    fontWeight: "600",
    color: "#8F9BB3",
  },
  selectListBox: {
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderColor: "#E4E9F2",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  list: {
    paddingBottom: 16,
  },
  rightActionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  actionButton: {
    marginHorizontal: 5,
  },
  card: {
    marginVertical: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
});

export default PendingAuth;
