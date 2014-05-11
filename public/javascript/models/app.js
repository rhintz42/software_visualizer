var AppModel = Backbone.Model.extend({
    initialize: function() {
		this.children = [];
		this.nodeDict = {};
		this.numNodesWithoutID = 0;
		this.width = 760;
		this.height = 200;
    },

    addToNodeDict: function(node) {
    	this.nodeDict[node.model.id] = node;
    },

    toDict: function() {
    	if(this.id === undefined) {
    		this.id = ++this.numNodesWithoutID;
    	}

		var appDict = {id: this.id, name: 'app', children: []};

		_.each(this.children, function(val) {
			if(!val.model.hidden) {
				appDict['children'].push(val.toDict());
			}
		});

		return appDict;
    }
});