import React, { useState } from 'react'
import { Grid, Header, Card, Popup, Form, Button, Rating, Icon, Image, Modal, Divider } from 'semantic-ui-react'
import axios from 'axios'
import Swal from 'sweetalert2'
import moment from 'moment'
import { useHistory } from 'react-router-dom';

import 'moment/locale/es'

moment().locale('es')

function SponsorProfile({ userInfo: user, owner, userLogged, token }) {
    const notEnoughRatingsMsg = 'No hay puntuaciones suficientes'
    const [loading, setLoading] = useState(false)
    const history = useHistory();

    const [rating, setRating] = useState(5);
    let sum = 0
    const [values, setValues] = useState({
        title: '',
        body: '',
        _id: ''
    })
    const onChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value })
    }

    const onSubmit = async () => {
        values._id = user._id

        const response = await axios({
            method: 'POST',
            url: 'https://influenced.herokuapp.com/offer/create',
            data: values,
            headers: {
                'Authorization': token
            }
        })
        setLoading(true)

        if (response.data.error) {
            Swal.fire({
                icon: 'error',
                title: 'Rellena todos los campos'
            })
            setLoading(false)
        } else {
            setLoading(false)
            window.location.reload()
        }
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
    const [userValues, setUserValues] = useState({
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

            if (userValues.username.length > 0) history.push('/profile/' + userValues.username)
            userValues.firstName = ''
            userValues.lastName = ''
            userValues.username = ''
            userValues.email = ''
            userValues.password = ''

            Swal.fire({
                icon: 'success',
                title: response.data.message,
                timer: 2000
            }, window.location.reload())
        }

        if (response.data.error) {
            Swal.fire({
                icon: 'error',
                title: response.data.error
            })
            setLoading(false)
        }
    }
    async function deleteOffer(offerId) {
        const response = await axios({
            method: 'POST',
            url: 'https://influenced.herokuapp.com/offer/delete',
            data: { offerId, userId: user._id },
            headers: {
                'Authorization': token
            }
        })
        if (response.data.message) window.location.reload()
        if (response.data.error) Swal.fire({
            icon: 'error',
            title: response.data.error
        })

    }
    return (
        <Grid columns='equal'>
            <Grid.Column>
                <Card raised>
                    <Card.Content >
                        <Card.Header>{user.firstName} {user.lastName} </Card.Header>
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
                                : null}
                        </Image>
                        <Card.Meta>
                            {user.type}
                        </Card.Meta>
                        <Card.Description>
                            <b>Empresa: </b> {user.username}
                        </Card.Description>
                        <Card.Description>
                            <b>Email: </b>{user.email}
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
            <Grid.Column width={12}>
                <Header as='h1'>Ofertas</Header>
                {owner ? <Form onSubmit={onSubmit}>
                    <Form.Group widths='equal'>
                        <Form.Input
                            fluid
                            label='Titulo'
                            placeholder='Titulo' name='title'
                            value={values.title}
                            onChange={onChange} />
                        <Form.Input
                            fluid
                            label='Descripcion'
                            placeholder='Descripcion'
                            name='body'
                            value={values.body}
                            onChange={onChange} />
                    </Form.Group>
                    <Form.Button type='submit' primary loading={loading ? true : false}>Publicar oferta</Form.Button>
                </Form> : null}
                <Divider />
                <Card.Group>
                    {user.offers && user.offers.length > 0 ?
                        user.offers.map(offer => {
                            return (
                                <Card key={offer._id}>
                                    <Card.Content >
                                        {owner ?
                                            <Image floated='right' onClick={() => {
                                                deleteOffer(offer._id)
                                            }}>
                                                <Icon name='remove' color='red' />
                                            </Image> : null}
                                        <Card.Header>{offer.title}</Card.Header>
                                        <Card.Description>
                                            {offer.body}
                                        </Card.Description>
                                    </Card.Content>
                                    <Card.Content extra>
                                        <Card.Meta>
                                            {moment(offer.timestamp).fromNow()}
                                        </Card.Meta>
                                    </Card.Content>
                                </Card>
                            )
                        })
                        :
                        null}</Card.Group>
            </Grid.Column>
        </Grid>
    )
}

export default SponsorProfile