// src/controllers/materiasPrimas.controller.js
import { findAll, findRaw } from "../models/materiasPrimas.model.js";

export async function getMateriasPrimas(req, res, next) {
  try {
    const rows = await findAll();
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

// (Opcional) valores crudos
export async function getMateriasPrimasRaw(req, res, next) {
  try {
    const rows = await findRaw();
    res.json(rows);
  } catch (err) {
    next(err);
  }
}
