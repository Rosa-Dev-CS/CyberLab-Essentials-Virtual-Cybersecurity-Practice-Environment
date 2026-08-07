import sqlite3
import os

DATABASE_PATH = os.path.join(os.path.dirname(__file__), 'cyberlab.db')

def get_db_connection():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    schema_path = os.path.join(os.path.dirname(__file__), 'schema.sql')
    with open(schema_path, 'r') as f:
        schema_sql = f.read()
    
    conn = get_db_connection()
    try:
        conn.executescript(schema_sql)
        conn.commit()
    except Exception as e:
        print(f"Error initializing database: {e}")
    finally:
        conn.close()

# Progress management
def get_progress():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT item_key, completed FROM progress")
    rows = cursor.fetchall()
    conn.close()
    return {row['item_key']: row['completed'] for row in rows}

def update_progress(item_key, completed):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO progress (item_key, completed, updated_at)
        VALUES (?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(item_key) DO UPDATE SET
            completed = excluded.completed,
            updated_at = CURRENT_TIMESTAMP
    """, (item_key, 1 if completed else 0))
    conn.commit()
    conn.close()

# Fetch overall stats for dashboard
def get_stats():
    # We define a static list of keys to measure overall progress.
    # If keys don't exist in DB, they count as 0/not completed.
    installation_keys = [
        'setup_vbox', 'setup_kali', 'setup_win', 'setup_meta', 'setup_network', 'setup_snapshots'
    ]
    lab_keys = [
        'lab_discovery', 'lab_ports', 'lab_wireshark', 'lab_vulnweb', 'lab_linux_admin', 'lab_docs'
    ]
    tool_keys = [
        'tool_nmap', 'tool_wireshark', 'tool_burp', 'tool_nikto', 'tool_gobuster', 'tool_netcat', 'tool_metasploit'
    ]
    linux_keys = [
        'linux_file_mgmt', 'linux_user_mgmt', 'linux_perms', 'linux_proc_mgmt', 'linux_network_cmd', 'linux_pkg_mgmt'
    ]
    networking_keys = [
        'net_ip', 'net_subnet', 'net_dhcp', 'net_static', 'net_routing', 'net_dns', 'net_hostonly', 'net_nat', 'net_bridge'
    ]
    
    all_tracked = installation_keys + lab_keys + tool_keys + linux_keys + networking_keys
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT item_key, completed FROM progress WHERE completed = 1")
    completed_rows = cursor.fetchall()
    conn.close()
    
    completed_keys = {row['item_key'] for row in completed_rows}
    
    # Calculate completions
    completed_labs_count = sum(1 for k in lab_keys if k in completed_keys)
    completed_total = len(completed_keys)
    total_items = len(all_tracked)
    progress_percent = int((completed_total / total_items) * 100) if total_items > 0 else 0
    
    return {
        'progress_percent': min(progress_percent, 100),
        'completed_labs': completed_labs_count,
        'total_labs': len(lab_keys),
        'completed_items': completed_total,
        'total_items': total_items,
        'completed_keys': list(completed_keys)
    }

# Notes management
def get_all_notes():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT n.*, COUNT(s.id) as screenshot_count 
        FROM notes n 
        LEFT JOIN screenshots s ON n.id = s.note_id 
        GROUP BY n.id 
        ORDER BY n.updated_at DESC
    """)
    notes = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return notes

def get_note(note_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM notes WHERE id = ?", (note_id,))
    note_row = cursor.fetchone()
    if not note_row:
        conn.close()
        return None
    
    note = dict(note_row)
    cursor.execute("SELECT id, file_path FROM screenshots WHERE note_id = ?", (note_id,))
    note['screenshots'] = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return note

def create_note(title, content):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO notes (title, content, created_at, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
        (title, content)
    )
    note_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return note_id

def update_note(note_id, title, content):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE notes SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        (title, content, note_id)
    )
    conn.commit()
    conn.close()

def delete_note(note_id):
    # Screenshots file cleanup should be done separately on filesystem before deletion or inside app.py
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM notes WHERE id = ?", (note_id,))
    conn.commit()
    conn.close()

def add_screenshot_to_note(note_id, file_path):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO screenshots (note_id, file_path) VALUES (?, ?)",
        (note_id, file_path)
    )
    screenshot_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return screenshot_id

def get_screenshot(screenshot_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM screenshots WHERE id = ?", (screenshot_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def delete_screenshot(screenshot_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM screenshots WHERE id = ?", (screenshot_id,))
    conn.commit()
    conn.close()
