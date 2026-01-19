
export const getVerificationEmailHtml = (code: string) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 0; }
    .container { max-width: 480px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
    .header { background-color: #3b45f2; padding: 24px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
    .content { padding: 32px 24px; text-align: center; }
    .text { color: #27272bff; font-size: 16px; line-height: 24px; margin-bottom: 24px; }
    .code-container { background-color: #3b45f2; border-radius: 8px; padding: 16px; margin: 24px 0; border: 1px solid #e4e4e7; }
    .code { font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #ffffff; }
    .footer { background-color: #3b45f2; padding: 16px; text-align: center; border-top: 1px solid #e4e4e7; }
    .footer-text { color: #ffffff; font-size: 12px; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Starky</h1>
    </div>
    <div class="content">
      <p class="text">Olá!</p>
      <p class="text">Use o código abaixo para verificar seu email e começar sua jornada de aprendizado.</p>
      
      <div class="code-container">
        <span class="code">${code}</span>
      </div>

      <p class="text">Este código expira em 15 minutos.</p>
    </div>
    <div class="footer">
      <p class="footer-text">Se você não solicitou este código, ignore este email.</p>
    </div>
  </div>
</body>
</html>
  `;
};
