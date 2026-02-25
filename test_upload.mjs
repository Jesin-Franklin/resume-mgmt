async function testUpload() {
    try {
        // 1. Create a user
        const userRes = await fetch('http://localhost:8080/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'API Tester', email: 'api@tester.com', role: 'APPLICANT' })
        });
        const user = await userRes.json();
        console.log('User created:', user);

        // 2. Get first job
        const jobsRes = await fetch('http://localhost:8080/api/jobs');
        const jobs = await jobsRes.json();
        const job = jobs[0];
        console.log('Using job:', job);

        // 3. Upload file
        const formData = new FormData();
        formData.append('applicantId', user.id.toString());
        formData.append('jobRoleId', job.id.toString());

        // Create a Blob from dummy data
        const dummyContent = 'This is a dummy resume.';
        const blob = new Blob([dummyContent], { type: 'application/pdf' });
        formData.append('resume', blob, 'dummy.pdf');

        const uploadRes = await fetch('http://localhost:8080/api/applications/upload', {
            method: 'POST',
            body: formData
        });

        if (uploadRes.ok) {
            const app = await uploadRes.json();
            console.log('Application submitted successfully:', JSON.stringify(app, null, 2));
        } else {
            console.error('Failed to submit application. Status:', uploadRes.status);
        }
    } catch (e) {
        console.error(e);
    }
}

testUpload();
