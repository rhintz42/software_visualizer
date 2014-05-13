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
		this._initializeListeners();

		// Call this using async:false to make sure all folders are loaded
		//	before doing anything else
		this.model.folders.fetch({async:false});
	},

	render: function() {
		this.$el.html(this.template(this.model.attributes));
	    return this;
	},

	edit: function() {
		this.model.set('name', "hello");
		this.model.save();
	},

	// When start being able to delete stuff again, try to put this into
	//	the model
	destroy: function() {
		self = this;
		// See if can put this destroy at the end of this function instead
		//	of here
		self.model.destroy();

		_.each(self.model.children, function(folder) {
			folder.destroy();
		})
		self.model.children = [];
	},

	// When start being able to delete stuff again, try to put this into
	//	the model
	// Be able to put proper data in here
	createOnEnter: function() {
		self = this;

		this.model.folders.create({
			name: "pppppp",
			owner_email: "lksjdfklsd@slkdjfklsd.com",
			repository_id: self.model.id,
			type_node: "folder",
			url: "https://github.com/rhintz42/software_visualizer"
		})
	},

	// When start being able to delete stuff again, try to put this into
	//	the model (Possibly, might make more sense todo the last line in here)
	addFolder: function(folder) {
		var folderView = new FolderView({
			model: folder,
			parent: this
		});	
		this.model.children.push(folderView);
		this.$(".folder-list").append(folderView.render().el);

		this.model.addToNodeDict(folderView);
	},

	toDict: function() {
		return this.model.toDict();
	},

	_initializeListeners: function() {
		this.listenTo(this.model.folders, 'add', this.addFolder);
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.remove);
	}
});
