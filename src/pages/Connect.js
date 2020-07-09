import React from 'react'
import { Container, Grid } from 'semantic-ui-react'
import { useHistory } from 'react-router-dom';
import jwt from 'jsonwebtoken'
import config from '../config/config'
import InfluencerConnect from './connects/InfluencerConnect';
import SponsorConnect from './connects/SponsorConnect';

function Connect() {
    const history = useHistory()
    if (!localStorage.getItem('token')) history.push('/login')
    const token = localStorage.getItem('token')
    let decoded = ''
    if (token) decoded = jwt.verify(token, config.jPASS)
    const user = decoded


    return (
        <Container >

            <Grid columns='equal' width={10}>
                <Grid.Row>

                    <Grid.Column >
                        {user && user.type === 'Influencer' ?
                            <InfluencerConnect userInfo={user} token={token} />
                            :
                            <SponsorConnect userInfo={user} token={token} />
                        }
                    </Grid.Column>


                </Grid.Row>
            </Grid>

        </Container>
    )

}

export default Connect