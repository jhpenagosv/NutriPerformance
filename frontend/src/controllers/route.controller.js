import { routes } from "../models/route.model";
import Inicio from "../views/Inicio/Inicio";
import Dieta from "../views/Dieta/Dieta";
import MateriasPrimas from "../views/Materias/MateriasPrimas";
import Acerca from "../views/Acerca/Acerca";

export const routeController = [
    { path: routes.inicio, element: <Inicio /> },
    { path: routes.dieta, element: <Dieta /> },
    { path: routes.materias, element: <MateriasPrimas /> },
    { path: routes.acerca, element: <Acerca /> },
];