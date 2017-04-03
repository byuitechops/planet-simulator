// START
getCSV( (err,csvData) => {
	if(err){
		console.log("couldn't get csv data")
	} else {
		var main = new Main(csvData)
		$("#TimePeriodButtons button").click( function() { main.onClick($(this).attr('data-phase')) })
	}
})


/* King of the world */
class Main {
    /*
     * Properties
     *   animator    {Animator} - We will only ever create on of these
     *   isAnimating {Boolean}  - tells us if we are busy animating
     *   csvData     {Object}   - contains all the information we got from the csv
     */

    constructor(csvData){
		this.csvData = csvData
        // Create an instance of the Animate Class
		this.animator = new Animator(csvData)
		this.isAnimating = false;
    }

    /* Somehow this is called when one of the time periods is clicked */
    onClick(newPhase){
        // Check if we are already doing something
		if(this.isAnimating) { return }
		// well we are doing something now
		this.isAnimating = true

		// pass the information to the Animator Object
		this.animator.run(newPhase,() => {
			// this arrow function will cause trouble if switched
			// to a normal function because then 'this' will be undefined
			this.isAnimating = false
			console.log("Touch Down!")
		})
    }
}

/* Runs all of the animations */
class Animator {
    /*
     * Properties
     *    stage   {SpotLightStage} - An array of spotlight objects to pass on
     *    csvData         {Object} - contains all the information we got from the csv
	 *	  animatedObjects  {Array} - List of all the animated objects
	 *	  TPTransitions    {Array} - List of all the Time Period Transitions
     *    currentTP      {Integer} - says which Time Period we are currently on
     *    txtControl      {Object} - Manages the messages at the bottom of the screen
     */

    constructor(csvData){
        // save the csv Data
		this.csvData = csvData
		this.currentTP = 0;
        // create an instance of the spotlightStage
		this.stage = new SpotlightStage()
        // create an instance of the Text Controller
		this.txtControl = new TextController()
		this.animatedObjects = []

		// create all the animated Objects
		imageData.forEach( image => {
			// get all of the csv data relevant to this AO
			var relevantData = csvData.map( TP => TP[image.name] )
			// create the AO
			var tempAO = new AnimatedObject(image,relevantData)
			// and add it too our collection
			this.animatedObjects.push(tempAO)
		})

		// create all the Time Period Transitions
		var numTP = $("#TimePeriodButtons button").length
		this.TPTransitions = []
		for(var TP = 0; TP < numTP; TP++){
			this.TPTransitions.push(
				new TimePeriodTransition(TP,this.animatedObjects,this.txtControl,this.stage))
		}
    }

    /* The main run function that is called after the user clicks on a time period */
    run(newTP,callback){
        // if going backwards just set state
		if(newTP <= this.currentTP){
			this.setState(newTP)
			callback()
			return
		}

		var start = +this.currentTP+1

        // turn on spotlight
		this.stage.dimLights()

        // Run all of the objects by chaining their promises together
		var runLikeTheWind = this.TPTransitions[start].run()
		for(var i = start+1; i <= newTP; i++)
			runLikeTheWind = runLikeTheWind.then(this.TPTransitions[i].run)

		// then to finish up
		runLikeTheWind.then(() => {
			// turn off spotlight
			this.stage.undimLights()
			this.currentTP = newTP
			callback()
		})
    }

	setState(newTP){
		this.currentTP = newTP
		// run through the list of animated objects
	}
}

/* Responsible for a single timePeriod walkthrough */
class TimePeriodTransition {
    /*
     * Properties
     *    stage  {SpotlightStage} - An array of spotlight objects to use
     *    currentIndex   {Number} - Which index we are currently at in out array
     *    isActive      {Boolean} - True if the 'next' button should be disabled
	 *	  chunks          {Array} - An array of Functions that all return promises
	 *	  targetTP       {Number} - The Time Perid we are shooting for
	 *	  animatedObjects {Array} - List of all the animated objects
     *    txtControl     {Object} - Manages the messages at the bottom of the screen
     *    resolve      {Function} - Call when we are all done with our animations
     *    reject       {Function} - Call if anything goes wrong
     */

    constructor(periodNumber,animatedObjects,textController,stage){
        // save the passed data
		this.targetTP = periodNumber
		this.animatedObjects = animatedObjects
		this.txtControl = textController
		this.stage = stage
		this.currentIndex = 0
        // create the list of animations that need to happen
		var filteredList = this.makeFilteredList()
		// map those objects into functions that return promises
		// for some reason my 'this' gets messed up if I just call createAnimationChunk directly
		this.chunks = filteredList.map(AOarray => this.createAnimationChunk(AOarray))
    }

