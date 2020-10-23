import React, { Component, useEffect, useState } from 'react';
import ColorThief from "colorthief";
import SpotifyPlayer from 'react-spotify-web-playback';

// functional component takes top tracks and maps through array to display on client side
function Tracks(props) {
    const { topTracks, token, color } = props;
    var result = [];
    
    // use react hook to create an active state variable
    // passing in a function sets the state only once and doesn't run every time the function is rendered
    const [active, setActive] = useState(() => {return 0});

    // function to drecrement our active state
    // passes in updated value to update active state
    function decrementActive() {
        setActive(prevActive => prevActive - 1);
    }

    // function to increment our state
    function incrementActive() {
        var img = document.querySelector('.imgMove');
        img.classList.add('moveY');

        setTimeout(function() {
            if(active < 19) {
                setActive(prevActive => prevActive + 1);
            } else {
                setActive(0);
            }
            img.classList.remove('moveY')
        }, 500)
    }

    // 
    useEffect(() => {
        console.log(active);
    }, [active])
    
    return (
        <div className='track'>
            <div className='trackName'>
                {topTracks[active] !== undefined ?
                <div style={{width: '100%'}}> 
                    <div className='trackHeading'>
                    <p>{active + 1}.</p>
                    <a href={topTracks[active].external_urls.spotify} target='_blank'><p>{topTracks[active].artists[0].name} - {topTracks[active].name}</p></a>
                    </div>
                    <div className='navAndImage'>
                    {active > 0 ? <button onClick={decrementActive}>Prev</button> : <span></span>}
                    <a href={topTracks[active].external_urls.spotify} target='_blank'><img class='imgMove'
                        crossOrigin={"anonymous"}
                        ref={props.imgRef}
                        src={topTracks[active].album.images[0].url} 
                        alt='album'
                        onLoad={() => {
                            const colorThief = new ColorThief();
                            const img = props.imgRef.current;
                            result = colorThief.getPalette(img, 10);
                            var color = result[0];
                            var colortwo =  result[1];
                            var trackContainer = document.querySelector('.trackContainer');
                            var albumArt = document.querySelector('.imgMove');
                            trackContainer.style.background = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
                          }}
                    /></a>
                    <button onClick={incrementActive}>Next</button>
                    </div>
                    {topTracks[active] !== undefined ? 
                    <div className='spotifyPlayer'>
                    <SpotifyPlayer 
                    token={token}
                    uris={topTracks[active].uri}
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
                    </div> : ''}
                </div>: ''
                }
            </div>
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
            topTracks: [],
            active: 0,
        }

        this.imgRef = React.createRef();
    }

    componentDidMount() {
        const queryString = new URLSearchParams(window.location.search);
        const access_token = queryString.get('access_token');
        this.setState({access_token});

        // fetch top tracks 
        fetch('https://api.spotify.com/v1/me/top/tracks?limit=20', {
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    "Accept": "application/json"
                }
            })
            .then((res) => res.json())
            .then((data) => {
                this.setState({
                    topTracks: data.items,
                    color: []
                })
            })
            .catch((e) => {console.error(e)})
            
        // fetch('https://api.spotify.com/v1/me/', {
        //     headers: {
        //         'Authorization': 'Bearer ' + access_token,
        //         "Accept": "application/json"
        //     }
        // })
        // .then((res) => res.json())
        // .then((data) => console.log(data))

    }

    render() {
        return(
            <div className='trackContainer'>
                <h2 style={{color: 'white'}}>Your Top Tracks</h2>
                <Tracks 
                    topTracks={this.state.topTracks}
                    imgRef={this.imgRef}
                    token={this.state.access_token}
                />
            </div>
        )
    }
}