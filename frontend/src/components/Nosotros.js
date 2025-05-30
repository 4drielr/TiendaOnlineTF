import React from 'react';
import '../styles/nosotros.css';

const Nosotros = () => (
  <section className="about-section">
    <div className="container">
      <h2 className="section-title">Sobre nosotros</h2>
      <p className="section-subtitle">Conoce al equipo que hace posible tus celebraciones</p>
      
      <div className="about-hero">
        <img 
          src="https://competenciasdelsiglo21.com/wp-content/uploads/2018/01/trabajo-equipo.jpg" 
          alt="Equipo de trabajo Niños y Celebraciones" 
          className="about-hero-img"
        />
        <div className="about-hero-overlay">
          <h3>Creamos momentos inolvidables</h3>
        </div>
      </div>
      
      <div className="about-cards-container">
        <div className="about-card">
          <img 
            src="https://img.freepik.com/free-photo/happy-team-event-planners-working-together_23-2149328242.jpg" 
            alt="Equipo de trabajo" 
            className="about-card-img"
          />
          <h3>¿Quiénes somos?</h3>
          <p>
            Somos un equipo apasionado por crear momentos inolvidables para niños y familias. Nos dedicamos a la organización de eventos y la venta de productos personalizados para celebraciones infantiles, cuidando cada detalle para que vivas una experiencia única.
          </p>
        </div>
        
        <div className="about-card">
          <img 
            src="https://img.freepik.com/free-photo/kids-birthday-party-decorations_23-2149501440.jpg" 
            alt="Misión de la empresa" 
            className="about-card-img"
          />
          <h3>Nuestra misión</h3>
          <p>
            Brindar alegría, creatividad y confianza a través de servicios y productos de alta calidad, adaptados a las necesidades de cada cliente. Queremos ser parte de tus momentos especiales y convertirlos en recuerdos que perdurarán toda la vida.
          </p>
        </div>
        
        <div className="about-card">
          <img 
            src="https://img.freepik.com/free-photo/group-kids-having-fun-birthday-party_23-2148155321.jpg" 
            alt="Visión de la empresa" 
            className="about-card-img"
          />
          <h3>Nuestra visión</h3>
          <p>
            Ser reconocidos como la empresa líder en organización de eventos infantiles, destacando por nuestra innovación, calidad y compromiso con la felicidad de nuestros clientes. Buscamos expandir nuestra presencia para llevar alegría a más familias.
          </p>
        </div>
      </div>
      
      <div className="about-values">
        <h3 className="about-values-title">¿Por qué elegirnos?</h3>
        <div className="about-values-grid">
          <div className="about-value-item">
            <img 
              src="https://img.freepik.com/free-photo/customer-service-representative-with-headset_23-2149069776.jpg" 
              alt="Atención personalizada" 
              className="about-value-img"
            />
            <h4>Atención personalizada</h4>
            <p>Cada cliente recibe un trato único y adaptado a sus necesidades</p>
          </div>
          
          <div className="about-value-item">
            <img 
              src="https://img.freepik.com/free-photo/close-up-colorful-birthday-decorations_23-2149341965.jpg" 
              alt="Calidad premium" 
              className="about-value-img"
            />
            <h4>Calidad premium</h4>
            <p>Utilizamos materiales y servicios de primera calidad en todos nuestros eventos</p>
          </div>
          
          <div className="about-value-item">
            <img 
              src="https://img.freepik.com/free-photo/business-partners-handshake-international-business-concept_53876-104046.jpg" 
              alt="Compromiso total" 
              className="about-value-img"
            />
            <h4>Compromiso total</h4>
            <p>Nos responsabilizamos de cada detalle para que tú solo tengas que disfrutar</p>
          </div>
          
          <div className="about-value-item">
            <img 
              src="https://img.freepik.com/free-photo/creative-designer-working-with-colors_23-2149267182.jpg" 
              alt="Creatividad sin límites" 
              className="about-value-img"
            />
            <h4>Creatividad sin límites</h4>
            <p>Cada proyecto es único, con ideas originales y personalizadas</p>
          </div>
        </div>
      </div>
      
      <div className="about-cta">
        <h3>Estamos listos para hacer realidad tu próximo evento</h3>
        <a href="/eventos" className="btn-primary">Reserva tu evento</a>
      </div>
    </div>
  </section>
);

export default Nosotros;
