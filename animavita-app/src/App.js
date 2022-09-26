import './App.css';
import React, { useEffect, useState } from 'react';
import SearchInput from './SearchInput';

// deixei 3 anime por página para ficar melhor 'encaixado' no layout
const pageSize = 3;
let offset = 0;
let totalPages = null;

let isLoading = false;
export default function App() {

  const kitsuApiEndpoint = 'https://kitsu.io/api/edge'
  const animeApiEndpoint = '/anime';
  // As imagens dos personagens estão com problemas de renderização por isso utilizei o endpoint dos animes
  const characterApiEndpoint = '/characters';

  const [result, setResult] = useState({ });
  const [text, setText] = useState('');


  useEffect(() => {
    setResult({});
    isLoading = true;
    offset = 0;
    let params = `page[limit]=${pageSize}&page[offset]=${offset}`;
    if (text)
      params += `&filter[text]='${text}'`;
    
    fetch(`${kitsuApiEndpoint}${animeApiEndpoint}?${params}`)
      .then((response) => response.json())
      .then((response) => {
        setResult(response);
        totalPages = response.meta.count / pageSize;
        isLoading = false;
      }).catch(() => {
        alert(`Ocorreu um erro ao carregar os dados!`);
        isLoading = false;
      });
  }, [ text ]);

  function pageBack () {
    if (offset > pageSize) offset -= pageSize;
    if (offset < pageSize || offset < 0) offset = 3;
    updateData();
  } 

  function pageNext() {
    if (totalPages && totalPages !== null) {
      if (offset < totalPages)
        offset = offset + pageSize;
    } else {
      offset = offset + pageSize;
    }
    updateData();
  }

  function updateData() {
    setResult({});
    isLoading = true;
    let params = `page[limit]=${pageSize}&page[offset]=${offset}`;
    if (text)
      params += `&filter[text]='${text}'`;
    
    fetch(`${kitsuApiEndpoint}${animeApiEndpoint}?${params}`)
      .then((response) => response.json())
      .then((response) => {
        setResult(response);
        totalPages = response.meta.count / pageSize;
        isLoading = false;
      }).catch(() => {
        alert(`Ocorreu um erro ao carregar os dados!`);
        isLoading = false;
      });
  }

  return (
    <div className="App container-fluid">
      <div className="row p-2" style={{height: "12vh"}}>
        <div className="mt-xs-1 mt-sm-1 mt-md-1 mt-lg-4 mt-xl-4 col-xs-12 col-sm-12 col-md-12 col-lg-2 col-xl-2">
          <p className="text-center h1">AnimaVita</p>
        </div>
        <div className="mt-xs-1 mt-sm-1 mt-md-1 mt-lg-4 mt-xl-4 col-xs-10 col-sm-10 col-md-10 col-lg-2 col-xl-2 offset-lg-6 offset-xl-6">
          <SearchInput value = { text } onChange = { (search) => setText(search) }></SearchInput>
        </div>
        <div className="col-2 mt-xs-1 mt-sm-1 mt-md-1 mt-lg-4 mt-xl-4">
          <div className="btn-group" role="group">
            <ul className="pagination">
              <li className="page-item"><a className="page-link" href="#" onClick={ () => pageBack() }>Anterior</a></li>
              <li className="page-item"><a className="page-link" href="#" onClick={ () => pageNext() }>Próxima</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-2 m-xs-5 m-sm-5" style={{height: "60vh"}}>
        {isLoading && (
          <div className="row p-2 text-center">
            <p>Carregando dados...</p>
            <p><span class="loader"></span></p>
          </div>
        )}
        {!isLoading && !result.data && (<div className="row p-2 text-center"><p>Ocorreu um erro ao carregar os dados!</p></div>)}
        {!isLoading && result.data && result.data.length <= 0 && (<div className="row p-2 text-center"><p>Nenhum dado encontrado!</p></div>)}
        {!isLoading && result.data && (
          <div className="row text-center">
            {result.data.map((item) => (
              <div key={item.id} className="col-xs-11 col-sm-11 col-md-11 col-xl-3 div-anime">
                <img
                  className="img-fluid rounded img-anime"
                  src={item.attributes.posterImage ? item.attributes.posterImage.small : ''}
                  alt={item.attributes.canonicalTitle}
                />
                <div className='anime-info ml-1 mr-1'>
                  <div className='anime-name h2'>{item.attributes.canonicalTitle}</div>
                  <div className='anime-desc lead'>{item.attributes.description}</div>
                </div>
                
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}