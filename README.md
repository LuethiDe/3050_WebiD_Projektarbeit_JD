# 3050_WebiD_Projektarbeit_JD

## Einleitung

Dieses Projekt wurde im Rahmen des Moduls Webentwicklung und Datenbanken (3050_WebiD) entwickelt. Ziel ist die Umsetzung einer Webanwendung, die Frontend und Backend kombiniert. Die Anwendung ermöglicht die Visualisierung von Fussgängerzählungen auf Basis realer Datensätze.

## Fragestellung

Fokusfragestellung: Wie beeinflussen unterschiedliche Wetterbedingungen die stündliche Passantenfrequenz an ausgewählten Standorten?

## Features

- Automatischer Import und Verarbeitung von CSV-Daten (Fussgängerzählungen)
- REST API zur strukturierten Bereitstellung der Daten
- Interaktive Visualisierung (Diagramme, Karten, Filter)
- Responsive, moderne Benutzeroberfläche
- Standort- und Zeitfilterung der Daten
- Trennung von Frontend und Backend

## Technologie-Stack und Versionen

### Frontend

(Basis für das Frontend)
- **React**: ^19.2.0
- **Vite**: ^7.2.4
- **@vitejs/plugin-react**: ^5.1.1

(User interface)
- **@mui/material** (Material UI): ^7.3.6
- **@emotion/react**: ^11.14.0
- **@emotion/styled**: ^11.14.1
- **@mui/x-date-pickers**: ^8.22.1
- **dayjs**: ^1.11.19

(Kartenansicht)
- **react-leaflet**: ^5.0.0
- **leaflet**: ^1.9.4

(Diagramm)
- **vega**: ^6.2.0, **vega-lite**: ^6.4.1, **vega-embed**: ^7.1.0

### Backend

- **Python**: >=3.10 (empfohlen)
- **FastAPI**: >=0.100 (empfohlen)
- **Pandas**: >=2.0 (empfohlen)

## API Erklärung

Das Backend stellt eine REST API bereit, über die das Frontend auf die verarbeiteten Daten zugreifen kann. Die wichtigsten Endpunkte sind:

- **GET `/api/v1/pedData?ort=<name>&datum=<YYYY-MM-DD>&zone=<zone>`**
	- Liefert Fussgängerzählungen für einen Ort, ein Datum und optional eine Zone (z.B. 1, 2, 3 oder "all").
	- Rückgabe: Liste von Objekten mit Zeit, Wetter, Zählwerten etc.

- **GET `/api/v1/Locations?datum=<YYYY-MM-DD>`**
	- Gibt alle verfügbaren Standorte für ein bestimmtes Datum zurück.

Die API verarbeitet Anfragen, liest die CSV-Daten ein, bereitet sie auf und gibt sie als JSON zurück. CORS ist für `localhost:5173` aktiviert.

## Datenquelle

Die Daten stammen aus öffentlichen Passantenfrequenz-Messungen der Stadt Zürich und enthält vier Standorte entlang der Bahnhofstrasse (URL: https://data.stadt-zuerich.ch/dataset/hystreet_fussgaengerfrequenzen). Diese enthält Zeitreihen von Fussgängerzählungen, Wetterdaten und weitere Attribute. Die Datei wird beim Start des Backends automatisch geladen und verarbeitet.

## Autoren

- Jan Hänisch
- Denis Lüthi