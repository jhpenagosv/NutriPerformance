import MateriasModel from "../models/materiasPrimas.model.js";

export async function listarMateriasPrimas(req, res, next) {
  try {
    const rows = await MateriasModel.findAll(); // ya agrupado y promediado
    res.json(rows);
  } catch (err) {
    next(err);
  }
}
