export const buildSlides = () => {
    return [1, 2, 3, 4, 5].map((n) => ({
        id: String(n),
        src: require(`../img/carrusel/${n}.png`),
        alt: `Slide ${n}`,
    }));
};