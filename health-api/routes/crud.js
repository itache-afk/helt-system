const express = require('express');
const pool = require('../db');

module.exports = ({
  table,
  fields,
  baseSql = `SELECT * FROM ${table} t`,
  alias = 't',
  returning = '*',
  allowCreate = true,
}) => {
  const router = express.Router();
  const cols = fields.join(', ');
  const placeholders = fields.map((_, i) => `$${i + 1}`).join(', ');
  const sets = fields.map((f, i) => `${f}=$${i + 1}`).join(', ');
  const values = (body) => fields.map((f) => body[f]);

  const fail = (res, err) => {
    if (err.code === '23503')
      return res.status(400).json({ error: 'Referenced record does not exist' });
    if (err.code === '23502')
      return res.status(400).json({ error: 'A required field is missing' });
    res.status(500).json({ error: err.message });
  };

  // CREATE
  if (allowCreate) {
    router.post('/', async (req, res) => {
      try {
        const { rows } = await pool.query(
          `INSERT INTO ${table} (${cols}) VALUES (${placeholders}) RETURNING ${returning}`,
          values(req.body)
        );
        res.status(201).json(rows[0]);
      } catch (err) { fail(res, err); }
    });
  }

  // READ ALL
  router.get('/', async (req, res) => {
    try {
      const { rows } = await pool.query(`${baseSql} ORDER BY ${alias}.id`);
      res.json(rows);
    } catch (err) { fail(res, err); }
  });

  // READ ONE
  router.get('/:id', async (req, res) => {
    try {
      const { rows } = await pool.query(`${baseSql} WHERE ${alias}.id=$1`, [req.params.id]);
      if (!rows[0]) return res.status(404).json({ error: 'Not found' });
      res.json(rows[0]);
    } catch (err) { fail(res, err); }
  });

  // UPDATE
  router.put('/:id', async (req, res) => {
    try {
      const { rows } = await pool.query(
        `UPDATE ${table} SET ${sets} WHERE id=$${fields.length + 1} RETURNING ${returning}`,
        [...values(req.body), req.params.id]
      );
      if (!rows[0]) return res.status(404).json({ error: 'Not found' });
      res.json(rows[0]);
    } catch (err) { fail(res, err); }
  });

  // DELETE
  router.delete('/:id', async (req, res) => {
    try {
      const { rowCount } = await pool.query(`DELETE FROM ${table} WHERE id=$1`, [req.params.id]);
      if (!rowCount) return res.status(404).json({ error: 'Not found' });
      res.json({ message: 'Deleted' });
    } catch (err) { fail(res, err); }
  });

  return router;
};