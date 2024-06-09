








// **********************JUST FOR TESTING THE FEATURE*************************************//
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ToastAndroid } from 'react-native';
import  Timeline  from 'react-native-timeline-flatlist';
import { DELETE_BOOKING_API, FETCH_BOOKING_API } from '../constants/CONSTANTS';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MY_SECRET_KEY } from '@env';
import CryptoJS from 'react-native-crypto-js';

const TimeLineview = () => {
  const [bookings, setBookings] = useState([]);
  
  const email="abc";

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.post(FETCH_BOOKING_API, {
          email,
        });

        if (response.status === 200) {
          const encryptedData = await response.data;
          const decryptedData = CryptoJS.AES.decrypt(
            encryptedData.encryptedBookings,
            MY_SECRET_KEY
          ).toString(CryptoJS.enc.Utf8);

          const data = JSON.parse(decryptedData);

          const convertedData = data.map((item:any) => {
            const newStart = new Date(item.startTime).toLocaleTimeString();
            const newEnd = new Date(item.endTime).toLocaleTimeString();

            return {
              time: `${newStart} - ${newEnd}`,
              title: item.technician,
              description: item.description,
            };
          });

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

  

  const handleDelete = async (index:any) => {
    try {
      const bookingId = bookings[index];
      console.log(bookingId);

      const response = await axios.delete(`${DELETE_BOOKING_API}/${bookingId}`);

      if (response.status === 200) {
        setBookings((prevBookings) => {
          const updatedBookings = [...prevBookings];
          updatedBookings.splice(index, 1);
          return updatedBookings;
        });

        ToastAndroid.show(response.data.message, 5000);
      } else if (response.status === 404) {
        ToastAndroid.show(response.data.message, 5000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Timeline
        data={bookings}
        circleSize={20}
        circleColor="#007AFF"
        lineColor="#007AFF"
        timeContainerStyle={{ minWidth: 52 }}
        timeStyle={styles.itemTime}
        titleStyle={styles.itemTitle}
        descriptionStyle={styles.itemDescription}
        // options={{
        //   removeClippedSubviews: false,
        //   showsVerticalScrollIndicator: false,
        // }}
        onEventPress={handleDelete}
      />

      <TouchableOpacity style={styles.footerButton} >
        <Text style={styles.footerButtonText}>Book Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemTime: {
    textAlign: 'center',
    backgroundColor: '#007AFF',
    color: '#FFF',
    padding: 5,
    borderRadius: 13,
    overflow: 'hidden',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 14,
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
});

export default TimeLineview;
