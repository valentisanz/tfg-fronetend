import React from 'react';
import { Grid, Header, Container, Divider, Icon, Card } from 'semantic-ui-react'
function Home() {

    return (
        <Container>
            <Grid columns='equal'>
                <Grid.Column>
                </Grid.Column>
                <Grid.Column width={10}>
                    <Header as='h1' textAlign='center'>Influenced</Header>
                    <Container textAlign='center'>
                        <p>
                            Influenced es una pagina web en la que creadores de contenido y marcas se encuentran, para
                            asi establecer un primer contacto para colaborar en futuras acciones.
                        </p>
                        <p>
                            El objetivo de Influenced es ser un punto de partida para ambsa partes como hacen otras
                            webs/apps en las que se ofrece/busca trabajo, por si alguna de las partes no esta muy inicia
                            en empezar este proceso.
                        </p>
                    </Container>
                    <Header as='h2' textAlign='center'>¿Cómo funciona?</Header>
                    <Container textAlign='center'>
                        <Header>Influencer</Header>
                        <p>
                            Al crearte una cuenta puedes conectar tus redes sociales principales para asi mostrar tu alcance
                            de una manera veraz.En la pantalla "contectar" podras ver las ofertas que han publicado las diversas marcas.
                            Cuando hayas realizado acciones con alguna marca podras puntuar su perfil para
                            que los demas usuarios tengan una referencia de como es trabajar con ese usuario.
                            Tambien cuando estes en medio de alguna acción podrás cambiar tu estado a "ocupado" para asi informar de tu
                            situación actual a las empresas.
                        </p>
                        <Header>Marca</Header>
                        <p>
                            Cuando hayas registrado tu marca en la web, podrás publicar las ofertas que necesites, estas con un titulo
                            y una descripción en la que podrás detallar lso objetivos. En la pantalla "conectar" podrás encontrar los
                            diversos usuarios, filtrándolos según su estado, para asi ver su perfil con sus redes principales sociales. 
                            Cuando hayas realizado acciones con alguna marca podras puntuar su perfil para
                            que los demas usuarios tengan una referencia de como es trabajar con ese usuario.
                        </p>
                    </Container>
                    <Container>
                        <Divider horizontal>
                            <Header as='h4'>
                                Encuentranos aquí
                            </Header>
                        </Divider>
                        <Grid columns='equal' >
                            <Grid.Row>
                                <Grid.Column textAlign='center'>
                                    <Icon size='big' link to='/profile' name='youtube' />
                                </Grid.Column>
                                <Grid.Column textAlign='center'>
                                    <Icon size='big' link name='twitter' />
                                </Grid.Column>
                                <Grid.Column textAlign='center'>
                                    <Icon size='big' link color='black' name='instagram' />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Container>


                </Grid.Column>
                <Grid.Column>
                </Grid.Column>
            </Grid>
        </Container>
    );
}

export default Home;