import React, {Component, PureComponent} from 'react';
import './App.css';
import img from './img1.JPG'


class AddressForm extends Component {

    constructor(props) {
        super(props);   
        this.state = {value: "__"+this.props.id, method: "WALKING", methods: ["TRANSIT","WALKING<","DRIVING","BICYCLING"], id: this.props.id, latlng: ["",""]};

        this.handleChange = this.handleChange.bind(this);
        this.onClickAuto1 = this.onClickAuto1.bind(this);
        this.onClickAuto2 = this.onClickAuto2.bind(this);
        this.onClickAuto3 = this.onClickAuto3.bind(this);
        this.onClickAuto4=this.onClickAuto4.bind(this);
        this.onClick= this.onClick.bind(this);
    }

    handleChange(event){
        this.setState({value: event.target.value});
        var autocompleteapi = new window.google.maps.places.Autocomplete(document.getElementById(this.state.id));
        var latlng = ["",""]
        var tempsetstate = this.setState.bind(this)

        //make so doesnt call after EVERY KEYSTROKE  BTU AFTER SOME TIME delay

        //CHECK NEARBY USER

        // also test leichard,t to therses frined

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
        this.setState({methods:["TRANSIT","WALKING","DRIVING","BICYCLING"]})
        this.setState({method:this.state.methods[0]})
        this.setState({methods:["TRANSIT<","WALKING","DRIVING", "BICYCLING"]})

    }
    onClickAuto2(event){
        this.setState({methods:["TRANSIT","WALKING","DRIVING","BICYCLING"]})
        this.setState({method: this.state.methods[1]})
        this.setState({methods:["TRANSIT","WALKING<","DRIVING","BICYCLING"]})

    }
    onClickAuto3(event){
        this.setState({methods:["TRANSIT","WALKING","DRIVING","BICYCLING"]})
        this.setState({method: this.state.methods[2]})
        this.setState({methods:["TRANSIT","WALKING","DRIVING<","BICYCLING"]})

    }
    onClickAuto4(event){
        this.setState({methods:["TRANSIT","WALKING","DRIVING","BICYCLING"]})
        this.setState({method: this.state.methods[3]})
        this.setState({methods:["TRANSIT","WALKING","DRIVING","BICYCLING<"]})    
    }
    componentDidUpdate(props){
        console.log("address form did update")
        console.log(this.state)
        console.log(this.props)
        this.props.callFromKids(this.state);
    }

    onClick(event){
        this.setState({value: ""})
    }

    render(){
        return(
            <div>

            <input type = "text" id={this.state.id} value = {this.state.value} style = {{width:222}} onChange = {this.handleChange} onClick={this.onClick} />

            <a onClick={this.onClickAuto1} style={{color:'blue', cursor: 'pointer', textDecorationLine: 'underline'}}>{this.state.methods[0]}</a>
            <a>, </a>
            <a onClick={this.onClickAuto2} style={{color:'blue', cursor: 'pointer', textDecorationLine: 'underline'}}>{this.state.methods[1]}</a>
            <a>, </a>
            <a onClick={this.onClickAuto3} style={{color:'blue', cursor: 'pointer', textDecorationLine: 'underline'}}>{this.state.methods[2]}</a>
            <a>, </a>
            <a onClick={this.onClickAuto4} style={{color:'blue', cursor: 'pointer', textDecorationLine: 'underline'}}>{this.state.methods[3]}</a>

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
            finaladdress: "",
            timeblockcount: "",
            totaltimeblocks: ""

        }

        this.componentWillUpdate = this.componentWillUpdate.bind(this);
    }

