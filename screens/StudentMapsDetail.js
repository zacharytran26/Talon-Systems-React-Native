import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Text, Layout, Divider, Card } from "@ui-kitten/components";
import { useAuth } from "./ThemeContext";
import { useRoute } from "@react-navigation/native";

const StudentMapDetails = ({ navigation }) => {
  const route = useRoute();
  const { units, lesson } = route.params;
  const [lineItem, setLineItem] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUnits, setFilteredUnits] = useState(units);
  const { authUser } = useAuth();

  useEffect(() => {
    if (units && units.length > 0) {
      fetchLineItem(units[0].id); // Fetch line item for the first unit as an example
    }
  }, [units]);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredUnits(units);
    } else {
      const filtered = units.filter((unit) =>
        unit.unit.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUnits(filtered);
    }
  }, [searchQuery, units]);

  const fetchLineItem = async (unitId) => {
    try {
      const response = await fetch(
        `${authUser.host}` +
          `content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=getcoursemapli&etamobilepro=1&nocache=n&persid=${authUser.currpersid}&currlvl4id=${unitId}`
      );
      const data = await response.json();
      setLineItem(data);
    } catch (error) {
      console.log("Error fetching line item:", error);
    }
  };

  const handlePress = async (unitId) => {
    await fetchLineItem(unitId); // Fetch the line items
    navigation.navigate("LineItem", { data: lineItem }); // Pass the fetched data to the LineItem screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search units..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <Divider />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Layout style={styles.content} level="1">
          {filteredUnits.map((unit, index) => (
            <View key={index}>
              <Card style={styles.unitCard}>
                <Text category="s1">{unit.unit}</Text>
                <TouchableOpacity
                  onPress={() => {
                    handlePress(unit.id);
                  }}
                  style={styles.button}
                >
                  <Text status="primary" style={styles.buttonText}>
                    View Line Items
                  </Text>
                </TouchableOpacity>
              </Card>
            </View>
          ))}
        </Layout>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9fc",
  },
  searchContainer: {
    padding: 16,
    backgroundColor: "#f7f9fc",
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 8,
    borderColor: "#E4E9F2",
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f7f9fc",
  },
  unitCard: {
    marginBottom: 16,
  },
  button: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#3366FF",
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
  },
});

export default StudentMapDetails;
