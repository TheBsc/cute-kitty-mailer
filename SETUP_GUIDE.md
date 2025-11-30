# 🐱 Cute Kitty Mailer - VS Code Setup Guide

## Quick Setup (5 Minutes!)

### Step 1: Get Gmail App Password

1. Go to https://myaccount.google.com/apppasswords
2. Sign in to your Google account
3. Select **"Mail"** as the app
4. Select **"Other"** as the device and type "Kitty Mailer"
5. Click **"Generate"**
6. Copy the **16-character password** (it looks like: `abcd efgh ijkl mnop`)
7. Remove all spaces: `abcdefghijklmnop`

### Step 2: Configure Your Email

1. Open the `.env` file in VS Code
2. Replace `your-email@gmail.com` with YOUR Gmail address
3. Replace `your-app-password-here` with the 16-character password from Step 1

**Example:**
```env
EMAIL_USER=myemail@gmail.com
EMAIL_PASS=abcdefghijklmnop
PORT=3000
```

### Step 3: Install Dependencies

Open VS Code's integrated terminal (View → Terminal) and run:

```bash
npm install
```

This will install all required packages.

### Step 4: Run the Server

```bash
npm start
```

You should see:
```
============================================================
🐱 CUTE KITTY MAILER - Server Running!
============================================================

📍 Server URL: http://localhost:3000
📧 Email from: your-email@gmail.com
...
```

### Step 5: Open in Browser

1. Open your browser
2. Go to: http://localhost:3000
3. You'll see the Cute Kitty Mailer dashboard!

### Step 6: Send Test Email

1. Scroll to the **"Test the Mailer"** section
2. Enter YOUR email address
3. Select "Morning", "Afternoon", or "Evening"
4. Click **"Send Test Email Now!"**
5. Check your inbox! (might be in spam folder first time)

---

## 📧 Testing the APIs

### Cat Image API
The app uses **Cat as a Service (cataas.com)** API:
- URL: `https://cataas.com/cat/cute?width=600&height=400`
- Returns random cute cat images
- Each email gets a fresh cat!

**You'll see the API in action when you:**
1. Send a test email
2. Check your inbox
3. See a random cat picture in the email

### Jazz Music Integration
Each email includes a link to curated jazz playlists on YouTube:
- Morning: Upbeat morning jazz
- Afternoon: Smooth afternoon jazz
- Evening: Mellow evening jazz

---

## 🎯 What to Expect

### When You Send a Test Email:

1. **Instant Send**: Email goes out immediately
2. **Check Console**: You'll see `✅ morning email sent to your@email.com`
3. **Check Inbox**: Look for email from "Cute Kitty Mailer 🐱"
4. **View Email**: Beautiful HTML with:
   - Random cat picture (from API)
   - Colorful gradient design
   - Jazz music button
   - Time-specific theme

### Email Themes:

**Morning (8:00 AM)**
- Warm peach gradient
- Energetic greeting
- Fresh cat image
- Upbeat jazz link

**Afternoon (2:00 PM)**
- Cool blue gradient
- Relaxing message
- Sweet cat picture
- Smooth jazz link

**Evening (8:00 PM)**
- Purple gradient
- Calming greeting
- Cozy cat image
- Mellow jazz link

---

## 🔧 VS Code Tips

### Recommended Extensions:
- **EJS language support** - For syntax highlighting in .ejs files
- **npm** - For package management
- **REST Client** - For testing API endpoints

### Useful Commands:

**Start server:**
```bash
npm start
```

**Stop server:**
- Press `Ctrl+C` in terminal

**Restart server:**
- Stop with `Ctrl+C`
- Run `npm start` again

---

## 🐛 Troubleshooting

### Problem: "Email configuration error"

**Solution:**
1. Check `.env` file has correct email and password
2. Make sure you used App Password, not regular password
3. No spaces in the password
4. Save the `.env` file

### Problem: Email not received

**Solutions:**
1. Check spam/junk folder
2. Wait 1-2 minutes
3. Check console for error messages
4. Verify email address is correct

