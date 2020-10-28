import React, { Component } from 'react';
import '../sass/playlists.scss';

export default class MyPlaylists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            access_token: '',
            playlists: []
        }
    }

    componentDidMount() {
        const queryString = new URLSearchParams(window.location.search);
        const access_token = queryString.get('access_token');
        this.setState({access_token});

        fetch('https://api.spotify.com/v1/me/playlists/', {
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    "Accept": "application/json"
                }
        })
        .then((res) => res.json())
        .then((data) => this.setState({playlists: data.items}))
    }

    setPlaylist(e) {
        e.preventDefault();
        console.log(e.target)
    }

    render() {
        console.log(this.state.playlists);
        return(
            <div className='playlistLanding'>
                <h2>My Playlists</h2>
                {this.state.playlists.map((playlist, idx) => {
                    return(
                        <div key={idx} className='playlistContainer'>
                            <a href={playlist.id + '/?access_token=' + this.state.access_token}><h2>{playlist.name}</h2></a>
                            <a href={playlist.id + '/?access_token=' + this.state.access_token}><img src={playlist.images[0].url} /></a>
                        </div>
                    )
                })}
            </div>
        )
    }
}