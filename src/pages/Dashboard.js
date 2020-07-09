import React, { useState, useEffect } from 'react'
import { Container, Card, Loader, Dimmer, Image, Icon, Header, Grid } from 'semantic-ui-react'
import axios from 'axios'
import Swal from 'sweetalert2'

function Dashboard() {
    const [users, setUsers] = useState();
    const [url] = useState('https://influenced.herokuapp.com/user/list');
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem('token')
    useEffect(() => {
        (async function () {
            setIsLoading(true);
            try {
                const result = await axios({
                    method: 'POST',
                    url,
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

    async function deleteUser(userId) {
        console.log(userId)
        const result = await axios({
            method: 'POST',
            url: 'https://influenced.herokuapp.com/user/delete',
            data: { userId },
            headers: {
                'Authorization': token
            }
        });
        if (result.data.message) {
            window.location.reload()
        } else {
            Swal.fire({
                icon: 'error',
                title: result.data.error
            })
        }
    }
    async function toggleAdmin(userId) {
        const result = await axios({
            method: 'POST',
            url: 'https://influenced.herokuapp.com/user/toggleAdmin',
            data: { userId },
            headers: {
                'Authorization': token
            }
        })
        if (result.data.message) {
            window.location.reload()
        } else {
            Swal.fire({
                icon: 'error',
                title: result.data.error
            })
        }
    }
    return (
        <Container>
            <Grid columns='equal'>
                <Grid.Column>
                </Grid.Column>
                <Grid.Column width={12}>
                    <Header as='h1' textAlign='center'>Usuarios</Header>
                    <Container >

                        {isLoading
                            ?
                            <Dimmer active inverted>
                                <Loader inverted>Cargando</Loader>
                            </Dimmer>
                            :
                            <Card.Group>
                                {users && users.length > 0 ?
                                    users.map(user => {
                                        return (
                                            <Card fluid color='green' key={user._id}>
                                                <Card.Content>
                                                    <Card.Header>
                                                        {user.username}
                                                        <Image floated='right'>
                                                            <Icon name={user.isAdmin ? 'user secret' : 'user'} color='blue' style={{ cursor: 'pointer' }} onClick={() => { toggleAdmin(user._id) }} />
                                                            <Icon name='close' color='red' onClick={() => { deleteUser(user._id) }} style={{ cursor: 'pointer' }} />
                                                        </Image>
                                                    </Card.Header>
                                                    <Card.Meta>
                                                        {user._id}
                                                    </Card.Meta>
                                                </Card.Content>
                                            </Card>)
                                    })
                                    : 'No se han encontrado usuarios'}
                            </Card.Group>}
                    </Container>
                </Grid.Column>
                <Grid.Column>
                </Grid.Column>
            </Grid>
        </Container>
    )

}

export default Dashboard