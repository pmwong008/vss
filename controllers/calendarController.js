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
    
        const startDate = new Date(dayCards[0].date);
        startDate.setUTCHours(0, 0, 0, 0);
        const endDate = new Date(dayCards[dayCards.length - 1].date);
        endDate.setUTCHours(23, 59, 59, 999);

        console.log('Start Date UTC:', startDate.toISOString());
        console.log('End Date UTC:', endDate.toISOString());

        
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
    
        console.log('Aggregated Data from DB:', aggregates);

        // Update the corresponding day cards 
        dayCards.forEach(dayCard => { 
            const formattedDate = dayCard.date.toISOString().split('T')[0]; 
        	aggregates.forEach(aggregate => {
                const aggregateDate = new Date(aggregate._id.date);
                const offsetDate = new Date(aggregateDate.getTime() + aggregateDate.getTimezoneOffset()); // Adds the correct offset for the timezone

                if (offsetDate.toISOString().split('T')[0] === formattedDate) {
                  if (aggregate._id.availability === 'AM') {
                    dayCard.amCount = aggregate.count;
                  } else if (aggregate._id.availability === 'PM') {
                    dayCard.pmCount = aggregate.count;
                  }
                }
            });  
        });   
        console.log('Updated Day Cards:', dayCards);
        
        res.render('calendar', { username, dayCards, month, year, startDay }); 
      } catch (error) { 
        console.error("Error while generating calendar view:", error); 
        res.status(500).send("Error while generating calendar view: " + error.message); 
      }  
}

module.exports = { showCalendar }
