const nodemailer          = require('nodemailer')

const sendEmail           = async (data,  req, res) =>{
    
    let transporter = nodemailer.createTransport({
        service        : 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth           : {user: 'elakabbadi09@gmail.com',pass: 'dfor igdf ntod sufx' }
    });
    let info       = await transporter.sendMail({
        from                   : 'elakabbadi09@gmail.com',
        to                     : data.to,
        subject                : data.subject,
        text                   : data.text,
    });
    console.log(`message sent, ${info.messageId}`)
}    
module.exports  =  sendEmail             