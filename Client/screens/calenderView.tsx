
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity,ToastAndroid } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { DELETE_BOOKING_API, FETCH_BOOKING_API } from '../constants/CONSTANTS';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { MY_SECRET_KEY } from '@env';
import CryptoJS from 'react-native-crypto-js';
import { useSelector } from 'react-redux';
import {RootState} from '../store/store'
import { useDispatch } from 'react-redux';
import { addEvent, removeEvent } from '../store/calendarSlice';


const CalendarView = () => {
  const [bookings, setBookings] = useState({});
  const navigator: any = useNavigation();
  const dispatch = useDispatch();
  
  const email = useSelector((state:RootState) => state.auth.email);
  
  const newBooking = () => {
    
    navigator.navigate('newBooking',
    {email:email});
  }
  
  // Fetching booking details
  useEffect(() => {
  const fetchBookings = async () => {
    try {
      console.log("checking");
      //fetch booking API
      const response = await axios.post(FETCH_BOOKING_API, {
        email,
      });
      
      if (response.status === 200) {
        const encryptedData = await response.data;
        const decryptedData = CryptoJS.AES.decrypt(encryptedData.encryptedBookings, MY_SECRET_KEY).toString(
          CryptoJS.enc.Utf8
        );
        
        const data = JSON.parse(decryptedData);

        const storeData=data.map((item:any)=>{
           item.startTime = new Date(item.startTime).toLocaleTimeString();
           item.endTime = new Date(item.endTime).toLocaleTimeString();
          dispatch(addEvent(item));
        });
        //converting the data to agenda render format
        
        const convertedData = data.reduce((acc: any, item: any) => {
          const date = item.dateOfBooking.slice(0, 10);

          if (!acc[date]) {
            acc[date] = [];
          }

          const newStart = new Date(item.startTime).toLocaleTimeString();
          const newEnd = new Date(item.endTime).toLocaleTimeString();
          
          acc[date].push({
            id: item._id,
            name: item.description,
            start: newStart,
            end: newEnd,
            technicianName: item.technician,
            product: item.product,
            description: item.description,
          });
          
          return acc;
        }, {});

        setBookings(convertedData);
      } else {
        console.error('Error retrieving bookings');
      }
    } catch (error) {
      console.error(error);
    }
  };
    
  fetchBookings();
  
  }, [email]);

  


  //handling the delete functionality of deleting an event
  const deleteBooking = async (bookingId:Number) => {
    try{
      
      //passing booking ID as parmeters
      const response= await axios.delete(DELETE_BOOKING_API+bookingId)
      
      if(response.status===200){
        
        setBookings((prevBookings) => {
          const updatedBookings = Object.entries(prevBookings).reduce(
            (acc:any, [date, bookings]:any) => {
              const filteredBookings = bookings.filter(
                (booking:any) => booking.id !== bookingId
              );
              if (filteredBookings.length > 0) {
                acc[date] = filteredBookings;
              }
              return acc;
            },
            {}
          );
          return updatedBookings;
        });
        ToastAndroid.show(response.data.message,5000);
      }
      else if(response.status===404){
        ToastAndroid.show(response.data.message,5000);
      }

      dispatch(removeEvent(bookingId));

    }
    catch(error){
      console.log(error);
      
    }
  };


  const renderItem = (item:any) => {
    const handleDelete = () => {
      deleteBooking(item.id);
    };
    
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemTime}>
          {item.start} - {item.end}
        </Text>
        <Text style={styles.itemText}>Technician: {item.technicianName}</Text>
        <Text style={styles.itemText}>Product: {item.product}</Text>
        <Text style={styles.itemText}>Description: {item.description}</Text>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  //Incase there is no booking available
  const renderEmptyDate = () => {
    return (
      <View style={styles.emptyDateContainer}>
        <Text style={styles.emptyDateText}>No bookings available</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Agenda
        items={bookings}
        renderItem={renderItem}
        renderEmptyDate={renderEmptyDate}
        rowHasChanged={(r1, r2) => r1.name !== r2.name}
        pastScrollRange={6}
        futureScrollRange={6}
        renderEmptyData={() => (
          <View style={styles.emptyDateContainer}>
            <Text style={styles.emptyDateText}>No Event available</Text>
          </View>
        )}
        theme={{
          agendaKnobColor: '#000000',
        }}
      />
        
      <TouchableOpacity style={styles.footerButton} onPress={newBooking}>
        <Text style={styles.footerButtonText}>Book Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  itemTime: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  itemText: {
    color:'#000000',
    fontSize: 14,
  },
  emptyDateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  emptyDateText: {
    fontSize: 16,
    color: '#999',
  },
  footerButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default CalendarView;

