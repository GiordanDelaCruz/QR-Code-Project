/* 
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/

// Import Dependencies
import fs from "fs";
import inquirer from "inquirer";
import qr from "qr-image";

// Question to ask user
const question = [
    {
        "type": 'input',
        "name": 'URL',
        "message": "Please enter an url:"
    }
];

// Output
inquirer.prompt(question).then( (answers) =>{
    console.log(JSON.stringify(answers, null, ' '));

    // Save user input in file
    fs.writeFile("inputs.txt", answers.URL, err => {

        if(err){
            console.log("Unable to create text file.")
        }
    });

    // Turn user input in QR-image
    var qr_png = qr.image(answers.URL, {type: 'png'});
    qr_png.pipe( fs.createWriteStream("user_input_qr.png"));
});