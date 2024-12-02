import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from '@components/navBarClient/navBarClient';
import paypalOrder from '@hooks/paypalOrder'; // Asegúrate de que la ruta sea correcta
import mercadopagoOrder from '@hooks/mercadopagoOrder';
import useFetchBolsa from '@hooks/bolsas';
import styles1 from '@styles/DashboardGeneral.module.css';
import styles from '@clientStyles/Purchase.module.css';
import logo from '../../assets/SoloLogo_Patagon.png';

const Purchase_details = () => {
    const { pathname } = useLocation();
    const id = pathname.split('/').pop(); 
    const [isOpen, setIsOpen] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('paypal'); // Estado para el método de pago
    const { bolsa } = useFetchBolsa(id);
    const { paypal } = paypalOrder(); 
    const { mercadopago } = mercadopagoOrder();

    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked);
    };

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value); // Actualiza el método de pago seleccionado
    };

    const handleBuyClick = async () => {
        if (!isChecked) {
            alert('Debes aceptar los términos y condiciones antes de continuar.');
            return;
        }

        setLoading(true); // Mostrar el spinner
        const orderData = {
            precio: bolsa.precio,
            email: localStorage.getItem("email"),
            id: bolsa.ID,
            time: bolsa.time,
        };

        try {
            let urlPago;
            if (paymentMethod === 'paypal') {
                const response = await paypal(orderData);
                urlPago = response.urlPago; 
            } else if (paymentMethod === 'mercadopago') {
                const response = await mercadopago(orderData);
                urlPago = response.urlPago; 
            }

            if (urlPago) {
                window.location.href = urlPago; 
            }
        } catch (err) {
            console.error('Error al procesar la compra:', err);
        } finally {
            setLoading(false); 
        }
    };

    if (!bolsa) {
        return <div>Cargando...</div>;
    }

    return (
        <div className={styles1.dashboardContainer}>
            {/* <MenuDashboard toggleMenu={() => setIsOpen(!isOpen)} isOpen={isOpen} /> */}
            <NavBar />
            <main className={`${styles1.content} `}>
                <div className={styles1.header}>
                    <div className={styles1.titleLogo}>
                        {/* <img src={logo} className={styles1.menuIcon} alt="Logo" /> */}
                        {/* <h1>Detalles de compra</h1> */}
                    </div>
                </div>

                <div className={styles.purchaseContainer}>
                    <div className={styles.purchaseDetails}>
                        <h1>Detalles de compra</h1>
                        <hr></hr>
                        <h2>{bolsa.nombre}</h2>
                        <p>Tiempo: {bolsa.time} horas</p>
                        <p>Precio: ${bolsa.precio} USD</p>
                        <p>Detalles: {bolsa.detalles.join(', ')}</p>
                        <p>RAM: {bolsa.ram}</p>
                        <p className={styles.condiciones}>
                            Sistemas de arriendos Patagón ofrece un sistema basado en la venta de bolsas de tiempo para el uso de los recursos de un servidor. Cada bolsa de tiempo tiene un costo específico y permite al usuario acceder a servicios de cómputo por un período determinado. A medida que el usuario utiliza estos recursos, el tiempo disponible en la bolsa se va descontando proporcionalmente.
                        </p>
                    </div>

                    <div className={styles.purchaseSummary}>
                        <h3>Resumen</h3>
                        <div className={styles.summaryRow}>
                            <p>Artículos:</p>
                            <p>1</p>
                        </div>
                        <div className={styles.totalPrice}>
                            <p>Total: ${bolsa.precio} USD</p>
                        </div>

                        <div className={styles.termsContainer}>
                            <input
                                type="checkbox"
                                id="termsCheckbox"
                                checked={isChecked}
                                onChange={handleCheckboxChange}
                            />
                            <label htmlFor="termsCheckbox">Acepto los términos y condiciones</label>
                        </div>

                        <div className={styles.paymentMethod}>
                
                            <div>
                                <input
                                    type="radio"
                                    id="paypal"
                                    name="paymentMethod"
                                    value="paypal"
                                    checked={paymentMethod === 'paypal'}
                                    onChange={handlePaymentMethodChange}
                                />
                                <label htmlFor="paypal">PayPal</label>
                            </div>
                            <div>
                                <input
                                    type="radio"
                                    id="mercadopago"
                                    name="paymentMethod"
                                    value="mercadopago"
                                    checked={paymentMethod === 'mercadopago'}
                                    onChange={handlePaymentMethodChange}
                                />
                                <label htmlFor="mercadopago">Mercado Pago</label>
                            </div>
                        </div>

                        <button
                            className={styles.buyButton}
                            onClick={handleBuyClick}
                            disabled={loading} 
                        >
                            {loading ? (
                                <span className={styles.spinner}></span>
                            ) : (
                                'Comprar ahora'
                            )}
                        </button>
                        <div className={styles.logo}>
                            <img src='/icons/PayPal.svg' alt='PayPal' />
                            <img src='/icons/mercadopago.svg' alt='Mercado Pago' /> 
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Purchase_details;
