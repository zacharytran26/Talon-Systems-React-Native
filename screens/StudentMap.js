import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, ScrollView } from "react-native";
import { ListItem, Icon } from "@rneui/themed";
import { useAuth } from "./ThemeContext";
import { useRoute } from "@react-navigation/native";

const StudentMap = ({ navigation }) => {
  const route = useRoute();
  const { course } = route.params;
  const [stages, setStages] = useState([]);
  const { authUser } = useAuth();

  useEffect(() => {
    fetchMap();
  }, []);

  const fetchMap = async () => {
    try {
      const response = await fetch(
        `${authUser.host}` +
          `content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=getcoursemap&etamobilepro=1&nocache=n&persid=${authUser.currpersid}&persregid=${course.ID}`
      );
      const data = await response.json();
      setStages(data.stages);
    } catch (error) {
      console.error("Error fetching map data:", error);
    }
  };

  const handlePress = (units, lesson) => {
    navigation.navigate("StudentMapDetails", { units, lesson });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {stages.map((stage, stageIndex) => (
          <ListItem.Accordion
            key={stageIndex}
            content={
              <>
                <ListItem.Content>
                  <ListItem.Title>{stage.stage}</ListItem.Title>
                </ListItem.Content>
              </>
            }
            isExpanded={stage.isExpanded}
            onPress={() => {
              setStages((prevStages) =>
                prevStages.map((s, index) =>
                  index === stageIndex ? { ...s, isExpanded: !s.isExpanded } : s
                )
              );
            }}
          >
            {stage.lessons.map((lesson, lessonIndex) => (
              <ListItem
                key={lessonIndex}
                bottomDivider
                onPress={() => handlePress(lesson.units, lesson)}
              >
                <ListItem.Content>
                  <ListItem.Title>{lesson.lesson}</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            ))}
          </ListItem.Accordion>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F7F9FC",
  },
});

export default StudentMap;
