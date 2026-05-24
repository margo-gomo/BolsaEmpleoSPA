package com.example.backend.logic;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class PdfReporteService {

    @Autowired
    private Service_BolsaEmpleo serviceBolsaEmpleo;

    private static final Color AZUL_OSCURO = new Color(30,  60,  114);
    private static final Color AZUL_MEDIO  = new Color(52,  99,  173);
    private static final Color AZUL_CLARO  = new Color(235, 241, 255);
    private static final Color GRIS_OSCURO = new Color(40,  40,  40);
    private static final Color GRIS_MEDIO  = new Color(80,  80,  80);
    private static final Color GRIS_CLARO  = new Color(130, 130, 130);
    private static final Color BORDE       = new Color(200, 210, 230);
    private static final Color VERDE       = new Color(39,  174, 96);
    private static final Color DORADO      = new Color(180, 117, 23);

    private static final String[] NOMBRES_MES = {
            "", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    };


    public void generarReporteMes(List<Integer> meses,
                                  Boolean todosMeses,
                                  HttpServletResponse response) throws IOException {

        List<Integer> mesesAConsultar = resolverMeses(meses, todosMeses);

        List<VReportePuestosSolicitadosMe> datos =
                serviceBolsaEmpleo.getReportePuestosSolicitadosMe(mesesAConsultar);

        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition",
                "attachment; filename=\"reporte_puestos.pdf\"");

        Font fTitulo = new Font(Font.HELVETICA, 18, Font.BOLD,   AZUL_OSCURO);
        Font fSubtit = new Font(Font.HELVETICA, 11, Font.NORMAL, GRIS_MEDIO);
        Font fEncP   = new Font(Font.HELVETICA, 10, Font.BOLD,   Color.WHITE);
        Font fEncS   = new Font(Font.HELVETICA,  9, Font.BOLD,   Color.WHITE);
        Font fCelda  = new Font(Font.HELVETICA,  9, Font.NORMAL, GRIS_OSCURO);
        Font fNivel  = new Font(Font.HELVETICA,  9, Font.BOLD,   VERDE);
        Font fPie    = new Font(Font.HELVETICA,  8, Font.ITALIC, GRIS_CLARO);

        Document doc = abrirDocumento(response);

        agregarParrafo(doc, "Bolsa de Empleo", fTitulo, Element.ALIGN_CENTER, 0f);
        agregarParrafo(doc,
                "Reporte de Puestos Solicitados - " + construirTituloMeses(mesesAConsultar, todosMeses),
                fSubtit, Element.ALIGN_CENTER, 16f);

        if (datos.isEmpty()) {
            agregarParrafo(doc,
                    "No se encontraron solicitudes para el período seleccionado.",
                    fSubtit, Element.ALIGN_CENTER, 20f);
        } else {
            for (VReportePuestosSolicitadosMe puesto : datos) {
                doc = agregarTablaPuesto(doc, puesto, fEncP, fCelda);
                doc = agregarTablaCaracteristicas(doc, puesto.getPuestoId(), fEncS, fCelda, fNivel);
            }

            long total = datos.stream()
                    .mapToLong(VReportePuestosSolicitadosMe::getCantidadSolicitudes)
                    .sum();
            agregarParrafo(doc, " ", fSubtit, Element.ALIGN_LEFT, 0f);
            agregarParrafo(doc, "Total de solicitudes: " + total,
                    fSubtit, Element.ALIGN_RIGHT, 0f);
        }

        agregarPiePagina(doc, fPie);
        doc.close();
    }

    public void generarReporteSalarios(HttpServletResponse response) throws IOException {

        List<VReporteSalariosAlto> datos = new java.util.ArrayList<>();
        serviceBolsaEmpleo.getAllSalariosAlto().forEach(datos::add);

        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition",
                "attachment; filename=\"reporte_salarios.pdf\"");

        Font fTitulo  = new Font(Font.HELVETICA, 18, Font.BOLD,   AZUL_OSCURO);
        Font fSubtit  = new Font(Font.HELVETICA, 11, Font.NORMAL, GRIS_MEDIO);
        Font fEncP    = new Font(Font.HELVETICA, 10, Font.BOLD,   Color.WHITE);
        Font fCelda   = new Font(Font.HELVETICA,  9, Font.NORMAL, GRIS_OSCURO);
        Font fSalario = new Font(Font.HELVETICA,  9, Font.BOLD,   DORADO);
        Font fPie     = new Font(Font.HELVETICA,  8, Font.ITALIC, GRIS_CLARO);

        Document doc = abrirDocumento(response);

        agregarParrafo(doc, "Bolsa de Empleo", fTitulo, Element.ALIGN_CENTER, 0f);
        agregarParrafo(doc,
                "Reporte de Puestos con Salarios Más Altos (equivalente en CRC)",
                fSubtit, Element.ALIGN_CENTER, 16f);

        if (datos.isEmpty()) {
            agregarParrafo(doc, "No hay puestos registrados.", fSubtit, Element.ALIGN_CENTER, 0f);
        } else {
            PdfPTable tabla = new PdfPTable(5);
            tabla.setWidthPercentage(100f);
            setWidths(tabla, new float[]{2f, 3f, 1.2f, 2f, 2.5f});
            tabla.setSpacingBefore(8f);

            for (String enc : new String[]{"Empresa", "Puesto", "Moneda", "Salario original", "Equivalente en colones"}) {
                tabla.addCell(celdaEncabezado(enc, fEncP, AZUL_OSCURO));
            }

            boolean par = false;
            for (VReporteSalariosAlto r : datos) {
                Color colorFila = par ? AZUL_CLARO : Color.WHITE;
                par = !par;

                String[] vals = {
                        r.getEmpresa(),
                        r.getPuesto(),
                        r.getMoneda(),
                        r.getSimbolo() + " " + String.format("%,.2f", r.getSalario()),
                        r.getSalarioConvertido() != null
                                ? "₡ " + String.format("%,.2f", r.getSalarioConvertido()) : "—"
                };
                int[] aligns = {
                        Element.ALIGN_LEFT, Element.ALIGN_LEFT, Element.ALIGN_CENTER,
                        Element.ALIGN_RIGHT, Element.ALIGN_RIGHT
                };

                for (int i = 0; i < vals.length; i++) {
                    Font f = (i == 4) ? fSalario : fCelda;
                    tabla.addCell(celdaDato(vals[i], f, colorFila, aligns[i]));
                }
            }

            addToDoc(doc, tabla);

            agregarParrafo(doc, "Tipos de cambio aplicados: 1 USD = ₡530  |  1 EUR = ₡580",
                    fPie, Element.ALIGN_LEFT, 8f);
        }

        agregarPiePagina(doc, fPie);
        doc.close();
    }

    private Document abrirDocumento(HttpServletResponse response) throws IOException {
        Document doc = new Document(PageSize.A4, 40, 40, 60, 40);
        try {
            PdfWriter.getInstance(doc, response.getOutputStream());
        } catch (DocumentException e) {
            throw new RuntimeException(e);
        }
        doc.open();
        return doc;
    }

    private Document agregarTablaPuesto(Document doc,
                                        VReportePuestosSolicitadosMe puesto,
                                        Font fEncP, Font fCelda) {
        PdfPTable tbl = new PdfPTable(6);
        tbl.setWidthPercentage(100f);
        setWidths(tbl, new float[]{1.2f, 2.8f, 2.8f, 1f, 2f, 1.5f});
        tbl.setSpacingBefore(14f);
        tbl.setSpacingAfter(0f);

        for (String enc : new String[]{"Mes", "Empresa", "Puesto", "Moneda", "Salario", "Solicitudes"}) {
            tbl.addCell(celdaEncabezado(enc, fEncP, AZUL_OSCURO));
        }

        String mesNombre = (puesto.getMes() != null && puesto.getMes() >= 1 && puesto.getMes() <= 12)
                ? NOMBRES_MES[puesto.getMes()] : String.valueOf(puesto.getMes());

        String[] vals = {
                mesNombre, puesto.getEmpresa(), puesto.getDescripcion(),
                puesto.getSimbolo(), String.format("%,.2f", puesto.getSalario()),
                String.valueOf(puesto.getCantidadSolicitudes())
        };
        int[] aligns = {
                Element.ALIGN_CENTER, Element.ALIGN_LEFT, Element.ALIGN_LEFT,
                Element.ALIGN_CENTER, Element.ALIGN_RIGHT, Element.ALIGN_CENTER
        };

        for (int i = 0; i < vals.length; i++) {
            tbl.addCell(celdaDato(vals[i], fCelda, Color.WHITE, aligns[i]));
        }

        addToDoc(doc, tbl);
        return doc;
    }

    private Document agregarTablaCaracteristicas(Document doc, Integer puestoId,
                                                 Font fEncS, Font fCelda, Font fNivel) {
        List<VPuestoCaracteristicasReporte> caracs =
                serviceBolsaEmpleo.getAllPuestoCaracReporte(puestoId);

        if (caracs == null || caracs.isEmpty()) return doc;

        PdfPTable tbl = new PdfPTable(2);
        tbl.setWidthPercentage(60f);
        tbl.setHorizontalAlignment(Element.ALIGN_RIGHT);
        setWidths(tbl, new float[]{5f, 1.5f});
        tbl.setSpacingBefore(1f);
        tbl.setSpacingAfter(4f);

        tbl.addCell(celdaEncabezado("Característica requerida", fEncS, AZUL_MEDIO));
        tbl.addCell(celdaEncabezado("Nivel", fEncS, AZUL_MEDIO));

        boolean par = false;
        for (VPuestoCaracteristicasReporte carac : caracs) {
            Color colorFila = par ? AZUL_CLARO : Color.WHITE;
            par = !par;

            PdfPCell cNombre = celdaDato(carac.getCaracteristica(), fCelda, colorFila, Element.ALIGN_LEFT);
            PdfPCell cNivel  = celdaDato(String.valueOf(carac.getNivel()), fNivel, colorFila, Element.ALIGN_CENTER);
            tbl.addCell(cNombre);
            tbl.addCell(cNivel);
        }

        addToDoc(doc, tbl);
        return doc;
    }

    private void agregarParrafo(Document doc, String texto, Font fuente,
                                int alineacion, float espacioAntes) {
        Paragraph p = new Paragraph(texto, fuente);
        p.setAlignment(alineacion);
        if (espacioAntes > 0) p.setSpacingBefore(espacioAntes);
        try {
            doc.add(p);
        } catch (DocumentException e) {
            throw new RuntimeException(e);
        }
    }

    private void agregarPiePagina(Document doc, Font fPie) {
        Paragraph pie = new Paragraph(
                "Generado el " + LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")), fPie);
        pie.setSpacingBefore(10f);
        pie.setAlignment(Element.ALIGN_RIGHT);
        try {
            doc.add(pie);
        } catch (DocumentException e) {
            throw new RuntimeException(e);
        }
    }

    private PdfPCell celdaEncabezado(String texto, Font fuente, Color bgColor) {
        PdfPCell c = new PdfPCell(new Phrase(texto, fuente));
        c.setBackgroundColor(bgColor);
        c.setPadding(6f);
        c.setHorizontalAlignment(Element.ALIGN_CENTER);
        c.setBorder(Rectangle.NO_BORDER);
        return c;
    }

    private PdfPCell celdaDato(String texto, Font fuente, Color bgColor, int alineacion) {
        PdfPCell c = new PdfPCell(new Phrase(texto, fuente));
        c.setBackgroundColor(bgColor);
        c.setPadding(5f);
        c.setHorizontalAlignment(alineacion);
        c.setBorder(Rectangle.BOTTOM);
        c.setBorderColor(BORDE);
        return c;
    }

    private void setWidths(PdfPTable tabla, float[] widths) {
        try {
            tabla.setWidths(widths);
        } catch (DocumentException e) {
            throw new RuntimeException(e);
        }
    }

    private void addToDoc(Document doc, PdfPTable tabla) {
        try {
            doc.add(tabla);
        } catch (DocumentException e) {
            throw new RuntimeException(e);
        }
    }

    private List<Integer> resolverMeses(List<Integer> meses, Boolean todosMeses) {
        List<Integer> resultado = new java.util.ArrayList<>();
        if (Boolean.TRUE.equals(todosMeses)) {
            for (int i = 1; i <= 12; i++) resultado.add(i);
        } else if (meses != null && !meses.isEmpty()) {
            resultado.addAll(meses);
        }
        return resultado;
    }

    private String construirTituloMeses(List<Integer> meses, Boolean todosMeses) {
        if (Boolean.TRUE.equals(todosMeses)) return "Todos los meses";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < meses.size(); i++) {
            int m = meses.get(i);
            sb.append((m >= 1 && m <= 12) ? NOMBRES_MES[m] : "Mes " + m);
            if (i < meses.size() - 1) sb.append(", ");
        }
        return sb.toString();
    }
}