// geoRedirect.js

// --- Configuration ---
// IMPORTANT: You MUST set these variables before including this script on your page.
// You can either define them globally in your HTML *before* this script,
// or modify them directly here if you prefer.

// The URL to redirect to if the user is NOT in the specified country.
// Example: window.geoRedirectConfig = { redirectUrl: 'https://www.example.com/international-page' };
let redirectUrl = window.geoRedirectConfig?.redirectUrl || 'https://www.example.com/international-page'; // <<< CHANGE THIS URL TO YOUR INTERNATIONAL PAGE

// The country code to check against (e.g., 'GB' for United Kingdom).
// Example: window.geoRedirectConfig = { ukCountryCode: 'GB' };
let targetCountryCode = window.geoRedirectConfig?.targetCountryCode || 'GB'; // <<< CHANGE THIS TO YOUR DESIRED COUNTRY CODE (e.g., 'US', 'CA', 'DE')

// The ID of the HTML element where status messages will be displayed.
// Ensure an element with this ID exists on your page.
let statusElementId = window.geoRedirectConfig?.statusElementId || 'geo-status-message'; // <<< ENSURE AN ELEMENT WITH THIS ID EXISTS ON YOUR PAGE

// --- Main Logic ---
document.addEventListener('DOMContentLoaded', async () => {
    const statusMessageDiv = document.getElementById(statusElementId);

    // Function to update the status message on the page.
    const updateStatus = (message, type = 'loading') => {
        if (statusMessageDiv) {
            statusMessageDiv.textContent = message;
            statusMessageDiv.classList.remove('loading-message', 'success-message', 'error-message');
            if (type === 'loading') {
                statusMessageDiv.classList.add('loading-message', 'text-gray-600');
            } else if (type === 'success') {
                statusMessageDiv.classList.add('success-message', 'text-green-600', 'font-bold');
            } else if (type === 'error') {
                statusMessageDiv.classList.add('error-message', 'text-red-600', 'font-bold');
            }
        } else {
            console.warn(`Element with ID '${statusElementId}' not found. Status messages will not be displayed.`);
        }
    };

    updateStatus('Checking your location...');

    try {
        // Fetch IP-based location data from ipapi.co.
        // This service provides a free API for basic geo-IP lookups.
        // It returns a JSON object containing country_code, country_name, etc.
        const response = await fetch('https://ipapi.co/json/');

        // Check if the network request was successful.
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the JSON response.
        const data = await response.json();

        // Log the full data for debugging purposes (optional).
        console.log('Location data:', data);

        // Check if the country_code property exists and matches the target country code.
        if (data && data.country_code && data.country_code.toUpperCase() === targetCountryCode.toUpperCase()) {
            // User is in the target country. Display a success message.
            updateStatus(`You are in ${data.country_name || targetCountryCode}. Enjoy the content!`, 'success');
        } else {
            // User is NOT in the target country. Display a redirection message and perform the redirect.
            const userCountry = data.country_name || 'an unknown country';
            updateStatus(`You are in ${userCountry}. Redirecting...`, 'error');

            // Redirect the user to the specified URL after a short delay for the message to be seen.
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 2000); // 2-second delay
        }
    } catch (error) {
        // Handle any errors during the fetch operation (e.g., network issues, API down).
        console.error('Error fetching location data:', error);
        updateStatus('Could not determine your location. Please try again later.', 'error');
    }
});
