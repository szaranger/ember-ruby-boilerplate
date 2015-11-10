App = Ember.Application.create({
	LOG_VIEW_LOOKUPS: true,
	LOG_ACTIVE_GENERATION: true
});

App.ApplicationAdapter = DS.RESTAdapter.extend({
	host: 'http://localhost:4567'
});

App.Router.map(function() {
	this.resource('vehicle', { path: '/vehicles/' }, function() {
  		this.route('index', { path: '/:vehicle_id' });
  		this.route('new', { path: '/new'});
  	});
  	this.resource('maker', { path: '/makers/:maker_id' });
  	this.resource('product', { path: '/products/:product_id' });
});

App.IndexRoute = Ember.Route.extend({
	model: function() {
	  	return Ember.RSVP.hash({
	  		vehicles: this.store.findAll('vehicle'), // GET /vehicles
	  		makers: this.store.findAll('maker'),
	  		products: this.store.findAll('product')
	  	});
  	},
	/*
	 * To tell one of Ember.ObjectController or Ember.ArrayController
	 * which model to present, set its model property in the
	 * route handler's setupController hook.
	 */
	setupController: function(controller, model) {
		controller.set('vehicles', model.vehicles);
		controller.set('makers', model.makers);
		controller.set('products', model.products);
	}
});

App.VehicleIndexRoute = Ember.Route.extend({
	model: function(params) {
		console.log('VehicleIndexRoute'+  params.vehicle_id);
		return this.store.find('vehicle', params.vehicle_id);
	}
});

App.VehicleNewRoute = Ember.Route.extend({
	model: function() {
		return Ember.RSVP.hash({
	      vehicle: this.store.createRecord('vehicle'),
	      products: this.store.findAll('product'),
	      makers: this.store.findAll('makers')
	    });
	},
	setupController: function(controller, model) {
	    controller.set('model', model.vehicle);
	    controller.set('products', model.products);
	    controller.set('makers', model.makers);
	},
	actions: {
		willTransition:  function(transition) {
			if(this.currentModel.vehicle.get('isNew')) {
				this.currentModel.vehicle.destroyRecord();
			}
		}
	}
});

App.MakersRoute = Ember.Route.extend({
	model: function() {
		return this.store.findAll('maker');
	}
});

App.IndexController = Ember.Controller.extend({});

App.VehiclesController = Ember.ArrayController.extend({
	sortProperties: ['year']
});

App.VehiclesNewController = Ember.Controller.extend({
	actions: {
		createVehicle: function() {
			var controller = this;
			this.get('model').save().then(function() {
				controller.transitionToRoute('index');	
			});
		}
	}
});

App.MakersController = Ember.ArrayController.extend({
	sortProperties: ['name']
});

App.ProductsController = Ember.ArrayController.extend({
	sortProperties: ['name']
});

App.Vehicle = DS.Model.extend({
	maker: DS.belongsTo('maker'),
	model_name: DS.attr(),
	product: DS.belongsTo('product'),
	m2_id: DS.attr(),
	image: function() {
		return 'http://nebula.wsimg.com/' + this.get('m2_id') + '?AccessKeyId=88E20644AF630F50E71C';
	}.property('m2_id')
});

App.Maker = DS.Model.extend({
	name: DS.attr(),
	vehicles: DS.hasMany('vehicle')
});

App.Product = DS.Model.extend({
	name: DS.attr(),
	vehicles: DS.hasMany('vehicle', {async: true})
});

