$(function() {
	var AppView = Backbone.View.extend({
		el: $("#repositoryapp"),

		events: {
			"click #new-repository": "createOnEnter"//,
			//"mouseup .node": "testMethod"		
		},

		model: AppModel,

		_initializeListeners: function() {
			//this.listenTo(this, 'clicked', this.update);
			this.listenTo(Repositories, 'add', this.addOne);
		},

		_initializeModel: function() {
			this.model = new AppModel;
		},

		initialize: function() {
			var self = this;

			self._initializeModel();
			self._initializeListeners();

			this.d3Visualizer = new VisualizerController(this.el, 
														 self.model.width,
														 self.model.height);

			this.svg = this.d3Visualizer.getSVG();

			this.tree = this.d3Visualizer.getTree();

			// Do this instead of async:false because it's the backbone way of
			//	doing this
			Repositories.fetch({
				success: function() {
                    self.stopListening(Repositories);
					self.render();
				}
			});
		},

		render: function() {
			// Empty the element for rerendering
			
			this.$el.html("");

			/*--------------------- JS PLUMB IMPLEMENTATION FOR THIS PAGE ------------------------------ */
			;(function() {

			    jsPlumb.ready(function() {          

			        var color = "gray";

			        var instance = jsPlumb.getInstance({
			            // notice the 'curviness' argument to this Bezier curve.  the curves on this page are far smoother
			            // than the curves on the first demo, which use the default curviness value.            
			            Connector : [ "Bezier", { curviness:50 } ],
			            DragOptions : { cursor: "pointer", zIndex:2000 },
			            PaintStyle : { strokeStyle:color, lineWidth:2 },
			            EndpointStyle : { radius:9, fillStyle:color },
			            HoverPaintStyle : {strokeStyle:"#ec9f2e" },
			            EndpointHoverStyle : {fillStyle:"#ec9f2e" },
			            Container:"chart-demo"
			        });

			        // suspend drawing and initialise.
			        instance.doWhileSuspended(function() {      
			            // declare some common values:
			            var arrowCommon = { foldback:0.7, fillStyle:color, width:14 },
			                // use three-arg spec to create two different arrows with the common values:
			                overlays = [
			                    [ "Arrow", { location:0.7 }, arrowCommon ],
			                    [ "Arrow", { location:0.3, direction:-1 }, arrowCommon ]
			                ];

			            // add endpoints, giving them a UUID.
			            // you DO NOT NEED to use this method. You can use your library's selector method.
			            // the jsPlumb demos use it so that the code can be shared between all three libraries.
			            var windows = jsPlumb.getSelector(".chart-demo .window");
			            for (var i = 0; i < windows.length; i++) {
			                instance.addEndpoint(windows[i], {
			                    uuid:windows[i].getAttribute("id") + "-bottom",
			                    anchor:"Bottom",
			                    maxConnections:-1
			                });
			                instance.addEndpoint(windows[i], {
			                    uuid:windows[i].getAttribute("id") + "-top",
			                    anchor:"Top",
			                    maxConnections:-1
			                });
			            }

			            instance.connect({uuids:["chartWindow3-bottom", "chartWindow6-top" ], overlays:overlays, detachable:true, reattach:true});
			            instance.connect({uuids:["chartWindow1-bottom", "chartWindow2-top" ], overlays:overlays});
			            instance.connect({uuids:["chartWindow1-bottom", "chartWindow3-top" ], overlays:overlays});
			            instance.connect({uuids:["chartWindow2-bottom", "chartWindow4-top" ], overlays:overlays});
			            instance.connect({uuids:["chartWindow2-bottom", "chartWindow5-top" ], overlays:overlays});

			            instance.draggable(windows);        
			        });
			    });

			})();

			/* --------------------------------------------------------------------------------------------- */
			/*
			// Create the svg element.
			// TODO: Put this into another function, but should see where I
			//	want to put creating of html elements. Possibly separate
			//	into separate folder (Look at anweb to see what they do)

			// Add different call for displaying. Should be something like
			//	"addDisplay" or something
			this.d3Visualizer.addSVG();
			this.svg = this.d3Visualizer.getSVG();

			// I don't think I need this, but keep here for now
			d3.select(self.frameElement).style("height", this.model.height + "px");

			// this.root is currently nothing at this point, so let it be null
			this.update();

			*/
			return this;
		},

        /*
		testMethod: function(event, other) {
			alert("Node ID: " + event.currentTarget.id.substring("node_id:".length));
		},*/

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

		createOnEnter: function(callback) {
            var self = this;
	      	Repositories.create({
	      		name: "wowie!",
	      		type_node: "repository"
	      	}, {
                success: function(event, data) {
                    callback(event, data)
                }
            });
	    },
	
		click: function(source) {
			/* Get Node */
			var node = null;
			if(source.id in this.model.nodeDict) {
				node = this.model.nodeDict[source.id];
			} else {
				node = this;
			}

			/* Hide Node
			node.model.hidden = true;
			d = d.parent;
			*/

			/* Add Node to Parent */
			node.createOnEnter(function(source, event, data) {
                if(data.type_node === "folder") {
                    folder = new Folder(data);
                    this.addFolder(folder)
                } else {
                    rep = new Repository(data);
                    this.addOne(rep);
                }
                this.update(source);
            }.bind(this, source));

			//var repositoryView = new RepositoryView({model: repositoryModel});
			//node.model.children.push(repositoryView);

			//this.model.addToNodeDict(repositoryView);

			/* Set all Children As Hidden
			if(node.model.children) {
		  		_.each(node.model.children, function(c) {
		  			if(c.model.hidden) {
		  				c.model.hidden = false;
		  			} else {
		  				c.model.hidden = true;
		  			}
		  		});
			}
			*/

            // Should I just call `this.update(d)` instead?
		  	//this.trigger('clicked', d);

            //this.update(source);
		},

        addFolder: function(folder) {
            var folderView = new FolderView({
                model: folder,
                parent: this
            });	
            this.model.nodeDict[folder.get("repository_id")].model.children.push(folderView);
            this.$(".folder-list").append(folderView.render().el);

            this.model.addToNodeDict(folderView);
        },

		/* source is the svgNode that you want to be the source of stuff,
			this includes the location the animation starts */
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
		  var svgNodes = this.tree.nodes(this.root),//.reverse(),
		      links = this.tree.links(svgNodes);

		  // ---------- Get Source from svgNodes -------------------
		  // Description: Because we get the new nodes with the toDict function,
		  //	We need to get the new source node and set it's x0 and y0 values
		  //	in order for the creating of nodes/links to stay fluid and not
		  //	collapse/expand in random places
          /*
		  newSource = _.find(svgNodes, function(d) {
		  	return d.id === source.id;
		  });

		  if(newSource) {
		  	newSource.x0 = source.x0;
		  	newSource.y0 = source.y0;
		  	source = newSource;
		  }
          */
          
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
		      .attr("id", function(d) {
		      	return "node_id:" + d.id;
		      })
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
		      .attr("r", 10)
		      //.attr("r", 4.5)
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
