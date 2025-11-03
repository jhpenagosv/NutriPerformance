import { useMemo, useState } from "react";
import { RN_DATA, buildHierarchy } from "../models/reqNutricional.model";

export function useReqNutricionalController() {
    const { topLevel, childrenByParent, parentsWithChildren } = useMemo(
        () => buildHierarchy(RN_DATA),
        []
    );

    const [expanded, setExpanded] = useState(new Set());
    const toggle = (id) => {
        setExpanded(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const isOpen = (id) => expanded.has(id);

    return { topLevel, childrenByParent, parentsWithChildren, isOpen, toggle };
}