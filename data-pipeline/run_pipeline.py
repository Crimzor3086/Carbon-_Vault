#!/usr/bin/env python3
"""
Real-world data pipeline runner
Collects actual carbon data from OpenAQ, NOAA, and Landsat
"""
import sys
from pathlib import Path
from loguru import logger

# Add parent directory to path
parent_dir = Path(__file__).parent
sys.path.insert(0, str(parent_dir))

from pipeline.main import DataPipeline


def main():
    """Run the data pipeline with real-world data"""
    
    # Configure logging
    logger.remove()  # Remove default handler
    logger.add(sys.stdout, format="<level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>")
    
    print("\n" + "="*60)
    print("CarbonVault Data Pipeline - Real-World Data Collection")
    print("="*60 + "\n")
    
    try:
        pipeline = DataPipeline()
        
        # Example 1: Fetch air quality data for San Francisco
        print("📍 Fetching air quality data (OpenAQ)...")
        logger.info("Starting data collection")
        
        location = {
            "city": "San Francisco",
            "country": "US",
            "lat": 37.7749,
            "lon": -122.4194
        }
        
        data = pipeline.run(days_back=7, location=location)
        
        if data:
            print(f"\n✅ Pipeline completed successfully!")
            print(f"📊 Processed {len(data)} records\n")
            
            # Display summary
            total_co2 = sum(record.get("co2_tons", 0) for record in data)
            sources = set(record.get("source", "unknown") for record in data)
            
            print(f"📈 Summary:")
            print(f"   Total CO2 equivalent: {total_co2:.4f} tons")
            print(f"   Data sources: {', '.join(sources)}")
            print(f"   Records per source:")
            
            for source in sources:
                count = len([r for r in data if r.get("source") == source])
                print(f"      - {source}: {count} records")
            
            # Show sample records
            print(f"\n📋 Sample records (first 3):")
            for i, record in enumerate(data[:3], 1):
                print(f"\n   Record {i}:")
                print(f"      Project ID: {record.get('project_id')}")
                print(f"      CO2 (tons): {record.get('co2_tons'):.6f}")
                print(f"      Source: {record.get('source')}")
                print(f"      Timestamp: {record.get('timestamp')}")
        else:
            print("⚠️  No data collected from pipeline")
        
    except Exception as e:
        logger.error(f"Pipeline failed: {e}")
        sys.exit(1)
    
    print("\n" + "="*60)
    print("✨ Data collection complete!")
    print("="*60 + "\n")


if __name__ == "__main__":
    main()

