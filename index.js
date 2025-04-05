// Secret Phrase Simulation
const secretPhrase = "vitallysecret"; // Set your secret phrase here

document.getElementById("submit-secret").addEventListener("click", function() {
    const enteredPhrase = document.getElementById("secret-phrase").value;

    if (enteredPhrase === secretPhrase) {
        // If correct, show the main content and hide the secret phrase input
        document.getElementById("main-content").style.display = "block";
        document.getElementById("secret-phase-section").style.display = "none";
    } else {
        // If incorrect, show an error message
        document.getElementById("error-message").style.display = "block";
    }
});

// Functions for generating the report and deleting user sessions
const userLoginsByMonth = (loginSessions) => {
    const loginsPerMonth = {}; 

    loginSessions.forEach(session => {
        const userId = session.user.id;
        const username = session.user.name;
        const sessionDate = new Date(session.date); 
        const monthYear = `${sessionDate.getFullYear()}-${sessionDate.getMonth() + 1}`;

        if (!loginsPerMonth[userId]) {
            loginsPerMonth[userId] = {
                username: username,
                userId: userId,
                year: sessionDate.getFullYear(),
                logins: {}
            };
        }

        if (!loginsPerMonth[userId].logins[monthYear]) {
            loginsPerMonth[userId].logins[monthYear] = 0;
        }

        loginsPerMonth[userId].logins[monthYear]++;
    });

    const result = Object.keys(loginsPerMonth).map(userId => {
        const user = loginsPerMonth[userId];
        return Object.keys(user.logins).map(monthYear => ({
            userId: userId,
            userName: user.username,
            month: monthYear,
            logins: user.logins[monthYear]
        }));
    }).flat();

    return result;
};

const byeByeUser = (inputFile, userName) => {
    fetch(inputFile)
        .then(response => response.json())
        .then(data => {
            const filteredSessions = data.filter(session => session.user.name !== userName);
            const outputData = JSON.stringify(filteredSessions, null, 2);
            const blob = new Blob([outputData], { type: "text/plain" });
            const link = document.getElementById("download-delete");
            link.href = URL.createObjectURL(blob);
            link.style.display = "block";
        })
        .catch(error => console.error("Error fetching file:", error));
};

// Generate Report Button
document.getElementById("generate-report-btn").addEventListener("click", function() {
    fetch('./user-sessions.txt')
        .then(response => response.text())
        .then(data => {
            const sessions = JSON.parse(data);
            const result = userLoginsByMonth(sessions);

            // Create the downloadable .txt file
            const outputFile = new Blob([JSON.stringify(result, null, 2)], { type: 'text/plain' });
            const link = document.getElementById("download-report");
            link.href = URL.createObjectURL(outputFile);
            link.style.display = 'block';
        })
        .catch(err => console.error('Error fetching file:', err));
});

// Delete User Sessions Button
document.getElementById("delete-user-btn").addEventListener("click", function() {
    const userName = document.getElementById("user-name").value;

    if (userName) {
        // Check which function to call (byeByeMonica or byeByeUser)
        if (userName === "Monica Hall") {
            byeByeMonica('./user-sessions.txt', './tr-data-delete.txt');  // Standard file output
        } else {
            byeByeUser('./user-sessions.txt', userName);  // Dynamic deletion and browser download
        }

        const link = document.getElementById("download-delete");
        link.style.display = 'block';
    }
});