const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');
const compression = require('compression')

const port = process.env.PORT || 3000;
const app = express();

// View engine setup
app.engine('handlebars', exphbs({
    extname: '.hbs',
    defaultLayout: null
}));
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression())

app.get('/', (req, res) => {
  res.render('contact');
});

app.post('/send', async (req, res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'startlightinquiry@gmail.com', // generated ethereal user
        pass: 'Starlight2020$'  // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: 'startlightinquiry@gmail.com', // sender address
      to: 'mj@starlight-const.ca', // list of receivers
      subject: 'Contact Request', // Subject line
      text: 'Hello world?', // plain text body
      html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('contact', {msg:'Email has been sent'});
  });
});

//   if (!req.body.captcha)
//   return res.render('contact', { success: false, msg: 'Please select captcha' });

// // Secret key
// const secretKey = '6Lc33QAVAAAAAAwcgMtbgGsH6v66xKgoTSh0LHyT';
//184.168.221.46

// // Verify URL
// const query = stringify({
//   secret: secretKey,
//   response: req.body.captcha,
//   remoteip: req.connection.remoteAddress
// });
// const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;

// // Make a request to verifyURL
// const body = await fetch(verifyURL).then(res => res.json());

// // If not successful
// if (body.success !== undefined && !body.success)
//   // return res.json({ success: false, msg: 'Failed captcha verification' });
//   return res.render('contact',{ success: false, msg: 'Failed captcha verification' } )

// // If successful
// // return res.json({ success: true, msg: 'Captcha passed' });
//    return res.render('contact',{ success: true, msg: 'Captcha passed' } )
//   });

app.listen(port, () => console.log('Server started...'));