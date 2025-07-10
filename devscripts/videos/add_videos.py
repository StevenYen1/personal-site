"""
Add multiple YouTube videos from a JSON file in a single atomic transaction.

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
    python add_video.py path/to/videos.json --dry-run
"""

import sys
import json
from datetime import datetime
from dbhelper import get_db_connection

def validate_video_list(video_list):
    parsed = []
    for idx, data in enumerate(video_list, start=1):
        name = data.get("name")
        date_str = data.get("date")
        link = data.get("link")
        location = data.get("location", None)

        if not (name and date_str and link):
            raise ValueError(f"[{idx}] Missing required fields: 'name', 'date', or 'link'.")

        try:
            date = datetime.fromisoformat(date_str)
        except ValueError:
            raise ValueError(f"[{idx}] Invalid date format: '{date_str}'")

        parsed.append({
            "idx": idx,
            "name": name,
            "date": date,
            "link": link,
            "location": location
        })

    return parsed

def insert_videos(parsed_videos, dry_run=False):
    if dry_run:
        print("DRY RUN: The following videos would be inserted:")
        for v in parsed_videos:
            print(f"  - [{v['idx']}] {v['name']} ({v['link']})")
        return

    conn = get_db_connection()
    cur = conn.cursor()
    try:
        for v in parsed_videos:
            cur.execute("""
                INSERT INTO "YoutubeVideo" (name, date, link, location)
                VALUES (%s, %s, %s, %s)
            """, (v["name"], v["date"], v["link"], v["location"]))

        conn.commit()
        print(f"\nSuccessfully inserted {len(parsed_videos)} video(s).")
    except Exception as e:
        conn.rollback()
        print(f"\nError during insertion. Transaction rolled back.")
        print(f"   Reason: {e}")
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    json_path = sys.argv[1]
    dry_run = "--dry-run" in sys.argv

    try:
        with open(json_path, "r", encoding="utf-8") as f:
            videos = json.load(f)
        if not isinstance(videos, list):
            raise ValueError("JSON root must be an array of video objects.")
    except Exception as e:
        print(f"Failed to read or parse JSON file: {e}")
        sys.exit(1)

    try:
        parsed_videos = validate_video_list(videos)
    except Exception as e:
        print(f"Validation error: {e}")
        sys.exit(1)

    insert_videos(parsed_videos, dry_run=dry_run)