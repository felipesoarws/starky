
export const getVerificationEmailHtml = (code: string) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #09090b; margin: 0; padding: 0; color: #ffffff; }
    .container { max-width: 480px; margin: 40px auto; background-color: #121214; border-radius: 24px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.05); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
    .header { padding: 40px 24px 20px 24px; text-align: center; }
    .logo { color: #3b45f2; font-size: 32px; font-weight: 800; margin: 0; letter-spacing: -1px; }
    .content { padding: 0 32px 40px 32px; text-align: center; }
    .title { color: #ffffff; font-size: 24px; font-weight: 700; margin-bottom: 16px; }
    .text { color: #a1a1aa; font-size: 16px; line-height: 24px; margin-bottom: 24px; }
    .code-wrapper { background: linear-gradient(135deg, #3b45f2 0%, #1d26b0 100%); border-radius: 16px; padding: 24px; margin: 32px 0; box-shadow: 0 10px 15px -3px rgba(59, 69, 242, 0.2); }
    .code { font-family: 'SF Mono', 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 12px; color: #ffffff; margin-left: 12px; }
    .footer { padding: 24px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.05); background-color: rgba(255, 255, 255, 0.02); }
    .footer-text { color: #71717a; font-size: 12px; margin: 0; }
    .accent-bar { height: 4px; background: #3b45f2; width: 100%; }
  </style>
</head>
<body>
  <div class="container">
    <div class="accent-bar"></div>
    <div class="header">
      <h1 class="logo">Starky</h1>
    </div>
    <div class="content">
      <h2 class="title">Verifique seu acesso</h2>
      <p class="text">Olá! Use o código de verificação abaixo para acessar sua conta e continuar seus estudos.</p>
      
      <div class="code-wrapper">
        <span class="code">${code}</span>
      </div>

      <p class="text" style="font-size: 14px;">Este código é válido por 15 minutos e garante a segurança da sua conta.</p>
    </div>
    <div class="footer">
      <p class="footer-text">Se você não solicitou este acesso, pode ignorar este email com segurança.</p>
      <p class="footer-text" style="margin-top: 8px;">© ${new Date().getFullYear()} Starky. Todos os direitos reservados.</p>
    </div>
  </div>
</body>
</html>
  `;
};
