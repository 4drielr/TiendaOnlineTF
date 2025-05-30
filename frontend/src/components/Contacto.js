import React, { useState } from 'react';
import '../styles/contacto.css';
import ContactForm from './ContactForm';

const FAQS = [
  {
    pregunta: '¿Cómo puedo comprar productos?',
    respuesta: 'Puedes explorar nuestro catálogo y añadir productos al carrito. Luego finaliza tu compra desde el carrito. Si necesitas ayuda durante el proceso, no dudes en contactarnos por WhatsApp.'
  },
  {
    pregunta: '¿Cuánto tarda el envío?',
    respuesta: 'El tiempo de entrega habitual es de 2 a 5 días laborables, dependiendo de tu ubicación. Para pedidos internacionales, el tiempo puede extenderse hasta 10-15 días hábiles.'
  },
  {
    pregunta: '¿Puedo personalizar productos?',
    respuesta: 'Sí, muchos de nuestros productos permiten personalización. Consulta la ficha de producto para ver las opciones disponibles o contáctanos directamente para solicitudes especiales.'
  },
  {
    pregunta: '¿Qué métodos de pago aceptan?',
    respuesta: 'Aceptamos tarjetas de crédito/débito, PayPal y pagos por transferencia bancaria. Todas las transacciones están protegidas con encriptación SSL.'
  },
  {
    pregunta: '¿Puedo cancelar o modificar mi pedido?',
    respuesta: 'Sí, puedes cancelar o modificar tu pedido antes de que sea enviado. Una vez que recibas la notificación de envío, ya no será posible realizar cambios. Contáctanos lo antes posible si necesitas hacer algún cambio.'
  },
  {
    pregunta: '¿Tienen política de devoluciones?',
    respuesta: 'Sí, aceptamos devoluciones dentro de los 14 días posteriores a la recepción del producto. El artículo debe estar en su estado original y sin usar. Los gastos de envío para la devolución corren por cuenta del cliente, excepto en casos de productos defectuosos.'
  }
];

const FaqItem = ({ pregunta, respuesta }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className={`faq-item ${isOpen ? 'active' : ''}`}>
      <div className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        <h4>{pregunta}</h4>
        <span className="faq-icon">{isOpen ? '−' : '+'}</span>
      </div>
      <div className={`faq-answer ${isOpen ? 'open' : ''}`}>
        <p>{respuesta}</p>
      </div>
    </div>
  );
};

const Contacto = () => {
  return (
    <section className="contact-section">
      <div className="container contact-container">
        <h2 className="section-title">Preguntas Frecuentes</h2>
        <p className="section-subtitle">Encuentra respuestas a las dudas más comunes sobre nuestros productos y servicios</p>
        
        <div className="faq-list">
          {FAQS.map((faq, idx) => (
            <FaqItem key={idx} pregunta={faq.pregunta} respuesta={faq.respuesta} />
          ))}
        </div>
        
        <div className="contact-divider">
          <span>¿No encuentras lo que buscas?</span>
        </div>
        
        <div className="contact-options">
          <div className="whatsapp-contacto">
            <h3>Contacto Directo</h3>
            <p className="contact-description">Nuestro equipo de atención al cliente está listo para ayudarte con cualquier consulta o problema que puedas tener.</p>
            
            <a href="https://wa.me/34600000000" className="whatsapp-button" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-whatsapp"></i> Contáctanos por WhatsApp
            </a>
            
            <div className="contact-info">
              <p><strong>Horario de atención:</strong> Lunes a viernes, 9:00-18:00h</p>
              <p><strong>Email:</strong> info@ninosycelebraciones.com</p>
              <p><strong>Teléfono:</strong> +34 123 456 789</p>
            </div>
          </div>
          
          <div className="contact-form-section">
            <h3>Formulario de Contacto</h3>
            <p>También puedes enviarnos un mensaje a través de nuestro formulario de contacto:</p>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacto;
