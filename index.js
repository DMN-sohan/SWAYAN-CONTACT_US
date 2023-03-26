const { GoogleSpreadsheet } = require('google-spreadsheet'); // npm i google-spreadsheet
const nodemailer = require("nodemailer"); // npm install nodemailer

function test(){
    console.log("Testing");
}

async function upload(data){

    // Initialize the sheet - doc ID is the long id in the sheets URL
    // 12r_GcrQPvyPx8zMT5nuYZoeK2YupATFqo6h1-Ym4Nuc
    const doc = new GoogleSpreadsheet('<SPREADSHEET ID>');

    await doc.useServiceAccountAuth({
        client_email: "<SERVICE ACCOUNT>",
        private_key: "<PRIVATE KEY OF SERVICE ACCOUNT>",
    });

    await doc.loadInfo(); // loads document properties and worksheets
    console.log(doc.title);

    const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
    console.log(sheet.title);

    const rows = await doc.sheetsByIndex[0].getRows();
    const length = rows.length;

    // data = {designation : <DESIGNATION>,
    //         date : <DATE OF REQUEST>,
    //         name : <NAME>,
    //         email : <EMAIL>,
    //         phone_number : <PHONE>,
    //         text : <TEXT> };

    const newRow = [data.designation,data.date,data.name,data.email,data.phone,data.text];
    // Designation Date Name Email Phone_Number Text
    await sheet.addRow(newRow);
    

    // send email notifying query 
    // NOTE - DIDN'T FINISH TESTING OF EMAIL FEATURE, NODEMAILER IS THE MOST POPULAR OPTION OF SENDING AUTOMATED EMAILS

    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: "<BOT ACC EMAIL>", // generated ethereal user
          pass: "<BOT ACC PASSWORD>", // generated ethereal password
        },
    });

    var TEXT = "Designation : ${data.designation}\nDate : ${data.date}\nName : ${data.name}\nEmail : ${data.email}\nPhone_Number : ${data.phone}\nText : ${data.text} ";

    await transporter.sendMail({
        from: '<BOT MAIL>',
        to: '<COMMA SEPERATED MAILS>',
        subject: 'New contact us query from swayam.vce.ac.in',
        text: TEXT, // plain text body
      });
}
