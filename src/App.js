import React from 'react';
import './App.css';
import Upload from './widgets/uploader';
// var config = require('./config.json');
var firebaseConfig =require('./config.json')['firebaseConfig']
const firebase = require('firebase')
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

function App(){

    return (
          <Upload/>

    );

}


export default App;
