package com.tiendaonline.backend.util;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.springframework.boot.jackson.JsonComponent;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;

@JsonComponent
public class PriceFormatter {

    /**
     * Serializador personalizado para formatear precios con 2 decimales
     * pero manteniendo el valor numérico para que el frontend pueda manipularlo
     */
    public static class EuroSerializer extends JsonSerializer<Double> {

        @Override
        public void serialize(Double value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
            if (value == null) {
                gen.writeNull();
            } else {
                // Redondear a 2 decimales pero mantener como número
                BigDecimal bd = BigDecimal.valueOf(value);
                bd = bd.setScale(2, RoundingMode.HALF_UP);
                gen.writeNumber(bd.doubleValue());
            }
        }
    }
}
