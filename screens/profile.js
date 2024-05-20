import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { useAuth } from "../store";

const ProfileScreen = () => {
  const auth = getAuth();
  const { user, setUser } = useAuth();
  const logout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
  };

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text>Profile</Text>
      <TouchableOpacity
        onPress={() => {
          logout();
        }}
      >
        <Text>logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;
