import React, { Component } from 'react';
import axios from 'axios';

export default class Spotify extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: '',
            loggedin: false,
            user: {},
            userid: ''
        }
    }

    componentDidMount() {
        axios.post('/')
            .then((res) => {
                this.setState({url: res.data.redirect})
        })
        
        // retrieve our query parameter and isolate access token
        const queryString = new URLSearchParams(window.location.search);
        const access_token = queryString.get('access_token');
        // make sure our access token is valid and set state to true
        if(access_token !== undefined && window.location.href.indexOf('?access_token=')) {
            this.setState({loggedin: true});
            fetch('https://api.spotify.com/v1/me', {
            headers: {'Authorization': 'Bearer ' + access_token},
            })
            .then((res) => res.json())
            .then(user => this.setState({user}))
            .catch(e => console.error(e))

            fetch('https://api.spotify.com/v1/me/top/tracks', {
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    "Accept": "application/json"
                }
            })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
            })
            .catch((e) => {console.error(e)})
        }
    }

    render() {
        return(
            <div>
                <a href={this.state.url}>Log In with Spotify</a>
            </div>
        )
    }
}