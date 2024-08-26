import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import { StickyTable } from "react-native-sticky-table";
import { useAuth } from "./ThemeContext";

const LogScreen = () => {
  const [pilotTableData, setPilotTableData] = useState([]);
  const [widthArr, setWidthArr] = useState([]);
  const { authUser } = useAuth();

  useEffect(() => {
    fetchLog();
  }, []);

  const fetchLog = async () => {
    const url = `${authUser.host}content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=getpilotlog&etamobilepro=1&nocache=n&persid=${authUser.currpersid}`;
    try {
      const response = await fetch(url);
      const data = await response.text();
      const jsonData = JSON.parse(data);

      const processedPilotData = processPilotLogData(jsonData.pilotlogdata);

      setPilotTableData(processedPilotData);

      const calculatedWidths = [150, 100];
      setWidthArr(calculatedWidths);
    } catch (error) {
      console.log("Error fetching log data", error.message);
      Alert.alert("Error fetching log data", error.message);
    }
  };

  const processPilotLogData = (pilotlogdata) => {
    // Extract individual pilot logs data
    const pilotLogs = pilotlogdata[1].pilotlogs;

    // Convert each log entry to a format suitable for the table
    const tableDataArray = pilotLogs.map((log, index) => ({
      key: index.toString(), // Assign a unique key to each row
      data: [
        log.date,
        log.restype,
        log.res,
        log.se,
        log.me,
        log.nt,
        log.actinst,
        log.siminst,
        log.fltsim,
        log.xc,
        log.fltinst,
        log.dual,
        log.pic,
        log.fltdur,
      ],
    }));

    return {
      titleData: [
        "Date",
        "A/C Type",
        "Resource",
        "SE",
        "ME",
        "NT",
        "Act Inst",
        "Sim Inst",
        "Flt Sim",
        "XC",
        "Flt Inst",
        "Dual",
        "PIC",
        "Total Flt Dur",
      ],
      tableData: tableDataArray,
    };
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView>
        <StickyTable
          data={pilotTableData}
          rowTitleProps={{
            removeProperty: "The",
            titleBackgroundColor: "white",
          }}
          widthArr={widthArr}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

export default LogScreen;
