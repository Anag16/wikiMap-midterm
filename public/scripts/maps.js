$(() => {
  const map = L.map("mapid").setView([43.65, -79.38], 13);

  // Add tileLayer to our map
  L.tileLayer(
    'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=tQiLWYMKVirRPxy8yyZn',
    {
      attribution: `
      <a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a>
      <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>`,
    }
  ).addTo(map);
});
