import { useState, useEffect } from "react";
import { Home, MapPin, Building2, Ruler, IndianRupee, Loader2 } from "lucide-react";
import "./App.css";

function App() {
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [form, setForm] = useState({
    location: "",
    bhk: "",
    size: ""
  });

  const [price, setPrice] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const bhkOptions = [1, 2, 3, 4, 5, 6];
  const sizeOptions = [500, 750, 900, 1000, 1200, 1500, 1800, 2000, 2500];

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    fetch(`${API_URL}/locations`)
      .then(res => res.json())
      .then(data => {
        setCities(data.locations);
        setFilteredCities(data.locations);
      });
  }, []);

  const handleCityChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, location: value });
    setShowDropdown(true);

    const filtered = cities.filter(city =>
      city.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCities(filtered);
  };

  const selectCity = (city) => {
    setForm({ ...form, location: city });
    setShowDropdown(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const predictPrice = async () => {
    setLoading(true);
    setError("");
    setPrice(null);

    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: form.location,
          bhk: Number(form.bhk),
          size: Number(form.size)
        })
      });

      const data = await res.json();

      if (data.error) setError(data.error);
      else setPrice(data.price);
    } catch {
      setError("Backend not responding");
    }

    setLoading(false);
  };

  const isFormValid = form.location && form.bhk && form.size;

  return (
<div 
  className="min-h-screen flex items-center justify-center p-4 relative"
  style={{
    backgroundImage: `url('https://images.pexels.com/photos/830891/pexels-photo-830891.jpeg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}
>
      

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full 
                      mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full 
                      mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                      w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </div>


      <div className="relative w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 
                      border border-white/20 transform transition-all duration-300
                      hover:shadow-3xl">
          

          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl 
                          shadow-lg animate-bounce">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
                           bg-clip-text text-transparent">
                House Price Predictor
              </h1>
              <p className="text-sm text-gray-500 mt-1">Get instant valuation</p>
            </div>
          </div>

          <div className="space-y-4">

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                <MapPin className="w-4 h-4 inline mr-1 text-blue-500" />
                Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  list="cities"
                  placeholder="Search for a city..."
                  value={form.location}
                  onChange={handleCityChange}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  className="input-field pl-10"
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                 w-4 h-4 text-gray-400" />
              </div>
             
              {showDropdown && filteredCities.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 
                              rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {filteredCities.map(city => (
                    <div
                      key={city}
                      onClick={() => selectCity(city)}
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors
                               border-b last:border-b-0 border-gray-100 text-gray-700"
                    >
                      {city}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                <Building2 className="w-4 h-4 inline mr-1 text-blue-500" />
                BHK
              </label>
              <select
                name="bhk"
                value={form.bhk}
                onChange={handleChange}
                className="select-field"
              >
                <option value="">Select number of bedrooms</option>
                {bhkOptions.map(b => (
                  <option key={b} value={b} className="py-2">
                    {b} {b === 1 ? 'Bedroom' : 'Bedrooms'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                <Ruler className="w-4 h-4 inline mr-1 text-blue-500" />
                Area (sq ft)
              </label>
              <div className="relative">
                <input
                  list="sizes"
                  name="size"
                  placeholder="Enter area in sq ft"
                  value={form.size}
                  onChange={handleChange}
                  className="input-field pl-10"
                />
                <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                w-4 h-4 text-gray-400" />
              </div>
              <datalist id="sizes">
                {sizeOptions.map(size => (
                  <option key={size} value={size} />
                ))}
              </datalist>
            </div>

            
            <button
              onClick={predictPrice}
              disabled={loading || !isFormValid}
              className="btn-primary mt-6 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Predicting...
                </>
              ) : (
                <>
                  <IndianRupee className="w-5 h-5" />
                  Predict Price
                </>
              )}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            {price && (
              <div className="result-card">
                <p className="text-sm text-blue-600 font-medium mb-2">Estimated Price</p>
                <div className="flex items-center justify-center gap-2">
                  <IndianRupee className="w-8 h-8 text-blue-600" />
                  <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
                                 bg-clip-text text-transparent">
                    {price.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">
                  *This is an approximate valuation
                </p>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-400 text-center mt-6">
            Powered by Machine Learning • Updated 2024
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;