const axios = require("axios");

const sendOTPEmail = async (email, otp) => {
  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Willow API",
          email: process.env.SMTP_FROM
        },
        to: [{ email }],
        subject: "Your Login OTP",
        htmlContent: `<h1>Your OTP: ${otp}</h1>`
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("OTP email sent via Brevo API");
    return true;
  } catch (err) {
    console.error(
      "Brevo API error:",
      err.response?.data || err.message
    );
    return false;
  }
};


module.exports = { sendOTPEmail };
