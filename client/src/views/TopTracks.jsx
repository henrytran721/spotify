import React, { Component } from 'react';
import ColorThief from "colorthief";

// functional component takes top tracks and maps through array to display on client side
function Tracks(props) {
    const { topTracks, active, handleNext, handlePrev } = props;
    var result = [];
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
                    {active > 0 ? <button onClick={handlePrev}>Prev</button> : <span></span>}
                    <a href={topTracks[active].external_urls.spotify} target='_blank'><img 
                        crossOrigin={"anonymous"}
                        ref={props.imgRef}
                        src={topTracks[active].album.images[0].url} 
                        alt='album'
                        onLoad={() => {
                            const colorThief = new ColorThief();
                            const img = props.imgRef.current;
                            result = colorThief.getPalette(img, 10);
                            var color = result[0];
                            var trackContainer = document.querySelector('.trackContainer');
                            trackContainer.style.background = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
                          }}
                    /></a>
                    <button onClick={handleNext}>Next</button>
                    </div>
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

    handleNext = () => {
        if(this.state.active < 9) {
            this.setState({
                active: this.state.active + 1
            })
        } else {
            this.setState({
                active: 0
            })
        }
    }

    handlePrev = () => {
        this.setState({
            active: this.state.active - 1
        })
    }

    render() {
        console.log(this.state.active);
        return(
            <div className='trackContainer'>
                <h2 style={{color: 'white'}}>Your Top Tracks</h2>
                <Tracks 
                    topTracks={this.state.topTracks}
                    active={this.state.active}
                    imgRef={this.imgRef}
                    handleNext={this.handleNext}
                    handlePrev={this.handlePrev}
                />
            </div>
        )
    }
}