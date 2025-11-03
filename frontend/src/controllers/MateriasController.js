import { getClasificaciones } from "../Api/clasificacion.api";
import { getMaterias, getPromedioMateria } from "../Api/materia.api";
import { pickDetalleKeys } from "../models/MateriasModel";

export async function cargarClasificaciones() {
    return await getClasificaciones();
}

export async function buscarMaterias({ q, clasificacionId }) {
    return await getMaterias({ q, clasificacionId });
}

export async function cargarDetalleMateria(id) {
    const raw = await getPromedioMateria(id);
    return { ...raw, detalle: pickDetalleKeys(raw) };
}