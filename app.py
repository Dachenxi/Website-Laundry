from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from config import execute_query

app = Flask(__name__,)
CORS(app)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/transaksi')
def transaksi():
    return render_template('transaksi.html')

@app.route('/karyawan')
def karyawan():
    return render_template('karyawan.html')

@app.route('/pelanggan')
def barang():
    return render_template('pelanggan.html')

@app.route('/api/karyawan', methods=['GET'])
def data_karyawan():
    query = "SELECT * FROM karyawan"
    try:
        data = execute_query(query)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)