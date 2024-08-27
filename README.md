# Talon-Systems-React-Native
Documentation: 
This file will contain the documentation for the Talon Systems Mobile App. It will contain detailed description of the mechanics of each screen and the explanation behind the thought process. 

Navigation System:
The navigation system of the mobile app should mimic the feel of any modern apps (LinkedIn, Instagram, etc). Every app should have a bottom navigator and a drawer to hold all the remaining screens that is not in the bottom navigator. This requires nested navigation of the drawer, stack, and the bottom navigator. In the picture below is a visual representation of the navigation system. In order to have the target navigation match to the same screens described in the bottom navigation screen drawer, we must create its own stack and drawer for each screen in the bottom navigation. This ensures that the navigation system in the screens will point to the correct screen. This will avoid any confusion whenever the user will press a screen in the bottom navigator and it will not move to another bottom navigator screen. In essense, the localization of screens ensures that the bottom navigator screen will contain only the screens that are specified in the specific drawer and stack. By doing so, the navigation system will point to the correct screen and not point to another screen located in a different drawer. In effect of creating each individual screen component for each bottom navigator screen, we must create our own screen folder that contains the navigation system to that specific screen. For example in the screens folder, there is a subfolder called CurrencyScreens that contain the screens associated with the CurrencyDrawer and CurrencyStack. This will be done for all the screens in the bottom navigator with the exception of the home screen due to the referencing of the screens via the AppStack, AuthStack, and Context file. One thing to note while writing this early on is the lack of knowledge about the performance issues this may cause due to the amount of redundant code there is. I have seen firsthand, through examination of other applications that they replicate the screens for each bottom navigator but the question still stands on how the performance of the application will do on iOS and Android phones. In conclusion, the navigation system of the app is a nested navigation, where the stack is within a drawer, and the drawer is within a bottom navigation. This nested navigation ensures the user a more seamless UI rather than navigating to the home screen to access all the screens. 

Screens

In this section, I will be breaking down each screen and the functionality of each screen. To start off each screen will contain a styles variable that holds all the styles of any text, button, or any UI. It will also contain a reference to the Context labeled "_const {authUser} = useAuth();_". This is important to have because the context contains all the parameters in the query string to get the data in the database. 

Because this app's requirement is to display and alter data, we must be able to connect to a database that can handle the data coming to and from the app. This means using an application programming interface (API) that will connect the database and the mobile application. In the case of the mobile application, the API I am using is a fetch that contains a query string. This query string follows the HTTPS protocol where it takes in parameters that the database will understand. Once a user sends in a fetch request, the database is waiting for the parameters inside the query string to fulfill its requirements. Once it is done with its requirements, the database will send a response to the query string and the mobile application is waiting for a JSON object. A JSON object is how data is processed and packaged in a mobile application. JSONs are critical to rendering data. A JSON object is usually denoted as a key-value pair denoted like this: _{"key":"value"}_. It is possible to have a nested JSON and to access the nested JSON, one must call the nth index of the array. 

On the UI part of the mobile application, React Native provides powerful tools to the developer for the app to function. One powerful tool that they offer is hooks. They allow the developer to use state without writing a class component. In the mobile application of Talon Systems, there are two main hooks that are used: useState() and useEffect(). useState() is used to initialize a variable meaning that a variable can become an integer, array, or an empty string. EX: 
   
       import React, { useState } from 'react';
       import { Text, View, Button } from 'react-native';
       const Counter = () => {
       const [count, setCount] = useState(0);
       return (
           <View>
               <Text>Count: {count}</Text>
               <Button title="Increment" onPress={() => setCount(count + 1)} />
           </View>
       );
      };
In this example, the line _const [count, setCount] = useState(0);_ initializes the variable as an integer 0 and whenever that variable is handled, the variable will update. 
The second hook that is used is useEffect(). This handles the side effects of fetching data. EX:
import React, { useState, useEffect } from 'react';

      function Example() {
        const [count, setCount] = useState(0);

        // Similar to componentDidMount and componentDidUpdate:
          useEffect(() => {
            // Update the document title using the browser API
            document.title = `You clicked ${count} times`;
            });
            return (
            <div>
              <p>You clicked {count} times</p>
                <button onClick={() => setCount(count + 1)}>
                  Click me
                </button>
              </div>
              );
            }
By using this Hook, you tell React that your component needs to do something after render. React will remember the function you passed (we’ll refer to it as our “effect”), and call it later after performing the DOM updates. In this effect, we set the document title, but we could also perform data fetching or call some other imperative API. 
