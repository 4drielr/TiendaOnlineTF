import React, { useState } from 'react';
import Swal from 'sweetalert2';
import '../styles/contact-form.css';

const ContactForm = () => {
  // Estado inicial del formulario
  const initialFormState = {
    nombre: '',
    email: '',
    telefono: '',
    edad: '',
    tipoConsulta: '',
    departamentos: [],
    preferencia: 'email',
    mensaje: '',
    terminos: false
  };

  // Estados para el formulario y validación
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Opciones para los campos select y checkbox
  const tiposConsulta = ['Información general', 'Soporte técnico', 'Ventas', 'Devoluciones', 'Otros'];
  const departamentosOptions = ['Atención al cliente', 'Ventas', 'Soporte técnico', 'Marketing', 'Administración'];

  // Función para manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox' && name === 'departamentos') {
      // Manejo de checkboxes múltiples
      let updatedDepartamentos = [...formData.departamentos];
      if (checked) {
        updatedDepartamentos.push(value);
      } else {
        updatedDepartamentos = updatedDepartamentos.filter(item => item !== value);
      }
      setFormData({ ...formData, departamentos: updatedDepartamentos });
    } else if (type === 'checkbox') {
      // Manejo de checkbox simple (términos)
      setFormData({ ...formData, [name]: checked });
    } else {
      // Manejo de otros tipos de input
      setFormData({ ...formData, [name]: value });
    }
  };

  // Validación del formulario
  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    // Validación del nombre
    if (!formData.nombre.trim()) {
      formErrors.nombre = 'El nombre es obligatorio';
      isValid = false;
    } else if (formData.nombre.length < 3) {
      formErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
      isValid = false;
    }

    // Validación del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      formErrors.email = 'El email es obligatorio';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      formErrors.email = 'Ingrese un email válido';
      isValid = false;
    }

    // Validación del teléfono
    const phoneRegex = /^\d{9}$/;
    if (formData.telefono && !phoneRegex.test(formData.telefono)) {
      formErrors.telefono = 'Ingrese un número de teléfono válido (9 dígitos)';
      isValid = false;
    }

    // Validación de la edad
    if (formData.edad) {
      const edad = parseInt(formData.edad);
      if (isNaN(edad) || edad < 18 || edad > 120) {
        formErrors.edad = 'La edad debe estar entre 18 y 120 años';
        isValid = false;
      }
    }

    // Validación del tipo de consulta
    if (!formData.tipoConsulta) {
      formErrors.tipoConsulta = 'Seleccione un tipo de consulta';
      isValid = false;
    }

    // Validación de departamentos
    if (formData.departamentos.length === 0) {
      formErrors.departamentos = 'Seleccione al menos un departamento';
      isValid = false;
    }

    // Validación del mensaje
    if (!formData.mensaje.trim()) {
      formErrors.mensaje = 'El mensaje es obligatorio';
      isValid = false;
    } else if (formData.mensaje.length < 10) {
      formErrors.mensaje = 'El mensaje debe tener al menos 10 caracteres';
      isValid = false;
    }

    // Validación de términos
    if (!formData.terminos) {
      formErrors.terminos = 'Debe aceptar los términos y condiciones';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  // Manejo del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setSubmitted(true);
      
      try {
        // Simulamos una petición AJAX/Fetch
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        const data = await response.json();
        console.log('Respuesta del servidor:', data);
        
        // Mostrar mensaje de éxito con SweetAlert2
        Swal.fire({
          title: '¡Formulario enviado!',
          text: 'Gracias por contactarnos. Te responderemos a la brevedad.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#4a90e2'
        });
        
        // Resetear el formulario
        setFormData(initialFormState);
        setSubmitted(false);
      } catch (error) {
        console.error('Error al enviar el formulario:', error);
        
        // Mostrar mensaje de error con SweetAlert2
        Swal.fire({
          title: 'Error',
          text: 'Ha ocurrido un error al enviar el formulario. Por favor, inténtalo de nuevo más tarde.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#4a90e2'
        });
        
        setSubmitted(false);
      }
    } else {
      // Mostrar mensaje de validación con SweetAlert2
      Swal.fire({
        title: 'Formulario incompleto',
        text: 'Por favor, completa correctamente todos los campos requeridos.',
        icon: 'warning',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#4a90e2'
      });
    }
  };

  return (
    <div className="contact-form-container">
      <h2 className="form-title">Formulario de Contacto</h2>
      <p className="form-description">
        Completa el siguiente formulario para ponerte en contacto con nosotros. 
        Todos los campos marcados con * son obligatorios.
      </p>
      
      <form onSubmit={handleSubmit} className="contact-form" noValidate>
        {/* Campo de nombre */}
        <div className="form-group">
          <label htmlFor="nombre">Nombre completo *</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            className={errors.nombre ? 'form-control error' : 'form-control'}
          />
          {errors.nombre && <div className="error-message">{errors.nombre}</div>}
        </div>
        
        {/* Campo de email */}
        <div className="form-group">
          <label htmlFor="email">Correo electrónico *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={errors.email ? 'form-control error' : 'form-control'}
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>
        
        {/* Campo de teléfono */}
        <div className="form-group">
          <label htmlFor="telefono">Teléfono</label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleInputChange}
            className={errors.telefono ? 'form-control error' : 'form-control'}
          />
          {errors.telefono && <div className="error-message">{errors.telefono}</div>}
        </div>
        
        {/* Campo de edad */}
        <div className="form-group">
          <label htmlFor="edad">Edad</label>
          <input
            type="number"
            id="edad"
            name="edad"
            value={formData.edad}
            onChange={handleInputChange}
            className={errors.edad ? 'form-control error' : 'form-control'}
            min="18"
            max="120"
          />
          {errors.edad && <div className="error-message">{errors.edad}</div>}
        </div>
        
        {/* Campo de tipo de consulta (select) */}
        <div className="form-group">
          <label htmlFor="tipoConsulta">Tipo de consulta *</label>
          <select
            id="tipoConsulta"
            name="tipoConsulta"
            value={formData.tipoConsulta}
            onChange={handleInputChange}
            className={errors.tipoConsulta ? 'form-control error' : 'form-control'}
          >
            <option value="">Selecciona una opción</option>
            {tiposConsulta.map((tipo, index) => (
              <option key={index} value={tipo}>{tipo}</option>
            ))}
          </select>
          {errors.tipoConsulta && <div className="error-message">{errors.tipoConsulta}</div>}
        </div>
        
        {/* Campo de departamentos (checkboxes) */}
        <div className="form-group">
          <label>Departamentos a contactar *</label>
          <div className="checkbox-group">
            {departamentosOptions.map((depto, index) => (
              <div key={index} className="checkbox-item">
                <input
                  type="checkbox"
                  id={`depto-${index}`}
                  name="departamentos"
                  value={depto}
                  checked={formData.departamentos.includes(depto)}
                  onChange={handleInputChange}
                />
                <label htmlFor={`depto-${index}`}>{depto}</label>
              </div>
            ))}
          </div>
          {errors.departamentos && <div className="error-message">{errors.departamentos}</div>}
        </div>
        
        
        {/* Campo de mensaje */}
        <div className="form-group">
          <label htmlFor="mensaje">Mensaje *</label>
          <textarea
            id="mensaje"
            name="mensaje"
            value={formData.mensaje}
            onChange={handleInputChange}
            className={errors.mensaje ? 'form-control error' : 'form-control'}
            rows="5"
          ></textarea>
          {errors.mensaje && <div className="error-message">{errors.mensaje}</div>}
        </div>
        
        {/* Términos y condiciones */}
        <div className="form-group checkbox-group">
          <div className="checkbox-item terms">
            <input
              type="checkbox"
              id="terminos"
              name="terminos"
              checked={formData.terminos}
              onChange={handleInputChange}
            />
            <label htmlFor="terminos">
              Acepto los términos y condiciones *
            </label>
          </div>
          {errors.terminos && <div className="error-message">{errors.terminos}</div>}
        </div>
        
        {/* Botón de envío */}
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn-submit"
            disabled={submitted}
          >
            {submitted ? 'Enviando...' : 'Enviar mensaje'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
