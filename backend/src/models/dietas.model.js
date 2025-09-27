import pool from "../config/db.js";

const DietasModel = {
  async createDraft() {
    const [r] = await pool.query("INSERT INTO dietas () VALUES ()");
    return r.insertId;
  },

  async upsertDatosAnimal(dietaId, data) {
    const {
      tipo = null, sistema = null, sexo = null,
      peso_ini = null, peso_fin = null, peso_prom = null, peso_dia = null
    } = data || {};

    const [rows] = await pool.query(
      "SELECT id FROM datos_animal WHERE dieta_id = ?", [dietaId]
    );

    if (rows.length) {
      await pool.query(
        `UPDATE datos_animal
         SET tipo=?, sistema=?, sexo=?, peso_ini=?, peso_fin=?, peso_prom=?, peso_dia=?
         WHERE dieta_id=?`,
        [tipo, sistema, sexo, peso_ini, peso_fin, peso_prom, peso_dia, dietaId]
      );
    } else {
      await pool.query(
        `INSERT INTO datos_animal
         (dieta_id, tipo, sistema, sexo, peso_ini, peso_fin, peso_prom, peso_dia)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [dietaId, tipo, sistema, sexo, peso_ini, peso_fin, peso_prom, peso_dia]
      );
    }
  },

  async replaceRequisitos(dietaId, items) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      await conn.query("DELETE FROM requisitos_nutri WHERE dieta_id = ?", [dietaId]);
      if (items.length) {
        const values = items.map(it => [
          dietaId, it.code, it.label, it.medida || null, it.valor || null
        ]);
        await conn.query(
          "INSERT INTO requisitos_nutri (dieta_id, code, label, medida, valor) VALUES ?",
          [values]
        );
      }
      await conn.commit();
    } catch (e) {
      await conn.rollback(); throw e;
    } finally { conn.release(); }
  },

  async replaceSeleccion(dietaId, materiaPrimaIds) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      await conn.query("DELETE FROM dietas_seleccion WHERE dieta_id = ?", [dietaId]);
      if (materiaPrimaIds.length) {
        const values = materiaPrimaIds.map(id => [dietaId, id]);
        await conn.query(
          "INSERT INTO dietas_seleccion (dieta_id, materia_prima_id) VALUES ?",
          [values]
        );
      }
      await conn.commit();
    } catch (e) {
      await conn.rollback(); throw e;
    } finally { conn.release(); }
  },

  async replaceRestricciones(dietaId, filas) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      await conn.query("DELETE FROM restricciones WHERE dieta_id = ?", [dietaId]);
      if (filas.length) {
        const values = filas.map(r => [
          dietaId,
          r.materia_prima_id,
          r.costo,
          r.min ?? null,
          r.max ?? null
        ]);
        await conn.query(
          "INSERT INTO restricciones (dieta_id, materia_prima_id, costo, min_val, max_val) VALUES ?",
          [values]
        );
      }
      await conn.commit();
    } catch (e) {
      await conn.rollback(); throw e;
    } finally { conn.release(); }
  },

  async getFull(dietaId) {
    const [[dieta]] = await pool.query("SELECT * FROM dietas WHERE id = ?", [dietaId]);
    if (!dieta) return null;

    const [[datos]] = await pool.query(
      "SELECT * FROM datos_animal WHERE dieta_id = ?",
      [dietaId]
    );
    const [requisitos] = await pool.query(
      "SELECT code,label,medida,valor FROM requisitos_nutri WHERE dieta_id = ?",
      [dietaId]
    );
    const [seleccion] = await pool.query(
      `SELECT ds.materia_prima_id AS id, mp.nombre
       FROM dietas_seleccion ds
       JOIN materias_primas mp ON mp.id = ds.materia_prima_id
       WHERE ds.dieta_id = ?`,
      [dietaId]
    );
    const [restricciones] = await pool.query(
      `SELECT r.materia_prima_id AS id, mp.nombre,
              r.costo, r.min_val AS min, r.max_val AS max
       FROM restricciones r
       JOIN materias_primas mp ON mp.id = r.materia_prima_id
       WHERE r.dieta_id = ?`,
      [dietaId]
    );

    return { dieta, datos_animal: datos || null, requisitos, seleccion, restricciones };
  }
};

export default DietasModel;