	run(){
		return new Promise( (resolve,reject) => {
			// I know this is an odd way of doing it, but hey it works
			this.resolve = resolve
			this.reject = reject
			// Pass control of the buttons to this TPT
			$("#next").click(this.goToNext)
			$("#prev").click(this.goToPrev)
			// set the textBoxController's title to the periodName
			this.txtControl.setTimePeriod(this.targetTP)
			// call the first function in the array to start the animations
			this.chunks[0]()
		})
	}

    /* Creates the 2d array of animations that need to happen from the csv */
    makeFilteredList(){
        // return a 2d list of animation objects
		return this.animatedObjects
			// filter out the zeros and nulls
			.filter( (AO) => {
				return AO.TPdata[this.targetTP].timing
			})
			// creates the 2d array and sorts them
			.reduce( (chunks,AO) => {
				var timing = AO.TPdata[this.targetTP].timing
				if(chunks[timing]){ // if someone is already in our spot
					chunks[timing].push(AO) // add to thier array
				} else {
					chunks[timing] = [ AO ] // else create a new array
				}
				return chunks
			},[])
			// gets rid of any holes in our array (like the 0th element)
			.filter( AOarray => AOarray )
    }

    /* Creates the promise chain that walks through all of the steps of a single chunk*/
    createAnimationChunk(animatedObjectArray){
        // return a function that returns a PromiseChain
		// The promiseChain will pass the big ol' animatedObjectArray through each
		return () => {
			return this.txtControl.removeText(animatedObjectArray) // clean up the text box
					.then(AOarray => this.stage.move(AOarray) ) 						// move the spotlight
					.then(AOarray => this.txtControl.displayText(AOarray) ) 			// display the text
					.then(AOarray => this.runArray(AOarray) ) 						// run the Array of animations
					.then(AOarray => this.cleanUp(AOarray) )							// cleanUp
					.catch(this.reject)
		}
    }

    /* called after the animation runs to prep for the next one */
    cleanUp(){
        // if we still have more animations to do
		if(this.currentIndex < this.chunks.length - 1 ){
			// set the 'isActive' to false
			this.isActive = false
			// make the 'next' button clickable
			this.txtControl.enable()
		} else {
			// We are done!
			this.resolve()
		}
    }

    /* called when they click the 'next' button */
    goToNext(){
        // if 'isActive' is set to false
		if(this.isActive){
			// increment our 'currentIndex'
			this.currentIndex++
			// call the next function in our array
			this.chunks[this.currentIndex]()
		}
    }

    /* called when they click the 'back' button */
    goToPrev(){
		// if 'isActive' is set to false
		if(this.isActive){
			// decrement our 'currentIndex'
			this.currentIndex--
			// call the prev function in our array
			this.chunks[this.currentIndex]()
		}
    }

	/* run all of the animations at the same time */
	runArray(animatedObjectArray){
		// return a promise which resolves when we are done counting callbacks
		return new Promise( (resolve,reject) => {

			var animationsLeft = animatedObjectArray.length

			animatedObjectArray.forEach( AO => {
				AO.animateToState(this.targetTP,() => {
					animationsLeft--
					if(animationsLeft == 0){
						resolve(animatedObjectArray)
					}
				})
			})
		})
	}
}

/* Keeps all of its messy frames, states, and pixels to itself */
class AnimatedObject {
    /*
     * Properties
     *    currentState {Integer} - The state we are showing from 0 to 4
     *    currentFrame {Integer} - For animations that have multiple frames
     *    imageData    {Object}  - Contains all of the info from the json file
	 *	  forcer       {String}  - I still don't know what this is
	 *	  TPdata       {Object}  - The relevant data from the csvData
     */

    constructor(imageData,csvData){
//		console.log(imageData,csvData)
		this.imageData = imageData
		this.forcer = csvData.shift()
		this.TPdata = csvData
        // join the csvData and imageData objects to create the constants object
    }

    animateToState(state,callback){
        // if they are trying to make us animate backwards, just skip to it
		if(state <= this.currentState){
			this.setState(state)
			callback()
			return;
		}
        // run through all of our frames
		console.log("Imagine a pretty animation of",this.imageData.label,"to state",state)
		callback()
    }

