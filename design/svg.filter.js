/*! svg.filter.js - v2.0.2 - 2016-03-02
* https://github.com/wout/svg.filter.js
* Copyright (c) 2016 Wout Fierens; Licensed MIT */
(function(){function a(a){return Array.isArray(a)&&(a=new SVG.Array(a)),a.toString().replace(/^\s+/,"").replace(/\s+$/,"").replace(/\s+/g," ")}function b(){var a=function(){};"function"==typeof arguments[arguments.length-1]&&(a=arguments[arguments.length-1],Array.prototype.splice.call(arguments,arguments.length-1,1));for(var b in arguments)for(var c in arguments[b])a(arguments[b][c],c,arguments[b])}SVG.Filter=SVG.invent({create:"filter",inherit:SVG.Parent,extend:{source:"SourceGraphic",sourceAlpha:"SourceAlpha",background:"BackgroundImage",backgroundAlpha:"BackgroundAlpha",fill:"FillPaint",stroke:"StrokePaint",autoSetIn:!0,put:function(a,b){return this.add(a,b),!a.attr("in")&&this.autoSetIn&&a.attr("in",this.source),a.attr("result")||a.attr("result",a),a},blend:function(a,b,c){return this.put(new SVG.BlendEffect(a,b,c))},colorMatrix:function(a,b){return this.put(new SVG.ColorMatrixEffect(a,b))},convolveMatrix:function(a){return this.put(new SVG.ConvolveMatrixEffect(a))},componentTransfer:function(a){return this.put(new SVG.ComponentTransferEffect(a))},composite:function(a,b,c){return this.put(new SVG.CompositeEffect(a,b,c))},flood:function(a,b){return this.put(new SVG.FloodEffect(a,b))},offset:function(a,b){return this.put(new SVG.OffsetEffect(a,b))},image:function(a){return this.put(new SVG.ImageEffect(a))},merge:function(){var a=[void 0];for(var b in arguments)a.push(arguments[b]);return this.put(new(SVG.MergeEffect.bind.apply(SVG.MergeEffect,a)))},gaussianBlur:function(a,b){return this.put(new SVG.GaussianBlurEffect(a,b))},morphology:function(a,b){return this.put(new SVG.MorphologyEffect(a,b))},diffuseLighting:function(a,b,c){return this.put(new SVG.DiffuseLightingEffect(a,b,c))},displacementMap:function(a,b,c,d,e){return this.put(new SVG.DisplacementMapEffect(a,b,c,d,e))},specularLighting:function(a,b,c,d){return this.put(new SVG.SpecularLightingEffect(a,b,c,d))},tile:function(){return this.put(new SVG.TileEffect)},turbulence:function(a,b,c,d,e){return this.put(new SVG.TurbulenceEffect(a,b,c,d,e))},toString:function(){return"url(#"+this.attr("id")+")"}}}),SVG.extend(SVG.Defs,{filter:function(a){var b=this.put(new SVG.Filter);return"function"==typeof a&&a.call(b,b),b}}),SVG.extend(SVG.Container,{filter:function(a){return this.defs().filter(a)}}),SVG.extend(SVG.Element,SVG.G,SVG.Nested,{filter:function(a){return this.filterer=a instanceof SVG.Element?a:this.doc().filter(a),this.doc()&&this.filterer.doc()!==this.doc()&&this.doc().defs().add(this.filterer),this.attr("filter",this.filterer),this.filterer},unfilter:function(a){return this.filterer&&a===!0&&this.filterer.remove(),delete this.filterer,this.attr("filter",null)}}),SVG.Effect=SVG.invent({create:function(){this.constructor.call(this)},inherit:SVG.Element,extend:{"in":function(a){return null==a?this.parent()&&this.parent().select('[result="'+this.attr("in")+'"]').get(0)||this.attr("in"):this.attr("in",a)},result:function(a){return null==a?this.attr("result"):this.attr("result",a)},toString:function(){return this.result()}}}),SVG.ParentEffect=SVG.invent({create:function(){this.constructor.call(this)},inherit:SVG.Parent,extend:{"in":function(a){return null==a?this.parent()&&this.parent().select('[result="'+this.attr("in")+'"]').get(0)||this.attr("in"):this.attr("in",a)},result:function(a){return null==a?this.attr("result"):this.attr("result",a)},toString:function(){return this.result()}}});var c={blend:function(a,b){return this.parent()&&this.parent().blend(this,a,b)},colorMatrix:function(a,b){return this.parent()&&this.parent().colorMatrix(a,b)["in"](this)},convolveMatrix:function(a){return this.parent()&&this.parent().convolveMatrix(a)["in"](this)},componentTransfer:function(a){return this.parent()&&this.parent().componentTransfer(a)["in"](this)},composite:function(a,b){return this.parent()&&this.parent().composite(this,a,b)},flood:function(a,b){return this.parent()&&this.parent().flood(a,b)},offset:function(a,b){return this.parent()&&this.parent().offset(a,b)["in"](this)},image:function(a){return this.parent()&&this.parent().image(a)},merge:function(){return this.parent()&&this.parent().merge.apply(this.parent(),[this].concat(arguments))},gaussianBlur:function(a,b){return this.parent()&&this.parent().gaussianBlur(a,b)["in"](this)},morphology:function(a,b){return this.parent()&&this.parent().morphology(a,b)["in"](this)},diffuseLighting:function(a,b,c){return this.parent()&&this.parent().diffuseLighting(a,b,c)["in"](this)},displacementMap:function(a,b,c,d){return this.parent()&&this.parent().displacementMap(this,a,b,c,d)},specularLighting:function(a,b,c,d){return this.parent()&&this.parent().specularLighting(a,b,c,d)["in"](this)},tile:function(){return this.parent()&&this.parent().tile()["in"](this)},turbulence:function(a,b,c,d,e){return this.parent()&&this.parent().turbulence(a,b,c,d,e)["in"](this)}};SVG.extend(SVG.Effect,c),SVG.extend(SVG.ParentEffect,c),SVG.ChildEffect=SVG.invent({create:function(){this.constructor.call(this)},inherit:SVG.Element,extend:{"in":function(a){this.attr("in",a)}}});var d={blend:function(a,b,c){this.attr({"in":a,in2:b,mode:c||"normal"})},colorMatrix:function(b,c){"matrix"==b&&(c=a(c)),this.attr({type:b,values:"undefined"==typeof c?null:c})},convolveMatrix:function(b){b=a(b),this.attr({order:Math.sqrt(b.split(" ").length),kernelMatrix:b})},composite:function(a,b,c){this.attr({"in":a,in2:b,operator:c})},flood:function(a,b){this.attr("flood-color",a),null!=b&&this.attr("flood-opacity",b)},offset:function(a,b){this.attr({dx:a,dy:b})},image:function(a){this.attr("href",a,SVG.xlink)},displacementMap:function(a,b,c,d,e){this.attr({"in":a,in2:b,scale:c,xChannelSelector:d,yChannelSelector:e})},gaussianBlur:function(a,b){a=a||0,b=b||a||0,this.attr("stdDeviation",a+" "+b)},morphology:function(a,b){this.attr({operator:a,radius:b})},tile:function(){},turbulence:function(a,b,c,d,e){this.attr({numOctaves:b,seed:c,stitchTiles:d,baseFrequency:a,type:e})}},e={merge:function(){var a;if(arguments[0]instanceof SVG.Set){var b=this;arguments[0].each(function(a){this instanceof SVG.MergeNode?b.put(this):(this instanceof SVG.Effect||this instanceof SVG.ParentEffect)&&b.put(new SVG.MergeNode(this))})}else{a=Array.isArray(arguments[0])?arguments[0]:arguments;for(var c=0;c<a.length;c++)a[c]instanceof SVG.MergeNode?this.put(a[c]):this.put(new SVG.MergeNode(a[c]))}},componentTransfer:function(a){if(this.rgb=new SVG.Set,["r","g","b","a"].forEach(function(a){this[a]=new(SVG["Func"+a.toUpperCase()])("identity"),this.rgb.add(this[a]),this.node.appendChild(this[a].node)}.bind(this)),a){a.rgb&&(["r","g","b"].forEach(function(b){this[b].attr(a.rgb)}.bind(this)),delete a.rgb);for(var b in a)this[b].attr(a[b])}},diffuseLighting:function(a,b,c){this.attr({surfaceScale:a,diffuseConstant:b,kernelUnitLength:c})},specularLighting:function(a,b,c,d){this.attr({surfaceScale:a,diffuseConstant:b,specularExponent:c,kernelUnitLength:d})}},f={distantLight:function(a,b){this.attr({azimuth:a,elevation:b})},pointLight:function(a,b,c){this.attr({x:a,y:b,z:c})},spotLight:function(a,b,c,d,e,f){this.attr({x:a,y:b,z:c,pointsAtX:d,pointsAtY:e,pointsAtZ:f})},mergeNode:function(a){this.attr("in",a)}};["r","g","b","a"].forEach(function(a){f["Func"+a.toUpperCase()]=function(a){switch(this.attr("type",a),a){case"table":this.attr("tableValues",arguments[1]);break;case"linear":this.attr("slope",arguments[1]),this.attr("intercept",arguments[2]);break;case"gamma":this.attr("amplitude",arguments[1]),this.attr("exponent",arguments[2]),this.attr("offset",arguments[2])}}}),b(d,function(a,b){var c=b.charAt(0).toUpperCase()+b.slice(1),d={};SVG[c+"Effect"]=SVG.invent({create:function(){this.constructor.call(this,SVG.create("fe"+c)),a.apply(this,arguments),this.result(this.attr("id")+"Out")},inherit:SVG.Effect,extend:d})}),b(e,function(a,b){var c=b.charAt(0).toUpperCase()+b.slice(1),d={};SVG[c+"Effect"]=SVG.invent({create:function(){this.constructor.call(this,SVG.create("fe"+c)),a.apply(this,arguments),this.result(this.attr("id")+"Out")},inherit:SVG.ParentEffect,extend:d})}),b(f,function(a,b){var c=b.charAt(0).toUpperCase()+b.slice(1),d={};SVG[c]=SVG.invent({create:function(){this.constructor.call(this,SVG.create("fe"+c)),a.apply(this,arguments)},inherit:SVG.ChildEffect,extend:d})}),SVG.extend(SVG.MergeEffect,{"in":function(a){return a instanceof SVG.MergeNode?this.add(a,0):this.add(new SVG.MergeNode(a),0),this}}),SVG.extend(SVG.CompositeEffect,SVG.BlendEffect,SVG.DisplacementMapEffect,{in2:function(a){return null==a?this.parent()&&this.parent().select('[result="'+this.attr("in2")+'"]').get(0)||this.attr("in2"):this.attr("in2",a)}}),SVG.filter={sepiatone:[.343,.669,.119,0,0,.249,.626,.13,0,0,.172,.334,.111,0,0,0,0,0,1,0]}}).call(this);
