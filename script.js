const form = document.getElementById("job-form");
const list = document.getElementById("job-list");
const filter = document.getElementById("filter");
const search = document.getElementById("search");

let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

form.addEventListener("submit", e => {
    e.preventDefault();

    jobs.push({
        company: company.value,
        role: role.value,
        status: status.value
    });

    save();
    form.reset();
});

filter.onchange = search.oninput = render;

function save() {
    localStorage.setItem("jobs", JSON.stringify(jobs));
    render();
}

function render() {
    list.innerHTML = "";

    const filtered = jobs.filter(j =>
        (filter.value === "All" || j.status === filter.value) &&
        (j.company.toLowerCase().includes(search.value.toLowerCase()) ||
         j.role.toLowerCase().includes(search.value.toLowerCase()))
    );

    filtered.forEach((job, i) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${job.company}</td>
            <td>${job.role}</td>
            <td><span class="status ${job.status}">${job.status}</span></td>
            <td class="actions">
                <span onclick="editJob(${i})">✏️</span>
                <span onclick="deleteJob(${i})">🗑️</span>
            </td>
        `;

        list.appendChild(tr);
    });
}

function deleteJob(i) {
    jobs.splice(i, 1);
    save();
}

function editJob(i) {
    const j = jobs[i];
    company.value = j.company;
    role.value = j.role;
    status.value = j.status;
    jobs.splice(i, 1);
    save();
}

function exportCSV() {
    let csv = "Company,Role,Status\n";
    jobs.forEach(j => csv += `${j.company},${j.role},${j.status}\n`);
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "jobs.csv";
    a.click();
}

render();
