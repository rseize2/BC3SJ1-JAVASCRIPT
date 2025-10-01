const nodemailer = require('nodemailer')
const fs = require('fs')
const path = require('path')

const createSMTPTransporter = () => {
    const smtpConfig = {
        host : "smtp.gmail.com",
        port : 465,
        secure : true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    }
    return nodemailer.createTransport(smtpConfig)
}

const sendMail = async (name) => {
    const transporter = createSMTPTransporter()
    const templatePath = path.join(__dirname, '/templates/rappelAuto.html')
    let htmlTemplate = fs.readFileSync(templatePath, 'utf-8')
    htmlTemplate = htmlTemplate.replace('{{name}}', name)

    const options = {
        from : process.env.EMAIL_USER,
        to : toEmail,
        subject : 'Test avec template HTML',
        text : 'Hello there, this is a test email',
        html : htmlTemplate
    }
    return transporter.sendMail(options)
}

const linkStart = async() => {
    try{
        await sendMail('Slyder')
        console.log("Email sent successfully")
    }
    catch(error){
        console.log(error)
    }
}

module.exports = { linkStart }
const { CronJob } = require('cron')
const { linkStart } = require('./mail')

let counter = 0

const job = new CronJob('* * * * *', function () {
    console.log('Hello there, there is '+counter+' point')
    counter++
},() => {console.log("Task ended !")}, true, 'Europe/Paris')

linkStart('Slyder')
job.start()
