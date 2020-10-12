import React, { Component } from 'react';
import axios from 'axios';
import '../sass/spotify.scss';

function MenuBtn(props) {
    const { access_token } = props;
    return(
        <div> 
            <div className='menuBtnContainer'>
                <a href={'/toptracks/?access_token=' + access_token}>Get My Top Tracks</a>
                <a href={'/topartists/?access_token=' + access_token}>Get My Top Artists</a>
                <a href={'/myplaylists/?access_token=' + access_token}>Get My Playlists</a>
            </div>
        </div>
    )
}

export default class Spotify extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: '',
            loggedin: false,
            user: {},
            userid: '',
            access_token: '',
            refresh_token: ''
        }
    }

    componentDidMount() {
        axios.post('/')
            .then((res) => {
                // set state to redirect on initial login 
                this.setState({url: res.data.redirect})
        })
        
        // retrieve our query parameter and isolate access token
        const queryString = new URLSearchParams(window.location.search);
        const access_token = queryString.get('access_token');
        this.setState({access_token})
        // make sure our access token is valid and set state to true
        if(access_token !== undefined && window.location.href.indexOf('?access_token=')) {
            this.setState({loggedin: true});
            fetch('https://api.spotify.com/v1/me', {
            headers: {'Authorization': 'Bearer ' + access_token},
            })
            .then((res) => res.json())
            .then(user => this.setState({user}))
            .catch(e => console.error(e))
        }
    }

    render() {
        const { loggedin, access_token } = this.state;
        console.log(this.state.user)
        return(
            <div>
                <div className='spotifyContainer'>
                    <a className='spotifyBtn' href={this.state.url}>Log In with Spotify</a>
                    {!loggedin ? <a className='spotifyBtn' href={this.state.url}>Log In with Spotify</a> : 
                    <MenuBtn 
                     access_token={access_token}
                    />
                    }
                </div>  
            </div>
        )
    }
}