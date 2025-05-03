function calculateWeekday(dateObject) {

    // console.log("Received dateObject:", dateObject);
    
    const options = {
        weekday: 'short'
    };
    
    const wkDay = new Intl.DateTimeFormat('en-US', options).format(dateObject);
    console.log("Calculated weekDay:", wkDay);
  
  return wkDay;
}

module.exports = calculateWeekday;