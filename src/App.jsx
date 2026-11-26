import React, { useState, useEffect } from 'react';

export default function App() {
  const [vistaActual, setVistaActual] = useState('login'); 
  const [darkMode, setDarkMode] = useState(false);
  
  // Login Interno (Admin y Tecnico)
  const [showInternalLogin, setShowInternalLogin] = useState(false);
  const [internalRoleTarget, setInternalRoleTarget] = useState(''); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [tecnicoLogueado, setTecnicoLogueado] = useState(null);

  // Portal Cliente
  const [showClientLogin, setShowClientLogin] = useState(false);
  const [clientRutInput, setClientRutInput] = useState('');
  const [clientError, setClientError] = useState(false);
  const [clienteLogueado, setClienteLogueado] = useState(null);
  const [mensajeCliente, setMensajeCliente] = useState('');

  // Recepcion
  const [rutBusqueda, setRutBusqueda] = useState('');
  const [resultadoBusqueda, setResultadoBusqueda] = useState(null);
  const [errorRut, setErrorRut] = useState('');
  const [mostrarModalQR, setMostrarModalQR] = useState(false);

  // Tecnico
  const [mostrarChecklist, setMostrarChecklist] = useState(null);
  
  // Admin / Docente
  const [ordenSeleccionadaAdmin, setOrdenSeleccionadaAdmin] = useState(null);
  const [alertaDestinatario, setAlertaDestinatario] = useState('Todos');
  const [alertaMensaje, setAlertaMensaje] = useState('');

  // Notificaciones (Global)
  const [notificaciones, setNotificaciones] = useState([
    { id: 1, remitente: "Juan Pérez (Cliente)", mensaje: "¿Estará listo mi equipo hoy en la tarde?", leido: false, tipo: 'cliente' }
  ]);
  const [mostrarNotif, setMostrarNotif] = useState(false);

  // Listas de Personal
  const tecnicosDisponibles = ["B. Moya", "L. Reyes", "C. Soto", "Sin asignar"];
  const recepcionistasDisponibles = ["A. Silva", "M. Torres", "Sin asignar"];

  // Datos simulados (Mock Data)
  const [baseDatosEquipos, setBaseDatosEquipos] = useState([
    {
      id: "1024",
      rut: "21044735-0",
      propietario: "María González",
      tipo: "Laptop",
      marca: "Lenovo ThinkPad",
      so: "Windows 10",
      estado: "En Proceso", 
      tecnico: "B. Moya",
      recepcionista: "A. Silva",
      fechaIngreso: "12/11/2026 09:15 AM",
      fallaRegistrada: "Teclado no responde (teclas A, S, D). Pantalla con línea horizontal azul.",
      diagnosticoInicial: "Posible flex de pantalla dañado. Teclado requiere reemplazo físico.",
      observacionesTecnicas: "Limpieza interna realizada. Se descarta problema de software en teclado.",
      checklistFisico: { encendido: true, puertos: true, pantalla: false, teclado: false, limpieza: true },
      checklistLogico: { virus: true, tempArchivos: true, drivers: false }
    },
    {
      id: "1025",
      rut: "19123456-7",
      propietario: "Juan Pérez",
      tipo: "PC Desktop",
      marca: "Armado (Genérico)",
      so: "Linux Ubuntu",
      estado: "Listo",
      tecnico: "L. Reyes",
      recepcionista: "M. Torres",
      fechaIngreso: "12/11/2026 10:30 AM",
      fallaRegistrada: "Polvo excesivo, ruido fuerte en ventilador.",
      diagnosticoInicial: "Requiere limpieza profunda y lubricación de coolers.",
      observacionesTecnicas: "Se aplicó limpieza y lubricación. Equipo silencioso y funcional.",
      checklistFisico: { encendido: true, puertos: true, pantalla: true, teclado: true, limpieza: true },
      checklistLogico: null
    }
  ]);

  // --- Funciones de Lógica ---
  const handleInternalLogin = (e) => {
    e.preventDefault();
    const user = username.toLowerCase();
    
    if (internalRoleTarget === 'admin') {
      if ((user === 'usuario' || user === 'pesce') && password === '1234') {
        setVistaActual('administrador');
        setShowInternalLogin(false);
        setUsername('');
        setPassword('');
        setLoginError(false);
      } else {
        setLoginError(true);
      }
    } else if (internalRoleTarget === 'tecnico') {
      if (user === 'l.reyes1' && password === '1234') {
        setTecnicoLogueado('L. Reyes');
        setVistaActual('tecnico');
        setShowInternalLogin(false);
        setUsername('');
        setPassword('');
        setLoginError(false);
      } else {
        setLoginError(true);
      }
    }
  };

  const openInternalLogin = (role) => {
    setInternalRoleTarget(role);
    setShowInternalLogin(true);
    setLoginError(false);
    setUsername('');
    setPassword('');
  };

  const handleClientLogin = (e) => {
    e.preventDefault();
    const equipo = baseDatosEquipos.find(e => e.rut === clientRutInput);
    if (equipo) {
      setClienteLogueado(equipo);
      setVistaActual('cliente');
      setShowClientLogin(false);
      setClientRutInput('');
      setClientError(false);
    } else {
      setClientError(true);
    }
  };

  const buscarRut = () => {
    setErrorRut('');
    setResultadoBusqueda(null);
    if (!rutBusqueda.includes('-') || rutBusqueda.length < 9) {
      setErrorRut('Formato de RUT inválido (ej: 12345678-9).');
      return;
    }
    const equipo = baseDatosEquipos.find(e => e.rut === rutBusqueda);
    if (equipo) {
      setResultadoBusqueda(equipo);
    } else {
      setErrorRut('RUT no registrado o no tiene equipos ingresados.');
    }
  };

  const enviarMensajeDesdeCliente = () => {
    if (!mensajeCliente) return;
    setNotificaciones([
      { id: Date.now(), remitente: clienteLogueado.propietario + " (Cliente)", mensaje: mensajeCliente, leido: false, tipo: 'cliente' },
      ...notificaciones
    ]);
    setMensajeCliente('');
    alert("Mensaje enviado exitosamente a la clínica.");
  };

  const enviarAlertaDocente = () => {
    if (!alertaMensaje) return;
    setNotificaciones([
      { id: Date.now(), remitente: "Profesor / Admin", mensaje: `[Para: ${alertaDestinatario}] - ${alertaMensaje}`, leido: false, tipo: 'admin' },
      ...notificaciones
    ]);
    setAlertaMensaje('');
    alert("Alerta/Tarea asignada exitosamente al personal.");
  };

  const actualizarPersonal = (idOrden, rol, nuevoValor) => {
    const nuevaBase = baseDatosEquipos.map(equipo => {
      if(equipo.id === idOrden) {
        return { ...equipo, [rol]: nuevoValor };
      }
      return equipo;
    });
    setBaseDatosEquipos(nuevaBase);
    setOrdenSeleccionadaAdmin(nuevaBase.find(e => e.id === idOrden));
  };

  // --- Componente Header Global para Internos ---
  const renderHeader = (titulo, colorBg) => (
    <header className={`${colorBg} text-white p-4 flex justify-between items-center shadow-md relative z-40`}>
      <h1 className="font-bold text-lg flex items-center gap-2">{titulo}</h1>
      <div className="flex items-center gap-4">
        <div className="relative">
          <button onClick={() => setMostrarNotif(!mostrarNotif)} className="text-xl relative hover:scale-110 transition">
            🔔
            {notificaciones.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-gray-900 text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {notificaciones.length}
              </span>
            )}
          </button>
          {mostrarNotif && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 p-3 z-50">
              <h3 className="font-bold text-sm border-b dark:border-gray-600 pb-2 mb-2 flex justify-between">
                Bandeja de Mensajes
                <span className="text-xs text-blue-600 dark:text-blue-400 cursor-pointer" onClick={() => setNotificaciones([])}>Limpiar</span>
              </h3>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {notificaciones.length === 0 ? (
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-4">No hay notificaciones nuevas</p>
                ) : (
                  notificaciones.map((n) => (
                    <div key={n.id} className={`p-2 rounded text-sm border-l-4 ${n.tipo === 'admin' ? 'bg-purple-50 dark:bg-purple-900/30 border-purple-500' : 'bg-blue-50 dark:bg-blue-900/30 border-blue-500'}`}>
                      <p className={`font-bold text-xs ${n.tipo === 'admin' ? 'text-purple-800 dark:text-purple-300' : 'text-blue-800 dark:text-blue-300'} flex items-center gap-1`}>
                         {n.tipo === 'admin' ? '⚠️' : '✉️'} {n.remitente}
                      </p>
                      <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">{n.mensaje}</p>
                      {n.tipo === 'cliente' && vistaActual !== 'cliente' && (
                        <div className="mt-2 flex gap-2">
                          <input type="text" placeholder="Responder..." className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded text-xs p-1 outline-none focus:ring-1 focus:ring-blue-500" />
                          <button className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">↵</button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        <button onClick={() => { 
          setVistaActual('login'); 
          setResultadoBusqueda(null); 
          setRutBusqueda(''); 
          setOrdenSeleccionadaAdmin(null);
          setTecnicoLogueado(null);
        }} className="text-sm underline">
          Salir
        </button>
      </div>
    </header>
  );

  // --- Vistas ---
  const renderLogin = () => (
    <div className="min-h-screen flex items-center justify-center p-4 relative bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Botones de acceso interno */}
      <div className="absolute top-4 right-4 z-20 flex flex-col sm:flex-row gap-2">
         <button onClick={() => openInternalLogin('tecnico')} className="bg-gray-800 dark:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-gray-900 dark:hover:bg-gray-600 transition flex items-center gap-2">
           🔧 Técnico
         </button>
         <button onClick={() => openInternalLogin('admin')} className="bg-purple-700 dark:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-purple-800 dark:hover:bg-purple-500 transition flex items-center gap-2">
           👨‍🏫 Admin
         </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-sm border-t-8 border-t-red-600 relative z-10 mt-8 transition-colors">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-1">Clínica del PC</h1>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-6 text-sm">INACAP • Ing. de Software</p>
        
        {!showInternalLogin && !showClientLogin ? (
          <div className="space-y-4">
            <button onClick={() => setVistaActual('recepcion')} className="w-full bg-red-600 text-white p-4 rounded-lg font-bold hover:bg-red-700 transition flex justify-center items-center gap-2 text-lg">
              📋 Módulo de Recepción
            </button>
            <div className="relative flex items-center py-2">
               <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
               <span className="flex-shrink-0 mx-4 text-gray-400 dark:text-gray-500 text-xs font-bold uppercase">Acceso Público</span>
               <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <button onClick={() => setShowClientLogin(true)} className="w-full bg-green-600 text-white p-4 rounded-lg font-bold hover:bg-green-700 transition flex justify-center items-center gap-2 shadow border border-green-700 dark:border-green-500">
              👤 Portal de Clientes
            </button>
          </div>
        ) : showClientLogin ? (
          <form onSubmit={handleClientLogin} className="space-y-4">
            <h2 className="text-center font-bold text-green-700 dark:text-green-400 mb-2">Acceso a Clientes</h2>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-4">Ingrese su RUT para ver el estado de su equipo o use su código QR.</p>
            {clientError && (
              <p className="text-red-500 dark:text-red-400 text-xs text-center font-bold bg-red-50 dark:bg-red-900/30 p-2 rounded">
                RUT no encontrado en el sistema.
              </p>
            )}
            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase mb-1">RUT Cliente</label>
              <input 
                type="text" 
                value={clientRutInput}
                onChange={(e) => setClientRutInput(e.target.value)}
                className="w-full border dark:border-gray-600 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 dark:bg-gray-700 dark:text-white uppercase"
                placeholder="Ej: 21044735-0"
                autoFocus
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setShowClientLogin(false)} className="w-1/3 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white p-2 rounded-lg font-bold hover:bg-gray-400 dark:hover:bg-gray-500 transition">
                Volver
              </button>
              <button type="submit" className="w-2/3 bg-green-600 text-white p-2 rounded-lg font-bold hover:bg-green-700 transition">
                Ver mi PC
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleInternalLogin} className="space-y-4">
            <h2 className={`text-center font-bold mb-2 ${internalRoleTarget === 'admin' ? 'text-purple-700 dark:text-purple-400' : 'text-gray-800 dark:text-gray-100'}`}>
              Acceso {internalRoleTarget === 'admin' ? 'Docente/Admin' : 'Técnico'}
            </h2>
            {loginError && (
              <p className="text-red-500 dark:text-red-400 text-xs text-center font-bold bg-red-50 dark:bg-red-900/30 p-2 rounded">
                Usuario o contraseña incorrectos.
              </p>
            )}
            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase mb-1">Usuario</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full border dark:border-gray-600 p-2 rounded focus:outline-none focus:ring-2 bg-gray-50 dark:bg-gray-700 dark:text-white ${internalRoleTarget === 'admin' ? 'focus:ring-purple-500' : 'focus:ring-gray-400'}`}
                placeholder={internalRoleTarget === 'admin' ? 'Ej: pesce' : 'Ej: l.reyes1'}
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase mb-1">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full border dark:border-gray-600 p-2 rounded focus:outline-none focus:ring-2 bg-gray-50 dark:bg-gray-700 dark:text-white ${internalRoleTarget === 'admin' ? 'focus:ring-purple-500' : 'focus:ring-gray-400'}`}
                placeholder="****"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setShowInternalLogin(false)} className="w-1/3 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white p-2 rounded-lg font-bold hover:bg-gray-400 dark:hover:bg-gray-500 transition">
                Volver
              </button>
              <button type="submit" className={`w-2/3 text-white p-2 rounded-lg font-bold transition ${internalRoleTarget === 'admin' ? 'bg-purple-700 hover:bg-purple-800' : 'bg-gray-800 hover:bg-gray-900 dark:bg-gray-600 dark:hover:bg-gray-500'}`}>
                Entrar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  const renderCliente = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors relative">
      <header className="bg-green-600 dark:bg-green-700 text-white p-4 flex justify-between items-center shadow-md relative z-10">
        <h1 className="font-bold text-lg flex items-center gap-2">👤 Portal de Cliente</h1>
        <button onClick={() => { setVistaActual('login'); setClienteLogueado(null); }} className="text-sm underline">Cerrar Sesión</button>
      </header>
      
      <div className="p-4 max-w-md mx-auto space-y-4 relative z-10">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-center transition-colors">
           <h2 className="text-xl font-bold text-gray-800 dark:text-white">Hola, {clienteLogueado.propietario.split(" ")[0]}</h2>
           <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Orden #{clienteLogueado.id}</p>
           
           <div className="inline-block bg-white p-2 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Orden-${clienteLogueado.id}-${clienteLogueado.rut}`} 
                alt="QR de Orden" 
                className="w-32 h-32 mx-auto"
              />
              <p className="text-xs text-gray-500 mt-2 font-bold uppercase">Tu código de retiro</p>
           </div>

           <div className="text-left bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border dark:border-gray-600">
              <p className="font-bold text-gray-700 dark:text-gray-200">{clienteLogueado.tipo} {clienteLogueado.marca}</p>
              
              <div className="mt-4">
                 <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Estado del Equipo:</p>
                 <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className={clienteLogueado.estado !== 'Recibido' ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}>Recibido</span>
                    <span className={clienteLogueado.estado === 'En Proceso' || clienteLogueado.estado === 'Listo' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}>En Proceso</span>
                    <span className={clienteLogueado.estado === 'Listo' ? 'text-green-600 dark:text-green-400 text-sm' : 'text-gray-400 dark:text-gray-500'}>¡LISTO!</span>
                 </div>
                 <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all duration-500 ${clienteLogueado.estado === 'En Proceso' ? 'bg-blue-500 w-1/2' : clienteLogueado.estado === 'Listo' ? 'bg-green-500 w-full' : 'bg-gray-400 w-1/4'}`}></div>
                 </div>
              </div>
           </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
           <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">✉️ Enviar consulta a la Clínica</h3>
           <textarea 
             value={mensajeCliente}
             onChange={(e) => setMensajeCliente(e.target.value)}
             placeholder="Ej: Necesito el equipo para el viernes..."
             className="w-full border dark:border-gray-600 p-2 rounded text-sm mb-2 focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 dark:text-white outline-none"
             rows="3"
           ></textarea>
           <button onClick={enviarMensajeDesdeCliente} className="w-full bg-green-600 dark:bg-green-700 text-white py-2 rounded font-bold hover:bg-green-700 dark:hover:bg-green-600 text-sm">
             Enviar Mensaje
           </button>
        </div>
      </div>
    </div>
  );

  const renderRecepcion = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors relative">
      {renderHeader("📋 Recepción", "bg-red-600 dark:bg-red-700")}
      <div className="p-4 max-w-md mx-auto space-y-4 relative z-10">
        
        <button className="w-full bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-2 border-red-600 dark:border-red-500 border-dashed p-4 rounded-xl font-bold text-lg flex flex-col items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/40 transition shadow-sm">
          <span className="text-3xl mb-1">📱</span>
          Escanear QR de Retiro
        </button>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <h2 className="font-bold text-gray-700 dark:text-gray-200 mb-2">Búsqueda de Propietario (RUT)</h2>
          <div className="flex gap-2 mb-2">
            <input 
              type="text" 
              value={rutBusqueda}
              onChange={(e) => setRutBusqueda(e.target.value)}
              placeholder="Ej: 21044735-0" 
              className="border dark:border-gray-600 p-2 rounded w-full bg-gray-50 dark:bg-gray-700 dark:text-white uppercase outline-none focus:ring-2 focus:ring-red-500" 
            />
            <button onClick={buscarRut} className="bg-gray-800 dark:bg-gray-600 text-white px-4 py-2 rounded font-semibold">Buscar</button>
          </div>
          
          {errorRut && (
             <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg border border-red-200 dark:border-red-800/50 text-sm font-bold flex items-start gap-2">
               <span>⚠️</span> {errorRut}
             </div>
          )}
        </div>

        {resultadoBusqueda && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border-2 border-green-500 dark:border-green-600 relative transition-colors">
            <div className="flex justify-between items-center mb-3 border-b dark:border-gray-700 pb-2">
              <h3 className="font-bold text-green-700 dark:text-green-400">✅ Propietario Encontrado</h3>
              <span className="text-xs bg-gray-100 dark:bg-gray-700 dark:text-gray-300 px-2 py-1 rounded font-bold">{resultadoBusqueda.rut}</span>
            </div>
            
            <p className="font-bold text-lg mb-1 dark:text-white">{resultadoBusqueda.propietario}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Ingreso: {resultadoBusqueda.fechaIngreso}</p>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded border dark:border-gray-600 mb-4">
              <p className="font-bold text-sm text-gray-800 dark:text-gray-200 mb-1">{resultadoBusqueda.marca} ({resultadoBusqueda.tipo})</p>
              <span className="inline-block bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded font-bold mb-2">Estado: {resultadoBusqueda.estado}</span>
              <p className="text-xs text-red-600 dark:text-red-400 font-semibold bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-100 dark:border-red-800/40">
                Falla: {resultadoBusqueda.fallaRegistrada}
              </p>
            </div>
            
            <button onClick={() => setMostrarModalQR(true)} className="w-full bg-green-600 text-white p-3 rounded font-bold hover:bg-green-700 transition flex items-center justify-center gap-2">
              Generar Recibo / QR de Retiro
            </button>
          </div>
        )}

        {/* Modal de QR de Recibo */}
        {mostrarModalQR && resultadoBusqueda && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
             <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl max-w-sm w-full text-center">
                <h3 className="font-bold text-lg mb-1 dark:text-white">Recibo de Ingreso</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Orden #{resultadoBusqueda.id}</p>
                
                <div className="bg-white p-2 inline-block rounded">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Orden-${resultadoBusqueda.id}-${resultadoBusqueda.rut}`} 
                    alt="QR Cliente" 
                    className="w-48 h-48 mx-auto"
                  />
                </div>
                
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-4 px-2">
                  El cliente puede escanear este código o ingresar al <b>Portal de Clientes</b> con su RUT para ver el estado de la reparación.
                </p>

                <div className="mt-6 flex flex-col gap-2">
                  <button className="w-full bg-blue-600 text-white p-2 rounded font-bold text-sm">Compartir por WhatsApp</button>
                  <button onClick={() => setMostrarModalQR(false)} className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white p-2 rounded font-bold text-sm">Cerrar</button>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderTecnico = () => {
    const equiposAsignados = baseDatosEquipos.filter(e => e.tecnico === tecnicoLogueado);

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors relative">
        {renderHeader(`🔧 Panel Técnico - ${tecnicoLogueado}`, "bg-gray-800 dark:bg-gray-950")}
        <div className="p-4 max-w-md mx-auto space-y-4 relative z-10">
          {!mostrarChecklist ? (
            <>
              <h2 className="font-bold text-gray-700 dark:text-gray-200 border-b dark:border-gray-700 pb-2">Mis Órdenes Asignadas</h2>
              {equiposAsignados.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No tienes equipos asignados en este momento.</p>
              ) : (
                equiposAsignados.map(equipo => (
                  <div key={equipo.id} className={`bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 border-l-4 ${equipo.so.includes('Linux') ? 'border-l-gray-500' : 'border-l-red-500'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold dark:text-white">Orden #{equipo.id}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{equipo.tipo} - <span className={equipo.so.includes('Linux') ? 'font-bold text-red-600 dark:text-red-400' : ''}>{equipo.so}</span></p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded font-bold ${equipo.estado === 'En Proceso' ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-400' : equipo.estado === 'Listo' ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                        {equipo.estado}
                      </span>
                    </div>
                    {equipo.so.includes('Linux') && (
                      <p className="text-xs text-red-600 dark:text-red-400 mb-2 font-semibold bg-red-50 dark:bg-red-900/20 p-1 rounded">⚠️ Regla: Mantención lógica bloqueada.</p>
                    )}
                    <button onClick={() => setMostrarChecklist(equipo)} className="w-full mt-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 rounded font-semibold transition text-sm">
                      Abrir Checklist
                    </button>
                  </div>
                ))
              )}
            </>
          ) : (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
              <button onClick={() => setMostrarChecklist(null)} className="text-sm text-blue-600 dark:text-blue-400 font-bold mb-4 flex items-center gap-1">
                ← Volver a órdenes
              </button>
              <h2 className="font-bold text-xl mb-1 dark:text-white">Orden #{mostrarChecklist.id}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{mostrarChecklist.marca} - {mostrarChecklist.so}</p>
              
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-100 dark:border-red-800/40 mb-4">
                 <h3 className="font-bold text-red-700 dark:text-red-400 text-sm mb-1">Fallas Previas Reportadas:</h3>
                 <p className="text-xs dark:text-gray-300">{mostrarChecklist.fallaRegistrada}</p>
              </div>

              <h3 className="font-bold text-gray-700 dark:text-gray-200 border-b dark:border-gray-700 pb-1 mb-2">Checklist Físico</h3>
              <div className="space-y-2 mb-4 dark:text-gray-300">
                 <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked={mostrarChecklist.checklistFisico.encendido}/> Prueba de Encendido</label>
                 <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked={mostrarChecklist.checklistFisico.puertos}/> Revisión Puertos USB</label>
                 <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked={mostrarChecklist.checklistFisico.teclado}/> Revisión Teclado</label>
                 <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked={mostrarChecklist.checklistFisico.limpieza}/> Limpieza Interna</label>
              </div>

              {mostrarChecklist.checklistLogico ? (
                <>
                  <h3 className="font-bold text-gray-700 dark:text-gray-200 border-b dark:border-gray-700 pb-1 mb-2">Checklist Lógico</h3>
                  <div className="space-y-2 mb-4 dark:text-gray-300">
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked={mostrarChecklist.checklistLogico.virus}/> Escaneo Antivirus</label>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked={mostrarChecklist.checklistLogico.tempArchivos}/> Limpieza Archivos Temp (Regla Privacidad)</label>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked={mostrarChecklist.checklistLogico.drivers}/> Actualización Drivers</label>
                  </div>
                </>
              ) : (
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-center text-sm font-bold text-gray-500 dark:text-gray-400 mb-4">
                     Mantención Lógica Deshabilitada (Linux)
                  </div>
              )}
              
              <div className="mb-4">
                <label className="block font-bold text-sm mb-1 dark:text-gray-200">Observaciones del Técnico</label>
                <textarea className="w-full border dark:border-gray-600 rounded p-2 text-sm bg-white dark:bg-gray-700 dark:text-white" rows="3" defaultValue={mostrarChecklist.observacionesTecnicas}></textarea>
              </div>

              <button className="w-full bg-red-600 text-white font-bold p-3 rounded hover:bg-red-700">
                 Guardar y Marcar Listo
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAdministrador = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors relative">
      {renderHeader("👨‍🏫 Panel Docente (Control Total)", "bg-purple-700 dark:bg-purple-800")}
      <div className="p-4 max-w-md mx-auto space-y-4 relative z-10">
        {!ordenSeleccionadaAdmin ? (
          <>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-purple-200 dark:border-purple-800/50 transition-colors">
               <h3 className="font-bold text-purple-800 dark:text-purple-400 mb-3 flex items-center gap-2">📢 Asignar Tarea o Alerta al Personal</h3>
               <div className="flex gap-2 mb-2">
                 <select 
                   value={alertaDestinatario}
                   onChange={(e) => setAlertaDestinatario(e.target.value)}
                   className="w-1/3 border dark:border-gray-600 p-2 rounded text-sm bg-gray-50 dark:bg-gray-700 dark:text-white outline-none"
                 >
                   <option value="Todos">Todos</option>
                   <option value="Recepción">Recepción</option>
                   <option value="Técnicos">Técnicos</option>
                   <optgroup label="Técnicos Específicos">
                     {tecnicosDisponibles.filter(t => t !== 'Sin asignar').map(t => <option key={t} value={t}>{t}</option>)}
                   </optgroup>
                 </select>
                 <input 
                   type="text"
                   value={alertaMensaje}
                   onChange={(e) => setAlertaMensaje(e.target.value)}
                   placeholder="Mensaje o instrucción..."
                   className="w-2/3 border dark:border-gray-600 p-2 rounded text-sm bg-gray-50 dark:bg-gray-700 dark:text-white outline-none"
                 />
               </div>
               <button onClick={enviarAlertaDocente} className="w-full bg-purple-600 dark:bg-purple-700 text-white py-2 rounded font-bold hover:bg-purple-700 dark:hover:bg-purple-600 text-sm">
                 Enviar Notificación Push
               </button>
            </div>

            <h2 className="font-bold text-gray-700 dark:text-gray-200 border-b dark:border-gray-700 pb-2 mt-6">Gestión de Equipos y Asignaciones</h2>
            
            {baseDatosEquipos.map(equipo => (
               <div key={equipo.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 border-l-4 border-l-purple-500 transition-colors">
                 <div className="flex justify-between items-start mb-2">
                   <div>
                     <p className="font-bold dark:text-white">Orden #{equipo.id}</p>
                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                       <span className="font-bold">Técnico:</span> {equipo.tecnico} <br/>
                       <span className="font-bold">Recepcionista:</span> {equipo.recepcionista}
                     </p>
                   </div>
                   <span className={`text-xs px-2 py-1 rounded font-bold ${equipo.estado === 'En Proceso' ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-400' : 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-400'}`}>{equipo.estado}</span>
                 </div>
                 <button onClick={() => setOrdenSeleccionadaAdmin(equipo)} className="w-full bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800/40 text-xs font-bold py-2 rounded hover:bg-purple-100 dark:hover:bg-purple-900/40 mt-2 transition">
                   Gestionar Orden y Personal
                 </button>
               </div>
            ))}
          </>
        ) : (
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg border border-purple-300 dark:border-purple-800/50 transition-colors">
             <button onClick={() => setOrdenSeleccionadaAdmin(null)} className="text-sm text-purple-600 dark:text-purple-400 font-bold mb-4 flex items-center gap-1">
              ← Volver a supervisión
            </button>
            <h2 className="text-xl font-black text-gray-800 dark:text-white border-b-2 border-purple-600 dark:border-purple-500 pb-2 mb-4 flex justify-between items-center">
              Expediente #{ordenSeleccionadaAdmin.id}
              {ordenSeleccionadaAdmin.estado === 'Listo' && <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">COMPLETADO</span>}
            </h2>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800/40 mb-6">
               <h3 className="text-sm text-purple-800 dark:text-purple-400 font-bold mb-3 flex items-center gap-2">
                 ⚙️ Control de Personal (Privilegio Admin)
               </h3>
               <div className="space-y-3">
                 <div>
                   <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase mb-1">Técnico a cargo de la reparación</label>
                   <select 
                     className="w-full border dark:border-gray-600 p-2 rounded text-sm bg-white dark:bg-gray-700 dark:text-white outline-none"
                     value={ordenSeleccionadaAdmin.tecnico}
                     onChange={(e) => actualizarPersonal(ordenSeleccionadaAdmin.id, 'tecnico', e.target.value)}
                   >
                     {tecnicosDisponibles.map(tec => <option key={tec} value={tec}>{tec}</option>)}
                   </select>
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase mb-1">Recepcionista responsable</label>
                   <select 
                     className="w-full border dark:border-gray-600 p-2 rounded text-sm bg-white dark:bg-gray-700 dark:text-white outline-none"
                     value={ordenSeleccionadaAdmin.recepcionista}
                     onChange={(e) => actualizarPersonal(ordenSeleccionadaAdmin.id, 'recepcionista', e.target.value)}
                   >
                     {recepcionistasDisponibles.map(rec => <option key={rec} value={rec}>{rec}</option>)}
                   </select>
                 </div>
               </div>
            </div>

            <div className="space-y-4 text-sm">
               <div>
                 <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Cliente (RUT)</p>
                 <p className="font-semibold text-lg dark:text-white">{ordenSeleccionadaAdmin.propietario} ({ordenSeleccionadaAdmin.rut})</p>
               </div>
               
               <div className="grid grid-cols-2 gap-2 bg-gray-50 dark:bg-gray-700 p-3 rounded border dark:border-gray-600">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Equipo</p>
                    <p className="font-semibold dark:text-white">{ordenSeleccionadaAdmin.tipo} {ordenSeleccionadaAdmin.marca}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">S. Operativo</p>
                    <p className="font-semibold dark:text-white">{ordenSeleccionadaAdmin.so}</p>
                  </div>
               </div>

               <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-200 dark:border-red-800/40">
                 <p className="text-xs text-red-600 dark:text-red-400 uppercase font-black mb-1">Falla Registrada por Cliente</p>
                 <p className="font-medium text-gray-800 dark:text-gray-200">{ordenSeleccionadaAdmin.fallaRegistrada}</p>
               </div>

               <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded border border-yellow-200 dark:border-yellow-800/40">
                 <p className="text-xs text-yellow-700 dark:text-yellow-500 uppercase font-black mb-1">Diagnóstico Inicial de Recepción</p>
                 <p className="font-medium text-gray-800 dark:text-gray-200">{ordenSeleccionadaAdmin.diagnosticoInicial}</p>
               </div>

               <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded border border-gray-300 dark:border-gray-600">
                 <p className="text-xs text-gray-700 dark:text-gray-300 uppercase font-black mb-1">Observaciones del Técnico ({ordenSeleccionadaAdmin.tecnico})</p>
                 <p className="font-medium text-gray-800 dark:text-gray-200">{ordenSeleccionadaAdmin.observacionesTecnicas || "Sin observaciones registradas aún."}</p>
               </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="font-sans text-gray-800 dark:text-gray-100 relative min-h-screen transition-colors">
        
        {/* Switch flotante de Dark Mode */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="fixed bottom-6 right-6 p-4 rounded-full bg-gray-800 dark:bg-yellow-400 text-white dark:text-gray-900 shadow-xl z-50 hover:scale-110 transition-transform flex items-center justify-center text-xl"
          title={darkMode ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>

        {/* Marca de agua global de INACAP */}
        <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none opacity-[0.05] dark:opacity-[0.02]">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/b/b3/INACAP_logo.svg" 
            alt="INACAP Watermark" 
            className="w-full max-w-md px-4 grayscale dark:invert"
          />
        </div>

        {vistaActual === 'login' && renderLogin()}
        {vistaActual === 'cliente' && renderCliente()}
        {vistaActual === 'recepcion' && renderRecepcion()}
        {vistaActual === 'tecnico' && renderTecnico()}
        {vistaActual === 'administrador' && renderAdministrador()}
      </div>
    </div>
  );
}
