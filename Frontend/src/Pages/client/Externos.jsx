import React from 'react';
import styles from '../../styles/client/EstudianteExternos.module.css';
import NavBar from "../../../public/Components/navBarClient/navBarClient";
import Footer from "../../../public/Components/FooterUser/Footer.jsx";

const Externos = () => {
  return (
    <div className={styles.pageContainer}>
      <NavBar />
      <main className={styles.mainContent}>
        <h1 className={styles.title}>Si eres externo, debes:</h1>
        <ol className={styles.stepsList}>
          <li className={styles.step}>
            Registrarte en la página <a href="https://patagon.uach.cl/sistemas-de-pagos-patagon" target="_blank" rel="noopener noreferrer" className={styles.link}>Sistemas-De-Pagos-Patagon</a>.
          </li>
          <li className={styles.step}>
            Realizar una solicitud siguiendo este <a href="https://patagon.uach.cl/solicitud" target="_blank" rel="noopener noreferrer" className={styles.link}>enlace</a>.
          </li>
          <li className={styles.step}>
            Completar el formulario con los datos necesarios y enviarlo.
          </li>
          <li className={styles.step}>
            Esperar la confirmación por correo electrónico o por teléfono.
          </li>
        </ol>
      </main>
      <Footer />
    </div>
  );
}

export default Externos;
