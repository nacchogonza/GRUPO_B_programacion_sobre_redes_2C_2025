import { useState, useEffect } from 'react';

function App() {
  const [etapa, setEtapa] = useState('inicio');
  const [explicacion, setExplicacion] = useState('');

  const iniciarSimulacion = () => {
    setEtapa('enviando');
  };

  const continuarSimulacion = () => {
    switch (etapa) {
      case 'enviando':
        setEtapa('en-router1');
        break;
      case 'en-router1':
        setEtapa('en-router2');
        break;
      case 'en-router2':
        setEtapa('llegando-servidor');
        break;
      case 'llegando-servidor':
        setEtapa('fragmentando');
        break;
      case 'fragmentando':
        setEtapa('devolviendo');
        break;
      case 'devolviendo':
        setEtapa('reensamblando');
        break;
      case 'reensamblando':
        setEtapa('enviando-a-usuario2');
        break;
      case 'enviando-a-usuario2':
        setEtapa('recibiendo');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    switch (etapa) {
      case 'inicio':
        setExplicacion('Capa de Aplicación: El usuario solicita un video de YouTube.');
        break;
      case 'enviando':
        setExplicacion('Capa de Transporte: El sistema operativo recibe la petición y la empaqueta en segmentos TCP.');
        break;
      case 'en-router1':
        setExplicacion('Capa de Red: Los routers actúan como un sistema de correos, buscando la mejor ruta.');
        break;
      case 'en-router2':
        setExplicacion('Capa de Enlace: El paquete viaja entre los enlaces de la red (fibra, WiFi, etc.).');
        break;
      case 'llegando-servidor':
        setExplicacion('El servidor recibe el paquete y el proceso se invierte.');
        break;
      case 'fragmentando':
        setExplicacion('El video se fragmenta en nuevos paquetes de respuesta para el usuario.');
        break;
      case 'devolviendo':
        setExplicacion('Los paquetes se devuelven al usuario a través de la red, posiblemente tomando rutas diferentes.');
        break;
      case 'reensamblando':
        setExplicacion('El dispositivo del usuario reensambla los paquetes, y el video es reproducido.');
        break;
      case 'enviando-a-usuario2':
        setExplicacion('El usuario comparte el video con un amigo, iniciando un nuevo viaje de datos.');
        break;
      case 'recibiendo':
        setExplicacion('El paquete de video llega al segundo usuario, y el ciclo de la red se repite.');
        break;
      default:
        break;
    }
  }, [etapa]);

  const resetSimulacion = () => {
    setEtapa('inicio');
  };

  const getPaquetePosition = () => {
    switch(etapa) {
      case 'inicio':
        return 'left-[5%] top-[30%] animate-pulse opacity-100';
      case 'enviando':
        return 'left-[35%] top-[50%] opacity-100';
      case 'en-router1':
        return 'left-[50%] top-[50%] opacity-100';
      case 'en-router2':
        return 'left-[65%] top-[50%] opacity-100';
      case 'llegando-servidor':
        return 'left-[80%] top-[50%] opacity-100';
      case 'fragmentando':
      case 'devolviendo':
      case 'reensamblando':
      case 'enviando-a-usuario2':
      case 'recibiendo':
        return 'opacity-0';
      default:
        return 'opacity-0';
    }
  };

  const paquetesFragmentados = [
    { id: 1, pos: 'top-[40%] left-[65%]' },
    { id: 2, pos: 'top-[50%] left-[45%]' },
    { id: 3, pos: 'top-[60%] left-[65%]' },
    { id: 4, pos: 'top-[50%] left-[45%]' },
  ];

  const getFragmentoPosition = (pos) => {
    switch (etapa) {
      case 'fragmentando':
        return `${pos} opacity-100 animate-pulse transition-all duration-1500 ease-in-out`;
      case 'devolviendo':
        return `top-[30%] left-[15%] opacity-100 transition-all duration-1500 ease-in-out`;
      case 'reensamblando':
        return `top-[30%] left-[15%] opacity-100 transition-all duration-1500 ease-in-out`;
      default:
        return 'opacity-0';
    }
  };

  const getSharedPacketPosition = () => {
    switch(etapa) {
      case 'enviando-a-usuario2':
        return 'left-[35%] top-[50%] opacity-100';
      case 'recibiendo':
        return 'left-[5%] top-[80%] opacity-100';
      default:
        return 'opacity-0';
    }
  };
  
  const getLineColor = (lineEtapa) => {
    switch (lineEtapa) {
      case 'enviando-a-usuario2-line':
        return etapa === 'enviando-a-usuario2' || etapa === 'recibiendo' ? 'border-blue-500' : 'border-gray-500';
      default:
        return etapa === lineEtapa ? 'border-blue-500' : 'border-gray-500';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-10 bg-gray-900 text-white">
      
      {/* Título de la Presentación */}
      <h1 className="text-4xl font-bold mb-4">El Viaje de los Datos</h1>
      <p className="text-lg text-center max-w-2xl mb-8">
        Visualización interactiva del tráfico de datos en una red (Modelo TCP/IP).
      </p>

      {/* Contenedor de la Simulación */}
      <div className="relative w-full max-w-5xl h-[500px] p-6 border-2 border-gray-700 rounded-lg shadow-lg bg-gray-800 flex justify-between items-center mx-auto">
        
        {/* Network Lines */}
        <div className={`absolute left-[5%] top-[30%] w-[10%] h-px border-t-2 border-dotted transition-colors duration-1000 ${getLineColor('enviando')}`}></div>
        <div className={`absolute left-[15%] top-[50%] h-px w-[20%] border-t-2 border-dotted transition-colors duration-1000 ${getLineColor('en-router1')}`}></div>
        <div className={`absolute left-[35%] top-[50%] h-px w-[15%] border-t-2 border-dotted transition-colors duration-1000 ${getLineColor('en-router2')}`}></div>
        <div className={`absolute left-[50%] top-[50%] h-px w-[15%] border-t-2 border-dotted transition-colors duration-1000 ${getLineColor('llegando-servidor')}`}></div>
        <div className={`absolute left-[65%] top-[50%] h-px w-[15%] border-t-2 border-dotted transition-colors duration-1000 ${getLineColor('devolviendo')}`}></div>
        <div className={`absolute left-[80%] top-[50%] h-px w-[15%] border-t-2 border-dotted transition-colors duration-1000 ${getLineColor('reensamblando')}`}></div>
        <div className={`absolute left-[35%] top-[50%] h-[30%] w-px border-l-2 border-dotted transition-colors duration-1000 ${getLineColor('enviando-a-usuario2-line')}`}></div>
        
        {/* Sender User */}
        <div className="flex flex-col items-center z-10 absolute left-[5%] top-[30%] transform -translate-x-1/2 -translate-y-1/2">
          <span className="text-6xl mb-2">🧑🏾‍💻</span>
          <p className="text-xl font-semibold">Usuario 1</p>
          <p className="text-sm text-gray-400">Petición / Recepción</p>
        </div>
        
        {/* Intermediate Routers */}
        <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
          <span className="text-5xl mb-2">📡</span>
          <p className="text-sm text-gray-400">Router</p>
        </div>

        <div className="absolute top-[50%] left-[65%] transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
          <span className="text-5xl mb-2">📡</span>
          <p className="text-sm text-gray-400">Router</p>
        </div>

        {/* Destination Server */}
        <div className="flex flex-col items-center z-10 absolute right-[5%] top-1/2 transform translate-x-1/2 -translate-y-1/2">
          <span className="text-6xl mb-2">🌐</span>
          <p className="text-xl font-semibold">Servidor Web</p>
          <p className="text-sm text-gray-400">Respuesta</p>
        </div>
        
        {/* Data Packet */}
        <div className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1500 ease-in-out ${getPaquetePosition()}`}>
          <span className="text-4xl">📦</span>
        </div>

        {/* Shared Packet */}
        <div className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1500 ease-in-out ${getSharedPacketPosition()}`}>
          <span className="text-4xl">📦</span>
        </div>
        
        {/* Fragmented Packets */}
        {paquetesFragmentados.map(paquete => (
          <div
            key={paquete.id}
            className={`absolute z-10 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1500 ease-in-out ${getFragmentoPosition(paquete.pos)}`}
          >
            <span className="text-2xl">📦</span>
          </div>
        ))}

        {/* Receiver User */}
        <div className="flex flex-col items-center z-10 absolute left-[5%] top-[80%] transform -translate-x-1/2 -translate-y-1/2">
          <span className="text-6xl mb-2">🧑‍💻</span>
          <p className="text-xl font-semibold">Usuario 2</p>
          <p className="text-sm text-gray-400">Recepción</p>
        </div>
        
      </div>
      
      {/* Explanation Panel */}
      <div className={`mt-8 w-full max-w-5xl p-6 border-2 border-gray-700 rounded-lg shadow-lg bg-gray-800 text-center transition-opacity duration-500 ${etapa === 'inicio' ? 'opacity-100' : 'opacity-100'}`}>
        <h2 className="text-2xl font-semibold mb-4">Explicación</h2>
        <p>{explicacion}</p>
      </div>

      {/* Buttons Panel */}
      <div className="mt-8">
        {etapa === 'inicio' ? (
          <button 
            onClick={iniciarSimulacion}
            className="px-6 py-3 bg-blue-600 rounded-lg font-bold hover:bg-blue-700 transition-colors">
            Iniciar Simulación
          </button>
        ) : etapa === 'recibiendo' ? (
          <button 
            onClick={resetSimulacion}
            className="px-6 py-3 bg-red-600 rounded-lg font-bold hover:bg-red-700 transition-colors">
            Reiniciar
          </button>
        ) : (
          <button 
            onClick={continuarSimulacion}
            className="px-6 py-3 bg-blue-600 rounded-lg font-bold hover:bg-blue-700 transition-colors animate-pulse">
            Continuar
          </button>
        )}
      </div>

    </div>
  );
}

export default App;