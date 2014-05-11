var Repository = Backbone.Model.extend({
    initialize: function() {
        this.set('id', this.get('_id'));
        this.children = [];

        this.folders = new FolderList;
        this.folders.repository_id = this.id;
        this.hidden = false;
    },

    addToNodeDict: function(node) {
        this.nodeDict[node.model.id] = node;
    },

    toDict: function() {
        var repDict = {
            id: this.id,
            name: this.name || 'Repository',
            children: []
        };

        _.each(this.children, function(f) {
            if(!f.model.hidden) {
                repDict['children'].push(f.toDict());
            }
        })

        return repDict;
    }
});
