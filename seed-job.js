const seedJob = async () => {
    try {
        const res = await fetch("http://localhost:8080/api/jobs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: "Frontend Developer",
                requiredSkills: "React, TypeScript",
                companyId: 1
            })
        });
        const data = await res.json();
        console.log("Job:", data);
    } catch (e) {
        console.error("Job Error:", e);
    }
};

seedJob();
