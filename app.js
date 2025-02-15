window.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.querySelector('#cityInput');
    const findCity = document.querySelector('#findCity');
    const cityName = document.querySelector('#city');
    const countryName = document.querySelector('#country');
    const fajr = document.querySelector('#fajr');
    const shrouq = document.querySelector('#shrouq');
    const zohr = document.querySelector('#zohr');
    const asr = document.querySelector('#asr');
    const maghreb = document.querySelector('#maghreb');
    const isha = document.querySelector('#isha');
    const timeLeft = document.querySelector('#timeLeft');
    const nextSalah = document.querySelector('#nextSalah');

    let prayerTimes = {};
    let nextPrayerElement = null;
    let intervalId = null;

    function updateTimeLeft() {
        if (!Object.keys(prayerTimes).length) return;

        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Fajr'];
        const elements = { Fajr: fajr, Dhuhr: zohr, Asr: asr, Maghrib: maghreb, Isha: isha };
        
        // Reset all prayer elements to default style
        Object.values(elements).forEach(el => {
            el.parentElement.classList.remove('bg-[#1E6F50]', 'text-white');
            el.parentElement.classList.add('bg-[#F2F8F6]', 'text-black');
        });
        
        let nextPrayer = null;
        let nextPrayerTime = null;

        for (let i = 0; i < prayerOrder.length; i++) {
            const prayer = prayerOrder[i];
            if (!prayerTimes[prayer]) continue;
            
            const [hours, minutes] = prayerTimes[prayer].split(':').map(Number);
            const prayerTime = hours * 60 + minutes;

            if (prayerTime > currentTime) {
                nextPrayer = prayer;
                nextPrayerTime = prayerTime;
                break;
            }
        }

        if (!nextPrayer) {
            nextPrayer = 'Fajr';
            const [hours, minutes] = prayerTimes['Fajr'].split(':').map(Number);
            nextPrayerTime = hours * 60 + minutes + 1440;
        }

        let timeDiff = nextPrayerTime - currentTime;
        let hoursLeft = Math.floor(timeDiff / 60);
        let minutesLeft = timeDiff % 60;
        let secondsLeft = 59 - now.getSeconds();

        function formatTime(num) {
            return num < 10 ? `0${num}` : num;
        }

        timeLeft.textContent = `${formatTime(hoursLeft)}:${formatTime(minutesLeft)}:${formatTime(secondsLeft)}`;
        let arSalah;

        if(nextPrayer=== 'Fajr'){
            arSalah = 'الفجر'
        }else if (nextPrayer=== 'Dhuhr'){
            arSalah = 'الظهر'
        }
        else if (nextPrayer=== 'Asr'){
            arSalah = 'العصر'
        }
        else if (nextPrayer=== 'Maghrib'){
            arSalah = 'المغرب'
        }
        else if (nextPrayer=== 'Isha'){
            arSalah = 'العشاء'
        }

        // Update only the next prayer element
        nextSalah.textContent = `صلاة ${arSalah}`;
        nextPrayerElement = elements[nextPrayer];
        nextPrayerElement.parentElement.classList.remove('bg-[#F2F8F6]', 'text-black');
        nextPrayerElement.parentElement.classList.add('bg-[#1E6F50]', 'text-white');
    }

    async function getPrayerTimes(city, country) {
        try {
            const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=2`);
            if (!res.ok) throw new Error('Failed to fetch prayer times');
            
            const data = await res.json();
            if (!data.data) throw new Error('Invalid city name');

            prayerTimes = {
                'Fajr': data.data.timings.Fajr,
                'Dhuhr': data.data.timings.Dhuhr,
                'Asr': data.data.timings.Asr,
                'Maghrib': data.data.timings.Maghrib,
                'Isha': data.data.timings.Isha
            };

            fajr.textContent = prayerTimes['Fajr'];
            shrouq.textContent = data.data.timings.Sunrise;
            zohr.textContent = prayerTimes['Dhuhr'];
            asr.textContent = prayerTimes['Asr'];
            maghreb.textContent = prayerTimes['Maghrib'];
            isha.textContent = prayerTimes['Isha'];
            
            if (intervalId) clearInterval(intervalId);
            updateTimeLeft();
            intervalId = setInterval(updateTimeLeft, 1000);
        } catch (error) {
            console.error(error.message);
            alert('Invalid city name or unable to fetch prayer times. Please try again.');
        }
    }

    async function getCityAndCountry(lat, lon) {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=ar`);
            if (!res.ok) throw new Error('Failed to fetch location data');
            
            const data = await res.json();
            const city = data.address.city || data.address.town || data.address.village;
            const country = data.address.country;

            if (!city || !country) throw new Error('Could not determine city or country');
            
            cityName.textContent = `المدينة : ${city}`;
            countryName.textContent = `الدولة : ${country}`;
            getPrayerTimes(city, country);
        } catch (error) {
            console.error(error.message);
        }
    }

    function getUserLocation() {
        fetch("https://geolocation-db.com/json/")
            .then(response => response.json())
            .then(data => {
                if (!data.latitude || !data.longitude) throw new Error('Invalid location data');
                getCityAndCountry(data.latitude, data.longitude);
            })
            .catch(error => console.log("Error fetching location:", error));
    }

    async function getCountryByCity(city) {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1&addressdetails=1&accept-language=ar`);
            
            if (!res.ok) throw new Error(`Failed to fetch country data. Status: ${res.status}`);
            
            const data = await res.json();
            if (!data.length) throw new Error('Invalid city name');
    
            const location = data[0];
            const countryName = location.address?.country || "Unknown Country";
            const countryCode = location.address?.country_code?.toUpperCase() || "UNKNOWN";
    
            console.log(`🌍 City: ${city} → Country: ${countryName} (${countryCode})`);
    
            return { countryCode, countryName };
        } catch (error) {
            console.error(error.message);
            alert('❌ Invalid city name. Please enter a valid city.');
            return null;
        }
    }
    
    

    getUserLocation();
});
