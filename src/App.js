import React, {Component, PureComponent} from 'react';
import './App.css';
import img from './img1.JPG'


class AddressForm extends Component {

    constructor(props) {
        super(props);
        this.state = {value: "", method: "", methods: ["TRANSIT","WALKING","DRIVING"]};


        this.handleChange = this.handleChange.bind(this);
        this.onClickAuto1 = this.onClickAuto1.bind(this);
        this.onClickAuto2 = this.onClickAuto2.bind(this);
        this.onClickAuto3 = this.onClickAuto3.bind(this);
    }

    handleChange(event){
        this.setState({value: event.target.value});
        var autocompleteapi = new window.google.maps.places.Autocomplete(document.getElementById(this.props.id));
        console.log("from apiautocom")
        console.log(autocompleteapi)
    }

    onClickAuto1(event){
        this.setState({method:this.state.methods[0]})

    }
    onClickAuto2(event){
        this.setState({method: this.state.methods[1]})

    }
    onClickAuto3(event){
        this.setState({method: this.state.methods[2]})
    }
    componentDidUpdate(props){
        this.props.callFromKids(this.state);
    }



    render(){
        return(
            <div>

            <input type = "text" id={this.props.id} value = {this.state.value} onChange = {this.handleChange} />

            <a onClick={this.onClickAuto1} style={{color:'blue'}}> {this.state.methods[0]}, </a>
            <a onClick={this.onClickAuto2} style={{color:'blue'}}> {this.state.methods[1]}, </a>
            <a onClick={this.onClickAuto3} style={{color:'blue'}}> {this.state.methods[2]} </a>


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
            que: [[]],
            runalg: false,
            didrunalg: false,

        }

        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.setState = this.setState.bind(this);
    }

    componentDidUpdate(props){
        console.log(props)
        // dense grid of points, into priorirty que
        if(this.props.datafromapp.runalg && !this.state.didrunalg){
            this.setState({didrunalg: true})
            console.log("es")
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
        this.state = {forms: [<AddressForm callFromKids = {this.callFromKids} key ="1" id="1"/>,<AddressForm callFromKids = {this.callFromKids} key="2" id="2"/>],
            origins: [],
            methods: [],
            runalg: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
        this.callFromKids = this.handleSubmit.bind(this);
    }

    handleChange(event){
        console.log(this.state.forms);
        this.setState({numberAddress: this.state.forms.push(<AddressForm key={(this.state.forms.length+1).toString()} id={(this.state.forms.length+1).toString()} callFromKids = {this.callFromKids}/>)});
        this.forceUpdate();
    }

    handleSubmit(event){
        this.setState({runalg: true})
    }

    callFromKids = (data) =>{
        console.log("data sfrom parentpersecitve")
        console.log(data)
        this.setState(data);
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

        <Algorithm datafromapp={this.state}/>


    {/*algortihm, renderonce */}

      </div>
    );
  }
}