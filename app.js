const express = require("express");
const morgan = require("morgan");

const app = express();
app.use(morgan("common"));

/*
Drill #1 Requirements:
1.Create a route handler function on the path /sum that accepts two query parameters named a and b and find the sum of the two values. 
2.Return a string in the format "The sum of a and b is c". 
3.Note that query parameters are always strings so some thought should be given to converting them to numbers.
*/

app.get("/sum", (req, res) => {
  const { a, b } = req.query;

  // Validatate a & b, make sure they are numbers
  if (!a) {
    return res.status(400).send("a is required");
  }

  if (!b) {
    return res.status(400).send("b is required");
  }
  //Apply parseFloat method to make sure its a number
  //The parseFloat() function parses a string and returns a floating point number.
  const numberA = parseFloat(a);
  const numberB = parseFloat(b);

  //The isNaN() function determines whether a value is NaN or not.
  if (Number.isNaN(numberA)) {
    return res.status(400).send("a must be a number");
  }

  if (Number.isNaN(numberB)) {
    return res.status(400).send("b must be a number");
  }

  // validation passed so perform the task
  const c = numberA + numberB;

  // format the response string
  const responseString = `The sum of ${numberA} and ${numberB} is ${c}`;

  // send the response
  res.status(200).send(responseString);
});

/* 
Drill #2 Requirements:
1.Create an endpoint /cipher. The handler function should accept a query parameter named text and a one named shift. 
2. Encrypt the text using a simple shift cipher also known as a Caesar Cipher. It is a simple substitution cipher where each letter is shifted a certain number of places down the alphabet. 
3. So if the shift was 1 then A would be replaced by B, and B would be replaced by C and C would be replaced by D and so on until finally Z would be replaced by A. using this scheme encrypt the text with the given shift and return the result to the client.
 Hint - String.fromCharCode(65) is an uppercase A and 'A'.charCodeAt(0) is the number 65. 65 is the integer value of uppercase A in UTF-16. See the documentation for details.
 The static String.fromCharCode() method returns a string created from the specified sequence of UTF-16 code units.
*/

app.get("/cipher", (req, res) => {
  const { text, shift } = req.query;

  //Validate that text is required
  if (!text) {
    return res.status(400).send("text is required");
  }

  //Validate that shift is required
  if (!shift) {
    return res.status(400).send("shift is required");
  }

  //Apply parseFloat method to make sure its a number
  //The parseFloat() function parses a string and returns a floating point number.
  const ShiftIsNumber = parseFloat(shift);

  //The isNaN() function determines whether a value is NaN or not.
  if (Number.isNaN(ShiftIsNumber)) {
    return res.status(400).send("shift must be a number");
  }

  const baseCharacter = "A".charCodeAt(0); // get char code

  const cipher = text
    .toUpperCase()
    .split("") // create an array of characters
    .map(character => {
      // map each original char to a converted char
      const codedCharacter = character.charCodeAt(0); //get the char code

      // if it is not one of the 26 letters ignore it
      if (
        codedCharacter < baseCharacter ||
        codedCharacter > baseCharacter + 26
      ) {
        return character;
      }

      // otherwise convert it
      // get the distance from A
      let diff = codedCharacter - baseCharacter;
      diff = diff + ShiftIsNumber;

      // in case shift takes the value past Z, cycle back to the beginning
      diff = diff % 26;

      // convert back to a character
      const shiftedChar = String.fromCharCode(baseCharacter + diff);
      return shiftedChar;
    })
    .join(""); // construct a String from the array

  // Return the response
  res.status(200).send(cipher);
});

/* Drill #3 Requirements
1. To send an array of values to the server via a query string simply repeat the key with different values. For instance, the query string ?arr=1&arr=2&arr=3 results in the query object { arr: [ '1', '2', '3' ] }. 
2.Create a new endpoint /lotto that accepts an array of 6 distinct numbers between 1 and 20 named numbers. 
3.The function then randomly generates 6 numbers between 1 and 20. Compare the numbers sent in the query with the randomly generated numbers to determine how many match. 
4.If fewer than 4 numbers match respond with the string "Sorry, you lose". If 4 numbers match respond with the string "Congratulations, you win a free ticket", if 5 numbers match respond with "Congratulations! You win $100!". 
5.If all 6 numbers match respond with "Wow! Unbelievable! You could have won the mega millions!".
*/

// Drill 3
app.get("/lotto", (req, res) => {
  const { numbers } = req.query;

  // validation:
  // 1. the numbers array must exist
  // 2. must be an array
  // 3. must be 6 numbers
  // 4. numbers must be between 1 and 20

  if (!numbers) {
    return res.status(200).send("numbers is required");
  }

  if (!Array.isArray(numbers)) {
    return res.status(200).send("numbers must be an array");
  }

  const guesses = numbers
    .map(n => parseInt(n))
    .filter(n => !Number.isNaN(n) && (n >= 1 && n <= 20));

  if (guesses.length != 6) {
    return res
      .status(400)
      .send("numbers must contain 6 integers between 1 and 20");
  }

  // fully validated numbers

  // here are the 20 numbers to choose from
  const stockNumbers = Array(20)
    .fill(1)
    .map((_, i) => i + 1);

  //randomly choose 6
  const winningNumbers = [];
  for (let i = 0; i < 6; i++) {
    const ran = Math.floor(Math.random() * stockNumbers.length);
    winningNumbers.push(stockNumbers[ran]);
    stockNumbers.splice(ran, 1);
  }

  //compare the guesses to the winning number
  let diff = winningNumbers.filter(n => !guesses.includes(n));

  // construct a response
  let responseText;

  /* 
    The switch statement evaluates an expression, matching the expression's value to a case clause, and executes statements associated with that case, as well as statements in cases that follow the matching case.
    
    */

  switch (diff.length) {
    case 0:
      responseText = "Wow! Unbelievable! You could have won the mega millions!";
      break;
    case 1:
      responseText = "Congratulations! You win $100!";
      break;
    case 2:
      responseText = "Congratulations, you win a free ticket!";
      break;
    default:
      responseText = "Sorry, you lose";
  }

  // uncomment below to see how the results ran

  res.json({
    guesses,
    winningNumbers,
    diff,
    responseText
  });

  res.send(responseText);
});

app.listen(8000, () => {
  console.log("Server started on PORT 8000");
});