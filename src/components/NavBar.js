import React, { useState, useEffect } from 'react'
import { Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import jwt from 'jsonwebtoken'
import config from '../config/config'
import { useHistory } from 'react-router-dom';


function NavBar() {
    const history = useHistory();
    const [activeItem, setActiveItem] = useState('')
    const handleItemClick = (e, { name }) => setActiveItem(name)
    const [token, setToken] = useState('')
    const logout = () => {
        localStorage.removeItem('token')
        history.push('/')
    }
    useEffect(() => {
        setToken(localStorage.getItem('token'))
    })
    let decoded = ''
    if (token) {
        decoded = jwt.verify(token, config.jPASS)
    }

    return (
        <Menu pointing secondary size='massive'>
            <Menu.Item
                name='inicio'
                active={activeItem === 'inicio'}
                onClick={handleItemClick}
                as={Link}
                to='/home'
            />
            {token ? <Menu.Item
                name='conectar'
                active={activeItem === 'conectar'}
                onClick={handleItemClick}
                as={Link}
                to='/connect'
            /> : ''}
            {decoded.isAdmin ? <Menu.Item
                name='dashboard'
                active={activeItem === 'dashboard'}
                onClick={handleItemClick}
                as={Link}
                to='/dashboard'
            /> : ''}

            {token ?
                <Menu.Menu position='right'>
                    <Menu.Item
                        name={decoded.username}
                        active={activeItem === decoded.username}
                        onClick={handleItemClick}
                        as={Link}
                        to={'/profile/' + decoded.username}
                    />
                    <Menu.Item
                        name='cerrar sesion'
                        active={activeItem === 'cerrar sesion'}
                        onClick={logout}
                        as={Link}
                        to='/'
                    />
                </Menu.Menu>
                :
                <Menu.Menu position='right'>
                    <Menu.Item
                        name='iniciar sesion'
                        active={activeItem === 'iniciar sesion'}
                        onClick={handleItemClick}
                        as={Link}
                        to='/login'
                    />
                    <Menu.Item
                        name='registro'
                        active={activeItem === 'registro'}
                        onClick={handleItemClick}
                        as={Link}
                        to='/register'
                    />
                </Menu.Menu>}
        </Menu>
    )

}
export default NavBar;