import React, { useState } from 'react'
import { Grid, Header, Card, Icon, Popup, Rating, Button, Form, Modal, Image, Dimmer, Loader } from 'semantic-ui-react'
import axios from 'axios'
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2'
import moment from 'moment'
import 'moment/locale/es'
import config from '../../config/config'

moment().locale('es')

function InfluencerProfile({ userInfo: user, owner, userLogged, token }) {
    const [rating, setRating] = useState(5);
    let sum = 0
    const twitchAuthUrl = config.twitchAuthUrl
    const instagramAuthUrl = config.instagramAuthUrl
    const notEnoughRatingsMsg = 'No hay puntuaciones suficientes'
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState(user.status)
    const [twitchProfile, setTwitchProfile] = useState(user.twitchProfile)
    const [twitchExtraData, setTwitchExtraData] = useState()
    const [instagramProfile, setInstagramProfile] = useState(user.instagramProfile)

    const history = useHistory();

    async function changeState() {
        if (status === 'Disponible') {
            setStatus('Ocupado')
        } else {
            setStatus('Disponible')
        }
        await axios({
            method: 'POST',
            url: 'https://influenced.herokuapp.com/user/status',
            data: { _id: user._id },
            headers: {
                'Authorization': token
            }
        });
    }
    const rate = async () => {
        await axios({
            method: 'POST',
            url: 'https://influenced.herokuapp.com/user/rate',
            data: { _id: user._id, rating, username: userLogged.username, id: userLogged.id },
            headers: {
                'Authorization': token
            }
        })
        window.location.reload()
    }

    let [userValues, setUserValues] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        userId: ''
    })
    const onChangeEdit = (event) => {
        setUserValues({ ...userValues, [event.target.name]: event.target.value })
    }

    const onSubmitEdit = async () => {
        setLoading(true)
        userValues.userId = user._id
        const response = await axios({
            method: 'POST',
            url: 'https://influenced.herokuapp.com/user/edit',
            data: userValues,
            headers: {
                'Authorization': token
            }
        })
        if (response.data.message) {
            localStorage.setItem('token', response.data.token)
            setLoading(false)
            Swal.fire({
                icon: 'success',
                title: response.data.message,
                timer: 2000
            })
            if (userValues.username.length > 0) history.push('/profile/' + userValues.username)
            userValues.firstName = ''
            userValues.lastName = ''
            userValues.username = ''
            userValues.email = ''
            userValues.password = ''
        }

        if (response.data.error) {
            Swal.fire({
                icon: 'error',
                title: response.data.error
            })
            setLoading(false)
        }
        window.location.reload()
    }
    async function deleteTwitchProfile() {
        setTwitchProfile(null)
        const response = await axios({
            method: 'POST',
            url: 'https://influenced.herokuapp.com/user/deleteTwitch',
            data: { userId: userLogged.id },
            headers: {
                'Authorization': token
            }
        })
        Swal.fire({
            icon: 'success',
            title: response.data.message,
            timer: 2000
        })
    }
    async function deleteInstagramProfile() {
        setInstagramProfile(null)
        const response = await axios({
            method: 'POST',
            url: 'https://influenced.herokuapp.com/user/deleteInstagram',
            data: { userId: userLogged.id },
            headers: {
                'Authorization': token
            }
        })
        Swal.fire({
            icon: 'success',
            title: response.data.message,
            timer: 2000
        })
    }
    async function userIdToServer() {
        await axios({
            method: 'POST',
            url: 'https://influenced.herokuapp.com/user/saveUserId',
            data: { userId: userLogged.id },
            headers: {
                'Authorization': token
            }
        })
    }
    async function twitchExtra() {
        setLoading(true)
        const response = await axios({
            method: 'POST',
            url: 'https://influenced.herokuapp.com/user/lastStreams',
            data: { twitchUsername: twitchProfile.displayName },
            headers: {
                'Authorization': token
            }
        })
        setTwitchExtraData(response.data)
        setLoading(false)
    }
    return (
        <Grid columns='equal'>
            <Grid.Column>
                <Card raised>
                    <Card.Content >
                        <Card.Header>{user.firstName} {user.lastName}</Card.Header>
                        <Image floated='right'>
                            {owner ?
                                <Modal trigger={
                                    <Button basic color='teal' animated size='mini'>
                                        <Button.Content visible>Editar</Button.Content>
                                        <Button.Content hidden>
                                            <Icon name='edit' />
                                        </Button.Content>
                                    </Button>
                                } closeIcon>
                                    <Modal.Header>Editar perfil</Modal.Header>
                                    <Modal.Content image>
                                        <Modal.Description>
                                            <Form onSubmit={onSubmitEdit}>
                                                <Form.Group widths='equal'>
                                                    <Form.Input
                                                        label='Nombre'
                                                        placeholder={user.firstName}
                                                        name='firstName'
                                                        value={userValues.firstName}
                                                        onChange={onChangeEdit} />
                                                    <Form.Input
                                                        label='Apellido'
                                                        placeholder={user.lastName}
                                                        name='lastName'
                                                        value={userValues.lastName}
                                                        onChange={onChangeEdit} />
                                                </Form.Group>

                                                <Form.Input
                                                    fluid
                                                    label='Nombre de usuario'
                                                    placeholder={user.username}
                                                    name='username' value={userValues.username}
                                                    onChange={onChangeEdit} />
                                                <Form.Input
                                                    fluid
                                                    label='Email'
                                                    placeholder={user.email}
                                                    name='email'
                                                    value={userValues.email}
                                                    onChange={onChangeEdit} />
                                                <Form.Input
                                                    type='password'
                                                    fluid
                                                    label='Nueva contraseña'
                                                    name='password'
                                                    value={userValues.password}
                                                    onChange={onChangeEdit} />
                                                <Form.Group>
                                                    <Form.Button loading={loading ? true : false} type='submit' color='green'>Guardar</Form.Button>
                                                </Form.Group>

                                            </Form>
                                        </Modal.Description>
                                    </Modal.Content>

                                </Modal>
                                : ''}
                        </Image>
                        <Card.Meta>
                            {user.type}
                        </Card.Meta>
                        <Card.Description>
                            <b>Nombre de usuario: </b> {user.username}
                        </Card.Description>
                        <Card.Description>
                            <b>Email: </b>{user.email}
                        </Card.Description>
                        <Card.Description>
                            <b>Estado:</b> <Popup position='bottom center' content={status} trigger={<Icon name='circle' color={status === 'Disponible' ? 'green' : 'yellow'} />} />
                        </Card.Description>
                        <Card.Description>
                            <b>Puntuación:</b>
                            {user.ratings ? user.ratings.forEach(rating => {
                                sum = sum + rating.rating
                            }) : null}
                            <Popup
                                content={user.ratings && user.ratings.length > 0 ? sum / user.ratings.length + ' / 10' : notEnoughRatingsMsg}
                                position='right center'
                                trigger={user.ratings ? <Rating disabled icon='star' defaultRating={sum / user.ratings.length / 2}
                                    maxRating={5} /> : null}
                            />
                            <Card.Meta>
                                {user.ratings ? user.ratings.length : null} puntuaciones
                            </Card.Meta>
                        </Card.Description>
                    </Card.Content>
                    {owner ? <Card.Content extra>
                        {status === 'Disponible' ?
                            <Button basic color='yellow' onClick={changeState}>
                                Cambiar estado a ocupado
                        </Button>
                            :
                            <Button basic color='green' onClick={changeState}>
                                Cambiar estado a disponible
                        </Button>}

                    </Card.Content> : null}
                    {owner ? null
                        :
                        <Card.Content>
                            <Button size='mini' color='green' inverted disabled={rating === 10 ? true : false} onClick={() => setRating(rating + 1)}>+</Button>
                            <Button basic size='mini' disabled>{rating}</Button>
                            <Button size='mini' color='red' inverted disabled={rating === 0 ? true : false} onClick={() => setRating(rating - 1)}>-</Button>
                            <Button size='mini' color='orange' inverted onClick={() => rate()}>PUNTUAR</Button>
                        </Card.Content>}

                </Card>
            </Grid.Column>
            <Grid.Column width={10}>
                <Header as='h1'>Redes sociales</Header>

                {twitchProfile
                    ?
                    <Card color='purple'>

                        <Card.Content>
                            {owner ?
                                <Image floated='right' onClick={async () => {
                                    deleteTwitchProfile()
                                }}>
                                    <Icon name='remove' color='red'/>
                                </Image> : null}
                            <Card.Header>
                                <Icon name='twitch' color='purple' />
                                {owner
                                    ? <Popup position='right center' size='small' content='¡Haz click para actualizar tu perfil!' trigger={
                                        <a onClick={userIdToServer} href={twitchAuthUrl}>Twitch</a>
                                    } />
                                    :
                                    'Twitch'}
                            </Card.Header>
                        </Card.Content>
                        <Card.Content>
                            <Image
                                floated='left'
                                size='tiny'
                                circular
                                src={twitchProfile.profileImg}
                            />
                            <Modal trigger={<Card.Header style={{ cursor: 'pointer' }} onClick={() => { twitchExtra() }}>{twitchProfile.displayName} <Icon size='small' color='blue' name='info circle' /></Card.Header>}>
                                <Modal.Header ><Icon name='twitch' color='purple' />Datos de los últimos {twitchExtraData ? twitchExtraData.data.length : ''} directos resubidos (últimos 30 dias) </Modal.Header>

                                {loading
                                    ? <Dimmer active inverted>
                                        <Loader inverted>Cargando</Loader>
                                    </Dimmer>
                                    :
                                    <Modal.Content >
                                        <Modal.Header as='h3'>
                                            {twitchExtraData && twitchExtraData.data.length > 0
                                                ?
                                                <Grid>
                                                    <Grid.Row textAlign='center'>
                                                        <Grid.Column width={5}>
                                                            <Icon name='eye' color='teal' />
                                                            {twitchExtraData.views.totalViews.toString().split('.')[0]}
                                                        </Grid.Column>
                                                        <Grid.Column width={5}>
                                                            <Icon name='eye' color='teal' />
                                                            {twitchExtraData.views.averageVideoViews.toString().split('.')[0]}/video
                                                        </Grid.Column>
                                                        <Grid.Column width={5}>
                                                            <Icon name='eye' color='teal' />
                                                            {twitchExtraData.views.averageDailyViews.toString().split('.')[0]}/dia
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                </Grid>
                                                : 'No hay datos suficientes'}
                                        </Modal.Header>
                                        <Modal.Description>
                                            <Grid celled>
                                                <Grid.Row>
                                                    {twitchExtraData && twitchExtraData.data.length > 0 ?
                                                        twitchExtraData.data.map((data, i) => {
                                                            return (
                                                                <Grid.Column width={4} key={i}>
                                                                    <b>{data.title}</b><br />
                                                                    <Icon name='eye' color='blue' /> {data.views}<br />
                                                                    <Icon name='clock' color='purple' /> {data.duration}<br />
                                                                    <Icon name='calendar alternate outline' color='red' /> {moment(data.date).fromNow()}
                                                                </Grid.Column>

                                                            )
                                                        })
                                                        : ''}
                                                </Grid.Row>

                                            </Grid>

                                        </Modal.Description>
                                    </Modal.Content>}
                            </Modal>
                            <Card.Content>Seguidores: {twitchProfile.followers}</Card.Content>
                            <Card.Content>Visualizaciones totales: {twitchProfile.totalViews}</Card.Content>
                            <Card.Description>{twitchProfile.description}</Card.Description>

                        </Card.Content>
                        <Card.Content extra>
                            <Card.Meta>Actualizado por última vez <b>{moment(twitchProfile.lastUpdate).fromNow()}</b></Card.Meta>
                        </Card.Content>
                    </Card>
                    :
                    <Card color='purple'>
                        <Card.Content>
                            <Card.Header><Icon name='twitch' color='purple' />
                                Twitch
                            </Card.Header>
                        </Card.Content>

                        <Card.Content extra>
                            {owner
                                ?
                                <Card.Meta><a onClick={userIdToServer} href={twitchAuthUrl}>¡Haz click para enlazar tu cuenta de twitch!</a></Card.Meta>
                                :
                                <Card.Meta>El usuario aun no ha añadido su perfil de Twitch</Card.Meta>
                            }
                        </Card.Content>
                    </Card>}
                {instagramProfile ?
                    <Card color='brown'>
                        <Card.Content>
                            {owner ?
                                <Image floated='right' onClick={async () => {
                                    deleteInstagramProfile()
                                }}>
                                    <Icon name='remove' color='red' />
                                </Image> : null}
                            <Card.Header><Icon name='instagram' color='brown' />
                                {owner
                                    ?
                                    <Popup position='right center' size='small' content='¡Haz click para actualizar tu perfil!' trigger={
                                        <a onClick={userIdToServer} href={instagramAuthUrl}>Instagram</a>
                                    } />
                                    :
                                    'Instagram'}
                            </Card.Header>
                        </Card.Content>
                        <Card.Content >
                            <Card.Header >
                                <a href={'https://www.instagram.com/' + instagramProfile.username} target="_blank">{instagramProfile.username}</a>
                                &nbsp;
                                <Icon size='small' color='blue' name='external' />
                            </Card.Header>
                            <Card.Content >
                                Publicaciones: {instagramProfile.media_count}
                            </Card.Content>
                            <Card.Content >
                                Tipo de cuenta: {instagramProfile.account_type}
                            </Card.Content>
                        </Card.Content>

                        <Card.Content extra>
                            <Card.Meta>Actualizado por última vez <b>{moment(instagramProfile.lastUpdate).fromNow()}</b></Card.Meta>
                        </Card.Content>
                    </Card>
                    :
                    <Card color='brown'>
                        <Card.Content>
                            <Card.Header><Icon name='instagram' color='brown' />
                                Instagram
                            </Card.Header>
                        </Card.Content>

                        <Card.Content extra>
                            {owner
                                ?
                                <Card.Meta><a onClick={userIdToServer} href={instagramAuthUrl}>¡Haz click para enlazar tu cuenta de Instagram!</a></Card.Meta>
                                :
                                <Card.Meta>El usuario aun no ha añadido su perfil de Instagram</Card.Meta>
                            }
                        </Card.Content>
                    </Card>
                }
            </Grid.Column>



        </Grid >
    )

}

export default InfluencerProfile