import { StatusBar } from "expo-status-bar";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import { StackedBarChart } from "react-native-chart-kit";
import React, { useState } from "react"; 
// import axios from "axios";

import TasksPage from "./app/screens/tasks" 
import AddTaskPage from "./app/screens/AddTask";
import FriendsPage from "./app/screens/Friends"
import AboutPage from "./app/screens/About"
import GeneralAnalyticsPage from "./app/screens/GeneralAnalytics"
import LocationTaskPage from "./app/screens/LocationTask"
import HomePage from "./app/screens/HomePage"
import StatsPage from "./app/screens/StatsPage"
import ChatbotApp from "./chatbot";
import DetectObject from "./src/mindex";
import Kamera from "./camera";
import CameraSuccess from './app/screens/CameraSuccess'

const Stack = createNativeStackNavigator();

const App = () => { 
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomePage">
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="StatsPage" component={StatsPage} />
        <Stack.Screen name="TasksPage" component={TasksPage} />
        <Stack.Screen name="AddTaskPage" component={AddTaskPage} />
        <Stack.Screen name="FriendsPage" component={FriendsPage} />
        <Stack.Screen name="AboutPage" component={AboutPage} />
        <Stack.Screen name="GeneralAnalyticsPage" component={GeneralAnalyticsPage} />
        <Stack.Screen name="LocationTaskPage" component={LocationTaskPage} />
        <Stack.Screen name="ChatbotApp" component={ChatbotApp} />
        <Stack.Screen name="DetectObject" component={DetectObject} />
        <Stack.Screen name="Kamera" component={Kamera} />
        <Stack.Screen name="CameraSuccess" component={CameraSuccess} />
      </Stack.Navigator>
    </NavigationContainer>
  ); 
}; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
  },
});


export default App;