    //FIXED BY CHAGNING FROM COMPOENTDIDTUPDATE
    componentWillUpdate(props){
        console.log("algorithm state after comp update, and props passed")
        console.log(this.state)
        console.log(props)
        this.setState({latlngs: props.datafromapp.origins, methods: props.datafromapp.methods})

        // dense grid of points, into priorirty que

        if(props.datafromapp.runalg && !this.state.didrunalg){
            if(this.state.latlngs.length==0){
                alert("need atleast 2 origins")
            }
            console.log("didrunalg?")
            console.log(this.state)
            this.setState({didrunalg: true})
            console.log(this.state)
            // this not working here

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
            //only work sthn hemispehre?




            //put limit on max density can choose,, and tell logner etc
            var density = 4;





            var latdisc = Math.abs(top-bot)/density;
            var lngdisc = Math.abs(right-left)/density;
            console.log(lngdisc)
            var i, j;
            //start bottom left
            var initlat = bot, initlng = left;
            var thislat = initlat, thislng = initlng;
            var origins = [];
            for(var i =0; i<latlngs.length;i++){
                origins.push({lat: latlngs[i][0], lng: latlngs[i][1]})
            }
            //var b = {lat:-33.896425, lng:151.171899}

            var que = [];

            var destinations = [];
            for(i=0; i<=density;i++){
                console.log("this lat then lng")
                console.log(thislat)
                for(j=0;j<=density;j++){
                    console.log(thislng)
                    que.push([thislat,thislng]);

                    destinations.push({lat: thislat, lng: thislng});
                    thislng = thislng+lngdisc;
                }
                thislng = initlng;
                thislat = thislat+latdisc;

            }



    // timesFromAsToB(As,B){


    //         var Ascopy = As.slice();
    //         var As_splits = [];
    //         while (Ascopy.length > 0){
    //             As_splits.push(Ascopy.splice(0,25))
    //         }

    //         var times = []
    //         var As_index = 0;
    //         function timeblock(){
    //             if(As_index==As_splits.length){
                    
    //             }
    //             setTimeout(function(){

    //             })

    //         }


    // }

            var destinationscopy = destinations.slice();
            //desitinations split
            var destinationssplits = [];
            while (destinationscopy.length > 0){
                destinationssplits.push(destinationscopy.splice(0,3))
            }
            //3x3 REQUESTS PER 2000
            console.log("destinationssplits and destinations")
            console.log(destinationssplits)
            console.log(destinations)


            var times = [];

            var thisorigintimes  = [];
            var originsindex =0;
            var destinationsplitsindex =0;

            var timeblockcount = 0;
            var totaltimeblocks = destinationssplits.length*origins.length
            this.setState({timeblockcount: timeblockcount})
            this.setState({totaltimeblocks: totaltimeblocks})
            timeblock();
            var that = this
            function timeblock () {  
                setTimeout(function(){

                    //HERE SO DOESNT GLITCH AT ENDS
                    if(destinationsplitsindex==destinationssplits.length){
                        console.log("fin j")
                        console.log(thisorigintimes)
                        destinationsplitsindex=0;
                        originsindex++;   
                        times.push(thisorigintimes);
                        thisorigintimes = [];
                        console.log("origins and times")
                        console.log(origins)
                        console.log(times)    
                    }


                    //CHECK ARRAY BOUNDS



                    //AFTER GONE THROUGH ALL ORIGINS AND DESTINTIONSS, CODE SO HAPPENS IN TIME
                    if(originsindex==origins.length){
                        console.log("ended")
                        console.log(times)

                        var mininddex = 0;
                        var minseconds = times[0][0]+times[1][0];
                        console.log("minseconds")
                        console.log(minseconds)
                        var thistime = 0;
                        for(var j = 0; j<times[0].length; j++){
                        //through each destination,, then through each origin and add time from each different locaiton to get there
                        for (var i = 0; i<times.length;i++){
                            if(typeof(times[i][j])!=="UNDEFINED"){//TEMP MANUAL DEAL WITH ASYNCROHICTY LEADING TO SOME UNDEFINED
                                thistime = thistime+times[i][j];
                            }
                        }
                        console.log(thistime)
                        
                        if(thistime<minseconds){
                            console.log("reupdate min destination")
                            minseconds=thistime;
                            mininddex=j;
                            thistime=0
                        }else{
                            thistime=0
                        }

                    }
                    console.log("mininddex, and destinations")
                    console.log(mininddex)
                    console.log(destinations)
                    console.log(destinations[mininddex])
                    that.setState({finalpoint: destinations[mininddex]});

                    //THEN MAKE SURE BREAKS PROPERLY
                    //SHOULD BREAK SINCE NO MORE CALLS


                }else{

                    console.log("j within timed")
                    console.log(destinationsplitsindex)
                    console.log("i within timed")
                    console.log(originsindex)

                    var thisdestinations = destinationssplits[destinationsplitsindex];
                    var thisorigins = [];
                    for(var jj =0; jj<thisdestinations.length;jj++){
                        thisorigins.push(origins[originsindex]);//since needs equal arrays of input/destination pairs
                    }

                    console.log("thisdestinations and origins")
                    console.log(thisdestinations)
                    console.log(thisorigins)
                    console.log(methods[originsindex])

                    //CATCH NO RESULTS ERROR
                    //INCORRECT DURATION VALUE


                    //ADD departure_time paramter
                    //trnasit mode etc


                    var distanceapi = new window.google.maps.DistanceMatrixService;
                    distanceapi.getDistanceMatrix({
                        origins: thisorigins,
                        destinations: thisdestinations,
                        travelMode: methods[originsindex],//TRANSIT
                        unitSystem: window.google.maps.UnitSystem.METRIC
                    },function(response,status){
                        console.log("did soemthing api")
                        if(status!=='OK'){
                            alert('Error was: '+ status);
                            //IF OVER QUERY LIMIT THEN DEALY LONGER
                        }else{
                            console.log("response rows")
                            console.log(response.rows)
                            for(var k = 0; k<response.rows.length;k++){
                                if(response.rows[k].elements[k].duration ){
                                thisorigintimes = thisorigintimes.concat(response.rows[k].elements[k].duration.value);
                            }else{
                                console.log('Infinity')
                                thisorigintimes=thisorigintimes.concat(Infinity)
                                                            //WHEN 1 ORIGIN CANT GET TO A DESINTATION, REMOVE THAT DESITNATIO NFROM OSSIBEL?
                                //destinationssplits[j][k].pop
                            }
                            }

                        }
                    }
                    )
                    destinationsplitsindex++;
                    timeblockcount++;
                    that.setState({timeblockcount: timeblockcount})
                    timeblock();
                }

         },2000);
        //WHAT LEAST TIME CAN DO//destinationssplits.length*origins.length*1000);

    }





    }
}







