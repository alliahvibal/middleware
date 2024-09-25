const fs = require('fs-extra');
const path = require('path');

// File path for HTML logging
const logFilePath = path.join(__dirname, 'logs', 'requests.html');

fs.ensureDirSync(path.dirname(logFilePath));

// Create the HTML structure
if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(
        logFilePath,
        `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Request Logs</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f4f4f4; }
        tr:nth-child(even) { background-color: #f9f9f9; }
    </style>
</head>
<body>
    <h2>Request Logs</h2>
    <table>
        <tr>
            <th>Timestamp</th>
            <th>Method</th>
            <th>URL</th>
            <th>IP Address</th>
            <th>Response Time (ms)</th>
        </tr>
`,
        (err) => {
            if (err) console.error('Failed to create log file:', err);
        }
    );
}

// Custom logger middleware function
const logger = (req, res, next) => {
    const startTime = Date.now(); // Start time

    res.on('finish', () => {
        const responseTime = Date.now() - startTime; // Calculate response time
        const logEntry = `
        <tr>
            <td>${new Date().toISOString()}</td>
            <td>${req.method}</td>
            <td>${req.originalUrl}</td>
            <td>${req.ip}</td>
            <td>${responseTime}</td>
        </tr>
        `;

        // Append the log entry to the HTML log file
        fs.appendFile(logFilePath, logEntry, (err) => {
            if (err) {
                console.error('Failed to write log entry:', err);
            }
        });
    });

    next();
};

module.exports = logger;
