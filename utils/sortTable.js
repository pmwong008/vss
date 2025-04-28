// Frontend JavaScript code to sort a table of sessions by date
// This code assumes you have a table with the ID 'eventTable' and a button to sort the table.

function sortTable(order) {
    const rows = Array.from(tableBody.querySelectorAll("tr"));
    console.log("Rows:", rows); // Check if rows are correctly fetched
    rows.sort((a, b) => {
        const dateA = new Date(a.querySelector(".session-date").textContent);
        const dateB = new Date(b.querySelector(".session-date").textContent);

        return order === "asc" ? dateA - dateB : dateB - dateA; // Ascending or descending
    });

    tableBody.innerHTML = ""; // Clear table
    rows.forEach(row => tableBody.appendChild(row));
    // Re-append rows

    // Reattach delete event listeners after sorting
    attachDeleteEventListeners();
}