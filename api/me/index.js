const getDb = require('../_db');
const getUser = require('../_auth');

module.exports = async function (context, req) {
  const user = getUser(req);
  if (!user) {
    context.res = { status: 401, body: 'Unauthorized' };
    return;
  }
  const db = await getDb();
  const result = await db.request()
    .input('Email', user.email)
    .query('SELECT * FROM Users WHERE Email=@Email');
  if (result.recordset.length === 0) {
    await db.request().input('Email', user.email).input('Name', user.name).input('Role', user.role)
      .query('INSERT INTO Users (Email, Name, Role) VALUES (@Email, @Name, @Role)');
  }
  context.res = { body: user };
};
