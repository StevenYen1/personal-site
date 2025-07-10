import sys
from dbhelper import get_db_connection

def delete_video(video_id):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute('DELETE FROM "YoutubeVideo" WHERE id = %s', (video_id,))
        conn.commit()
        if cur.rowcount == 0:
            print(f"No video found with id {video_id}")
        else:
            print(f"Deleted video with id {video_id}")
    except Exception as e:
        print(f"Error deleting video: {e}")
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python delete_video.py <video_id>")
        sys.exit(1)

    video_id = sys.argv[1]
    delete_video(video_id)
