// This is a utility function that fetches events from the server and renders them in a table.
// It uses the Fetch API to make a GET request to the server endpoint '/staff/event_list'.
// It is supposed to be a front-end script that runs in the browser.

function fetchEvents() {
        const response = fetch('/staff/event_list');
        if (! response.ok) {
            throw new Error(`HTTP error! status: ${
                response.status
            }`);
        }
        events = response.json();
        console.log("Running in html script:" + events);
        if (events.length === 0) {
            document.getElementById('eventTable').innerHTML = '<tr><td colspan="100%">No events found</td></tr>';
            return;
        }
        renderTable(events);
    
}