import { View } from 'react-native'
import React from 'react'
import { globalStyles } from '../styles/global'
import { StyleSheet } from "react-native";

export default function Card(props) {
  return (
    <View style={styles.card}>
        <View style={styles.cardContent}>
            {props.children}
        </View>
    </View>
  )
}


const styles = StyleSheet.create({
    card: {
        elevation: 3,
        backgroundColor: '#fff',
        shadowOffset: {width: 1, height: 1},
        shadowColor: '#333',
        shadowOpacity: 0.3,
        
    },
    cardContent: {
        marginHorizontal: 18,
        marginVertical: 10,
        
    }
})