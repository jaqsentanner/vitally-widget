// Secret Phrase Simulation
const secretPhrase = "bradiscool!"; // Set your secret phrase here

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

// The rest of your code for generating the report and deleting user sessions stays the same
document.getElementById("generate-report-btn").addEventListener("click", function() {
    // Fetch sessions and generate report
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

document.getElementById("delete-user-btn").addEventListener("click", function() {
    const userName = document.getElementById("user-name").value;

    if (userName) {
        // Check which function to call (byeByeMonica or byeByeUser)
        if (userName === "Monica Hall") {
            byeByeMonica('./user-sessions.txt', './tr-data-delete.txt');  // Standard file output
        } else {
            byeByeUser('./user-sessions.txt', userName);  // Dynamic deletion and browser download
        }

        // Optionally, trigger a file download (for byeByeMonica, it will be done as usual)
        const link = document.getElementById("download-delete");
        link.style.display = 'block';
    }
});