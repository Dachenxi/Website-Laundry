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
def tambah_karyawan():
    try:
        data = request.get_json()

        # Validasi input
        required_fields = {
            'namaKaryawan': 'Nama Karyawan',
            'jenisKelamin': 'Jenis Kelamin',
            'alamat': 'Alamat',
            'posisi': 'Posisi',
            'noTelepon': 'No Telepon',
            'email': 'Email'
        }

        # Cek field yang kosong
        missing_fields = [field_name for field, field_name in required_fields.items()
                        if not data.get(field)]

        if missing_fields:
            return jsonify({
                "success": False,
                "pesan": f"Field berikut harus diisi: {', '.join(missing_fields)}"
            }), 400

        # Gunakan parameterized query untuk mencegah SQL injection
        query = """
    INSERT INTO karyawan
    (namaKaryawan, jenisKelamin, Jabatan, alamat, noTelepon, email)
    VALUES (%s, %s, %s, %s, %s, %s)
"""

        result = execute_query(query,
                        data['namaKaryawan'],
                        data['jenisKelamin'],
                        data['posisi'],
                        data['alamat'],
                        data['noTelepon'],
                        data['email'])

        return jsonify({
            "success": True,
            "pesan": "Data karyawan berhasil ditambahkan!"
        }), 201

    except Exception as e:
        # Log error untuk debugging (jangan tampilkan ke user)
        print(f"Error: {str(e)}")
        return jsonify({
            "success": False,
            "pesan": "Terjadi kesalahan saat menambahkan data karyawan"
        }), 500

@app.route('/api/transaksi/add', methods=['POST'])
def tambah_transaksi():
    try:
        data = request.get_json()

        # Validasi input
        required_fields = {
            'namaPelanggan': 'Nama Pelanggan',
            'alamatPelanggan': 'Alamat Pelanggan',
            'noTeleponPelanggan': 'No Telepon Pelanggan',
            'idKaryawan': 'ID Karyawan',
            'hariTransaksi': 'Hari Transaksi',
            'statusTransaksi': 'Status Transaksi',
            'totalHarga': 'Total Harga',
            'uangMuka': 'Uang Muka'
        }
        # Cek field yang kosong
        missing_fields = [field_name for field, field_name in required_fields.items() if not data.get(field)]
        
        if missing_fields:
            return jsonify({
                "success": False,
                "pesan": f"Field berikut harus diisi: {', '.join(missing_fields)}"
            }), 400
        # Tambah pelanggan
        queryPelanggan = """
        INSERT INTO pelanggan (namaPelanggan, alamat, notelepon)
        VALUES (%s, %s, %s)
        RETURNING idPelanggan
        """
        result = execute_query(queryPelanggan,
                        data['namaPelanggan'],
                        data['alamatPelanggan'],
                        data['noTeleponPelanggan'])
        
        # Ambil ID pelanggan yang baru dibuat
        idPelanggan = result[0]['idPelanggan']
        
        # Konfirmasi pelanggan berhasil ditambahkan
        response_pelanggan = {
            "success": True,
            "pesan": "Data pelanggan berhasil ditambahkan",
            "idPelanggan": idPelanggan
        }
        
        # Tambah transaksi
        queryTransaksi = """
        INSERT INTO transaksi (idPelanggan, idKaryawan, waktuTanggal, status, totalHarga, uangMuka)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING idTransaksi
        """
        
        result_transaksi = execute_query(queryTransaksi,
                        idPelanggan,
                        data['idKaryawan'],
                        data['hariTransaksi'],
                        data['statusTransaksi'],
                        data['totalHarga'],
                        data['uangMuka'])
        
        # Konfirmasi transaksi berhasil
        return jsonify({
            "success": True,
            "pesan": "Transaksi berhasil ditambahkan",
            "dataPelanggan": response_pelanggan,
            "idTransaksi": result_transaksi[0]['idTransaksi']
        }), 201
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({
            "success": False,
            "pesan": "Terjadi kesalahan saat menambahkan transaksi"
        }), 500


if __name__ == '__main__':
    app.run(debug=True)