from dbhelper import get_db_connection

def list_videos():
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute('SELECT id, name, date, link, location FROM "YoutubeVideo" ORDER BY id')
        rows = cur.fetchall()
        for row in rows:
            print(f"ID: {row[0]}, Name: {row[1]}, Date: {row[2]}, Link: {row[3]}, Location: {row[4]}")
    except Exception as e:
        print(f"Error listing videos: {e}")
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    list_videos()
