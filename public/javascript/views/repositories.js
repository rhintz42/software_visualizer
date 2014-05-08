var RepositoryView = Backbone.View.extend({
	tagName: "li",

	template: _.template($('#item-template').html()),

	//el: this.$el,

	events: {
		//"click .thing"		: "edit"
		"click p"			: "edit"
		//"click .toggle" 	: "toggleDone",
		//"dblclick .view"	: "edit",
		//"click a.destroy"	: "clear",
		//"keypress .edit"	: "updateOnEnter",
		//"blur .edit"		: "close"
	},

	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.remove);
		//this.delegateEvents();
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		this.$el.toggleClass('done', this.model.get('done'));
		//this.$el.toggleClass('cool', this.model.get('cool'));
		this.input = this.$('.edit');
		return this;
	},

	toggleDone: function() {
		this.model.toggle();
	},

	edit: function() {
		//alert("Cool");
		//this.$el.addClass("editing");
		this.$el.toggleClass("editing", this.model.get('editing'));
		this.input.focus();
	},

	close: function() {
		var value = this.input.val();
		if (!value) {
			this.clear();
		} else {
			this.model.save({title: value});
			this.$el.removeClass("editing");
		}
	},

	updateOnEnter: function(e) {
		if (e.keyCode == 13) this.close();
	},

	clear: function() {
		this.model.destroy();
	}
});