const generateDayCards = require('../utils/generateDayCards');
const Pigeon = require('../model/Pigeon'); 

const showCalendar = async (req, res) => {
    try { 
        // const username = req.cookies?.username || 'Guest'; // Handle missing user info
        const { username } = req.user; 
        const month = parseInt(req.query.month) || new Date().getMonth() + 1; // Default to current month if not specified 
        const year = parseInt(req.query.year) || new Date().getFullYear(); // Default to current year if not specified 
        const timezoneOffset = 8 * 60 * 60 * 1000;
        const {dayCards, startDay} = generateDayCards(month, year); 
        
        if (!Array.isArray(dayCards)) { 
            throw new Error("dayCards is not an array"); 
          }
        console.log('Day Cards before updating:', dayCards, startDay);
    
        const startDate = new Date(dayCards[0].date);
        startDate.setTime(startDate.getTime() + timezoneOffset); // Adjust to GMT+8        const endDate = new Date(dayCards[dayCards.length - 1].date);
        startDate.setUTCHours(0, 0, 0, 0); // Reset hours/minutes/seconds/milliseconds
        const endDate = new Date(dayCards[dayCards.length - 1].date);
        endDate.setTime(endDate.getTime() + timezoneOffset); // Adjust to GMT+8
        endDate.setUTCHours(23, 59, 59, 999);

        console.log('Start Date Adjusted for GMT+8:', startDate.toISOString());
        console.log('End Date Adjusted for GMT+8:', endDate.toISOString());

        
        // Fetch dates from the collection 
        const aggregates = await Pigeon.aggregate([
          { 
            $match: { 
            $expr: {
              $and: [
              { $gte: ["$rDate", startDate] },
              { $lt: ["$rDate", endDate] }
              ]
            }
            }
          },
            {
              $group: {
                _id: { date: "$rDate", availability: "$availability" },
                count: { $sum: 1 }
              }
            }
          ]).exec();
    
        // console.log('Aggregated Data from DB:', aggregates); // Debug log

        // Update the corresponding day cards 
        dayCards.forEach(dayCard => { 
            const formattedDate = dayCard.date.toISOString().split('T')[0]; 
        	aggregates.forEach(aggregate => {
                const aggregateDate = new Date(aggregate._id.date);
                // const offsetHours = 16 * 60 * 60 * 1000;
                // const offsetDate = new Date(aggregateDate.getTime() + offsetHours); // Adds the correct offset for the timezone

                if (aggregateDate.toISOString().split('T')[0] === formattedDate) {
                  if (aggregate._id.availability === 'AM') {
                    dayCard.amCount = aggregate.count;
                  } else if (aggregate._id.availability === 'PM') {
                    dayCard.pmCount = aggregate.count;
                  }
                }
            });  
        });   
        // console.log('Updated Day Cards:', dayCards); // Debug log
        
        res.render('calendar', { username, dayCards, month, year, startDay }); 
      } catch (error) { 
        console.error("Error while generating calendar view:", error); 
        res.status(500).send("Error while generating calendar view: " + error.message); 
      }  
}

module.exports = { showCalendar };
