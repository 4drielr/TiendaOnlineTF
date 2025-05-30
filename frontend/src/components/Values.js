import React from 'react';

const Values = () => {
  const values = [
    {
      id: 1,
      title: 'Creatividad',
      description: 'Creamos experiencias únicas y originales para cada celebración.',
      image: '/img/creatividad.png'
    },
    {
      id: 2,
      title: 'Calidad',
      description: 'Utilizamos materiales y servicios de alta calidad para garantizar la satisfacción.',
      image: '/img/calidad.png'
    },
    {
      id: 3,
      title: 'Confianza',
      description: 'Nuestro compromiso y responsabilidad nos convierten en tu aliado de confianza.',
      image: '/img/creatividad.png'
    }
  ];

  return (
    <section className="values-section" style={{ background: '#f9f9f9', padding: '3.5rem 0' }}>
      <div className="container">
        <h2 className="section-title" style={{ color: '#4a90e2', fontWeight: 700 }}>Nuestros Valores</h2>
        <div className="values-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', marginTop: 25 }}>
          {values.map((value) => (
            <div key={value.id} className="value-card" style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #0001', padding: '1.2rem', textAlign: 'center', width: 220, height: 'auto' }}>
              <img src={value.image} alt={value.title} style={{ width: 120, height: 120, marginBottom: 12 }} />
              <h3 className="value-title" style={{ color: '#4a90e2', fontWeight: 600, fontSize: '1.1rem', margin: '8px 0 4px 0' }}>{value.title}</h3>
              <p className="value-description" style={{ color: '#444', fontSize: '0.98rem' }}>{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Values;