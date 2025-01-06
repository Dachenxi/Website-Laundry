import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os

def env():
    load_dotenv("./config/.env")
    required_vars = {
        'DB_HOST': 'host',
        'DB_USER': 'user',
        'DB_PASS': 'password',
        'DB_NAME': 'database',
        'DB_PORT': 'port'
    }

    data = {key: os.getenv(env_var) for env_var, key in required_vars.items()}

    missing_vars = [env_var for env_var, key in required_vars.items() if not os.getenv(env_var)]
    if missing_vars:
        raise Exception(f"Missing environment variables: {', '.join(missing_vars)}")

    return data

def connect_db():
    try:
        data = env()
        conn = mysql.connector.connect(**data)

        if not conn.is_connected():
            raise Exception('Failed to establish database connection')

        cursor = conn.cursor(dictionary=True)
        return conn, cursor
    except Error as e:
        raise Exception(f"Database connection error: {str(e)}")

def execute_query(query, *params):
    conn = None
    cursor = None
    try:
        conn, cursor = connect_db()

        cursor.execute(query, params)

        if query.strip().upper().startswith("SELECT"):
            result = cursor.fetchall()
            return result
        else:
            conn.commit()
            return 'success'

    except Error as e:
        if conn:
            conn.rollback()  # Rollback pada kasus error
        raise Exception(f"Query execution failed: {str(e)}")

    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()