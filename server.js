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

// GMAIL EMAIL CONFIGURATION WITH CUSTOM NAME
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.verify(function(error, success) {
  if (error) {
    console.log('❌ Connection error:', error);
  } else {
    console.log('✅ Email server is ready to send messages!');
    console.log(`📧 Sending from: Cute Kitty Mailer (${process.env.EMAIL_USER})`);
  }
});

let subscribers = [];

const getCatImage = (timeOfDay) => {
  const catImages = [
    'https://cdn2.thecatapi.com/images/MTY3ODIyMQ.jpg',
    'https://cdn2.thecatapi.com/images/5cc.jpg',
    'https://cdn2.thecatapi.com/images/aau.jpg',
    'https://cdn2.thecatapi.com/images/77a.jpg',
    'https://cdn2.thecatapi.com/images/c14.jpg',
    'https://cdn2.thecatapi.com/images/e35.jpg',
    'https://cdn2.thecatapi.com/images/MTUwNjAzNg.jpg',
    'https://cdn2.thecatapi.com/images/brt.jpg',
    'https://cdn2.thecatapi.com/images/9gg.jpg',
    'https://cdn2.thecatapi.com/images/bi9.jpg'
  ];
  const randomIndex = Math.floor(Math.random() * catImages.length);
  return catImages[randomIndex];
};

const jazzPlaylists = {
  morning: 'https://www.youtube.com/watch?v=DSGyEsJ17cI',
  afternoon: 'https://www.youtube.com/watch?v=fEvM-OUbaKs',
  evening: 'https://www.youtube.com/watch?v=Dx5qFachd3A'
};

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
            display: block;
            height: auto;
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

const sendCuteKittyEmail = async (recipients, timeOfDay) => {
  try {
    for (const recipient of recipients) {
      const emailContent = getEmailContent(timeOfDay, recipient.name);
      
      const mailOptions = {
        from: '"Cute Kitty Mailer 🐱" <' + process.env.EMAIL_USER + '>',
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

app.get('/', (req, res) => {
  res.render('index', { 
    subscriberCount: subscribers.length,
    subscribers: subscribers
  });
});

app.post('/subscribe', (req, res) => {
  const { name, email } = req.body;
  const existing = subscribers.find(sub => sub.email === email);
  if (existing) {
    return res.json({ success: false, message: 'You are already subscribed!' });
  }
  subscribers.push({ name, email });
  console.log(`➕ New subscriber: ${name} (${email})`);
  res.json({ success: true, message: `Welcome ${name}! You're now subscribed to daily cute kitty emails! 🐱` });
});

app.post('/send-test', async (req, res) => {
  const { email, timeOfDay } = req.body;
  try {
    console.log(`\n🧪 Sending test ${timeOfDay} email to ${email}...`);
    await sendCuteKittyEmail([{ name: '', email }], timeOfDay);
    res.json({ success: true, message: `Test ${timeOfDay} email sent to ${email}! Check your inbox! 📧` });
  } catch (error) {
    console.error('Error:', error);
    res.json({ success: false, message: 'Failed to send email. Please try again.' });
  }
});

app.get('/api/subscribers', (req, res) => {
  res.json({ count: subscribers.length });
});

cron.schedule('0 8 * * *', () => {
  console.log('\n🌅 Sending morning greetings...');
  if (subscribers.length > 0) {
    sendCuteKittyEmail(subscribers, 'morning');
  } else {
    console.log('No subscribers to send to.');
  }
});

cron.schedule('0 14 * * *', () => {
  console.log('\n🌤️ Sending afternoon greetings...');
  if (subscribers.length > 0) {
    sendCuteKittyEmail(subscribers, 'afternoon');
  } else {
    console.log('No subscribers to send to.');
  }
});

cron.schedule('00 20 * * *', () => {
  console.log('\n🌙 Sending evening greetings...');
  if (subscribers.length > 0) {
    sendCuteKittyEmail(subscribers, 'evening');
  } else {
    console.log('No subscribers to send to.');
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Cute Kitty Mailer is running!`);
  console.log(`🌐 Open your browser: http://localhost:${PORT}`);
  console.log(`\n📅 Scheduled email times:`);
  console.log(`   🌅 Morning: 8:00 AM`);
  console.log(`   🌤️ Afternoon: 2:00 PM`);
  console.log(`   🌙 Evening: 9:20 PM`);
  console.log(`\n💝 Ready to send cute kitties with jazz music!\n`);
});