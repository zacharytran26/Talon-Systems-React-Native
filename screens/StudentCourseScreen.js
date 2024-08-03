import React, { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, View, FlatList } from "react-native";
import { Button, Layout, Text, Card } from "@ui-kitten/components";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAuth } from "./ThemeContext";

const StudentCourse = ({ navigation }) => {
  const route = useRoute();
  const { course } = route.params;
  const [units, setUnits] = useState([]);
  const [summary, setSummary] = useState({});
  const { authUser } = useAuth();

  const getGradeColor = (grade) => {
    switch (grade) {
      case "S":
        return "#98ec9c"; // Green for Satisfactory
      case "I":
        return "#f2c98c"; // Yellow for Incomplete
      case "F":
        return "#f28c8c"; // Red for Fail
      default:
        return "#cccccc"; // Grey for others
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      const querystring =
        `${authUser.host}` +
        `content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=getcoursedetails&etamobilepro=1&nocache=n&persid=${authUser.currpersid}&persregid=${course.persregid}`;
      const response = await fetch(querystring);
      console.log(querystring);
      const data = await response.json(); // Attempt to parse the JSON
      console.log(data);
      //const response = //await Promise.resolve({
      //     completed: 6,
      //     repeated: 0,
      //     incomplete:2,
      //     remaining:1,
      //     failures:0,
      //     noshow: 0,
      //    unit:[{ title: 'Type Rtg Training 1', date: '15 Feb 2011', grade: 'S', inst: 'Cox.R', status: 'completed' },
      //    { title: 'Type Rtg Training 1', date: '07 Apr 2011', grade: 'S', inst: 'Des.M', status: 'cancelled', reason: 'T-storm' },
      //    { title: 'Type Rtg Training 7', date: '18 Jul 2013', grade: 'I', inst: 'Abbott.J', status: 'completed' },
      //    { title: 'Type Rtg Training 8', date: '18 Jul 2019', grade: 'I', inst: 'McCloud.S', status: 'scheduled' },
      //    { title: 'Type Rtg Training 8', date: '18 Jul 2019', grade: 'F', inst: 'McCloud.S', status: 'scheduled' },
      //    { title: 'Type Rtg Training 8', date: '18 Jul 2019', grade: 'F', inst: 'McCloud.S', status: 'scheduled' }]
      // });
      //{"attempt": "15", "completed": "11", "failures": "0", "incomplete": "0", "noshow": "0", "remaining": "0", "repeated": "4", "unit": [{"canreas": "", "date": "09 NOV 2011", "grade": "S", "inst": "Hardick,E.+", "pass": "1", "status": "Completed ", "title": "NHS U3 Sim#1"}]}
      // {"attempt": "15", "completed": "11", "failures": "0", "incomplete": "0", "noshow": "0", "remaining": "0", "repeated": "4", "unit": [{"canreas": "", "date": "09 NOV 2011", "grade": "S", "inst": "Hardick,E.+", "pass": "1", "status": "Completed ", "title": "NHS U3 Sim#1"}, {"canreas": "", "date": "21 DEC 2011", "grade": "S", "inst": "", "pass": "1", "status": "Completed ", "title": "NHS U4 Sim#2S"}, {"canreas": "", "date": "28 DEC 2011",
      // "grade": "S", "inst": "Eakin,M. ", "pass": "1", "status": "Completed ", "title": "NHS U5 Oral#3"}, {"canreas": "", "date": "17 JAN 2012", "grade": "S", "inst": "Woodrow,B.", "pass": "1", "status": "Completed ", "title": "NHS U6 Sim#3"}, {"canreas": "", "date": "13 MAR 2012", "grade": "", "inst": "", "pass": "", "status": "Completed ", "title": "NHS U1 Acad#1"}, {"canreas": "", "date": "01 MAR 2013", "grade": "S", "inst": "Hardick,E.+", "pass": "1", "status": "Completed ", "title": "NHS U3 Sim#1 (REPEAT)"}, {"canreas": "",
      // "date": "01 MAR 2013", "grade": "S", "inst": "Hardick,E.+", "pass": "1", "status": "Completed ", "title": "NHS U1 Acad#1"}, {"canreas": "", "date": "04 MAR 2013", "grade": "S", "inst": "Hardick,E.+", "pass": "1", "status": "Completed ", "title": "NHS U6 Sim#3 (REPEAT)"}, {"canreas": "Standdown", "date": "29 MAR 2013", "grade": "", "inst": "", "pass": "", "status": "Cancelled ", "title": "NHS U7 Sim#4S"}, {"canreas": "", "date": "15 APR 2013", "grade": "S", "inst": "", "pass": "1", "status": "Completed ", "title": "NHS U7 Sim#4S"}, {"canreas": "", "date": "23 APR 2013", "grade": "S", "inst": "Hardick,E.+", "pass": "1", "status": "Completed ", "title": "NHS U8 Oral#4"}, {"canreas": "", "date": "25 APR 2013", "grade": "S", "inst": "Hardick,E.+",
      // "pass": "1", "status": "Completed ", "title": "NHS U9 Sim#5"}, {"canreas": "", "date": "30 APR 2013", "grade": "S", "inst": "Lee,S. *", "pass": "1", "status": "Completed ", "title": "NHS U10 Oral5Ck"}, {"canreas": "", "date": "30 APR 2013", "grade": "S", "inst": "shershaby,A.+", "pass": "1", "status": "Completed ", "title": "NHS U2 Acad#2"}, {"canreas": "Thunderstorms", "date": "02 JUN 2013", "grade": "", "inst": "Hardick,E.+", "pass": "", "status": "Cancelled ", "title": "NHS U6 Sim#3"},
      // {"canreas": "Thunderstorms", "date": "02 JUN 2013", "grade": "", "inst": "Hardick,E.+", "pass": "", "status": "Cancelled ", "title": "NHS U3 Sim#1"}, {"canreas": "", "date": "29 JUN 2013", "grade": "S", "inst": "Hardick,E.+", "pass": "1", "status": "Completed ", "title": "NHS U2 Acad#2 (REPEAT)"}, {"canreas": "", "date": "10 JUL 2013", "grade": "S", "inst": "Hardick,E.+", "pass": "1", "status":
      // "Completed ", "title": "NHS U11 SimCk#6"}, {"canreas": "", "date": "15 JUL 2013", "grade": "S", "inst": "Briggs,J.+", "pass": "1", "status": "Completed ", "title": "NHS U8 Oral#4 (REPEAT)"}, {"canreas": "", "date": "16 DEC 2020", "grade": "", "inst": "Duser,D.+", "pass": "", "status": "Pend Sim ", "title": "NHS U6 Sim#3 (REPEAT)"}]}

      setUnits(data.unit);
      setSummary({
        completed: data.completed,
        repeated: data.repeated,
        incomplete: data.incomplete,
        remaining: data.remaining,
        failures: data.failures,
        noshow: data.noshow,
      });
    } catch (error) {
      console.error("Error fetching units:", error);
    }
  };

  const renderUnit = ({ item }) => (
    <Card
      style={styles.card}
      header={() => (
        <View
          style={[
            styles.cardHeader,
            { backgroundColor: getGradeColor(item.grade) },
          ]}
        >
          <Text style={styles.cardHeaderText}>{item.title}</Text>
        </View>
      )}
    >
      <Text>Date: {item.date}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Grade: {item.grade}</Text>
      <Text>Inst: {item.inst}</Text>
      {item.reason && <Text>Reason: {item.reason}</Text>}
    </Card>
  );

  return (
    <Layout style={styles.container}>
      <SafeAreaView>
        <Text style={styles.body}>Completed Units:{summary.completed}</Text>
        <Text style={styles.body}>Units Repeated:{summary.repeated}</Text>
        <Text style={styles.body}>Incomplete Units:{summary.incomplete}</Text>
        <Text style={styles.body}>Remaining Units:{summary.remaining}</Text>
        <Text style={styles.body}>Unit Failures:{summary.failures}</Text>
        <Text style={styles.body}>No Shows:{summary.noshow}</Text>

        <FlatList
          data={units}
          renderItem={renderUnit}
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
  },
  cardHeader: {
    padding: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardHeaderText: {
    color: "#ffffff", // Text color
    fontWeight: "bold",
  },
  date: {
    marginVertical: 8,
    fontWeight: "bold",
  },
  from: {
    marginVertical: 8,
  },
  subject: {
    marginVertical: 8,
    fontWeight: "bold",
  },
  body: {
    marginVertical: 8,
  },
  backButton: {
    marginRight: 8,
    paddingHorizontal: 0,
    paddingVertical: 0,
    height: 24,
    fontSize: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  list: {
    paddingBottom: 200,
  },
});

export default StudentCourse;
