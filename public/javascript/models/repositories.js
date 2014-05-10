var Repository = Backbone.Model.extend({

	url: function() {
		var extra;

		if(this.id) {
			extra = encodeURIComponent(this.id);
		} else {
			extra = '';
		}

		return '/repositories/' + extra
    },

    toggle: function() {
      this.save({done: !this.get("done")});
    }/*,

    sync: function(method, model) {
    	alert(method + ": " + JSON.stringify(model));
    	model.set('id', 1);
    }
    */
});
