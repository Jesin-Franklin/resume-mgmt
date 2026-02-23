fetch("http://localhost:8080/api/companies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Tech Corp", description: "Top tech firm" })
}).then(res => res.json()).then(console.log).catch(console.error);
