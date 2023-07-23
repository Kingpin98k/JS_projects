const nodemailer = require('nodemailer')

const sendEmail = async options=>{
    //1) Create a transporter
    //----------------------------------------------------------------
    // const transporter = nodemailer.createTransport({
    //     service:"Gmail",
    //     auth:{
    //         user:"aditya298k@gmail.com",
    //         password:"All_Star@98k"
    //     }
    //     //Active in gmail "less secure app option"
    //     //We use mailgun or sendgrid instead of gmail
    // })
    //----------------------------------------------------------------

    //We are testing emails using mailtrap.io
    const transporter = nodemailer.createTransport({
        host:process.env.MAILTRAP_HOST,
        port:process.env.MAILTRAP_PORT,
        auth:{
            user:process.env.MAILTRAP_USERNAME,
            pass:process.env.MAILTRAP_PASSWORD
        }
    })

    //2) Define the email option
    const mailOPtions = {
        from: "Aditya Mishra",
        to:options.email,
        subject:options.subject,
        text:options.message
        //html:
    }   
  

    //3) Actually send the email
    try {
        const info = await transporter.sendMail(mailOPtions);
        console.log('Email sent successfully!', info.messageId);
        // The "info" object may contain additional details about the sent email
      } catch (error) {
        console.error('Error sending email:', error);
        throw error; // You can rethrow the error or handle it as per your requirement
      }
}

module.exports = sendEmail