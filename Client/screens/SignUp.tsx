import React,{useState} from "react";
import{ View ,StyleSheet, Text,TextInput,TouchableOpacity, ToastAndroid} from "react-native"
import { SIGNUP_API } from "../constants/CONSTANTS";
import axios  from "axios";
import { useNavigation } from "@react-navigation/native";
import CryptoJS from "react-native-crypto-js";
import {MY_SECRET_KEY} from "@env"


const SignUp: React.FC= ()=>{
  
  //console.log('MY_SECRET_KEY', MY_SECRET_KEY)
    const [email,setEmail]=useState('');
    const [mobileNumber,setMobileNumber]=useState('');
    const [password,setPassword]=useState('');
    const [error,setError]=useState('');
    const [name,setName]=useState('');
    const navigator:any=useNavigation();

    const handleError=(message:string)=>{
      setError(message);
      setTimeout(() => {
        setError('');
      }, 5000);
    }
    const handleSignUp = async () => {
      try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

    
        if (!emailRegex.test(email)) {
          handleError('wrong Email format');
        } else if (mobileNumber.length !== 10) {
          handleError('Phone length should be equal to 10');
        }
         else if (!passwordRegex.test(password)) {
          handleError('Invalid password. Password must contain at least 8 characters with at least one letter and one number');
        }
         else {
          const jsonData={
            name,
            email,
            password,
            mobileNumber,
          }
          
          const jsonString=JSON.stringify(jsonData);
          
          const encryptedData=CryptoJS.AES.encrypt(jsonString, MY_SECRET_KEY).toString();
          console.log(encryptedData);
          const response = await axios.post(SIGNUP_API, {encryptedData});

          const data: any = await response.data;
            
          console.log(response.status);

          if (response.status === 200) {
            ToastAndroid.show(data.message, 5000);
            setPassword('');
            setEmail('');
            setMobileNumber('');
            setName('');
            navigator.navigate('Login');
          }
        }
      } catch (error) {
        console.log('sign up error: ' + error);
      }
    };
    
    return (
  
        <View style={styles.container}>
            <Text style={styles.heading}>Sign-Up</Text>
            <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            />


            <TextInput
            style={styles.input}
            placeholder="Phone"
            keyboardType="numeric"
            value={mobileNumber}
            onChangeText={setMobileNumber}
            />


            <TextInput
            style={styles.input}
            placeholder="name"
            value={name}
            onChangeText={setName}
            />


            <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}  
            
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>SignUp</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    heading: {
      color:"#000000",
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 24,
      justifyContent:"center"
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
      width: '100%',
      height: 40,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 4,
      paddingHorizontal: 8,
      marginBottom: 16,
      fontSize:16,
      fontWeight:"bold",
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
  });

  export default SignUp;
