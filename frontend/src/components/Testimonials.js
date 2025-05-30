import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      text: 'Organizaron el cumpleaños de mi hijo y fue increíble. La decoración temática de superhéroes superó todas nuestras expectativas. Los niños se divirtieron muchísimo con las actividades y juegos.',
      author: 'Ana Rodríguez',
      role: 'Mamá de Carlos, 7 años',
      rating: 5,
      avatar: '/img/avatar2.jpg',
      event: 'Cumpleaños infantil'
    },
    {
      id: 2,
      text: 'La decoración para la comunión de mi hija quedó tal como la pedí. Todo perfecto, desde las flores hasta los detalles personalizados. El servicio fue impecable y todos los invitados quedaron encantados.',
      author: 'Juan Mendoza',
      role: 'Papá de Lucía, 9 años',
      rating: 5,
      avatar: '/img/avatar1.jpg',
      event: 'Primera comunión'
    },
    {
      id: 3,
      text: 'Los productos para nuestra fiesta familiar llegaron a tiempo y en perfectas condiciones. La calidad es excelente y el precio muy razonable. Sin duda volveremos a contar con ellos para nuestras celebraciones.',
      author: 'Maria López',
      role: 'Cliente frecuente',
      rating: 4,
      avatar: '/img/avatar3.jpg',
      event: 'Reunión familiar'
    }
  ];

  // Función para renderizar estrellas según la valoración
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? 'filled' : 'empty'}`}>
          {i <= rating ? '★' : '☆'}
        </span>
      );
    }
    return stars;
  };

  return (
    <section className="testimonials-section">
      <div className="container">
        <h2 className="section-title">Lo que dicen nuestros clientes</h2>
        <p className="section-subtitle">Descubre por qué familias como la tuya confían en nosotros para sus momentos especiales</p>
        
        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-event">{testimonial.event}</div>
              <div className="testimonial-rating">
                {renderStars(testimonial.rating)}
              </div>
              <p className="testimonial-text">{testimonial.text}</p>
              <div className="testimonial-author">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.author} 
                  className="author-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://png.pngtree.com/png-vector/20201224/ourlarge/pngtree-corporate-business-professional-team-png-image_2620011.jpg';
                  }}
                />
                <div className="author-info">
                  <span className="author-name">{testimonial.author}</span>
                  <span className="author-role">{testimonial.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;