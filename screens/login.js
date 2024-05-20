import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { tura } from "../firebaseConfig";
import { useAuth } from "../store";

const LoginScreen = () => {
  const auth = getAuth(tura);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const { user, setUser } = useAuth();
  const loginFunction = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        setUser(user);
        // ...
      })

      .catch((error) => {
        ToastAndroid.show("Could not Sign in!", ToastAndroid.SHORT);
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };
  const signupFunction = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log(user);
        setUser(user);
        // ...
      })
      .catch((error) => {
        ToastAndroid.show("Could not Sign up!", ToastAndroid.SHORT);
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };
  return (
    <View className="flex-1 justify-center items-center px-[24]">
      <Text className="font-bold text-lg">Enter Login Details to Continue</Text>
      <View className="w-full mt-4">
        <TextInput
          value={email}
          placeholder="email"
          className="p-3 border border-gray-300 rounded-md"
          onChangeText={(e) => setEmail(e)}
        />
        <TextInput
          value={password}
          placeholder="password"
          className="p-3 mt-2 border border-gray-300 rounded-md"
          secureTextEntry={true}
          onChangeText={(e) => setPassword(e)}
        />
        <TouchableOpacity
          className="mt-2 bg-black p-3 rounded-sm"
          onPress={() => {
            loginFunction();
          }}
          disabled={isLoading}
        >
          <Text className="text-white text-center">Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="mt-2 bg-black p-3 rounded-sm"
          onPress={() => {
            signupFunction();
          }}
          disabled={isLoading}
        >
          <Text className="text-white text-center">Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
