
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ToastAndroid, Button } from "react-native"
import axios from "axios";
import { BOOKING_API } from "../constants/CONSTANTS";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from "@react-navigation/native";
import CryptoJS from 'react-native-crypto-js';
import {MY_SECRET_KEY} from "@env";
import LottieView from 'lottie-react-native';

import { useSelector } from 'react-redux';
import { RootState } from '../store/store';


const NewBooking: React.FC = () => {

  const navigator:any=useNavigation();
  const [technicianName, setTechnicianName] = useState('');
  const [product, setProduct] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');
  
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  //Componenet spcific
  const [newDate, setNewDate] = useState<Date | null>(null);
  const [newStartTime, setNewStartTime] = useState<Date | null>(null);
  const [newEndTime, setNewEndTime] = useState<Date | null>(null);

  //Time in Encrypted Format( STRING)
  const [animation,setAnimation]=useState(false);

  // const route=useRoute();
  // const data:any=route.params;
  // const email:any=data.email;

  //Using email management
  const email = useSelector((state:RootState) => state.auth.email);
  
  const handleError = (message:string) => {
    setError(message);
    setTimeout(() => {
      setError('');
    }, 5000);
  };

  //date picker 
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm: any = (event: any, date: Date) => {
    if (date && date >= new Date()) {
      setNewDate(date);
      setSelectedDate(date.toISOString().split('T')[0]);
    } else {
      handleError('Please select a valid future date');
    }
    hideDatePicker();
  };

  //time picker
  const showStartTimePicker = () => {
    setStartTimePickerVisibility(true);
  };

  const hideStartTimePicker = () => {
    setStartTimePickerVisibility(false);
  };

  const handleStartTimeConfirm: any = (event: any, time: Date) => {
    if (time) {
      const selectedStartTime = new Date(time);
      const selectedEndTime = newEndTime ? new Date(newEndTime) : null;
  
      if (selectedEndTime && selectedStartTime >= selectedEndTime) {
        handleError('Start time should be before end time');
      } else {
        setNewStartTime(selectedStartTime);
        setStartTime(selectedStartTime.toLocaleTimeString());
        setError('');
      }
    }
    hideStartTimePicker();
  };

  const showEndTimePicker = () => {
    setEndTimePickerVisibility(true);
  };

  const hideEndTimePicker = () => {
    setEndTimePickerVisibility(false);
  };

  const handleEndTimeConfirm: any = (event: any, time: Date) => {
    if (time) {
      const selectedEndTime = new Date(time);
      const selectedStartTime = newStartTime ? new Date(newStartTime) : null;
  
      if (selectedStartTime && selectedEndTime <= selectedStartTime) {
        handleError('End time should be greatar than start time');
      } else {
        setNewEndTime(selectedEndTime);
        setEndTime(selectedEndTime.toLocaleTimeString());
        setError('');
      }
    }
    hideEndTimePicker();
  };

  const handleBooking = async() => {

    try {
      //preparing data for encryption
      const bookingData = {
        technician: technicianName,
        product:product,
        description:description,
        startTime:newStartTime ,
        endTime: newEndTime,
        dateOfBooking: newDate,
        customerEmail: email,
      }

      
      
      console.log(bookingData);
      const jsonString=JSON.stringify(bookingData);
      const encryptedData=CryptoJS.AES.encrypt(jsonString, MY_SECRET_KEY).toString();

      console.log(bookingData);
      const response = await axios.post(BOOKING_API, {encryptedData});


      const data: any = await response.data;
      
      console.log(response.status);

      if (response.status === 200) {
        ToastAndroid.show(response.data.message, 5000);
        setAnimation(true);
        setTimeout(()=>{
          navigator.navigate('Calendar',{email:email});
        },4000);

        setTechnicianName('');
        setEndTime('');
        setDescription('');
        setStartTime('');
        setProduct('');
        setError('');
      }
      else {
        setError(response.data.message);
      }
    }
    catch (error) {
      console.log("booking error" + error)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Book An Appointment</Text>

      <TextInput
        style={styles.input}
        placeholder="Technician Name"
        value={technicianName}
        onChangeText={setTechnicianName}
      />


      <TextInput style={styles.input}
        placeholder="Product"
        value={product}
        onChangeText={setProduct}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />

      <View style={styles.bookingContainer}>

     </View>

      <View style={styles.bookingTimeContainer}>

        <Button title="Select Day" onPress={showDatePicker} />
        <TextInput style={styles.input} placeholder="Selected Day" value={selectedDate} editable={false} />
       
        <Button title="Select Start Time" onPress={showStartTimePicker} />
        <TextInput style={styles.input} placeholder="Start Time" value={startTime} editable={false} />
      
        <Button title="Select End Time" onPress={showEndTimePicker} />
        <TextInput style={styles.input} placeholder="End Time" value={endTime} editable={false} />

      </View>


      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleBooking} >
        <Text style={styles.buttonText}>Book Appointment</Text>
      </TouchableOpacity>

      {isDatePickerVisible && (
        <DateTimePicker
          value={newDate||new Date()}
          mode="date"
          display="default"
          onChange={handleDateConfirm}
        />
      )}

      
        {animation ? (
      <View style={{flex:1}}>
        <LottieView
          
          source={require('../assets/137271-checkmark.json')}
          autoPlay
        />
      </View>
    ) : null}
      {isStartTimePickerVisible && (
        <DateTimePicker
          value={newStartTime||new Date()}
          mode="time"
          display="default"
          onChange={handleStartTimeConfirm}
        />
      )}

      {isEndTimePickerVisible && (
        <DateTimePicker
          value={newEndTime||new Date()}
          mode="time"
          display="default"
          onChange={handleEndTimeConfirm}
        />
      )}

    </View>

  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    color: "#000000",
    justifyContent: "center",
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,

  },
  bookingContainer: {
    marginBottom: 16,
  },
  bookingTimeContainer: {
    marginBottom: 32,
  },
  bookingLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  timeInput: {
    width: '100%',  
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
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
  error: {
    color: 'red',
    marginBottom: 16,
  },
});


export default NewBooking;



