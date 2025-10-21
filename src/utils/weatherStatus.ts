export type WeatherSnapshot = {
  weather_code: number;
  precipitation: number;
  temperature_2m?: number;
};

export function statusFromWeather(pokemonType: string, w: WeatherSnapshot): string {
  const raining = w.precipitation > 0 
    || [51,53,55,61,63,65,66,67,80,81,82,95,96,99].includes(w.weather_code);
  const hot = w.temperature_2m !== undefined && w.temperature_2m >= 30;
  const warm = w.temperature_2m !== undefined && w.temperature_2m >= 25 && w.temperature_2m < 30;
  const cold = w.temperature_2m !== undefined && w.temperature_2m < 0;

  switch (pokemonType) {
    case 'fire':
      if (raining) {
        return 'Il pleut : désavantage pour le type feu (attaques feu moins efficaces).';
      }
      if (hot) {
        return 'Grand soleil / forte chaleur : avantage pour le type feu.';
      }
      if (warm) {
        return 'Temps chaud : légère amélioration pour le type feu.';
      }
      return 'Conditions normales pour le type feu.';
    case 'water':
      if (raining) {
        return 'Pluie : avantage pour le type eau.';
      }
      if (hot) {
        return 'Chaleur importante : type eau peut souffrir de sécheresse relative.';
      }
      if (warm) {
        return 'Temps chaud : bon pour le type eau mais attention à l’évaporation.';
      }
      return 'Conditions normales pour le type eau.';
    case 'grass':
      if (raining) {
        return 'Pluie : avantage pour le type plante.';
      }
      if (hot) {
        return 'Soleil fort : avantage pour le type plante.';
      }
      if (warm) {
        return 'Temps chaud : plante en croissance.';
      }
      if (cold) {
        return 'Froid : désavantage pour le type plante (croissance ralentie).';
      }
      return 'Conditions normales pour le type plante.';
    case 'electric':
      if ([95,96,99,80,81,82].includes(w.weather_code)) {
        return 'Orages/averses : avantage pour le type électrique.';
      }
      if (hot) {
        return 'Chaleur extrême peut limiter certains systèmes électriques.';
      }
      if (warm) {
        return 'Temps chaud : conditions optimales pour le type électrique.';
      }
      return 'Conditions standard pour le type électrique.';
    case 'ice':
      if ([71,73,75,77].includes(w.weather_code)) {
        return 'Neige : avantage pour le type glace.';
      }
      if (hot) {
        return 'Forte chaleur: désavantage pour le type glace (risque de fonte).';
      }
      if (cold) {
        return 'Froid intense : avantage pour le type glace.';
      }
      return 'Conditions normales pour le type glace.';
    default:
      if (hot) {
        return 'Chaleur importante : impact neutre sauf pour certains types spécifiques.';
      }
      if (cold) {
        return 'Froid important : impact neutre sauf pour certains types spécifiques.';
      }
      return 'Impact météo neutre pour ce type.';
  }
}
