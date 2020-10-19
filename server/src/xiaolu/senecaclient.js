class SenecaClient{
	constructor(host, port, type) {
		const seneca = require('seneca')();
		const bluebird = require('bluebird');	
		this.act = bluebird.promisify(seneca.act, { context: seneca });	
		seneca.client({
			host:host,
			port:port,
			type:type
		});
	}    
	
	async get(claseNAme, url, data){
		if(!url){url='lixindongniubi';}
		let {query, body} = data;
		return await this.act({
			module:claseNAme,
			[claseNAme]:url,
			args:{
				query,
				body
			}
		});
	}
}

let a = new SenecaClient('127.0.0.1', 10002, 'tcp');
export  {a};