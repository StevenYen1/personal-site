
"""
Requires a few packages:

pip install psycopg2-binary
pip install python-dotenv
"""

import os
import psycopg2
from urllib.parse import urlparse
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).parent.parent.parent / 'server' / '.env'
load_dotenv(dotenv_path=env_path)

def get_db_connection():
    DATABASE_URL = os.getenv("DATABASE_URL")
    if not DATABASE_URL:
        raise ValueError("DATABASE_URL not set in environment")

    result = urlparse(DATABASE_URL)
    username = result.username
    password = result.password
    database = result.path[1:]  # skip leading '/'
    hostname = result.hostname
    port = result.port or 5432

    conn = psycopg2.connect(
        dbname=database,
        user=username,
        password=password,
        host=hostname,
        port=port
    )
    return conn
