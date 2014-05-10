var RepositoryView = Backbone.View.extend({
	tagName: "li",

	template: _.template($('#item-template').html()),

	model: Repository,

	events: {
		"click .edit"		: "edit",
		"click .destroy"	: "destroy",
		"click .add-folder" : "createOnEnter"
	},

	initialize: function() {	
		this.model.set('id', this.model.get('_id'));

		this.folders = new FolderList;
		this.folders.repository_id = this.model.get('_id');

		this.listenTo(this.folders, 'add', this.addFolder);

		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.remove);
		this.folderList = [];
	},

	render: function() {
		this.$el.html(this.template(this.model.attributes));
		this.folders.fetch();
	    return this;
	},

	edit: function() {
		this.model.set('email', "hello");
		this.model.save();
	},

	destroy: function() {
		self = this;
		self.model.destroy();

		_.each(self.folderList, function(folder) {
			folder.destroy();
		})
		self.folderList = [];
	},

	createOnEnter: function() {
		self = this;

		this.folders.create({
			name: { first: "pppppp", last: 'qqqqq'},
			email: "lksjdfklsd@slkdjfklsd.com",
			repository_id: self.model.get('_id'),
			url: "www.lkasjdf.com"
		})
	},

	addFolder: function(folder) {
		var view = new FolderView({
			model: folder,
			parent: this
		});	
		this.folderList.push(view);
		this.$(".folder-list").append(view.render().el);
	}
});