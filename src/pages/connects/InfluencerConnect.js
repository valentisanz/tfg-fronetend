import React, { useState, useEffect } from 'react'
import { Container, Card, Loader, Dimmer, Divider, Header, Form, Image } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'
import 'moment/locale/es'
moment().locale('es')
const options = [
    { key: 'r', text: 'Recientes', value: 'Recientes' },
    { key: 'a', text: 'Antiguas', value: 'Antiguas' }
]
function InfluencerConnect({ userInfo: user, token }) {

    const [offers, setOffers] = useState({});
    const [url] = useState('https://influenced.herokuapp.com/offer/list');
    const [isLoading, setIsLoading] = useState(false);
    const [old, setOld] = useState('')
    const handleChange = (e, { value }) => {
        setOld(value)
    }
    useEffect(() => {
        (async function () {
            setIsLoading(true);
            try {
                const result = await axios({
                    method: 'GET',
                    url,
                    headers: {
                        'Authorization': token
                    }
                });
                setOffers(result.data);
            } catch (error) {
            }
            setIsLoading(false);
        })();
    }, [url, token]);

    return (
        <Container>
            {isLoading ?
                <Dimmer active inverted>
                    <Loader inverted>Loading</Loader>
                </Dimmer>
                :
                <Container>
                    <Divider horizontal>
                        <Header as='h1'>
                            Ofertas
                </Header>
                    </Divider>
                    <Card.Group>
                        {offers && offers.length > 0 ?
                            offers.map(offer => {
                                return (
                                    <Card key={offer._id}>
                                        <Card.Content >
                                            <Image floated='right'>{moment(offer.timestamp).fromNow()}</Image>

                                            <Card.Header>{offer.title}</Card.Header>
                                            <Card.Description>
                                                {offer.body}
                                            </Card.Description>


                                        </Card.Content>
                                        <Card.Content
                                            as={Link}
                                            to={'/profile/' + offer.author.username}>
                                            {offer.author.username}
                                        </Card.Content>
                                    </Card>
                                )
                            })
                            :
                            'No hay ofertas publicadas'}</Card.Group>
                </Container>
            }
        </Container>
    )

}

export default InfluencerConnect