        // sort by distance
    // iteratte through prioriety que search

    // but also try and make these travel times closer to eachoterh


render()
{
    var placeaddress = "http://www.google.com/maps/place/"+this.state.finalpoint.lat+","+this.state.finalpoint.lng;
    return(
        <div>
        <div>{this.state.timeblockcount}{this.state.totaltimeblocks}</div>
        <a href={placeaddress} style={{color:'blue'}}>{placeaddress}</a>
        refresh for new search
        </div>
        );
}

}










export default class App extends Component {
    constructor(props){
        super(props);
        this.state = {forms: [<AddressForm callFromKids = {this.callFromKids} key ="0" id="origin"/>,<AddressForm callFromKids = {this.callFromKids} key="1" id="destination"/>],
        origin: ["",""],
        destination: ["",""],
        methods: ["",""],
        runalg: false,
        submitted: ""
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit=this.handleSubmit.bind(this);
    this.callFromKids = this.callFromKids.bind(this);
}

handleChange(event){

    }

    handleSubmit(event){
        console.log("_")
        console.log(this.state)
        this.setState({runalg: true})
        this.setState({submitted: "submitted, wait while talks to google.."})
        console.log(this.state)

        //RENDERING STATE CHANGE, AND CALLING PASSING UPDATE AS PROPS, BEFORE, UPDATING THE STATE
    }

    callFromKids = (data) =>{
        console.log("data sfrom parentpersecitve, just from recent change")
        console.log(data)
        var neworigins = this.state.origin;
        neworigins[data.id]=data.latlng;
        var newmethods = this.state.methods;
        newmethods[data.id]=data.method;
        this.setState({origins: neworigins, methods: newmethods })
        // only update from unqieu kids
    }


    render() {
        return (
          <div>

          <div>given starting points and transport methods, program approximates the meeting point of shortest total travel time</div>

          <div>
          {this.state.forms}
          </div>

          <button onClick={this.handleSubmit}>_submit</button>

          <div>{this.state.submitted}</div>

          <a href="https://google.com" style={{color:'blue'}}>google</a>
          <img src={img} alt="" width="88"/>

        <a href="https://paypal.me/benmacintosh" style={{color:'blue'}}>https://paypal.me/benmacintosh</a>
        <Algorithm datafromapp={this.state}/>


    {/*algortihm, renderonce    show map*/}

    </div>
    );
}
}