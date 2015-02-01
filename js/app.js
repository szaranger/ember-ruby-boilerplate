App = Ember.Application.create();

App.Router.map(function() {
  this.resource('vehicle', { path: '/vehicles/:vehicle_id' });
  this.resource('make', { path: '/makes/:make_id' });
  this.resource('product', { path: '/products/:make_id' });
  this.resource('vehicles', function() {
  	//this.route('index', { path: '/vehicles/:vehicle_id' });
  	this.route('new');
  });
});

App.IndexRoute = Ember.Route.extend({
	model: function() {
	  	return Ember.RSVP.hash({
	  		vehicles: this.store.findAll('vehicle'),
	  		makes: this.store.findAll('make'),
	  		products: this.store.findAll('product')
	  	});
  	},
	setupController: function(controller, model) {
		controller.set('vehicles', model.vehicles);
		controller.set('makes', model.makes);
		controller.set('products', model.products);
	}
});

App.VehicleRoute = Ember.Route.extend({
	model: function(params) {
		return this.store.find('vehicle', params.vehicle_id);
	}
});

App.VehiclesNewRoute = Ember.Route.extend({
	model: function() {
		return Ember.RSVP.hash({
	      vehicles: this.store.createRecord('vehicle'),
	      products: this.store.findAll('product'),
	      makes: this.store.findAll('make')
	    });
	},
	setupController: function(controller, model) {
	    controller.set('model', model.vehicle);
	    controller.set('products', model.products);
	    controller.set('makes', model.makes);
	},
	actions: {
		willTransition:  function(transition) {
			if(this.currentModel.vehicle.get('isNew')) {
				this.currentModel.book.destroyRecord();
			}
		}
	}
});

App.IndexController = Ember.Controller.extend({});

App.VehiclesController = Ember.ArrayController.extend({
	sortProperties: ['year']
});

App.VehiclesNewController = Ember.ArrayController.extend({
	actions: {
		createVehicle: function() {
			var controller = this;
			this.get('model').save().then(function() {
				controller.transitionToRoute('index');	
			});
		}
	}
});

App.VehiclesNewView = Ember.View.extend({
	controller: 'VehiclesNewController'
});

App.MakesController = Ember.ArrayController.extend({
	sortProperties: ['name']
});

App.ProductsController = Ember.ArrayController.extend({
	sortProperties: ['name']
});

App.ApplicationAdapter = DS.FixtureAdapter.extend({

});

App.Vehicle = DS.Model.extend({
	make: DS.belongsTo('make'),
	model_name: DS.attr(),
	year: DS.attr('number'),
	product: DS.belongsTo('product'),
	m2_id: DS.attr(),
	image: function() {
		return 'http://nebula.wsimg.com/' + this.get('m2_id') + '?AccessKeyId=88E20644AF630F50E71C';
	}.property('m2_id')
});

App.Vehicle.FIXTURES = [
	{
		id: 1,
		make: 1,
		model_name: 'Crestliner',
		year: 1951,
		product: 1,
		m2_id: 'f17ed98fb27ae3cfb27c2ec273e6fe71'
	},
	{
		id: 2,
		make: 2,
		model_name: '98',
		year: 1953,
		product: 1,
		m2_id: '7a2942ec0e3763766223e5f16313df4e'
	}
];

App.Make = DS.Model.extend({
	name: DS.attr(),
	vehicles: DS.hasMany('vehicle')
});

App.Make.FIXTURES = [
	{
		id: 1,
		name: 'Ford',
		vehicles: [1]
	},
	{
		id: 2,
		name: 'Oldsmobile',
		vehicles: [2]
	}
];

App.Product = DS.Model.extend({
	name: DS.attr(),
	vehicles: DS.hasMany('vehicle', {async: true})
});

App.Product.FIXTURES = [
	{
		id: 1,
		name: 'Auto-thentics',
		vehicles: [1, 2]
	},
	{
		id: 2,
		name: 'Drivers',
		vehicles: []
	},
];
