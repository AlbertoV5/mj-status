from datetime import datetime, timedelta
from pathlib import Path
import argparse
import subprocess


if __name__ == "__main__":
    # argument for day offset
    parser = argparse.ArgumentParser()
    parser.add_argument("--offset", type=int, default=0)
    argv = parser.parse_args()
    # download
    print("Downloading data")
    today = (datetime.now() - timedelta(days=argv.offset)).strftime("%Y-%m-%d")
    yesterday = (datetime.now() - timedelta(days=argv.offset + 1)).strftime("%Y-%m-%d")
    # aws s3api get-object --bucket mj-status-feed --key metrics/relax public/metric/relax
    filename = f"{yesterday}_{today}.json"
    subprocess.run(['aws', 's3api', 'get-object', '--bucket', 'mj-status-feed', '--key', f'metrics/relax/{filename}', f'public/metrics/relax/{filename}'])
    ok = Path(f"public/metrics/relax/{filename}").is_file()
    print("All OK" if ok else "Something went wrong")