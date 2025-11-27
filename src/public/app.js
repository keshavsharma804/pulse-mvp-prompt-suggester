document.getElementById("context").value = "";

async function post(url, body) {
    const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });
    return r.json();
}

document.getElementById("suggest").onclick = async () => {
    const context = document.getElementById("context").value;
    const data = await post("/api/suggest", { context });
    const cards = document.getElementById("cards");
    cards.innerHTML = "";
    data.suggestions.forEach(s => {
        const el = document.createElement("div");
        el.style.border = "1px solid #ccc"; el.style.padding = "10px"; el.style.margin = "8px 0";
        el.innerHTML = `<strong>${s.title}</strong><p>${s.description}</p>
    <pre>${s.sampleOutput}</pre>
    <button data-id="${s.id}" class="run">Run</button>`;
        cards.appendChild(el);
    });

    document.querySelectorAll(".run").forEach(btn => {
        btn.onclick = async () => {
            const id = btn.getAttribute("data-id");
            const result = await post("/api/run", { suggestionId: id, context });
            alert("Output:\\n\\n" + result.output);
        }
    })
}
