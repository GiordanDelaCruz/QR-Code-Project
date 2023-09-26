/* 
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/

// Import Dependencies
import { timeStamp } from "console";
import fs from "fs";
import inquirer from "inquirer";
import qr from "qr-image";

// Question to ask user
const question = [
    {
        "type": 'input',
        "name": 'URL',
        "message": "Please enter an url to be converted into a QR code:"
    }
];

// Output
inquirer.prompt(question).then( (answer) =>{
    var stamps = generateStamps();
    saveInputLog(answer, stamps);
    createQR(answer, stamps);
});

/** This function will create time and date stamps the will be used for the 
 *  input log history and qr codes.
 * 
 * @returns array of time and data stamps
 */
function generateStamps(){
    const date = new Date();
    var timeObj = {
        hour : date.getHours(),
        minute : date.getMinutes(), 
        second : date.getSeconds()
    }
    var dateObj = {
        day : date.getDate(),
        month : date.getMonth() + 1,
        year : date.getFullYear()
    }

    const stamps = [
        `ti_${timeObj.hour}_${timeObj.minute}_${timeObj.second}_dt_${dateObj.day}_${dateObj.month}_${dateObj.year}`,
        `${timeObj.hour}:${timeObj.minute}:${timeObj.second}`, 
        `${dateObj.day}:${dateObj.month}:${dateObj.year}`     
    ]

    return stamps;
}
/** This function will save a log of all the inputs from the user.
 * 
 * @param {*} answer 
 * @param {*} stamps 
 */
function saveInputLog(answer, stamps){
    fs.readFile('./input_log.txt', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        var textHistory = data;

        // Save user input in file
        var updateText = textHistory + "\n" + answer.URL + " | " + stamps[1] + " | " + stamps[2];
        fs.writeFile("input_log.txt", updateText, err => {
            if(err){
                console.log("Unable to create text file.")
            }
        });
    });
}
/** This function will create a QR code based on the user input.
 * 
 * @param {*} answer 
 * @param {*} stamps 
 */
function createQR(answer, stamps){
    var qr_png = qr.image(answer.URL, {type: 'png'});
    var fileName = "qr_code_" + stamps[0] + ".png"
    qr_png.pipe( fs.createWriteStream("./qr-code-images/" + fileName));
}