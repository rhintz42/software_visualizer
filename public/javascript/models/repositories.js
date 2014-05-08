var Repository = Backbone.Model.extend({

	url: '/repositories/:id',

    toggle: function() {
      this.save({done: !this.get("done")});
    }
});
