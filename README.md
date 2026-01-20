# 🌦️ Weather App

A modern, responsive weather app that displays current, hourly, and weekly forecasts for any city using the WeatherAPI.com service.

## 🚀 Features

- **Current Weather:** Instantly shows weather for your location or any searched city.
- **Hourly & Weekly Forecasts:** Get detailed 24-hour and 5-day forecasts.
- **Live Search:** City search with instant suggestions (debounced).
- **Air Quality Index:** Displays AQI rating and commentary.
- **Unit Details:** Feels like, Heat Index, Pressure, Wind Speed, Visibility, and more.
- **UV & Sunrise/Sunset:** Shows UV index and sun timings.
- **Responsive Design:** Looks great on any device.
- **Error Handling:** User-friendly messages for API, connection, or city-not-found issues.

## 🖥️ Demo

[https://weather-core.vercel.app](https://weather-core.vercel.app)

---

## 🛠️ Getting Started

### 1. **Clone the Project**

```bash
git clone https://github.com/Manpreet055/Weather-app.git
cd Weather-app
```

### 2. **Install Dependencies**

```bash
npm install
```

### 3. **Set Up Environment Variables**

Create a `.env` file in the root directory:

```env
VITE_API_BASE=https://api.weatherapi.com/v1
VITE_API_KEY=your_actual_api_key_here
```

> **Note:** Get a free API key from [WeatherAPI.com](https://www.weatherapi.com/).

### 4. **Start the Development Server**

```bash
npm run dev
```

Open your browser and navigate to [http://localhost:5173](http://localhost:5173).

### 5. **Build for Production**

```bash
npm run build
```

---

## 🗂️ Project Structure

```
Weather-app/
├── assests/                # Images and icons
├── services/               # API call logic
├── styles/                 # CSS files
├── utils/                  # Utility functions
├── index.html              # Main HTML file
├── script.js               # Main app script (ES Module)
├── vite.config.js          # Vite configuration
├── package.json
├── .env                    # Environment variables
└── README.md
```

---

## ⚡ Technologies

- [Vite](https://vitejs.dev/) – Fast build tool and dev server
- [Axios](https://axios-http.com/) – HTTP requests
- [WeatherAPI.com](https://www.weatherapi.com/) – Weather data source
- [Poppins Font](https://fonts.google.com/specimen/Poppins)
- CSS3

---

## 📝 Usage Notes

- Make sure to use a valid WeatherAPI key in your `.env` file.
- This project uses ES modules, so your script tags and imports must be correctly configured (`type="module"` in HTML).
- For best experience, run with Vite, as described above.

---

## 🤝 Contribution

Pull requests and issues are welcome! Please open an issue for bugs/suggestions or a PR for code improvements.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

- [WeatherAPI.com](https://www.weatherapi.com/) for the API and their free tier.
- [Vite](https://vitejs.dev/) for making frontend development fast and fun.

---

**Made with ❤️ by [Manpreet055](https://github.com/Manpreet055)**
