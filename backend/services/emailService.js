import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS // Use app password for Gmail
    }
  });
};

// Send reminder email to inactive student
export const sendReminderEmail = async (student) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: student.email,
      subject: 'Time to Get Back to Problem Solving! 🚀',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2c3e50; text-align: center;">Hey ${student.name}! 👋</h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p style="font-size: 16px; color: #34495e; margin-bottom: 15px;">
              We noticed you haven't made any submissions on Codeforces in the last 7 days. 
              Don't let your problem-solving skills get rusty!
            </p>
            
            <p style="font-size: 16px; color: #34495e; margin-bottom: 15px;">
              Remember, consistent practice is the key to improving your competitive programming skills. 
              Even solving one problem a day can make a huge difference!
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://codeforces.com/problemset" 
               style="background-color: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Start Solving Problems Now
            </a>
          </div>
          
          <div style="background-color: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #27ae60; margin-top: 0;">💡 Quick Tips:</h3>
            <ul style="color: #2c3e50;">
              <li>Start with problems rated around your current level</li>
              <li>Practice different problem types to build versatility</li>
              <li>Review solutions after solving to learn new techniques</li>
              <li>Join virtual contests to simulate real competition</li>
            </ul>
          </div>
          
          <p style="color: #7f8c8d; font-size: 14px; text-align: center; margin-top: 30px;">
            Keep up the great work! Your future self will thank you for staying consistent. 💪
          </p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ecf0f1;">
          
          <p style="color: #95a5a6; font-size: 12px; text-align: center;">
            This is an automated reminder from your TLE (Time Limit Exceeded) tracking system. 
            If you'd like to disable these reminders, please contact your administrator.
          </p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`Reminder email sent to ${student.email}: ${result.messageId}`);
    return true;
  } catch (error) {
    console.error(`Failed to send reminder email to ${student.email}:`, error.message);
    return false;
  }
};

// Check if email configuration is valid
export const validateEmailConfig = () => {
  return !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);
}; 