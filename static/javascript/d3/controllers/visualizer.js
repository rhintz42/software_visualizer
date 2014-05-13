// Add things like changing the `el` to render into and such
// TODO: Create VisualizerModel that will have all the properties
var VisualizerController = function(el, width, height) {
    this.width = width;
    this.height = height;
    this.el = el;

    this.tree = d3.layout.tree()
                    .size([this.height, this.width - 160]);
    this.addSVG();
}

VisualizerController.prototype.addSVG = function() {
    this.svg = d3.select(this.el).append("svg")
                    .attr("width", this.width)
                    .attr("height", this.height)
               .append("g")
                    .attr("transform", "translate(40,0)");
}

VisualizerController.prototype.getSVG = function() {
    return this.svg;
}

VisualizerController.prototype.getTree = function() {
    return this.tree;
}