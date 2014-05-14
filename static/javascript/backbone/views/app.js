$(function() {

    jsPlumb.ready(function() {          
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

			_createRoot: function() {
				$("#chart-demo").append("<div class='window' id='node_id_1'>Root</div>");

				this.root = $("#node_id_1")

				this.root.css("left", "25em");
				this.root.css("top", "6em");
			},

			initialize: function() {
				var self = this;

				self._initializeModel();
				self._initializeListeners();

				self._createRoot();

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
		            /*
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
		            */
		        });

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
				$("#chart-demo").append("<div class='window' id='node_id_" + repository.id + "'>Repository</div>");

				var node = $("#node_id_" + repository.id);

				node.css("left", 20 + Object.keys(this.model.nodeDict).length + "em");
				node.css("top", "15em");

				var repositoryView = new RepositoryView({model: repository});	
				this.model.children.push(repositoryView);

				/*
				this.$("#repository-list").append(repositoryView.render().el);
				*/
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
});