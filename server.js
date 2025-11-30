const express = require('express');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// ============================================
// EMAIL CONFIGURATION
// ============================================

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Test email configuration on startup
transporter.verify(function(error, success) {
  if (error) {
    console.log('❌ Email configuration error:', error);
    console.log('\n📧 Please check your .env file:');
    console.log('   - EMAIL_USER should be your Gmail address');
    console.log('   - EMAIL_PASS should be your Gmail App Password');
    console.log('   - Get App Password: https://myaccount.google.com/apppasswords\n');
  } else {
    console.log('✅ Email server is ready to send messages!');
    console.log(`📧 Sending from: ${process.env.EMAIL_USER}\n`);
  }
});

// ============================================
// CAT IMAGE API
// ============================================

const getCatImage = (timeOfDay) => {
  // Using Cat as a Service API (cataas.com)
  // Adds timestamp to get a fresh random cat each time
  const timestamp = Date.now();
  return `https://cataas.com/cat/cute?width=600&height=400&t=${timestamp}`;
};

// ============================================
// JAZZ MUSIC PLAYLISTS
// ============================================

const jazzPlaylists = {
  morning: 'https://www.youtube.com/watch?v=DSGyEsJ17cI', // Morning Jazz
  afternoon: 'https://www.youtube.com/watch?v=fEvM-OUbaKs', // Afternoon Jazz
  evening: 'https://www.youtube.com/watch?v=Dx5qFachd3A' // Evening Jazz
};

// ============================================
// EMAIL TEMPLATE GENERATOR
// ============================================

