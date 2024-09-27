import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { jwtDecode } from 'jwt-decode';
const useForm = (initialData) => {
  const [form, setForm] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState(''); // Para almacenar el mensaje del servidor
  const navigate = useNavigate();

  const apiKey = import.meta.env.VITE_API_KEY;
  const port = import.meta.env.VITE_PORT;
  const ipserver = import.meta.env.VITE_IP;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    form.email = form.email.toLowerCase();
    const jsonString = JSON.stringify(form);
    console.log(jsonString); // {"email":"ejemplo@gmail.com","password":"contraseña"}

    fetch(`http://${ipserver}:${port}/api/command/login`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      method: 'POST',
      body: jsonString,
      
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        setErrors({ server: data.error });
      } else {
        if (data.token) {
          localStorage.setItem('refreshToken',data.refreshToken);
          // Guardar el token en localStorage
          localStorage.setItem('token', data.token);
          const decodedToken = jwtDecode(data.token);
          console.log(decodedToken);
          if(decodedToken.rol === 'Administrador'){
            localStorage.setItem('rol', 'Administrador');
            localStorage.setItem('username', decodedToken.username);
            navigate('/dashboard');
          } else if (decodedToken.rol === 'Cliente'){
            localStorage.setItem('rol', 'Cliente');
            navigate('/userDashboard');
          }
        }
        setServerMessage(data.message);
      }
    })
    .catch((error) => {
      console.error('Error:',error);
      setErrors({ server: 'Error en la solicitud: ' + error.message });
    });
    
  }

  return { form, errors, handleChange, handleSubmit };
}

export default useForm;