import express from 'express';
const app = express();
import fs from 'fs';




// First function will load all username and password into an array


const loginfunction=function(users44){
 
  
// Read the JSON from file is letery just numbers
const rawData = fs.readFileSync('./data/Passwords/users.json');

const jsonData = JSON.parse(rawData);// prints in json format, but as an array, so users:[username: carl, password: pas] not ussable yet
// console.log(jsonData)

// Extract the users array from the JSON data
const usersArray = jsonData.users;// stil not usefull

// Create a new array of objects with username and password properties
users44 = usersArray.map(user => {// makes it in the format that we need for later, for esay login authentication
  //map() creates a new array by iterating over the elements of an existing array and applying a transformation function to each element.
  return {
    username: user.username,
    password: user.password
  }
});
// console.log(users44)
return users44// here we return our array to our routes.js filled with our username and passwords, that can be used for authentication

}


export default loginfunction;

