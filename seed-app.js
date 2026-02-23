const fs = require('fs');
const path = require('path');

const seedApp = async () => {
    try {
        // 1. Create a User
        console.log("Creating user...");
        const userRes = await fetch('http://localhost:8080/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: "Jane Smith", email: "jane@example.com", role: 'APPLICANT' })
        });
        const userData = await userRes.json();
        console.log("User:", userData);

        // 2. Upload file
        console.log("Uploading resume...");
        const fileContent = fs.readFileSync('test-resume.doc');
        const filename = 'test-resume.doc';

        // Manual multipart/form-data creation for Node < 18 or environment without FormData
        const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
        const crlf = '\r\n';

        const payload = Buffer.concat([
            Buffer.from(`--${boundary}${crlf}Content-Disposition: form-data; name="applicantId"${crlf}${crlf}${userData.id}${crlf}`),
            Buffer.from(`--${boundary}${crlf}Content-Disposition: form-data; name="jobRoleId"${crlf}${crlf}5${crlf}`),
            Buffer.from(`--${boundary}${crlf}Content-Disposition: form-data; name="resume"; filename="${filename}"${crlf}Content-Type: application/msword${crlf}${crlf}`),
            fileContent,
            Buffer.from(`${crlf}--${boundary}--${crlf}`)
        ]);

        const uploadRes = await fetch('http://localhost:8080/api/applications/upload', {
            method: 'POST',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`
            },
            body: payload,
        });

        const result = await uploadRes.json();
        console.log("Application:", result);
    } catch (e) {
        console.error("App Error:", e);
    }
};

seedApp();
