import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import Register from "../components/Register";
import Login from "../components/Login";
import Home from "../components/Home";
import Orders from "../components/Orders";
import MyProfile from "../components/MyProfile";
import ViewDetails from "../components/ViewDetails";
import MyEarnings from "../components/MyEarnings";
import UpdateProfile from "../components/UpdateProfile";
import MyOrders from "../components/MyOrders";
import LogoutButton from "../components/LogoutButton";
import TermsAndConditions from "../components/TermsAndConditions";
import DailyCollectionStatus from "../components/DailyCollectionStatus";


const Stack = createStackNavigator();

 const AppNavigator = () => {
  return (
    <>
    <Stack.Navigator  screenOptions={{
    headerShown: false, // disables the header for every screen
  }} initialRouteName="Register">
      
      <Stack.Screen name="Register" component={Register} options={{ headerShown: false }}/>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Logout" component={LogoutButton} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="My Orders" component={Orders} />
      <Stack.Screen name="My Profile" component={MyProfile} />
      <Stack.Screen name="My Details" component={ViewDetails} />
      <Stack.Screen name="Update Details" component={UpdateProfile} />
      <Stack.Screen name="My Completed Orders" component={MyOrders} />
      <Stack.Screen name="My Earnings" component={MyEarnings} />
      <Stack.Screen name="Daily Collection" component={DailyCollectionStatus} />
      <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} />
      
      
      

    </Stack.Navigator>
    </>
  );
};

export default AppNavigator;