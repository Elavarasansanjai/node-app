const twilio      = require('twilio')

// Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken  = process.env.TWILIO_AUTH_TOKEN;
const client     = twilio(accountSid, authToken);

// Generate a 6-digit random OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
let otp
const SendOtp = async (mobileNumber) => {
    // Send OTP via SMS
    otp = generateOTP()
    return await client.messages.create({
        body   : `Hi User, Your Nandu Products registration OTP is ${otp}`,
        from   : process.env.TWILIO_PHONE_NUMBER,
        to     : `+91${mobileNumber}`,
    });
}

module.exports = {generateOTP,SendOtp}