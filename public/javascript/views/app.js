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

			Repositories.fetch();
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

			var root = {
				children: [
					{
						children: [], 
						name: "inner"
					}
				], 
				name: 'outer'
			};

			//d3.json("/json/func.json", function(error, root) {
			var nodes = tree.nodes(root),
			    links = tree.links(nodes);

			var link = svg.selectAll(".link")
			    .data(links)
			  .enter().append("path")
			    .attr("class", "link")
			    .attr("d", diagonal);

			var node = svg.selectAll(".node")
			  .data(nodes)
			  .enter().append("g")
			    .attr("class", "node")
			    .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

			node.append("circle")
			    .attr("r", 4.5);

			node.append("text")
			    .attr("dx", function(d) { return d.children ? -8 : 8; })
			    .attr("dy", 3)
			    .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
			    .text(function(d) { return d.name; });

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
	      		email: "asdf@slkdjf.com"
	      	});
	    }
	});

	var App = new AppView;
});