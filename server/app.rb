require 'sinatra'
require 'sinatra/json'
require 'sinatra/activerecord'

VEHICLES = [
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
]

MAKES = [
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
]

PRODUCTS = [
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
]

before do
    response.headers['Access-Control-Allow-Origin'] = '*'
end

get '/' do
    '<h4>Welcome to M4Machine API</h4>'
end

get '/vehicles' do
    json vehicles: VEHICLES
end

get '/makes' do
    json makes: MAKES
end

get '/products' do
    json products: PRODUCTS
end

get '/vehicles/:id' do
    json vehicles: VEHICLES.find { | friend | friend[:id].to_i }
end
