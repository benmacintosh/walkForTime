import React, {Component, PureComponent} from 'react';
import './App.css';
import img from './img1.JPG'


class AddressForm extends Component {

    constructor(props) {
        super(props);
        this.state = {value: "", suggestions: [""], method: ""};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit= this.handleSubmit.bind(this);
    }

    handleChange(event){
        this.setState({value: event.target.value});
        var input = this.state.value
        console.log(window)
        // var ins = document.createElement('HTMLInputElement')
        // console.log(ins)
        //-33.896919, 151.171899")
        // console.log(window.google.maps.DistanceMatrixService(<htmlinputelement>"dd"</htmlinputelement>))
        // console.log(window.google.maps.LatLng(<htmlinputelement>6,10</htmlinputelement>))
        // onsole.log(window.google.maps.places)
        // var auto = window.google.maps.places.Autocomplete(input);
        // console.log(auto)

        //clikcabel suggestions<a onClick={this.handleClick} style={{cursor: 'pointer'}}>click me!</a>
    }

    handleSubmit(event){
        console.log(event)
    }


    render(){
        return(
            <div>

            <form onSubmit={this.handleSubmit}>
                <input type = "text" value = {this.state.value} onChange = {this.handleChange} />
            </form>
            </div>
        );
    }
}



class Algorithm extends PureComponent {

    constructor(props){
        super(props);
        this.state = {
            latlngs: [[-33.896919, 151.171899][-33.896425, 151.183834]],
            methods: ["public transport","walk"],
            finalpoint: {},
            que: [[]]
        }

        this.componentDidMount = this.componentDidMount.bind(this);
        this.setState = this.setState.bind(this);
    }

    componentDidMount(props){
        // dense grid of points, into priorirty que
        var left,right,top,bot;
        var density = 3;
        var latdisc = (-33.896919+33.896425)/density;
        var lngdisc = (151.183834-151.171899)/density;
        console.log(lngdisc)
        var i, j;
        var initlat = -33.896919, initlng = 151.171899;
        var thislat = initlat, thislng = initlng;
        var a = {lat: initlat, lng:initlng};
        var b = {lat:-33.896425, lng:151.171899}

        var que = [];
        var as = [];
        var bs = [];
        var timesa = [];
        var timesb = [];

        var destinations = [];
        for(i=0; i<density;i++){
            thislat = thislat+latdisc;
            for(j=0;j<density;j++){
                thislng = thislng+lngdisc;
                que.push([thislat,thislng]);

                destinations.push({lat: thislat, lng: thislng});
            }
            thislng = initlng;
        }
        console.log("que")
        console.log(que)

        for(var i =0; i<destinations.length;i++){
            as.push(a);
        }
        for(var i =0; i<destinations.length;i++){
            bs.push(b);
        }


        //join into 1 call

        var distanceapi = new window.google.maps.DistanceMatrixService;
        distanceapi.getDistanceMatrix({
            origins: as,
            destinations: destinations,
            travelMode: 'WALKING',//TRANSIT
            unitSystem: window.google.maps.UnitSystem.METRIC
        },function(response,status){
            if(status!=='OK'){
                alert('Error was: '+ status);
            }else{
                console.log("response")
                console.log(response);
                for(var i = 0; i<response.rows.length;i++){
                    timesa.push(response.rows[i].elements[i].duration.value);
                }
                console.log(timesa)

                // ignore if undefined
            }
        }
        );

        var that = this;
        setTimeout(function(){
        var distanceapi = new window.google.maps.DistanceMatrixService;
        distanceapi.getDistanceMatrix({
            origins: bs,
            destinations: destinations,
            travelMode: 'WALKING',
            unitSystem: window.google.maps.UnitSystem.METRIC
        },function(response,status){
            if(status!=='OK'){
                alert('Error was: '+ status);
            }else{
                console.log("response")
                console.log(response);
                for(var i = 0; i<response.rows.length;i++){
                    timesb.push(response.rows[i].elements[i].duration.value);
                }
                console.log(timesb)

                // ignore if undefined
            }
        }
        )



        setTimeout(function(){
        var mininddex = 0;
        var minseconds = timesa[6]+timesb[6];
        var thistime = 0;
        for(var i = 0; i<timesa.length; i++){
            thistime = timesa[i]+timesb[i];
            if(thistime<minseconds){
                console.log(mininddex)
                minseconds=thistime;
                mininddex=i;
            }

        }
        console.log(mininddex)
        console.log(destinations[mininddex])
        that.setState({finalpoint: destinations[mininddex]});

        },4000)

    },11000);


    }






        //TEMP JUST BRUTE SERACH








        // sort by distance


    // iteratte through prioriety que search



    // but also try and make these travel times closer to eachoterh




// return finalpoitn, dont need render function

    render()
    {
        return(
            <div>
            <div>newprfinlpt</div>
            <div>
            {this.state.finalpoint.lat}
            </div>
            <div>
            {this.state.finalpoint.lng}
            </div>
            </div>
            );
    }

}




export default class App extends Component {
    constructor(props){
        super(props);
        this.state = {forms: [<AddressForm key ="1"/>,<AddressForm key="2"/>],
            origins: []
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
    }

    handleChange(event){
        console.log(this.state.forms);
        this.setState({numberAddress: this.state.forms.push(<AddressForm key={(this.state.forms.length+1).toString()}/>)});
        this.forceUpdate();
    }

    handleSubmit(event){

    }


  render() {
    return (
      <div>

        <div>
        {this.state.forms}
        </div>

        <button onClick={this.handleChange}>+</button>

        <button onClick={this.handleSubmit}>_</button>

        <div>new precedence</div>
        <div>new</div>
        <a href="https://google.com" style={{color:'blue'}}>google</a>
        <div></div>

        <img src={img} alt="" width="88"/>

        <div></div>
        <a href="https://paypal.me/benmacintosh" style={{color:'blue'}}>https://paypal.me/benmacintosh</a>

        <Algorithm />


    {/*algortihm, renderonce */}

      </div>
    );
  }
}