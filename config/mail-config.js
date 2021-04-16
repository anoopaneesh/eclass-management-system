var nodemailer = require('nodemailer')
const state = {
    transporter : null
}
module.exports = {
    config : async () => {
        transporter =await nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'anooppk265@gmail.com',
              pass: 'Anoop@2001'
            }
          });
          console.log('Mail instance created')
    },
    get : () => {
        return transporter
    }
}