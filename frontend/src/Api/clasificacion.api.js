import api from "./client";

export const getClasificaciones = async () => {
    const { data } = await api.get("/clasificaciones");
    return data;
};

export const getClasificacionCount = async () => {
    const { data } = await api.get("/clasificaciones/count");
    return data;
};

export const getMateriasCountByClasificacion = async () => {
    const { data } = await api.get("/clasificaciones/materias/count");
    return data;
};