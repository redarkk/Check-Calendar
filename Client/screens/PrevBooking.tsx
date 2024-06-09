import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View,Text,StyleSheet,TouchableOpacity} from "react-native";

const PrevBooking:React.FC =()=>{
  const navigator:any=useNavigation();
  const newBooking=()=>navigator.navigate('newBooking');
    return(
        <View style={styles.container}>
        <View style={styles.navbar}>
          <Text style={styles.heading}>Bookings</Text>
        </View>
        <View style={styles.content}>
          {/* Add your previous booking content here */}
          <Text style={styles.bookingText}>No Previous booking Yet!</Text>
        </View>
      </View>
    )
};



const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    navbar: {
      backgroundColor: '#007AFF',
      paddingVertical: 16,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    heading: {
      color: '#FFF',
      fontSize: 20,
      fontWeight: 'bold',
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    bookingText: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    
  });
  
  
export default PrevBooking;

