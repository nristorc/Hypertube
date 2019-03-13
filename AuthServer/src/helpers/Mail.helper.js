const nodemailer = require('nodemailer')
const { isEmpty } = require('../utils')
const { MAIL } = require('../config/config')

class Mail {
  constructor() {
    this.user = MAIL.USER
    this.pass = MAIL.PASS
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: this.user,
        pass: this.pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })
  }

  send(mailOptions) {
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, (error, info) => {
        if (!isEmpty(error)) return reject(error)
        console.log('Message sent: %s', info.messageId)
        return resolve(info)
      })
    })
  }

  registration(userDocResult, redirectUri) {
    const mailOptions = {
      from: this.user,
      to: userDocResult.email,
      subject: 'Hypertube Registration',
      text: `Click here to confirm your account - ${redirectUri}?token=${userDocResult.emailConfirmation[0].token}`,
    }
    return this.send(mailOptions)
  }

  recoverPassword(email, token, redirectUri) {
    const mailOptions = {
      from: this.user,
      to: email,
      subject: 'Hypertube Password Recovery',
      text: `Click here to get a new password - ${redirectUri}?token=${token}`,
    }
    return this.send(mailOptions)
  }
}

module.exports = Mail
