var ClosureCompiler = require("closurecompiler");
const fs = require('fs'); 
ClosureCompiler.compile(
    ["../settings.js","../containers.js","../getCSV.js","../animator.js","../spotlights.js","../main.js"],
    {
        // Options in the API exclude the "--" prefix 
        compilation_level: "SIMPLE_OPTIMIZATIONS",
        
        // Capitalization does not matter  
        
        // If you specify a directory here, all files inside are used 
        
        // ^ As you've seen, multiple options with the same name are 
        //   specified using an array. 
        
    },
    function(error, result) {
        if (result) {
            // Write result to file 
            // Display error (warnings from stderr) 
            fs.writeFile("./output/planetsim-min.js",result,function(err){
               if(err) throw err; 
            });
        } else {
            // Display error... 
         }
    }
);
