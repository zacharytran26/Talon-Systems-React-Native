import React from 'react';
import { StyleSheet, View, SafeAreaView} from 'react-native';
import { Button, Input, Layout, Text} from '@ui-kitten/components';
import { useRoute } from '@react-navigation/native';



const useInputState = (initialValue = '') => {
  const [value, setValue] = React.useState(initialValue);
  return { value, onChangeText: setValue };
};

export const ReplyScreen = ({navigation}) => {
  const multilineInputState = useInputState();
  const subjectInputState  = useInputState();
  const route  = useRoute()
  const { email } = route.params;

  const subject = 'Test';
  const message = 'Hellw World Mrssage';

  const params = new URLSearchParams({
    subject: 'Test'
  });
  const ReplyEmails = async () => {
    const response = await fetch(`https://apps2.talonsystems.com/tseta/servlet/content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=606327&customer=eta0000&mode=replymessage&etamobilepro=1&nocache=n&persid=970&msgid=${email.id}&topersid=${email.topersid}&string=${params.toString()}`,{
      method: 'POST',
      headers: {
        Accept: 'application/txt',
        'Content-Type': 'application/txt'
      }
  });
  result = await response
  console.log()

};



  return (
    <SafeAreaView>
       <>
       <View>
          <Button size='small' appearance='ghost' onPress={() => navigation.goBack()}>Back</Button>
       </View>
      <Layout style={styles.rowContainer} level='1'>
       

        <Input 
            status = 'primary'
            placeholder = 'Subject'
            style = {styles.input}
            {...subjectInputState}
        
        />
        <Input
          multiline = {true}
          placeholder='Multiline'
          textStyle = {styles.inputTextStyle}
          {...multilineInputState}
        />
      </Layout>
      <Text>{email.id}</Text>
      <Text> {email.topersid}</Text>
      <Button onPress={() => ReplyEmails()}>
        <Text>Send</Text>
      </Button>
        </>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    marginVertical: 2,
  },
  inputTextStyle: {
    minHeight: 64,
  },
});
