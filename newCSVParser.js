/*global d3*/

function parseNewCSV(rawCSV){

	var timeFlag = false

	var data = d3.csvParse(rawCSV,'utf-8'), d => {
		var row = {}
		for(var col in d)
			row[camelCase(col)] = d[col]
		return row
	})
	data.columns = data.columns.map(camelCase)
	var transcribed = []

	data.forEach( row => {
		// record all the headings that start with a number
		var section = row.rowHeading.match(/^\d/)
		// setup the row skeleton if this is a new section
		if(section){
			timeFlag = true
			var timeZone = data.columns.reduce( (timeZone,column,i) => {
					if(!i)
						timeZone[column] = section.input
					else
						timeZone[column] = {value:+row[column] || 0,timing:0,text:""}
					return timeZone
				},{})
			// underwaterVolcano is special because it needs to copy volcano
			timeZone.underwaterVolcano = timeZone.volcano
			transcribed.push(timeZone)
		}
		var currentSection = transcribed.length - 1
		if(timeFlag && !section){
			for( var element in row){
				if(element != 'rowHeading'){
					transcribed[currentSection][element][row.rowHeading] = row[element]
				}
			}
		}
		if(!timeFlag) {
			transcribed.push(row)
		}
	})


	console.log(transcribed)
}

function camelCase(string){
	return string.toLowerCase().replace(/ \w/g, (x) => x.slice(-1).toUpperCase()).replace(/ /g,'')
}
