from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from config import execute_query
from datetime import datetime


app = Flask(__name__,)
CORS(app)

@app.after_request
def add_header(response):
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response

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

@app.route('/api/pelanggan', methods=['GET'])
def get_pelanggan():
    try:
        query = "SELECT * FROM pelanggan"
        pelanggan = "SELECT count(*) as total FROM pelanggan"
        banyakPelanggan = execute_query(pelanggan)
        data = execute_query(query)
        result = {
            "datapelanggan": data,
            "banyakPelanggan":banyakPelanggan[0]['total']
        }
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/api/karyawan', methods=['GET'])
def get_karyawan():
    try:
        karyawan = "SELECT * FROM karyawan"
        dataKaryawan = execute_query(karyawan)
        karyawanLaki = "SELECT count(jenisKelamin) as laki_laki FROM karyawan WHERE jenisKelamin = 'laki-laki'"
        totallaki = execute_query(karyawanLaki)
        karyawanPerempuan = "SELECT count(jenisKelamin) as perempuan FROM karyawan WHERE jenisKelamin = 'perempuan'"
        totalperempuan = execute_query(karyawanPerempuan)
        result = {
            "dataKaryawan": dataKaryawan,
            "karyawan": {
                "total": f"{totallaki[0]['laki_laki']+totalperempuan[0]['perempuan']}",
                "laki_laki": totallaki[0]['laki_laki'],
                "perempuan": totalperempuan[0]['perempuan']
            }
        }
        print(jsonify(result))
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/api/transaksi', methods=['GET'])
def get_transaksi():
    harini = datetime.today()
    formatted_today = harini.strftime('%Y-%m-%d')
    qdatatransaksi = r"SELECT idTransaksi, idPelanggan, idKaryawan, DATE_FORMAT(CONVERT_TZ(waktuTanggal, '+00:00', 'Asia/Jakarta'),'%Y-%m-%d') as tanggal, status, totalHarga, uangMuka FROM transaksi"
    qtransaksihariini = f"SELECT count(*) as transaksihariini FROM transaksi WHERE DATE_FORMAT(CONVERT_TZ(waktuTanggal, '+00:00', 'Asia/Jakarta'),'%Y-%m-%d') = {formatted_today}"
    qtotaltransaksi = r"SELECT count(*) as total FROM transaksi"
    try:
        datatransaksi = execute_query(qdatatransaksi)
        transaksihariini =  execute_query(qtransaksihariini)
        totaltransaksi =  execute_query(qtotaltransaksi)
        result = {
            "dataTransaksi": datatransaksi,
            "transaksi":{
                "hariini":transaksihariini[0]['transaksihariini'],
                "totalTransaksi":totaltransaksi[0]['total']
            }
        }
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/api/karyawan/add', methods=['POST'])
def add_karyawan():
    data = request.get_json()
    namaKaryawan = data.get('namaKaryawan')
    jenisKelamin = data.get('jenisKelamin')
    alamat = data.get('alamat')
    posisi = data.get('posisi')
    noTelepon = data.get('noTelepon')
    email = data.get('email')
    print(namaKaryawan, jenisKelamin, alamat, posisi, noTelepon, email)
    if not all([namaKaryawan, jenisKelamin, alamat, posisi, noTelepon, email]):
        return jsonify({"success": False, "pesan": "Semua data harus diisi!"}), 400
    query = f"""
        INSERT INTO karyawan (namaKaryawan, jenisKelamin, Jabatan, alamat, noTelepon, email)
        VALUES ('{namaKaryawan}', '{jenisKelamin}', '{posisi}', '{alamat}', '{noTelepon}', '{email}')
    """
    try:
        hasil = execute_query(query)
        print(hasil)
        return jsonify({"success": True, "pesan": "Data karyawan berhasil ditambahkan!"}), 201
    except Exception as e:
        return jsonify({"success": False, "pesan": f"{str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)