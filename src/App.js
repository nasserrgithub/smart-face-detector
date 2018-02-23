import React, { Component } from 'react';
import Particles from 'react-particles-js';
//import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation.js';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js'
import Rank from './components/Rank/Rank.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import SignIn from './components/SignIn/SignIn.js';
import Register from './components/Register/Register.js';
import './App.css';

const particlesOption = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    }
  } 
}

/*
const app = new Clarifai.App({
 apiKey: 'ac417845ee6f41d69bc6da1b6de2fa19'
});
*/

const initialState = {
  input:'',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    //password: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor(){
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user:{
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  //fetching the backend for checking only
 /* componentDidMount() {
    fetch('http://localhost:3000/')
      .then(response => response.json())
      .then(console.log)
  }*/

  calculateFaceLocation = (x) => {
    const clarifaiFace = x.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    //console.log(box);
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input:event.target.value});
  }

  onSubmitDetectFunc = () => {
    /*console.log('clicking test');*/
      this.setState({imageUrl: this.state.input});
      fetch(/*'http://localhost:3000/imageurl'*/'https://nameless-springs-27391.herokuapp.com/imageurl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input
        })
      })
      .then(response => response.json())
      /*
      app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)*/
      .then(response => {
        if(response) {
          fetch(/*'http://localhost:3000/image'*/'https://nameless-springs-27391.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }))
              //changing the whole user object
              /*this.setState({user: {
                entries: count
              }})*/
            })
            .catch(console.log);
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
        // do something with response
        //console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
      .catch(err => console.log(err));
  }

  onRouteChange = (currentroute) => {
    /*console.log(currentroute);*/
    if (currentroute === 'signout'){
      this.setState(initialState);
    } else if (currentroute === 'home') {
      this.setState({isSignedIn: true});
    }
    this.setState({route: currentroute});
  }

  render() {
    const { isSignedIn, route, box, imageUrl } = this.state;
    return ( 
      <div className="App">
        <Particles className='particles' params={particlesOption}/>
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home' // {route} can be route only since the whole conditional is already wrapped
          ? <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm 
                inputChange={this.onInputChange}
                onSubmitDetect={this.onSubmitDetectFunc}
              />
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
          : (
              route === 'signin'
              ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }
}

export default App;
