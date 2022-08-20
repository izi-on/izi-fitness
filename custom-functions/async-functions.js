import AsyncStorage from "@react-native-async-storage/async-storage";

//STORE DATA
export const _storeData = async (key, newData) => {
  try {
    const jsonValue = JSON.stringify({ data: newData });
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.log(e);
  }
};

//GET DATA FUNCTION
export const _getData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      const res = jsonValue !== null ? JSON.parse(jsonValue) : null;
      if (res) {
        return res.data;
      } else {
        return null;
      } //CHECK IF NULL
    } catch (e) {
      console.log(e);
    }
  };
