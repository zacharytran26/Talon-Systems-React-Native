import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, View, TextInput, FlatList } from 'react-native';
import { Layout, Text, Button, Spinner } from '@ui-kitten/components';
import Pagination from "@cherry-soft/react-native-basic-pagination";

const CurrencyScreen = ({ navigation }) => {
  const [page, setPage] = useState(1);
  const [currencies, setCurrencies] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchCurrencies = async () => {
    setLoading(true);
    try { 
      const response = await fetch(`${authUser.host}`+'content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=606327&customer=eta0000&mode=getcurrency&etamobilepro=1&nocache=n&persid=970'); // Replace with your API endpoint
      const text = await response.text();
      console.log('Response Text:', text); // Log the raw response text
      setCurrencies(text);
      console.log(text);

      // Validate JSON format
    } catch(error){
      console.error(error);
    } finally{
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCurrencies();
  };


  // const filteredCurrencies = currencies.filter(currency =>
  //   currency.descrip.toLowerCase().includes(filter.toLowerCase()) &&
  //   (!showNewOnly || currency.isNew)
  // );

  const renderCurrency = ({ item }) => (
    <Layout style={styles.messageContainer}>
      <View style={styles.messageHeader}>
        <Text category='s1' style={styles.date}>Expiration Date: {item.name}</Text>
      </View>
      <Text category='s2' style={styles.from}>Award Date: {item.award}</Text>
      <Text category='p1' style={styles.message}>Duration: {item.duration}</Text>
      <Text category='p1' style={styles.message}>Description: {item.descrip}</Text>
      <Text category='s1' style={styles.date}>By: {item.by}</Text>
    </Layout>
  );

  if (loading && !refreshing) {
    return (
      <Layout style={styles.container}>
        <Spinner />
      </Layout>
    );
  }

  return (

    <Layout style={styles.container}>
      <Pagination
      totalItems={100}
      pageSize={5}
      currentPage={page}
      onPageChange={setPage}
    />
      <SafeAreaView>
        <View style={styles.header}>
          <Button size='small' appearance='ghost' style={styles.backButton} onPress={() => navigation.goBack()}>Back</Button>
          <Text category='h5' style={styles.title}>Currencies</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Search"
          value={filter}
          onChangeText={setFilter}
        />
        <FlatList
          data={currencies}
          renderItem={renderCurrency}
          keyExtractor={item => item.id} // Ensure the key is unique
          refreshing={refreshing}
          onRefresh={handleRefresh}
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    paddingLeft: 8,
  },
  toggle: {
    marginBottom: 16,
  },
  messageContainer: {
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#e4e9f2',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontWeight: 'bold',
  },
  from: {
    marginBottom: 8,
  },
  message: {
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    marginRight: 8,
  },
  backButton: {
    marginRight: 8,
    paddingHorizontal: 0,
    paddingVertical: 0,
    height: 24,
    fontSize: 12,
  },
  list: {
    paddingBottom: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
});

export default CurrencyScreen;
