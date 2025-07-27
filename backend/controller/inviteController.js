const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const AdminInvite = require('../model/admin-invite');
const User = require('../model/user'); // your existing model
const frontendUrl = process.env.NODE_ENV === 'production' ? 'https://upgradist.vercel.app' : 'http://localhost:5173';
// Generate random token
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Configure NodeMailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL, // your gmail
    pass: process.env.SMTP_PASSWORD // your app password
  }
});

const adminInviteEmailBody = (inviteLink) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Invitation - Upgradist</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8fafc;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }
        
        .logo {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
        }
        
        .header-subtitle {
            font-size: 16px;
            opacity: 0.9;
            font-weight: 300;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 24px;
            font-weight: 600;
            color: #1a202c;
            margin-bottom: 20px;
        }
        
        .message {
            font-size: 16px;
            color: #4a5568;
            margin-bottom: 30px;
            line-height: 1.7;
        }
        
        .invite-card {
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
            text-align: center;
        }
        
        .invite-title {
            font-size: 20px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 15px;
        }
        
        .invite-description {
            font-size: 14px;
            color: #718096;
            margin-bottom: 25px;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white !important;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            letter-spacing: 0.5px;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        
        .expiry-notice {
            background-color: #fef5e7;
            border-left: 4px solid #f6ad55;
            padding: 16px 20px;
            margin: 25px 0;
            border-radius: 0 8px 8px 0;
        }
        
        .expiry-text {
            color: #c05621;
            font-size: 14px;
            font-weight: 500;
        }
        
        .benefits {
            margin: 30px 0;
        }
        
        .benefits-title {
            font-size: 18px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 15px;
        }
        
        .benefit-item {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            color: #4a5568;
        }
        
        .benefit-icon {
            width: 8px;
            height: 8px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            margin-right: 12px;
            margin-top: 8px;
            flex-shrink: 0;
        }
        
        .footer {
            background-color: #f7fafc;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        
        .footer-text {
            color: #718096;
            font-size: 14px;
            margin-bottom: 10px;
        }
        
        .support-link {
            color: #667eea;
            text-decoration: none;
        }
        
        .divider {
            height: 2px;
            background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
            margin: 30px 0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">Upgradist</div>
            <div class="header-subtitle">Administrative Platform</div>
        </div>
        
        <div class="content">
            <div class="greeting">You're Invited!</div>
            
            <div class="message">
                Congratulations! You have been granted administrator access to Upgradist. Click the button below to activate your admin account.
            </div>
            
            <div class="invite-card">
                <div class="invite-title">🛡️ Administrator Access Granted</div>
                <div class="invite-description">
                    You now have admin privileges on our platform
                </div>
                <a href="${inviteLink}" class="cta-button" target="_blank">
                    Activate Admin Account
                </a>
            </div>
            
            <div class="expiry-notice">
                <div class="expiry-text">
                    ⏰ This invitation expires in 24 hours for security purposes
                </div>
            </div>
            
            <div class="benefits">
                <div class="benefits-title">As an administrator, you'll have:</div>
                <div class="benefit-item">
                    <div class="benefit-icon"></div>
                    Full access to administrative dashboard and controls
                </div>
                <div class="benefit-item">
                    <div class="benefit-icon"></div>
                    User management and moderation capabilities
                </div>
            </div>
            
            <div class="divider"></div>
            
            <div class="message">
                If you have any questions about your admin account, please contact our support team.
            </div>
        </div>
        
        <div class="footer">
            <div class="footer-text">
                You have been granted administrator access to Upgradist.
            </div>
            <div class="footer-text">
                Need help? Contact us at <a href="mailto:support@upgradist.com" class="support-link">support@upgradist.com</a>
            </div>
            <div class="footer-text" style="margin-top: 20px; font-size: 12px;">
                © 2025 Upgradist. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>`;
};

// ============================
// 1. Send Admin Invite
// ============================
exports.inviteAdmin = async (req, res) => {
  try {
    const { email } = req.body;

    const token = generateToken();
    const tokenHash = await bcrypt.hash(token, 10);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await AdminInvite.create({ email, tokenHash, expiresAt });

    const inviteLink = `${frontendUrl}/accept-invite?token=${token}`;
    console.log('Frontend URL:', frontendUrl);
    console.log('Generated token:', token);
    console.log('Complete invite link:', inviteLink);

    // Generate email HTML and check if link is included
    const emailHtml = adminInviteEmailBody(inviteLink);
    console.log('Email contains link:', emailHtml.includes(inviteLink) ? 'YES' : 'NO');
    
    // Check the actual href in the HTML
    const hrefMatch = emailHtml.match(/href="([^"]+)"/);
    if (hrefMatch) {
      console.log('Found href in email:', hrefMatch[1]);
    }

    await transporter.sendMail({
      from: `"Upgradist" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: 'Admin Access Granted - Upgradist',
      html: emailHtml
    });

    return res.json({ message: 'Invitation sent successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ============================
// 2. Verify Invite
// ============================
exports.verifyInvite = async (req, res) => {
  try {
    const { token } = req.query;

    const invites = await AdminInvite.find({ status: 'pending' });
    const invite = invites.find(inv => bcrypt.compareSync(token, inv.tokenHash));

    if (!invite) {
      return res.status(400).json({ error: 'Invalid or expired invite' });
    }

    if (invite.expiresAt < new Date()) {
      return res.status(400).json({ error: 'Invite expired' });
    }

    const existingUser = await User.findOne({ email: invite.email });

    return res.json({
      valid: true,
      email: invite.email,
      existingUser: !!existingUser
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ============================
// 3. Accept Invite (if user exists)
// ============================
exports.acceptInvite = async (req, res) => {
  try {
    const { token } = req.body;

    const invites = await AdminInvite.find({ status: 'pending' });
    const invite = invites.find(inv => bcrypt.compareSync(token, inv.tokenHash));

    if (!invite) return res.status(400).json({ error: 'Invalid or expired invite' });
    if (invite.expiresAt < new Date()) return res.status(400).json({ error: 'Invite expired' });

    const user = await User.findOne({ email: invite.email });
    if (!user) return res.status(400).json({ error: 'User does not exist, please sign up using invite' });

    user.role = 'admin';
    await user.save();

    invite.status = 'accepted';
    await invite.save();

    return res.json({ message: 'User promoted to admin' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ============================
// 4. Signup with Invite (if user doesn't exist)
// ============================
exports.signupWithInvite = async (req, res) => {
  try {
    const { token, email, password, name } = req.body;

    const invites = await AdminInvite.find({ status: 'pending' });
    const invite = invites.find(inv => bcrypt.compareSync(token, inv.tokenHash));

    if (!invite) return res.status(400).json({ error: 'Invalid or expired invite' });
    if (invite.expiresAt < new Date()) return res.status(400).json({ error: 'Invite expired' });
    if (invite.email !== email) return res.status(400).json({ error: 'Email does not match invite' });

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'User already exists, please login' });

      user = await User.create({
          email,
          name,
          password, // raw password, no bcrypt
          role: 'admin'
      });

    invite.status = 'accepted';
    await invite.save();

    return res.json({ message: 'Admin account created successfully', user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


// ============================
// TEMP SCRIPT: CLEAR ALL INVITES (for testing only)
// Uncomment the below block when you want to delete all invite records.
// ============================

// (async () => {
//   try {
//     const result = await AdminInvite.deleteMany({});
//     console.log(`Deleted ${result.deletedCount} invite records`);
//   } catch (err) {
//     console.error('Error clearing AdminInvite records:', err);
//   }
// })();