    setState(state){
        // Immediately set our state to the requested one
		this.currentState(state)
    }
}

/* In charge of all the spotlights and dimming the stage */
class SpotlightStage {
    /*
     * Properties
     *    isActive   {Boolean} - True if the lights are dimmed
     *    spotlights {Array}   - The Array of all our spotlights
     */
    constructor(){
        // Initalize our array
		this.spotlights = []
		this.isActive = false
    }

	/* called when they want to start the show */
	dimLights(){
        // do the magic to add the mask filter
		console.log("Pretend the lights just dimned")
		this.isActive = true;
    }

    /* called when the show ends */
    undimLights(){
        // do the magic to take off the mask filter
		this.spotlights.forEach( spotlight => spotlight.turnOff() )
		console.log("Pretend the lights turned back on")
		this.isActive = false;
    }

    /* main move function, called during the animation process */
    move(AOarray){
		return new Promise( (resolve,reject) => {
			// Add more spotlights if we need more
			while(this.spotlights.length < AOarray.length){
				this.createLight()
			}
			// Turn off spotlights if we have too many
			while(this.spotlights.length > AOarray.length){
				this.killLight()
			}
			// if the lights are not dimmed, then dim them
			if(!this.isActive){
				this.dimLights()
			}
			// for each animatedObject in the array move a coorsponding spotlight
			var spotlightsLeft = this.spotlights.length
			this.spotlights.forEach( (spotlight,i) => {
				spotlight.move(AOarray[i].imageData,() => {
					spotlightsLeft--
					if(spotlightsLeft == 0){
						resolve(AOarray)
					}
				})
			})
		})
    }

    /* add a spotlight to our array */
    createLight(){
        // initalize a new spotlight and add it
		this.spotlights.push(new Spotlight())
    }

    /* remove a spotlight from our array */
    killLight(){
        // remove the lagger
		this.spotlights.pop()
    }
}

/* A single light to move around */
class Spotlight {
    /*
     * Properties
     *    isOn     {Boolean} - Are we currently showing on the screen
     *    position {Object}  - contains our current position and size {x,y,width,height}
     */

    constructor(position){
        // save the passed variables if any
		this.position = position || {}
    }

	/* make the spotlight appear */
    turnOn(){
		console.log("Imagine a spotlight turning on")
		this.isOn = true
    }

	/* make the spotlight disappear */
    turnOff(){
		console.log("Imagine a spotlight turning off")
    }

	/* folow the ballerina across the stage, then call the boss when done */
    move(imageData,callback){
		// if not on then turn it on
		if(!this.isOn){ this.turnOn() }
        // animate to the location
		console.log("Imagine a spotlight moving towards",imageData.label)
        // save the new Position
		this.position = imageData

		callback()
    }
}

/* Controls the annotations on the screen */
class TextController {
    /*
     * Properties
     *    isActive         {Boolean} - True if they are able to press 'next' or 'back'
     *    currentTP        {Integer} - The current TP we are working on
     */

    constructor(){
        // initalize out private properties
		this.disable()
    }

    /* displays the text from the animated Object */
    displayText(AOarray){
		return new Promise( (resolve,reject) => {

			// if there is more than one object in the array, concatinate their text's
			var message = AOarray.reduce( (message,AO) => {
				message += AO.TPdata[this.currentTP].text + "\n"
				return message;
			},"")

			// display the text
			$("#message").text(message)

			resolve(AOarray)
		})
    }

    /* removes the text from the text box */
    removeText(animatedObjectArray){
		return new Promise( (resolve,reject) => {
			// we don't need the animatedObjectArray but just need to carry on the promise chain
			$("#message").text("")

			// also make sure that 'isActive' is set to false
			this.isActive = "false"

			resolve(animatedObjectArray)
		})
    }

    /* makes the buttons clickable */
    enable(){
        // also set 'isActive' to true
		this.isActive = true
		$("#prev").prop("disabled",false)
		$("#next").prop("disabled",false)
    }

    /* makes the buttons not clickable */
	disable(){
        // also set 'isActive' to false
		this.isActive = false
		$("#prev").prop("disabled",true)
		$("#next").prop("disabled",true)
	}

    /* Set the title of our text box to the time period's name */
    setTimePeriod(currentTP){
		this.currentTP = currentTP
		var phaseTitle = $("button[data-phase="+this.currentTP+"]").text()
		$("#currentTP").text(phaseTitle)
    }
}
