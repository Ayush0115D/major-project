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
    recipientEmail = 'ayush2231100@akgec.ac.in'
  } = alertData;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f5f5f5;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #ff0000 0%, #ff6b6b 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: bold;
        }
        .header p {
          margin: 5px 0 0 0;
          font-size: 14px;
          opacity: 0.9;
        }
        .content {
          padding: 30px;
        }
        .alert-section {
          background: #fff3cd;
          border-left: 4px solid #ff9800;
          padding: 15px;
          margin-bottom: 20px;
          border-radius: 4px;
        }
        .alert-section h3 {
          margin-top: 0;
          color: #ff6b00;
        }
        .details-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .details-table tr {
          border-bottom: 1px solid #eee;
        }
        .details-table td {
          padding: 12px;
        }
        .details-table td:first-child {
          font-weight: bold;
          background: #f9f9f9;
          color: #333;
          width: 40%;
        }
        .details-table td:last-child {
          color: #555;
        }
        .warning-box {
          background: #fff3cd;
          border-left: 4px solid #ff9800;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .warning-box h3 {
          margin-top: 0;
          color: #ff6b00;
        }
        .warning-box ul {
          margin: 10px 0;
          padding-left: 20px;
          color: #333;
        }
        .warning-box li {
          margin: 8px 0;
        }
        .success-box {
          background: #e8f5e9;
          border-left: 4px solid #4caf50;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .success-box h3 {
          margin-top: 0;
          color: #2e7d32;
        }
        .success-box ul {
          margin: 10px 0;
          padding-left: 20px;
          color: #333;
        }
        .success-box li {
          margin: 8px 0;
        }
        .status-critical {
          color: #d32f2f;
          font-weight: bold;
          font-size: 16px;
        }
        .footer {
          background: #333;
          color: white;
          padding: 20px;
          text-align: center;
          font-size: 12px;
        }
        .footer p {
          margin: 5px 0;
        }
        .red-text {
          color: #d32f2f;
          font-weight: bold;
        }
        .timestamp {
          color: #666;
          font-size: 12px;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- HEADER -->
        <div class="header">
          <h1>⚠️ OVERLOAD DETECTED</h1>
          <p>Electrical Safety Monitor - Critical Alert</p>
        </div>

        <!-- CONTENT -->
        <div class="content">
          <div class="alert-section">
            <h3>🚨 CRITICAL OVERLOAD ALERT</h3>
            <p style="margin: 0; color: #333;">
              A power overload has been detected in your electrical system. Immediate action is required.
            </p>
          </div>

          <!-- ALERT DETAILS TABLE -->
          <h2 style="color: #333; border-bottom: 2px solid #ff0000; padding-bottom: 10px;">Alert Details</h2>
          <table class="details-table">
            <tr>
              <td>Socket/Device Name:</td>
              <td><strong>${socketName}</strong></td>
            </tr>
            <tr>
              <td>Location:</td>
              <td>${socketLocation}</td>
            </tr>
            <tr>
              <td>Power Consumption:</td>
              <td><span class="status-critical">${power}W (Limit: 1000W) ⚠️</span></td>
            </tr>
            <tr>
              <td>Current Draw:</td>
              <td><span class="status-critical">${current}A (Limit: 15A) ⚠️</span></td>
            </tr>
            <tr>
              <td>Voltage:</td>
              <td>${voltage}V (Safe Range: 220-240V)</td>
            </tr>
            <tr>
              <td>Detection Time:</td>
              <td>${new Date(timestamp).toLocaleString()}</td>
            </tr>
          </table>

          <!-- IMMEDIATE ACTIONS -->
          <div class="warning-box">
            <h3>⚡ IMMEDIATE ACTIONS REQUIRED:</h3>
            <ul>
              <li><strong>STOP:</strong> Immediately disconnect the overloaded device from the socket</li>
              <li><strong>CHECK:</strong> Inspect the socket for any visible damage, burning, or discoloration</li>
              <li><strong>DO NOT RECONNECT:</strong> Do not reconnect the device until it has been professionally inspected</li>
              <li><strong>CONTACT:</strong> Call an electrician or your maintenance team immediately</li>
              <li><strong>CIRCUIT:</strong> Check your circuit breaker/fuse box for any tripped switches</li>
              <li><strong>AVOID:</strong> Keep people away from the affected socket</li>
            </ul>
          </div>

          <!-- SYSTEM RESPONSE -->
          <div class="success-box">
            <h3>✅ SYSTEM SAFETY MEASURES ACTIVATED:</h3>
            <ul>
              <li>Alert sound activated on monitoring device</li>
              <li>Email notification sent to authorized contacts</li>
              <li>Alert logged to system history for analysis</li>
              <li>Relay protection circuit may have engaged</li>
              <li>System monitoring intensified</li>
            </ul>
          </div>

          <!-- ADDITIONAL INFO -->
          <div style="background: #f0f0f0; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">⚡ What Is An Overload?</h3>
            <p style="margin: 10px 0; color: #555;">
              An electrical overload occurs when too much electrical current flows through a circuit or device. 
              This can cause:
            </p>
            <ul style="margin: 10px 0; padding-left: 20px; color: #555;">
              <li>Overheating of wires and components</li>
              <li>Risk of electrical fire</li>
              <li>Damage to connected devices</li>
              <li>Potential personal injury</li>
            </ul>
          </div>

          <!-- CONTACT INFO -->
          <div style="background: #e3f2fd; padding: 15px; border-radius: 4px; margin: 20px 0; border-left: 4px solid #2196F3;">
            <h3 style="margin-top: 0; color: #1565c0;">📞 Need Help?</h3>
            <p style="margin: 10px 0; color: #333;">
              If you have questions about this alert or need assistance, please contact:
            </p>
            <ul style="margin: 10px 0; padding-left: 20px; color: #333;">
              <li>Your facility management team</li>
              <li>Licensed electrician</li>
              <li>Electrical safety hotline</li>
            </ul>
          </div>

          <div class="timestamp">
            Alert generated at: ${new Date(timestamp).toLocaleString()}
          </div>
        </div>

        <!-- FOOTER -->
        <div class="footer">
          <p style="margin: 0; font-weight: bold;">SHIELD - Smart Home Electrical Safety Monitor</p>
          <p style="margin: 5px 0;">Automated Detection & Alert System</p>
          <p style="margin: 5px 0;">This is an automated alert. Do not reply to this email.</p>
          <p style="margin: 5px 0; opacity: 0.7;">© 2024 Electrical Safety Management System</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: '🚨 CRITICAL OVERLOAD ALERT - Electrical Safety Monitor',
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