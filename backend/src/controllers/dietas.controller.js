import MateriasModel from "../models/materiasPrimas.model.js";

export async function listarMateriasPrimas(req, res, next) {
  try {
    const rows = await MateriasModel.findAll();
    res.json(rows);
  } catch (err) {
    next(err);   // <- importante para ver el sqlMessage
  }
}
