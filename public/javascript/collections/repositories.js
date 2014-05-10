var RepositoryList = Backbone.Collection.extend({
	model: Repository,
	
	url: function() {
		var extra;

		if(this.id) {
			extra = encodeURIComponent(this.id);
		} else {
			extra = '';
		}

		return '/repositories/' + extra;
    }
});

var Repositories = new RepositoryList;

