// This function checks if a session can be deleted based on the date provided.
// It returns true if the session is at least 48 hours away from the current date.
// It returns false if the session is less than 48 hours away from the current date.

function canDeleteSession(rDate) { 
    console.log("In canDeleteSession");
    let sessionDate; 
    if (typeof rDate === 'string') { 
    sessionDate = new Date(rDate); 
    } else { 
    sessionDate = rDate; 
    } 
    const currentDate = new Date(); 
    const timeDifference = sessionDate.getTime() - currentDate.getTime(); 
    const daysDifference = timeDifference / (1000 * 3600 * 24); 
    console.log(daysDifference);
    return daysDifference >= 2; // At least 48 hours before the session 
    
} 

// Function to handle delete button click
function handleDelete(sessionId, rDate) { 
    console.log("In handleDelete function");
    if (canDeleteSession(rDate)) { 
        console.log("Returned from canDeleteSession function");
        let response = fetch(`/pigeons/delete`, { 
        method: 'POST', 
        headers: { 
            'Content-Type': 'application/json' 
        }, 
        // body: JSON.stringify({ id: sessionId }) 
        body: sessionId
        }) 
        .then(response => response.json()) 
        .then(data => { 
        if (data.success) { 
            location.reload(); // Reload the page to reflect changes 
        } else { 
            alert(data.message); 
        } 
        }) 
        .catch(error => console.error('Error:', error)); 
        } else { 
        alert('You can only delete a session at least 48 hours before the event.'); 
        } 
    } 
