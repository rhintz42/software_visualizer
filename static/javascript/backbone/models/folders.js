var Folder = Backbone.Model.extend({

	//url: '/folders',
	url: function() {
		var extra;

        e1 = encodeURIComponent(this.get('repository_id'));

		if(this.id) {
			extra = encodeURIComponent(this.id);
		} else {
			extra = '';
		}

		return '/repositories/' + e1 + '/folders/' + extra
    },

    toggle: function() {
      this.save({done: !this.get("done")});
    }/*,

    destroy: function(method, model) {
    	alert('destroy');
    },

    sync: function(method, model) {
    	alert(method + ": " + JSON.stringify(model));
    	model.set('id', 1);
    }*/
});
