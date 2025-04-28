// Frontend JavaScript code to render a table of events
// This code assumes you have a table with the ID 'eventTable' and a button to sort the table.

function renderTable(data) {

    const columnsToSkip = ['_id', 'salutation', 'sProvider', 'cPerson', 'cPhone'];
    let tableContent = "<tr>";
    // Create table headers based on the keys of the first event
    for (let key in data[0]) {
        if (!columnsToSkip.includes(key)) {
            tableContent += `<th onclick="sortTable('${key}')">${key}</th>`;
        }
    }

    tableContent = "<tr>";
    // Create table headers based on the keys of the first event
    for (let key in data[0]) {
        if (!columnsToSkip.includes(key)) {
            tableContent += `<th onclick="sortTable('${key}')">${key}</th>`;
        }
    }
    tableContent += "<th>Actions</th></tr>";
    // Create table rows
    data.forEach(event => {
        tableContent += "<tr>";
        for (let key in event) {
            if (!columnsToSkip.includes(key)) {
                tableContent += `<td>${
                    event[key]
                }</td>`;
            }
        }
        tableContent += `<td>
<a href='/staff/detail?id=${
            event._id
        }'>Details</a> |
<a href='/staff/update?id=${
            event._id
        }'>Update</a>
</td></tr>`;
    });
    document.getElementById('eventTable').innerHTML = tableContent;
}