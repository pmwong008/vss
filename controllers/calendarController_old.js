const generateDayCards = require('../utils/generateDayCards');
const Pigeon = require('../model/Pigeon'); // Assuming you have a Pigeon model defined

const showCalendar = async (req, res) => {
    try { 
        const username = req.cookies?.username || 'Guest'; // Handle missing user info
        const month = parseInt(req.query.month) || new Date().getMonth() + 1; // Default to current month if not specified 
        const year = parseInt(req.query.year) || new Date().getFullYear(); // Default to current year if not specified 
        
        const {dayCards, startDay} = await generateDayCards(month, year); 
        
        if (!Array.isArray(dayCards)) { 
            throw new Error("dayCards is not an array"); 
          }
        console.log('Day Cards before updating:', dayCards, startDay);
    
        const startDate = dayCards[0].date.toISOString().split('T')[0]; 
        const endDate = dayCards[dayCards.length - 1].date.toISOString().split('T')[0];
        
        // Fetch dates from the collection 
        const dates = await Pigeon.find({ 
            rDate: { 
                $gte: startDate,
                $lt: endDate
            } }).exec(); 
    
        console.log('Fetched Dates from DB:', dates);
        const markedDates = dates.map((doc) => doc.rDate.toISOString().split('T')[0]);    
        // Update the corresponding day cards 
        dayCards.forEach(dayCard => { 
            const formattedDate = dayCard.date.toISOString().split('T')[0]; 
            dayCard.marked = markedDates.includes(formattedDate) ? 'YES' : ''; 
        });
        console.log('Updated Day Cards:', dayCards);
        
        res.render('calendar', { username, dayCards, month, year, startDay }); 
      } catch (error) { 
        console.error("Error while generating calendar view:", error); 
        res.status(500).send("Error while generating calendar view: " + error.message); 
      }  
}

module.exports = { showCalendar }