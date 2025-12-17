function baseTemplate({ title = 'Notification', bodyHtml = '' }) {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#f6f8fb;padding:24px;">
    <table width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e6e9ee;">
      <tr>
        <td style="background:#0C62AB;color:#ffffff;padding:16px 20px;">
          <h1 style="margin:0;font-size:18px;">Divyansh Global RO</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:24px 20px;color:#1f2937;">
          <h2 style="margin:0 0 12px 0;font-size:20px;">${title}</h2>
          <div style="font-size:14px;line-height:1.6;color:#374151;">${bodyHtml}</div>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 20px;background:#f9fafb;color:#6b7280;font-size:12px;">
          <p style="margin:0;">This email was sent by Divyansh Global RO Service.</p>
          <p style="margin:6px 0 0 0;">If you did not request this, you can safely ignore it.</p>
        </td>
      </tr>
    </table>
  </div>`;
}

function resetPasswordTemplate({ name = '', resetUrl }) {
  const bodyHtml = `
    <p>Hi ${name ? name.split(' ')[0] : 'there'},</p>
    <p>We received a request to reset your password. Click the button below to choose a new password. This link will expire in 30 minutes.</p>
    <p style="margin:24px 0;">
      <a href="${resetUrl}" style="display:inline-block;background:#0C62AB;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:600;">Reset your password</a>
    </p>
    <p>If the button doesn't work, copy and paste this URL into your browser:</p>
    <p style="word-break:break-all;color:#111827;">${resetUrl}</p>
  `;
  return baseTemplate({ title: 'Reset your password', bodyHtml });
}

module.exports = { resetPasswordTemplate };
