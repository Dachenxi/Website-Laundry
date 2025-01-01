import mysql.connector, os
from mysql.connector import Error

host = os.getenv("DB_HOST")
user = os.getenv("DB_USER")
password = os.getenv("DB_PASS")
database = os.getenv("DB_NAME")
port = os.getenv("DB_PORT")

def env():
    data = {
        "host" : os.getenv('DB_HOST'),
        "user" : os.getenv('DB_USER'),
        "password" : os.getenv('DB_PASS'),
        "database" : os.getenv('DB_NAME'),
        "port" : os.getenv('DB_PORT')
    }

    if data['host'] == None or data['user'] == None or data['password'] == None or data['database'] == None or data['port'] == None:
        raise Exception("Environment variable not found | Please make one in \"config/.env\"")
    else:
        return data

def connect_db():
    data = env()
    conn = mysql.connector.connect(
        host = data['host'],
        user = data['user'],
        password = data['password'],
        database = data['database'],
        port = data['port']
    )
    if conn.is_connected():
        cursor = conn.cursor(dictionary=True)
        return conn, cursor
    else:
        raise Exception('Koneksi ke database gagal')

def execute_query(query,*value):

    try:
        db, cursor = connect_db()
        cursor.execute(query, value)

        # Handle SELECT queries
        if query.strip().upper().startswith("SELECT"):
            result = cursor.fetchall()
        else:
            # Commit for non-SELECT queries
            db.commit()
            result = {"message": "Query executed successfully"}

        cursor.close()
        db.close()
        return result
    except Error as e:
        raise Exception(f"Query execution failed: {e}")

connect_db()