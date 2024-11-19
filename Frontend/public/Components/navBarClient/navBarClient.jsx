import React from "react";
import styles from "./navBarClient.module.css";
import logo from "../../../src/assets/SoloLogo_Patagon.png"

const navBar = () => {
  const isActive = (path) => location.pathname === path;
  
  return (
    <>
      <div className={styles.header}>
        {/* <img src={wave} alt="wave" className={styles.wave}/> */}
        <div className={styles.sectionIzq}>
        <img src={logo} alt="logo" className={styles.logo} />
        <div className={styles.btnGroup}>
          <a href='/mainClient' className={isActive("/mainClient") ? styles.active : ''} tabIndex='-1'>
            Home
          </a>
        </div>
        <div className={styles.btnGroup}>
          <a href='/UsInfo' className={isActive("/UsInfo") ? styles.active : ''} tabIndex='-1'>
            Nosotros
          </a>
        </div>
        <div className={styles.btnGroup}>
          <a href='/Docs' className={isActive("/Docs") ? styles.active : ''} tabIndex='-1'>  
            Documentación
          </a>
        </div>
        </div>
        <div className={styles.userDiv}>
          <a className={styles.user}>Usuario</a>
          <ul>
            <li><a href="/Profile">Mi Perfil</a></li>
            <li><a href="/Compras">Historial de compras</a></li>
            <li><a href="/">Cerrar sesión</a></li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default navBar;