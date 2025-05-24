(() => {
    // Check if the script has already been injected
    if (document.getElementById('injected-lock-screen')) {
        return;
    }

    // --- Customization Variables ---
    let username = "Guest User"; // Default username
    let backgroundImageLink = "https://images.unsplash.com/photo-1519681393784-d120267933ba"; // Default background image (Unsplash)
    let shuttingDownCausesBlackScreen = true; // true: simulate black screen, false: reload page
    let password = "password"; // Default password
    let lockScreenBackgroundColor = '#0c1e30'; // Default background color
    let textColor = '#ffffff'; // Default text color
    let headingFontSize = '90px';  // Default heading font size
    let bodyFontSize = '24px';    // Default body font size
    let useBlur = true; // default blur
    let borderRadius = '6px'; // default border radius
    let buttonBackgroundColor = 'rgba(255, 255, 255, 0.3)';
    let buttonTextColor = '#ffffff';
    let buttonHoverColor = 'rgba(255, 255, 255, 0.4)';
    let buttonActiveColor = 'rgba(255, 255, 255, 0.5)';
    let errorMessageColor = '#f06292';
    let powerIconColor = 'invert(100%)'; // Make the icon white


    // Create a new div element to hold the lock screen
    const lockScreenContainer = document.createElement('div');
    lockScreenContainer.id = 'injected-lock-screen';

    // Set the HTML content of the container
    lockScreenContainer.innerHTML = `
        <div class="lock-screen">
            <div class="date-time-container">
                <div class="time-date">
                    <div id="time"></div>
                    <div id="date"></div>
                </div>
             </div>
            <div class="user-info">
                <div id="username">${username}</div>
                <div class="password-input-container">
                    <input type="password" id="password" placeholder="Enter your password">
                    <button id="login-button">Sign in</button>
                    <div id="error-message" style="display: none;">Incorrect password. Please try again.</div>
                </div>
            </div>
            <div class="power-controls">
                <div class="power-icon" id="sleep-button" title="Sleep">
                    <img src="https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/moon.svg" alt="Sleep">
                </div>
                <div class="power-icon" id="shutdown-button" title="Shut down">
                    <img src="https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/power.svg" alt="Shut down">
                </div>
                <div class="power-icon" id="restart-button" title="Restart">
                  <img src="https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/rotate-ccw.svg" alt="Restart">
                </div>
            </div>
        </div>
        <style>
            body {
                margin: 0;
                font-family: 'Roboto', sans-serif;
                background-color: ${lockScreenBackgroundColor};
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                overflow: hidden;
                background-image: url('${backgroundImageLink}'); /* Apply background image */
                background-size: cover; /* Cover the entire screen */
                background-position: center; /* Center the image */
            }

            .lock-screen {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background-color: rgba(0, 0, 0, 0.2);
                backdrop-filter: ${useBlur ? 'blur(10px)' : 'none'};
                box-sizing: border-box;
            }

            .time-date {
                color: ${textColor};
                text-align: center;
                margin-bottom: 20px;
                width: 100%;
            }

            #time {
                font-size: ${headingFontSize};
                font-weight: 500;
                letter-spacing: -5px;
                text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);
                width: 100%;
                text-align: center;
            }

            #date {
                font-size: ${bodyFontSize};
                font-weight: 400;
                color: rgba(255, 255, 255, 0.8);
                text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
                width: 100%;
                text-align: center;
            }

            .user-info {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-bottom: 30px;
                width: 100%;
            }

            #username {
                font-size: 28px;
                color: ${textColor};
                font-weight: 700;
                margin-bottom: 10px;
                text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
                width: 100%;
                text-align: center;
            }

            .password-input-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 100%;
                max-width: 320px;
                padding-left: 16px;
                padding-right: 16px;
                box-sizing: border-box;
            }

            #password {
                padding: 14px 16px;
                font-size: 18px;
                border: none;
                border-radius: ${borderRadius};
                margin-bottom: 10px;
                width: 100%;
                background-color: rgba(255, 255, 255, 0.2);
                color: ${textColor};
                border: 1px solid rgba(255, 255, 255, 0.3);
                box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
                transition: all 0.3s ease;
                box-sizing: border-box;
            }

            #password:focus {
                outline: none;
                border-color: rgba(255, 255, 255, 0.5);
                background-color: rgba(255, 255, 255, 0.3);
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
            }

            #login-button {
                padding: 12px 24px;
                font-size: 18px;
                color: ${buttonTextColor};
                background-color: ${buttonBackgroundColor};
                border: none;
                border-radius: ${borderRadius};
                cursor: pointer;
                transition: background-color 0.3s ease;
                width: 100%;
                border: 1px solid rgba(255, 255, 255, 0.3);
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                box-sizing: border-box;
            }

            #login-button:hover {
                background-color: ${buttonHoverColor};
            }

            #login-button:active {
                background-color: ${buttonActiveColor};
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
            }

            #error-message {
                color: ${errorMessageColor};
                font-size: 16px;
                margin-top: 10px;
                text-align: center;
                animation: fadeIn 0.5s ease-in-out;
                background-color: rgba(0, 0, 0, 0.4);
                padding: 8px;
                border-radius: ${borderRadius};
                border: 1px solid ${errorMessageColor};
                width: 100%;
                box-sizing: border-box;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            .power-controls {
                position: fixed;
                bottom: 20px;
                right: 20px;
                display: flex;
                gap: 15px;
            }

            .power-icon {
                width: 30px;
                height: 30px;
                background-color: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                transition: background-color 0.3s ease;
                border: 1px solid rgba(255, 255, 255, 0.3);
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
            }

            .power-icon:hover {
                background-color: rgba(255, 255, 255, 0.3);
            }

            .power-icon img {
                width: 60%;
                height: 60%;
                filter: ${powerIconColor};
            }
            .date-time-container{
              display: flex;
              flex-direction: column;
              align-items: center;
              margin-bottom: 20px;
              width: 100%;
              box-sizing: border-box;
            }
        </style>
    `;

    // Override the entire body of the current page
    document.body.innerHTML = '';
    document.body.appendChild(lockScreenContainer);

    // --- Get elements from the injected HTML ---
    const injectedTimeDisplay = document.getElementById('time');
    const injectedDateDisplay = document.getElementById('date');
    const injectedPasswordInput = document.getElementById('password');
    const injectedLoginButton = document.getElementById('login-button');
    const injectedErrorMessage = document.getElementById('error-message');
    const injectedUsernameDisplay = document.getElementById('username');
    const injectedSleepButton = document.getElementById('sleep-button');
    const injectedShutdownButton = document.getElementById('shutdown-button');
    const injectedRestartButton = document.getElementById('restart-button');


    // --- Functions to update the time and date ---
    function updateInjectedTimeAndDate() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const day = now.getDate();
        const month = now.toLocaleString('default', { month: 'long' });
        const year = now.getFullYear();

        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;

        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

        injectedTimeDisplay.textContent = `${hours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
        injectedDateDisplay.textContent = `${month} ${day}, ${year}`;
    }

    // --- Event listeners for the injected elements ---
    injectedLoginButton.addEventListener('click', () => {
        const passwordValue = injectedPasswordInput.value;
        if (passwordValue === password) {
            const lockScreen = document.querySelector('.lock-screen');
            lockScreen.innerHTML = '<div style="color: white; font-size: 24px; text-align: center;">Welcome! (Simulated Login)</div>';
            setTimeout(() => {
                window.location.reload();
            }, 2000);

        } else {
            injectedErrorMessage.style.display = 'block';
            injectedPasswordInput.value = '';
            setTimeout(() => {
                injectedErrorMessage.style.display = 'none';
            }, 3000);
        }
    });

    injectedPasswordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            injectedLoginButton.click();
        }
    });

    injectedSleepButton.addEventListener('click', () => {
            simulatePowerAction('Sleeping...');
    });

    injectedShutdownButton.addEventListener('click', () => {
        if (shuttingDownCausesBlackScreen) {
            document.body.style.backgroundColor = '#000000'; // Change background to black
            document.body.innerHTML = '<div style="color: white; font-size: 24px; text-align: center;">Shutting Down...</div>'; // Optionally, show a message
        } else {
             simulatePowerAction('Shutting down...');
        }

    });

    injectedRestartButton.addEventListener('click', () => {
        simulatePowerAction('Restarting...');
    });

    function simulatePowerAction(message) {
        const lockScreen = document.querySelector('.lock-screen');
        lockScreen.innerHTML = `<div style="color: white; font-size: 24px; text-align: center;">${message}</div>`;
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }


    // Initial call and interval for time/date update
    updateInjectedTimeAndDate();
    setInterval(updateInjectedTimeAndDate, 1000);

    // --- Apply Customizations ---
    document.getElementById('username').textContent = username; // Set username
    document.body.style.backgroundImage = `url('${backgroundImageLink}')`; //set background
})();
