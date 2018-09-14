import React, { Component} from 'react';
import './App.css';
import img from './img1.jpg'
import img2 from './img2.png'

class App extends Component {
  render() {
    return (
      <div>

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

        <div>gardening/floristry</div>   
        <a href="https://drive.google.com/open?id=1DjjcdPYN1j7c2EsNROreW2KpkhduQtXD" syle={{color:'blue'}}>https://drive.google.com/open?id=1DjjcdPYN1j7c2EsNROreW2KpkhduQtXD</a>
        <p/>

        <div>cv</div>        
        <a href="https://drive.google.com/open?id=1JobQ1qgPOFjpesU8tSAxJcxyaRh-dm8r" syle={{color:'blue'}}>https://drive.google.com/open?id=1JobQ1qgPOFjpesU8tSAxJcxyaRh-dm8r </a>
        <p/>

        <a href="https://www.instagram.com/0008000000macintosh/" style={{color:'blue'}}>https://www.instagram.com/0008000000macintosh/</a>
        <div></div>
        <img src={img2} alt="" width="88"/>
        <img src={img} alt="" width="88"/>



      </div>
    );
  }
}

export default App;