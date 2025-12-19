# Importieren notwendiger Bibliotheken
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os

# FastAPI App initialisieren
app = FastAPI()

# CORS Middleware konfigurieren
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# CORS Middleware hinzufügen
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET"], # Nur GET-Anfragen erlauben
    allow_headers=["*"], # Alle Header erlauben
)
# CSV-Dateipfad definieren
csv_pfad = os.path.join(os.path.dirname(__file__), "Gesamtdatensatz.csv")
DF_PED = None  # Globaler DataFrame für die Pedestrian-Daten

# Relevante Spalten definieren
RELEVANT_COLS = [
    "timestamp",
    "location_name",
    "weather_condition",
    "temperature",
    "pedestrians_count",
    "ltr_pedestrians_count",
    "rtl_pedestrians_count",
    "adult_ltr_pedestrians_count",
    "adult_rtl_pedestrians_count",
    "child_ltr_pedestrians_count",
    "child_rtl_pedestrians_count",
    "rtl_label",
    "ltr_label",
    "collection_type",
    "zone_1_ltr_pedestrians_count",
    "zone_1_rtl_pedestrians_count",
    "zone_2_ltr_pedestrians_count",
    "zone_2_rtl_pedestrians_count",
    "zone_3_ltr_pedestrians_count",
    "zone_3_rtl_pedestrians_count",
]

# Funktion zum Laden und Vorbereiten des Datensatzes
def load_and_prepare_dataset():
    global DF_PED # Zugriff auf die globale Variable

    df_raw = pd.read_csv(csv_pfad)   # Datensatz laden
    df = df_raw[RELEVANT_COLS].copy()   # Relevante Spalten behalten

    df["timestamp"] = pd.to_datetime(df["timestamp"], utc=True, errors="coerce") # Zeitstempel konvertieren
    df = df.dropna(subset=["timestamp"]) # Zeilen mit ungültigen Zeitstempeln entfernen

    df["date"] = df["timestamp"].dt.date # Datum extrahieren
    df["hour"] = df["timestamp"].dt.hour # Stunde extrahieren

    DF_PED = df # Globalen DataFrame setzen
    print(f"[startup] Datensatz geladen: {len(DF_PED)} Zeilen")

# Startup-Ereignis zum Laden des Datensatzes
@app.on_event("startup")
def startup_event():
    load_and_prepare_dataset()

# API-Endpunkt zum Abrufen der Pedestrian-Daten
@app.get("/api/v1/pedData")
def get_pedData(ort: str, datum: str, zone: str = "all"):
    df = DF_PED

    datum_date = pd.to_datetime(datum).date()
    df_filtered = df.query("location_name == @ort and date == @datum_date").copy() # Filtern nach Ort und Datum

    if zone != "all": # Nach Zone filtern, wenn angegeben
        ltr_col = "zone_" + zone + "_ltr_pedestrians_count"
        rtl_col = "zone_" + zone + "_rtl_pedestrians_count"
        df_filtered["ltr_pedestrians_count"] = df_filtered[ltr_col]
        df_filtered["rtl_pedestrians_count"] = df_filtered[rtl_col]
        df_filtered["pedestrians_count"] = (
            df_filtered["ltr_pedestrians_count"] + df_filtered["rtl_pedestrians_count"]
        )
    
    # Differenz zwischen LTR und RTL berechnen
    df_filtered["ltr_rtl_diff"] = (
        df_filtered["ltr_pedestrians_count"] - df_filtered["rtl_pedestrians_count"]
    ).abs()

    # Nach Stunde sortieren
    df_filtered = df_filtered.sort_values("hour")

    # Relevante Spalten für die Ausgabe auswählen
    cols_out = [
        "timestamp",
        "date",
        "hour",
        "location_name",
        "ltr_label",
        "rtl_label",
        "weather_condition",
        "temperature",
        "collection_type",
        "pedestrians_count",
        "ltr_pedestrians_count",
        "rtl_pedestrians_count",
        "ltr_rtl_diff",
        "adult_ltr_pedestrians_count",
        "adult_rtl_pedestrians_count",
        "child_ltr_pedestrians_count",
        "child_rtl_pedestrians_count",
    ]

    return df_filtered[cols_out].to_dict(orient="records")

# API-Endpunkt zum Abrufen der verfügbaren Standorte für ein bestimmtes Datum
@app.get("/api/v1/Locations")
def get_locations(datum: str):
    df = DF_PED # Zugriff auf den globalen DataFrame
    datum_date = pd.to_datetime(datum).date()

    df_location = df.query("date == @datum_date").copy() # Nach Datum filtern
    df_location = df_location[df_location["collection_type"] == "measured"] # Einträge ohne Messwerte entfernen
    df_location = df_location.drop_duplicates(subset=["date", "location_name"]) # Duplikate entfernen

    # Nach Datum gruppieren und Standorte als Liste sammeln
    grouped = (
        df_location.groupby("date")["location_name"]
        .apply(list)
        .reset_index(name="locations")
    )

    return grouped.to_dict(orient="records")