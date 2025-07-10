"""
Update multiple YouTube videos using a JSON file.

Expected JSON format:
[
  {
    "id": 1,
    "name": "Updated Title",
    "location": "New York"
  },
  {
    "id": 2,
    "date": "2025-08-01T14:00:00",
    "link": "https://youtube.com/new-link"
  }
]

Only the fields present will be updated.

Usage:
    python update_videos.py path/to/updates.json
    python update_videos.py path/to/updates.json --dry-run
"""

import sys
import json
from datetime import datetime
from dbhelper import get_db_connection

ALLOWED_FIELDS = {"name", "date", "link", "location"}

def validate_updates(video_updates):
    parsed = []
    for idx, video in enumerate(video_updates, start=1):
        video_id = video.get("id")
        if not video_id:
            raise ValueError(f"[{idx}] Missing required 'id' field.")

        updates = {}
        for key in ALLOWED_FIELDS:
            if key in video:
                if key == "date":
                    try:
                        updates["date"] = datetime.fromisoformat(video["date"])
                    except ValueError:
                        raise ValueError(f"[{idx}] Invalid date format: '{video['date']}'")
                else:
                    updates[key] = video[key]

        if not updates:
            raise ValueError(f"[{idx}] No valid fields to update.")

        parsed.append((idx, video_id, updates))
    return parsed

def update_videos(parsed_updates, dry_run=False):
    if dry_run:
        print("DRY RUN: The following updates would be made:")
        for idx, video_id, updates in parsed_updates:
            print(f"  - [{idx}] ID {video_id} with fields: {updates}")
        return

    conn = get_db_connection()
    cur = conn.cursor()
    try:
        for idx, video_id, updates in parsed_updates:
            fields = [f"{k} = %s" for k in updates]
            values = list(updates.values())
            values.append(video_id)
            query = f'UPDATE "YoutubeVideo" SET {", ".join(fields)} WHERE id = %s'
            cur.execute(query, values)

            if cur.rowcount == 0:
                raise ValueError(f"[{idx}] No video found with id {video_id}")
            print(f"Updated video [{idx}] ID {video_id}")

        conn.commit()
        print(f"\nSuccessfully updated {len(parsed_updates)} video(s).")
    except Exception as e:
        conn.rollback()
        print(f"\nError during update. Transaction rolled back.")
        print(f"   Reason: {e}")
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    json_path = sys.argv[1]
    dry_run = "--dry-run" in sys.argv

    try:
        with open(json_path, "r", encoding="utf-8") as f:
            updates = json.load(f)
        if not isinstance(updates, list):
            raise ValueError("JSON must be an array of update objects.")
    except Exception as e:
        print(f"Failed to read or parse JSON file: {e}")
        sys.exit(1)

    try:
        parsed_updates = validate_updates(updates)
    except Exception as e:
        print(f"Validation error: {e}")
        sys.exit(1)

    update_videos(parsed_updates, dry_run=dry_run)