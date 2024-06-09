import { useNavigation } from "@react-navigation/native";
import React from 'react';
import {View} from 'react-native'
import LottieView from 'lottie-react-native';

const SplashScreen=() =>{
    const navigator:any=useNavigation();
    setTimeout(()=>{
        navigator.navigate('Login');
    },3000);

    return(
        <View style={{ flex: 1 }}>
      <LottieView
        source={require('../assets/132689-rocket-launch.json')}
        autoPlay
      />
    </View>
    )
}

export default SplashScreen;