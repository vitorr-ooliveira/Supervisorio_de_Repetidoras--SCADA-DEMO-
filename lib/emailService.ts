import nodemailer from 'nodemailer';
import path from 'path';
import { logger } from './logger';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  requireTLS: true,
  tls: {
    ciphers: 'SSLv3'
  }
});

export const sendRestartNotification = async (
  toEmail: string,
  repetidoraName: string,
  time: string
) => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    logger.warn('[EmailService] SMTP credentials not configured. Skipping email notification.');
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: `"Portal Empresa" <portal@empresa.com.br>`,
      to: toEmail,
      subject: `Confirmação de Ação: Reinício da Repetidora ${repetidoraName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #0f172a; padding: 20px; text-align: center;">
            <h2 style="color: #10b981; margin: 0;">Confirmação de Ação</h2>
          </div>
          <div style="padding: 30px; background-color: #ffffff; color: #333333;">
            <p style="font-size: 16px; line-height: 1.5;">Olá,</p>
            <p style="font-size: 16px; line-height: 1.5;">Esta é uma notificação automática para confirmar que a ação de reinício da repetidora foi executada com sucesso.</p>
            
            <div style="background-color: #f8fafc; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0;"><strong>Repetidora:</strong> ${repetidoraName}</p>
              <p style="margin: 0;"><strong>Horário da Ação:</strong> ${time}</p>
            </div>
            
            <p style="font-size: 14px; color: #64748b; margin-top: 30px;">
              Caso você não tenha solicitado esta ação, entre em contato imediatamente com o administrador do sistema.
            </p>
          </div>
          <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b;">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Empresa. Todos os direitos reservados.</p>
          </div>
        </div>
      `,
    });

    logger.info(`[EmailService] Notificação enviada com sucesso para ${toEmail}. MessageId: ${info.messageId}`);
  } catch (error) {
    logger.error({ err: error }, '[EmailService] Erro ao enviar e-mail de notificação');
  }
};



export const sendMfaCodeEmail = async (
  toEmail: string,
  repetidoraName: string,
  code: string,
  expiresInMinutes: number
) => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    logger.warn('[EmailService] SMTP credentials not configured. Skipping MFA email.');
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: `"Supervisório - Repetidoras Empresa" <supervisorio.repetidoras@empresa.com.br>`,
      to: toEmail,
      subject: `Código de Verificação: Reinício da Repetidora ${repetidoraName}`,
      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            overflow: hidden;
          "
        >
          <div style="background-color: #0f172a; padding: 20px; text-align: center">
            <h2 style="color: #3b82f6; margin: 0">Código de Verificação</h2>
          </div>
          <div style="padding: 30px; background-color: #ffffff; color: #333333">
            <p style="font-size: 16px; line-height: 1.5">Olá,</p>
            <p style="font-size: 16px; line-height: 1.5">
              Você solicitou o reinício da repetidora
              <strong>${repetidoraName}</strong>. Para prosseguir, utilize o código de
              verificação abaixo:
            </p>

            <div
              style="
                background-color: #f8fafc;
                border: 2px dashed #3b82f6;
                border-radius: 8px;
                padding: 20px;
                margin: 30px 0;
                text-align: center;
              "
            >
              <span
                style="
                  font-size: 32px;
                  font-weight: bold;
                  letter-spacing: 8px;
                  color: #0f172a;
                "
                >${code}</span
              >
            </div>

            <p style="font-size: 14px; color: #64748b; margin-top: 20px">
              Este código é válido por <strong>${expiresInMinutes} minutos</strong>.
            </p>
            <p style="font-size: 14px; color: #64748b; margin-top: 10px">
              Caso você não tenha solicitado esta ação, ignore este e-mail.
            </p>
          </div>
          <div
            style="
              background-color: #f1f5f9;
              padding: 15px;
              text-align: center;
              font-size: 12px;
              color: #64748b;
            "
          >
            <p style="margin: 0">
              &copy; ${new Date().getFullYear()} Empresa. Todos os direitos reservados.
            </p>
          </div>
        </div>

        <div style="margin-top: 20px; padding-left: 10px;">
          <p class="x_MsoNormal" style="line-height: 150%">
            <span
              style="
                font-size: 9pt;
                font-family: &quot;Arial&quot;, sans-serif;
                color: #333333;
              "
            >
              <strong>Portal Meu RH &mdash; Sistema Automatizado</strong><br />
              Desenvolvido e mantido pela Equipe de Tecnologia da Informação<br />
              Em caso de falhas, dúvidas ou problemas, entre em contato com o suporte técnico:<br />
              &#9993;&#xFE0F; <a href="mailto:ti@empresa.com.br" style="color: #0563c1; text-decoration: none;"><strong>ti@empresa.com.br</strong></a><br />
            </span>
            <br />
            <span
              style="
                font-size: 12pt;
                line-height: 105%;
                font-family: &quot;Aptos&quot;, sans-serif;
              "
              ><img
                src="cid:logo_empresa"
                width="310"
                height="82"
                alt="Logotipo Empresa"
                style="
                  width: 3.2291in;
                  height: 0.8541in;
                  cursor: pointer;
                  min-height: auto;
                  min-width: auto;
                "
            /></span>
            <br />
            <b
              ><span
                style="
                  font-size: 8pt;
                  line-height: 105%;
                  font-family: &quot;Arial&quot;, sans-serif;
                "
                >Rua da Estrela 77 - Rio Comprido - Rio de Janeiro - Brasil -
                Cep.:20251-021 -&nbsp; Site:
              </span></b
            ><span
              style="
                font-size: 8pt;
                line-height: 105%;
                font-family: &quot;Arial&quot;, sans-serif;
                color: rgb(5, 99, 193);
              "
              ><a
                href="http://www.empresa.com.br/"
                target="_blank"
                rel="noopener noreferrer"
                title="http://www.empresa.com.br/"
                style="color: rgb(5, 99, 193);"
                ><b>www.empresa.com.br</b></a
              ></span
            >
            <br />
            <i
              ><span
                style="
                  font-size: 7.5pt;
                  line-height: 45%;
                  font-family: &quot;Arial&quot;, sans-serif;
                  color: black;
                "
                >Esta mensagem e seus anexos são destinados exclusivamente ao(s)
                destinatário(s) identificado(s) acima e contêm informações confidenciais
                ou privilegiadas. Se você não é destinatário destes materiais, não está
                autorizado a utilizá-los para nenhum fim. Solicitamos que você apague a
                mensagem e seus anexos e avise imediatamente o remetente. O conteúdo
                desta mensagem e o de seus anexos não representam necessariamente a
                opinião e a intenção dos integrantes desta empresa, não implicando em
                qualquer obrigação ou responsabilidade.<br /></span
            ></i>
            <i
              ><span
                style="
                  font-size: 7.5pt;
                  line-height: 105%;
                  font-family: &quot;Arial&quot;, sans-serif;
                  color: rgb(26, 142, 4);
                "
                >* ANTES DE IMPRIMIR, PENSE NO SEU COMPROMISSO COM A NATUREZA.</span
              ></i
            >
          </p>
        </div>
        `,
      attachments: [
        {
          filename: 'logo assinatura.png',
          path: path.join(process.cwd(), 'public', 'images', 'logo assinatura.png'),
          cid: 'logo_empresa'
        }
      ]
    });

    logger.info(`[EmailService] Código MFA enviado para ${toEmail}. MessageId: ${info.messageId}`);
  } catch (error) {
    logger.error({ err: error }, '[EmailService] Erro ao enviar e-mail MFA');
    throw error;
  }
};

