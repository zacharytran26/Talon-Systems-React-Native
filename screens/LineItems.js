import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import {
  List,
  ListItem,
  Input,
  Layout,
  Divider,
  Icon,
} from "@ui-kitten/components";
import { useRoute } from "@react-navigation/native";

const SearchIcon = (props) => <Icon {...props} name="search-outline" />;

const LineItem = () => {
  const route = useRoute();
  const { data } = route.params;

  console.log("Received lineitems:", data); // Debugging log

  const [filter, setFilter] = useState("");
  const [filteredLineItems, setFilteredLineItems] = useState(data.lineitems);

  useEffect(() => {
    if (data.lineitems && data.lineitems.length > 0) {
      setFilteredLineItems(
        data.lineitems.filter((item) =>
          item.lineitem.toLowerCase().includes(filter.toLowerCase())
        )
      );
    }
  }, [filter, data.lineitems]);

  const renderLineItem = ({ item }) => (
    <ListItem
      title={item.lineitem}
      description={item.description || "No description"} // Adjust as needed
      accessoryLeft={(props) => (
        <Icon {...props} name="arrow-forward-outline" />
      )}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Layout style={styles.header} level="1">
        <Input
          placeholder="Search items"
          value={filter}
          onChangeText={setFilter}
          accessoryRight={SearchIcon}
          style={styles.input}
        />
      </Layout>
      <Divider />
      <List
        data={filteredLineItems}
        renderItem={renderLineItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
});

export default LineItem;
