# CarbonVault Data Pipeline

**Real-world carbon and emissions data collection from free, public APIs**

## 🎯 Overview

The data pipeline collects verified carbon and emissions data from satellite imagery and IoT sensors, processes it into a standardized format, and stores it for use in the ZK proof system and smart contracts.

Off-chain data pipeline for collecting, processing, and storing real-world carbon emission and reduction data from:
- **Satellite Imagery**: Landsat (NASA/USGS), Planet Labs, Sentinel-2 (ESA)
- **IoT Sensors**: OpenAQ (air quality), NOAA (weather), smart energy meters, industrial monitors

### ✨ Key Features

- **🌍 Real-world data**: Connects to live OpenAQ, NOAA, and Landsat APIs
- **📡 Multi-source**: Satellite imagery + IoT sensors + weather data
- **⚡ No API keys required**: All sources are public (open data)
- **📊 Normalized format**: Standardized data across all sources
- **🔄 Automatic retry**: Resilient to network failures
- **💾 Multiple storage**: JSON, CSV, and SQLite
- **🔍 Data validation**: Quality checks and deduplication
- **📝 Comprehensive logging**: Debug-friendly operation

## 📊 Data Sources

| Source | Type | Coverage | Update Frequency | Cost | Status |
|--------|------|----------|------------------|------|--------|
| **OpenAQ** | Air Quality | 100+ countries | Real-time | ✅ Free | ✅ Live |
| **NOAA** | Weather/Climate | USA + Global | 6-12 hours | ✅ Free | ✅ Live |
| **Landsat** | Satellite | Global | 16-day cycle | ✅ Free | ✅ Live |
| **Energy Meters** | Smart Grid | Custom | Custom | Optional | 🔄 Ready |
| **Industrial** | Emissions | Custom | Custom | Optional | 🔄 Ready |

## 🚀 Quick Start

### 1. Installation

```bash
cd data-pipeline
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Run Pipeline

```bash
# Simple run (fetches global air quality data)
python3 run_pipeline.py

# With location filter (San Francisco area)
python3 -m pipeline.main --lat 37.7749 --lon -122.4194 --radius 50000

# Fetch 30 days of data
python3 -m pipeline.main --days 30
```

### 3. Check Results

```bash
# View collected data
cat data/carbon_data.json | jq '.[0]'

# Import to Excel or Python
python3 -c "import pandas as pd; print(pd.read_csv('data/carbon_data.csv').head())"
```

## 🐳 Docker Deployment

### Run in Docker

```bash
# Build and run pipeline
docker-compose up data-pipeline

# Run with database backend
docker-compose --profile database up

# Stop all services
docker-compose down
```

### Environment Variables

Create `.env` file:
```env
LOG_LEVEL=INFO
POSTGRES_PASSWORD=your_secure_password

# Optional premium APIs
PLANET_LABS_API_KEY=
SENTINEL2_API_KEY=
```

## 📁 Output Files

Pipeline creates three output formats in `data/` directory:

- **`carbon_data.json`** - Full detailed data with metadata
- **`carbon_data.csv`** - Spreadsheet format for analysis
- **`carbon_data.db`** - SQLite database for queries

**Backups** stored in `data/backups/` (keeps last 10 versions)

## 📋 Data Format

All sources normalize to:

```json
{
  "project_id": "air_quality_san-francisco",
  "co2_tons": 0.000045,
  "timestamp": "2024-01-15T14:30:00Z",
  "source": "air_quality_sensor",
  "location": {
    "lat": 37.7749,
    "lon": -122.4194,
    "city": "San Francisco",
    "country": "US"
  },
  "metadata": {
    "parameter": "pm2.5",
    "value": 35.2,
    "unit": "µg/m³"
  }
}
```

## 🔧 Configuration

Edit `config.py` for advanced settings:

```python
class PipelineConfig:
    MAX_RETRIES = 3              # API retry attempts
    REQUESTS_PER_SECOND = 10     # Rate limiting
    BATCH_SIZE = 100             # Process batch size
    LOG_LEVEL = "INFO"           # Logging verbosity
    
class ProcessingConfig:
    MIN_CO2_TONS = 0.01          # Validation threshold
    MAX_CO2_TONS = 1000000       # Validation threshold
```

## 📚 Usage Examples

### Fetch air quality + weather for San Francisco

```bash
python3 -m pipeline.main \
  --lat 37.7749 \
  --lon -122.4194 \
  --days 7 \
  --radius 50000
```

### Schedule daily data collection (Linux/Mac)

```bash
# Edit crontab
crontab -e

# Add this line (runs daily at 3 AM)
0 3 * * * cd /path/to/data-pipeline && python3 run_pipeline.py >> logs/cron.log 2>&1
```

### Integrate with smart contracts

```bash
# 1. Run pipeline
python3 -m pipeline.main --days 1

