const fs = require('fs');

// Crucically, per the instructions I can assume that a user will only login
// a maximum of once per day. So, I don't need to factor in multiple sessions
// counting from the same day.

// Write a function to determine how many times a user logged into Vitally.io
// each month in 2024

// Output an array of objects [{}, {}, {}]
// where each object shows the number of logins per user for a month

// I'm envisiong the shape of the data looking sort of like this

const userLoginRecord = {
    userId: "29asd929-as932a9",
    username: "bobs_username",
    month: "january",
    logins: 4
};

// I had another idea for a way to model the data, but the above object
// more closely matches the coding challenge's  requirements
// would love to talk about my idea though to store it by year when chatting
// with Brad and Aqil 

// plan of attack:
// import user-sessions.txt
// loop through each session to get the userId and the month of the login session
// we will store objects based on unique userIds and adjust the count for each month
// when necessary.

// Request #1

const userLoginsByMonth = (inputFile, outputFile) => {
    // Step 1: Read data from user-sessions.txt
    fs.readFile(inputFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        // Step 2: Parse the sessions data
        const loginSessions = JSON.parse(data);
        const loginsPerMonth = {};

        // Step 3: Process each session to count logins by month and user
        loginSessions.forEach(session => {
            const userId = session.user.id;
            const username = session.user.name;
            const sessionDate = new Date(session.date); // Convert to JS Date
            const monthYear = `${sessionDate.getFullYear()}-${sessionDate.getMonth() + 1}`;

            // I considered refactoring this to be more human readable instead of 2024-5 it could be May 2024

            // Initialize user if not already in the loginsPerMonth object
            if (!loginsPerMonth[userId]) {
                loginsPerMonth[userId] = {
                    username: username,
                    userId: userId,
                    year: sessionDate.getFullYear(),
                    logins: {}
                };
            }

            // Increment login count for the corresponding month
            if (!loginsPerMonth[userId].logins[monthYear]) {
                loginsPerMonth[userId].logins[monthYear] = 0;
            }
            loginsPerMonth[userId].logins[monthYear]++;
        });

        // Step 4: Transform the data into the expected output format
        const result = Object.keys(loginsPerMonth).map(userId => {
            const user = loginsPerMonth[userId];
            return Object.keys(user.logins).map(monthYear => ({
                userId: userId,
                username: user.username,
                month: monthYear,
                logins: user.logins[monthYear]
            }));
        }).flat();

        // Step 5: Write the result to the output file
        const outputData = JSON.stringify(result, null, 2);
        fs.writeFile(outputFile, outputData, 'utf8', (err) => {
            if (err) {
                console.error('Error writing to file:', err);
            } else {
                console.log(`Results written to ${outputFile}`);
            }
        });
    });
};

userLoginsByMonth('./user-sessions.txt', './tr-data-export.txt');

// Request #2

const byeByeMonica = (inputFile, outputFile) => {
    
    fs.readFile(inputFile, 'utf8', (err,data) => {
        if (err) {
            console.error("Error reading file: ", err);
            return;
        }

        const loginSessions = JSON.parse(data);

        const filteredSessions = loginSessions.filter(session => session.user.name !== "Monica Hall");

        const outputData = JSON.stringify(filteredSessions, null, 2);
        fs.writeFile(outputFile, outputData, 'utf8', (err) => {
            if (err) {
                console.error("Error writing to file: ", err);
            } else {
                console.log(`Results written to ${outputFile}`)
            }
        });
    });
};

byeByeMonica('./user-sessions.txt', './tr-data-delete-txt');

// New generic function to remove any user by their name
const byeByeUser = (inputFile, userName) => {
    fs.readFile(inputFile, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading file: ", err);
            return;
        }

        const loginSessions = JSON.parse(data);

        // Filter out sessions for the provided user name
        const filteredSessions = loginSessions.filter(session => session.user.name !== userName);

        const outputData = JSON.stringify(filteredSessions, null, 2);

        // Create a Blob with the filtered sessions data
        const blob = new Blob([outputData], { type: 'text/plain' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "tr-data-delete.txt"; // Set the filename for download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Clean up after download
    });
};