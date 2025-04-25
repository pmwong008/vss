async function generateDayCards(month, year) { 
	
	const dayCards = []; 

	const firstDayOfMonth = new Date(year, month - 1, 1); 
	const monthLong = new Date(year, month, 0).getDate() + 1;
	const startDay = firstDayOfMonth.getDay(); // Get the weekday of the first day of the month
	
	console.log('monthLong and startDay:', monthLong, startDay);

	for (let day = 2; day <= monthLong; day++) { 
		
		dayCards.push({ 
			day: day - 1, 
			date: new Date(year, month - 1, day - 1),
			// marked: '' 
			}
		); 
	}
	console.log('Generated blank dayCards for month:' + month, dayCards); // Debug log
	return { dayCards,startDay };
  }

module.exports =  generateDayCards ;
