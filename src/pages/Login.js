import React, { useState } from 'react'
import { Form, Container, Header, Divider, Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useHistory } from 'react-router-dom';

function Login() {
    const history = useHistory();
    const [loading, setLoading] = useState(false)
    if (localStorage.getItem('token')) history.push('/')


    const [values, setValues] = useState({
        email: 'gotardx@gmail.com',
        password: '123123'
    })
    const onChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value })
    }

    const onSubmit = async () => {
        setLoading(true)
        const response = await axios.post('https://influenced.herokuapp.com/user/login', values)
        if (response.data.message) {
            localStorage.setItem('token', response.data.token)
            setLoading(false)
            history.push('/home')
        }
        if (response.data.error) {
            Swal.fire({
                icon: 'error',
                title: response.data.error
            })
            setLoading(false)
        }
    }
    return (
        <Container>
            <Container text>
                <Header as='h1' textAlign='center'>Iniciar sesión</Header>
                <Form onSubmit={onSubmit}>
                    <Form.Input
                        fluid
                        label='Email'
                        placeholder='Email' name='email'
                        value={values.email}
                        onChange={onChange} />
                    <Form.Input
                        type='password'
                        fluid
                        label='Contraseña'
                        placeholder='Contraseña'
                        name='password'
                        value={values.password}
                        onChange={onChange} />
                    <Form.Button loading={loading ? true : false} type='submit' primary>Iniciar sesión</Form.Button>
                </Form>

            </Container>
            <Container textAlign='center'>
                <Divider horizontal>¿No estas registrado?</Divider>
                <Button
                    content='Regístrate'
                    icon='user'
                    size='big'
                    as={Link}
                    to='/register' />
            </Container >
        </Container >
    )

}

export default Login