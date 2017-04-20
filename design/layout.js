var draw = SVG('drawing').size(1730, 938)
var shadow = function (add) {
	var blur = add.offset(2, 2).in(add.sourceAlpha).gaussianBlur(4)
	add.blend(add.source, blur)
}
var gradient = draw.gradient('linear', function (stop) {
	stop.at(.2, '#000')
	stop.at(.5, '#fff')
}).from(0, 0).to(0, 1)

var background = draw.group()
layoutData.background.forEach(img => {
	background.add(draw.image(img.ref, img.width, img.height).x(img.x).y(img.y))
})

var forcers = draw.group()
layoutData.forcers.forEach((seg, i) => {
	var group = draw.group()
	seg.forEach(elm => {
		if (elm.ref)
			group.add(draw.image(elm.ref, elm.width, elm.height))
		else
			group.add(draw.text(elm.text).x(elm.x).y(elm.y).font(layoutData.styling["normal"]))
	})
	group.x(layoutData.forcersPlacement[i][0]).y(layoutData.forcersPlacement[i][1]).dy(-7)
	group.children()[2].filter(shadow)
	forcers.add(group)
})
forcers.x(272).y(107)

var animated = draw.group()
var mac = imageData[imageData.length - 1]
imageData.forEach(elm => {
	elm.handle = draw.group()
	// for each image in the folder
	for (var i = 1; i <= elm.items; i++) {
		var frame = draw.image(elm.path + i + elm.ext, elm.width, elm.height)
			.x(elm.x).y(elm.y).scale(elm.scale.x, elm.scale.y).data('frame', i - 1).opacity(0).data('macaroni','false')
		if (elm.name == "underwaterVolcano") {
			var mask = draw.mask().add(draw.rect(elm.width, elm.height).x(elm.x).y(elm.y).scale(elm.scale.x, elm.scale.y).fill(gradient))
			frame.maskWith(mask)
		}
		elm.handle.add(frame)
	}
	if (elm.macaroni.needed) {
		for (var i = 1; i <= elm.items; i++) {
			var macaroni = draw.image(mac.path + i + mac.ext, mac.width, mac.height)
				.x(elm.macaroni.x).y(elm.macaroni.y).data('frame', i - 1).opacity(0).data('macaroni','true')
			if (elm.macaroni.mirrored)
				macaroni.scale(-1, 1)
			elm.handle.add(macaroni)
		}
	}
})

var text = draw.group()
layoutData.text.forEach(line => {
	text.add(
		line.font.reduce((sum, font) => sum.font(layoutData.styling[font]),
			draw.text(line.text).x(line.x).y(line.y).font(layoutData.styling["normal"])
		)
	)
})
text.add(draw.text(add => {
	add.tspan('CO').font(layoutData.styling["notBold"])
	add.tspan('2').dy(5).font(layoutData.styling["smallText"])
}).x(535).y(790).font(layoutData.styling["normal"]))
text.dy(-7).children().forEach(child => child.filter(shadow))

var timeline = draw.group()
layoutData.timeline.forEach((seg, i) => {
	var time = draw.group()
	seg.forEach(elm => {
		if (elm.ref)
			time.add(draw.image(elm.ref, elm.width, elm.height))
		else
			time.add(draw.text(elm.text).x(elm.x).y(12.5).font(layoutData.styling["normal"]).font(layoutData.styling["smallText"]))
	})
	time.x(layoutData.timelinePlacement[i]).data('phase', i)
	time.children()[2].filter(shadow)
	time.children()[0].opacity(0)
	time.on("mouseover", function () {
		this.children()[0].opacity(1)
		this.children()[1].opacity(0)
		this.children()[2].font('fill', '#444').unfilter()
		$('body').css('cursor', 'pointer')
	})
	time.on("mouseout", function () {
		this.children()[0].opacity(0)
		this.children()[1].opacity(1)
		this.children()[2].font('fill', '#fff').filter(shadow)
		$('body').css('cursor', 'auto')
	})
	timeline.add(time)
})
timeline.x(147).y(204).scale(1, 1.2)
