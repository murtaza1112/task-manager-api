const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENGRID_API_KEY)

const sendWelcomeMail = (email,name)=>{
    sgMail.send({
        to: email,
        from: 'andrew@mead.io',
        subject: 'Thanks for joining in!!!',
        text: `Welcome to the app,${name}.`
    })

}

const sendCancelMail = (email,name)=>{
    sgMail.send({
        to: email,
        from: 'andrew@mead.io',
        subject: 'Regarding Cancellation Of Registration!!!',
        text: `We are sorry to see you leave,${name}.`
    })

}

module.exports  = {
    sendWelcomeMail,
    sendCancelMail
}