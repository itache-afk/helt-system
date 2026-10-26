const crud = require('./crud');

exports.medicine = crud({
  table: 'medicine',
  fields: ['name', 'medical_name', 'price', 'dosage'],
});

exports.illness = crud({
  table: 'illness',
  fields: ['name', 'severe_level', 'medicine_id'],
  alias: 'i',
  baseSql: `SELECT i.*, m.name AS medicine_name, m.dosage
            FROM illness i LEFT JOIN medicine m ON i.medicine_id = m.id`,
});

// Users are created through /auth/register, and the password is never returned.
exports.users = crud({
  table: 'users',
  fields: ['name', 'age', 'sex'],
  allowCreate: false,
  returning: 'id, name, age, sex, email',
  baseSql: 'SELECT t.id, t.name, t.age, t.sex, t.email FROM users t',
});

exports.userIllness = crud({
  table: 'user_illness',
  fields: ['user_id', 'illness_id'],
  alias: 'ui',
  baseSql: `SELECT ui.id, ui.user_id, u.name AS user_name,
                   ui.illness_id, i.name AS illness, i.severe_level,
                   m.name AS medicine, m.dosage
            FROM user_illness ui
            JOIN users u ON ui.user_id = u.id
            JOIN illness i ON ui.illness_id = i.id
            LEFT JOIN medicine m ON i.medicine_id = m.id`,
});