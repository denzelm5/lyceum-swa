const getDb = require('../_db');
const getUser = require('../_auth');

module.exports = async function (context, req) {
  const user = getUser(req);
  if (!user) {
    context.res = { status: 401, body: 'Unauthorized' };
    return;
  }
  const month = req.query.month;
  const db = await getDb();
  const result = await db.request()
    .input('Email', user.email)
    .input('Month', month)
    .query(`SELECT t.* FROM Targets t
            JOIN Users u ON t.UserId = u.Id
            WHERE u.Email=@Email AND t.Month=@Month`);
  context.res = { body: result.recordset[0] || null };
};
