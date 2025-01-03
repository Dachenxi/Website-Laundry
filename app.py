from flask import Flask, jsonify, request, render_template
from flask_cors import CORS

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

if __name__ == '__main__':
    app.run(debug=True)