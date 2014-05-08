$(function() {

	var AppView = Backbone.View.extend({
		el: $("#repositoryapp"),

		statsTemplate: _.template($('#stats-template').html()),

		events: {
			"keypress #new-repository": "createOnEnter",
			"click #clear-completed": "clearCompleted",
			"click #toggle-all": "toggleAllComplete"
		},

		initialize: function() {
			this.input = this.$("#new-repository");
			//this.allCheckbox = this.$("#toggle-all")[0];

			this.listenTo(Repositories, 'add', this.addOne);
			this.listenTo(Repositories, 'reset', this.addAll);
			this.listenTo(Repositories, 'all', this.render);

			this.footer = this.$('footer');
			this.main = $('#main');

			Repositories.fetch();
		},

		render: function() {
			var done = Repositories.done().length;
		    var remaining = Repositories.remaining().length;

		    if (Repositories.length) {
		        this.main.show();
		        this.footer.show();
		        this.footer.html(this.statsTemplate({done: done, remaining: remaining}));
		    } else {
		        this.main.hide();
		        this.footer.hide();
		    }

		},

		addOne: function(repository) {
			var view = new RepositoryView({model: repository});	
			this.$("#repository-list").append(view.render().el);
		},

		addAll: function() {
			Repositories.each(this.addOne, this);
		},

		createOnEnter: function(e) {
	      	if (e.keyCode != 13) return;
	      	if (!this.input.val()) return;

	      	Repositories.create({title: this.input.val()});
	      	this.input.val('');
	    },

	    clearCompleted: function() {
	  		_.invoke(Repositories.done(), 'destroy');
	  		return false;
		},

		toggleAllComplete: function () {
	  		var done = this.allCheckbox.checked;
	  		Repositories.each(function (repository) { repository.save({'done': done}); });
		}
	});

	var App = new AppView;
});