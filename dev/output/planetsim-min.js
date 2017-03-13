var $jscomp={scope:{}};$jscomp.defineProperty="function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,d){if(d.get||d.set)throw new TypeError("ES3 does not support getters and setters.");a!=Array.prototype&&a!=Object.prototype&&(a[b]=d.value)};$jscomp.getGlobal=function(a){return"undefined"!=typeof window&&window===a?a:"undefined"!=typeof global&&null!=global?global:a};$jscomp.global=$jscomp.getGlobal(this);$jscomp.SYMBOL_PREFIX="jscomp_symbol_";
$jscomp.initSymbol=function(){$jscomp.initSymbol=function(){};$jscomp.global.Symbol||($jscomp.global.Symbol=$jscomp.Symbol)};$jscomp.symbolCounter_=0;$jscomp.Symbol=function(a){return $jscomp.SYMBOL_PREFIX+(a||"")+$jscomp.symbolCounter_++};
$jscomp.initSymbolIterator=function(){$jscomp.initSymbol();var a=$jscomp.global.Symbol.iterator;a||(a=$jscomp.global.Symbol.iterator=$jscomp.global.Symbol("iterator"));"function"!=typeof Array.prototype[a]&&$jscomp.defineProperty(Array.prototype,a,{configurable:!0,writable:!0,value:function(){return $jscomp.arrayIterator(this)}});$jscomp.initSymbolIterator=function(){}};$jscomp.arrayIterator=function(a){var b=0;return $jscomp.iteratorPrototype(function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}})};
$jscomp.iteratorPrototype=function(a){$jscomp.initSymbolIterator();a={next:a};a[$jscomp.global.Symbol.iterator]=function(){return this};return a};$jscomp.array=$jscomp.array||{};$jscomp.iteratorFromArray=function(a,b){$jscomp.initSymbolIterator();a instanceof String&&(a+="");var d=0,c={next:function(){if(d<a.length){var f=d++;return{value:b(f,a[f]),done:!1}}c.next=function(){return{done:!0,value:void 0}};return c.next()}};c[Symbol.iterator]=function(){return c};return c};
$jscomp.polyfill=function(a,b,d,c){if(b){d=$jscomp.global;a=a.split(".");for(c=0;c<a.length-1;c++){var f=a[c];f in d||(d[f]={});d=d[f]}a=a[a.length-1];c=d[a];b=b(c);b!=c&&null!=b&&$jscomp.defineProperty(d,a,{configurable:!0,writable:!0,value:b})}};$jscomp.polyfill("Array.prototype.keys",function(a){return a?a:function(){return $jscomp.iteratorFromArray(this,function(b){return b})}},"es6-impl","es3");
var bugging=!1,settings={SKIP_NEXT_BUTTON:bugging,ANIMATION_LENGTH:bugging?50:1500,MESSAGEBOX_ANIMATION_LENGTH:1E3,TURN_OFF_LIGHTS_LENGTH:bugging?250:1E3,TURN_ON_LIGHTS_LENGTH:bugging?250:1E3,SPOTLIGHT_MOVE_DURATION:bugging?250:1E3};var containers=[{name:"sea",label:"Sea Level",isFrame:!0,items:5,width:392,height:392,x:227,y:369,path:"./images/animations/flooding/flood",ext:".png",scale:1,macaroni:{needed:!1}},{name:"volcano",label:"Volcanic Activity",isFrame:!0,items:5,width:401,height:417,x:229,y:377,scale:1,path:"./images/animations/volcanoes/volcano",ext:".png",macaroni:{needed:!1}},{name:"ice",label:"Ice",isFrame:!1,items:5,width:304,height:392,x:271,y:368,path:"./images/animations/iceCaps/iceCap",ext:".png",scale:1,macaroni:{needed:!1}},
{name:"insolation",label:"Insolation",isFrame:!0,items:5,width:334,height:412,x:-75,y:150,path:"./images/animations/lightRays/lightRay",ext:".png",macaroni:{needed:!1}},{name:"mountain",label:"Mountains",isFrame:!1,items:5,width:187,height:238,x:154,y:459,scale:1,path:"./images/animations/mountains/mountain",ext:".png",macaroni:{needed:!1}},{name:"co2",label:"CO<sub>2</sub>",isFrame:!0,items:9,width:126,height:440,x:563,y:346,path:"./images/animations/co2Meter/co2Meter",ext:".png",macaroni:{needed:!1}},
{name:"temperature",label:"Temperature",isFrame:!0,items:9,width:148,height:522,x:589,y:307,path:"./images/animations/tempMeter/tempMeter",ext:".png",macaroni:{needed:!1}},{name:"underwaterVolcano",label:"Volcanic Activity",isFrame:!0,items:5,width:164,height:305,x:1287,y:330,path:"./images/animations/underwaterVolcanoes/volcano",ext:".gif",scale:{x:1,y:1.3},macaroni:{needed:!0,x:1386,y:653,mirrored:!1,name:"underwaterVolcano"}},{name:"co3Desposition",label:"Carbonate Desposition",isFrame:!0,items:5,
width:120,height:216,x:1165,y:564,path:"./images/animations/seaSnow/seaSnow",ext:".gif",scale:{x:1,y:.72},macaroni:{needed:!0,x:1215,y:624,mirrored:!1,name:"co3Desposition"}},{name:"sediment",label:"Sediment (Carbon Burrial)",isFrame:!0,items:5,width:129,height:129,x:978,y:527,path:"./images/animations/sediment/sediment",ext:".gif",macaroni:{needed:!0,x:979,y:642,mirrored:!1,name:"sediment"}},{name:"weatheringCRelease",label:"Weathering (Carbon Release)",isFrame:!0,items:5,width:204,height:168,x:1396,
y:396,path:"./images/animations/carbonateRock/carbonateRock",ext:".gif",macaroni:{needed:!0,x:1560,y:458,mirrored:!0,name:"weatheringCRelease"}},{name:"weatheringCBurial",label:"Weathering (Carbon Burrial)",isFrame:!0,items:5,width:23,height:54,x:994,y:485,path:"./images/animations/MininMacaroniMeter/miniMacMeter",ext:".png",macaroni:{needed:!1}}],containerIndexes={};containers.forEach(function(a,b){containerIndexes[a.name]=b});window.getCSV=function(){function a(b,a){if(4>b.length||".csv"!==b.substr(b.length-4))b+=".csv";$.ajax("./csvs/"+b,{dataType:"text",success:function(b){a(null,b)},error:function(b,d,c){a("Ajax Error "+d+":"+c,null)}})}function b(b){function a(g){return g.toLowerCase().replace(/ \w/g,function(g){return g.slice(-1).toUpperCase()}).replace(/ |s$/g,"")}function d(g){g=parseInt(g,10);return isNaN(g)?0:g}var h=[],k=d3.csvParse(b,function(g){var b={},d;for(d in g)b[a(d)]=g[d];return b});k.columns=k.columns.map(a);
k.forEach(function(g,b){var a=g.rowHeading.match(/^\d|initial/),c=h.length-1;if(0===b)g.underwaterVolcano=g.volcano,h.push(g);else if(a)c=k.columns.reduce(function(b,d,c){var e=0;if("other"===d)return b;0===c?b[d]=a.input:("initial"===g.rowHeading&&(e=1),b[d]={value:+g[d]||0,timing:e,text:""});return b},{}),c.underwaterVolcano=c.volcano,h.push(c);else for(var n in g){var e=g[n];"rowHeading"!==n&&"other"!==n&&("timing"===g.rowHeading&&(e=d(g[n])),h[c][n][g.rowHeading]=e)}});return h}return function(d){var c;
(c=window.location.search.substr(1).split("=")[1])?a(c,function(a,c){var h;a?d(a,null):(h=b(c),d(null,h))}):d("No filename in URL.",null)}}();var Frame=function(){return function(a,b,d){this.file=a;this.opacity=0;this.width=b;this.height=d}}(),Animator=function(){function a(b,a,c,f,h,k,g){this.x=f;this.y=h;this.states=a;this.isFrame=c;this.framesPerStep=Math.round(a.length/5);this.targetStep=g;this.currentFrame=this.targetFrame=g*this.framesPerStep;this.name=b;this.transitionDuration=500;this.frames=[];b="object"===typeof k?k:"number"===typeof k?{x:k,y:k}:{x:1,y:1};this.scale=b;this.width=this.states[0].width;this.height=this.states[0].height;
this.MiniMacaroniMeter=null}a.prototype.display=function(){var b=this,a=document.createElementNS("http://www.w3.org/2000/svg","g");a.setAttributeNS(null,"id",b.name);a.setAttributeNS(null,"transform","translate("+b.x+","+b.y+") scale("+b.scale.x+" "+b.scale.y+")");b.transition=b.isFrame?b.frameTransition:b.crossfadeTransition;document.querySelector("#child_container").appendChild(a);b.currentFrame=b.targetFrame;b.states.forEach(function(d,f){var c,k;b.frames.length<f+1&&(c=document.createElementNS("http://www.w3.org/2000/svg",
"image"),c.setAttributeNS("http://www.w3.org/1999/xlink","href",d.file),c.setAttributeNS(null,"x",0),c.setAttributeNS(null,"y",0),c.setAttributeNS(null,"height",d.height),c.setAttributeNS(null,"width",d.width),a.appendChild(c),b.frames.push(c));f<=b.targetFrame?d.opacity=1:(d.opacity=0,$(c).css("opacity","0"));k=window.setInterval(function(){window.clearInterval(k)},1500);return d});this.group=a;return this};a.prototype.setState=function(b){var a=this;4<b?b=4:0>b&&(b=0);this.targetFrame=this.currentFrame=
b*a.framesPerStep;this.states.forEach(function(d,f){d.opacity=f<=b*a.framesPerStep?1:0;$(a.frames[f]).css("opacity",d.opacity)});this.MiniMacaroniMeter&&this.MiniMacaroniMeter.setState(b)};a.prototype.createMacaroniMeter=function(b,d,c,f){var h,k=[];for(h=1;5>=h;h++)k.push(new Frame("./images/animations/MininMacaroniMeter/miniMacMeter"+h+".png",23,54));this.MiniMacaroniMeter=new a(b,k,!0,d,c,1,this.currentFrame);this.MiniMacaroniMeter.display();f&&this.MiniMacaroniMeter.mirror();return this};a.prototype.mirror=
function(){this.group.setAttributeNS(null,"transform","translate("+this.x+","+this.y+") scale("+-1*this.scale.x+" "+this.scale.y+")")};a.prototype.frameTransition=function(b){var a;this.MiniMacaroniMeter&&this.MiniMacaroniMeter.transition();this.targetFrame===this.currentFrame?b&&b():(this.targetFrame<this.currentFrame?(a=this.currentFrame,this.states[a].opacity=0,--this.currentFrame):(a=this.currentFrame+1,this.states[a].opacity=1,this.currentFrame=a),this.fade(a,this.transitionDuration,b))};a.prototype.crossfadeTransition=
function(a){var b=this.currentFrame,c=this.targetFrame<b?b-1:b+1;this.currentFrame=c;this.states[b].opacity=0;this.states[c].opacity=1;this.fade(b,this.transitionDuration,a);this.fade(c,this.transitionDuration)};a.prototype.fade=function(a,d,c){$(this.frames[a]).animate({opacity:this.states[a].opacity},d,c)};return a}();var Spotlights=function(){function a(g,a){g=Math.ceil(g);a=Math.floor(a);return Math.floor(Math.random()*(a-g))+g}function b(g){for(var b=[],c=0;c<g;c++)b.push(String.fromCharCode(a(45,91)));return b.join("").replace(/[^\w]|\d/g,function(){return String.fromCharCode(a(65,91))})}function d(a){++k>=this.lights.length&&(a(),k=0)}var c=function(a,c,d,f,h){this.x=a;this.y=c;this.width=d;this.height=f;this.id=h||b(12);a=document.createElementNS("http://www.w3.org/2000/svg","rect");a.setAttributeNS(null,
"width",this.width);a.setAttributeNS(null,"height",this.height);a.setAttributeNS(null,"x",this.x);a.setAttributeNS(null,"y",this.y);a.setAttributeNS(null,"id",this.id);this.rect=a},f=c.prototype;f.moveToDestination=function(a,b,c){b=b||settings.SPOTLIGHT_MOVE_DURATION;a.offset||(a.offset={});a.offset.x||(a.offset.x=0);a.offset.y||(a.offset.y=0);a.scale||(a.scale={});a.scale.x||(a.scale.x=1);a.scale.y||(a.scale.y=1);c||(c=function(){});a={x:a.x+a.offset.x-a.width*a.scale.x/2,y:a.y+a.offset.y-a.height*
a.scale.y/2,width:a.width*a.scale.x,height:a.height*a.scale.y};Snap(this.rect).animate(a,b,function(){c()})};f.updateRectPositions=function(){this.rect.setAttributeNS(null,"width",this.width);this.rect.setAttributeNS(null,"height",this.height);this.rect.setAttributeNS(null,"x",this.x);this.rect.setAttributeNS(null,"y",this.y);this.rect.setAttributeNS(null,"id",this.id)};var f=function(a){this.id=a||b(12);this.lights=[]},h=f.prototype;h.addLight=function(a,b,d,f,h){a=new c(a,b,d,f,h);a.rect.setAttributeNS(null,
"fill","url(#"+this.id+"Spotlight)");this.lights.push(a);document.getElementById(this.id).appendChild(a.rect)};h.deleteLights=function(a,b){var c=this.lights.splice(a,b||1);if(c.length)for(var d in c)Snap(c[d].rect).animate({opacity:0,width:1,height:1},500,function(){$("#"+c[d].id).remove()});else Snap(c.rect).animate({opacity:0,width:1,height:1},500,function(){$("#"+c.id).remove()})};h.deleteScene=function(){$("#"+this.id+"Group").remove()};h.turnOnLights=function(a,b){a=a||settings.TURN_ON_LIGHTS_LENGTH;
this.generateScene(this.width,this.height,this.parent);var c=this;this.lights.forEach(function(a){document.getElementById(c.id).appendChild(a.rect)});this.scene.setAttributeNS(null,"opacity","0");b||(b=function(){});Snap.select("#"+this.id+"Group").animate({opacity:1},a,function(){b()})};h.turnOffLights=function(a,b){a=a||settings.TURN_OFF_LIGHTS_LENGTH;var c=this;b||(b=function(){});Snap.select("#"+this.id+"Group").animate({opacity:0},a,function(){c.deleteScene();b()})};var k=0;h.moveLightToLocation=
function(a,b,c,f){0>a||"string"===typeof a&&"all"===a.toLowerCase()?this.lights.forEach(function(a){a.moveToDestination(b,c,function(){d(f)})}):this.lights[a].moveToDestination(b,c,f)};h.refreshScene=function(){this.parent&&(this.deleteScene(),this.generateScene(this.width,this.height,this.parent))};h.generateScene=function(a,b,c){var d=document.createElementNS("http://www.w3.org/2000/svg","g");d.setAttributeNS(null,"id",this.id+"Group");var g=document.createElementNS("http://www.w3.org/2000/svg",
"defs"),e=document.createElementNS("http://www.w3.org/2000/svg","radialGradient");e.setAttributeNS(null,"id",this.id+"Spotlight");var f=document.createElementNS("http://www.w3.org/2000/svg","stop");f.setAttributeNS(null,"offset","70%");f.setAttributeNS(null,"stop-color","black");var h=document.createElementNS("http://www.w3.org/2000/svg","stop");h.setAttributeNS(null,"offset","100%");h.setAttributeNS(null,"stop-color","transparent");e.appendChild(f);e.appendChild(h);g.appendChild(e);e=document.createElementNS("http://www.w3.org/2000/svg",
"mask");e.setAttributeNS(null,"id",this.id);f=document.createElementNS("http://www.w3.org/2000/svg","rect");f.setAttributeNS(null,"x",0);f.setAttributeNS(null,"y",0);f.setAttributeNS(null,"fill","white");f.setAttributeNS(null,"width",a);f.setAttributeNS(null,"height",b);e.appendChild(f);g.appendChild(e);e=document.createElementNS("http://www.w3.org/2000/svg","rect");e.setAttributeNS(null,"width",a);e.setAttributeNS(null,"height",b);e.setAttributeNS(null,"fill","black");e.setAttributeNS(null,"opacity",
"0.78");e.setAttributeNS(null,"mask","url(#"+this.id+")");e.setAttributeNS(null,"x",0);e.setAttributeNS(null,"y",0);e.setAttributeNS(null,"id",this.id+"Scene");d.appendChild(g);d.appendChild(e);this.scene=d;this.parent=c;this.width=a;this.height=b;$(c).append(d)};return f}();(function(){function a(a){var b=!1,c;["mountain","volcano","weatheringCBurial","weatheringCRelease","insolation"].forEach(function(c,d){"1"===a[c]&&($("#forcers g:nth-child("+(d+1)+") image:nth-of-type(2)").toggleClass("hide"),$("#forcers g:nth-child("+(d+1)+") text").toggleClass("disabled"),b=!0)});b||($("#forcers").toggleClass("hide"),$("#forcerText").toggleClass("hide"),c="<tspan>"+a.other+"</tspan>",c=c.replace(/_(\d)/g,function(a,b){return'</tspan><tspan class="forcerSubscript" dy="5" >'+b+'</tspan><tspan dy="-5">'}),
$("#forcerText text").html(c))}function b(){l.turnOffLights(settings.TURNOFFLIGHTS_LENGTH,function(){r=!1});g()&&$("#messageBox").animate({opacity:0},settings.MESSAGEBOX_ANIMATION_LENGTH)}function d(){var a=0;e[0].forEach(function(z,y){var p=m[e[0][y]];p.targetFrame===p.currentFrame?++a>=e[0].length&&($("#next").removeClass("disabled"),c(m[e[0][0]].text,function(){e.shift();0<e.length?(m[e[0][0]].startingFrame=m[e[0][0]].currentFrame,v(),1<l.lights.length&&l.deleteLights(1,l.lights.length-1),h()):
b()})):p.transition(d)})}function c(a,b){$("#msgTxt").text(a);settings.SKIP_NEXT_BUTTON&&b();var c=!1;$("#next").click(function(){$(this).hasClass("disabled")||c||(b(),c=!0)})}function f(a){a=m[e[0][a||0]];a.offset||(a.offset={x:0,y:0});a.scale||(a.scale={x:1,y:1});var b=a.states[0].width>a.states[0].height?a.states[0].width:a.states[0].height,b={width:b,height:b,x:a.x,y:a.y,scale:{x:1.5*a.scale.x,y:1.5*a.scale.y},offset:{x:(a.offset.x||0)+a.states[0].width/2,y:(a.offset.y||0)+a.states[0].height/
2}};if("sediment"===a.name||"weatheringCBurial"===a.name)b.scale.x=2,b.scale.y=2;"insolation"===a.name&&(b.y+=30,b.scale.x=.9,b.scale.y=.9);"mountain"===a.name&&(b.scale.x=1.2,b.scale.y=1.2);"volcano"===a.name&&(b.scale.x=.9,b.scale.y=.9);"temperature"===a.name&&(b.x-=25,b.scale.x=.5,b.scale.y=1.2);"co2"===a.name&&(b.x-=30,b.scale.x=.5,b.scale.y=1.2);"underwaterVolcano"===a.name&&(b.y+=50,b.x-=15,b.scale.x=.65,b.scale.y=1.5);"weatheringCBurial"===a.name&&(b.y-=50,b.scale.x=5,b.scale.y=5);return b}
function h(){function a(){c++;c>=e[0].length&&setTimeout(b,500)}function b(){var a=0,b;for(b in e[0])m[e[0][b]].transition(function(){a++;a>=e[0].length&&d()})}$("#next").addClass("disabled");var c=0;l.moveLightToLocation(0,f(),settings.SPOTLIGHT_MOVE_DURATION,a);for(var p in e[0])if("0"!==p){var g=f(p);l.addLight(g.x,g.y,1,1);l.moveLightToLocation(p,f(p),1E3,a)}}function k(a){var b=Object.keys(a).reduce(function(b,c){var d=a[c].timing;if("rowHeading"===c||0===d)return b;b.push({index:containerIndexes[c],
timing:d});return b},[]);b.sort(function(a,b){return a.timing-b.timing});var c=[];return b=b.map(function(a){return b.filter(function(b){return b.timing===a.timing})}).filter(function(a){if(0<=c.indexOf(JSON.stringify(a)))return!1;c.push(JSON.stringify(a));return!0}).map(function(a){return a.map(function(a){return a.index})})}function g(){var a=!0;q<t?(q++,n(u[q],!1),a=!1):t<q&&(q=t,n(u[q],!0));return a}function n(a,c){e=k(a).filter(function(b){b=b.filter(function(b){b=m[b];var c=a[b.name].value-
1;if(b.targetStep===c&&""===a[b.name].text)return!1;b.transitionDuration=settings.ANIMATION_LENGTH/Math.abs(b.targetStep-c)/b.framesPerStep;b.targetStep=c;b.targetFrame=b.targetStep*b.framesPerStep;b.text=a[b.name].text;b.timing=a[b.name].timing;b.MiniMacaroniMeter&&(b.MiniMacaroniMeter.transitionDuration=settings.ANIMATION_LENGTH/Math.abs(b.MiniMacaroniMeter.targetStep-c)/b.MiniMacaroniMeter.framesPerStep,b.MiniMacaroniMeter.targetStep=c,b.MiniMacaroniMeter.targetFrame=b.MiniMacaroniMeter.targetStep*
b.MiniMacaroniMeter.framesPerStep);return!0});return 0<b.length});0<e.length?c?(e.forEach(function(b){b.forEach(function(b){m[b].setState(a[m[b].name].value-1)})}),r=!1):(m[e[0][0]].startingFrame=m[e[0][0]].currentFrame,v(),$("#messageBox").animate({opacity:1},settings.MESSAGEBOX_ANIMATION_LENGTH),l.moveLightToLocation(0,f(),0,function(){l.turnOnLights(settings.TURN_ON_LIGHTS_LENGTH,function(){h()})})):l.moveLightToLocation(0,{x:865,y:469,width:1557,height:938/.9,scale:{x:1,y:1},offset:{x:1,y:1}},
0,function(){l.turnOnLights(settings.TURN_ON_LIGHTS_LENGTH,function(){$("#noChangeMessage").delay(500).fadeIn(800,function(){$("#noChangeMessage").delay(1E3).fadeOut(800,b)})})})}function v(){$("#timePeriod").text("Time Period: "+x[q]);var a,b=m[e[0][0]];a=""+(b.label+": ");a+=Math.floor(b.startingFrame/b.framesPerStep)+1;a=a+" &#10140; "+(Math.floor(b.targetFrame/b.framesPerStep)+1);$("#washappenin").html(a);$("#msgTxt").text(m[e[0][0]].text)}function w(b,c){a(b);m=containers.map(function(a){var b,
d=[];for(b=0;b<a.items;b++)d[b]=a.path+(b+1)+a.ext;d=d.map(function(b){return new Frame(b,a.width,a.height)});b=new Animator(a.name,d,a.isFrame,a.x,a.y,a.scale,c[0][a.name].value-1);b.display();a.macaroni.needed&&b.createMacaroniMeter(a.macaroni.name+"MacaroniMeter",a.macaroni.x,a.macaroni.y,a.macaroni.mirrored);b.label=a.label;return b});var d=document.getElementById("insolation"),e=document.getElementById("underwaterVolcano");d.setAttributeNS(null,"clip-path","url(#overflowClip)");e.setAttribute("mask",
"url(#Mask)");$("a, a + * + text").on("click",function(){if(!r&&!$(this.parentElement).hasClass("active")){r=!0;var a=parseInt((this.parentElement||this.parentNode).id.slice(-1),10)-1;$("#timeline g").removeClass("active");$(this.parentElement).addClass("active");t=a;g();return!1}})}var m,e,r=!1,l=new Spotlights;l.generateScene(1730,938,"#spots");l.addLight(-50,-50,20,20);l.turnOffLights(0,function(){});$("#MRRECT").click(function(){window.location.href="./homepage.html"});var x=["INITIAL","100-1000 Years",
"100 Thousand Years","1 Million Years","10 Million Years"],q=0,t=0,u;getCSV(function(a,b){var c;a?($("#error").toggleClass("hide"),$("svg").toggleClass("hide")):(c=b.shift(),u=b,w(c,b))})})();