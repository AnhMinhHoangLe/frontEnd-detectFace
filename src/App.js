import React, { Component } from "react";
import "./App.css";
import Navigation from "./Component/Navigation/Navigation";
import Logo from "./Component/Logo/Logo";
import ImageLinkForm from "./Component/ImageLinkForm/ImageLinkForm";
import Rank from "./Component/Rank/Rank";
import FaceRecognition from "./Component/FaceRecognition/FaceRecognition";
import SignIn from "./Component/SignIn/SignIn";
import Register from "./Component/Register/Register";
import Particles from "react-particles-js";
import "tachyons";

// import Clarifai from "clarifai"; because it display the key api in the front end - that would be risk
//https://leaverou.github.io/css3patterns/#honeycomb: BACKGROUND OF INPUT
// API of Clarifai, detect face, https://www.clarifai.com/developer/welcome
//AND https://github.com/Clarifai/clarifai-javascript/blob/master/src/index.js
// const app = new Clarifai.App({
//     apiKey: "ee01703741704094a0c382aa18ea6207",
// });

//Custom particles, https://vincentgarreau.com/particles.js/
//AND https://www.npmjs.com/package/react-particles-js
const particleOptions = {
    particles: {
        number: {
            value: 100,
            density: {
                enable: true,
                value_area: 1000,
            },
        },
    },
};
const initialState = {

    input: "",
    imageURL: "",
    box: {},
    route: "signin",
    isSignedIn: false,
    user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: '',

    }
}
class App extends Component {
    //State
    constructor() {
        super();
        this.state = initialState
    }
    //update user 
    loadUser = (data) => {
        this.setState({
            user: {
                id: data.id,
                name: data.name,
                email: data.email,
                entries: data.entries,
                joined: data.joined,
            }
        })
    }
    //Already has CORS, so you dont need to use it
    // componentDidMount() {
    //     fetch("http://localhost:3000")
    //         .then((response) => response.json())
    //         .then(console.log);
    // }
    //calculate Face location
    // we have this "data.outputs[0].data.regions[0].region_info.bounding_box;"
    // because when the returned result came out to the object result, and we get the straight  forward access in the object
    calculateFaceLocation = (data) => {
        const clarifyFace =
            data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById("inputImage");
        const width = Number(image.width);
        const height = Number(image.height);
        // console.log(width, height);
        return {
            leftCol: clarifyFace.left_col * width,
            topRow: clarifyFace.top_row * height,
            rightCol: width - clarifyFace.right_col * width,
            bottomRow: height - (clarifyFace.bottom_row + height),
        };
    };

    displayFaceBox = (box) => {
        this.setState({ box: box });
        console.log(box);
    };
    //Input
    onInputChange = (event) => {
        this.setState({ input: event.target.value }); // it will display the input of the form input
    };
    //submit
    onButtonSubmit = () => {
        this.setState({ imageURL: this.state.input });
        // console.log("click");
        fetch(" https://whispering-spire-48568.herokuapp.com/imageURL", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                input: this.state.input
            }),
        })
            .then((response) => response.json())
            .then((response) => {
                if (response) {
                    fetch(" https://whispering-spire-48568.herokuapp.com/image", {
                        method: "put",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            id: this.state.user.id
                        }),
                    })
                        .then(response => response.json())
                        .then(count => {
                            this.setState(Object.assign(this.state.user, { entries: count }))
                        })

                }
                this.displayFaceBox(this.calculateFaceLocation(response));
                // console.log(
                //     response.outputs[0].data.regions[0].region_info.bounding_box
                // );
            })
            .catch((err) => {
                console.log(err);
            });
    };
    onRouteChange = (route) => {
        if (route === "signout") {
            this.setState(initialState);
        } else if (route === "home") {
            this.setState({ isSignedIn: true });
        }
        this.setState({ route: route });
    };

    render() {
        const { isSignedIn, imageURL, route, box } = this.state;
        return (
            <div className='App'>
                <Particles className='particles' params={particleOptions} />
                {/* Navigation for route */}
                <Navigation
                    isSignedIn={isSignedIn} // show the status of signin
                    onRouteChange={this.onRouteChange} // to control the route 
                />
                <Logo />
                {
                    route === "signin" ?
                        <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                        : route === "register" ?
                            <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                            :
                            (
                                <div>
                                    <Rank name={this.state.user.name} entries={this.state.user.entries} />
                                    <ImageLinkForm
                                        onInputChange={this.onInputChange}
                                        onButtonSubmit={this.onButtonSubmit}
                                    />
                                    <FaceRecognition box={box} imageURL={imageURL} />
                                </div>
                            )
                }
            </div>
        );
    }
}
export default App;
//ee01703741704094a0c382aa18ea6207
