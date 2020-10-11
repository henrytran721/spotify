import React, { Component } from 'react';


// functional component takes top tracks and maps through array to display on client side
function Tracks(props) {
    const { topTracks } = props;
    console.log(topTracks);
    return (
        <div>
            {topTracks ? topTracks.map((track, i) => {
                return(
                    <div className='trackName' key={i}>
                        <p>{i + 1}.</p>
                <a href={track.external_urls.spotify} target='_blank'><p>{track.artists[0].name} - {track.name}</p></a>
                        <img src={track.album.images[0].url} />
                    </div>
                )
            }) : ''}
        </div>
    )
}

// component will render the user's top tracks
// pull api data from https://api.spotify.com/v1/me/top/tracks

export default class TopTracks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            access_token: '',
            topTracks: []
        }
    }

    componentDidMount() {
        const queryString = new URLSearchParams(window.location.search);
        const access_token = queryString.get('access_token');
        this.setState({access_token});

        fetch('https://api.spotify.com/v1/me/top/tracks?limit=10', {
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    "Accept": "application/json"
                }
            })
            .then((res) => res.json())
            .then((data) => {
                this.setState({
                    topTracks: data.items
                })
            })
            .catch((e) => {console.error(e)})
    }

    render() {
        return(
            <div>
                <h2>Top Tracks Page</h2>
                <Tracks 
                    topTracks={this.state.topTracks}
                />
            </div>
        )
    }
}