import React, { Component } from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';
import '../sass/playlists.scss';

export default class Playlist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            access_token: '',
            tracks: [],
            active: '',
            display: 10,
            playlist_info: {}
        }
    }

    componentDidMount() {
        const queryString = new URLSearchParams(window.location.search);
        const access_token = queryString.get('access_token');
        this.setState({access_token});
        var url = window.location.href.split('/');
        var playlist_id = url[4];

        fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, {
            headers: {
                'Authorization': 'Bearer ' + access_token,
                "Accept": "application/json"
            }
        })
        .then((res) => res.json())
        .then((tracks) => this.setState({
            tracks: tracks.items,
            active: 0
        }));

        fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/`, {
            headers: {
                'Authorization': 'Bearer ' + access_token,
                "Accept": "application/json"
            }
        })
        .then((res) => res.json())
        .then((data) => {
            this.setState({
                playlist_info: data
            })
        })
    }

    setActive = (e) => {
        e.preventDefault();
        this.setState({
            active: e.target.id
        })
    }

    showMore = () => {
        this.setState({
            display: this.state.display + 10
        })
    }

    render() {
        return(
            <div>
                <div className='playlistInternal'>
                    <div className='playlistInfo'>
                        <p className='playlistName'>{this.state.playlist_info.name}</p>
                        <p>{}</p>
                    </div>
                    <div className='playlistDiv'>
                    <div>
                    <div className='playlistBox'>
                    {this.state.tracks.length > 0 ? 
                    this.state.tracks.map((tracks, idx) => {
                        return(
                            <div className='playlistItem'>
                                <div>
                                    {idx <= this.state.display ? <p id={idx} key={idx} onClick={this.setActive}>{tracks.track.name}</p> 
                                    : <p id={idx} key={idx} style={{display: 'none'}} onClick={this.setActive}>{tracks.track.name}</p>}
                                </div>
                            </div>
                        )
                    })
                    : 'Loading'}
                    </div>
                    <button className='showMore' onClick={this.showMore}>Show More</button>
                    </div>
                    <div className='albumArt'>
                        {this.state.tracks.length > 0 ?  <img src={this.state.tracks[this.state.active].track.album.images[0].url} /> : "Loading"}
                    </div>
                    </div>
                </div>
                {this.state.tracks.length > 0 ? 
                    <SpotifyPlayer 
                    token={this.state.access_token}
                    uris={this.state.tracks[this.state.active].track.uri}
                    autoPlay={true}
                    styles={{
                        bgColor: '#000',
                        color: '#fff',
                        loaderColor: '#fff',
                        sliderColor: '#fff',
                        savedColor: '#fff',
                        trackArtistColor: '#ccc',
                        trackNameColor: '#fff',
                    }}
                    />
                    : ''}
            </div>
        )
    }
}