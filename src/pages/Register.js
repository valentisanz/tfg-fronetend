import React, { useState } from 'react'
import { Form, Container, Header, Divider, Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useHistory } from 'react-router-dom';

const options = [
    { key: 'i', text: 'Influencer', value: 'Influencer' },
    { key: 'e', text: 'Empresa/Marca', value: 'Empresa' },
]
function Register() {
    const history = useHistory()
    const [loading, setLoading] = useState(false)

    if (localStorage.getItem('token')) history.push('/')

    const [values, setValues] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        passwordConfirm: '',
        type: ''
    })
    const onChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value })
    }
    const handleChange = (e, { value }) => setValues({ ...values, type: value })

    const onSubmit = async () => {
        setLoading(true)
        const response = await axios.post('https://influenced.herokuapp.com/user/register', values)
        if (response.data.message) {
            Swal.fire({
                icon: 'success',
                title: response.data.message
            })
            setLoading(false)
            history.push('/login')
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
                <Header as='h1' textAlign='center'>Registro</Header>
                <Form onSubmit={onSubmit}>
                    <Form.Group widths='equal'>
                        <Form.Input label='Nombre' placeholder='Nombre' name='firstName' value={values.firstName} onChange={onChange} />
                        <Form.Input label='Apellido' placeholder='Apellido' name='lastName' value={values.lastName} onChange={onChange} />
                    </Form.Group>

                    <Form.Input
                        fluid
                        label='Nombre de usuario'
                        placeholder='Nombre de usuario'
                        name='username' value={values.username}
                        onChange={onChange} />
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
                    <Form.Input
                        type='password'
                        fluid
                        label='Confirmar contraseña'
                        placeholder='Repetir contraseña'
                        name='passwordConfirm'
                        value={values.passwordConfirm}
                        onChange={onChange} />

                    <Form.Select
                        fluid
                        label='Tipo de cuenta'
                        options={options}
                        placeholder='Tipo de cuenta'
                        onChange={handleChange}
                    />
                    <Form.Group>
                        <Form.Button loading={loading ? true : false} type='submit' primary>Registrarse</Form.Button>
                    </Form.Group>

                </Form>

            </Container>
            <Container textAlign='center'>
                <Divider horizontal>¿Ya estas registrado?</Divider>
                <Button content='Inicia sesión' icon='user' size='big' as={Link} to='/login' />
            </Container >
        </Container >
    )

}

export default Register