# 2. Generate ZK proof (requires zk-circuits)
cd ../zk-circuits
node scripts/generate-proof.js

# 3. Submit to blockchain
node scripts/submit-proof.js
```

## 🔗 Data Integration Flow

```
┌─────────────────────────────────────────┐
│     Real-World Data Sources             │
│  OpenAQ | NOAA | Landsat | Custom      │
└────────────────┬────────────────────────┘
                 ↓
         ┌───────────────────┐
         │  Data Pipeline    │
         │  ├─ Fetch         │
         │  ├─ Normalize     │
         │  ├─ Validate      │
         │  └─ Store         │
         └───────────┬───────┘
                     ↓
         ┌───────────────────┐
         │   Data Storage    │
         │  JSON/CSV/SQLite  │
         └───────────┬───────┘
                     ↓
    ┌────────────────────────────────┐
    │   ZK Proof Generation (Circom) │
    └────────────────┬───────────────┘
                     ↓
         ┌───────────────────┐
         │  Smart Contracts  │
         │  ├─ CVTMinting    │
         │  ├─ Marketplace   │
         │  └─ Validator$    │
         └───────────────────┘
```

## 📈 Performance

Typical run metrics (7 days, 1 location):

| Source | Records | Time | Size |
|--------|---------|------|------|
| OpenAQ | 50-200 | 2s | 10 KB |
| NOAA | 14 | 1s | 5 KB |
| Landsat | 0-5 | 3s | 2 KB |
| **Total** | **64-219** | **~6s** | **~17 KB** |

## 🛡️ Data Quality

- ✅ **Validation**: Min/max CO2 thresholds (0.01 - 1,000,000 tons)
- ✅ **Deduplication**: Removes duplicate records
- ✅ **Error handling**: Invalid entries logged & skipped
- ✅ **Retry logic**: Auto-retry failed requests (3 attempts)
- ✅ **Rate limiting**: 10 requests/second

## 🔐 Security

- ✅ All connections use HTTPS
- ✅ No credentials in logs
- ✅ API keys stored in `.env` (not committed)
- ✅ Input validation on all parameters
- ✅ Error messages don't expose system details

## 📚 Additional Documentation

- [Data Sources & API Details](DATA_SOURCES.md) - Complete API documentation
- [OpenAQ API](https://openaq.org) - Air quality data
- [NOAA Weather API](https://weather.gov) - Weather & climate
- [Landsat STAC API](https://landsatlook.usgs.gov) - Satellite imagery

## 🐛 Troubleshooting

### Pipeline returns no data

```bash
# Check logs
tail -f logs/pipeline.log

# Test OpenAQ API
curl "https://api.openaq.org/v2/latest?limit=1"

# Test NOAA API
curl "https://api.weather.gov/gridpoints/MRX/80,131/forecast"
```

### "Invalid location" error

- Ensure lat/lon in correct format: `--lat 37.7749 --lon -122.4194`
- NOAA weather only works for USA coordinates
- Landsat might have no scenes for that date range

### Database connection error

```bash
# Verify PostgreSQL is running
docker-compose --profile database ps

# Check credentials in .env
cat .env
```

### Rate limit exceeded

- Check LOG_LEVEL and adjust REQUESTS_PER_SECOND
- Add delays between runs
- Consider using Docker for background service

## 📦 Project Structure

```
data-pipeline/
├── pipeline/
│   ├── sources/
│   │   ├── satellite.py     # Landsat, Planet Labs, Sentinel-2
│   │   ├── iot_sensors.py   # OpenAQ, NOAA, Energy, Industrial
│   │   └── __init__.py
│   ├── processors/
│   │   ├── normalizer.py    # Data normalization & cleaning
│   │   └── __init__.py
│   ├── storage/
│   │   ├── storage.py       # JSON, CSV, SQLite writers
│   │   └── __init__.py
│   └── main.py              # Pipeline orchestrator
├── config.py                # Configuration settings
├── run_pipeline.py          # Easy entry point
├── requirements.txt         # Python dependencies
├── Dockerfile               # Docker image
├── docker-compose.yml       # Docker services
├── README.md               # This file
└── DATA_SOURCES.md         # API documentation
```

## 🔄 Next Steps

1. **Collect data**: `python3 run_pipeline.py`
2. **Generate ZK proofs**: See [zk-circuits](../zk-circuits/README.md)
3. **Mint CVT tokens**: See [smart contracts](../contracts/)
4. **Trade on marketplace**: See [frontend](../frontend/)

## 📝 License

MIT

## 💡 Support

For issues or questions:
1. Check [DATA_SOURCES.md](DATA_SOURCES.md) for API details
2. Review logs: `tail -f logs/pipeline.log`
3. Test API endpoints directly with `curl`
4. Check network connectivity