const getEmailContent = (timeOfDay, recipientName) => {
  const greetings = {
    morning: {
      subject: '🌅 Good Morning! Your Cute Kitty is Here!',
      greeting: 'Good Morning',
      message: 'Rise and shine! Start your day with this adorable kitty and some relaxing jazz music. ☕🐱',
      emoji: '☀️',
      background: '#FFE5B4'
    },
    afternoon: {
      subject: '🌤️ Good Afternoon! Take a Break with a Cute Kitty!',
      greeting: 'Good Afternoon',
      message: 'Time for a midday break! Here\'s a sweet kitty to brighten your afternoon. 🌸🐱',
      emoji: '🌞',
      background: '#B4D7FF'
    },
    evening: {
      subject: '🌙 Good Evening! Relax with Your Cute Kitty!',
      greeting: 'Good Evening',
      message: 'Unwind after a long day with this cozy kitty and smooth jazz. 🌙🐱',
      emoji: '✨',
      background: '#D4B5FF'
    }
  };

  const config = greetings[timeOfDay];
  const catImage = getCatImage(timeOfDay);
  const musicLink = jazzPlaylists[timeOfDay];

  return {
    subject: config.subject,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, ${config.background} 0%, #ffffff 100%);
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .content {
            padding: 30px;
            text-align: center;
          }
          .cat-image {
            width: 100%;
            max-width: 500px;
            border-radius: 15px;
            margin: 20px 0;
            box-shadow: 0 5px 20px rgba(0,0,0,0.15);
          }
          .message {
            font-size: 18px;
            color: #333;
            margin: 20px 0;
            line-height: 1.6;
          }
          .music-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            border-radius: 25px;
            text-decoration: none;
            font-size: 16px;
            margin-top: 20px;
            transition: transform 0.3s;
          }
          .music-button:hover {
            transform: scale(1.05);
          }
          .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 14px;
          }
          .emoji {
            font-size: 48px;
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${config.emoji} ${config.greeting}${recipientName ? ', ' + recipientName : ''}! ${config.emoji}</h1>
          </div>
          <div class="content">
            <div class="emoji">🐱</div>
            <p class="message">${config.message}</p>
            <img src="${catImage}" alt="Cute Kitty" class="cat-image" />
            <p style="font-size: 16px; color: #666;">
              🎵 Enjoy some relaxing jazz music while looking at this adorable kitty! 🎵
            </p>
            <a href="${musicLink}" class="music-button">
              🎼 Play Relaxing Jazz Music 🎼
            </a>
          </div>
          <div class="footer">
            <p>💝 Sent with love from your Cute Kitty Mailer 💝</p>
            <p>Have a wonderful ${timeOfDay}!</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

// ============================================
// EMAIL SENDING FUNCTION
// ============================================

const sendCuteKittyEmail = async (recipients, timeOfDay) => {
  try {
    for (const recipient of recipients) {
      const emailContent = getEmailContent(timeOfDay, recipient.name);
      
      const mailOptions = {
        from: `Cute Kitty Mailer 🐱 <${process.env.EMAIL_USER}>`,
        to: recipient.email,
        subject: emailContent.subject,
        html: emailContent.html
      };

      await transporter.sendMail(mailOptions);
      console.log(`✅ ${timeOfDay} email sent to ${recipient.email}`);
    }
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
};

// ============================================
// SUBSCRIBER STORAGE (in-memory)
// ============================================

let subscribers = [];

// ============================================
// WEB ROUTES
// ============================================

// Home page
app.get('/', (req, res) => {
  res.render('index', { subscribers });
});

// Subscribe
app.post('/subscribe', (req, res) => {
  const { name, email } = req.body;
  
  if (!email || !name) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const existingSubscriber = subscribers.find(sub => sub.email === email);
  if (existingSubscriber) {
    return res.status(400).json({ error: 'Email already subscribed' });
  }

  subscribers.push({ name, email, subscribedAt: new Date() });
  console.log(`📧 New subscriber: ${name} (${email})`);
  
  res.json({ success: true, message: 'Successfully subscribed!' });
});

// Unsubscribe
app.post('/unsubscribe', (req, res) => {
  const { email } = req.body;
  subscribers = subscribers.filter(sub => sub.email !== email);
  console.log(`📧 Unsubscribed: ${email}`);
  res.json({ success: true, message: 'Successfully unsubscribed' });
});

// Get subscribers
app.get('/subscribers', (req, res) => {
  res.json(subscribers);
});

// Send test email
app.post('/send-test', async (req, res) => {
  const { email, timeOfDay } = req.body;
  
  if (!email || !timeOfDay) {
    return res.status(400).json({ error: 'Email and timeOfDay are required' });
  }

  console.log(`\n🧪 Sending test ${timeOfDay} email to ${email}...`);
  await sendCuteKittyEmail([{ email, name: 'Friend' }], timeOfDay);
  res.json({ success: true, message: 'Test email sent! Check your inbox.' });
});

// ============================================
// AUTOMATED EMAIL SCHEDULING
// ============================================

// Morning: 8:00 AM
cron.schedule('0 8 * * *', () => {
  console.log('\n🌅 Sending morning greetings...');
  if (subscribers.length > 0) {
    sendCuteKittyEmail(subscribers, 'morning');
  } else {
    console.log('No subscribers to send to.');
  }
});

// Afternoon: 2:00 PM
cron.schedule('0 14 * * *', () => {
  console.log('\n🌤️ Sending afternoon greetings...');
  if (subscribers.length > 0) {
    sendCuteKittyEmail(subscribers, 'afternoon');
  } else {
    console.log('No subscribers to send to.');
  }
});

// Evening: 8:00 PM
cron.schedule('0 20 * * *', () => {
  console.log('\n🌙 Sending evening greetings...');
  if (subscribers.length > 0) {
    sendCuteKittyEmail(subscribers, 'evening');
  } else {
    console.log('No subscribers to send to.');
  }
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🐱 CUTE KITTY MAILER - Server Running!');
  console.log('='.repeat(60));
  console.log(`\n📍 Server URL: http://localhost:${PORT}`);
  console.log(`📧 Email from: ${process.env.EMAIL_USER || 'NOT CONFIGURED'}`);
  console.log('\n📅 Email Schedule:');
  console.log('   ☀️  Morning:   8:00 AM');
  console.log('   🌤️  Afternoon: 2:00 PM');
  console.log('   🌙 Evening:   8:00 PM');
  console.log('\n💡 Tip: Use the "Test Email" feature on the website to test immediately!');
  console.log('='.repeat(60) + '\n');
});
