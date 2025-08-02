const nodemailer = require('nodemailer');

// Configure NodeMailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL, // your gmail
    pass: process.env.SMTP_PASSWORD // your app password
  }
});

const portfolioContactEmailBody = (senderName, senderEmail, subject, message) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Portfolio Contact - ${subject}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1e293b;
            background-color: #f8fafc;
        }
        
        .email-container {
            max-width: 680px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
            border: 1px solid #e2e8f0;
        }
        
        .header {
            background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><rect x="0" y="0" width="1" height="1" fill="rgba(255,255,255,0.05)"/><rect x="20" y="10" width="1" height="1" fill="rgba(255,255,255,0.03)"/><rect x="40" y="30" width="1" height="1" fill="rgba(255,255,255,0.04)"/><rect x="10" y="50" width="1" height="1" fill="rgba(255,255,255,0.06)"/></svg>');
            opacity: 0.8;
        }
        
        .header-content {
            position: relative;
            z-index: 1;
        }
        
        .logo {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }
        
        .header-subtitle {
            font-size: 14px;
            opacity: 0.8;
            font-weight: 400;
            letter-spacing: 1px;
        }
        
        .status-indicator {
            display: inline-block;
            background: rgba(59, 130, 246, 0.15);
            color: #60a5fa;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            margin-top: 12px;
            border: 1px solid rgba(59, 130, 246, 0.2);
        }
        
        .content {
            padding: 40px 30px;
            background: #ffffff;
        }
        
        .section {
            margin-bottom: 32px;
        }
        
        .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #0f172a;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .section-icon {
            width: 6px;
            height: 6px;
            background: #3b82f6;
            border-radius: 50%;
        }
        
        .contact-info-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 24px;
            border-left: 4px solid #475569;
        }
        
        .info-grid {
            display: grid;
            gap: 16px;
        }
        
        .info-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #f1f5f9;
        }
        
        .info-item:last-child {
            border-bottom: none;
        }
        
        .info-label {
            font-weight: 500;
            color: #64748b;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            min-width: 80px;
        }
        
        .info-value {
            color: #1e293b;
            font-weight: 500;
            text-align: right;
            flex: 1;
        }
        
        .sender-email {
            color: #3b82f6 !important;
            text-decoration: none;
            transition: color 0.2s ease;
        }
        
        .sender-email:hover {
            color: #1d4ed8 !important;
            text-decoration: underline;
        }
        
        .message-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 24px;
            border-left: 4px solid #3b82f6;
        }
        
        .message-content {
            color: #475569;
            font-size: 15px;
            line-height: 1.7;
            white-space: pre-wrap;
            background: #f8fafc;
            padding: 20px;
            border-radius: 6px;
            border: 1px solid #f1f5f9;
            margin-top: 12px;
        }
        
        .timestamp-bar {
            background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
            padding: 16px 20px;
            border-radius: 6px;
            text-align: center;
            margin: 24px 0;
            border: 1px solid #e2e8f0;
        }
        
        .timestamp-text {
            color: #64748b;
            font-size: 13px;
            font-weight: 500;
            letter-spacing: 0.3px;
        }
        
        .action-section {
            background: #f8fafc;
            padding: 24px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            text-align: center;
            margin: 32px 0;
        }
        
        .action-buttons {
            display: flex;
            gap: 12px;
            justify-content: center;
            margin-top: 20px;
            flex-wrap: wrap;
        }
        
        .btn {
            display: inline-block;
            padding: 12px 24px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 500;
            font-size: 14px;
            letter-spacing: 0.2px;
            transition: all 0.2s ease;
            text-align: center;
            min-width: 130px;
            border: 1px solid transparent;
        }
        
        .btn-primary {
            background: #1e293b;
            color: white !important;
            border-color: #1e293b;
        }
        
        .btn-primary:hover {
            background: #334155;
            border-color: #334155;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(30, 41, 59, 0.2);
        }
        
        .btn-secondary {
            background: white;
            color: #475569 !important;
            border-color: #cbd5e1;
        }
        
        .btn-secondary:hover {
            background: #f8fafc;
            border-color: #94a3b8;
            transform: translateY(-1px);
        }
        
        .divider {
            height: 1px;
            background: #e2e8f0;
            margin: 32px 0;
        }
        
        .footer {
            background: #f8fafc;
            padding: 24px 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        
        .footer-text {
            color: #64748b;
            font-size: 13px;
            margin-bottom: 6px;
            line-height: 1.5;
        }
        
        .footer-note {
            color: #94a3b8;
            font-size: 12px;
            font-style: italic;
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid #f1f5f9;
        }
        
        @media (max-width: 600px) {
            .email-container {
                margin: 10px;
                border-radius: 8px;
            }
            
            .content, .header {
                padding: 24px 20px;
            }
            
            .info-item {
                flex-direction: column;
                align-items: flex-start;
                gap: 4px;
            }
            
            .info-value {
                text-align: left;
            }
            
            .action-buttons {
                flex-direction: column;
                align-items: center;
            }
            
            .btn {
                width: 100%;
                max-width: 240px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="header-content">
                <div class="logo">Portfolio Contact</div>
                <div class="header-subtitle">New Message Notification</div>
                <div class="status-indicator">Contact Form Submission</div>
            </div>
        </div>
        
        <div class="content">
            <div class="section">
                <div class="section-title">
                    <div class="section-icon"></div>
                    Contact Information
                </div>
                <div class="contact-info-card">
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Name</span>
                            <span class="info-value">${senderName}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Email</span>
                            <span class="info-value">
                                <a href="mailto:${senderEmail}" class="sender-email">${senderEmail}</a>
                            </span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Subject</span>
                            <span class="info-value">${subject}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">
                    <div class="section-icon"></div>
                    Message Details
                </div>
                <div class="message-card">
                    <div class="message-content">${message}</div>
                </div>
            </div>
            
            <div class="timestamp-bar">
                <div class="timestamp-text">
                    Received on ${new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </div>
            </div>
            
            <div class="action-section">
                <p style="color: #64748b; margin-bottom: 8px; font-weight: 500;">Ready to respond?</p>
                <div class="action-buttons">
                    <a href="mailto:${senderEmail}" class="btn btn-primary">Reply</a>
                    <a href="mailto:${senderEmail}?subject=Re: ${encodeURIComponent(subject)}" class="btn btn-secondary">Quick Reply</a>
                </div>
            </div>
            
            <div class="divider"></div>
            
            <div style="text-align: center; color: #64748b; font-size: 14px; padding: 16px; background: #f8fafc; border-radius: 6px; border: 1px solid #f1f5f9;">
                This message was sent through your portfolio contact form.
                <br>Consider responding within 24 hours to maintain professional engagement.
            </div>
        </div>
        
        <div class="footer">
            <div class="footer-text">
                Portfolio Contact System
            </div>
            <div class="footer-text">
                Automated notification from your website contact form
            </div>
            <div class="footer-note">
                © ${new Date().getFullYear()} Portfolio Contact System. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>`;
};

// ============================
// Portfolio Contact Me Email
// ============================
exports.contactMePortfolioEmail = async (req, res) => {
  try {
    const { senderName, senderEmail, subject, message } = req.body;

    // Validation
    if (!senderName || !senderEmail || !subject || !message) {
      return res.status(400).json({ 
        error: 'All fields are required: senderName, senderEmail, subject, message' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(senderEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Generate email HTML
    const emailHtml = portfolioContactEmailBody(senderName, senderEmail, subject, message);
    
    console.log('Sending portfolio contact email...');
    console.log('From:', senderName, '<' + senderEmail + '>');
    console.log('Subject:', subject);

    // Send email to yourself (portfolio owner)
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_EMAIL}>`,
      to: 'anmolrajas251@gmail.com', // Your email address
      replyTo: senderEmail, // So you can reply directly to the sender
      subject: `Portfolio Contact: ${subject}`,
      html: emailHtml,
      text: `
            New Portfolio Contact Message

            From: ${senderName} (${senderEmail})
            Subject: ${subject}

            Message:
            ${message}

            ---
            Sent via Portfolio Contact Form on ${new Date().toLocaleString()}
                `
    });

    console.log('Portfolio contact email sent successfully');

    return res.json({ 
      message: 'Contact message sent successfully',
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error('Error sending portfolio contact email:', err);
    return res.status(500).json({ 
      error: 'Failed to send message. Please try again later.' 
    });
  }
};