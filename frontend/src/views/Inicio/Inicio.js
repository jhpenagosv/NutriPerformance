import React from "react";
import "./Inicio.css";
import { buildSlides } from "../../models/slide.model";
import { CarouselController } from "../../controllers/CarouselController";
import { SideStatsController } from "../../controllers/SideStatsController";

export default function Inicio() {
    const slides = React.useMemo(buildSlides, []);
    const [carousel] = React.useState(() => new CarouselController({ intervalMs: 4500 }));
    const [vmCar, setVmCar] = React.useState(carousel.snapshot());

    const [sideCtrl] = React.useState(() => new SideStatsController({ refreshMs: 30000 }));
    const [vmSide, setVmSide] = React.useState(sideCtrl.snapshot());

    // Carrusel
    React.useEffect(() => {
        const unsub = carousel.subscribe(setVmCar);
        carousel.play(slides.length);

        const onVisibility = () => (document.hidden ? carousel.pause() : carousel.play(slides.length));
        const onBlur = () => carousel.pause();
        const onFocus = () => carousel.play(slides.length);

        document.addEventListener("visibilitychange", onVisibility);
        window.addEventListener("blur", onBlur);
        window.addEventListener("focus", onFocus);

        return () => {
            document.removeEventListener("visibilitychange", onVisibility);
            window.removeEventListener("blur", onBlur);
            window.removeEventListener("focus", onFocus);
            carousel.destroy();
            unsub?.();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [carousel, slides.length]);

    // Panel lateral dinámico
    React.useEffect(() => {
        const unsub = sideCtrl.subscribe(setVmSide);
        sideCtrl.start();
        const onVisibility = () => (document.hidden ? sideCtrl.pause() : sideCtrl.start());
        document.addEventListener("visibilitychange", onVisibility);
        return () => {
            document.removeEventListener("visibilitychange", onVisibility);
            sideCtrl.destroy();
            unsub?.();
        };
    }, [sideCtrl]);

    const current = slides[vmCar.index];

    return (
        <div className="home-wrap">
            {/* Carrusel */}
            <div
                className="carousel"
                onMouseEnter={() => carousel.pause()}
                onMouseLeave={() => carousel.play(slides.length)}
                role="region"
                aria-label="Carrusel de imágenes"
            >
                <div className="slide">
                    <img
                        key={current?.id}
                        src={current?.src}
                        alt={current?.alt}
                        className="slide-img"
                        draggable="false"
                    />
                    <button className="nav-btn left" aria-label="Anterior" onClick={() => carousel.prev(slides.length)}>‹</button>
                    <button className="nav-btn right" aria-label="Siguiente" onClick={() => carousel.next(slides.length)}>›</button>

                    <div className="dots">
                        {slides.map((s, i) => (
                            <button
                                key={s.id}
                                className={`dot ${i === vmCar.index ? "active" : ""}`}
                                aria-label={`Ir al slide ${i + 1}`}
                                onClick={() => carousel.goTo(i, slides.length)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Lateral dinámico */}
            <aside className="home-side">
                <div className="side-card">
                    <div className="side-head">
                        <div className="side-icon" aria-hidden>📦</div>
                        <div>
                            <div className="side-total">{vmSide.total}</div>
                            <div className="side-title">Clasificación de materias primas</div>
                        </div>
                    </div>

                    {vmSide.error && (
                        <div style={{ color: "#b91c1c", marginBottom: 8 }}>{vmSide.error}</div>
                    )}

                    <ul className="side-list">
                        {vmSide.items.map((it) => (
                            <li key={it.id} className="side-item">
                                <span className="side-name">{it.nombre}</span>
                                <span className="side-count">{it.count}</span>
                            </li>
                        ))}
                        {!vmSide.items.length && vmSide.loading && (
                            <li className="side-item">
                                <span className="side-name">Cargando…</span>
                                <span className="side-count">—</span>
                            </li>
                        )}
                    </ul>
                </div>
            </aside>
        </div>
    );
}
