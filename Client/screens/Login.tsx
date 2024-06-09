import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import { LOGIN_API } from "../constants/CONSTANTS";
import axios from "axios";
import CryptoJS from "react-native-crypto-js";
import { MY_SECRET_KEY } from '@env';
import LottieView from 'lottie-react-native';
import { useDispatch } from 'react-redux';
import { LoginSuccess } from '../store/authSlice';
import {useSelector}  from 'react-redux'
import { RootState } from "../store/store";


const Login: React.FC = () => {
  //Dispatch function for sending action

  const dispatch = useDispatch();
  const email = useSelector((state:RootState) => state.auth.email);
  
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigator:any=useNavigation();
  const [sucLogin,setsucLogin]=useState(false);

  const handleEmailChange = (newEmail:string) => {
    dispatch(LoginSuccess({ email: newEmail }));
  };

  //function for handling the login
  const handleLogin = async () => {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

      const handleError = (message:string) => {
        setError(message);
        setTimeout(() => {
          setError('');
        }, 5000);
      };
  
      if (!emailRegex.test(email)) {
        handleError("invalid email format");
      }
      else if (!passwordRegex.test(password)) {
        handleError("Invalid password format")
        
      } else {
        setError('');

        
        const jsonData={
          email,
          password,
        }
        const jsonString=JSON.stringify(jsonData);
        const encryptedData=CryptoJS.AES.encrypt(jsonString, MY_SECRET_KEY).toString();
        console.log(encryptedData);
        
        const response = await axios.post(LOGIN_API,{encryptedData});

        const data = response.data;
        console.log(response.status);
        if (response.status === 200) {
          ToastAndroid.show("Login successfully", 5000);

          dispatch(LoginSuccess({ email: email }));
          
          setsucLogin(true);

          setPassword('');
          setTimeout(()=>{
            navigator.navigate('newBooking',{ email:email });
          },5000)
          
        } else if (response.status === 400) {
          ToastAndroid.show(data.msg, 3000);
        }
      }
    } catch (error) {
      console.log("Login Error: " + error);
    }
  };
  

  const signup=()=>navigator.navigate('SignUp');

  return (
    
    
    <View style={styles.container}>
    <Text style={styles.heading}>Login</Text>

    <TextInput
      style={styles.input}
      placeholder="Email"
      onChangeText={handleEmailChange}
      value={email}
    />

    {sucLogin ? (
      <View style={styles.lottieContainer}>
        <LottieView
          style={styles.lottie}
          source={require('../assets/148127-blue-truck.json')}
          autoPlay
        />
      </View>
    ) : null}

    <TextInput
      style={styles.input}
      placeholder="Password"
      secureTextEntry
      onChangeText={setPassword}
      value={password}
    />

    {error ? <Text style={styles.error}>{error}</Text> : null}

    <TouchableOpacity style={styles.button} onPress={handleLogin}>
      <Text style={styles.buttonText}>Login</Text>
    </TouchableOpacity>

    <Text>
      Not a User?{' '}
      <Text style={{ color: 'blue' }} onPress={signup}>
        SignUp
      </Text>
    </Text>
  </View>
);
};

const styles = StyleSheet.create({
heading: {
  color: '#000000',
  fontSize: 24,
  fontWeight: 'bold',
  marginBottom: 24,
},
container: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  padding: 16,
},
error: {
  color: 'red',
  marginBottom: 16,
},
input: {
  color: '#000000',
  width: '100%',
  height: 40,
  fontSize: 16,
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 4,
  paddingHorizontal: 8,
  marginBottom: 16,
  fontWeight: 'bold',
},
button: {
  width: '100%',
  height: 40,
  backgroundColor: '#007AFF',
  borderRadius: 4,
  alignItems: 'center',
  justifyContent: 'center',
},
buttonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},
lottieContainer: {
  ...StyleSheet.absoluteFillObject,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)', // Add background color for the overlay effect
},
lottie: {
  width: 200,
  height: 200,
},
});

export default Login;