import React, {Component, PureComponent} from 'react';
import './App.css';
import img from './img1.jpg'
import img2 from './img2.png'



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
            finalpoint: [],
            que: [[]]
        }

        this.componentDidMount = this.componentDidMount.bind(this)
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
        var thislat = -33.896919, thislng = 151.171899;
        var a = {lat: initlat, lng:initlng};
        var b = {lat:-33.896425, lng:151.171899}

        var que = [];
        var as = [];
        var bs = [];
        var timesa = [];
        var timesb = [];

        var destinations = [];
        for(i=0; i<density;i++){
            for(j=0;j<density;j++){
                que.push([thislat,thislng]);

                destinations.push({lat: thislat, lng: thislng});

                thislng = thislng+lngdisc;
            }
            thislat = thislat+latdisc;
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
            travelMode: 'DRIVING',
            unitSystem: window.google.maps.UnitSystem.METRIC
        },function(response,status){
            if(status!=='OK'){
                alert('Error was: '+ status);
            }else{
                console.log("response")
                console.log(response);
                console.log(response.rows[0].elements[0].duration.value)
                for(var i = 0; i<response.rows.length;i++){
                    
                }

                // ignore if undefined
            }
        }
        )


        //TEMP JUST BRUTE SERACH








        // sort by distance


    }

    // iteratte through prioriety que search




// return finalpoitn, dont need render function

    render()
    {
        return(
            <div>
            {this.state.finalpoint}
            </div>
            );
    }

}




{/*
    given intial latlngs, and methods

    oninit, create grid,

    start search, callibg distance api


    just render return final location 
*/}



export default class App extends PureComponent {
    constructor(props){
        super(props);
        this.state = {numberAddress: 0}

        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event){
        this.setState({numberAddress: 3})
    }


  render() {
    return (
      <div>


        <AddressForm />
        <AddressForm />
        <AddressForm />

        <button onClick={this.handleChange}>+</button>

        <div>new precedence</div>
        <div>new</div>
        <a href="https://google.com" style={{color:'blue'}}>google</a>
        <div></div>
        <a href="https://www.youtube.com/watch?v=MxwvtaswDYY" style={{color:'blue'}}>https://www.youtube.com/watch?v=MxwvtaswDYY</a> <div></div>
        <a href="https://drive.google.com/open?id=1TkU_3pCP1_GgNQi1a_JKRGwaxE-HG3uZ" style={{color:'blue'}}>https://drive.google.com/open?id=1TkU_3pCP1_GgNQi1a_JKRGwaxE-HG3uZ </a>
        <p/>

        {/*<div>tools</div>

        // <div>writing</div
        */}

        <div>cv</div>        
        <a href="https://drive.google.com/open?id=1JobQ1qgPOFjpesU8tSAxJcxyaRh-dm8r" syle={{color:'blue'}}>https://drive.google.com/open?id=1JobQ1qgPOFjpesU8tSAxJcxyaRh-dm8r </a>
        <p/>

        <a href="https://www.instagram.com/0008000000macintosh/" style={{color:'blue'}}>https://www.instagram.com/0008000000macintosh/</a>
        <div></div>
        <img src={img2} alt="" width="88"/>
        <img src={img} alt="" width="88"/>

        <Algorithm />


    {/*algortihm, renderonce */}

      </div>
    );
  }
}