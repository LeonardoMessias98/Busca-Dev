import React, {useState, useEffect} from 'react';
import api from './services/api';

import './global.css';
import './SideBar.css';
import './Main.css';
import './App.css';





function App() {
  const [devs,setDevs] = useState([]);

  const [github_username, setGithub_username] = useState('');
  const [techs, setTechs] = useState('');

  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position)=>{
        const { latitude, longitude} = position.coords;

        setLatitude(latitude);
        setLongitude(longitude);
      },
      (err) => {
        console.log(err)
      },
      {
        timeout:30000,
      }
  
  
    )
  },[])

  useEffect(() => {
    
    async function loadDevs(){
      const response = await api.get('/devs');

      setDevs(response.data);
    }
    loadDevs();
  }, [])


  async function handleAddDev(e){
    e.preventDefault();

    const response = await api.post('/devs',{
      github_username,
      techs,
      latitude,
      longitude,
    })
    setGithub_username('');
    setTechs('');

    setDevs([...devs,response.data])
  }

  return (
      <div id='App'>
        <aside>
          <strong>Cadastrar</strong>
            <form onSubmit = {handleAddDev}>
              <div className='input-block'>
              <label htmlFor='github_username'>Usuário do Github</label>
              <input 
              name='github_username' 
              id='github_username' 
              value={github_username}
              onChange ={e => setGithub_username(e.target.value)} 
              required
              />
              </div>

              <div className='input-block'>
              <label htmlFor='techs'>Tecnologias</label>
              <input 
              name='techs' 
              id='techs'
              value={techs}
              onChange ={e => setTechs(e.target.value)} 
              required
              />
              </div>

              <div className="input-group">
                <div className='input-block'>
                  <label htmlFor='latitude'>Latitude</label>
                  <input 
                  type='number' 
                  name='latitude' 
                  id='latitude' 
                  value={latitude} 
                  required
                  onChange ={e => setLatitude(e.target.value)}
                  />

                  
                </div>
                <div className='input-block'>
                  <label htmlFor='longitude'>Longitude</label>
                  <input 
                  type='number' 
                  name='longitude' 
                  id='longitude' 
                  value={longitude} 
                  required
                  onChange ={e => setLongitude(e.target.value)}
                  />
                </div>
              </div>

              
              <button type="submit">Salvar</button>
            </form>
        </aside>
        <main>
          <ul>
            {devs.map(dev => {
              return(
                <li key={dev.id} className="dev-item">
                  <header>
                    <img id="avatar_img" src={dev.avatar_url} alt={dev.name}></img>
                    <div className="user-info">
                      <strong>{dev.name}</strong>
                      <span>{dev.techs.join(', ')}</span>
                    </div>
                  </header>
                  <p>{dev.bio}</p>
                  <a href={`https://github.com/${dev.github_username}`} target='_blank'>Acessar Perfil no Github</a>
                </li>)
              })}
            

                        
          </ul>
        </main>

      </div>
    )


}

export default App;
