import React, { useState, useEffect } from 'react'
import { Container } from 'semantic-ui-react'
import axios from 'axios'
import { useHistory } from 'react-router-dom';
import jwt from 'jsonwebtoken'
import config from '../config/config'
import InfluencerProfile from './profiles/InfluencerProfile';
import SponsorProfile from './profiles/SponsorProfile';

function Profile() {
    const history = useHistory()
    let username = ''
    if (!localStorage.getItem('token') || !localStorage.getItem('token').length > 0) history.push('/login')
    const token = localStorage.getItem('token')
    let decoded = ''
    if (token) decoded = jwt.verify(token, config.jPASS)
    const [user, setUser] = useState({})

    username = window.location.href.split('/')[4]
    const [url] = useState('https://influenced.herokuapp.com/user/profile/' + username);

    useEffect(() => {
        (async function () {
            try {
                const result = await axios({
                    method: 'GET',
                    url,
                    headers: {
                        'Authorization': token
                    }
                });
                setUser(result.data);
            } catch (e) {
            }
        })();
    }, [url, token]);
    function isOwner() {
        if (username === decoded.username || username === decoded.username + '#_') {
            return true
        } else {
            return false
        }
    }
    let owner = isOwner()
    return (
        <Container>
            {user && user.type === 'Influencer' ?
                <InfluencerProfile userInfo={user} owner={owner} userLogged={{ id: decoded._id, username: decoded.username }} token={token} />
                :
                <SponsorProfile userInfo={user} owner={owner} userLogged={{ id: decoded._id, username: decoded.username }} token={token} />
            }
        </Container>
    )

}

export default Profile