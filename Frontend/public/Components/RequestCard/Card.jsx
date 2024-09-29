import React, { useState } from 'react';
import styles from './Card.module.css';

const Card = ({ solicitud, updateSolicitudes, delay}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [modalAction, setModalAction] = useState(null); // Para determinar si es aceptar o rechazar
  const ipserver = import.meta.env.VITE_IP;
  const port = import.meta.env.VITE_PORT; 

  const handleViewPDF = async () => {
    const id = solicitud.ID_request;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://${ipserver}:${port}/viewPDF/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Error: ${response.status} ${response.statusText}. ${errorData}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');

    } catch (error) {
      console.error('Error al obtener el PDF:', error.message);
    }
  };

  const handleViewPUB = async () => {
    const id = solicitud.ID_request;
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`http://${ipserver}:${port}/viewPUB/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Error: ${response.status} ${response.statusText}. ${errorData}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');

    } catch (error) {
        console.error('Error al obtener el archivo .pub:', error.message);
    }
  };

  const handleAccept = () => {
    setModalAction('accept'); 
    setIsModalOpen(true); 
  };

  const handleReject = () => {
    setModalAction('reject'); 
    setIsModalOpen(true); 
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault(); 
    const action = modalAction === 'accept' ? 'aceptado' : 'rechazado'; // Determina la acción

    const requestBody = {
      nombre: solicitud.nombre,
      email: solicitud.email,
      accion: action,
      comentario: inputText, 
    };

    try {
        const response = await fetch(`http://${ipserver}:${port}/api/command/new-user-creation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(requestBody),
        });

        if (response.ok) {
            console.log('Solicitud procesada exitosamente');
            updateSolicitudes({ ...solicitud, estado: action });
        } else {
            const errorData = await response.text();
            console.error('Error al procesar la solicitud:', errorData);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error.message);
    }

    setInputText(''); 
    setIsModalOpen(false); 
};

  return (
    <div className={styles.card} style={{ '--animationDelay': delay }}>
      <div>
        <h3 className={styles.title}>Nombre: {solicitud.nombre}</h3>
        <p className={styles.info}><strong>Email:</strong> {solicitud.email}</p>
        <p className={styles.info}><strong>Institución:</strong> {solicitud.institucion}</p>
        <p className={styles.info}><strong>Estado:</strong> {solicitud.estado}</p>
        <p className={styles.info}><strong>Fecha:</strong> {solicitud.fecha}</p>
      </div>
      <div className={styles.files}>
        <button
          className={styles.fileButton}
          title="Ver PDF"
          onClick={handleViewPDF}
        >
          <img
            src="/icons/pdf-icon.svg"
            alt="Ver PDF"
            className={styles.fileIcon}
          />
        </button>
        <button
          className={styles.fileButton}
          title="Ver PUB"
          onClick={handleViewPUB}
        >
          <img
            src="/icons/pub_icon.svg"
            alt="Ver PUB"
            className={styles.fileIcon}
          />
        </button>
      </div>
      {solicitud.estado === 'pendiente' && (
        <div className={styles.actions}>
          <button className={styles.actionButton} onClick={handleAccept}>
            Aceptar
          </button>
          <button className={styles.actionButton} onClick={handleReject}>
            Rechazar
          </button>
        </div>
      )}
      
      {/* Modal para ingresar texto */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>{modalAction === 'accept' ? 'Ingrese SSH' : 'Motivo de rechazo'}</h2>
            <form onSubmit={handleModalSubmit}>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows="4"
                placeholder="Escriba su comentario aquí..."
                required
              />
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit">Enviar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
