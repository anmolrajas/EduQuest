const mongoose = require('mongoose');

const AdminInviteSchema = new mongoose.Schema({
  email: { type: String, required: true },
  tokenHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'accepted'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('AdminInvite', AdminInviteSchema);
