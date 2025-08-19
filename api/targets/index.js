const getDb = require('../_db');
const getUser = require('../_auth');

module.exports = async function (context, req) {
  const user = getUser(req);
  if (!user || user.role !== 'admin') {
    context.res = { status: 403, body: 'Forbidden' };
    return;
  }
  const { userId, month, revenue, deposit } = req.body;
  const db = await getDb();
  await db.request()
    .input('UserId', userId)
    .input('Month', month)
    .input('RevenueTarget', revenue)
    .input('DepositTarget', deposit)
    .query(`MERGE Targets AS t
      USING (SELECT @UserId AS UserId, @Month AS Month) AS s
      ON t.UserId = s.UserId AND t.Month = s.Month
      WHEN MATCHED THEN UPDATE SET RevenueTarget=@RevenueTarget, DepositTarget=@DepositTarget
      WHEN NOT MATCHED THEN INSERT (UserId, Month, RevenueTarget, DepositTarget)
      VALUES (@UserId, @Month, @RevenueTarget, @DepositTarget);`);
  context.res = { body: { status: 'ok' } };
};
