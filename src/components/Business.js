import React from 'react';
import './main.css';

class Business extends React.Component {
	constructor (props) {
		super(props);
		this.state = { 
			name:'',
			email:'',
			profile_pic:'',
			locations:[],
			staffs:[],
			filteredstaffs:[],
			services:'',
			ancestors:[],

		};
		this.fetchBusiness = this.fetchBusiness.bind(this);
		this.handleLocationClick = this.handleLocationClick.bind(this);
	}

	//Intial Call
	componentDidMount(){
		this.fetchBusiness();
	}

	// fetch business data 
	fetchBusiness(){
		fetch('https://testvm2.frontdesk.ai/business?query=504318@137')
	    .then(response => response.json())
	    .then(parsedJSON => {
	    	this.setState({
	    		name:parsedJSON.name,
	    		email:parsedJSON.contacts[0].value,
	    		locations:parsedJSON.locations,
	    		profile_pic:parsedJSON.profile_pic,
	    		staffs:parsedJSON.staffs,
	    		services:parsedJSON.services,
	    		filteredstaffs:parsedJSON.staffs
	    	},() =>{
	    		var serviceslist = this.state.services;
	    		var ancestorlist = [];

	    		// geting all unique ancestor_id
	    		for (var i = 0; i<serviceslist.length;i++) {
	    			if(serviceslist[i].ancestor_id){
		    			if(!ancestorlist.includes(serviceslist[i].ancestor_id)){
		    				ancestorlist.push(serviceslist[i].ancestor_id)
		    			}

		    		}
	    		}
	    		
	    		//filtering all service base in the ancestor
	    		var list = ancestorlist.map(a=>serviceslist.filter(s=>s.ancestor_id==a));
	    		this.setState({
	    			ancestors:list
	    		})
	    		
	    	})
	    	
	    })
		.catch(error => {
			console.log('parsing failed',error)
		})
	}


	//flter staffby location
	handleLocationClick(locationid){
		var stafflist=[];
		var allstaff = this.state.staffs;
		for(var i=0;i<allstaff.length;i++){
			if(allstaff[i].locations.includes(locationid)){
				stafflist.push(allstaff[i])
			}
		}

		this.setState({
			filteredstaffs:stafflist
		})
	}

	
	render() {

		const locations=this.state.locations.map((location, index) => {
		  return (
		  	<li key={location.id} onClick={() => this.handleLocationClick(location.id)}>
		  		<div>Name: {location.name}</div>
		  		<div>Addres: {location.address}</div>
		  	</li>
		  );
		});

		const staffs=this.state.filteredstaffs.map((staff, index) => {
		  return (
		  	<li key={staff.id}>
		  		<div>Name: {staff.first_name}</div>
		  	</li>
		  );
		});

		const ancestors=this.state.ancestors.map((ancestor, index) => {
		  return (
		  	<li key={index}>
		  		<div>{index}</div>
		  		<div>
			  		{ancestor.map((service) => {
		              return (
		                <p key={service.id}>{service.name}</p>
		              );
		            })}
	            </div>
		  	</li>
		  );
		});

		return (
			<div id="businesscntr">
				<div className="info_box">
					<div className="info_tab">
						<span className="head">Name :</span><span>{this.state.name}</span>
					</div>
					<div className="info_tab">
						<span className="head">Email :</span><span>{this.state.email}</span>
					</div>
					<div className="info_tab">
						<span className="head">Profile :</span>
						<img src={this.state.profile_pic} alt="image"/>
					</div>
				</div>

				<div className="dd_container">
					<div className="dd_box">
						<h2>Locations</h2>
						<ul>
							{locations}
						</ul>
					</div>

					<div className="dd_box">
						<h2>Staffs</h2>
						<ul>
							{staffs}
						</ul>
					</div>
				</div>

				<div className="ll_container">
					<h2>Ancestors</h2>
					<ul>
						{ancestors}
					</ul>
				</div>
				
			</div>
		);
	}

}
export default Business