"""
Add multiple YouTube videos from a JSON file.

Expected JSON file format:
[
  {
    "name": "My Video 1",
    "date": "2025-07-10T12:00:00",  # ISO 8601 format
    "link": "https://youtube.com/xyz1",
    "location": "Japan"              # optional
  },
  {
    "name": "My Video 2",
    "date": "2025-07-11",
    "link": "https://youtube.com/xyz2"
  }
]

Usage:
    python add_video.py path/to/videos.json
"""

import sys
import json
from datetime import datetime
from dbhelper import get_db_connection

def add_videos_from_list(video_list):
    conn = get_db_connection()
    cur = conn.cursor()

    for idx, data in enumerate(video_list, start=1):
        name = data.get("name")
        date_str = data.get("date")
        link = data.get("link")
        location = data.get("location", None)

        if not (name and date_str and link):
            print(f"Skipping video #{idx}: missing required fields 'name', 'date', or 'link'")
            continue

        try:
            date = datetime.fromisoformat(date_str)
        except ValueError:
            print(f"Skipping video #{idx}: invalid date format '{date_str}'")
            continue

        try:
            cur.execute("""
                INSERT INTO "YoutubeVideo" (name, date, link, location)
                VALUES (%s, %s, %s, %s)
            """, (name, date, link, location))
            print(f"Added video #{idx}: {name}")
        except Exception as e:
            print(f"Error adding video #{idx} '{name}': {e}")

    conn.commit()
    cur.close()
    conn.close()
    print("Done processing videos.")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python add_video.py path/to/videos.json")
        sys.exit(1)

    json_path = sys.argv[1]

    try:
        with open(json_path, "r", encoding="utf-8") as f:
            videos = json.load(f)
        if not isinstance(videos, list):
            raise ValueError("JSON root must be an array of video objects.")
    except Exception as e:
        print(f"Failed to read or parse JSON file: {e}")
        sys.exit(1)

    add_videos_from_list(videos)
