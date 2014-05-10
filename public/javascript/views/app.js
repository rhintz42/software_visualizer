$(function() {

	var AppView = Backbone.View.extend({
		el: $("#repositoryapp"),

		events: {
			"click #new-repository": "createOnEnter"
		},

		initialize: function() {
			this.listenTo(Repositories, 'add', this.addOne);
			this.listenTo(Repositories, 'reset', this.addAll);
			this.listenTo(Repositories, 'all', this.render);

			this.render();
			//Repositories.fetch();
		},

		render: function() {
			this.$el.html("<div></div>");

			var width = 760,
			    height = 200;

			var tree = d3.layout.tree()
			    .size([height, width - 160]);

			var diagonal = d3.svg.diagonal()
			    .projection(function(d) { return [d.y, d.x]; });

			var svg = d3.select(this.el).append("svg")
			    .attr("width", width)
			    .attr("height", height)
			  .append("g")
			    .attr("transform", "translate(40,0)");

			// Create root element
			var root = {
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

			// Create array of nodes from root
			var nodes = tree.nodes(root),
			    links = tree.links(nodes);

			// Create all elements of the ".link" class
			var link = svg.selectAll(".link")
			    .data(links)
			  .enter().append("path")
			    .attr("class", "link")
			    .attr("d", diagonal);

			// Get all elements with ".node" class
			var svgNodes = svg.selectAll(".node")
			  	.data(nodes)
			  .enter().append("g")
			    .attr("class", "node")
			    .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

			// Add "circle" element onto each node object
			svgNodes.append("circle")
			    .attr("r", 4.5);

			// Add "text" element onto each node object
			svgNodes.append("text")
			    .attr("dx", function(d) { return d.children ? -8 : 8; })
			    .attr("dy", 3)
			    .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
			    .text(function(d) { return d.name; });

			// Add "height" onto this frameElements
			d3.select(self.frameElement).style("height", height + "px");

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
	      		//email: "asdf@slkdjf.com"
	      	});
	    }
	});

	var App = new AppView;
});