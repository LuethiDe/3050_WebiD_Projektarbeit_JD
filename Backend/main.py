from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)
csv_pfad = os.path.join(os.path.dirname(__file__), "Gesamtdatensatz.csv")
DF_PED = None

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

def load_and_prepare_dataset():
    global DF_PED

    df_raw = pd.read_csv(csv_pfad)
    df = df_raw[RELEVANT_COLS].copy()

    df["timestamp"] = pd.to_datetime(df["timestamp"], utc=True, errors="coerce")
    df = df.dropna(subset=["timestamp"])

    df["date"] = df["timestamp"].dt.date
    df["hour"] = df["timestamp"].dt.hour

    DF_PED = df
    print(f"[startup] Datensatz geladen: {len(DF_PED)} Zeilen")

@app.on_event("startup")
def startup_event():
    load_and_prepare_dataset()

@app.get("/api/v1/pedData")
def get_pedData(ort: str, datum: str, zone: str = "all"):
    df = DF_PED

    datum_date = pd.to_datetime(datum).date()
    df_filtered = df.query("location_name == @ort and date == @datum_date").copy()

    if zone != "all":
        ltr_col = "zone_" + zone + "_ltr_pedestrians_count"
        rtl_col = "zone_" + zone + "_rtl_pedestrians_count"
        df_filtered["ltr_pedestrians_count"] = df_filtered[ltr_col]
        df_filtered["rtl_pedestrians_count"] = df_filtered[rtl_col]
        df_filtered["pedestrians_count"] = (
            df_filtered["ltr_pedestrians_count"] + df_filtered["rtl_pedestrians_count"]
        )

    df_filtered["ltr_rtl_diff"] = (
        df_filtered["ltr_pedestrians_count"] - df_filtered["rtl_pedestrians_count"]
    ).abs()

    df_filtered = df_filtered.sort_values("hour")

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

@app.get("/api/v1/Locations")
def get_locations(datum: str):
    df = DF_PED
    datum_date = pd.to_datetime(datum).date()

    df_location = df.query("date == @datum_date").copy()
    df_location = df_location[df_location["collection_type"] == "measured"]
    df_location = df_location.drop_duplicates(subset=["date", "location_name"])

    grouped = (
        df_location.groupby("date")["location_name"]
        .apply(list)
        .reset_index(name="locations")
    )

    return grouped.to_dict(orient="records")