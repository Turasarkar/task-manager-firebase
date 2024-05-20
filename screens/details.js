import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { tura } from "../firebaseConfig";

import { useStore } from "../store";
import uploadImageFromDevice from "../utils/uploadImageFromDevice";
import moment from "moment";

import {
  ref,
  getBlob,
  getDownloadURL,
  getStorage,
  uploadBytes,
} from "firebase/storage";
import getBlobFroUri from "../utils/newfile";

const DetailsScreen = ({ navigation, route }) => {
  const db = getFirestore(tura);
  const [id, setId] = useState("");

  const [data, setData] = useState({});
  const convertTime = (time) => {
    const myDate = new Date(time * 1000);
    // const formattedDateTime = myDate.toLocaleString();
    const formattedDateTime = moment().format(myDate);
    return formattedDateTime;
  };

  const [uri, setUri] = useState(null);

  const handlelocalimageupload = async () => {
    const fileUri = await uploadImageFromDevice();
    if (fileUri) {
      setUri(fileUri);
    }
  };
  const handlecloudeimageupload = async () => {
    if (!uri) return;
    const blob = await getBlobFroUri(uri);
    const imgName = "img-" + new Date().getTime();
    const storage = getStorage(tura, "gs://fir-9d806.appspot.com");
    const storageRef = ref(storage, `images/${imgName}.jpg`);
    await uploadBytes(storageRef, blob)
      .then((snapshot) => {
        return getDownloadURL(snapshot.ref);
      })
      .catch((e) => {
        console.log(e);
      })
      .then((downloadURL) => {
        console.log("tura-" + downloadURL);
        updateImageData(downloadURL);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const { count, setCount } = useStore();
  const getData = async () => {
    const docRef = doc(db, "fireapp", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setData({ ...docSnap.data(), id: docSnap.id });
      console.log(data.createdAt?.seconds);
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  };
  const updateData = async (isDone) => {
    const docRef = doc(db, "fireapp", id);

    // Set the "capital" field of the city 'DC'
    await updateDoc(docRef, {
      isDone: !isDone,
    });
    getData();
    setCount(count + 1);
  };
  const updateImageData = async (image) => {
    const docRef = doc(db, "fireapp", id);

    // Set the "capital" field of the city 'DC'
    await updateDoc(docRef, {
      image: image,
    });
    getData();
    setCount(count + 1);
    setUri(null);
    ToastAndroid.show("Upload Image", ToastAndroid.SHORT);
  };
  useEffect(() => {
    setId(route.params.id);
  }, [route.params.id]);
  useEffect(() => {
    if (id == null || id == "") {
      return;
    }
    getData();
  }, [id]);
  return (
    <View className="flex-1  mt-[80] mx-[5]">
      <View className="flex-row justify-between items-center">
        <Text className="font-bold ">Details</Text>
        <Text className="font-medium">
          {data?.isDone ? "Done" : "Not Done"}
        </Text>
      </View>
      <View className="flex-1 mt-[30]">
        <Text className="text-xl font-bold">{data.text}</Text>
        <View className=" mt[10]">
          <Text className="font-normal">{data.description}</Text>
          {/* <Text>{convertTime(data.createdAt?.seconds)}</Text> */}
        </View>
        {uri ? (
          <View className=" m-4">
            <Image
              source={{ uri: uri }}
              className="w-full h-[200] rounded-lg"
            />
          </View>
        ) : data?.image ? (
          <View className=" m-4">
            <Image
              source={{ uri: data?.image }}
              className="w-full h-[200] rounded-lg"
            />
          </View>
        ) : (
          ""
        )}
        {uri ? (
          <TouchableOpacity
            onPress={() => {
              handlecloudeimageupload();
            }}
          >
            <View className=" mt-[30] rounded-sm bg-black p-3">
              <Text className="text-white text-center">Upload Image</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              handlelocalimageupload();
            }}
          >
            <View className=" mt-[30] rounded-sm bg-black p-3">
              <Text className="text-white text-center">Choose Image</Text>
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => {
            updateData(data.isDone);
          }}
        >
          <View className=" mt-[30] rounded-sm bg-black p-3">
            <Text className="text-white text-center">
              Mark As {data.isDone ? "Not Done" : "Done"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DetailsScreen;
