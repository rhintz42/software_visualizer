$(function() {
	var i = 0;

	var AppView = Backbone.View.extend({
		el: $("#repositoryapp"),

		events: {
			"click #new-repository": "createOnEnter"
		},

		initialize: function() {
			this.listenTo(Repositories, 'add', this.addOne);
			this.listenTo(Repositories, 'reset', this.addAll);
			this.listenTo(Repositories, 'all', this.render);

			var width = 760,
			    height = 500;

			this.tree = d3.layout.tree()
			    .size([height, width - 160]);

			this.svg = d3.select(this.el).append("svg")
			    .attr("width", width)
			    .attr("height", height)
			  .append("g")
			    .attr("transform", "translate(40,0)");

			// Create root element
			this.root = {
				name: 'outer',
				children: [
					{
						name: "inner",
						children: [{
							name: "innerinner",
							children: []
						}] 
					},
					{
						name: "inner2",
						children: [] 
					}
				] 
			};
			this.root.x0 = height / 2;
			this.root.y0 = 0;
			//this.root.children.forEach(collapse);
			collapse(this.root);

			this.render();
			Repositories.fetch();
		},

		render: function() {
			this.$el.html("<div></div>");

			this.svg = d3.select(this.el).append("svg")
			    .attr("width", 750)
			    .attr("height", 500)
			  .append("g")
				.attr("transform", "translate(40,0)");

			d3.select(self.frameElement).style("height", 500 + "px");

			this.update(this.root);

			return this;
		},

		addOne: function(repository) {
			var view = new RepositoryView({model: repository});	
			this.$("#repository-list").append(view.render().el);
		},

		addAll: function() {
			Repositories.each(this.addOne, this);
		},

		createOnEnter: function(e) {
	      	Repositories.create({
	      		name: { first: "wowie!", last: 'Montoya' }, 
	      		email: "asdf@slkdjf.com"
	      	});
	    },
	
		click: function(d) {
		  	if (d.children) {
			    d._children = d.children;
			    d.children = null;
		  	} else {
			    d.children = d._children;
			    d._children = null;
		  	}
		  	this.update(d);
		},

	    update: function(source) {
	      var self = this;
		  var diagonal = d3.svg.diagonal()
		    .projection(function(d) {
		    	return [d.y, d.x]; 
		    });
		  
		  // Compute the new tree layout.
		  // By doing it this way, it will set the source as the root and will
		  //	set it as the left-most node way
		  //var nodes = this.tree.nodes(source).reverse(),
		  var nodes = this.tree.nodes(this.root).reverse(),
		      links = this.tree.links(nodes);

		  // Normalize for fixed-depth.
		  nodes.forEach(function(d) { d.y = d.depth * 180; });

		  // Update the nodes…
		  var node = this.svg.selectAll("g.node")
		      .data(nodes, function(d) {
		      	return d.id || (d.id = ++i);
		      });

		  // Enter any new nodes at the parent's previous position.
		  var nodeEnter = node.enter().append("g")
		      .attr("class", "node")
		      .attr("transform", function(d) {
		      	return "translate(" + source.y0 + "," + source.x0 + ")";
		      })
		      .on("click", self.click.bind(self));

		  nodeEnter.append("circle")
		      .attr("r", 1e-6)
		      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

		  nodeEnter.append("text")
		      .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
		      .attr("dy", ".35em")
		      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
		      .text(function(d) { return d.name; })
		      .style("fill-opacity", 1e-6);

		  // Transition nodes to their new position.
		  var nodeUpdate = node.transition()
		      .duration(750)
		      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

		  nodeUpdate.select("circle")
		      .attr("r", 4.5)
		      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

		  nodeUpdate.select("text")
		      .style("fill-opacity", 1);

		  // Transition exiting nodes to the parent's new position.
		  var nodeExit = node.exit().transition()
		      .duration(750)
		      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
		      .remove();

		  nodeExit.select("circle")
		      .attr("r", 1e-6);

		  nodeExit.select("text")
		      .style("fill-opacity", 1e-6);

		  // Update the links…
		  var link = this.svg.selectAll("path.link")
		      .data(links, function(d) { return d.target.id; });

		  // Enter any new links at the parent's previous position.
		  link.enter().insert("path", "g")
		      .attr("class", "link")
		      .attr("d", function(d) {
		        var o = {x: source.x0, y: source.y0};
		        return diagonal({source: o, target: o});
		      });

		  // Transition links to their new position.
		  link.transition()
		      .duration(750)
		      .attr("d", diagonal);

		  // Transition exiting nodes to the parent's new position.
		  link.exit().transition()
		      .duration(750)
		      .attr("d", function(d) {
		        var o = {x: source.x, y: source.y};
		        return diagonal({source: o, target: o});
		      })
		      .remove();

		  // Stash the old positions for transition.
		  nodes.forEach(function(d) {
		    d.x0 = d.x;
		    d.y0 = d.y;
		  });
		}
	});


	function collapse(d) {
	    if (d.children) {
	      	d._children = d.children;
	      	d._children.forEach(collapse);
	      	d.children = null;
	    }
	}

	var App = new AppView;
});