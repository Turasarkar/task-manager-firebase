import {
  Timestamp,
  addDoc,
  collection,
  count,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { tura } from "../firebaseConfig";
import { AntDesign } from "@expo/vector-icons";
import { useAuth, useStore } from "../store";

const HomeScreen = ({ navigation }) => {
  const db = getFirestore(tura);
  const [text, setText] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [data, setData] = useState([]);
  const { count, setCount } = useStore();
  const { user, setUser } = useAuth();

  const [description, setDescription] = useState("");

  const getData = async () => {
    let newData = [];
    const querySnapshot = await getDocs(
      query(
        collection(db, "fireapp"),
        where("uid", "==", user.uid),
        orderBy("createdAt", "desc")
      )
    );
    querySnapshot.forEach((doc) => {
      newData.push({ ...doc.data(), id: doc.id });
      console.log({ ...doc.data(), id: doc.id });
      console.log(`${doc.id} => ${doc.data()}`);
    });
    setData(newData);
  };

  const addData = async () => {
    console.log(user);
    if (text == "") {
      return;
    }

    try {
      console.log(text);
      setisLoading(true);

      const docRef = await addDoc(collection(db, "fireapp"), {
        text: text,
        description: description,
        isDone: false,
        uid: user.uid,
        createdAt: Timestamp.now(),
      });
      console.log("Document written with ID: ", docRef.id);
      setisLoading(false);
      getData();
      setText("");
      setDescription("  ");
    } catch (e) {
      setisLoading(false);
      console.error("Error adding document: ", e);
    }
  };
  const deleteData = async (id) => {
    await deleteDoc(doc(db, "fireapp", id));
    getData();
  };
  useEffect(() => {
    getData();
  }, [count]);
  return (
    <View className="flex-1   bg-slate-100  ">
      <View className="mt-[50] mx-[15]"></View>
      <Text className="font-bold">Add A New Data</Text>
      <View className="mt-5"></View>

      <TextInput
        value={text}
        className="p-2 border border-gray-100 rounded-sm ml-2 mr-2 "
        placeholder="Type here..."
        onChangeText={(e) => setText(e)}
      />
      <TextInput
        value={description}
        className="p-2 border border-gray-100 rounded-sm ml-2 mr-2 "
        placeholder=""
        onChangeText={(e) => setDescription(e)}
        multiline={true}
        numberOfLines={3}
      />

      <TouchableOpacity
        className="mt-2 bg-black p-3 rounded-sm ml-2 mr-2"
        onPress={() => {
          addData();
        }}
        disabled={isLoading}
      >
        <Text className="text-white ">Submit</Text>
      </TouchableOpacity>
      {data.map((item) => (
        <TouchableOpacity
          onPress={() => navigation.navigate("Details", { id: item.id })}
          key={item.id}
        >
          <View className="bg-slate-50 p-3 rounded-sm flex-row justify-between ml-2 mr-2">
            <Text className={item.isDone ? "line-through" : ""}>
              {item.text}
            </Text>
            <TouchableOpacity onPress={() => deleteData(item.id)}>
              <AntDesign name="delete" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default HomeScreen;
