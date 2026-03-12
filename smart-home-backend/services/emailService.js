// ============= EMAIL SERVICE =============
// Location: smart-home-backend/services/emailService.js

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// ============= CONFIGURE EMAIL TRANSPORTER =============
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // Use App Password for Gmail
  }
});

// ============= VERIFY CONNECTION =============
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email service error:', error);
  } else {
    console.log('✅ Email service ready');
  }
});

// ============= SEND OVERLOAD ALERT EMAIL =============
export const sendOverloadAlert = async (alertData) => {
  const {
    socketName,
    socketLocation,
    power,
    current,
    voltage,
    timestamp,
    riskLevel,
    recipientEmail = 'ayush2231100@akgec.ac.in'
  } = alertData;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          background: #f5f5f5;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 500px;
          margin: 0 auto;
          background: white;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #ff0000 0%, #ff6b6b 100%);
          color: white;
          padding: 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 25px;
        }
        .alert-box {
          background: #ffe0e0;
          border-left: 5px solid #ff0000;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 20px;
        }
        .alert-box p {
          margin: 8px 0;
          color: #333;
          font-size: 15px;
          line-height: 1.6;
        }
        .details {
          background: #f9f9f9;
          padding: 15px;
          border-radius: 5px;
          font-size: 14px;
        }
        .details p {
          margin: 6px 0;
          color: #555;
        }
        .footer {
          background: #333;
          color: white;
          padding: 15px;
          text-align: center;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚠️ ELECTRICAL OVERLOAD DETECTED</h1>
        </div>
        
        <div class="content">
          <div class="alert-box">
            <p><strong>🚨 CRITICAL ALERT:</strong> Electrical overload detected in ${socketName}!</p>
            <p><strong>Action Required:</strong> Please disconnect the device immediately to prevent damage.</p>
          </div>

          <div class="details">
            <p><strong>Location:</strong> ${socketLocation}</p>
            <p><strong>Power Consumption:</strong> ${power}W (Limit: 1000W)</p>
            <p><strong>Current Draw:</strong> ${current}A (Limit: 15A)</p>
            <p><strong>Voltage:</strong> ${voltage}V</p>
            <p><strong>Overload Risk:</strong> ${riskLevel}%</p>
            <p><strong>Time:</strong> ${new Date(timestamp).toLocaleString()}</p>
          </div>
        </div>

        <div class="footer">
          <p>SHIELD - Smart Home Electrical Safety Monitor</p>
          <p>Automated Detection System</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: `⚠️ ELECTRICAL OVERLOAD ALERT - ${power}W detected in ${socketName}`,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log(`✅ Email sent successfully to ${recipientEmail}`);
    console.log(`   Message ID: ${info.messageId}`);
    
    return {
      success: true,
      message: 'Alert email sent successfully',
      messageId: info.messageId,
      recipient: recipientEmail
    };

  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export default transporter;