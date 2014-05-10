var FolderList = Backbone.Collection.extend({
	model: Folder,
	
	url: function() {
		var extra;

        e1 = encodeURIComponent(this.repository_id);

		if(this.id) {
			extra = encodeURIComponent(this.id);
		} else {
			extra = '';
		}

		return '/repositories/' + e1 + '/folders/' + extra
    }
});

var Folders = new FolderList;
