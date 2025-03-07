import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import { Layout, Text, Spinner, Toggle } from "@ui-kitten/components";
import { useAuth } from "./ThemeContext";
import { FlashList } from "@shopify/flash-list";
import { SelectList } from "react-native-dropdown-select-list";

// Memoized Item Component
const StudentItem = React.memo(({ item, onPress }) => (
  <TouchableOpacity onPress={() => onPress(item)}>
    <View style={styles.listItemContainer}>
      <Text style={styles.listItemLabel}>{item.value}</Text>
      <Text style={styles.courseLabel}>Course: {item.course}</Text>
    </View>
  </TouchableOpacity>
));

const SectionHeader = ({ title }) => (
  <View style={styles.sectionHeaderContainer}>
    <Text style={styles.sectionHeaderLabel}>{title}</Text>
  </View>
);

const StudentsScreen = ({ navigation }) => {
  const [filter, setFilter] = useState("");
  const [students, setStudents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [filterByTeam, setFilterByTeam] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const { authUser } = useAuth();

  useEffect(() => {
    fetchStudents();
  }, [showActiveOnly]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const statusParam = showActiveOnly ? "" : "&status=completed";
      const response = await fetch(
        `${authUser.host}content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=getstudents&etamobilepro=1&nocache=n&persid=${authUser.currpersid}${statusParam}`
      );
      const text = await response.text();
      const data = JSON.parse(text);
      const studentData = data.studentdata.reduce(
        (acc, item) => {
          if (item.students) {
            acc.students = acc.students.concat(
              item.students.map((student) => ({
                key: student.id,
                value: student.disname,
                teamId: item.team_id,
                ...student,
              }))
            );
          }
          if (item.teams) {
            acc.teams = acc.teams.concat(
              item.teams.map((team) => ({
                key: team.id,
                value: team.disname,
              }))
            );
          }
          return acc;
        },
        { students: [], teams: [] }
      );

      setStudents(studentData.students);
      setTeams(studentData.teams);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchTeam = async (teamId) => {
    try {
      const response = await fetch(
        `${authUser.host}content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=getstudents&etamobilepro=1&nocache=n&persid=${authUser.currpersid}&teamid=${teamId}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching team data:", error);
      return null;
    }
  };

  const handleToggle = async () => {
    setShowActiveOnly(!showActiveOnly);
  };

  const handlePress = useCallback(
    (student) => {
      navigation.navigate("StudentDetailScreen", { detail: student });
    },
    [navigation]
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStudents();
  };

  const handleTeamSelect = async (teamId) => {
    setFilterByTeam(teamId);
    if (teamId) {
      const teamData = await fetchTeam(teamId);
      if (teamData) {
        const teamStudents = teamData.studentdata.reduce((acc, item) => {
          if (item.students) {
            acc = acc.concat(
              item.students.map((student) => ({
                key: student.id,
                value: student.disname,
                teamId: item.team_id,
                ...student,
              }))
            );
          }
          return acc;
        }, []);
        setStudents(teamStudents);
      }
    } else {
      await fetchStudents(); // Fetch all students if no team is selected
    }
  };

  const filteredStudents = students
    .filter((student) =>
      student.disname.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => a.disname.localeCompare(b.disname))
    .map((student) => ({
      key: student.id,
      value: student.disname,
      course: student.course,
      ...student,
    }));

  // Group students by first letter
  const groupedData = filteredStudents.reduce((acc, student) => {
    const firstLetter = student.value.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(student);
    return acc;
  }, {});

  // Convert grouped data into a flat array with section headers
  const sectionedData = Object.keys(groupedData)
    .sort()
    .reduce((acc, letter) => {
      acc.push({ type: "sectionHeader", title: letter });
      acc.push(...groupedData[letter]);
      return acc;
    }, []);

  if (loading && !refreshing) {
    return (
      <Layout style={styles.container}>
        <Spinner />
      </Layout>
    );
  }

  return (
    <Layout style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search students"
            value={filter}
            onChangeText={setFilter}
          />
          <Toggle
            checked={showActiveOnly}
            onChange={handleToggle}
            style={styles.toggle}
          >
            {showActiveOnly ? "Active" : "Completed"}
          </Toggle>
          <SelectList
            data={[{ key: "", value: "All Teams" }, ...teams]}
            setSelected={handleTeamSelect}
            placeholder={filterByTeam || "Select a team"}
            boxStyles={styles.selectListBox}
            value={filterByTeam}
          />
        </View>
        <View style={styles.listContainer}>
          <FlashList
            data={sectionedData}
            renderItem={({ item }) => {
              if (item.type === "sectionHeader") {
                return <SectionHeader title={item.title} />;
              }
              return <StudentItem item={item} onPress={handlePress} />;
            }}
            estimatedItemSize={50}
            keyExtractor={(item, index) =>
              item.type === "sectionHeader" ? `header-${item.title}` : item.key
            }
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        </View>
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
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    padding: 16,
    backgroundColor: "#f7f9fc",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 8,
    marginBottom: 8,
    backgroundColor: "white",
    borderColor: "#E4E9F2",
  },
  toggle: {
    marginBottom: 8,
  },
  selectListBox: {
    marginBottom: 8,
  },
  listContainer: {
    flex: 1,
    marginTop: 10,
  },
  listItemContainer: {
    padding: 16,
  },
  listItemLabel: {
    fontSize: 16,
  },
  courseLabel: {
    fontSize: 14,
    color: "#888",
  },
  sectionHeaderContainer: {
    backgroundColor: "#f0f0f0",
    padding: 8,
  },
  sectionHeaderLabel: {
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default StudentsScreen;
