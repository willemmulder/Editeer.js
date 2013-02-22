$(function() {

	// ==========
	// Variables

	var slideCount = 0;
	var thumbnailList;
	var slideList;
	var presentation;


	// ==========
	// Main init

	// Make slidethumbnails draggable
	makeSlideThumbnailsDraggable();

	// Makde slides draggable
	makeSlidesDraggable();

	// Create presentation
	presentation = new Presenteer(".canvas", ".canvas .slide", { 
		centerHorizontally : true
	});

	// Add 1 slide
	addSlide();

	// Add slide button
	$(".addslide").click(function() {
		addSlide();
	});

	// Make presentation show first slide
	$(".slidethumbnails .slidethumbnail:first").click();


	// ==========
	// Helper functions

	function addSlide() {
		slideCount++;

		var $slide = $('<div>').addClass("slide").attr("data-slide", slideCount).css("top", "0px").css("left", (slideCount-1)*300 + "px");
		$slide.html("<h1>"+slideCount+"</h1>");
		$(".canvas").append($slide);

		var $slidethumbnail = $('<div>').addClass("slidethumbnail").data("slide", slideCount).html(slideCount);
		$(".slidethumbnails .addslide").before($slidethumbnail);

		// Couple slide and slidethumbnail via events
		$slidethumbnail.add($slide).hover(
			function() {
				$slide.add($slidethumbnail).addClass("hovered");
			},
			function() {
				$slide.add($slidethumbnail).removeClass("hovered");
			}
		);

		// Update thumbnails for dragging
		thumbnailList.update();

		// Update slides for dragging
		slideList.update();

		// Update presentation
		presentation.update();

		// On click, show proper slide
		$slidethumbnail.on("click", function() { 
			presentation.show($slide); 
			$(this).addClass("active").siblings().removeClass("active");
		});

	}

	function makeSlideThumbnailsDraggable() {
		thumbnailList = $(".slidethumbnails").html5dragdrop({
			"draggables" : ".slidethumbnail",
			"droppables" : ".slidethumbnail",
			onDragStart : function(draggedElement, details) {
				draggedElement.animate({
					opacity: 0.2
				});
			},
			onDragCancelled : function(draggedElement, details) {
				draggedElement.animate({
					opacity: 1
				});
			},
			onDrop : function(draggedElement, destinationDroppable, details) {
				draggedElement.animate({
					opacity: 1
				});
				placeAtList(draggedElement, details.currentlyHoveredElement, details);
			},
			onHoverDroppable : function(draggedElement,  hoveredDroppable, details) {
				placeAtList(draggedElement, details.currentlyHoveredElement, details);
			}
		});
		function placeAtList(elementToPlace, target, details) {
			if (details.mouseLocation.inCurrentElement.x < target.outerWidth(true) / 2) {
				// Place before element
				target.before(elementToPlace);
			} else {
				// Place after element
				target.after(elementToPlace);
			}
		}
	}

	function makeSlidesDraggable() {
		slideList = $(".viewport").html5dragdrop({
			"draggables" : ".slide",
			"droppables" : ".canvas",
			onDragStart : function(draggedElement, details) {
				draggedElement.animate({
					opacity: 0.2
				});
			},
			onDragCancelled : function(draggedElement, details) {
				draggedElement.animate({
					opacity: 1
				});
			},
			onDrop : function(draggedElement, destinationDroppable, details) {
				draggedElement.animate({
					opacity: 1
				});
				placeAtList(draggedElement, details.currentlyHoveredElement, details);
			},
			onHoverDroppable : function(draggedElement,  hoveredDroppable, details) {
				placeAtCanvas(draggedElement, details.currentlyHoveredElement, details);
			},
			getGhostingContent : function() {
				return $("<div>");
			}
		});
		function placeAtCanvas(elementToPlace, target, details) {
			console.log(slideList.getPositionAtCanvas({positionInViewport:{x:1,y:1}}));
			target.css("left", details.mouseLocation.inDroppable.x).css("top", details.mouseLocation.inDroppable.y);
		}
	}

});