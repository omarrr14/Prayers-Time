document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('find-mosques-btn');
    const errorDiv = document.getElementById('error-message');
    const buttonContent = document.getElementById('button-content');
    const originalButtonContent = buttonContent.innerHTML;

    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
        errorDiv.style.fontFamily = 'Marai';
    }

    function hideError() {
        errorDiv.classList.add('hidden');
    }

    function setLoading(isLoading) {
        button.disabled = isLoading;
        button.style.fontFamily = 'Marai';
        if (isLoading) {
            buttonContent.innerHTML = `
            <svg class="animate-spin w-5 h-5 mr-2 inline" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            البحث عن مسجد قريب...
            `;
        } else {
            buttonContent.innerHTML = originalButtonContent;
        }
    }

    button.addEventListener('click', function() {
        hideError();
        setLoading(true);

        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const { latitude, longitude } = position.coords;
                    window.open(
                        `https://www.google.com/maps/search/مسجد/@${latitude},${longitude},15z`,
                        '_blank'
                    );
                    setLoading(false);
                },
                function(error) {
                    showError('Unable to get your location. Please enable location services.');
                    setLoading(false);
                }
            );
        } else {
            showError('Geolocation is not supported by your browser.');
            setLoading(false);
        }
    });
});




    // Get the Date

    const gregorianDate = new Date();
    normalDate.textContent = gregorianDate.toLocaleDateString()+ ' م';
    
    const hijriDate = new Intl.DateTimeFormat('ar-TN-u-ca-islamic', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
    }).format(new Date());
    
    higri.textContent = hijriDate;
    
    // Current Time 
    
    const now = new Date();
    const hours = now.getHours(); // 0-23 format
    const minutes = now.getMinutes().toString().padStart(2, '0'); // Add leading zero if needed
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    console.log(`${hours}:${minutes}:${seconds}`); // Example: "14:05:09"
    currentTime.textContent = `${hours}:${minutes}:${seconds}`



    // ///////////////////////////////////////////////////////

    
