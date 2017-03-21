/* King of the world */
class Main {
    /*
     * Properties
     *   animator    {Animator}  - We will only ever create on of these
     *   isAnimating {Boolean}  - tells us if we are busy animating
     *   currentTP   {Integer}  - says which Time Period we are currently on
     *   csvData     {Object}   - contains all the information we got from the csv
     */

    constructor(csvData){
        // Create an instance of the Animate Class
    }

    /* Somehow this is called when one of the time periods is clicked */
    onclick(){
        // Check if we are already doing something
        // Parse which button they clicked
        // pass the information to the Animator Object
    }
}

/* Runs all of the animations */
class Animator {
    /*
     * Properties
     *    stage  {SpotLightStage}  - An array of spotlight objects to pass on
     *    csvData         {Object} - contains all the information we got from the csv
	 *	  animatedObjects {Array}  - List of all the animated objects
     */

    constuctor(csvData){
        // save the csv Data
        // create an instance of the spotlightStage
		// create all the animated Objects
    }

    /* The main run function that is called after the user clicks on a time period */
    run(from,to,callback){
        // if going backwards just set state
        // Create an array of Time Period Transitions one for each period we have to go through
        // turn on spotlight
        // Run all of the objects passing them thier corresponding csvData and the spotlight object
        // turn off spotlight
    }

	setState(state){
		// run through the list of animated objects
	}
}

/* Responsible for a single timePeriod walkthrough */
class TimePeriodTransition {
    /*
     * Properties
     *    spotlights {Array}    - An array of spotlight objects to use
     *    csvData    {Object}   - contains the information relavate to our time period
     *    currentIndex {Number} - Which index we are currently at in out array
     *    isActive   {Boolean}  - True if the 'next' button should be disabled
	 *	  chunks     {Array}	- An array of Functions that all return promises
	 *	  targerTP   {Number}   - The Time Perid we are shooting for
	 *	  animatedObjects {Array}  - List of all the animated objects
     */

    constructor(csvData,spotlights,textController,animatedObjects,periodNumber,callback){
        // save the passed data
        // set the textBoxController's title to the periodName
        // create the list of animations that need to happen
		// pass that list to 'makeChunkList'
        // call the first function in the array
    }

    /* Creates the 2d array of animations that need to happen from the csv */
    makeFilteredList(){
        // return a 2d list of animation indexes
    }

	/* turns our filtered list into a list of functions that return promises */
	makeChunkList(){
		// map that 2d list of integers into a 2d list of Animated Objects
        // map that list of Animated Object Lists into the list of functions which return promise chains
	}

    /* Creates the promise chain that walks through all of the steps of a single chunk*/
    createAnimationStep(animatedObjectArray){
        // return a function that returns a PromiseChain
		// The promiseChain will pass the big ol' animatedObjectArray through each
        // and should include:
        //      clean up the text box
        // 		move the spotlight
        // 		display the text
        // 		run the Array of animations
        // 		cleanUp
    }

    /* called after the animation runs to prep for the next one */
    cleanUp(){
        // set the 'isActive' to false
        // if we don't have anymore animations to do
        // then call the callback
    }

    /* called when they click the 'next' button */
    goToNext(){
        // if 'isActive' is set to false
        // increment our 'currentIndex'
        // call the next function in our array
    }

    /* called when they click the 'back' button */
    goToPrev(){
        // if 'isActive' is set to false
        // decrement our 'currentIndex'
        // call the previous function in our array
    }

	/* run all of the animations at the same time */
	runArray(animatedObjectArray){
		// return a promise which resolves when we are done counting callbacks
	}
}

/* Keeps all of its messy frames, states, and pixels to itself */
class AnimatedObject {
    /*
     * Properties
     *    currentState {Integer} - The state we are showing from 0 to 4
     *    currentFrame {Integer} - For animations that have multiple frames
     *    constants    {Object}  - Contains all of the info from the json file
     */

    constructor(itemNumber,csvData){
        // read the animationData.json (containers.json)
        // join the csvData and animationData objects to create the constants object
    }

    animateToState(state){
        // if they are trying to make us animate backwards, set the state to
        // run through all of our frames, preferably by returning a Promise Chain
    }

    setState(state){
        // Immediately set our state to the requested one
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
        // Initalize our array with one spotlight
    }
    /* called when they want to start the show */
    dimLights(){
        // do the magic to add the mask filter
    }

    /* called when the show ends */
    undimLights(){
        // do the magic to take off the mask filter
    }

    /* main move function, called during the animation process */
    move(animatedObjectArray){
        // Add more spotlights if we need more
        // Turn off spotlights if we have too many
        // if the lights are not dimmed, then dim them
        // for each animatedObject in the array move a coorsponding spotlight
    }

    /* add a spotlight to our array */
    createLight(){
        // initalize a new spotlight and add it
    }

    /* remove a spotlight from our array */
    killLight(){
        // just turn off the light
    }
}

/* A single light to move around */
class Spotlight {
    /*
     * Properties
     *    isOn     {Boolean} - Are we currently showing on the screen
     *    position {Object}  - contains our current position and size {x,y,width,height}
     */

    constructor(position,id){
        // save the passed variables
    }

	/* make the spotlight appear */
    turnOn(){
    }

	/* make the spotlight disappear */
    turnOff(){
    }

	/* return a promise in which it does the animation */
    move(newPosition){
		// if not on then turn it on
        // animate to the location
        // save the new Position
    }
}

/* Controls the annotations on the screen */
class TextController {
    /*
     * Properties
     *    currentTP        {String}  - Current Time Period Name we are showing
     *    isActive         {Boolean} - True if they are able to press 'next' or 'back'
     */

    constructor(){
        // initalize or private properties
    }

    /* displays the text from the animated Object */
    displayText(animatedObjectArray){
        // if there is more than one object in the array, concatinate thier text's
        // display the text
    }

    /* removes the text from the text box */
    removeText(animatedObjectArray){
        // we don't need the animatedObjectArray but just need to carry on the promise chain
        // also make sure that 'isActive' is set to false
    }

    /* makes the buttons clickable */
    enable(){
        // also set 'isActive' to true
    }

    /* makes the buttons not clickable */
	disable(){
        // also set 'isActive' to false
	}

    /* Set the title of our text box to the time period's name */
    setTimePeriod(){
    }
}
