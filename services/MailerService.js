// services/mailerService.js
const { Resend } = require('resend');
const dotenv = require('dotenv');
dotenv.config();

class MailerService {
  constructor() {
    // Validation de la clé API
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not defined in environment variables');
    }
    
    this.mailer = new Resend(process.env.RESEND_API_KEY);
    this.fromEmail = 'Acme <onboarding@resend.dev>';
  }

  async sendCreatedAccountEmail({ recipient, name }) {
    try {
      const subject = 'Bienvenue sur Node.js Chat';
      const html = `Bienvenue ${name} sur Node.js Gestion des contact Nous sommes <strong>heureux</strong> de vous avoir parmi nous!`;

      const { data, error } = await this.mailer.emails.send({
        from: this.fromEmail,
        to: [recipient],
        subject,
        html,
      });

      if (error) {
        console.error('Erreur envoi email:', error);
        throw new Error(`Échec envoi email: ${error.message}`);
      }

      console.log('Email envoyé avec succès à:', recipient);
      return data;

    } catch (error) {
      console.error('Échec envoi email création compte:', error);
      throw error;
    }
  }

  async sendResetPasswordEmail({ recipient, name, token }) {
    try {
      const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
      const subject = 'Node.js Chat - Réinitialisation de mot de passe';
      const html = `
        Bonjour ${name}, 
        <br><br>
        Voici votre lien de réinitialisation de mot de passe: 
        <a href="${link}">Réinitialiser mon mot de passe</a>
        <br><br>
        Ce lien expirera dans 1 heure.
      `;

      const { data, error } = await this.mailer.emails.send({
        from: this.fromEmail,
        to: [recipient],
        subject,
        html,
      });

      if (error) {
        console.error('Erreur envoi email reset:', error);
        throw new Error(`Échec envoi email: ${error.message}`);
      }

      console.log('Email reset envoyé avec succès à:', recipient);
      return data;

    } catch (error) {
      console.error('Échec envoi email réinitialisation:', error);
      throw error;
    }
  }
}

// Export instance unique (Singleton)
module.exports = new MailerService();