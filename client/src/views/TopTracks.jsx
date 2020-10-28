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
                    {/** Previous Btn */}
                    {active > 0 ? 
                    <button className='navBtn' onClick={decrementActive}>
                        <svg id="more-arrows-left">
                            <polygon class="arrow-top" points="37.6,27.9 1.8,1.3 3.3,0 37.6,25.3 71.9,0 73.7,1.3 "/>
                            <polygon class="arrow-middle" points="37.6,45.8 0.8,18.7 4.4,16.4 37.6,41.2 71.2,16.4 74.5,18.7 "/>
                            <polygon class="arrow-bottom" points="37.6,64 0,36.1 5.1,32.8 37.6,56.8 70.4,32.8 75.5,36.1 "/>
                        </svg>
                    </button> 
                    : <span></span>}
                    <a href={topTracks[active].external_urls.spotify} target='_blank'><img class='imgMove'
                        crossOrigin={"anonymous"}
                        ref={props.imgRef}
                        src={topTracks[active].album.images[0].url} 
                        alt='album'
                        // Change background after every iteration with Color Thief
                        onLoad={() => {
                            const colorThief = new ColorThief();
                            const img = props.imgRef.current;
                            result = colorThief.getPalette(img, 10);
                            var color = result[0];
                            var colortwo =  result[1];
                            var trackContainer = document.querySelector('.trackContainer');
                            trackContainer.style.background = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
                            if(active > 0) {
                                trackContainer.style.transition = 'background-color 1500ms linear';
                            }
                          }}
                    /></a>
                    {/** Next Btn */}
                    <button className='navBtn' onClick={incrementActive}>
                        <svg id="more-arrows-right">
                            <polygon class="arrow-top" points="37.6,27.9 1.8,1.3 3.3,0 37.6,25.3 71.9,0 73.7,1.3 "/>
                            <polygon class="arrow-middle" points="37.6,45.8 0.8,18.7 4.4,16.4 37.6,41.2 71.2,16.4 74.5,18.7 "/>
                            <polygon class="arrow-bottom" points="37.6,64 0,36.1 5.1,32.8 37.6,56.8 70.4,32.8 75.5,36.1 "/>
                        </svg>
                    </button>
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
        fetch('https://api.spotify.com/v1/me/top/tracks?limit=30', {
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