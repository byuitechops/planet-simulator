# planet-simulator

<svg id="mermaidChart0" width="100%" xmlns="http://www.w3.org/2000/svg" height="100%" style="max-width:750px;" viewBox="-50 -10 750 347">
<style type="text/css" title="mermaid-svg-internal-css">/*  */
*, ::before, ::after { box-sizing: inherit;}
.actor { stroke: rgb(204, 204, 255); fill: rgb(226, 236, 255);}
text.actor { fill: black; stroke: none; font-size: 12px;}
.actor-line { stroke: grey;}
.messageLine0 { stroke-width: 1.5; stroke: black;}
#arrowhead { fill: black;}
.messageText { fill: black; stroke: none; font-size: 12px;}
.note { stroke: rgb(204, 204, 255); fill: rgb(255, 245, 173);}
.noteText { fill: black; stroke: none; font-size: 12px;}
.actor { stroke: rgb(204, 204, 255); fill: rgb(236, 236, 255);}
text.actor { fill: black; stroke: none;}
.actor-line { stroke: grey;}
.messageLine0 { stroke-width: 1.5; stroke: rgb(51, 51, 51);}
#arrowhead { fill: rgb(51, 51, 51);}
#crosshead path { fill: rgb(51, 51, 51) !important; stroke: rgb(51, 51, 51) !important;}
.messageText { fill: rgb(51, 51, 51); stroke: none;}
.note { stroke: rgb(170, 170, 51); fill: rgb(255, 245, 173);}
.noteText { fill: black; stroke: none; font-family: "trebuchet ms", verdana, arial; font-size: 14px;}
text { font-family: "trebuchet ms", verdana, arial; font-size: 14px;}
/*  */
</style>
<g>
</g>
<g>
<line id="actor0" x1="75" y1="5" x2="75" y2="336" class="actor-line" stroke-width="0.5px" stroke="#999">
</line>
<rect x="0" y="0" fill="#eaeaea" stroke="#666" width="150" height="65" rx="3" ry="3" class="actor">
</rect>
<text x="75" y="37.5" class="actor" style="text-anchor: middle;">A</text>
</g>
<g>
<line id="actor1" x1="275" y1="5" x2="275" y2="336" class="actor-line" stroke-width="0.5px" stroke="#999">
</line>
<rect x="200" y="0" fill="#eaeaea" stroke="#666" width="150" height="65" rx="3" ry="3" class="actor">
</rect>
<text x="275" y="37.5" class="actor" style="text-anchor: middle;">B</text>
</g>
<g>
<line id="actor2" x1="475" y1="5" x2="475" y2="336" class="actor-line" stroke-width="0.5px" stroke="#999">
</line>
<rect x="400" y="0" fill="#eaeaea" stroke="#666" width="150" height="65" rx="3" ry="3" class="actor">
</rect>
<text x="475" y="37.5" class="actor" style="text-anchor: middle;">C</text>
</g>
<defs>
<marker id="arrowhead" refX="5" refY="2" markerWidth="6" markerHeight="4" orient="auto">
<path d="M 0,0 V 4 L6,2 Z">
</path>
</marker>
</defs>
<defs>
<marker id="crosshead" markerWidth="15" markerHeight="8" orient="auto" refX="16" refY="4">
<path fill="black" stroke="#000000" stroke-width="1px" d="M 9,2 V 6 L16,4 Z" style="stroke-dasharray: 0, 0;">
</path>
<path fill="none" stroke="#000000" stroke-width="1px" d="M 0,1 L 6,7 M 6,1 L 0,7" style="stroke-dasharray: 0, 0;">
</path>
</marker>
</defs>
<g>
<text x="175" y="93" class="messageText" style="text-anchor: middle;">Query</text>
<line x1="75" y1="100" x2="275" y2="100" class="messageLine0" stroke-width="2" stroke="black" marker-end="url(#arrowhead)" style="fill: none;">
</line>
</g>
<g>
<text x="375" y="128" class="messageText" style="text-anchor: middle;">Forward query</text>
<line x1="275" y1="135" x2="475" y2="135" class="messageLine0" stroke-width="2" stroke="black" marker-end="url(#arrowhead)" style="fill: none;">
</line>
</g>
<g>
<rect x="500" y="145" fill="#EDF2AE" stroke="#666" width="150" height="36" rx="0" ry="0" class="note">
</rect>
<text x="516" y="173" fill="black" class="noteText">
<tspan x="516">Thinking...</tspan>
</text>
</g>
<g>
<text x="375" y="209" class="messageText" style="text-anchor: middle;">Response</text>
<line x1="475" y1="216" x2="275" y2="216" class="messageLine0" stroke-width="2" stroke="black" marker-end="url(#arrowhead)" style="fill: none;">
</line>
</g>
<g>
<text x="175" y="244" class="messageText" style="text-anchor: middle;">Forward response</text>
<line x1="275" y1="251" x2="75" y2="251" class="messageLine0" stroke-width="2" stroke="black" marker-end="url(#arrowhead)" style="fill: none;">
</line>
</g>
<g>
<rect x="0" y="271" fill="#eaeaea" stroke="#666" width="150" height="65" rx="3" ry="3" class="actor">
</rect>
<text x="75" y="308.5" class="actor" style="text-anchor: middle;">A</text>
</g>
<g>
<rect x="200" y="271" fill="#eaeaea" stroke="#666" width="150" height="65" rx="3" ry="3" class="actor">
</rect>
<text x="275" y="308.5" class="actor" style="text-anchor: middle;">B</text>
</g>
<g>
<rect x="400" y="271" fill="#eaeaea" stroke="#666" width="150" height="65" rx="3" ry="3" class="actor">
</rect>
<text x="475" y="308.5" class="actor" style="text-anchor: middle;">C</text>
</g>
</svg>
