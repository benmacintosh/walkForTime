import React, {Component, PureComponent} from 'react';
import './App.css';
import img from './img1.JPG'


class AddressForm extends Component {

    constructor(props) {
        super(props);
        console.log("addressform props")
        console.log(props)
        this.state = {value: "", method: "", methods: ["TRANSIT","WALKING","DRIVING"], id: this.props.id, latlng: ["",""]};

        this.handleChange = this.handleChange.bind(this);
        this.onClickAuto1 = this.onClickAuto1.bind(this);
        this.onClickAuto2 = this.onClickAuto2.bind(this);
        this.onClickAuto3 = this.onClickAuto3.bind(this);
    }

    handleChange(event){
        this.setState({value: event.target.value});
        var autocompleteapi = new window.google.maps.places.Autocomplete(document.getElementById(this.state.id));
        var latlng = ["",""]
        var tempsetstate = this.setState.bind(this)
        window.google.maps.event.addListener(autocompleteapi, 'place_changed', function () {
            console.log("loc")
            var place = autocompleteapi.getPlace()
            var address = [
              (place.address_components[0] && place.address_components[0].short_name || ''),
              (place.address_components[1] && place.address_components[1].short_name || ''),
              (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');

            //WORKING UP TO HERE
            latlng = [place.geometry.location.lat(),place.geometry.location.lng()]
            tempsetstate({value: address, latlng: latlng})
        })
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

            <input type = "text" id={this.state.id} value = {this.state.value} onChange = {this.handleChange} />

            <a onClick={this.onClickAuto1} style={{color:'blue', cursor: 'pointer', textDecorationLine: 'underline'}}>{this.state.methods[0]}</a>
            <a>, </a>
            <a onClick={this.onClickAuto2} style={{color:'blue', cursor: 'pointer', textDecorationLine: 'underline'}}>{this.state.methods[1]}</a>
            <a>, </a>
            <a onClick={this.onClickAuto3} style={{color:'blue', cursor: 'pointer', textDecorationLine: 'underline'}}>{this.state.methods[2]}</a>


            </div>
        );
    }
}



class Algorithm extends PureComponent {

    constructor(props){
        super(props);
        this.state = {
            // latlngs: [[-33.896919, 151.171899][-33.896425, 151.183834]],
            // methods: ["public transport","walk"],
            latlngs: [],
            methods: [],
            finalpoint: {},
            que: [[]],
            didrunalg: false,

        }

        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.setState = this.setState.bind(this);
    }

    componentDidUpdate(props){
        console.log("alg state after comp update, and props passed")
        console.log(this.state)
        this.setState({latlngs: props.datafromapp.origins, methods: props.datafromapp.methods})

        //CHECK ATLEAST 2 ORIGINS AND METHODS, else alert

        // dense grid of points, into priorirty que
        if(this.props.datafromapp.runalg && !this.state.didrunalg){
            this.setState({didrunalg: true})
            var latlngs = this.state.latlngs;
            var methods = this.state.methods;
            console.log("es")

            var lngs = [], lats = []; 
            for(var i =0; i<latlngs.length; i++ ){
                lats.push(latlngs[i][0])
                lngs.push(latlngs[i][1])
            }
            console.log(lngs)

            var left=Math.min.apply(null,lngs),right=Math.max.apply(null,lngs),top=Math.max.apply(null,lats),bot=Math.min.apply(null,lats); //min of lat, max of lng etc

            console.log(left)
            console.log(right)
            console.log(top)
            console.log(bot)

            var density = 3;
            //var latdisc = (-33.896919+33.896425)/density;
            var latdisc = Math.abs(top-bot)/density;
            var lngdisc = latdisc;
           // var lngdisc = (151.183834-151.171899)/density;
            console.log(lngdisc)
            var i, j;
            //var initlat = -33.896919, initlng = 151.171899;
            //start bottom left
            var initlat = bot, initlng = left;
            var thislat = initlat, thislng = initlng;
            var a = {lat: latlngs[0][0], lng:latlngs[0][1]};
            var b = {lat: latlngs[1][0], lng: latlngs[1][1]}
            //var b = {lat:-33.896425, lng:151.171899}

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
                travelMode: methods[0],//TRANSIT
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
                travelMode: methods[1],
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
            {this.state.finalpoint.lat},
            </div>
            <div>
            {this.state.finalpoint.lng}
            </div>
            refresh for new search
            </div>
            );
    }

}




export default class App extends Component {
    constructor(props){
        super(props);
        this.state = {forms: [<AddressForm callFromKids = {this.callFromKids} key ="0" id="0"/>,<AddressForm callFromKids = {this.callFromKids} key="1" id="1"/>],
            origins: ["",""],
            methods: ["",""],
            runalg: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
        this.callFromKids = this.handleSubmit.bind(this);
    }

    handleChange(event){
        console.log(this.state.forms);
        this.setState({numberAddress: this.state.forms.push(<AddressForm key={(this.state.forms.length).toString()} id={(this.state.forms.length).toString()} callFromKids = {this.callFromKids}/>)});
        this.setState({origins: this.state.origins.push(""), methods: this.state.methods.push("")});
        this.forceUpdate();
    }

    handleSubmit(event){
        this.setState({runalg: true})
    }

    callFromKids = (data) =>{
        console.log("data sfrom parentpersecitve, just from recent change")
        console.log(data)
        var neworigins = this.state.origins;
        neworigins[data.id]=data.latlng;
        var newmethods = this.state.methods;
        newmethods[data.id]=data.method;
        this.setState({origins: neworigins, methods: newmethods })
        console.log("app state")
        console.log(this.state)
        // only update from unqieu kids
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

        <a> wait like 11 seconds after submitting '_' while algortihm talks to google </a>
        <Algorithm datafromapp={this.state}/>


    {/*algortihm, renderonce */}

      </div>
    );
  }
}