const apiKey = 'f0ab9630a9fc4dd0cbc331e1eef3dd95'; // 🔑 Sua chave da OpenWeatherMap

async function getWeather(city = '') {
  let url;

  if (city) {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=pt_br&units=metric`;
  } else {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&lang=pt_br&units=metric`;
        await fetchWeather(url);
      }, () => {
        document.getElementById('weather-result').innerHTML = `<p style="color:red;">Não foi possível obter sua localização.</p>`;
      });
      return;
    } else {
      document.getElementById('weather-result').innerHTML = `<p style="color:red;">Geolocalização não suportada pelo navegador.</p>`;
      return;
    }
  }

  await fetchWeather(url);
}

async function fetchWeather(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Cidade não encontrada");
    const data = await response.json();

    const result = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">
      <p><strong>Clima:</strong> ${data.weather[0].description}</p>
      <p><strong>Temperatura:</strong> ${data.main.temp}°C</p>
      <p><strong>Sensação térmica:</strong> ${data.main.feels_like}°C</p>
      <p><strong>Pressão atmosférica:</strong> ${data.main.pressure} hPa</p>
    `;

    document.getElementById('weather-result').innerHTML = result;
  } catch (error) {
    document.getElementById('weather-result').innerHTML = `<p style="color:red;">Erro: ${error.message}</p>`;
  }
}

// Executa ao carregar a página
window.onload = () => {
  getWeather();
};

// Ação do botão
document.querySelector('button').onclick = () => {
  const city = document.getElementById('city-input').value.trim();
  if (!city) {
    alert('Por favor, digite o nome de uma cidade!');
    return;
  }
  getWeather(city);
};
