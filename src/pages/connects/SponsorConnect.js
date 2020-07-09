import React, { useState, useEffect } from 'react'
import { Container, Card, Loader, Dimmer, Rating, Popup, Icon, Form, Divider, Header, Grid } from 'semantic-ui-react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const options = [
    { key: 't', text: 'Todos', value: 'Todos' },
    { key: 'd', text: 'Disponible', value: 'Disponible' },
    { key: 'o', text: 'Ocupado', value: 'Ocupado' },
]
function SponsorConnect({ userInfo: user, token }) {
    const notEnoughRatingsMsg = 'No hay puntuaciones suficientes'
    const [users, setUsers] = useState({});
    const [url] = useState('https://influenced.herokuapp.com/user/list');
    let sum = 0
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState('')
    const handleChange = (e, { value }) => {
        setStatus(value)
    }
    useEffect(() => {
        (async function () {
            setIsLoading(true);
            try {
                const result = await axios({
                    method: 'POST',
                    url,
                    data: { type: 'Influencer' },
                    headers: {
                        'Authorization': token
                    }
                })
                setUsers(result.data);
            } catch (error) {
            }
            setIsLoading(false);
        })();
    }, [url, token]);
    return (
        <Container >
            <Divider horizontal>
                <Header as='h4'>
                    Filtro
                </Header>
            </Divider>
            <Container text>
                <Form >
                    <Form.Select
                        fluid
                        label='Estado del usuario'
                        options={options}
                        defaultValue={options[0].value}
                        placeholder='Tipo de cuenta'
                        onChange={handleChange}
                    />
                </Form>
            </Container >

            <Divider horizontal />
            <Grid columns='equal' >
                <Grid.Row>
                    <Grid.Column />

                    <Grid.Column >
                        {isLoading ?
                            <Dimmer active inverted>
                                <Loader inverted>Loading</Loader>
                            </Dimmer>
                            :
                            <Card.Group doubling>{users && users.length > 0 ? status === '' || status === 'Todos' ?
                                users.map(user => {
                                    sum = 0
                                    return (

                                        <Card key={user._id} size='big'>
                                            <Card.Content >
                                                <Card.Header color='primary'
                                                    as={Link}
                                                    to={'/profile/' + user.username}>
                                                    {user.username} {user.verified ? <Icon color='blue' name='globe' /> : ''}</Card.Header>
                                                <Card.Meta>
                                                    {user.firstName} {user.lastName}
                                                </Card.Meta>

                                                <Card.Description>
                                                    <b>Email: </b>{user.email}
                                                </Card.Description>
                                                <Card.Description>
                                                    <b>Estado:</b> <Popup position='right center' size='mini' content={user.status} trigger={<Icon name='circle' color={user.status === 'Disponible' ? 'green' : 'yellow'} />} />
                                                </Card.Description>

                                            </Card.Content>
                                            <Card.Content >
                                                <b>Valoración: </b>
                                                {user.ratings.forEach(rating => {
                                                    sum = sum + rating.rating
                                                })}
                                                <Popup
                                                    content={user.ratings.length > 0 ? sum / user.ratings.length + ' / 10' : notEnoughRatingsMsg}
                                                    position='right center'
                                                    trigger={<Rating disabled icon='star' defaultRating={sum / user.ratings.length / 2}
                                                        maxRating={5} />}
                                                />
                                                <Card.Meta>
                                                    {user.ratings.length} puntuaciones
                                                </Card.Meta>
                                            </Card.Content>
                                        </Card>
                                    )
                                }) :
                                users.filter(user => user.status.includes(status)).map(user => {
                                    sum = 0
                                    return (
                                        <Card key={user._id}>
                                            <Card.Content >
                                                <Card.Header
                                                    as={Link}
                                                    to={'/profile/' + user.username}>{user.username}</Card.Header>
                                                <Card.Meta>
                                                    {user.firstName} {user.lastName}
                                                </Card.Meta>

                                                <Card.Description>
                                                    <b>Email: </b>{user.email}
                                                </Card.Description>
                                                <Card.Description>
                                                    <b>Estado:</b> <Popup position='right center' size='mini' content={user.status} trigger={<Icon name='circle' color={user.status === 'Disponible' ? 'green' : 'yellow'} />} />
                                                </Card.Description>

                                            </Card.Content>
                                            <Card.Content >
                                                <b>Puntuación: </b>
                                                {user.ratings.forEach(rating => {
                                                    sum = sum + rating.rating
                                                })}
                                                <Popup
                                                    content={user.ratings.length > 0 ? sum / user.ratings.length + ' / 10' : notEnoughRatingsMsg}
                                                    position='right center'
                                                    trigger={<Rating disabled icon='star' defaultRating={sum / user.ratings.length / 2}
                                                        maxRating={5} />}
                                                />
                                                <Card.Meta>
                                                    {user.ratings.length} puntuaciones
                                                </Card.Meta>
                                            </Card.Content>
                                        </Card>
                                    )
                                })
                                :
                                'No hay usuarios.'}</Card.Group>}
                    </Grid.Column>
                    <Grid.Column />
                </Grid.Row >
            </Grid >
        </Container >
    )

}

export default SponsorConnect