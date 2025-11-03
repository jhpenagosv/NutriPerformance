import api from "./client";

export const getMaterias = async ({ q = "", clasificacionId = "" } = {}) => {
    const params = {};
    if (q) params.q = q;
    if (clasificacionId) params.clasificacionId = clasificacionId;
    const { data } = await api.get("/materias", { params });
    return data;
};

export const getPromedioMateria = async (id) => {
    const { data } = await api.get(`/materias/${id}/composicion-promedio`);
    return data;
};

export const getComposicionPromedio = async (params = {}) => {
    const { data } = await api.get("/materias/composicion-promedio", { params });
    return data;
};