### Problem: Port 3000 already in use

**Solution:**
1. Change PORT in `.env` to `3001` or `8080`
2. Or find and stop other app using port 3000

### Problem: npm install fails

**Solutions:**
1. Make sure Node.js is installed: `node --version`
2. Try: `npm install --legacy-peer-deps`
3. Delete `node_modules` folder and try again

---

## 📊 Testing Checklist

- [ ] `.env` file configured with your Gmail
- [ ] `npm install` completed successfully
- [ ] Server starts without errors
- [ ] Can access http://localhost:3000
- [ ] Send test email works
- [ ] Email arrives in inbox
- [ ] Cat image loads in email
- [ ] Jazz music link works
- [ ] Can subscribe with email
- [ ] Can unsubscribe

---

## 🎨 Seeing the APIs in Action

### Cat API Test:
1. Send multiple test emails
2. Check each email
3. Notice different cat pictures each time
4. That's the API working! Random cats every time.

### Email API Test:
1. Use the test feature
2. Check server console
3. See `✅ email sent to...` message
4. Check your inbox
5. Nodemailer + Gmail SMTP working!

---

## 📱 How to Use

### For Development/Testing:
1. Use the test email feature for immediate results
2. Don't wait for scheduled times
3. Test all three themes (morning/afternoon/evening)

### For Production:
1. Add real subscribers
2. Let it run 24/7
3. Emails auto-send at 8am, 2pm, 8pm
4. Subscribers get daily cute cats!

---

## 🚀 Advanced: Customize

### Change Email Times:
Edit `server.js` lines with `cron.schedule`:
```javascript
cron.schedule('0 8 * * *', () => {  // Change '8' to your hour
```

### Add More Cat Varieties:
Edit `getCatImage()` function in `server.js`:
```javascript
return `https://cataas.com/cat/says/hello?width=600&height=400`;
```

### Change Colors:
Edit the `greetings` object in `server.js`:
```javascript
background: '#FFE5B4'  // Change to any color
```

---

## 📝 Assignment Notes

### What to Show Your Instructor:

1. **Working Demo**: 
   - Open http://localhost:3000
   - Show the interface
   - Send a test email live

2. **API Integration**:
   - Point out Cat API URL in code
   - Show different cat pictures in emails
   - Explain randomness

3. **Email Output**:
   - Show received email in Gmail
   - Display cat image (from API)
   - Click jazz music link

4. **Code Quality**:
   - Well-commented `server.js`
   - Clean structure
   - Professional design

---

## 🎯 Success Indicators

You'll know it's working when:

✅ Server starts with no errors  
✅ Can access the website  
✅ Test email sends successfully  
✅ Email arrives in inbox  
✅ Cat image displays  
✅ Jazz link works  
✅ Different cats on each email  

---

## 💡 Pro Tips

1. **First Test**: Use your own email to see how it looks
2. **Check Spam**: First email might go to spam
3. **Multiple Tests**: Send morning, afternoon, evening to see all themes
4. **Console Watching**: Keep an eye on server console for real-time feedback
5. **Browser Refresh**: Reload http://localhost:3000 to see subscriber count update

---

## 🌟 What Makes This Special

- **Real API Integration**: Live cat images from external API
- **Professional Email**: HTML templates like real marketing emails
- **Automated Scheduling**: Uses cron for precise timing
- **Full Stack**: Frontend + Backend + Email + APIs
- **Production Ready**: Could actually deploy and use this!

---

## 📞 Need Help?

Common issues and solutions are in the troubleshooting section above.

For more details, check:
- `server.js` - Main code with comments
- `.env` - Your configuration
- Browser console - Frontend errors
- Terminal - Server errors

---

## 🎉 You're Ready!

1. Configure `.env` ✅
2. Run `npm install` ✅
3. Run `npm start` ✅
4. Visit http://localhost:3000 ✅
5. Send test email ✅
6. See cute cat in your inbox! 🐱

**Enjoy your cute kitties with jazz!** 🎵
