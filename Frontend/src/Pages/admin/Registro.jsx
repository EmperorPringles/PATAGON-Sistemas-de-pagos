import React from 'react';
import style from '../../styles/LoginGeneral.module.css';
import style2 from '../../styles/Registro.module.css';
import useForm from '../../Hooks/registerForm';
import LoginButton from '../../../public/Components/loginButton/loginButton';
import InputPassword from '../../../public/Components/InputPassword/inputPassword';
import InputText from '../../../public/Components/InputText/inputText';
import { faEnvelope, faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import ParticlesBG from '../../../public/Components/Particles/ParticlesBG';

const Registro = () => {
  const initialData = {
    username: '',
    email: '',
    password: '',
    repPass: ''
  }

  const onValidate = (form) => {
    let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
    let regexEmail = /^[\w.-]+@[a-zA-Z]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;
    let regexPassword = /^\S+$/;

    let errors = {};
    let isError = false;

    if(!regexName.test(form.username)){
      errors.username = "El nombre de usuario solo puede contener letras y espacios";
      console.log("error");
      isError = true;
    }

    if(!regexEmail.test(form.email)){
      errors.email = "El correo electronico contiene un formato invalido";
      isError = true;
    }

    if(form.password.trim() !== form.repPass.trim()){
      errors.repPass = "Las contraseñas no coinciden";
      isError = true;
    }

    if(!regexPassword.test(form.password)){
      errors.password = "La contraseña no puede contener espacios";
      isError = true;
    }

    return isError ? errors : null; 
  };

  const { form, errors, loading, handleChange, handleSubmit } = useForm(initialData, onValidate);

  return (
    <>
      <ParticlesBG/>
      <div className={style.body}>
        <div className={style.contenedor}>
          <form onSubmit={handleSubmit}>
            <h1>Registrarse</h1>
            {errors.server && <div className={style2.errorMessageSV} >{errors.server}</div>}
            <InputText icon={faUser} id='username' value={form.username} label='Nombre de usuario' handleChange={handleChange} disabled={loading}/>  
            {errors.username && <div className={style2.errorMessage} >{errors.username}</div>}
            
            <InputText icon={faEnvelope} id='email' value={form.email} label='Correo electronico' handleChange={handleChange} disabled={loading}/>
            {errors.email && <div className={style2.errorMessage} >{errors.email}</div>}
            
            <InputPassword icon={faLock} id='password' value={form.password} label='Contraseña' handleChange={handleChange} disabled={loading}/>
            {errors.password && <div className={style2.errorMessage} >{errors.password}</div>}
            
            <InputPassword icon={faLock} id='repPass' value={form.repPass} label='Repetir contraseña' handleChange={handleChange} disabled={loading}/>
            {errors.repPass && <div className={style2.errorMessage} >{errors.repPass}</div>}

            <LoginButton text="Registrarse" disabled={loading}/>
            <p className={style.registro}>¿Ya tienes cuenta? <a href='/'>Ingresa</a></p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Registro;