/*
 * @Description : Common library for sending emails
 * @Author : Rajat Kesharwani
 * @Version : 1.0
 */

const nodemailer = require('nodemailer');

// Create the transporter with the required configuration for Gmail
const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
});


module.exports = function() {

    return {
        sendEmail: async function(email, subject, messBody) {
            return await transporter.sendMail({
                from: '"Node Boilerplate" <vikas.kesh2@gmail.com>',
                to: email,
                subject: subject,
                html: messBody
            });
        }
    };
};
