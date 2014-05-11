$(function() {
	var AppView = Backbone.View.extend({
		el: $("#repositoryapp"),

		events: {
			"click #new-repository": "createOnEnter"
		},

		model: AppModel,

		_initializeListeners: function() {
			this.listenTo(this, 'clicked', this.update);
			this.listenTo(Repositories, 'add', this.addOne);
		},

		_initializeModel: function() {
			this.model = new AppModel;
		},

		initialize: function() {
			var self = this;

			self._initializeModel();
			self._initializeListeners();

			this.tree = d3.layout.tree()
			    .size([self.model.height, self.model.width - 160]);

			this.svg = d3.select(this.el).append("svg")
			    .attr("width", self.model.width)
			    .attr("height", self.model.height)
			  .append("g")
			    .attr("transform", "translate(40,0)");

			// Do this instead of async:false because it's the backbone way of
			//	doing this
			Repositories.fetch({
				success: function() {
					self.render();
				}
			});
		},

		render: function() {
			// Empty the element for rerendering
			this.$el.html("<div></div>");

			// Create the svg element.
			// TODO: Put this into another function, but should see where I
			//	want to put creating of html elements. Possibly separate
			//	into separate folder (Look at anweb to see what they do)
			this.svg = d3.select(this.el).append("svg")
			    .attr("width", this.model.width)
			    .attr("height", this.model.height)
			  .append("g")
				.attr("transform", "translate(40,0)");

			// I don't think I need this, but keep here for now
			d3.select(self.frameElement).style("height", this.model.height + "px");

			// this.root is currently nothing at this point, so let it be null
			this.update();

			return this;
		},

		addOne: function(repository) {
			repository.nodeDict = this.model.nodeDict;

			var repositoryView = new RepositoryView({model: repository});	
			this.model.children.push(repositoryView);

			this.$("#repository-list").append(repositoryView.render().el);

			this.model.addToNodeDict(repositoryView);
		},

		addAll: function() {
			Repositories.each(this.addOne, this);
		},

		createOnEnter: function(e) {
	      	Repositories.create({
	      		name: "wowie!", 
	      		email: "asdf@slkdjf.com"
	      	});
	    },
	
		click: function(d) {
			var node = null;
			if(d.id in this.model.nodeDict) {
				node = this.model.nodeDict[d.id];
			} else {
				node = this;
			}

			if(node.model.children) {
		  		_.each(node.model.children, function(c) {
		  			if(c.model.hidden) {
		  				c.model.hidden = false;
		  			} else {
		  				c.model.hidden = true;
		  			}
		  		});
			}

			/*
			if(d.children) {
				d._children = d.children;
				d.children = null;
			} else {
				d.children = d._children;
				d._children = null;
			}
			*/

		  	this.trigger('clicked', d);
		},

	    update: function(source) {
	      var self = this;

	      // Should be in function `fetchRoot()`
	      // We can't yet just regenerate the root because we don't save
	      //	new information in the models yet. Once we do, we can.
	      // Do I want to call toDict() here or where I call update instead?
	      //	I feel I'm doing a lot of unnecessary stuff in this update
	      //	function that has an effect on performance and cleanliness
	      //	of code. However, this probably should stay here because the
	      //	only time we want to update the code is when we change
	      //	something with a node, in which we want to call toDict(),
	      //	then get the new source
		  self.root = self.toDict();

		  self.root.x0 = 200 / 2;
		  self.root.y0 = 0;

	      if(source === undefined) {
	      	source = self.root;
	      }

		  var diagonal = d3.svg.diagonal()
		    .projection(function(d) {
		    	return [d.y, d.x]; 
		    });
		  // Compute the new tree layout.
		  // By doing it this way, it will set the source as the root and will
		  //	set it as the left-most node way
		  //var svgNodes = this.tree.nodes(source).reverse(),
		  var svgNodes = this.tree.nodes(this.root),
		      links = this.tree.links(svgNodes);

		  // ---------- Get Source from svgNodes -------------------
		  // Description: Because we get the new nodes with the toDict function,
		  //	We need to get the new source node and set it's x0 and y0 values
		  //	in order for the creating of nodes/links to stay fluid and not
		  //	collapse/expand in random places
		  newSource = _.find(svgNodes, function(d) {
		  	return d.id === source.id;
		  });

		  if(newSource) {
		  	newSource.x0 = source.x0;
		  	newSource.y0 = source.y0;
		  	source = newSource;
		  }
		  // -------------------------------------------------------

		  // Normalize for fixed-depth.
		  svgNodes.forEach(function(d) { d.y = d.depth * 180; });

		  // Update the nodes…
		  var node = this.svg.selectAll("g.node")
		      .data(svgNodes, function(d) {
		      	return d.id || (d.id = ++self.model.numNodesWithoutID);
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
		      .attr("transform", function(d) { 
		      	return "translate(" + source.y + "," + source.x + ")";
		      })
		      .remove();

		  nodeExit.select("circle")
		      .attr("r", 1e-6);

		  nodeExit.select("text")
		      .style("fill-opacity", 1e-6);

		  // Update the links…
		  var link = this.svg.selectAll("path.link")
		      .data(links, function(d) { 
		      	return d.target.id; 
		      });

		  // Enter any new links at the parent's previous position.
		  link.enter().insert("path", "g")
		      .attr("class", "link")
		      .attr("d", function(d) {
		        var o = {x: source.x0, y: source.y0};
		        return diagonal({
		        	source: o, target: o
		        });
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
		        return diagonal({
		        	source: o, target: o
		        });
		      })
		      .remove();

		  // Stash the old positions for transition.
		  svgNodes.forEach(function(d) {
		    d.x0 = d.x;
		    d.y0 = d.y;
		  });
		},

		toDict: function(){
			return this.model.toDict();
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