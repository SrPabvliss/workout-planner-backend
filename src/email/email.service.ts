import { Injectable } from '@nestjs/common'
import * as sgMail from '@sendgrid/mail'

@Injectable()
export class EmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  }

  async sendEmail(to: string, username: string, password: string) {
    const msg = {
      to,
      from: process.env.SENDGRID_FROM,
      subject: 'Password Reset',
      templateId: process.env.SENGRID_TEMLATE_WELCOME,
      dynamic_template_data: {
        username,
        password,
      },
      content: [
        {
          type: 'text/html',
          value: '<b>Hello!</b><br><br>Bienvenido a la comunidad.',
        },
      ],
    }

    try {
      await sgMail.send(msg)
      console.log('Email sent successfully')
    } catch (error) {
      console.error('Error sending email:', error)
      console.log('details', error.response.body)
    }
  }
}
