var FolderView = Backbone.View.extend({
	tagName: "li",

	template: _.template($('#item-template2').html()),

	model: Folder,

	events: {
		"click .edit"		: "edit",
		"click .destroy"	: "destroy"
	},

	initialize: function(attributes) {
		this.parent = attributes.parent;
		
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.remove);
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		this.$el.toggleClass('done', this.model.get('done'));

		this.$el.find('.name').append('<p>' + this.model.get('name') + '</p>');
		this.$el.find('.id').append('<p>' + this.model.get('_id') + '</p>');
		this.$el.find('.email').append('<p>' + this.model.get('email') + '</p>');
		this.$el.find('.repository').append('<p>' + this.model.get('repository_id') + '</p>');
		this.model.set('id', this.model.get('_id'));
		this.model.set('hidden', false);
		return this;
	},

	edit: function() {
		this.model.set('email', "hello");
		this.model.save();
	},

	destroy: function() {
		self = this;
		self.model.destroy();
	},

	toDict: function() {
		return {id: this.model.get('_id'), name: 'Folder'};
	}
});