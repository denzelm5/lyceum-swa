const getDb = require('../_db');
const getUser = require('../_auth');

module.exports = async function (context, req) {
  const user = getUser(req);
  if (!user || user.role !== 'admin') {
    context.res = { status: 403, body: 'Forbidden' };
    return;
  }
  const db = await getDb();
  const result = await db.request().query('SELECT * FROM Users');
  context.res = { body: result.recordset };
};
