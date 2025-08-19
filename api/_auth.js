module.exports = function getUser(req) {
  const header = req.headers['x-ms-client-principal'];
  if (!header) return null;
  const decoded = Buffer.from(header, 'base64').toString('ascii');
  const user = JSON.parse(decoded);
  const email = user.userDetails;
  const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(s => s.trim().toLowerCase());
  return {
    email,
    name: user.claims.find(c => c.typ === 'name')?.val || email,
    role: adminEmails.includes(email.toLowerCase()) ? 'admin' : 'user'
  };
};
