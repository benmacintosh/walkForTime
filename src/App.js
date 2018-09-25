import React, {Component, PureComponent} from 'react';
import './App.css';
import img from './img1.JPG'


class AddressForm extends Component {

    constructor(props) {
        super(props);
        console.log("addressform props")
        console.log(props)
        this.state = {value: "enter an origin then click method", method: "", methods: ["TRANSIT","WALKING","DRIVING"], id: this.props.id, latlng: ["",""]};

        this.handleChange = this.handleChange.bind(this);
        this.onClickAuto1 = this.onClickAuto1.bind(this);
        this.onClickAuto2 = this.onClickAuto2.bind(this);
        this.onClickAuto3 = this.onClickAuto3.bind(this);
        this.onClick= this.onClick.bind(this);
    }

    handleChange(event){
        this.setState({value: event.target.value});
        var autocompleteapi = new window.google.maps.places.Autocomplete(document.getElementById(this.state.id));
        var latlng = ["",""]
        var tempsetstate = this.setState.bind(this)

        //make so doesnt call after EVERY KEYSTROKE  BTU AFTER SOME TIME

        //CHECK NEARBY USER

        window.google.maps.event.addListener(autocompleteapi, 'place_changed', function () {
            var place = autocompleteapi.getPlace()
            var address = [
            (place.address_components[0] && place.address_components[0].short_name || ''),
            (place.address_components[1] && place.address_components[1].short_name || ''),
            (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');

            latlng = [place.geometry.location.lat(),place.geometry.location.lng()]
            tempsetstate({value: address, latlng: latlng})
        })
    }

    onClickAuto1(event){
        this.setState({methods:["TRANSIT","WALKING","DRIVING"]})
        this.setState({method:this.state.methods[0]})
        this.setState({methods:["TRANSIT<","WALKING","DRIVING"]})

    }
    onClickAuto2(event){
        this.setState({methods:["TRANSIT","WALKING","DRIVING"]})
        this.setState({method: this.state.methods[1]})
        this.setState({methods:["TRANSIT","WALKING<","DRIVING"]})


    }
    onClickAuto3(event){
        this.setState({methods:["TRANSIT","WALKING","DRIVING"]})
        this.setState({method: this.state.methods[2]})
        this.setState({methods:["TRANSIT","WALKING","DRIVING<"]})

    }
    componentDidUpdate(props){
        this.props.callFromKids(this.state);
    }
    onClick(event){
        this.setState({value: ""})
    }



    render(){
        return(
            <div>

            <input type = "text" id={this.state.id} value = {this.state.value} onChange = {this.handleChange} onClick={this.onClick} />

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
        console.log("algorithm state after comp update, and props passed")
        console.log(this.state)
        this.setState({latlngs: props.datafromapp.origins, methods: props.datafromapp.methods})

        // dense grid of points, into priorirty que



        if(this.props.datafromapp.runalg && !this.state.didrunalg){
            if(this.state.latlngs.length==0){
                alert("need atleast 2 origins")
            }
            this.setState({didrunalg: true})
            var latlngs = this.state.latlngs;
            var methods = this.state.methods;

            var lngs = [], lats = []; 
            for(var i =0; i<latlngs.length; i++ ){
                lats.push(latlngs[i][0])
                lngs.push(latlngs[i][1])
            }

            var left=Math.min.apply(null,lngs),right=Math.max.apply(null,lngs),top=Math.max.apply(null,lats),bot=Math.min.apply(null,lats); //min of lat, max of lng etc

            console.log("running alg, with window")
            console.log(left)
            console.log(right)
            console.log(top)
            console.log(bot)




            //put limit on max density can choose,, and tell logner etc
            var density = 3;





            var latdisc = Math.abs(top-bot)/density;
            var lngdisc = latdisc;
            console.log(lngdisc)
            var i, j;
            //start bottom left
            var initlat = bot, initlng = left;
            var thislat = initlat, thislng = initlng;
            var origins = [];
            for(var i =0; i<latlngs.length;i++){
                origins.push({lat: latlngs[i][0], lng: latlngs[i][1]})
            }


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





            //desitinations split
            var destinationssplits = [];
            while (destinations.length > 0){
                destinationssplits.push(destinations.splice(0,3))
            }


            var times = [];
            for (var i =0; i<origins.length+1;i++){
            //for each origin
            var thisorigintimes  = [];

            for(var j=0;j<destinationssplits.length;j++){


                (function (i,j) {  
                    //origin still here
                    setTimeout(function(){
                        console.log("j within timed")
                        console.log(j)

                        //AFTER GONE THROUGH ALL ORIGINS AND DESTINTIONSS, CODE SO HAPPENS IN TIME
                        if(i==origins.length){

                            var mininddex = 0;
                            var minseconds = times[0][0]+times[1][0];
                            var thistime = 0;
                            for(var j = 0; i<times[0].length; j++){
                            //through each destination,, and add time from each different locaiton to get there
                            for (var i = 0; i<times.length;i++){
                                if(typeof(times[i][j])!=="undefined"){//TEMP MANUAL DEAL WITH ASYNCROHICTY LEADING TO SOME UNDEFINED
                                    thistime = thistime+times[i][j];
                                }
                            }
                            if(thistime<minseconds){
                                console.log(mininddex)
                                minseconds=thistime;
                                mininddex=j;
                            }
                            console.log("destinations")
                            console.log(destinations)

                        }
                        console.log(mininddex)
                        console.log(destinations)
                        console.log(destinations[mininddex])
                        this.setState({finalpoint: destinations[mininddex]});

                        //THEN BREAK
                    }else{

                        var thisdestinations = destinationssplits[j];
                        console.log(j)
                        console.log(destinationssplits)
                        var thisorigins = [];
                        for(var jj =0; jj<thisdestinations.length;jj++){
                            thisorigins.push(origins[i]);//since needs equal arrays of input/destination pairs
                        }
                    // console.log("thisdestinations and origins")
                    // console.log(i)
                    // console.log(thisdestinations)
                    // console.log(thisorigins)
                    // console.log(methods)

                    //CATCH NO RESULTS ERROR



                    //INCORRECT DURATION VALUE

                    var distanceapi = new window.google.maps.DistanceMatrixService;
                    distanceapi.getDistanceMatrix({
                        origins: thisorigins,
                        destinations: thisdestinations,
                        travelMode: methods[i],//TRANSIT
                        unitSystem: window.google.maps.UnitSystem.METRIC
                    },function(response,status){
                        if(status!=='OK'){
                            alert('Error was: '+ status);
                            //IF OVER QUERY LIMIT THEN DEALY LONGER
                        }else{
                            console.log("response")
                            console.log(response.rows.length);
                            for(var k = 0; i<response.rows.length;k++){
                                //SOMETHING FROM ASYHNORHSNOUSITY BREAKING HERE

                                
                                if(k>=response.rows.length){
                                    break;
                                }
                                console.log(response.rows[k].elements[k].duration.value)
                                thisorigintimes.push(response.rows[k].elements[k].duration.value);
                            }
                        }
                    }
                    )
                }

                console.log("times after timed block?")
                console.log(thisorigintimes)

            },4000);
                })(i,j)
            }

        }



        //WHAT LEAST TIME CAN DO//destinationssplits.length*origins.length*1000);

    }
}







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
        runalg: false,
        submitted: ""
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit=this.handleSubmit.bind(this);
    this.callFromKids = this.handleSubmit.bind(this);
}

handleChange(event){
    console.log(this.state.forms);
    this.setState({numberAddress: this.state.forms.push(<AddressForm key={(this.state.forms.length).toString()} id={(this.state.forms.length).toString()} callFromKids = {this.callFromKids}/>)});

        //CHECK IDS NOT PASSING ERROR

        this.setState({origins: this.state.origins.push(""), methods: this.state.methods.push("")});
        this.forceUpdate();
    }

    handleSubmit(event){
        this.setState({runalg: true})
        this.setState({submitted: "submitted, wait like 11 secs"})
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

          <div>{this.state.submitted}</div>

          <div>new precedence</div>
          <div>new</div>
          <div>leaving right now</div>
          <a href="https://google.com" style={{color:'blue'}}>google</a>
          <div></div>

          <img src={img} alt="" width="88"/>

          <div></div>
          <div>
          eth0x9f4bA31a5384d2d8758818582c99D6635dB17Cf5, googleapi costs some gold coins
          </div>

        <a href="https://paypal.me/benmacintosh" style={{color:'blue'}}>https://paypal.me/benmacintosh</a>

        <a> wait like 11 seconds after submitting '_' while algortihm talks to google </a>
        <Algorithm datafromapp={this.state}/>


    {/*algortihm, renderonce    show map*/}

    </div>
    );
}
}